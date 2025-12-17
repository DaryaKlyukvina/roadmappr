import "./ErrorMessage.css";
import { Icon } from "@iconify/react";

function ErrorMessage({ message, onRetry }) {
    return (
        <div className="error-message-container">
            <div className="error-icon"><Icon icon="mdi:alert" /></div>
            <h3>Произошла ошибка</h3>
            <p className="error-text">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="retry-btn">
                    <Icon icon="mdi:restart" style={{ verticalAlign: "middle", marginRight: 8 }} /> Попробовать снова
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
