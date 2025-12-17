import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Icon } from "@iconify/react";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

function Header() {
    const { isAuthenticated, user } = useAuth();

    return (
        <header className="app-nav-header">
            <div className="nav-container">
                <Link
                    to="/"
                    className="nav-logo">
                    <Icon icon="mdi:rocket" style={{ verticalAlign: "middle", marginRight: 8 }} /> Roadmappr
                </Link>

                <nav className="nav-links">
                    {/* Главная ссылка убрана по запросу */}
                    <Link
                        to="/statistics"
                        className="nav-link"
                        title="Статистика"
                        aria-label="Статистика">
                        <Icon icon="mdi:chart-bar" style={{ verticalAlign: "middle" }} />
                    </Link>
                    <Link
                        to="/settings"
                        className="nav-link"
                        title="Настройки"
                        aria-label="Настройки">
                        <Icon icon="mdi:cog" style={{ verticalAlign: "middle" }} />
                    </Link>
                    {isAuthenticated ? (
                        <Link
                            to="/account"
                            className="nav-link nav-link-account"
                            title={user?.username || "Аккаунт"}
                            aria-label={user?.username ? `Аккаунт пользователя ${user.username}` : "Аккаунт"}>
                            <Icon icon="mdi:account" style={{ verticalAlign: "middle" }} />
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="nav-link nav-link-login"
                            title="Войти"
                            aria-label="Войти">
                            <Icon icon="mdi:login" style={{ verticalAlign: "middle" }} />
                        </Link>
                    )}
                </nav>

                <div className="header-actions">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}

export default Header;
