import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SignUpPage from './pages/SignUpPage';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import './App.css';

interface UserData {
  id: string;
  username: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userDataString = localStorage.getItem('currentUser');

    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString) as UserData;
        setIsAuthenticated(true);
        setCurrentUser(userData);
      } catch (e) {
        console.error("Error parsing user data from localStorage or invalid token:", e);
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
  }, []);

  if (isLoadingAuth) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>טוען אפליקציה...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      {/* ה-Box הראשי יהיה Flex Container בכיוון עמודה, שידחוף את הפוטר לתחתית */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', bgcolor: 'background.default' }}>
        <Router>
          {/* עוטף את ה-Routes ב-Box נפרד עם flexGrow: 1 כדי לדחוף את הפוטר */}
          <Box sx={{ flexGrow: 1 }}> {/* <-- שינוי: Box חדש עם flexGrow: 1 */}
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
              <Route path="*" element={
                isAuthenticated
                  ? <div style={{textAlign: 'center', marginTop: '2rem'}}><h1>404 - עמוד לא נמצא</h1><p>העמוד שחיפשת אינו קיים. <Link to="/dashboard">חזור לדאשבורד</Link></p></div>
                  : <Navigate to="/login" replace />
              } />
            </Routes>
          </Box> 
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;