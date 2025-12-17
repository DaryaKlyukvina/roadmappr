import { useState, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const API_BASE_URL = "https://roadmap-api.nekotyan2d.ru";

function useTechnologiesApi() {
    const [technologies, setTechnologies] = useState([]);
    const [localTechnologies, setLocalTechnologies] = useLocalStorage("roadmap-api-technologies", []);
    const [roadmaps, setRoadmaps] = useState([]);
    const [selectedRoadmap, setSelectedRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка списка всех роадмапов
    const fetchRoadmaps = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/roadmaps`);
            if (!response.ok) {
                throw new Error("Не удалось загрузить список роадмапов");
            }
            const data = await response.json();
            // API возвращает массив RoadmapShortItem[] напрямую
            const roadmapsList = Array.isArray(data.response) ? data.response : [];
            setRoadmaps(roadmapsList);
            return roadmapsList;
        } catch (err) {
            console.error("Ошибка загрузки роадмапов:", err);
            setRoadmaps([]);
            throw err;
        }
    };

    // Загрузка конкретного роадмапа
    const fetchRoadmapById = async (roadmapId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/roadmaps/${roadmapId}`);
            if (!response.ok) {
                throw new Error(`Не удалось загрузить роадмап ${roadmapId}`);
            }
            const roadmapData = await response.json();

            // Преобразуем данные роадмапа в формат технологий
            const transformedTechnologies = transformRoadmapToTechnologies(roadmapData.response);

            // Объединяем с локальными данными, обновляя существующие и добавляя новые
            const mergedTechnologies = mergeWithLocalData(transformedTechnologies);

            setTechnologies(mergedTechnologies);
            setSelectedRoadmap(roadmapData.response);

            return mergedTechnologies;
        } catch (err) {
            setError(err.message || "Не удалось загрузить роадмап");
            console.error("Ошибка загрузки роадмапа:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Преобразование данных роадмапа в формат технологий
    // roadmapData это объект с полями: id, title, items (массив RoadmapItem[])
    const transformRoadmapToTechnologies = (roadmapData) => {
        if (!roadmapData) {
            return [];
        }

        // Получаем массив items из ответа API
        let items = [];
        if (Array.isArray(roadmapData)) {
            // Если пришел массив напрямую (RoadmapItem[])
            items = roadmapData;
        } else if (roadmapData.items && Array.isArray(roadmapData.items)) {
            // Если это объект с полем items
            items = roadmapData.items;
        } else if (typeof roadmapData === "object") {
            // API возвращает объект где ключи - это ID: { "id1": {...}, "id2": {...} }
            items = Object.entries(roadmapData).map(([id, item]) => ({
                ...item,
                id: id, // используем ключ как ID
            }));
        } else {
            return [];
        }

        // Преобразуем RoadmapItem[] в формат TechnologyCard
        const transformed = items.map((item) => ({
            id: item.id?.toString() || `item-${Math.random()}`,
            title: item.title || "Без названия",
            description: item.description || "",
            category: roadmapData.title || "general",
            difficulty: "beginner", // API не предоставляет difficulty
            status: item.state || "not-started", // используем state из API
            notes: item.note || "",
            deadline: item.deadline ? new Date(item.deadline) : null,
            resources: Array.isArray(item.links) ? item.links : [],
        }));

        return transformed;
    };

    // Объединение API данных с локальными (сохраняя изменения пользователя)
    const mergeWithLocalData = (apiTechnologies) => {
        const localData = localTechnologies;

        // Создаем Map для быстрого поиска локальных данных по ID
        const localMap = new Map(localData.map((tech) => [tech.id, tech]));

        // Объединяем: приоритет у локальных изменений (status, notes, deadline)
        const merged = apiTechnologies.map((apiTech) => {
            const localTech = localMap.get(apiTech.id);

            if (localTech) {
                // Если есть локальная версия, используем её изменения
                return {
                    ...apiTech, // базовые данные из API
                    status: localTech.status, // статус из локальных данных
                    notes: localTech.notes || apiTech.notes, // заметки (приоритет локальным)
                    deadline: localTech.deadline || apiTech.deadline, // дедлайн
                };
            }

            return apiTech; // новая технология, её еще нет в локальных данных
        });

        // Сохраняем объединенные данные в localStorage
        setLocalTechnologies(merged);

        return merged;
    };

    // Загрузка технологий (по умолчанию загружаем первый роадмап)
    const fetchTechnologies = async () => {
        try {
            setLoading(true);
            setError(null);

            // Сначала получаем список роадмапов (RoadmapShortItem[])
            const roadmapsList = await fetchRoadmaps();

            if (Array.isArray(roadmapsList) && roadmapsList.length > 0) {
                // Загружаем первый доступный роадмап по его id
                const firstRoadmapId = roadmapsList[0].id;
                if (firstRoadmapId) {
                    await fetchRoadmapById(firstRoadmapId);
                }
            } else {
                setError("Нет доступных роадмапов");
            }
        } catch (err) {
            setError("Не удалось загрузить данные");
            console.error("Ошибка загрузки:", err);
        } finally {
            setLoading(false);
        }
    };

    // Обновление статуса технологии
    const updateStatus = (id) => {
        setTechnologies((prev) => {
            const updated = prev.map((tech) => {
                if (tech.id === id) {
                    const statusCycle = {
                        "not-started": "in-progress",
                        "in-progress": "completed",
                        completed: "not-started",
                    };
                    return { ...tech, status: statusCycle[tech.status] };
                }
                return tech;
            });
            setLocalTechnologies(updated); // Сохраняем в localStorage
            return updated;
        });
    };

    // Обновление заметок
    const updateNotes = (id, notes) => {
        setTechnologies((prev) => {
            const updated = prev.map((tech) => (tech.id === id ? { ...tech, notes } : tech));
            setLocalTechnologies(updated);
            return updated;
        });
    };

    // Обновление технологии (универсальное)
    const updateTechnology = (id, updates) => {
        setTechnologies((prev) => {
            const updated = prev.map((tech) => (tech.id === id ? { ...tech, ...updates } : tech));
            setLocalTechnologies(updated);
            return updated;
        });
    };

    // Массовое обновление статуса
    const bulkUpdateStatus = (ids, newStatus) => {
        setTechnologies((prev) => {
            const updated = prev.map((tech) => (ids.includes(tech.id) ? { ...tech, status: newStatus } : tech));
            setLocalTechnologies(updated);
            return updated;
        });
    };

    // Завершить все
    const completeAll = () => {
        setTechnologies((prev) => {
            const updated = prev.map((tech) => ({ ...tech, status: "completed" }));
            setLocalTechnologies(updated);
            return updated;
        });
    };

    // Сбросить все
    const resetAll = () => {
        setTechnologies((prev) => {
            const updated = prev.map((tech) => ({ ...tech, status: "not-started", notes: "", deadline: null }));
            setLocalTechnologies(updated);
            return updated;
        });
    };

    // Случайный выбор
    const pickRandom = () => {
        const notStarted = technologies.filter((t) => t.status === "not-started");
        if (notStarted.length > 0) {
            const random = notStarted[Math.floor(Math.random() * notStarted.length)];
            updateStatus(random.id);
            return random;
        }
        return null;
    };

    // Прогресс
    const progress = {
        total: technologies.length,
        completed: technologies.filter((t) => t.status === "completed").length,
        inProgress: technologies.filter((t) => t.status === "in-progress").length,
    };

    // Добавление новой технологии
    const addTechnology = async (techData) => {
        try {
            const newTech = {
                id: Date.now().toString(),
                ...techData,
                status: techData.status || "not-started",
                notes: techData.notes || "",
                createdAt: new Date().toISOString(),
            };

            setTechnologies((prev) => [...prev, newTech]);
            return newTech;
        } catch (err) {
            throw new Error("Не удалось добавить технологию");
        }
    };

    // Загружаем технологии при монтировании
    useEffect(() => {
        fetchTechnologies();
    }, []);

    return {
        technologies,
        roadmaps,
        selectedRoadmap,
        loading,
        error,
        progress,
        refetch: fetchTechnologies,
        fetchRoadmapById,
        addTechnology,
        updateStatus,
        updateNotes,
        updateTechnology,
        bulkUpdateStatus,
        completeAll,
        resetAll,
        pickRandom,
    };
}

export default useTechnologiesApi;
