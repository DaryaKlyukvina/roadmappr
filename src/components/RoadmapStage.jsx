import { useState, useEffect } from 'react';
import './RoadmapStage.css';

function RoadmapStage({ stage, onStatusChange, onNotesChange }) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [localNotes, setLocalNotes] = useState(stage.notes || '');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalNotes(stage.notes || '');
  }, [stage.notes]);

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(stage.id, newStatus);
    }
  };

  const handleSaveNotes = () => {
    if (onNotesChange) {
      onNotesChange(stage.id, localNotes);
    }
    setIsEditingNotes(false);
  };

  const handleCancelEdit = () => {
    setLocalNotes(stage.notes || '');
    setIsEditingNotes(false);
  };

  const getStatusConfig = () => {
    switch (stage.status) {
      case 'completed':
        return { 
          color: '#4CAF50', 
          icon: '', 
          label: 'Завершено',
          bgColor: '#E8F5E9'
        };
      case 'in-progress':
        return { 
          color: '#FF9800', 
          icon: '', 
          label: 'В работе',
          bgColor: '#FFF3E0'
        };
      case 'blocked':
        return { 
          color: '#F44336', 
          icon: '', 
          label: 'Отменено',
          bgColor: '#FFEBEE'
        };
      default:
        return { 
          color: '#2196F3', 
          icon: '', 
          label: 'Запланировано',
          bgColor: '#E3F2FD'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div 
      className="roadmap-stage"
      style={{ borderLeftColor: statusConfig.color, backgroundColor: statusConfig.bgColor }}
    >
      <div className="stage-header">
        <div className="status-indicator">
          <span className="status-label" style={{ color: statusConfig.color }}>
            {statusConfig.label}
          </span>
        </div>
        
        {stage.priority && (
          <span className={`priority-badge priority-${stage.priority}`}>
            {stage.priority === 'high' ? 'Высокий' : 
             stage.priority === 'medium' ? 'Средний' : 'Низкий'}
          </span>
        )}
      </div>

      <h3 className="stage-title">{stage.title}</h3>
      <p className="stage-description">{stage.description}</p>

      <div className="stage-dates">
        {stage.createdAt && <span>Создано: {stage.createdAt}</span>}
        {stage.completedAt && <span>Завершено: {stage.completedAt}</span>}
      </div>

      <div className="stage-notes">
        <div className="notes-header">
          <h4>Заметки:</h4>
          {!isEditingNotes && (
            <button onClick={() => setIsEditingNotes(true)} className="edit-notes-btn">
              {stage.notes ? 'Редактировать' : 'Добавить заметку'}
            </button>
          )}
        </div>

        {isEditingNotes ? (
          <div className="notes-edit-mode">
            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Добавьте заметки по этому этапу..."
              rows="3"
              className="notes-textarea"
            />
            <div className="notes-actions">
              <button onClick={handleSaveNotes} className="save-btn">Сохранить</button>
              <button onClick={handleCancelEdit} className="cancel-btn">Отмена</button>
            </div>
          </div>
        ) : (
          <div className="notes-display">
            {stage.notes ? <p>{stage.notes}</p> : <p className="no-notes">Заметок пока нет</p>}
          </div>
        )}
      </div>

      <div className="stage-actions">
        {stage.status === 'planned' && (
          <>
            <button onClick={() => handleStatusChange('in-progress')} className="action-btn start-btn">
              Начать работу
            </button>
            <button onClick={() => handleStatusChange('blocked')} className="action-btn block-btn">
              Закрыть
            </button>
          </>
        )}

        {stage.status === 'in-progress' && (
          <>
            <button onClick={() => handleStatusChange('completed')} className="action-btn complete-btn">
              Завершить
            </button>
            <button onClick={() => handleStatusChange('planned')} className="action-btn postpone-btn">
              Вернуть в план
            </button>
          </>
        )}

        {stage.status === 'completed' && (
          <button onClick={() => handleStatusChange('in-progress')} className="action-btn reopen-btn">
            Открыть заново
          </button>
        )}

        {stage.status === 'blocked' && (
          <button onClick={() => handleStatusChange('in-progress')} className="action-btn unblock-btn">
            Возобновить
          </button>
        )}
      </div>
    </div>
  );
}

export default RoadmapStage;