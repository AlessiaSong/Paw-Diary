import { useState } from "react";
import { Weight, Calendar, FileText } from "lucide-react";
import { API_BASE_URL } from "./config";
import "./FormStyles.css";

function WeightLogForm({ petId, onSuccess }) {
  const [formData, setFormData] = useState({
    weight: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (!formData.weight.trim()) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(parseFloat(formData.weight)) || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be a positive number';
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
      const response = await fetch(`${API_BASE_URL}/weight_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pet_id: petId,
          weight_kg: parseFloat(formData.weight)
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        console.error('Error creating weight log:', errorData);
        alert('Failed to create weight log. Please try again.');
      }
    } catch (error) {
      console.error('Error creating weight log:', error);
      alert('Failed to create weight log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Record Weight</h2>
        <p className="form-subtitle">Track your pet's weight changes over time</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label" htmlFor="weight">
            Weight (kg) *
          </label>
          <div className="input-group">
            <Weight size={18} className="input-icon" />
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className={`form-input ${errors.weight ? 'error' : ''}`}
              placeholder="Enter weight in kilograms"
              step="0.1"
              min="0"
              required
            />
          </div>
          {errors.weight && <span className="error-message">{errors.weight}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="date">
            Date *
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
              placeholder="Any additional notes about this weight record..."
              rows={3}
            />
          </div>
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
                <Weight size={16} />
                Record Weight
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WeightLogForm;
