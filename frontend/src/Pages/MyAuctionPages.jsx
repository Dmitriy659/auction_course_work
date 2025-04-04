import { useState, useEffect } from "react";
import { deleteAuction, getUserAuctions } from "../api";
import { data, Link } from "react-router-dom";


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
                <img src={auction.image} alt={auction.title} width="100" />
                <button onClick={() => handleDelete(auction.id)}>Удалить</button>
                <Link to={`/edit-auction/${auction.id}`}><button>Редактировать</button></Link>
                <Link to={`/myauction-bids/${auction.id}`}>Заявки на аукцион</Link>
              </div>
            ))}
          </div>
        </div>
      );

}

export default MyAuctionsPage;