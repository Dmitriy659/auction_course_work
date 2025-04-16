import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuctionBids } from "../../api";  // Функция для получения заявок аукциона
import "./AuctionBids.css";

const AuctionBidsPage = () => {
    const { id } = useParams();  // Получаем ID аукциона из URL
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadBids();
    }, [id]);

    const loadBids = async () => {
        try {
            const data = await getAuctionBids(id);  // Получаем заявки для данного аукциона
            setBids(data);
            setLoading(false);
        } catch (error) {
            setError("Не удалось загрузить заявки.");
            setLoading(false);
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    if (bids.length === 0) return <p>Заявки отсутствуют.</p>;

    return (
        <div className="auction-bid-container">
            <h2>Заявки на аукцион</h2>
            <ul>
                {bids.map((bid) => (
                <li key={bid.id}>
                    <p>Пользователь: {bid.user.first_name} {bid.user.last_name}</p>
                    <p>Сумма заявки: ₽{bid.amount}</p>
                    <p>Дата создания: {new Date(bid.create_time).toLocaleString()}</p>
                    <p>Контакты:</p>
                    {bid.user.telephone && <p>Телефон: {bid.user.telephone}</p>}
                    {bid.user.telegram && <p>Телеграм: {bid.user.telegram}</p>}
                    {bid.user.email && <p>Электронная почта: {bid.user.email}</p>}
                </li>
                ))}
            </ul>
        </div>
    );
};

export default AuctionBidsPage;
