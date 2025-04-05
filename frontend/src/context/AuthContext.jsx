import React, { createContext, useState, useEffect } from "react";
import { logout as apiLogout } from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginCheck = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  const logout = () => {
    setIsLoggedIn(false);
    apiLogout();
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
