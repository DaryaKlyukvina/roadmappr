import { useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import "./DeadlineForm.css";

function DeadlineForm({ technology, onSave, onClose }) {
    const [deadline, setDeadline] = useState(technology.deadline || "");
    const [estimatedHours, setEstimatedHours] = useState(technology.estimatedHours || "");
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Валидация даты
        if (deadline) {
            const selectedDate = new Date(deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.deadline = "Дата не может быть в прошлом";
            }
        }

        // Валидация часов
        if (estimatedHours) {
            const hours = parseInt(estimatedHours);
            if (isNaN(hours) || hours < 1) {
                newErrors.estimatedHours = "Введите корректное количество часов (минимум 1)";
            } else if (hours > 1000) {
                newErrors.estimatedHours = "Максимальное значение: 1000 часов";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSave({
                ...technology,
                deadline: deadline || null,
                estimatedHours: estimatedHours ? parseInt(estimatedHours) : null,
            });
            onClose();
        }
    };

    const handleDeadlineChange = (e) => {
        setDeadline(e.target.value);
        // Очистка ошибки при изменении
        if (errors.deadline) {
            setErrors((prev) => ({ ...prev, deadline: undefined }));
        }
    };

    const handleHoursChange = (e) => {
        setEstimatedHours(e.target.value);
        // Очистка ошибки при изменении
        if (errors.estimatedHours) {
            setErrors((prev) => ({ ...prev, estimatedHours: undefined }));
        }
    };

    return createPortal(
        <div
            className="deadline-form-overlay"
            onClick={onClose}>
            <div
                className="deadline-form"
                onClick={(e) => e.stopPropagation()}>
                <h3><Icon icon="mdi:calendar" style={{ verticalAlign: "middle", marginRight: 8 }} /> Установить сроки изучения</h3>
                <p className="technology-title">{technology.title}</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="deadline">
                            Крайний срок
                            {deadline && <span className="optional"> (необязательно)</span>}
                        </label>
                        <input
                            id="deadline"
                            type="date"
                            value={deadline}
                            onChange={handleDeadlineChange}
                            className={errors.deadline ? "error" : ""}
                            aria-invalid={!!errors.deadline}
                            aria-describedby={errors.deadline ? "deadline-error" : undefined}
                        />
                        {errors.deadline && (
                                <span
                                id="deadline-error"
                                className="error-message"
                                role="alert">
                                <Icon icon="mdi:alert" style={{ verticalAlign: "middle", marginRight: 6 }} /> {errors.deadline}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="estimatedHours">
                            Примерное время (часы)
                            {estimatedHours && <span className="optional"> (необязательно)</span>}
                        </label>
                        <input
                            id="estimatedHours"
                            type="number"
                            min="1"
                            max="1000"
                            value={estimatedHours}
                            onChange={handleHoursChange}
                            placeholder="Например: 20"
                            className={errors.estimatedHours ? "error" : ""}
                            aria-invalid={!!errors.estimatedHours}
                            aria-describedby={errors.estimatedHours ? "hours-error" : undefined}
                        />
                        {errors.estimatedHours && (
                            <span
                                id="hours-error"
                                className="error-message"
                                role="alert">
                                <Icon icon="mdi:alert" style={{ verticalAlign: "middle", marginRight: 6 }} /> {errors.estimatedHours}
                            </span>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="save-btn">
                            <Icon icon="mdi:check" style={{ verticalAlign: "middle", marginRight: 8 }} /> Сохранить
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-btn">
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default DeadlineForm;
