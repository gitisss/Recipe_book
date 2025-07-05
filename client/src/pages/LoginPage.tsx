import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './FormStyles.css'; // ודא שקובץ ה-CSS קיים בנתיב זה
import apiClient from '../apiClient'; // ייבוא apiClient

// הגדרת מבנה לנתוני משתמש, כדי שהטיפוס יהיה ברור יותר
interface UserData {
  id: string;
  username: string;
  // הוסף כאן שדות נוספים אם המשתמש אובייקט כולל אותם (למשל email, role וכו')
}

// הגדרת מבנה ל-props שהקומפוננטה מקבלת
interface LoginPageProps {
  onLoginSuccess: (token: string, userData: UserData) => void; // ודא ש-userData היא מהטיפוס הנכון
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // הודעות למשתמש (הצלחה/שגיאה)
  const [isLoading, setIsLoading] = useState(false); // מצב טעינה עבור הכפתור
  const navigate = useNavigate(); // Hook לניווט בין דפים

  // פונקציה לטיפול בשליחת טופס ההתחברות
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // מונע ריענון דף בברירת מחדל של טופס HTML

    setIsLoading(true); // הפעל מצב טעינה
    setMessage(''); // נקה הודעות קודמות

    try {
      // שליחת בקשת POST לנקודת הקצה של ההתחברות בשרת
      const response = await apiClient.post('/logIn', { username, password });

      // אם ההתחברות הצליחה וקיבלנו טוקן
      if (response.data && response.data.token && response.data.user) {
        setMessage('התחברת בהצלחה');
        // שמירת הטוקן ופרטי המשתמש ב-localStorage
        localStorage.setItem('authToken', response.data.token); // המפתח 'authToken' צריך להיות תואם למה ש-apiClient מצפה לו
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        
        // קריאה לפונקציית ההצלחה שהועברה כ-prop מ-App.tsx
        onLoginSuccess(response.data.token, response.data.user);
        
        // ניווט לדף לוח הבקרה לאחר התחברות מוצלחת
        navigate('/dashboard');
      } else {
        // אם השרת החזיר תגובה ללא טוקן או משתמש, אך ללא שגיאה מפורשת
        setMessage('התחברות נכשלה. נתונים שגויים מהשרת.');
      }
    } catch (error: any) {
      // טיפול בשגיאות מה-API (לדוגמה, שגיאות 400, 401, שגיאות רשת)
      console.error('Login error:', error);
      if (error.response) {
        // שגיאה מהשרת עם תגובה ספציפית
        setMessage(error.response.data.message || 'שגיאה בהתחברות. אנא נסה שוב.');
      } else if (error.request) {
        // הבקשה נשלחה אך לא התקבלה תגובה (למשל, השרת לא זמין)
        setMessage('שגיאת רשת: השרת אינו זמין. אנא וודא שהשרת פועל.');
      } else {
        // שגיאות אחרות
        setMessage('שגיאה בלתי צפויה. אנא נסה שוב.');
      }
    } finally {
      setIsLoading(false); // כבה מצב טעינה
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
      {/* הצגת הודעות למשתמש */}
      {message && <p className={`message ${message.includes('שגיא') || message.includes('נכשלה') ? 'error-message' : 'success-message'}`}>{message}</p>}
      <p className="form-link">
        אין לך חשבון? <Link to="/signup">הירשם כאן</Link>
      </p>
    </div>
  );
};

export default LoginPage;