// src/components/Header.jsx
import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Header.css";


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
    <header className="header">
      <div className="header__title-container">
        <Link to="/">
          <img src="/logo.jpg" alt="Аукцион" className="header__icon" />
        </Link>
        <h1 className="header__title">Аукцион</h1>
      </div>
      <div className="header__nav">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="header__link">Профиль</Link>
            <Link to="/my-auctions" className="header__link">Мои аукционы</Link>
            <Link to="/my-bids" className="header__link">Мои заявки</Link>
            <button onClick={handleLogout} className="header__button">Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login" className="header__link">Войти</Link>
            <Link to="/register" className="header__link">Регистрация</Link>
          </>
        )}
      </div>
    </header>


  );
}
