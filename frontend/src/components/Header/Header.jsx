// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkAuth, refreshAuthToken } from "../../api"; // Импортируем функции

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        setIsLoggedIn(true);
      } else {
        await refreshAuthToken();
        const isAuthenticatedAfterRefresh = await checkAuth();
        setIsLoggedIn(isAuthenticatedAfterRefresh);
      }
    };

    verifyAuth();
    window.addEventListener("storage", verifyAuth);

    return () => {
      window.removeEventListener("storage", verifyAuth);
    };
  }, []);

  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between">
      <h1 className="text-xl font-bold">Аукцион</h1>
      <div>
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="mr-4">Профиль</Link>
            <Link to="/my-auctions" className="mr-4">Мои аукционы</Link>
            <Link to="/my-bids">Мои заявки</Link>
            <button onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Войти</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </div>
    </header>
  );
}
