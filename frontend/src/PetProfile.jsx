import React, { useState, useEffect } from 'react';
import { PawPrint, Plus, Scale, Utensils, Syringe, CalendarDays, Edit } from 'lucide-react';
import WeightLogForm from './WeightLogForm';
import DietLogForm from './DietLogForm';
import VaccineLogForm from './VaccineLogForm';
import PetForm from './PetForm'; // For editing pet details
import { API_BASE_URL } from './config';
import './PetProfile.css';
import './design-system.css'; // Ensure design system is imported

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function PetProfile({ pet, onPetUpdated }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [weightLogs, setWeightLogs] = useState([]);
  const [dietLogs, setDietLogs] = useState([]);
  const [vaccineLogs, setVaccineLogs] = useState([]);
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [showDietForm, setShowDietForm] = useState(false);
  const [showVaccineForm, setShowVaccineForm] = useState(false);
  const [showEditPetForm, setShowEditPetForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pet) {
      fetchPetLogs();
    }
  }, [pet]);

  const fetchPetLogs = async () => {
    setLoading(true);
    try {
      const [weightRes, dietRes, vaccineRes] = await Promise.all([
        fetch(`${API_BASE_URL}/pets/${pet.id}/weight_logs`),
        fetch(`${API_BASE_URL}/pets/${pet.id}/diet_logs`),
        fetch(`${API_BASE_URL}/pets/${pet.id}/vaccine_logs`),
      ]);

      const weightData = await weightRes.json();
      const dietData = await dietRes.json();
      const vaccineData = await vaccineRes.json();

      setWeightLogs(weightData.weight_logs || []);
      setDietLogs(dietData.diet_logs || []);
      setVaccineLogs(vaccineData.vaccine_logs || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pet logs:", error);
      setLoading(false);
    }
  };

  const getLatestWeight = () => {
    if (weightLogs.length === 0) return null;
    return weightLogs.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };

  const getUpcomingVaccine = () => {
    if (vaccineLogs.length === 0) return null;
    const upcoming = vaccineLogs.filter(v => v.next_due_date && new Date(v.next_due_date) > new Date());
    return upcoming.sort((a, b) => new Date(a.next_due_date) - new Date(b.next_due_date))[0];
  };

  const handleLogAdded = () => {
    fetchPetLogs(); // Refresh logs after adding
    setShowWeightForm(false);
    setShowDietForm(false);
    setShowVaccineForm(false);
  };

  const handlePetEdit = (updatedPet) => {
    onPetUpdated(updatedPet); // Update pet in Dashboard state
    setShowEditPetForm(false);
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  const latestWeight = getLatestWeight();
  const upcomingVaccine = getUpcomingVaccine();

  return (
    <div className="pet-profile-container">
      <div className="pet-header-card">
        <PawPrint size={40} className="pet-header-icon" />
        <div className="pet-header-info">
          <h2 className="pet-header-name">{pet.name}</h2>
          <p className="pet-header-details">
            {pet.species} &bull; {pet.breed || 'Unknown Breed'} &bull; Born: {formatDate(pet.birth_date)}
          </p>
        </div>
        <button className="btn btn-text edit-pet-btn" onClick={() => setShowEditPetForm(true)}>
          <Edit size={20} /> Edit
        </button>
      </div>

      <div className="tabs-navigation">
        <button
          className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-item ${activeTab === 'weight' ? 'active' : ''}`}
          onClick={() => setActiveTab('weight')}
        >
          Weight
        </button>
        <button
          className={`tab-item ${activeTab === 'diet' ? 'active' : ''}`}
          onClick={() => setActiveTab('diet')}
        >
          Diet
        </button>
        <button
          className={`tab-item ${activeTab === 'vaccines' ? 'active' : ''}`}
          onClick={() => setActiveTab('vaccines')}
        >
          Vaccines
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="info-card">
              <h3 className="card-title">Basic Information</h3>
              <p><strong>Species:</strong> {pet.species}</p>
              <p><strong>Breed:</strong> {pet.breed || 'N/A'}</p>
              <p><strong>Birth Date:</strong> {formatDate(pet.birth_date)}</p>
            </div>

            <div className="info-card">
              <h3 className="card-title">Current Weight</h3>
              {latestWeight ? (
                <p className="current-weight-display">
                  <span className="weight-value">{latestWeight.weight_kg} kg</span>
                  <span className="weight-date">({formatDate(latestWeight.date)})</span>
                </p>
              ) : (
                <p className="no-data">No weight records yet.</p>
              )}
              <button className="btn btn-primary btn-sm" onClick={() => setShowWeightForm(true)}>
                <Plus size={16} /> Record Weight
              </button>
            </div>

            <div className="info-card">
              <h3 className="card-title">Upcoming Vaccine</h3>
              {upcomingVaccine ? (
                <p className="upcoming-vaccine-display">
                  <span className="vaccine-type">{upcomingVaccine.vaccine_type}</span> due on{' '}
                  <span className="vaccine-date">{formatDate(upcomingVaccine.next_due_date)}</span>
                </p>
              ) : (
                <p className="no-data">No upcoming vaccines.</p>
              )}
              <button className="btn btn-primary btn-sm" onClick={() => setShowVaccineForm(true)}>
                <Plus size={16} /> Record Vaccine
              </button>
            </div>

            <div className="info-card full-width">
              <h3 className="card-title">Recent Diet</h3>
              {dietLogs.length > 0 ? (
                <div className="recent-diet-list">
                  {dietLogs.slice(0, 3).map((log) => (
                    <div key={log.id} className="diet-log-item-overview">
                      <span className="diet-desc">{log.description}</span>
                      <span className="diet-amount">{log.food_amount}{log.unit}</span>
                      <span className="diet-date">{formatDate(log.date)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No diet records yet.</p>
              )}
              <button className="btn btn-primary btn-sm" onClick={() => setShowDietForm(true)}>
                <Plus size={16} /> Record Diet
              </button>
            </div>
          </div>
        )}

        {activeTab === 'weight' && (
          <div className="log-section">
            <div className="section-header">
              <h3 className="section-title">Weight History</h3>
              <button className="btn btn-primary" onClick={() => setShowWeightForm(true)}>
                <Plus size={16} /> Record Weight
              </button>
            </div>
            <div className="log-list">
              {weightLogs.length > 0 ? (
                weightLogs.map((log) => (
                  <div key={log.id} className="log-item">
                    <Scale size={20} className="log-icon" />
                    <div className="log-details">
                      <span className="log-value">{log.weight_kg} kg</span>
                      <span className="log-date">{formatDate(log.date)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">No weight records.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'diet' && (
          <div className="log-section">
            <div className="section-header">
              <h3 className="section-title">Diet History</h3>
              <button className="btn btn-secondary" onClick={() => setShowDietForm(true)}>
                <Plus size={16} /> Record Diet
              </button>
            </div>
            <div className="log-list">
              {dietLogs.length > 0 ? (
                dietLogs.map((log) => (
                  <div key={log.id} className="log-item">
                    <Utensils size={20} className="log-icon" />
                    <div className="log-details">
                      <span className="log-value">{log.description} - {log.food_amount}{log.unit}</span>
                      <span className="log-date">{formatDate(log.date)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">No diet records.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'vaccines' && (
          <div className="log-section">
            <div className="section-header">
              <h3 className="section-title">Vaccination History</h3>
              <button className="btn btn-accent" onClick={() => setShowVaccineForm(true)}>
                <Plus size={16} /> Record Vaccine
              </button>
            </div>
            <div className="log-list">
              {vaccineLogs.length > 0 ? (
                vaccineLogs.map((log) => (
                  <div key={log.id} className="log-item">
                    <Syringe size={20} className="log-icon" />
                    <div className="log-details">
                      <span className="log-value">{log.vaccine_type}</span>
                      <span className="log-date">Administered: {formatDate(log.date)}</span>
                      {log.next_due_date && (
                        <span className="log-due-date">Next Due: {formatDate(log.next_due_date)}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">No vaccine records.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals for adding logs */}
      {showWeightForm && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <button className="modal-close-btn" onClick={() => setShowWeightForm(false)}>&times;</button>
            </div>
            <WeightLogForm petId={pet.id} onLogAdded={handleLogAdded} onCancel={() => setShowWeightForm(false)} />
          </div>
        </div>
      )}

      {showDietForm && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              {/* <h2 className="modal-title">Record Diet</h2> */}
              <button className="modal-close-btn" onClick={() => setShowDietForm(false)}>&times;</button>
            </div>
            <DietLogForm petId={pet.id} onLogAdded={handleLogAdded} onCancel={() => setShowDietForm(false)} />
          </div>
        </div>
      )}

      {showVaccineForm && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              {/* <h2 className="modal-title">Record Vaccine</h2> */}
              <button className="modal-close-btn" onClick={() => setShowVaccineForm(false)}>&times;</button>
            </div>
            <VaccineLogForm petId={pet.id} onLogAdded={handleLogAdded} onCancel={() => setShowVaccineForm(false)} />
          </div>
        </div>
      )}

      {/* Modal for editing pet details */}
      {showEditPetForm && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              {/* <h2 className="modal-title">Edit Pet Details</h2> */}
              <button className="modal-close-btn" onClick={() => setShowEditPetForm(false)}>&times;</button>
            </div>
            <PetForm pet={pet} userId={pet.user_id} onPetAdded={handlePetEdit} onCancel={() => setShowEditPetForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PetProfile;
