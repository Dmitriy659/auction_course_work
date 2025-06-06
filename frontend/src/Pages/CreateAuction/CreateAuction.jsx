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
      <div className="form-group">
        <label htmlFor="auction-title">Название лота*</label>
        <input
          id="auction-title"
          type="text"
          placeholder="Введите название лота"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="auction-description">Описание лота*</label>
        <textarea
          id="auction-description"
          placeholder="Подробно опишите лот, его состояние и особенности"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="auction-starting-price">Начальная цена, ₽*</label>
        <div className="price-input-container">
          <input
            id="auction-starting-price"
            type="number"
            placeholder="0"
            min="0"
            step="0.01"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            required
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="auction-city">Город*</label>
        <input
          id="auction-city"
          type="text"
          placeholder="Введите город нахождения лота"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="auction-image">Изображение лота*</label>
        <input
          id="auction-image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
          className="form-input-file"
        />
        <p className="file-hint">Загрузите основное изображение лота (JPG, PNG или GIF)</p>
      </div>

      <button type="submit" className="submit-button">
        Создать аукцион
      </button>
    </form>
    </div>
  )
}
