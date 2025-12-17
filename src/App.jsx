import { useState, useEffect } from 'react';
import RoadmapStage from './components/RoadmapStage';
import ProgressDashboard from './components/ProgressDashboard';
import AddStageForm from './components/AddStageForm';
import './App.css';

const initialStages = [
  {
    id: 1,
    title: "Анализ требований",
    description: "Сбор и анализ требований заказчика",
    status: "completed",
    notes: "Провели 3 встречи, ТЗ согласовано",
    priority: "high",
    estimatedDays: 5,
    createdAt: "15.01.2025",
    completedAt: "20.01.2025"
  },
  {
    id: 2,
    title: "Проектирование архитектуры",
    description: "Создание UML-диаграмм и схем БД",
    status: "in-progress",
    notes: "Закончили диаграмму Use Case, работаем над ER-диаграммой",
    priority: "high",
    estimatedDays: 7,
    createdAt: "21.01.2025"
  },
  {
    id: 3,
    title: "Фронтенд разработка",
    description: "Вёрстка и React-компоненты",
    status: "planned",
    notes: "",
    priority: "medium",
    estimatedDays: 14,
    createdAt: "22.01.2025"
  },
  {
    id: 4,
    title: "Интеграция с платежной системой",
    description: "Подключение Stripe/PayPal API",
    status: "blocked",
    notes: "Ожидаем доступ к тестовому окружению",
    priority: "high",
    estimatedDays: 5,
    createdAt: "22.01.2025"
  }
];

function App() {
  const [stages, setStages] = useState(() => {
    const saved = localStorage.getItem('roadmap-stages');
    return saved ? JSON.parse(saved) : initialStages;
  });

  useEffect(() => {
    localStorage.setItem('roadmap-stages', JSON.stringify(stages));
  }, [stages]);

  const handleStatusChange = (stageId, newStatus) => {
    setStages(prevStages => 
      prevStages.map(stage => 
        stage.id === stageId 
          ? { 
              ...stage, 
              status: newStatus,
              ...(newStatus === 'completed' && !stage.completedAt 
                ? { completedAt: new Date().toLocaleDateString('ru-RU') } 
                : {})
            } 
          : stage
      )
    );
  };

  const handleNotesChange = (stageId, newNotes) => {
    setStages(prevStages => 
      prevStages.map(stage => 
        stage.id === stageId ? { ...stage, notes: newNotes } : stage
      )
    );
  };

  const handleAddStage = (newStage) => {
    setStages(prev => [...prev, newStage]);
  };

  const handleCompleteAll = () => {
    setStages(prevStages => 
      prevStages.map(stage => ({
        ...stage,
        status: 'completed',
        completedAt: stage.completedAt || new Date().toLocaleDateString('ru-RU')
      }))
    );
  };

  const handleResetAll = () => {
    setStages(prevStages => 
      prevStages.map(stage => ({
        ...stage,
        status: 'planned',
        completedAt: null
      }))
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Roadmap Progress Tracker</h1>
        <p>Отслеживание этапов проекта в реальном времени</p>
      </header>

      <main className="app-main">
        <ProgressDashboard stages={stages} />
        
        <AddStageForm onAddStage={handleAddStage} />
        
        <div className="quick-actions">
          <button onClick={handleCompleteAll} className="action-btn complete-all-btn">
            ✅ Отметить все как завершённые
          </button>
          <button onClick={handleResetAll} className="action-btn reset-btn">
            🔄 Сбросить все статусы
          </button>
        </div>

        <div className="stages-container">
          <h2>Этапы проекта ({stages.length})</h2>
          
          {stages.length === 0 ? (
            <p className="no-stages">Этапов пока нет. Добавьте первый этап!</p>
          ) : (
            stages.map(stage => (
              <RoadmapStage
                key={stage.id}
                stage={stage}
                onStatusChange={handleStatusChange}
                onNotesChange={handleNotesChange}
              />
            ))
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Roadmap Tracker © 2025 | Данные сохраняются в localStorage</p>
      </footer>
    </div>
  );
}

export default App;
