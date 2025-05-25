import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'; // ודא ש-Link מיובא
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SignUpPage from './pages/SignUpPage';
import apiClient from './apiClient';
import './App.css';

interface UserData {
  id: string;
  username: string;
  // אפשר להוסיף כאן עוד שדות אם השרת מחזיר אותם
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);//אוטנטיקייטד
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // פונקציה לבדיקת הטוקן בעת טעינת האפליקציה
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userDataString = localStorage.getItem('currentUser');

    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString) as UserData;
        // צריך להוסיף בדיקה מול השרת אם הטוקן עדיין תקף
        // לדוגמה, קריאה ל- apiClient.get('/auth/verify-token');
       
        // אם הבדיקה מצליחה:
        setIsAuthenticated(true);
        setCurrentUser(userData);
      } catch (e) {
        console.error("Error parsing user data from localStorage or invalid token:", e);
        // ניקוי אחסון מקומי אם הנתונים לא תקינים
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    }
    setIsLoadingAuth(false);
  }, []);

  const handleLoginSuccess = useCallback((token: string, userData: UserData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setIsAuthenticated(true);
    setCurrentUser(userData);
    console.log("Login successful, token and user data stored.");
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    console.log("User logged out.");
    // הניווט לדף ההתחברות יתבצע אוטומטית על ידי ה-Routes
  }, []);

  if (isLoadingAuth) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>טוען אפליקציה...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/signup" 
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardPage currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />
        {/* נתיב ברירת מחדל למקרה שלא נמצא נתיב מתאים */}
        <Route path="*" element={
          isAuthenticated 
            ? <div style={{textAlign: 'center', marginTop: '2rem'}}><h1>404 - עמוד לא נמצא</h1><p>העמוד שחיפשת אינו קיים. <Link to="/dashboard">חזור לדאשבורד</Link></p></div> 
            : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
