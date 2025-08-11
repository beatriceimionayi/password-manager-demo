import React, { useState, useEffect } from 'react';
import PasswordStrengthChecker from './components/PasswordStrengthChecker';
import PasswordVault from './components/PasswordVault';
import AIAgentInterface from './components/AIAgentInterface';
import AIAgentManager from './agents/AIAgentManager';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserProfile from './components/Auth/UserProfile';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('ai-checker');
  const [passwords, setPasswords] = useState([]);
  const [aiManager, setAiManager] = useState(null);
  const [aiStatus, setAiStatus] = useState('Initializing...');
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuth, setShowAuth] = useState('login'); // 'login', 'register', or null

  // Check for existing user session
  useEffect(() => {
    const savedUser = localStorage.getItem('securevault_current_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setShowAuth(null); // Hide auth forms
      } catch (error) {
        console.error('Failed to parse user session:', error);
        localStorage.removeItem('securevault_current_user');
      }
    }
  }, []);

  // Initialize AI Agent Manager
  useEffect(() => {
    const initializeAI = async () => {
      try {
        const manager = new AIAgentManager();
        const status = manager.initialize();
        setAiManager(manager);
        setAiStatus('Active');
        console.log('✅ AI Agent System initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize AI Agent System:', error);
        setAiStatus('Error');
      }
    };

    initializeAI();
  }, []);

  // Load passwords from localStorage on component mount
  useEffect(() => {
    if (currentUser) {
      const savedPasswords = localStorage.getItem(`securevault_ai_passwords_${currentUser.id}`);
      if (savedPasswords) {
        setPasswords(JSON.parse(savedPasswords));
      } else {
        setPasswords([]);
      }
    }
  }, [currentUser]);

  // Save passwords to localStorage whenever passwords change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`securevault_ai_passwords_${currentUser.id}`, JSON.stringify(passwords));
    }
  }, [passwords, currentUser]);

  const addPassword = (newPassword) => {
    setPasswords([...passwords, { ...newPassword, id: Date.now() }]);
  };

  const deletePassword = (id) => {
    setPasswords(passwords.filter(password => password.id !== id));
  };

  const updatePassword = (id, updatedPassword) => {
    setPasswords(passwords.map(password => 
      password.id === id ? { ...updatedPassword, id } : password
    ));
  };

  // Authentication handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
    setShowAuth(null);
    
    // Update last login time
    const storedUsers = JSON.parse(localStorage.getItem('securevault_users') || '[]');
    const updatedUsers = storedUsers.map(u => 
      u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
    );
    localStorage.setItem('securevault_users', JSON.stringify(updatedUsers));
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
    setShowAuth(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowAuth('login');
    setPasswords([]); // Clear user's passwords
  };

  const switchToRegister = () => setShowAuth('register');
  const switchToLogin = () => setShowAuth('login');

  // Show authentication forms if user is not logged in
  if (showAuth) {
    return (
      <div className="App">
        {showAuth === 'login' ? (
          <Login onLogin={handleLogin} onSwitchToRegister={switchToRegister} />
        ) : (
          <Register onRegister={handleRegister} onSwitchToLogin={switchToLogin} />
        )}
      </div>
    );
  }

  // Show main app if user is logged in
  return (
    <div className="App">
      <div className="container">
        <header className="card">
          <div className="header-content">
            <div className="header-left">
              <h1>🤖 SecureVault AI</h1>
              <p>Smart Password Management with AI Agents for Analysis & Interactive Guidance</p>
              <div className="ai-status">
                <span className={`status-indicator ${aiStatus === 'Active' ? 'active' : aiStatus === 'Error' ? 'error' : 'initializing'}`}>
                  {aiStatus === 'Active' ? '🟢' : aiStatus === 'Error' ? '🔴' : '🟡'} AI System: {aiStatus}
                </span>
              </div>
            </div>
            <div className="header-right">
              <UserProfile user={currentUser} onLogout={handleLogout} />
            </div>
          </div>
        </header>

        <div className="tabs">
          <div 
            className={`tab ${activeTab === 'ai-checker' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-checker')}
          >
            🤖 AI Password Checker
          </div>
          <div 
            className={`tab ${activeTab === 'ai-advisor' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-advisor')}
          >
            💬 AI Security Advisor
          </div>
          <div 
            className={`tab ${activeTab === 'vault' ? 'active' : ''}`}
            onClick={() => setActiveTab('vault')}
          >
            🗄️ Password Vault (Demo)
          </div>
        </div>

        {activeTab === 'ai-checker' && (
          <PasswordStrengthChecker 
            onAddToVault={addPassword}
            aiManager={aiManager}
            aiStatus={aiStatus}
          />
        )}

        {activeTab === 'ai-advisor' && (
          <AIAgentInterface 
            aiManager={aiManager}
            aiStatus={aiStatus}
          />
        )}

        {activeTab === 'vault' && (
          <PasswordVault 
            passwords={passwords}
            onDeletePassword={deletePassword}
            onUpdatePassword={updatePassword}
          />
        )}
      </div>
    </div>
  );
}

export default App;
