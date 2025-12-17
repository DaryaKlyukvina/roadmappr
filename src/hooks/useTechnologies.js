import useLocalStorage from "./useLocalStorage";

const initialTechnologies = [
    {
        id: 1,
        title: "React Components",
        description: "Изучение базовых компонентов",
        status: "completed",
        notes: "Освоил функциональные и классовые компоненты",
        category: "frontend",
    },
    {
        id: 2,
        title: "JSX Syntax",
        description: "Освоение синтаксиса JSX",
        status: "in-progress",
        notes: "Изучаю условный рендеринг",
        category: "frontend",
    },
    {
        id: 3,
        title: "State Management",
        description: "Работа с состоянием компонентов",
        status: "not-started",
        notes: "",
        category: "frontend",
    },
];

function useTechnologies() {
    const [technologies, setTechnologies] = useLocalStorage("roadmap-technologies", initialTechnologies);

    // Функция для обновления статуса технологии
    const updateStatus = (techId, newStatus) => {
        setTechnologies((prev) => prev.map((tech) => (tech.id === techId ? { ...tech, status: newStatus } : tech)));
    };

    // Функция для обновления заметок
    const updateNotes = (techId, newNotes) => {
        setTechnologies((prev) => prev.map((tech) => (tech.id === techId ? { ...tech, notes: newNotes } : tech)));
    };

    // Функция для добавления новой технологии
    const addTechnology = (newTech) => {
        const technology = {
            id: Date.now(),
            ...newTech,
            status: newTech.status || "not-started",
            notes: newTech.notes || "",
            createdAt: new Date().toLocaleDateString("ru-RU"),
        };
        setTechnologies((prev) => [...prev, technology]);
    };

    // Функция для расчета общего прогресса
    const calculateProgress = () => {
        if (technologies.length === 0) return 0;
        const completed = technologies.filter((tech) => tech.status === "completed").length;
        return Math.round((completed / technologies.length) * 100);
    };

    // Быстрые действия
    const completeAll = () => {
        setTechnologies((prev) => prev.map((tech) => ({ ...tech, status: "completed" })));
    };

    const resetAll = () => {
        setTechnologies((prev) => prev.map((tech) => ({ ...tech, status: "not-started" })));
    };

    const pickRandom = () => {
        const notStarted = technologies.filter((t) => t.status === "not-started");
        if (notStarted.length > 0) {
            const random = notStarted[Math.floor(Math.random() * notStarted.length)];
            return random;
        }
        return null;
    };

    // Массовое обновление статуса
    const bulkUpdateStatus = (ids, newStatus) => {
        setTechnologies((prev) => prev.map((tech) => (ids.includes(tech.id) ? { ...tech, status: newStatus } : tech)));
    };

    // Импорт данных
    const importTechnologies = (newTechnologies) => {
        if (
            window.confirm(
                `Заменить текущие данные (${technologies.length} технологий) на импортируемые (${newTechnologies.length})?`
            )
        ) {
            setTechnologies(newTechnologies);
            return true;
        }
        return false;
    };

    // Обновление полной информации о технологии
    const updateTechnology = (updatedTech) => {
        setTechnologies((prev) => prev.map((tech) => (tech.id === updatedTech.id ? updatedTech : tech)));
    };

    return {
        technologies,
        updateStatus,
        updateNotes,
        addTechnology,
        progress: calculateProgress(),
        completeAll,
        resetAll,
        pickRandom,
        bulkUpdateStatus,
        importTechnologies,
        updateTechnology,
    };
}

export default useTechnologies;
