import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { API_BASE_URL } from "./config";
import "./UserForm.css";

function UserLogin({ setLoggedInUser, updateCallback }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
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
      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();
      
      if (data.users) {
        const user = data.users.find(u => 
          u.email === formData.email && u.password === formData.password
        );
        
        if (user) {
          setLoggedInUser(user);
          updateCallback();
        } else {
          setErrors({ email: 'Invalid email or password' });
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form">
      <div className="form-header">
        <h2 className="form-title">Sign In</h2>
        <p className="form-subtitle">Welcome back! Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address *
          </label>
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
              required
            />
          </div>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password *
          </label>
          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              required
            />
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner-small"></div>
                Signing In...
              </>
            ) : (
              <>
                <span>🐾</span>
                Sign In
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserLogin;
