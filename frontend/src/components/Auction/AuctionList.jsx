import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuctions, searchAuctions } from "../../api"; // Импортируем функции из api.js

function AuctionList() {
  const [auctions, setAuctions] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAuctions = async (url = "/auctions/") => {
    try {
      const data = await getAuctions(url);  // Используем функцию getAuctions из api.js
      setAuctions(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } catch (error) {
      console.error("Ошибка при загрузке аукционов:", error);
    }
  };

  useEffect(() => {
    fetchAuctions(); // начальная загрузка
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await searchAuctions(searchQuery); // Используем функцию searchAuctions из api.js
      setAuctions(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } catch (error) {
      console.error("Ошибка при поиске аукционов:", error);
    }
  };

  const handleNextPage = () => {
    if (nextPage) fetchAuctions(nextPage);
  };

  const handlePreviousPage = () => {
    if (previousPage) fetchAuctions(previousPage);
  };

  return (
    <div>
      {/* 🔍 Поисковая форма */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Поиск по заголовку или городу"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Найти
        </button>
      </form>

      {/* 📦 Список аукционов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <div key={auction.id} className="auction-card">
            {auction.image ? (
              <img
                src={auction.image}
                alt={auction.title}
                className="auctions-image"
              />
            ) : (
              <div className="auction-placeholder">Нет изображения</div>
            )}
            <h2 className="auction-title">{auction.title}</h2>
            <p className="auction-meta">{auction.description}</p>
            <p className="auction-meta">Цена: {auction.current_price} ₽</p>
            <p className="auction-meta">Город: {auction.city}</p>
            <Link to={`/auctions/${auction.id}`} className="text-blue-600 hover:underline mt-2 inline-block">
              Подробнее
            </Link>
          </div>
        ))}
      </div>

      {/* 🔁 Пагинация */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePreviousPage}
          disabled={!previousPage}
          className="pagination-button"
        >
          Назад
        </button>
        <button
          onClick={handleNextPage}
          disabled={!nextPage}
          className="pagination-button"
        >
          Вперед
        </button>
      </div>
    </div>
  );
}

export default AuctionList;
