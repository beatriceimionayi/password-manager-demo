import React, { useState } from 'react';
import './Auth.css';

const UserProfile = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    // Clear current user session
    localStorage.removeItem('securevault_current_user');
    onLogout();
  };

  const formatLoginTime = (loginTime) => {
    if (!loginTime) return 'Never';
    const date = new Date(loginTime);
    return date.toLocaleString();
  };

  return (
    <div className="user-profile">
      <div className="user-info" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <div className="user-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="user-details">
          <span className="user-name">{user.name}</span>
          <span className="user-email">{user.email}</span>
        </div>
        <div className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>
          ▼
        </div>
      </div>

      {isDropdownOpen && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <h3>Account Information</h3>
          </div>
          
          <div className="dropdown-content">
            <div className="info-item">
              <label>Name:</label>
              <span>{user.name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Member Since:</label>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Last Login:</label>
              <span>{formatLoginTime(user.lastLogin)}</span>
            </div>
          </div>

          <div className="dropdown-actions">
            <button 
              className="auth-button secondary"
              onClick={handleLogout}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
