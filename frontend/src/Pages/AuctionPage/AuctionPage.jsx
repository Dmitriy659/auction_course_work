import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getAuctionDetails, getUserData, createBid } from "../../api";  // Используем существующую функцию для получения данных о пользователе

const AuctionDetailsPage = () => {
    const { id } = useParams();  // Получаем ID аукциона из URL
    const [auction, setAuction] = useState(null);
    const [user, setUser] = useState(null);  // Состояние для текущего пользователя
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bidAmount, setBidAmount] = useState("");  // Состояние для цены заявки
    const [bidError, setBidError] = useState("");  // Состояние для ошибки заявки

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
            setBidError("Заявка должна быть больше текущей цены.");
            return;
        }

        try {
            await createBid(id, bidAmount);  // Отправляем заявку через API
            alert("Заявка успешно подана!");
            setBidAmount("");  // Очищаем поле после успешной заявки
            loadAuction();
        } catch (error) {
            setBidError("Ошибка при подаче заявки.");
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    const maxPrice = Math.max(auction.starting_price, auction.current_price);
    const isAuthorized = user && user.id !== auction.user.id;  // Проверяем, что пользователь авторизован и не является автором поста

    return (
        <div>
            <Link to={`/`}>Назад</Link>
            <h1>Детали аукциона</h1>
            {auction && (
                <div>
                    <h2>{auction.title}</h2>
                    <img src={auction.image} alt={auction.title} width="200" />
                    <p>{auction.description}</p>
                    <p>Стартовая цена: {auction.starting_price} ₽</p>
                    <p>Текущая цена: {maxPrice} ₽</p>
                    <p>Дата начала: {new Date(auction.start_date).toLocaleString()}</p>
                    <p>Автор: {auction.user.first_name} {auction.user.last_name}</p>
                    
                    {isAuthorized && (
                        <div>
                            <h3>Подать заявку</h3>
                            <input
                                type="number"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                placeholder={`Введите сумму (минимум $${maxPrice + 0.01})`}
                            />
                            <button onClick={handleBidSubmit}>Подать заявку</button>
                            {bidError && <p style={{ color: 'red' }}>{bidError}</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AuctionDetailsPage;
