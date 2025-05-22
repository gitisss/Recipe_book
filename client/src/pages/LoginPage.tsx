import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './FormStyles.css'; // שימוש בקובץ ה-CSS המשותף

interface LoginPageProps {
  onLoginSuccess: () => void; // פונקציה שתקרא בהתחברות מוצלחת
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
      const response = await axios.post('http://localhost:3000/api/logIn', { username, password });
      setMessage('התחברות מוצלחת!');
      // כאן נשמור את הטוקן האמיתי מהתגובה בעתיד
      // localStorage.setItem('authToken', response.data.token); 
      onLoginSuccess(); // קריאה לפונקציה שקיבלנו כ-prop
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || 'שגיאת התחברות. בדוק שם משתמש וסיסמה.');
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
      {message && <p className={`message ${message.startsWith('שגיאת התחברות') ? 'error-message' : 'success-message'}`}>{message}</p>}
      <p className="form-link">
        אין לך חשבון? <Link to="/signup">הירשם כאן</Link>
      </p>
    </div>
  );
};

export default LoginPage;
