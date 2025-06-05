import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import { logout as apiLogout } from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginCheck = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    try {
      const { exp } = jwtDecode(token);
      if (exp * 1000 < Date.now()) {
        // Токен просрочен
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setIsLoggedIn(false);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    apiLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    loginCheck();
    window.addEventListener("storage", loginCheck);
    return () => window.removeEventListener("storage", loginCheck);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
