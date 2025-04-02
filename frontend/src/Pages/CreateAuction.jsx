// src/pages/CreateAuction.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAuction } from "../api";

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
        setError("Не удалось создать аукцион. Попробуйте еще раз.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Создать аукцион</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleCreateAuction}>
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Начальная цена"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Город"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Создать</button>
      </form>
    </div>
  );
}
