import { useState } from "react";
import { API_BASE_URL } from "./config";
import "./PetForm.css";

function PetForm({ userId, onPetCreated, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    species: "dog",
    breed: "",
    birth_date: "",
    gender: "male",
    weight: "",
    color: "",
    microchip_id: "",
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
      const response = await fetch(`${API_BASE_URL}/pets/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          user_id: userId,
          weight: formData.weight ? parseFloat(formData.weight) : null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onPetCreated(data.pet);
      } else {
        setError(data.message || "Failed to create pet");
      }
    } catch (error) {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pet-form">
      <h2>Add New Pet</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Pet Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter pet name"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="species">Species *</label>
            <select
              id="species"
              name="species"
              value={formData.species}
              onChange={handleChange}
              required
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="rabbit">Rabbit</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender *</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="breed">Breed</label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            placeholder="e.g., Golden Retriever, Persian"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="birth_date">Birth Date</label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              step="0.1"
              min="0"
              placeholder="0.0"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="color">Color</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="e.g., Brown, White"
          />
        </div>

        <div className="form-group">
          <label htmlFor="microchip_id">Microchip ID</label>
          <input
            type="text"
            id="microchip_id"
            name="microchip_id"
            value={formData.microchip_id}
            onChange={handleChange}
            placeholder="Microchip number (optional)"
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
            {loading ? "Creating..." : "Create Pet"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PetForm; 