import React, { useState } from 'react';
import PasswordItem from './PasswordItem';

const PasswordVault = ({ passwords, onDeletePassword, onUpdatePassword }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  const filteredPasswords = passwords.filter(password =>
    password.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id, updatedPassword) => {
    onUpdatePassword(id, updatedPassword);
    setEditingId(null);
  };

  return (
    <div className="card">
      <h2>🗄️ Password Vault (Demo)</h2>
      <p style={{ marginBottom: '24px', color: '#6c757d' }}>
        This is a demonstration vault for storing passwords that meet our security standards. 
        All data is stored locally in your browser.
      </p>
      
      {passwords.length > 0 && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search by site name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {passwords.length === 0 ? (
        <div className="empty-state">
          <h3>No passwords in vault yet</h3>
          <p>Use the Password Strength Checker to analyze and add strong passwords to your vault!</p>
        </div>
      ) : filteredPasswords.length === 0 ? (
        <div className="empty-state">
          <h3>No matching passwords</h3>
          <p>Try adjusting your search terms.</p>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '20px', color: '#6c757d' }}>
            Found {filteredPasswords.length} password{filteredPasswords.length !== 1 ? 's' : ''} in your vault
          </p>
          
          {filteredPasswords.map(password => (
            <PasswordItem
              key={password.id}
              password={password}
              isEditing={editingId === password.id}
              onEdit={() => handleEdit(password.id)}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={(updatedPassword) => handleSaveEdit(password.id, updatedPassword)}
              onDelete={() => onDeletePassword(password.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordVault;
