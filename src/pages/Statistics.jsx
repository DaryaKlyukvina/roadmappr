import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useTechnologiesApi from "../hooks/useTechnologiesApi";
import useTechnologies from "../hooks/useTechnologies";
import "./Statistics.css";
import { Icon } from "@iconify/react";

function Statistics() {
    const { technologies: apiTechnologies } = useTechnologiesApi();

    const { technologies: localTechnologies } = useTechnologies();

    const navigate = useNavigate();

    // Используем API данные если загружены, иначе локальные
    const technologies = apiTechnologies.length > 0 ? apiTechnologies : localTechnologies;

    useEffect(() => {
        if (technologies.length === 0) {
            navigate("/");
        }
    }, [technologies, navigate]);

    const notStartedCount = technologies.filter((item) => item.status === "not-started").length;
    const inProgressCount = technologies.filter((item) => item.status === "in-progress").length;
    const completedCount = technologies.filter((item) => item.status === "completed").length;
    const totalCount = technologies.length;

    const data = [
        { name: "Не начато", value: notStartedCount, color: "#ff9800" },
        { name: "В процессе", value: inProgressCount, color: "#2196F3" },
        { name: "Выполнено", value: completedCount, color: "#4CAF50" },
    ];

    const calculatePieSegments = (data) => {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        if (total === 0) return [];

        let cumulativePercent = 0;

        return data.map((item) => {
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
            cumulativePercent += item.value / total;
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

            const largeArcFlag = item.value / total > 0.5 ? 1 : 0;

            return {
                d: `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`,
                color: item.color,
            };
        });
    };

    const getCoordinatesForPercent = (percent) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const pieSegments = calculatePieSegments(data);

    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="statistics-page">
            <div className="statistics-header">
                <h1><Icon icon="mdi:chart-bar" style={{ verticalAlign: "middle", marginRight: 8 }} /> Статистика изучения</h1>
                <p>Визуализация вашего прогресса</p>
            </div>

            <div className="statistics-container">
                <div className="statistics-overview">
                    <div className="overview-card total">
                        <div className="overview-icon"><Icon icon="mdi:book-open" /></div>
                        <div className="overview-content">
                            <div className="overview-label">Всего технологий</div>
                            <div className="overview-value">{totalCount}</div>
                        </div>
                    </div>
                    <div className="overview-card progress">
                        <div className="overview-icon"><Icon icon="mdi:timer-sand" /></div>
                        <div className="overview-content">
                            <div className="overview-label">Общий прогресс</div>
                            <div className="overview-value">{progressPercent}%</div>
                        </div>
                    </div>
                </div>

                <div className="statistics-info">
                    <div className="statistics-item not-started">
                        <div className="statistics-item__title">Не начато</div>
                        <div className="statistics-item__number">{notStartedCount}</div>
                        <div className="statistics-item__percent">
                            {totalCount > 0 ? Math.round((notStartedCount / totalCount) * 100) : 0}%
                        </div>
                    </div>
                    <div className="statistics-item in-progress">
                        <div className="statistics-item__title">В процессе</div>
                        <div className="statistics-item__number">{inProgressCount}</div>
                        <div className="statistics-item__percent">
                            {totalCount > 0 ? Math.round((inProgressCount / totalCount) * 100) : 0}%
                        </div>
                    </div>
                    <div className="statistics-item completed">
                        <div className="statistics-item__title">Выполнено</div>
                        <div className="statistics-item__number">{completedCount}</div>
                        <div className="statistics-item__percent">
                            {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                        </div>
                    </div>
                </div>

                <div className="chart-container">
                    <h3>Распределение по статусам</h3>
                    {totalCount > 0 ? (
                        <div className="donut-chart">
                            <svg
                                viewBox="-1 -1 2 2"
                                style={{ transform: "rotate(-90deg)" }}>
                                <defs>
                                    <mask id="donut-mask">
                                        <rect
                                            x="-1"
                                            y="-1"
                                            width="2"
                                            height="2"
                                            fill="white"
                                        />
                                        <circle
                                            cx="0"
                                            cy="0"
                                            r="0.6"
                                            fill="black"
                                        />
                                    </mask>
                                </defs>
                                {pieSegments.map((segment, index) => (
                                    <path
                                        key={index}
                                        d={segment.d}
                                        fill={segment.color}
                                        mask="url(#donut-mask)"
                                    />
                                ))}
                            </svg>
                            <div className="chart-center">
                                <div className="chart-center-value">{progressPercent}%</div>
                                <div className="chart-center-label">завершено</div>
                            </div>
                        </div>
                    ) : (
                        <div className="no-data">Нет данных для отображения</div>
                    )}
                </div>

                <div className="chart-legend">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="legend-item">
                            <div
                                className="legend-color"
                                style={{ backgroundColor: item.color }}></div>
                            <div className="legend-label">{item.name}</div>
                            <div className="legend-value">{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Statistics;
