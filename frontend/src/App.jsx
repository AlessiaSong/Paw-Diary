import { useState, useEffect } from "react";
import UserList from "./UserList";
import "./App.css";
import UserForm from "./UserForm";
import UserLogin from "./UserLogin"

function App() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const [modalMode, setModalMode] = useState("")
  const [loggedInUser, setLoggedInUser] = useState(null);


  useEffect(() => {
    fetchUsers()
  }, []);

  const fetchUsers = async () => {
    // const response = await fetch("http://18.140.54.37:5001/api");
const response = await fetch("http://127.0.0.1:5001/users/");
    const data = await response.json();
    setUsers(data.users);
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentUser({})
    setModalMode("")
  }

  const openCreateModal = () => {
    setModalMode("create");
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openLoginModal = () => {
    setModalMode("login");
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (user) => {
    if (isModalOpen) return
    setCurrentUser(user)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchUsers()
  }

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
        {isModalOpen && <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            {modalMode === "create" && (
              <UserForm existingUser={{}} updateCallback={onUpdate} />
            )}
            {modalMode === "login" && (
               <UserLogin
               setLoggedInUser={setLoggedInUser}
               updateCallback={onUpdate}
             />
            )}
          </div>
        </div>
        }
        {loggedInUser && <h2>欢迎登录，{loggedInUser.firstName}</h2>}
      </div>
    </>
  );
}

export default App;
