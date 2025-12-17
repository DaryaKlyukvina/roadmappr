import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

function Header() {
    const { isAuthenticated, user } = useAuth();

    return (
        <header className="app-nav-header">
            <div className="nav-container">
                <Link
                    to="/"
                    className="nav-logo">
                    🚀 Roadmappr
                </Link>

                <nav className="nav-links">
                    <Link
                        to="/"
                        className="nav-link">
                        Главная
                    </Link>
                    <Link
                        to="/statistics"
                        className="nav-link">
                        📊 Статистика
                    </Link>
                    <Link
                        to="/settings"
                        className="nav-link">
                        ⚙️ Настройки
                    </Link>
                    {isAuthenticated ? (
                        <Link
                            to="/account"
                            className="nav-link nav-link-account">
                            👤 {user?.username}
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="nav-link nav-link-login">
                            Войти
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
