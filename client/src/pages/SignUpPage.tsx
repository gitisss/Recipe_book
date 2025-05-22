import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // הוספנו Link לקישור לדף התחברות
import './FormStyles.css'; // ניצור קובץ CSS משותף לטפסים

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(''); // איפוס הודעה קודמת

    if (password !== confirmPassword) {
      setMessage('הסיסמאות אינן תואמות.');
      return;
    }

    if (password.length < 6) {
        setMessage('הסיסמה חייבת להכיל לפחות 6 תווים.');
        return;
    }

    setIsLoading(true);
    try {
      // ודא שהכתובת תואמת לשרת שלך (http://localhost:3000/api/signup)
      const response = await axios.post('http://localhost:3000/api/signup', {
        username,
        password,
      });
      setMessage(response.data.message || 'ההרשמה בוצעה בהצלחה!');
      // אפשר להוסיף השהייה קצרה ואז ניווט לדף התחברות
      setTimeout(() => {
        navigate('/login');
      }, 2000); // השהייה של 2 שניות
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || 'אירעה שגיאה בתהליך ההרשמה.');
      } else {
        setMessage('אירעה שגיאה לא צפויה בתהליך ההרשמה.');
      }
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>הרשמה</h2>
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
        <div className="form-group">
          <label htmlFor="confirmPassword">אימות סיסמה:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'שולח...' : 'הירשם'}
        </button>
      </form>
      {message && <p className={`message ${message.startsWith('אירעה שגיאה') || message.startsWith('הסיסמאות') ? 'error-message' : 'success-message'}`}>{message}</p>}
      <p className="form-link">
        כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link>
      </p>
    </div>
  );
};

export default SignUpPage;
