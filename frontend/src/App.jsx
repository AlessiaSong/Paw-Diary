import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserList from "./UserList";
import "./design-system.css";
import "./App.css";
import UserForm from "./UserForm";
import UserLogin from "./UserLogin";
import Dashboard from "./Dashboard";

function App() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [modalMode, setModalMode] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    // Check for saved logged in user
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/users/");
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser({});
    setModalMode("");
  };

  const openCreateModal = () => {
    setModalMode("create");
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openLoginModal = () => {
    setModalMode("login");
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    if (isModalOpen) return;
    setCurrentUser(user);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const onUpdate = () => {
    closeModal();
    fetchUsers();
  };

  const handleLogin = (user) => {
    setLoggedInUser(user);
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    closeModal();
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
  };

  // If user is logged in, show main dashboard
  if (loggedInUser) {
    return (
      <Router>
        <div className="app-layout">
          <header className="app-header">
            <div className="app-logo">
              <span className="logo-icon">🐾</span>
              <span className="logo-text">Paw Diary</span>
            </div>
            <div className="user-menu">
              <span className="user-greeting">Welcome, {loggedInUser.firstName}</span>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm logout-btn">
                Sign Out
              </button>
            </div>
          </header>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard user={loggedInUser} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    );
  }

  // If user is not logged in, show login page
  return (
    <div className="auth-page">
      {/* Background Elements */}
      <div className="auth-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>
      
      {/* Pet Animation Icons */}
      <div className="pet-animations">
        <div className="pet-icon pet-1">🐕</div>
        <div className="pet-icon pet-2">🐱</div>
        <div className="pet-icon pet-3">🐾</div>
        <div className="pet-icon pet-4">🐶</div>
      </div>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">🐾</span>
              <span className="logo-text">Paw Diary</span>
            </div>
            <p className="auth-subtitle">The diary your pet would keep, if they could write</p>
          </div>
          
          <div className="auth-tabs">
            <button 
              onClick={openLoginModal} 
              className={`auth-tab ${modalMode === 'login' ? 'active' : ''}`}
            >
              Sign In
            </button>
            <button 
              onClick={openCreateModal} 
              className={`auth-tab ${modalMode === 'create' ? 'active' : ''}`}
            >
              Sign Up
            </button>
          </div>
          
          {isModalOpen && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {modalMode === "create" && (
                  <UserForm existingUser={{}} updateCallback={onUpdate} />
                )}
                {modalMode === "login" && (
                  <UserLogin
                    setLoggedInUser={handleLogin}
                    updateCallback={onUpdate}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
