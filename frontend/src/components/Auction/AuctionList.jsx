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
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Поиск по заголовку или городу"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Найти
        </button>
      </form>

      {/* 📦 Список аукционов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auctions.map((auction) => (
          <div key={auction.id} className="border p-4 rounded shadow-md">
            {auction.image ? (
              <img
                src={auction.image}
                alt={auction.title}
                className="w-full h-48 object-cover rounded mb-2"
                width={200}
                height={200}
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded mb-2 flex items-center justify-center">
                <span className="text-gray-500">Нет изображения</span>
              </div>
            )}
            <h2 className="text-xl font-bold">{auction.title}</h2>
            <p>{auction.description}</p>
            <p>Цена: {auction.current_price} ₽</p>
            <p>Город: {auction.city}</p>
            <Link to={`/auctions/${auction.id}`}>Подробнее</Link>
          </div>
        ))}
      </div>

      {/* 🔁 Пагинация */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={!previousPage}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Назад
        </button>
        <button
          onClick={handleNextPage}
          disabled={!nextPage}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Вперед
        </button>
      </div>
    </div>
  );
}

export default AuctionList;
