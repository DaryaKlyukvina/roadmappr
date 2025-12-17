import { useState } from "react";
import "./RoadmapSelector.css";

function RoadmapSelector({ roadmaps, selectedRoadmap, onSelectRoadmap, loading }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (roadmap) => {
        onSelectRoadmap(roadmap.id);
        setIsOpen(false);
    };

    if (loading || !Array.isArray(roadmaps) || roadmaps.length === 0) {
        return null;
    }

    // Получаем ID выбранного роадмапа
    const selectedId = selectedRoadmap?.id || selectedRoadmap?._id;

    return (
        <div className="roadmap-selector">
            <button
                className="roadmap-selector-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label="Выбрать роадмап">
                <span className="current-roadmap">📍 {selectedRoadmap?.title || "Выберите роадмап"}</span>
                <span className="dropdown-icon">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="roadmap-selector-overlay"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="roadmap-selector-dropdown">
                        <h3>Выберите роадмап</h3>
                        <div className="roadmap-list">
                            {roadmaps.map((roadmap) => {
                                const isSelected = roadmap.id === selectedId;

                                return (
                                    <button
                                        key={roadmap.id}
                                        className={`roadmap-item ${isSelected ? "selected" : ""}`}
                                        onClick={() => handleSelect(roadmap)}>
                                        <div className="roadmap-item-content">
                                            <h4>{roadmap.title}</h4>
                                            {roadmap.description && <p>{roadmap.description}</p>}
                                        </div>
                                        {isSelected && <span className="check-icon">✓</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default RoadmapSelector;
