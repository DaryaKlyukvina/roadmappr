import { useState } from "react";
import "./BulkActions.css";
import { Icon } from "@iconify/react";

function BulkActions({ technologies, onBulkUpdate }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [newStatus, setNewStatus] = useState("in-progress");

    const handleSelectAll = () => {
        if (selectedIds.length === technologies.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(technologies.map((t) => t.id));
        }
    };

    const handleToggleSelect = (id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
    };

    const handleApplyStatus = () => {
        if (selectedIds.length === 0) {
            alert("Выберите хотя бы одну технологию");
            return;
        }

        if (window.confirm(`Изменить статус ${selectedIds.length} технологий на "${getStatusLabel(newStatus)}"?`)) {
            onBulkUpdate(selectedIds, newStatus);
            setSelectedIds([]);
            alert(`Статус изменен для ${selectedIds.length} технологий`);
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            "not-started": "Не начато",
            "in-progress": "В процессе",
            completed: "Изучено",
        };
        return labels[status] || status;
    };

    return (
        <div className="bulk-actions">
            <h3><Icon icon="mdi:wrench" style={{ verticalAlign: "middle", marginRight: 8 }} /> Массовое редактирование</h3>

            <div className="bulk-actions-controls">
                <button
                    onClick={handleSelectAll}
                    className="select-all-btn"
                    aria-label={selectedIds.length === technologies.length ? "Снять выделение со всех" : "Выбрать все"}>
                    {selectedIds.length === technologies.length ? <><Icon icon="mdi:checkbox-blank-outline" style={{ verticalAlign: "middle", marginRight: 8 }} /> Снять выделение</> : <><Icon icon="mdi:checkbox-marked" style={{ verticalAlign: "middle", marginRight: 8 }} /> Выбрать все</>}
                </button>

                <div className="selected-count">
                    Выбрано: <strong>{selectedIds.length}</strong> из {technologies.length}
                </div>
            </div>

            <div className="technology-selection">
                {technologies.map((tech) => (
                    <label
                        key={tech.id}
                        className="technology-checkbox">
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(tech.id)}
                            onChange={() => handleToggleSelect(tech.id)}
                            aria-label={`Выбрать ${tech.title}`}
                        />
                        <span className="technology-name">{tech.title}</span>
                        <span className="technology-current-status">({getStatusLabel(tech.status)})</span>
                    </label>
                ))}
            </div>

            {selectedIds.length > 0 && (
                <div className="bulk-status-update">
                    <label htmlFor="bulk-status-select">Изменить статус выбранных на:</label>
                    <div className="status-update-row">
                        <select
                            id="bulk-status-select"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="status-select">
                            <option value="not-started">Не начато</option>
                            <option value="in-progress">В процессе</option>
                            <option value="completed">Изучено</option>
                        </select>
                        <button
                            onClick={handleApplyStatus}
                            className="apply-btn">
                            <Icon icon="mdi:check" style={{ verticalAlign: "middle", marginRight: 8 }} /> Применить
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BulkActions;
