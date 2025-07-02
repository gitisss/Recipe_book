import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './FormStyles.css';
import apiClient from '../apiClient'; // ייבוא apiClient

interface LoginPageProps {
  onLoginSuccess: (token: string, userData: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const response = await apiClient.post('/logIn', { username, password }); 
      
      if (response.data && response.data.token) {
        setMessage('התחברת בהצלחה');
        onLoginSuccess(response.data.token, response.data.user);
        navigate('/dashboard');
      } else {
        setMessage('התחברות הצליחה אך לא התקבל טוקן אימות.');
      }
    } catch (error: any) { 
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else if (error.message) {
        setMessage(`שגיאת התחברות: ${error.message}`);
      } else {
        setMessage('שגיאת התחברות: אירעה שגיאה לא צפויה.');
      }
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>התחברות</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">שם משתמש:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">סיסמה:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'מתחבר...' : 'התחבר'}
        </button>
      </form>
      {message && <p className={`message ${message.includes('שגיאת') ? 'error-message' : 'success-message'}`}>{message}</p>}
      <p className="form-link">
        אין לך חשבון? <Link to="/signup">הירשם כאן</Link>
      </p>
    </div>
  );
};

export default LoginPage;
