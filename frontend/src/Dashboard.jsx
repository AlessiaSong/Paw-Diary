import { useState, useEffect } from "react";
import { Plus, PawPrint, Weight, Calendar, UtensilsCrossed, ShoppingBag, Utensils, Clock } from "lucide-react";
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
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Left sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>My Pets</h2>
          <button 
            className="add-pet-btn"
            onClick={() => setShowPetForm(true)}
          >
            <Plus size={16} />
            Add Pet
          </button>
        </div>
        
        <div className="pet-list">
          {pets.length === 0 ? (
            <div className="no-pets">
              <PawPrint size={64} color="#DDDDDD" />
              <p>No pets yet, click the button above to add one</p>
            </div>
          ) : (
            pets.map((pet) => (
              <div
                key={pet.id}
                className={`pet-item ${selectedPet?.id === pet.id ? 'active' : ''}`}
                onClick={() => handlePetSelect(pet)}
              >
                <div className="pet-avatar">
                  <PawPrint size={24} color="#AEC6CF" />
                </div>
                <div className="pet-info">
                  <h3>{pet.name}</h3>
                  <p>{pet.breed || 'Unknown Breed'}</p>
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
            <div className="welcome-card">
              <h1>Welcome back, {user.firstName}!</h1>
              <p>Select a pet from the left to view details</p>
              <div className="feature-icons">
                <div className="feature-icon">
                  <ShoppingBag size={36} color="#AEC6CF" />
                  <span>Weight Management</span>
                </div>
                <div className="feature-icon">
                  <Utensils size={36} color="#98D7C2" />
                  <span>Diet Records</span>
                </div>
                <div className="feature-icon">
                  <Clock size={36} color="#FFD3B5" />
                  <span>Vaccine Reminders</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pet registration form modal */}
      {showPetForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowPetForm(false)}>&times;</span>
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
