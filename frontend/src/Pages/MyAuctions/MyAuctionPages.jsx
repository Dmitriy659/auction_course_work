import { useState, useEffect } from "react";
import { deleteAuction, getUserAuctions } from "../../api";
import { data, Link } from "react-router-dom";
import "./MyAuctionPages.css";


const MyAuctionsPage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      loadAuctions();
    }, []);

    const loadAuctions = async () => {
        try {
            const data = await getUserAuctions();
            setAuctions(data);
            setLoading(false);
        } catch {
            setError('Не удалось загрузить аукционы');
            setLoading(false);
        }
    };

    const handleDelete = async (auctionId) => {
      if (!window.confirm("Вы уверены, что хотите удалить этот аукцион?")) return;
      try {
        await deleteAuction(auctionId);
        setAuctions(auctions.filter(auction => auction.id !== auctionId));
      }
      catch (error) {
        alert("Ошибка при удалении аукциона");
      }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
      <div className="my-auctions-container">
        <Link to="/create-auction">
          <button className="create-auction-button">Создать новый аукцион</button>
        </Link>

        <h1 className="page-title">Мои аукционы</h1>

        <div className="auctions-list">
          {auctions.map(auction => (
            <div key={auction.id} className="auction-card">
              <h2 className="auction-title">{auction.title}</h2>
              <p className="auction-description">{auction.description}</p>
              <p className="auction-price">Текущая цена: {auction.current_price} ₽</p>
              <p className="auction-date">Дата начала: {new Date(auction.start_date).toLocaleString()}</p>
              
              <div className="auction-image-container">
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="auction-image-user"
                />
              </div>
              
              <div className="auction-actions">
                <button className="delete-button" onClick={() => handleDelete(auction.id)}>
                  Удалить
                </button>
                <Link to={`/edit-auction/${auction.id}`}>
                  <button className="edit-button">Редактировать</button>
                </Link>
                <Link to={`/myauction-bids/${auction.id}`} className="bids-link">
                  Заявки на аукцион
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    )

}

export default MyAuctionsPage;