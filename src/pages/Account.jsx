import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { Icon } from "@iconify/react";
import "./Account.css";

function Account() {
    const { user, logout } = useAuth();
    const { success } = useNotification();

    const handleLogout = () => {
        logout();
        success(<><Icon icon="mdi:logout" style={{ verticalAlign: "middle", marginRight: 8 }} /> Вы вышли из системы</>);
    };

    return (
        <div className="account-page">
            <div className="account-container">
                <div className="account-header">
                    <div className="avatar">{user?.username?.charAt(0).toUpperCase() || "U"}</div>
                    <h1>Профиль пользователя</h1>
                </div>

                <div className="account-info">
                    <div className="info-item">
                        <span className="info-label">Имя пользователя:</span>
                        <span className="info-value">{user?.username}</span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{user?.email}</span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">Дата регистрации:</span>
                        <span className="info-value">
                            {new Date(user?.createdAt).toLocaleDateString("ru-RU", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">ID пользователя:</span>
                        <span className="info-value">{user?.id}</span>
                    </div>
                </div>

                <div className="account-actions">
                    <button
                        onClick={handleLogout}
                        className="logout-button">
                        Выйти из системы
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Account;
