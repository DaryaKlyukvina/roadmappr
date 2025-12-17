import { createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("roadmap-user", null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!user);

    const login = (username, password) => {
        // Простая проверка (в реальном приложении это должно быть API)
        if (username && password.length >= 4) {
            const userData = {
                id: Date.now(),
                username,
                email: `${username}@example.com`,
                createdAt: new Date().toISOString(),
            };
            setUser(userData);
            setIsAuthenticated(true);
            return { success: true };
        }
        return { success: false, error: "Неверные учетные данные" };
    };

    const register = (username, email, password) => {
        if (username && email && password.length >= 4) {
            const userData = {
                id: Date.now(),
                username,
                email,
                createdAt: new Date().toISOString(),
            };
            setUser(userData);
            setIsAuthenticated(true);
            return { success: true };
        }
        return { success: false, error: "Заполните все поля корректно" };
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
