import { useState } from 'react';
import './AddStageForm.css';

function AddStageForm({ onAddStage }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    estimatedDays: 3
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedDays' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newStage = {
      id: Date.now(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      estimatedDays: formData.estimatedDays,
      status: 'planned',
      notes: '',
      createdAt: new Date().toLocaleDateString('ru-RU')
    };

    if (newStage.title && newStage.description) {
      onAddStage(newStage);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        estimatedDays: 3
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-stage-form">
      <h3>Добавить новый этап</h3>
      
      <div className="form-group">
        <label>Название этапа *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Например: 'Проектирование БД'"
          required
        />
      </div>

      <div className="form-group">
        <label>Описание *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Подробное описание этапа..."
          rows="3"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Приоритет</label>
          <select 
            name="priority" 
            value={formData.priority} 
            onChange={handleChange}
          >
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </div>

        <div className="form-group">
          <label>Оценка времени (дни)</label>
          <input
            type="number"
            name="estimatedDays"
            value={formData.estimatedDays}
            onChange={handleChange}
            min="1"
            max="100"
          />
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Добавить этап
      </button>
    </form>
  );
}

export default AddStageForm;