import { useState, useEffect } from "react";
import { Weight, UtensilsCrossed, Calendar, PawPrint, Edit, Plus } from "lucide-react";
import { API_BASE_URL } from "./config";
import WeightLogForm from "./WeightLogForm";
import DietLogForm from "./DietLogForm";
import VaccineLogForm from "./VaccineLogForm";
import "./PetProfile.css";

function PetProfile({ pet }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [weightLogs, setWeightLogs] = useState([]);
  const [dietLogs, setDietLogs] = useState([]);
  const [vaccineLogs, setVaccineLogs] = useState([]);
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [showDietForm, setShowDietForm] = useState(false);
  const [showVaccineForm, setShowVaccineForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pet) {
      fetchPetData();
    }
  }, [pet]);

  const fetchPetData = async () => {
    setLoading(true);
    try {
      // Get weight logs
      const weightResponse = await fetch(`${API_BASE_URL}/weight-logs/pet/${pet.id}`);
      const weightData = await weightResponse.json();
      setWeightLogs(weightData.weight_logs || []);

      // Get diet logs
      const dietResponse = await fetch(`${API_BASE_URL}/diet-logs/pet/${pet.id}`);
      const dietData = await dietResponse.json();
      setDietLogs(dietData.diet_logs || []);

      // Get vaccine logs
      const vaccineResponse = await fetch(`${API_BASE_URL}/vaccine-logs/pet/${pet.id}`);
      const vaccineData = await vaccineResponse.json();
      setVaccineLogs(vaccineData.vaccine_logs || []);
    } catch (error) {
      console.error("Error fetching pet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogCreated = () => {
    fetchPetData();
  };

  const getSpeciesText = (species) => {
    const speciesMap = {
      dog: "Dog",
      cat: "Cat",
      bird: "Bird",
      rabbit: "Rabbit",
      other: "Other"
    };
    return speciesMap[species] || species;
  };

  const getGenderText = (gender) => {
    const genderMap = {
      male: "Male",
      female: "Female",
      unknown: "Unknown"
    };
    return genderMap[gender] || gender;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const getLatestWeight = () => {
    if (weightLogs.length === 0) return null;
    return weightLogs.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };

  const getUpcomingVaccines = () => {
    const today = new Date();
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return vaccineLogs.filter(log => {
      if (!log.next_due_date) return false;
      const dueDate = new Date(log.next_due_date);
      return dueDate >= today && dueDate <= thirtyDaysLater && log.reminder_enabled;
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="pet-profile">
      {/* Pet basic info header */}
      <div className="pet-header">
        <div className="pet-avatar">
          <PawPrint size={48} />
        </div>
        <div className="pet-info">
          <h1>{pet.name}</h1>
          <p className="pet-breed">{pet.breed || "Unknown Breed"}</p>
          <div className="pet-details">
            <span>{getSpeciesText(pet.species)} • {getGenderText(pet.gender)}</span>
            {pet.birth_date && <span>• Born: {formatDate(pet.birth_date)}</span>}
            {pet.weight && <span>• Weight: {pet.weight}kg</span>}
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === "weight" ? "active" : ""}`}
          onClick={() => setActiveTab("weight")}
        >
          <Weight size={16} />
          Weight
        </button>
        <button
          className={`tab-button ${activeTab === "diet" ? "active" : ""}`}
          onClick={() => setActiveTab("diet")}
        >
          <UtensilsCrossed size={16} />
          Diet
        </button>
        <button
          className={`tab-button ${activeTab === "vaccine" ? "active" : ""}`}
          onClick={() => setActiveTab("vaccine")}
        >
          <Calendar size={16} />
          Vaccines
        </button>
      </div>

      {/* Content area */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="overview-grid">
              {/* Basic info card */}
              <div className="info-card">
                <h3>Basic Information</h3>
                <div className="info-list">
                  <div className="info-item">
                    <span className="label">Breed:</span>
                    <span>{pet.breed || "Unknown"}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Color:</span>
                    <span>{pet.color || "Unknown"}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Microchip ID:</span>
                    <span>{pet.microchip_id || "None"}</span>
                  </div>
                  {pet.notes && (
                    <div className="info-item">
                      <span className="label">Notes:</span>
                      <span>{pet.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Weight info card */}
              <div className="info-card">
                <h3>Weight Information</h3>
                {getLatestWeight() ? (
                  <div className="weight-info">
                    <div className="current-weight">
                      <span className="weight-value">{getLatestWeight().weight_kg}kg</span>
                      <span className="weight-date">{formatDate(getLatestWeight().date)}</span>
                    </div>
                    <button 
                      className="add-btn"
                      onClick={() => setShowWeightForm(true)}
                    >
                      <Plus size={16} />
                      Record Weight
                    </button>
                  </div>
                ) : (
                  <div className="no-data">
                    <p>No weight records yet</p>
                    <button 
                      className="add-btn"
                      onClick={() => setShowWeightForm(true)}
                    >
                      <Plus size={16} />
                      Record Weight
                    </button>
                  </div>
                )}
              </div>

              {/* Vaccine reminders card */}
              <div className="info-card">
                <h3>Vaccine Reminders</h3>
                {getUpcomingVaccines().length > 0 ? (
                  <div className="vaccine-reminders">
                    {getUpcomingVaccines().map((vaccine, index) => (
                      <div key={index} className="vaccine-reminder">
                        <span className="vaccine-type">{vaccine.vaccine_type}</span>
                        <span className="due-date">{formatDate(vaccine.next_due_date)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <p>No upcoming vaccines</p>
                  </div>
                )}
                <button 
                  className="add-btn"
                  onClick={() => setShowVaccineForm(true)}
                >
                  <Plus size={16} />
                  Record Vaccine
                </button>
              </div>

              {/* Recent diet records card */}
              <div className="info-card">
                <h3>Recent Diet</h3>
                {dietLogs.length > 0 ? (
                  <div className="recent-diet">
                    {dietLogs.slice(0, 3).map((log, index) => (
                      <div key={index} className="diet-item">
                        <span className="food-type">{log.description}</span>
                        <span className="diet-date">{formatDate(log.date)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <p>No diet records yet</p>
                  </div>
                )}
                <button 
                  className="add-btn"
                  onClick={() => setShowDietForm(true)}
                >
                  <Plus size={16} />
                  Record Diet
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "weight" && (
          <div className="weight-tab">
            <div className="tab-header">
              <h3>Weight Management</h3>
              <button 
                className="add-btn"
                onClick={() => setShowWeightForm(true)}
              >
                <Plus size={16} />
                Record Weight
              </button>
            </div>
            <div className="weight-logs">
              {weightLogs.length > 0 ? (
                weightLogs.map((log) => (
                  <div key={log.id} className="weight-log-item">
                    <div className="weight-value">{log.weight_kg}kg</div>
                    <div className="weight-date">{formatDate(log.date)}</div>
                    {log.notes && <div className="weight-notes">{log.notes}</div>}
                  </div>
                ))
              ) : (
                <div className="no-data">No weight records</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "diet" && (
          <div className="diet-tab">
            <div className="tab-header">
              <h3>Diet Records</h3>
              <button 
                className="add-btn"
                onClick={() => setShowDietForm(true)}
              >
                <Plus size={16} />
                Record Diet
              </button>
            </div>
            <div className="diet-logs">
              {dietLogs.length > 0 ? (
                dietLogs.map((log) => (
                  <div key={log.id} className="diet-log-item">
                    <div className="diet-info">
                      <div className="food-type">{log.description}</div>
                      <div className="diet-date">{formatDate(log.date)}</div>
                    </div>
                    {log.food_amount && <div className="diet-amount">Amount: {log.food_amount}{log.unit}</div>}
                    {log.notes && <div className="diet-notes">{log.notes}</div>}
                  </div>
                ))
              ) : (
                <div className="no-data">No diet records</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "vaccine" && (
          <div className="vaccine-tab">
            <div className="tab-header">
              <h3>Vaccine Records</h3>
              <button 
                className="add-btn"
                onClick={() => setShowVaccineForm(true)}
              >
                <Plus size={16} />
                Record Vaccine
              </button>
            </div>
            <div className="vaccine-logs">
              {vaccineLogs.length > 0 ? (
                vaccineLogs.map((log) => (
                  <div key={log.id} className="vaccine-log-item">
                    <div className="vaccine-info">
                      <div className="vaccine-type">{log.vaccine_type}</div>
                      <div className="vaccine-date">{formatDate(log.date)}</div>
                    </div>
                    {log.next_due_date && (
                      <div className="next-due">
                        Next due: {formatDate(log.next_due_date)}
                      </div>
                    )}
                    {log.notes && <div className="vaccine-notes">{log.notes}</div>}
                  </div>
                ))
              ) : (
                <div className="no-data">No vaccine records</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showWeightForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowWeightForm(false)}>&times;</span>
            <WeightLogForm 
              petId={pet.id}
              onLogCreated={handleLogCreated}
              onCancel={() => setShowWeightForm(false)}
            />
          </div>
        </div>
      )}

      {showDietForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowDietForm(false)}>&times;</span>
            <DietLogForm 
              petId={pet.id}
              onLogCreated={handleLogCreated}
              onCancel={() => setShowDietForm(false)}
            />
          </div>
        </div>
      )}

      {showVaccineForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowVaccineForm(false)}>&times;</span>
            <VaccineLogForm 
              petId={pet.id}
              onLogCreated={handleLogCreated}
              onCancel={() => setShowVaccineForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PetProfile; 