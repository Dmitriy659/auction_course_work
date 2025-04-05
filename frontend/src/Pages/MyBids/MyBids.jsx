import { useEffect, useState } from "react";
import { getMyBids, deleteBid } from "../../api";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

const MyBidsPage = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBids();
  }, []);

  const loadBids = async () => {
    const data = await getMyBids();
    setBids(data);
    setLoading(false);
  };

  const handleDelete = async(bidId) => {
    await deleteBid(bidId);
    await loadBids();
  };

  if (loading) return <p>Загрузка...</p>;

  if (bids.length === 0) return <p>Вы пока не оставили ни одной заявки.</p>;

  return (
    <div>
      <h2>Мои заявки</h2>
      <ul>
        {bids.map((bid) => (
          <li key={bid.id}>
            <p>Аукцион: {bid.auction_post_data.title}</p>
            <p>Сумма заявки: {bid.amount} ₽</p>
            <p>Создано: {new Date(bid.create_time).toLocaleString()}</p>
            <Link to={`/auctions/${bid.auction_post_data.id}`}>Перейти</Link>
            <button onClick={() => handleDelete(bid.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBidsPage;
