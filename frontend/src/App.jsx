import { useState, useEffect } from "react";
import ContactList from "./ContactList";
import "./App.css";
import ContactForm from "./ContactForm";
import ContactLogin from "./ContactLogin"

function App() {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentContact, setCurrentContact] = useState({})
  const [modalMode, setModalMode] = useState("")
  const [loggedInUser, setLoggedInUser] = useState(null);


  useEffect(() => {
    fetchContacts()
  }, []);

  const fetchContacts = async () => {
    // const response = await fetch("http://18.140.54.37:5000/api");
    const response = await fetch("http://127.0.0.1:5000/api/");
    const data = await response.json();
    setContacts(data.contacts);
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentContact({})
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

  const openEditModal = (contact) => {
    if (isModalOpen) return
    setCurrentContact(contact)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchContacts()
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
              <ContactForm existingContact={{}} updateCallback={onUpdate} />
            )}
            {modalMode === "login" && (
               <ContactLogin
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
