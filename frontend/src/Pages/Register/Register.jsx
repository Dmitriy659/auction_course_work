// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api";
import "./Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [telephone, setTelephone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ email, username, password, first_name, last_name, city, telephone, telegram });
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Регистрация</h2>
      <form onSubmit={handleRegister} className="register-form">
      <div className="form-group">
        <label htmlFor="email">Email*</label>
        <input
          id="email"
          type="email"
          placeholder="Введите ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="username">Имя пользователя*</label>
        <input
          id="username"
          type="text"
          placeholder="Придумайте имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="first_name">Имя*</label>
        <input
          id="first_name"
          type="text"
          placeholder="Введите ваше имя"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="last_name">Фамилия*</label>
        <input
          id="last_name"
          type="text"
          placeholder="Введите вашу фамилию"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="city">Город*</label>
        <input
          id="city"
          type="text"
          placeholder="Введите ваш город"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="telephone">Телефон</label>
        <input
          id="telephone"
          type="text"
          placeholder="Введите ваш телефон"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="telegram">Телеграм</label>
        <input
          id="telegram"
          type="text"
          placeholder="Введите ваш телеграм"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Пароль*</label>
        <input
          id="password"
          type="password"
          placeholder="Придумайте пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="register-button">
        Зарегистрироваться
      </button>
    </form>
      {errorMessage && <div className="register-error">{errorMessage}</div>}
    </div>
  );
}
