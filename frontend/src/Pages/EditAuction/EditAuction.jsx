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
    const [update_error, setUpdateError] = useState(null);

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
            setUpdateError("Ошибка при обновлении аукциона. Проверьте введённые данные");
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="edit-auction-container">
            {update_error && <div className="error-message">{update_error}</div>}
            <h1 className="page-title">Редактировать аукцион</h1>
            <form onSubmit={handleSubmit} className="auction-form">
            <div className="form-group">
                <label htmlFor="auction-title">Заголовок*</label>
                <input
                id="auction-title"
                type="text"
                name="title"
                placeholder="Введите название лота"
                value={auction.title}
                onChange={handleChange}
                required
                className="form-input"
                />
            </div>

            <div className="form-group">
                <label htmlFor="auction-description">Описание*</label>
                <textarea
                id="auction-description"
                name="description"
                placeholder="Подробно опишите лот"
                value={auction.description}
                onChange={handleChange}
                required
                className="form-textarea"
                />
            </div>

            <div className="form-group">
                <label htmlFor="auction-city">Город*</label>
                <input
                id="auction-city"
                type="text"
                name="city"
                placeholder="Укажите город нахождения лота"
                value={auction.city}
                onChange={handleChange}
                required
                className="form-input"
                />
            </div>

            <div className="form-group">
                <label htmlFor="auction-image">Изображение лота</label>
                <input
                id="auction-image"
                type="file"
                name="image"
                onChange={handleChange}
                className="form-input-file"
                accept="image/*"
                />
                <small className="file-hint">Поддерживаемые форматы: JPG, PNG, GIF</small>
            </div>

            <button type="submit" className="submit-button">
                Сохранить
            </button>
            </form>
            </div>

    );
};

export default EditAuctionPage;
