import "./ErrorMessage.css";

function ErrorMessage({ message, onRetry }) {
    return (
        <div className="error-message-container">
            <div className="error-icon">⚠️</div>
            <h3>Произошла ошибка</h3>
            <p className="error-text">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="retry-btn">
                    🔄 Попробовать снова
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
