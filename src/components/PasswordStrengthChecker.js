import React, { useState, useEffect } from 'react';

const PasswordStrengthChecker = ({ onAddToVault }) => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [vaultData, setVaultData] = useState({
    siteName: '',
    email: ''
  });

  // Password strength analysis
  useEffect(() => {
    if (password.length === 0) {
      setStrength(null);
      setScore(0);
      setFeedback([]);
      return;
    }

    let newScore = 0;
    const newFeedback = [];

    // Length check
    if (password.length >= 8) {
      newScore += 1;
    } else {
      newFeedback.push('Password should be at least 8 characters long');
    }

    if (password.length >= 12) {
      newScore += 1;
    }

    if (password.length >= 16) {
      newScore += 1;
    }

    // Character variety checks
    if (/[a-z]/.test(password)) {
      newScore += 1;
    } else {
      newFeedback.push('Include lowercase letters (a-z)');
    }

    if (/[A-Z]/.test(password)) {
      newScore += 1;
    } else {
      newFeedback.push('Include uppercase letters (A-Z)');
    }

    if (/[0-9]/.test(password)) {
      newScore += 1;
    } else {
      newFeedback.push('Include numbers (0-9)');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      newScore += 1;
    } else {
      newFeedback.push('Include special characters (!@#$%^&*)');
    }

    // Common patterns check
    if (/(.)\1{2,}/.test(password)) {
      newFeedback.push('Avoid repeated characters (e.g., "aaa")');
    }

    if (/123|abc|qwe|password|admin/i.test(password)) {
      newFeedback.push('Avoid common sequences and words');
    }

    // Strength categorization
    let strengthLevel;
    if (newScore <= 2) {
      strengthLevel = 'Very Weak';
    } else if (newScore <= 4) {
      strengthLevel = 'Weak';
    } else if (newScore <= 6) {
      strengthLevel = 'Fair';
    } else if (newScore <= 8) {
      strengthLevel = 'Strong';
    } else {
      strengthLevel = 'Very Strong';
    }

    setScore(newScore);
    setStrength(strengthLevel);
    setFeedback(newFeedback);
  }, [password]);

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let generatedPassword = "";
    
    // Ensure at least one character from each category
    generatedPassword += charset.charAt(Math.floor(Math.random() * 26)); // lowercase
    generatedPassword += charset.charAt(26 + Math.floor(Math.random() * 26)); // uppercase
    generatedPassword += charset.charAt(52 + Math.floor(Math.random() * 10)); // number
    generatedPassword += charset.charAt(62 + Math.floor(Math.random() * 32)); // special
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password
    generatedPassword = generatedPassword.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(generatedPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    alert('Password copied to clipboard!');
  };

  const addToVault = () => {
    if (!vaultData.siteName || !vaultData.email || !password) {
      alert('Please fill in all fields before adding to vault');
      return;
    }

    onAddToVault({
      siteName: vaultData.siteName,
      email: vaultData.email,
      password: password,
      strength: strength,
      score: score
    });

    // Reset form
    setVaultData({ siteName: '', email: '' });
    setPassword('');
    
    alert('Password added to vault! Switch to the Vault tab to view it.');
  };

  const getStrengthColor = () => {
    if (!strength) return '#6c757d';
    if (strength === 'Very Weak') return '#dc3545';
    if (strength === 'Weak') return '#fd7e14';
    if (strength === 'Fair') return '#ffc107';
    if (strength === 'Strong') return '#20c997';
    return '#198754';
  };

  const getStrengthEmoji = () => {
    if (!strength) return '🔍';
    if (strength === 'Very Weak') return '💀';
    if (strength === 'Weak') return '⚠️';
    if (strength === 'Fair') return '😐';
    if (strength === 'Strong') return '👍';
    return '🛡️';
  };

  return (
    <div className="card">
      <h2>🔍 Password Strength Checker</h2>
      <p style={{ marginBottom: '24px', color: '#6c757d' }}>
        Test your password strength and get detailed security feedback
      </p>

      <div className="form-group">
        <label htmlFor="password">Enter Password to Check</label>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type or paste your password here..."
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

      {/* Password Generation Section */}
      <div className="generate-section">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={generatePassword}
        >
          🔐 Generate Strong Password
        </button>
        {password && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={copyToClipboard}
          >
            📋 Copy Password
          </button>
        )}
      </div>

      {/* Strength Analysis Results */}
      {strength && (
        <div className="card" style={{ marginTop: '24px', background: '#f8f9fa' }}>
          <h3 style={{ marginBottom: '16px' }}>
            {getStrengthEmoji()} Strength Analysis: {strength}
          </h3>
          
          {/* Strength Bar */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '8px',
              fontSize: '14px',
              color: '#6c757d'
            }}>
              <span>Strength Score: {score}/10</span>
              <span>{strength}</span>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              backgroundColor: '#e9ecef',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(score / 10) * 100}%`,
                height: '100%',
                backgroundColor: getStrengthColor(),
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Feedback */}
          {feedback.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ marginBottom: '12px', color: '#dc3545' }}>🔴 Areas for Improvement:</h4>
              <ul style={{ paddingLeft: '20px', color: '#6c757d' }}>
                {feedback.map((item, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Security Tips */}
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#e7f3ff', 
            borderRadius: '8px',
            border: '1px solid #b3d9ff'
          }}>
            <h4 style={{ marginBottom: '8px', color: '#0066cc' }}>💡 Security Tips:</h4>
            <ul style={{ 
              paddingLeft: '20px', 
              color: '#0066cc',
              fontSize: '14px',
              margin: 0
            }}>
              <li>Use a unique password for each account</li>
              <li>Consider using a passphrase instead of a single word</li>
              <li>Enable two-factor authentication when available</li>
              <li>Regularly update your passwords</li>
            </ul>
          </div>
        </div>
      )}

      {/* Add to Vault Section */}
      {strength && score >= 6 && (
        <div className="card" style={{ marginTop: '24px', background: '#f0f8f0' }}>
          <h3 style={{ marginBottom: '16px', color: '#198754' }}>
            🗄️ Add Strong Password to Vault
          </h3>
          <p style={{ marginBottom: '16px', color: '#6c757d' }}>
            This password meets our security standards. You can save it to your vault for future reference.
          </p>
          
          <div className="form-group">
            <label htmlFor="siteName">Site/App Name</label>
            <input
              type="text"
              id="siteName"
              className="form-control"
              value={vaultData.siteName}
              onChange={(e) => setVaultData({...vaultData, siteName: e.target.value})}
              placeholder="e.g., Google, Facebook, GitHub"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email/Username</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={vaultData.email}
              onChange={(e) => setVaultData({...vaultData, email: e.target.value})}
              placeholder="your.email@example.com"
            />
          </div>

          <button 
            className="btn" 
            onClick={addToVault}
            disabled={!vaultData.siteName || !vaultData.email}
          >
            💾 Add to Vault
          </button>
        </div>
      )}

      {/* Warning for Weak Passwords */}
      {strength && score < 6 && (
        <div className="card" style={{ 
          marginTop: '24px', 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7'
        }}>
          <h3 style={{ marginBottom: '12px', color: '#856404' }}>
            ⚠️ Password Security Warning
          </h3>
          <p style={{ color: '#856404', margin: 0 }}>
            This password doesn't meet our recommended security standards. Consider generating a stronger password above.
          </p>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthChecker;
