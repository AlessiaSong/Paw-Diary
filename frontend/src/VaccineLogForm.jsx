import { useState } from "react";
import { TrendingUp, Calendar, FileText, Clock } from "lucide-react";
import { API_BASE_URL } from "./config";
import "./FormStyles.css";

function VaccineLogForm({ petId, onSuccess }) {
  const [formData, setFormData] = useState({
    vaccine_type: '',
    date: new Date().toISOString().split('T')[0],
    next_due_date: '',
    notes: '',
    reminder_enabled: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vaccine_type.trim()) {
      newErrors.vaccine_type = 'Vaccine type is required';
    }
    
    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/vaccine_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pet_id: petId
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        console.error('Error creating vaccine log:', errorData);
        alert('Failed to create vaccine log. Please try again.');
      }
    } catch (error) {
      console.error('Error creating vaccine log:', error);
      alert('Failed to create vaccine log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Record Vaccine</h2>
        <p className="form-subtitle">Track your pet's vaccination history</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label" htmlFor="vaccine_type">
            Vaccine Type *
          </label>
          <div className="input-group">
            <TrendingUp size={18} className="input-icon" />
            <input
              type="text"
              id="vaccine_type"
              name="vaccine_type"
              value={formData.vaccine_type}
              onChange={handleChange}
              className={`form-input ${errors.vaccine_type ? 'error' : ''}`}
              placeholder="e.g., Rabies, DHPP, Bordetella"
              required
            />
          </div>
          {errors.vaccine_type && <span className="error-message">{errors.vaccine_type}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="date">
              Vaccination Date *
            </label>
            <div className="input-group">
              <Calendar size={18} className="input-icon" />
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`form-input ${errors.date ? 'error' : ''}`}
                required
              />
            </div>
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="next_due_date">
              Next Due Date
            </label>
            <div className="input-group">
              <Clock size={18} className="input-icon" />
              <input
                type="date"
                id="next_due_date"
                name="next_due_date"
                value={formData.next_due_date}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="notes">
            Notes
          </label>
          <div className="input-group">
            <FileText size={18} className="input-icon" />
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Any additional notes about this vaccination..."
              rows={3}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="reminder_enabled"
              checked={formData.reminder_enabled}
              onChange={handleChange}
              className="checkbox-input"
            />
            <span className="checkbox-text">Enable reminder for next vaccination</span>
          </label>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner-small"></div>
                Recording...
              </>
            ) : (
              <>
                <TrendingUp size={16} />
                Record Vaccine
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VaccineLogForm;
