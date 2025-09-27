import { useState, useEffect } from "react";
import { Plus, PawPrint, Weight, Calendar, UtensilsCrossed, ShoppingBag, Utensils, Clock, TrendingUp, Activity, Heart } from "lucide-react";
import PetForm from "./PetForm";
import PetProfile from "./PetProfile";
import { API_BASE_URL } from "./config";
import "./Dashboard.css";

function Dashboard({ user }) {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetForm, setShowPetForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pets?user_id=${user.id}`);
      const data = await response.json();
      setPets(data.pets || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setLoading(false);
    }
  };

  const handlePetCreated = (newPet) => {
    setPets([...pets, newPet]);
    setShowPetForm(false);
  };

  const handlePetSelect = (pet) => {
    setSelectedPet(pet);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Left sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <PawPrint size={20} />
            My Pets
          </h2>
          <button 
            className="btn btn-primary add-pet-btn"
            onClick={() => setShowPetForm(true)}
          >
            <Plus size={16} />
            Add Pet
          </button>
        </div>
        
        <div className="pet-list">
          {pets.length === 0 ? (
            <div className="no-pets">
              <div className="no-pets-icon">
                <PawPrint size={48} color="#9CA3AF" />
              </div>
              <p className="no-pets-text">No pets yet</p>
              <p className="no-pets-subtext">Click the button above to add your first pet</p>
            </div>
          ) : (
            pets.map((pet, index) => (
              <div
                key={pet.id}
                className={`pet-item ${selectedPet?.id === pet.id ? 'active' : ''}`}
                onClick={() => handlePetSelect(pet)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="pet-avatar">
                  <PawPrint size={20} color="#FFFFFF" />
                </div>
                <div className="pet-info">
                  <h3 className="pet-name">{pet.name}</h3>
                  <p className="pet-breed">{pet.breed || 'Unknown Breed'}</p>
                </div>
                <div className="pet-status">
                  <div className="status-dot"></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right content area */}
      <div className="main-content">
        {selectedPet ? (
          <PetProfile pet={selectedPet} />
        ) : (
          <div className="welcome-content">
            <div className="welcome-header">
              <h1 className="welcome-title">Welcome back, {user.firstName}!</h1>
              <p className="welcome-subtitle">Manage your pets' health and track their daily activities</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <PawPrint size={24} color="#007AFF" />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{pets.length}</div>
                  <div className="stat-label">Total Pets</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Activity size={24} color="#34C759" />
                </div>
                <div className="stat-content">
                  <div className="stat-number">12</div>
                  <div className="stat-label">Health Records</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={24} color="#FF9500" />
                </div>
                <div className="stat-content">
                  <div className="stat-number">5</div>
                  <div className="stat-label">Upcoming Reminders</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Heart size={24} color="#AF52DE" />
                </div>
                <div className="stat-content">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Health Score</div>
                </div>
              </div>
            </div>
            
            <div className="features-section">
              <h2 className="section-title">Quick Actions</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon weight">
                    <Weight size={32} color="#FFFFFF" />
                  </div>
                  <h3 className="feature-title">Weight Management</h3>
                  <p className="feature-description">Track your pet's weight changes over time</p>
                  <div className="feature-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '75%' }}></div>
                    </div>
                    <span className="progress-text">75% complete</span>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon diet">
                    <UtensilsCrossed size={32} color="#FFFFFF" />
                  </div>
                  <h3 className="feature-title">Diet Records</h3>
                  <p className="feature-description">Log meals and monitor nutrition intake</p>
                  <div className="feature-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '60%' }}></div>
                    </div>
                    <span className="progress-text">60% complete</span>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon vaccine">
                    <TrendingUp size={32} color="#FFFFFF" />
                  </div>
                  <h3 className="feature-title">Vaccine Reminders</h3>
                  <p className="feature-description">Never miss important vaccinations</p>
                  <div className="feature-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '90%' }}></div>
                    </div>
                    <span className="progress-text">90% complete</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="recent-activity">
              <h2 className="section-title">Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon weight">
                    <Weight size={20} color="#FFFFFF" />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Weight recorded for {pets[0]?.name || 'your pet'}</div>
                    <div className="activity-time">2 hours ago</div>
                  </div>
                  <div className="activity-status success"></div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon diet">
                    <UtensilsCrossed size={20} color="#FFFFFF" />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Meal logged for {pets[1]?.name || 'your pet'}</div>
                    <div className="activity-time">4 hours ago</div>
                  </div>
                  <div className="activity-status success"></div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon vaccine">
                    <Calendar size={20} color="#FFFFFF" />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Vaccine reminder for {pets[2]?.name || 'your pet'}</div>
                    <div className="activity-time">1 day ago</div>
                  </div>
                  <div className="activity-status warning"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pet registration form modal */}
      {showPetForm && (
        <div className="modal-overlay" onClick={() => setShowPetForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPetForm(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <PetForm 
              userId={user.id}
              onPetCreated={handlePetCreated}
              onCancel={() => setShowPetForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
