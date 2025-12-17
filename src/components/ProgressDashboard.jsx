import './ProgressDashboard.css';

function ProgressDashboard({ stages }) {
  const total = stages.length;
  const completed = stages.filter(s => s.status === 'completed').length;
  const inProgress = stages.filter(s => s.status === 'in-progress').length;
  const planned = stages.filter(s => s.status === 'planned').length;
  const blocked = stages.filter(s => s.status === 'blocked').length;
  
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-dashboard">
      <h2>Прогресс проекта</h2>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="progress-text">{progress}% завершено</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Всего этапов</h3>
          <p className="stat-number">{total}</p>
        </div>
        
        <div className="stat-card completed">
          <h3>Завершено</h3>
          <p className="stat-number">{completed}</p>
        </div>
        
        <div className="stat-card in-progress">
          <h3>В работе</h3>
          <p className="stat-number">{inProgress}</p>
        </div>
        
        <div className="stat-card planned">
          <h3>Запланировано</h3>
          <p className="stat-number">{planned}</p>
        </div>
        
        <div className="stat-card blocked">
          <h3>Отменено</h3>
          <p className="stat-number">{blocked}</p>
        </div>
      </div>
    </div>
  );
}

export default ProgressDashboard;