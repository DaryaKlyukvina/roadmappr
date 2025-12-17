import { useTheme } from "../contexts/ThemeContext";
import { Icon } from "@iconify/react";
import "./ThemeToggle.css";

function ThemeToggle() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Переключить на светлую тему" : "Переключить на темную тему"}
            title={isDarkMode ? "Светлая тема" : "Темная тема"}>
            <span className="theme-icon">{isDarkMode ? <Icon icon="mdi:white-balance-sunny" /> : <Icon icon="mdi:weather-night" />}</span>
        </button>
    );
}

export default ThemeToggle;
