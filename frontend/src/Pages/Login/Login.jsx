import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLoginButton = async (e) => {
    e.preventDefault();
    try {
      const result = await login(username, password);
      
      if (!result?.access || !result?.refresh) {
        setErrorMessage("Ошибка авторизации");
        return;
      }

      navigate("/"); // только если всё успешно
      console.trace("navigate('/') вызван после успешного логина");
    } catch (error) {
      setErrorMessage(error.message || "Ошибка входа");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Войти</h2>
      <form onSubmit={handleLoginButton} className="login-form">
      <div className="form-group">
        <label htmlFor="login-username">Имя пользователя*</label>
        <input
          id="login-username"
          type="text"
          placeholder="Введите ваше имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Пароль*</label>
        <input
          id="login-password"
          type="password"
          placeholder="Введите ваш пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="login-button">
        Войти
      </button>

      {errorMessage && (
        <div className="login-error">{errorMessage}</div>
      )}
    </form>
      <div className="login-reset">
        <a href="https://backend-production-6917.up.railway.app/password_reset/">Забыли пароль?</a>
      </div>
    </div>
  );
}
