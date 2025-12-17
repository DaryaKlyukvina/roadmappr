import { useState } from "react";
import { useNotification } from "../contexts/NotificationContext";
import { Icon } from "@iconify/react";
import "./ImportExport.css";

function ImportExport({ technologies, onImport }) {
    const [importing, setImporting] = useState(false);
    const [importError, setImportError] = useState("");
    const { success, error: showError } = useNotification();

    // Экспорт данных в JSON
    const handleExport = () => {
        try {
            const dataStr = JSON.stringify(technologies, null, 2);
            const dataBlob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(dataBlob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `roadmap-${new Date().toISOString().split("T")[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            success(<><Icon icon="mdi:check-circle" style={{ verticalAlign: "middle", marginRight: 8 }} /> Данные успешно экспортированы!</>);
        } catch (err) {
            showError(<><Icon icon="mdi:close-circle" style={{ verticalAlign: "middle", marginRight: 8 }} /> Ошибка при экспорте данных</>);
            console.error(err);
        }
    };

    // Импорт данных из JSON файла
    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImporting(true);
        setImportError("");

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Валидация данных
                if (!Array.isArray(data)) {
                    throw new Error("Неверный формат данных. Ожидается массив.");
                }

                // Проверка структуры каждого элемента
                const isValid = data.every(
                    (item) =>
                        item.title &&
                        item.description &&
                        ["not-started", "in-progress", "completed"].includes(item.status)
                );

                if (!isValid) {
                    throw new Error("Некоторые элементы имеют неверную структуру");
                }

                // Добавляем недостающие поля
                const normalizedData = data.map((item) => ({
                    id: item.id || Date.now() + Math.random(),
                    title: item.title,
                    description: item.description,
                    status: item.status || "not-started",
                    notes: item.notes || "",
                    category: item.category || "other",
                    difficulty: item.difficulty || "beginner",
                    resources: item.resources || [],
                }));

                onImport(normalizedData);
                alert(`Успешно импортировано ${normalizedData.length} технологий!`);
                event.target.value = ""; // Сброс input
            } catch (error) {
                setImportError(error.message);
                alert(`Ошибка импорта: ${error.message}`);
            } finally {
                setImporting(false);
            }
        };

        reader.onerror = () => {
            setImportError("Ошибка чтения файла");
            setImporting(false);
        };

        reader.readAsText(file);
    };

    return (
        <div className="import-export">
            <h3><Icon icon="mdi:package-variant" style={{ verticalAlign: "middle", marginRight: 8 }} /> Импорт и экспорт данных</h3>

            <div className="import-export-actions">
                <button
                    onClick={handleExport}
                    className="export-btn"
                    title="Скачать данные в JSON">
                    <Icon icon="mdi:download" style={{ verticalAlign: "middle", marginRight: 8 }} /> Экспортировать данные
                </button>

                <label
                    className="import-btn"
                    title="Загрузить данные из JSON файла">
                    <Icon icon="mdi:upload" style={{ verticalAlign: "middle", marginRight: 8 }} /> Импортировать данные
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        disabled={importing}
                        style={{ display: "none" }}
                    />
                </label>
            </div>

            {importError && (
                <div className="import-error">
                    <strong>Ошибка:</strong> {importError}
                </div>
            )}

            <div className="import-export-hint">
                <p>
                    <Icon icon="mdi:lightbulb" style={{ verticalAlign: "middle", marginRight: 6 }} /> <strong>Экспорт:</strong> Сохраните текущий прогресс в JSON файл
                </p>
                <p>
                    <Icon icon="mdi:lightbulb" style={{ verticalAlign: "middle", marginRight: 6 }} /> <strong>Импорт:</strong> Загрузите данные из ранее сохраненного файла
                </p>
            </div>
        </div>
    );
}

export default ImportExport;
