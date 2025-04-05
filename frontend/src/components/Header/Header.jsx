// src/components/Header.jsx
import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Header() {
  const { isLoggedIn, logout, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // вызывает apiLogout и setIsLoggedIn(false)
    navigate("/login");
  };

  useEffect(() => {
    const syncLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token); // синхронизировать при изменении в других вкладках
    };

    window.addEventListener("storage", syncLoginStatus);
    return () => window.removeEventListener("storage", syncLoginStatus);
  }, [setIsLoggedIn]);

  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Аукцион</h1>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Link to="/profile">Профиль</Link>
            <Link to="/my-auctions">Мои аукционы</Link>
            <Link to="/my-bids">Мои заявки</Link>
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Войти</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </div>
    </header>
  );
}
