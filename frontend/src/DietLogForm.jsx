import { useState } from "react";
import { API_BASE_URL } from "./config";
import "./FormStyles.css";

function DietLogForm({ petId, onLogCreated, onCancel }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    food_type: "",
    amount: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/diet-logs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          pet_id: petId,
          description: formData.food_type,
          food_amount: formData.amount ? parseFloat(formData.amount) : null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogCreated();
      } else {
        setError(data.message || "Failed to record diet");
      }
    } catch (error) {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Record Diet</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="food_type">Food Type *</label>
          <input
            type="text"
            id="food_type"
            name="food_type"
            value={formData.food_type}
            onChange={handleChange}
            required
            placeholder="e.g., Dog food, Cat food, Treats"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="e.g., 100g, 1 cup"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Other information to record"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Recording..." : "Record Diet"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DietLogForm; 