import { useState, useEffect } from "react";
import { getUserAuctions } from "../api";
import { data, Link } from "react-router-dom";


const MyAuctionsPage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getUserAuctions()
          .then(data => {
            setAuctions(data); // Успех: сохраняем аукционы
            setLoading(false);        // Выключаем загрузку
          })
          .catch(error => {
            setError('Не удалось загрузить аукционы'); // Ошибка
            setLoading(false);
          });
      }, []);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
          <Link to="/create-auction">
            <button>Создать новый аукцион</button>
          </Link>
          
          <h1>Мои аукционы</h1>
          <div>
            {auctions.map(auction => (
              <div key={auction.id}>
                <h2>{auction.title}</h2>
                <p>{auction.description}</p>
                <p>Текущая цена: ${auction.current_price}</p>
                <p>Дата начала: {new Date(auction.start_date).toLocaleString()}</p>
                <p>Активность: {auction.is_active ? 'Активен' : 'Завершен'}</p>
                <img src={auction.image} alt={auction.title} width="100" />
              </div>
            ))}
          </div>
        </div>
      );

}

export default MyAuctionsPage;