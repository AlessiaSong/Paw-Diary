import { useState } from "react";
import { UtensilsCrossed, Calendar, Hash, FileText } from "lucide-react";
import { API_BASE_URL } from "./config";
import "./FormStyles.css";

function DietLogForm({ petId, onSuccess }) {
  const [formData, setFormData] = useState({
    food_type: '',
    amount: '',
    unit: 'g',
    date: new Date().toISOString().split('T')[0],
    meal_type: 'breakfast',
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
    
    if (!formData.food_type.trim()) {
      newErrors.food_type = 'Food type is required';
    }
    
    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    }
    
    if (formData.amount && (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0)) {
      newErrors.amount = 'Amount must be a positive number';
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
      const response = await fetch(`${API_BASE_URL}/diet_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pet_id: petId,
          description: formData.food_type,
          food_amount: formData.amount ? parseFloat(formData.amount) : null
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        console.error('Error creating diet log:', errorData);
        alert('Failed to create diet log. Please try again.');
      }
    } catch (error) {
      console.error('Error creating diet log:', error);
      alert('Failed to create diet log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Record Diet</h2>
        <p className="form-subtitle">Log your pet's meals and nutrition</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label" htmlFor="food_type">
            Food Type *
          </label>
          <div className="input-group">
            <UtensilsCrossed size={18} className="input-icon" />
            <input
              type="text"
              id="food_type"
              name="food_type"
              value={formData.food_type}
              onChange={handleChange}
              className={`form-input ${errors.food_type ? 'error' : ''}`}
              placeholder="e.g., Dry food, Wet food, Treats"
              required
            />
          </div>
          {errors.food_type && <span className="error-message">{errors.food_type}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="amount">
              Amount
            </label>
            <div className="input-group">
              <Hash size={18} className="input-icon" />
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={`form-input ${errors.amount ? 'error' : ''}`}
                placeholder="0"
                step="0.1"
                min="0"
              />
            </div>
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="unit">
              Unit
            </label>
            <div className="input-group">
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="form-select"
              >
                <option value="g">Grams (g)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="cups">Cups</option>
                <option value="pieces">Pieces</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-row">
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
            <label className="form-label" htmlFor="meal_type">
              Meal Type
            </label>
            <div className="input-group">
              <select
                id="meal_type"
                name="meal_type"
                value={formData.meal_type}
                onChange={handleChange}
                className="form-select"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
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
              placeholder="Any additional notes about this meal..."
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
                <UtensilsCrossed size={16} />
                Record Diet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DietLogForm;
