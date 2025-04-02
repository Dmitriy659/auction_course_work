import React, { useEffect, useState } from "react";
import axios from "axios";

function AuctionList() {
  const [auctions, setAuctions] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  useEffect(() => {
    const fetchAuctions = async (url = "http://localhost:8000/api/v1/auctions/") => {
      try {
        const response = await axios.get(url);
        setAuctions(response.data.results);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
      } catch (error) {
        console.error("Ошибка при загрузке аукционов:", error);
      }
    };

    fetchAuctions();
  }, []);

  const handleNextPage = () => {
    if (nextPage) {
      setAuctions([]); // Очистка текущих аукционов
      axios.get(nextPage).then((response) => {
        setAuctions(response.data.results);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
      });
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setAuctions([]); // Очистка текущих аукционов
      axios.get(previousPage).then((response) => {
        setAuctions(response.data.results);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
      });
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auctions.map((auction) => (
          <div key={auction.id} className="border p-4 rounded shadow-md">
            <h2 className="text-xl font-bold">{auction.title}</h2>
            <p>{auction.description}</p>
            <p>Цена: {auction.current_price} ₽</p>
            <p>Город: {auction.city}</p>
            {auction.image ? (
              <img
                src={`${auction.image}`}
                alt={auction.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded mb-2 flex items-center justify-center">
                <span className="text-gray-500">Нет изображения</span>
              </div>
            )}
          </div>
        ))}
      </div>

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
