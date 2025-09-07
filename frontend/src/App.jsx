import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserList from "./UserList";
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
        <div className="app">
          <header className="app-header">
            <div className="header-content">
              <h1 className="app-title">Paw Diary</h1>
              <div className="user-info">
                <span>Welcome, {loggedInUser.firstName}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          </header>
          <main className="app-main">
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
    <>
      <div className="app-bg">
        <div className="welcome-section">
          <h1 className="welcome-title">Paw Diary</h1>
          <p className="welcome-subtitle">The diary your pet would keep, if they could write.</p>
        </div>
        <div className="button-container">
          <button 
            onClick={openCreateModal} 
            className="auth-button signup-button"
          >
            Sign Up
          </button>
          <button 
            onClick={openLoginModal} 
            className="auth-button login-button"
          >
            Login
          </button>
        </div>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
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
    </>
  );
}

export default App;
