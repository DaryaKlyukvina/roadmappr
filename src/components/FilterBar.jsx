import "./FilterBar.css";
import { Icon } from "@iconify/react";

function FilterBar({ activeFilter, onFilterChange, searchQuery, onSearchChange }) {
    const filters = [
        { value: "all", label: "Все" },
        { value: "not-started", label: "Не начато" },
        { value: "in-progress", label: "В процессе" },
        { value: "completed", label: "Изучено" },
    ];

    return (
        <div className="filter-bar">
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Поиск по названию или описанию..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="search-input"
                />
                <span className="search-icon"><Icon icon="mdi:magnify" /></span>
            </div>

            <div className="filter-buttons">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        className={`filter-btn ${activeFilter === filter.value ? "active" : ""}`}
                        onClick={() => onFilterChange(filter.value)}>
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FilterBar;
