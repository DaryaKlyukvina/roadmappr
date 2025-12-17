import { useState } from "react";
import TechnologyCard from "../components/TechnologyCard";
import ProgressBar from "../components/ProgressBar";
import FilterBar from "../components/FilterBar";
import ImportExport from "../components/ImportExport";
import BulkActions from "../components/BulkActions";
import ThemeToggle from "../components/ThemeToggle";
import Snackbar from "../components/Snackbar";
import RoadmapSelector from "../components/RoadmapSelector";
import useTechnologies from "../hooks/useTechnologies";
import useTechnologiesApi from "../hooks/useTechnologiesApi";
import useDebounce from "../hooks/useDebounce";
import { useNotification } from "../contexts/NotificationContext";
import { Icon } from "@iconify/react";
import "./Home.css";

function Home() {
    const {
        technologies: localTechnologies,
        updateStatus: localUpdateStatus,
        updateNotes: localUpdateNotes,
        progress: localProgress,
        completeAll: localCompleteAll,
        resetAll: localResetAll,
        pickRandom: localPickRandom,
        bulkUpdateStatus: localBulkUpdateStatus,
        importTechnologies,
        updateTechnology: localUpdateTechnology,
    } = useTechnologies();

    const {
        technologies: apiTechnologies,
        roadmaps,
        selectedRoadmap,
        loading,
        error: apiError,
        progress: apiProgress,
        fetchRoadmapById,
        updateStatus: apiUpdateStatus,
        updateNotes: apiUpdateNotes,
        updateTechnology: apiUpdateTechnology,
        bulkUpdateStatus: apiBulkUpdateStatus,
        completeAll: apiCompleteAll,
        resetAll: apiResetAll,
        pickRandom: apiPickRandom,
    } = useTechnologiesApi();

    // Используем API данные и функции, если они загружены, иначе локальные
    const useApi = apiTechnologies.length > 0;
    const technologies = useApi ? apiTechnologies : localTechnologies;
    const progress = useApi ? apiProgress : localProgress;
    const updateStatus = useApi ? apiUpdateStatus : localUpdateStatus;
    const updateNotes = useApi ? apiUpdateNotes : localUpdateNotes;
    const updateTechnology = useApi ? apiUpdateTechnology : localUpdateTechnology;
    const bulkUpdateStatus = useApi ? apiBulkUpdateStatus : localBulkUpdateStatus;
    const completeAll = useApi ? apiCompleteAll : localCompleteAll;
    const resetAll = useApi ? apiResetAll : localResetAll;
    const pickRandom = useApi ? apiPickRandom : localPickRandom;
    const { success, error, warning, info } = useNotification();

    const [activeFilter, setActiveFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Debounced search query для оптимизации поиска
    const debouncedSearchQuery = useDebounce(searchQuery, 1000);

    // Фильтрация и поиск
    const filteredTechnologies = technologies.filter((tech) => {
        // Фильтр по статусу
        const matchesFilter = activeFilter === "all" || tech.status === activeFilter;

        // Поиск по названию и описанию (используем debounced значение)
        const matchesSearch =
            debouncedSearchQuery === "" ||
            tech.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            tech.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const handleRandomPick = () => {
        // Находим технологии со статусом not-started
        const notStarted = technologies.filter((t) => t.status === "not-started");

        if (notStarted.length === 0) {
            warning("Все технологии уже начаты!");
            return;
        }

        // Выбираем случайную технологию
        const random = notStarted[Math.floor(Math.random() * notStarted.length)];

        // Меняем статус на in-progress
        updateStatus(random.id);

        // Прокручиваем к элементу
        setTimeout(() => {
            const element = document.querySelector(`[data-tech-id="${random.id}"]`);
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                // Добавляем анимацию выделения
                element.classList.add("highlight-animation");
                setTimeout(() => {
                    element.classList.remove("highlight-animation");
                }, 2000);
            }
        }, 100);

        info(<> <Icon icon="mdi:dice-5" style={{ verticalAlign: "middle", marginRight: 8 }} />{`Выбрана: ${random.title}`}</>);
    };

    const handleCompleteAll = () => {
        if (window.confirm("Отметить все технологии как изученные?")) {
            completeAll();
            success(<><Icon icon="mdi:check-circle" style={{ verticalAlign: "middle", marginRight: 8 }} /> Все технологии отмечены как изученные!</>);
        }
    };

    const handleResetAll = () => {
        if (window.confirm("Сбросить все статусы?")) {
            resetAll();
            info(<><Icon icon="mdi:restart" style={{ verticalAlign: "middle", marginRight: 8 }} /> Все статусы сброшены</>);
        }
    };

    const handleImport = (data) => {
        const result = importTechnologies(data);
            if (result) {
            success(<><Icon icon="mdi:download" style={{ verticalAlign: "middle", marginRight: 8 }} />{`Импортировано ${data.length} технологий`}</>);
        }
    };

    // Статистика
    const stats = {
        total: technologies.length,
        completed: technologies.filter((t) => t.status === "completed").length,
        inProgress: technologies.filter((t) => t.status === "in-progress").length,
        notStarted: technologies.filter((t) => t.status === "not-started").length,
    };

    const handleRoadmapSelect = async (roadmapId) => {
        await fetchRoadmapById(roadmapId);
        success(<><Icon icon="mdi:check-circle" style={{ verticalAlign: "middle", marginRight: 8 }} /> Роадмап загружен</>);
    };

    if (loading && technologies.length === 0) {
        return (
            <div className="app">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Загрузка роадмапов...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1><Icon icon="mdi:rocket" style={{ verticalAlign: "middle", marginRight: 8 }} /> Трекер изучения технологий</h1>
                <p>Отслеживайте свой прогресс в изучении новых технологий</p>
            </header>

            <main className="app-main">
                {apiError && <div className="error-message"><Icon icon="mdi:alert" style={{ verticalAlign: "middle", marginRight: 8 }} /> Ошибка загрузки: {apiError}</div>}

                <RoadmapSelector
                    roadmaps={roadmaps}
                    selectedRoadmap={selectedRoadmap}
                    onSelectRoadmap={handleRoadmapSelect}
                    loading={loading}
                />
                <div className="progress-section">
                    <ProgressBar
                        progress={progress}
                        label="Общий прогресс изучения"
                        color="#4CAF50"
                        animated={true}
                        height={32}
                    />

                    <div className="stats-row">
                        <div className="stat-item">
                            <span className="stat-label">Всего:</span>
                            <span className="stat-value">{stats.total}</span>
                        </div>
                        <div className="stat-item completed">
                            <span className="stat-label">Изучено:</span>
                            <span className="stat-value">{stats.completed}</span>
                        </div>
                        <div className="stat-item in-progress">
                            <span className="stat-label">В процессе:</span>
                            <span className="stat-value">{stats.inProgress}</span>
                        </div>
                        <div className="stat-item not-started">
                            <span className="stat-label">Не начато:</span>
                            <span className="stat-value">{stats.notStarted}</span>
                        </div>
                    </div>
                </div>

                <FilterBar
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <ImportExport
                    technologies={technologies}
                    onImport={handleImport}
                />

                <BulkActions
                    technologies={technologies}
                    onBulkUpdate={bulkUpdateStatus}
                />

                <div className="quick-actions">
                    <button
                        onClick={handleCompleteAll}
                        className="action-btn complete-all-btn">
                        <Icon icon="mdi:check" style={{ verticalAlign: "middle", marginRight: 8 }} /> Отметить все как изученные
                    </button>
                    <button
                        onClick={handleResetAll}
                        className="action-btn reset-btn">
                        <Icon icon="mdi:restart" style={{ verticalAlign: "middle", marginRight: 8 }} /> Сбросить все статусы
                    </button>
                    <button
                        onClick={handleRandomPick}
                        className="action-btn random-btn">
                        <Icon icon="mdi:dice-5" style={{ verticalAlign: "middle", marginRight: 8 }} /> Случайный выбор
                    </button>
                </div>

                <div className="technologies-container">
                    <h2>
                        {activeFilter === "all"
                            ? "Все технологии"
                            : activeFilter === "not-started"
                            ? "Не начатые"
                            : activeFilter === "in-progress"
                            ? "В процессе"
                            : "Изученные"}
                        {searchQuery && ` (поиск: "${searchQuery}")`}
                        <span className="count"> ({filteredTechnologies.length})</span>
                    </h2>

                    {filteredTechnologies.length === 0 ? (
                        <div className="no-results">
                            {searchQuery ? (
                                <p>По запросу "{searchQuery}" ничего не найдено <Icon icon="mdi:emoticon-sad" style={{ verticalAlign: "middle", marginLeft: 8 }} /></p>
                            ) : (
                                <p>Нет технологий с таким статусом</p>
                            )}
                        </div>
                    ) : (
                        <div className="technologies-grid">
                            {filteredTechnologies.map((tech) => (
                                <TechnologyCard
                                    key={tech.id}
                                    technology={tech}
                                    onStatusChange={updateStatus}
                                    onNotesChange={updateNotes}
                                    onUpdate={updateTechnology}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <footer className="app-footer">
                <p><Icon icon="mdi:lightbulb" style={{ verticalAlign: "middle", marginRight: 8 }} /> Совет: Кликните по карточке для смены статуса</p>
                <p>Roadmap Tracker © 2025 | Данные сохраняются автоматически</p>
            </footer>
        </div>
    );
}

export default Home;
