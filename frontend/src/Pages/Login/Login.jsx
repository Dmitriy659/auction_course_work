// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/");
    } catch (error) {
      alert("Ошибка входа");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Войти</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Войти</button>
      </form>
      <div className="login-reset">
        <a href="https://backend-production-6917.up.railway.app/password_reset/">Забыли пароль?</a>
      </div>
    </div>
  );
}
