import { useState, useEffect } from "react";
import DeadlineForm from "./DeadlineForm";
import "./TechnologyCard.css";
import { Icon } from "@iconify/react";
import { useTheme } from "../contexts/ThemeContext";

function TechnologyCard({ technology, onStatusChange, onNotesChange, onUpdate }) {
    const { isDarkMode } = useTheme();
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [localNotes, setLocalNotes] = useState(technology.notes || "");
    const [showDeadlineForm, setShowDeadlineForm] = useState(false);

    useEffect(() => {
        setLocalNotes(technology.notes || "");
    }, [technology.notes]);

    const cycleStatus = () => {
        const statusCycle = {
            "not-started": "in-progress",
            "in-progress": "completed",
            completed: "not-started",
        };

        const newStatus = statusCycle[technology.status] || "not-started";
        if (onStatusChange) {
            onStatusChange(technology.id, newStatus);
        }
    };

    const handleSaveNotes = () => {
        if (onNotesChange) {
            onNotesChange(technology.id, localNotes);
        }
        setIsEditingNotes(false);
    };

    const handleCancelEdit = () => {
        setLocalNotes(technology.notes || "");
        setIsEditingNotes(false);
    };

    const getStatusConfig = () => {
        switch (technology.status) {
            case "completed":
                return {
                    color: isDarkMode ? "#2ea36b" : "#4CAF50",
                    icon: "mdi:check-circle",
                    label: "Изучено",
                    bgColor: isDarkMode ? "rgba(46,163,107,0.12)" : "#E8F5E9",
                };
            case "in-progress":
                return {
                    color: isDarkMode ? "#d9913a" : "#FF9800",
                    icon: "mdi:progress-clock",
                    label: "В процессе",
                    bgColor: isDarkMode ? "rgba(217,145,58,0.12)" : "#FFF3E0",
                };
            default: // not-started
                return {
                    color: isDarkMode ? "#8f97a1" : "#9E9E9E",
                    icon: "mdi:circle-outline",
                    label: "Не начато",
                    bgColor: isDarkMode ? "rgba(143,151,161,0.08)" : "#F5F5F5",
                };
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <div
            className="technology-card"
            data-tech-id={technology.id}
            style={{
                borderLeftColor: statusConfig.color,
                backgroundColor: statusConfig.bgColor,
            }}
            onClick={cycleStatus}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    cycleStatus();
                }
            }}>
            <div className="card-header">
                <div className="status-indicator">
                    <span
                        className="status-icon"
                        style={{ color: statusConfig.color }}>
                        <Icon icon={statusConfig.icon} style={{ verticalAlign: "middle" }} />
                    </span>
                    <span
                        className="status-label"
                        style={{ color: statusConfig.color }}>
                        {statusConfig.label}
                    </span>
                </div>
            </div>

            <h3 className="card-title">{technology.title}</h3>
            <p className="card-description">{technology.description}</p>

            {(technology.deadline || technology.estimatedHours) && (
                <div
                    className="card-meta"
                    onClick={(e) => e.stopPropagation()}>
                    {technology.deadline && (
                        <span className="meta-item">
                            <Icon icon="mdi:calendar" style={{ verticalAlign: "middle", marginRight: 6 }} /> Срок: {new Date(technology.deadline).toLocaleDateString("ru-RU")}
                        </span>
                    )}
                    {technology.estimatedHours && <span className="meta-item"><Icon icon="mdi:timer" style={{ verticalAlign: "middle", marginRight: 6 }} /> {technology.estimatedHours}ч</span>}
                </div>
            )}

            <div
                className="card-actions-row"
                onClick={(e) => e.stopPropagation()}>
                    <button
                        className="deadline-btn"
                        onClick={() => setShowDeadlineForm(true)}
                        title="Установить сроки">
                        <Icon icon="mdi:calendar" style={{ verticalAlign: "middle", marginRight: 8 }} /> Сроки
                    </button>
            </div>

            <div
                className="card-notes"
                onClick={(e) => e.stopPropagation()}>
                <div className="notes-header">
                    <h4>Мои заметки:</h4>
                    {!isEditingNotes && (
                        <button
                            onClick={() => setIsEditingNotes(true)}
                            className="edit-notes-btn">
                            {technology.notes ? <><Icon icon="mdi:pencil" style={{ verticalAlign: "middle", marginRight: 6 }} /> Редактировать</> : <><Icon icon="mdi:plus" style={{ verticalAlign: "middle", marginRight: 6 }} /> Добавить заметку</>}
                        </button>
                    )}
                </div>

                {isEditingNotes ? (
                    <div className="notes-edit-mode">
                        <textarea
                            value={localNotes}
                            onChange={(e) => setLocalNotes(e.target.value)}
                            placeholder="Записывайте сюда важные моменты..."
                            rows="3"
                            className="notes-textarea"
                        />
                        <div className="notes-hint">
                            {localNotes.length > 0 ? `${localNotes.length} символов` : "Добавьте заметку"}
                        </div>
                        <div className="notes-actions">
                            <button
                                onClick={handleSaveNotes}
                                className="save-btn">
                                Сохранить
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="cancel-btn">
                                Отмена
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="notes-display">
                        {technology.notes ? <p>{technology.notes}</p> : <p className="no-notes">Заметок пока нет</p>}
                    </div>
                )}
            </div>

            {showDeadlineForm && (
                <DeadlineForm
                    technology={technology}
                    onSave={(updatedTech) => {
                        if (onUpdate) onUpdate(updatedTech);
                    }}
                    onClose={() => setShowDeadlineForm(false)}
                />
            )}
        </div>
    );
}

export default TechnologyCard;
