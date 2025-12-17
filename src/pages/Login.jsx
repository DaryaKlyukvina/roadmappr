import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import "./Login.css";

function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, register } = useAuth();
    const { success, error } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isRegister) {
            const result = register(username, email, password);
            if (result.success) {
                success("✅ Регистрация успешна!");
                navigate("/");
            } else {
                error(result.error);
            }
        } else {
            const result = login(username, password);
            if (result.success) {
                success("✅ Вход выполнен!");
                navigate("/");
            } else {
                error(result.error);
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>🚀 Roadmappr</h1>
                    <p>{isRegister ? "Создать аккаунт" : "Войти в систему"}</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введите имя пользователя"
                            required
                        />
                    </div>

                    {isRegister && (
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Введите email"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль (мин. 4 символа)"
                            minLength={4}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button">
                        {isRegister ? "Зарегистрироваться" : "Войти"}
                    </button>
                </form>

                <div className="login-footer">
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="toggle-button">
                        {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
