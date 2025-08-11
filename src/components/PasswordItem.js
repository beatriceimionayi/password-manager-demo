import React, { useState } from 'react';

const PasswordItem = ({ 
  password, 
  isEditing, 
  onEdit, 
  onCancelEdit, 
  onSaveEdit, 
  onDelete 
}) => {
  const [editData, setEditData] = useState({
    siteName: password.siteName,
    email: password.email,
    password: password.password
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!editData.siteName || !editData.email || !editData.password) {
      alert('Please fill in all fields');
      return;
    }
    onSaveEdit(editData);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getStrengthColor = (strength) => {
    if (!strength) return '#6c757d';
    if (strength === 'Very Weak') return '#dc3545';
    if (strength === 'Weak') return '#fd7e14';
    if (strength === 'Fair') return '#ffc107';
    if (strength === 'Strong') return '#20c997';
    return '#198754';
  };

  const getStrengthEmoji = (strength) => {
    if (!strength) return '🔍';
    if (strength === 'Very Weak') return '💀';
    if (strength === 'Weak') return '⚠️';
    if (strength === 'Fair') return '😐';
    if (strength === 'Strong') return '👍';
    return '🛡️';
  };

  if (isEditing) {
    return (
      <div className="password-item">
        <div style={{ flex: 1 }}>
          <div className="form-group">
            <input
              type="text"
              name="siteName"
              className="form-control"
              value={editData.siteName}
              onChange={handleInputChange}
              placeholder="Site Name"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              className="form-control"
              value={editData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                value={editData.password}
                onChange={handleInputChange}
                placeholder="Password"
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
        </div>
        <div className="password-actions">
          <button className="btn" onClick={handleSave}>
            💾 Save
          </button>
          <button className="btn btn-secondary" onClick={onCancelEdit}>
            ❌ Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="password-item">
      <div className="password-info">
        <h4>{password.siteName}</h4>
        <p>📧 {password.email}</p>
        <p>🔑 {showPassword ? password.password : '••••••••••••••••'}</p>
        
        {/* Strength Information */}
        {password.strength && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginTop: '8px'
          }}>
            <span style={{ 
              color: getStrengthColor(password.strength),
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {getStrengthEmoji(password.strength)} {password.strength}
            </span>
            {password.score && (
              <span style={{ 
                color: '#6c757d',
                fontSize: '12px',
                backgroundColor: '#e9ecef',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                Score: {password.score}/10
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="password-actions">
        <button
          className="btn btn-secondary"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈 Hide" : "👁️ Show"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => copyToClipboard(password.password)}
        >
          📋 Copy
        </button>
        <button
          className="btn btn-secondary"
          onClick={onEdit}
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-danger"
          onClick={onDelete}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default PasswordItem;
