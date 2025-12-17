import "./ProgressBar.css";

function ProgressBar({
    progress = { total: 0, completed: 0, inProgress: 0 },
    label = "",
    color = "#4CAF50",
    animated = false,
    height = 24,
}) {
    const progressValue = Math.min(100, Math.max(0, (progress.completed / progress.total) * 100)) || 0;
    const displayValue = Math.round(progressValue);

    return (
        <div className="progress-bar-wrapper">
            {label && <div className="progress-label">{label}</div>}

            <div
                className="progress-bar-container"
                style={{ height: `${height}px` }}>
                <div
                    className={`progress-bar-fill ${animated ? "animated" : ""}`}
                    style={{
                        width: `${progressValue}%`,
                        backgroundColor: color,
                        minWidth: progressValue > 0 ? "40px" : "0",
                    }}>
                    {progressValue > 0 && <span className="progress-text">{displayValue}%</span>}
                </div>
                {progressValue === 0 && <span className="progress-text-empty">0%</span>}
            </div>
        </div>
    );
}

export default ProgressBar;
