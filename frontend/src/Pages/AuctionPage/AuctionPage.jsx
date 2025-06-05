import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getAuctionDetails, getUserData, createBid } from "../../api";  // Используем существующую функцию для получения данных о пользователе
import "./AuctionPage.css";

const AuctionDetailsPage = () => {
    const { id } = useParams();  // Получаем ID аукциона из URL
    const [auction, setAuction] = useState(null);
    const [user, setUser] = useState(null);  // Состояние для текущего пользователя
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bidAmount, setBidAmount] = useState("");  // Состояние для цены заявки
    const [bidError, setBidError] = useState("");  // Состояние для ошибки заявки
    const [bidSuccess, setBidSuccess] = useState("");

    useEffect(() => {
        loadAuction();
        loadUser();  // Загружаем данные пользователя
    }, [id]);

    const loadAuction = async () => {
        try {
            const data = await getAuctionDetails(id);  // Получаем подробности аукциона
            setAuction(data);
            setLoading(false);
        } catch (error) {
            setError("Не удалось загрузить данные аукциона");
            setLoading(false);
        }
    };

    const loadUser = async () => {
        try {
            const userData = await getUserData();  // Получаем данные о текущем пользователе с помощью существующей функции
            setUser(userData);
        } catch (error) {
            
        }
    };

    const handleBidSubmit = async () => {
        const maxPrice = Math.max(auction.starting_price, auction.current_price);

        if (parseFloat(bidAmount) <= maxPrice) {
            setBidSuccess("");
            setBidError("Заявка должна быть больше текущей цены.");
            return;
        }

        try {
            await createBid(id, bidAmount);  // Отправляем заявку через API
            setBidSuccess("Заявка успешно подана");
            setBidError("");
            setBidAmount("");  // Очищаем поле после успешной заявки
            loadAuction();
        } catch (error) {
            setBidSuccess("");
            setBidError("Ошибка при подаче заявки.");
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    const maxPrice = Math.max(auction.starting_price, auction.current_price);
    const isAuthorized = user && user.is_authenticated && user.id !== auction.user.id;

    return (
        <div className="auction-details-container">
            <Link to="/" className="back-link">← Назад</Link>
            <h1 className="page-title">Детали аукциона</h1>

            {auction && (
                <>
                <h2 className="auction-title">{auction.title}</h2>

                {auction.image ? (
                    <img
                    src={auction.image}
                    alt={auction.title}
                    className="auction-image-user"
                    />
                ) : (
                    <div className="no-image">Нет изображения</div>
                )}

                <p className="auction-description">{auction.description}</p>
                <p className="auction-price">Стартовая цена: {auction.starting_price} ₽</p>
                <p className="auction-price">Текущая цена: {maxPrice} ₽</p>
                <p className="auction-date">Дата начала: {new Date(auction.start_date).toLocaleString()}</p>
                <p className="auction-author">Автор: {auction.user.first_name} {auction.user.last_name}</p>

                {isAuthorized && (
                    <div className="bid-section">
                    <h3 className="bid-title">Подать заявку</h3>
                    <input
                        type="number"
                        className="bid-input"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Введите сумму (минимум ${maxPrice + 0.01} ₽)`}
                    />
                    <button className="bid-button" onClick={handleBidSubmit}>
                        Подать заявку
                    </button>
                    {bidError && <p className="bid-error">{bidError}</p>}
                    {bidSuccess && <p className="bid-success">{bidSuccess}</p>}
                    </div>
                )}
                </>
            )}
            </div>
    );
};

export default AuctionDetailsPage;
