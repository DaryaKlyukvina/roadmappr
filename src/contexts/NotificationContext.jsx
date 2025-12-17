import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within NotificationProvider");
    }
    return context;
};

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = "info") => {
        setNotification({ message, type, id: Date.now() });

        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    const closeNotification = () => {
        setNotification(null);
    };

    const value = {
        notification,
        showNotification,
        closeNotification,
        success: (message) => showNotification(message, "success"),
        error: (message) => showNotification(message, "error"),
        warning: (message) => showNotification(message, "warning"),
        info: (message) => showNotification(message, "info"),
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
