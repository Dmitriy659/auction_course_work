// src/pages/CreateAuction.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAuction } from "../../api";
import "./CreateAuction.css";

export default function CreateAuction() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    const auctionData = {
      title,
      description,
      starting_price: startingPrice,
      current_price: startingPrice,
      city,
      image,
    };

    const response = await createAuction(auctionData);
    if (response) {
      navigate("/my-auctions");
    }
    else {
        setError("Не удалось создать аукцион. Проверьте данные и попробуйте еще раз.");
    }
  };

  return (
    <div className="create-auction-container">
      <h2 className="page-title">Создать аукцион</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleCreateAuction} className="auction-form">
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-input"
        />
        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="form-textarea"
        />
        <input
          type="number"
          placeholder="Начальная цена"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="text"
          placeholder="Город"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
          className="form-input-file"
        />
        <button type="submit" className="submit-button">Создать</button>
      </form>
    </div>
  )
}
