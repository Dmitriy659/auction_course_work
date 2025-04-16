import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser, getUserData } from "../../api";
import "./EditProfile.css";

const EditUserPage = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        city: "",
        telephone: "",
        telegram: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUserData();
    }, []);

    // Загрузка данных пользователя
    const loadUserData = async () => {
        try {
            // Заглушка. Замените на вызов реального API
            const data = await getUserData();
            setUserData(data);
            setLoading(false);
        } catch (error) {
            setError("Ошибка загрузки данных");
            setLoading(false);
        }
    };

    // Обработка изменений в форме
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(userData);
            navigate("/");
        } catch (error) {
            navigate("/profile");
            setError("Ошибка при обновлении данных");
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="edit-user-container">
            <h1 className="page-title">Редактировать данные пользователя</h1>
            <form onSubmit={handleSubmit} className="user-edit-form">
                <label className="input-label">
                Имя
                <input
                    type="text"
                    name="first_name"
                    value={userData.first_name}
                    onChange={handleChange}
                    required
                    className="input-field"
                />
                </label>
                <label className="input-label">
                Фамилия
                <input
                    type="text"
                    name="last_name"
                    value={userData.last_name}
                    onChange={handleChange}
                    required
                    className="input-field"
                />
                </label>
                <label className="input-label">
                Email
                <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                />
                </label>
                <label className="input-label">
                Город
                <input
                    type="text"
                    name="city"
                    value={userData.city}
                    onChange={handleChange}
                    className="input-field"
                />
                </label>
                <label className="input-label">
                Телефон
                <input
                    type="tel"
                    name="telephone"
                    value={userData.telephone || ""}
                    onChange={handleChange}
                    className="input-field"
                />
                </label>
                <label className="input-label">
                Telegram
                <input
                    type="text"
                    name="telegram"
                    value={userData.telegram || ""}
                    onChange={handleChange}
                    className="input-field"
                />
                </label>
                <button type="submit" className="save-button">Сохранить</button>
            </form>
            </div>
    )
};

export default EditUserPage;
