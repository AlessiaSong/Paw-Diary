import { useState } from "react";
import { API_BASE_URL } from "./config";
import "./FormStyles.css";

function WeightLogForm({ petId, onLogCreated, onCancel }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: "",
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
      const response = await fetch(`${API_BASE_URL}/weight-logs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          pet_id: petId,
          weight_kg: parseFloat(formData.weight)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogCreated();
      } else {
        setError(data.message || "Failed to record weight");
      }
    } catch (error) {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Record Weight</h2>
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
          <label htmlFor="weight">Weight (kg) *</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            step="0.1"
            min="0"
            required
            placeholder="Enter weight"
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
            {loading ? "Recording..." : "Record Weight"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WeightLogForm; 