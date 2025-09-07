import { useState } from "react";
import { API_BASE_URL } from "./config";
import "./FormStyles.css";

function VaccineLogForm({ petId, onLogCreated, onCancel }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vaccine_type: "",
    next_due_date: "",
    notes: "",
    reminder_enabled: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/vaccine-logs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          pet_id: petId,
          next_due_date: formData.next_due_date || null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogCreated();
      } else {
        setError(data.message || "Failed to record vaccine");
      }
    } catch (error) {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Record Vaccine</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Vaccination Date *</label>
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
          <label htmlFor="vaccine_type">Vaccine Type *</label>
          <input
            type="text"
            id="vaccine_type"
            name="vaccine_type"
            value={formData.vaccine_type}
            onChange={handleChange}
            required
            placeholder="e.g., Rabies vaccine, Triple vaccine"
          />
        </div>

        <div className="form-group">
          <label htmlFor="next_due_date">Next Due Date</label>
          <input
            type="date"
            id="next_due_date"
            name="next_due_date"
            value={formData.next_due_date}
            onChange={handleChange}
            placeholder="Optional"
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

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="reminder_enabled"
              checked={formData.reminder_enabled}
              onChange={handleChange}
            />
            Enable Reminder
          </label>
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
            {loading ? "Recording..." : "Record Vaccine"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VaccineLogForm; 