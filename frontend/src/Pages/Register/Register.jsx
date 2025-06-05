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
        <input
          type="email"
          placeholder="Email*"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Имя пользователя*"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Имя*"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Фамилия*"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Город*"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Телефон"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Телеграм"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль*"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="register-button">
          Зарегистрироваться
        </button>
      </form>
      {errorMessage && <div className="register-error">{errorMessage}</div>}
    </div>
  );
}
