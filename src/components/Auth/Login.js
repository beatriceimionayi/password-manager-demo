import React, { useState } from 'react';
import './Auth.css';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get stored users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('securevault_users') || '[]');
      const user = storedUsers.find(u => 
        u.email.toLowerCase() === formData.email.toLowerCase() && 
        u.password === formData.password
      );

      if (user) {
        // Store current user session
        localStorage.setItem('securevault_current_user', JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          loginTime: new Date().toISOString()
        }));
        
        onLogin(user);
      } else {
        setErrors({ general: 'Invalid email or password' });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🔐 Welcome Back</h2>
          <p>Sign in to access your SecureVault AI</p>
          <div className="welcome-features">
            <span>🔒 Secure Password Management</span>
            <span>🤖 AI-Powered Analysis</span>
            <span>💡 Security Guidance</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <button type="button" className="forgot-password">
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit" 
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="demo-section">
            <div className="divider">
              <span>or</span>
            </div>
            <button 
              type="button" 
              className="auth-button secondary demo-button"
              onClick={() => {
                // Auto-fill demo credentials
                setFormData({
                  email: 'demo@securevault.ai',
                  password: 'DemoPass123!'
                });
              }}
            >
              🚀 Try Demo Account
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button 
              type="button" 
              className="link-button"
              onClick={onSwitchToRegister}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
