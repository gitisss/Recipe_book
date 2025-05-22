import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SignUpPage from './pages/SignUpPage'; // ייבוא דף ההרשמה
import './App.css';

function App() {
  // לוגיקת אימות בסיסית - נשפר בהמשך עם טוקנים
  // כרגע, נניח שהמשתמש לא מחובר עד שהוא מתחבר בהצלחה
  // אפשר להשתמש ב-localStorage או Context API לניהול מצב האימות
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    // בדוק אם יש טוקן שמור (דוגמה פשוטה)
    // return !!localStorage.getItem('authToken');
    return false; // לצורך הדגמה ראשונית
  });

  // פונקציה שתקרא לאחר התחברות מוצלחת
  const handleLoginSuccess = () => {
    // localStorage.setItem('authToken', 'some_dummy_token'); // שמירת טוקן דמה
    setIsAuthenticated(true);
  };
  
  // פונקציה שתקרא בהתנתקות
  // const handleLogout = () => {
  //   localStorage.removeItem('authToken');
  //   setIsAuthenticated(false);
  // };

  return (
    <Router>
      <Routes>
        {/* העבר את פונקציית ההתחברות לקומפוננטת ההתחברות */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/dashboard" />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />
        {/* אפשר להוסיף נתיב "לא נמצא" */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
