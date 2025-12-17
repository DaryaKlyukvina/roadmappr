import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { Icon } from "@iconify/react";
import "./Settings.css";

function Settings() {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user } = useAuth();
    const { success, warning, error } = useNotification();
    const [showConfirmDialog, setShowConfirmDialog] = useState(null);

    const handleClearAllData = () => {
        setShowConfirmDialog("all");
    };

    const handleClearRoadmapData = () => {
        setShowConfirmDialog("roadmap");
    };

    const handleClearApiData = () => {
        setShowConfirmDialog("api");
    };

    const confirmClear = () => {
        switch (showConfirmDialog) {
            case "all":
                // Сохраняем данные пользователя и темы перед очисткой
                const userData = localStorage.getItem("roadmap-user");
                const themeData = localStorage.getItem("theme");

                localStorage.clear();

                // Восстанавливаем пользователя и тему
                if (userData) localStorage.setItem("roadmap-user", userData);
                if (themeData) localStorage.setItem("theme", themeData);

                success(<><Icon icon="mdi:delete" style={{ verticalAlign: "middle", marginRight: 8 }} /> Все данные очищены (кроме настроек аккаунта и темы)</>);
                break;

            case "roadmap":
                localStorage.removeItem("roadmap-technologies");
                success(<><Icon icon="mdi:delete-variant" style={{ verticalAlign: "middle", marginRight: 8 }} /> Локальные данные роадмапов очищены</>);
                break;

            case "api":
                localStorage.removeItem("roadmap-api-technologies");
                success(<><Icon icon="mdi:database-refresh" style={{ verticalAlign: "middle", marginRight: 8 }} /> Данные из API очищены</>);
                break;
        }

        setShowConfirmDialog(null);

        // Перезагрузка через секунду
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    const cancelClear = () => {
        setShowConfirmDialog(null);
        warning("Отменено");
    };

    const getStorageSize = () => {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return (total / 1024).toFixed(2); // KB
    };

    return (
        <div className="settings-page">
                <div className="settings-header">
                <h1><Icon icon="mdi:cog" style={{ verticalAlign: "middle", marginRight: 8 }} /> Настройки</h1>
                <p>Персонализация и управление данными</p>
            </div>

            <div className="settings-container">
                <section className="settings-section">
                    <h2><Icon icon="mdi:palette" style={{ verticalAlign: "middle", marginRight: 8 }} /> Внешний вид</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Тема оформления</div>
                            <div className="setting-description">
                                {isDarkMode ? "Темная тема активна" : "Светлая тема активна"}
                            </div>
                        </div>
                        <button
                            className={`theme-switch ${isDarkMode ? "dark" : "light"}`}
                            onClick={toggleTheme}
                            aria-label="Переключить тему">
                            <div className="theme-switch-slider">{isDarkMode ? <Icon icon="mdi:weather-night" /> : <Icon icon="mdi:white-balance-sunny" />}</div>
                        </button>
                    </div>
                </section>

                <section className="settings-section">
                    <h2><Icon icon="mdi:database" style={{ verticalAlign: "middle", marginRight: 8 }} /> Хранилище данных</h2>
                    <div className="storage-info">
                        <div className="storage-stat">
                            <span className="storage-label">Использовано:</span>
                            <span className="storage-value">{getStorageSize()} KB</span>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Очистить локальные роадмапы</div>
                            <div className="setting-description">Удалить только локально сохраненные технологии</div>
                        </div>
                        <button
                            className="btn-danger-outline"
                            onClick={handleClearRoadmapData}>
                            Очистить
                        </button>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Очистить данные из API</div>
                            <div className="setting-description">Удалить кешированные данные из внешних источников</div>
                        </div>
                        <button
                            className="btn-danger-outline"
                            onClick={handleClearApiData}>
                            Очистить
                        </button>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Очистить все данные</div>
                            <div className="setting-description">
                                Удалить все данные приложения (кроме аккаунта и настроек темы)
                            </div>
                        </div>
                        <button
                            className="btn-danger"
                            onClick={handleClearAllData}>
                            Очистить всё
                        </button>
                    </div>
                </section>

                {user && (
                    <section className="settings-section">
                        <h2><Icon icon="mdi:account" style={{ verticalAlign: "middle", marginRight: 8 }} /> Информация об аккаунте</h2>
                        <div className="account-info">
                            <div className="info-row">
                                <span className="info-label">Пользователь:</span>
                                <span className="info-value">{user.username}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                        </div>
                    </section>
                )}

                <section className="settings-section">
                    <h2><Icon icon="mdi:information" style={{ verticalAlign: "middle", marginRight: 8 }} /> О приложении</h2>
                    <div className="app-info">
                        <p>
                            <strong>Roadmappr</strong> - трекер изучения технологий
                        </p>
                        <p>Версия: 1.0.0</p>
                        <p>© 2025 Все права защищены</p>
                    </div>
                </section>
            </div>

            {showConfirmDialog && (
                <div
                    className="modal-overlay"
                    onClick={cancelClear}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}>
                        <h3><Icon icon="mdi:alert" style={{ verticalAlign: "middle", marginRight: 8 }} /> Подтверждение</h3>
                        <p>
                            {showConfirmDialog === "all" &&
                                "Вы уверены, что хотите очистить все данные приложения? Данные аккаунта и темы будут сохранены."}
                            {showConfirmDialog === "roadmap" &&
                                "Вы уверены, что хотите очистить локальные данные роадмапов?"}
                            {showConfirmDialog === "api" &&
                                "Вы уверены, что хотите очистить кешированные данные из API?"}
                        </p>
                        <p className="warning-text">Это действие нельзя отменить!</p>
                        <div className="modal-actions">
                            <button
                                className="btn-secondary"
                                onClick={cancelClear}>
                                Отмена
                            </button>
                            <button
                                className="btn-danger"
                                onClick={confirmClear}>
                                Подтвердить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
