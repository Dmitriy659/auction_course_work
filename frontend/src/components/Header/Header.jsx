// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const refreshAuthToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Нет refresh токена");

        const response = await fetch("http://localhost:8000/api/v1/token/refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.access);
            window.dispatchEvent(new Event("storage")); // Обновляем Header
        } else {
            handleLogout(); // Если рефреш не сработал, разлогиниваем
        }
    } catch (error) {
        console.error("Ошибка обновления токена:", error);
        handleLogout();
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        setIsLoggedIn(false);
        return;
    }

    const response = await fetch("http://localhost:8000/api/v1/protected-endpoint/", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        await refreshAuthToken();
    } else {
        setIsLoggedIn(true);
    }
  };

  useEffect(() => {
      checkAuth();
      window.addEventListener("storage", checkAuth);

      return () => {
          window.removeEventListener("storage", checkAuth);
      };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

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
