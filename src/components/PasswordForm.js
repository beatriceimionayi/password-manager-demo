import React, { useState } from 'react';

const PasswordForm = ({ onAddPassword }) => {
  const [formData, setFormData] = useState({
    siteName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setFormData(prev => ({
      ...prev,
      password
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.siteName || !formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    onAddPassword(formData);
    
    // Reset form
    setFormData({
      siteName: '',
      email: '',
      password: ''
    });
    
    alert('Password saved successfully!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formData.password);
    alert('Password copied to clipboard!');
  };

  return (
    <div className="card">
      <h2>Add New Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="siteName">Site/App Name *</label>
          <input
            type="text"
            id="siteName"
            name="siteName"
            className="form-control"
            value={formData.siteName}
            onChange={handleInputChange}
            placeholder="e.g., Google, Facebook, GitHub"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email/Username *</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter or generate a password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
        </div>

        <div className="generate-section">
          <input
            type="text"
            className="form-control"
            value={formData.password}
            readOnly
            placeholder="Generated password will appear here"
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={generatePassword}
          >
            🔐 Generate
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={copyToClipboard}
            disabled={!formData.password}
          >
            📋 Copy
          </button>
        </div>

        <button type="submit" className="btn">
          💾 Save Password
        </button>
      </form>
    </div>
  );
};

export default PasswordForm;
