import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './config';
import './FormStyles.css'; // General form styles
import './PetForm.css'; // Specific pet form styles
import './design-system.css'; // Ensure design system is imported

function PetForm({ userId, pet, onPetAdded, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    birth_date: '',
    color: '', // Added color field
    microchip_id: '', // Added microchip_id field
    notes: '', // Added notes field
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 如果是编辑模式，用现有宠物数据填充表单
  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || '',
        breed: pet.breed || '',
        birth_date: pet.birth_date || '',
        color: pet.color || '', // Populate if editing
        microchip_id: pet.microchip_id || '', // Populate if editing
        notes: pet.notes || '', // Populate if editing
      });
    }
  }, [pet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', // Clear error when user types
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Pet Name is required.';
    if (!formData.species.trim()) newErrors.species = 'Species is required.';
    // Add more validation rules as needed
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
      const url = pet ? `${API_BASE_URL}/pets/${pet.id}` : `${API_BASE_URL}/pets`;
      const method = pet ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save pet.');
      }

      const result = await response.json();
      onPetAdded(result.pet); // Pass the new/updated pet object
    } catch (error) {
      console.error("Error saving pet:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pet-form">
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="name" className="form-label">Pet Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter pet's name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="species" className="form-label">Species *</label>
          <select
            id="species"
            name="species"
            value={formData.species}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Other">Other</option>
          </select>
          {errors.species && <span className="error-message">{errors.species}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="breed" className="form-label">Breed</label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Golden Retriever, Persian"
          />
        </div>

        <div className="form-group">
          <label htmlFor="birth_date" className="form-label">Birth Date</label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="color" className="form-label">Color</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Brown, White"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="microchip_id" className="form-label">Microchip ID</label>
          <input
            type="text"
            id="microchip_id"
            name="microchip_id"
            value={formData.microchip_id}
            onChange={handleChange}
            className="form-input"
            placeholder="Microchip number (optional)"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="notes" className="form-label">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Other information to record"
          ></textarea>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (pet ? 'Save Changes' : 'Create Pet')}
        </button>
      </div>
    </form>
  );
}

export default PetForm;
