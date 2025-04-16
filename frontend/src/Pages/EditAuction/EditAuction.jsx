import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateAuction, getUserAuctions } from "../../api";
import "./EditAuction.css";

const EditAuctionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [auction, setAuction] = useState({
        title: "",
        description: "",
        city: "",
        image: null,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAuction();
    }, []);

    // Загрузка данных аукциона
    const loadAuction = async () => {
        try {
            const auctions = await getUserAuctions();
            const auctionToEdit = auctions.find((auction) => auction.id === parseInt(id));
            if (auctionToEdit) {
                const { title, description, city, image } = auctionToEdit;
                setAuction({
                    title,
                    description,
                    city,
                    image: null
                });
            } else {
                setError("Аукцион не найден");
            }
            setLoading(false);
        } catch (error) {
            setError("Ошибка загрузки данных");
            setLoading(false);
        }
    };

    // Обработка изменений в форме
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setAuction({ ...auction, [name]: files[0] });
        }
        else {
            setAuction({ ...auction, [name]: value });
        }
    };

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAuction(id, auction);
            navigate("/my-auctions");
        } catch (error) {
            alert("Ошибка при обновлении аукциона");
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="edit-auction-container">
            <h1 className="page-title">Редактировать аукцион</h1>
            <form onSubmit={handleSubmit} className="auction-form">
                <input
                type="text"
                name="title"
                placeholder="Заголовок"
                value={auction.title}
                onChange={handleChange}
                required
                className="form-input"
                />
                <textarea
                name="description"
                placeholder="Описание"
                value={auction.description}
                onChange={handleChange}
                required
                className="form-textarea"
                />
                <input
                type="text"
                name="city"
                placeholder="Город"
                value={auction.city}
                onChange={handleChange}
                required
                className="form-input"
                />
                <input
                type="file"
                name="image"
                onChange={handleChange}
                className="form-input-file"
                />
                <button type="submit" className="submit-button">Сохранить</button>
            </form>
            </div>

    );
};

export default EditAuctionPage;
