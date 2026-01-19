import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SignUpPage from './pages/SignUpPage';
import { Box, styled } from '@mui/material';
import { ThemeContextProvider } from './contexts/ThemeContext';

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

  const StyledRootBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: theme.palette.background.default,
    fontFamily: theme.typography.fontFamily,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  }));

  const StyledLoadingBox = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '1.2rem',
    color: theme.palette.text.primary,
  }));

  const StyledNotFoundBox = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginTop: '2rem',
    color: theme.palette.text.primary,
    '& h1': {
      color: theme.palette.text.primary,
    },
    '& p': {
      color: theme.palette.text.secondary,
    },
    '& a': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  }));

  if (isLoadingAuth) {
    return (
      <ThemeContextProvider>
        <StyledLoadingBox>טוען אפליקציה...</StyledLoadingBox>
      </ThemeContextProvider>
    );
  }

  return (
    <ThemeContextProvider>
      <StyledRootBox>
        <Router>
          <Box sx={{ flexGrow: 1 }}>
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
                  ? (
                    <StyledNotFoundBox>
                      <h1>404 - עמוד לא נמצא</h1>
                      <p>העמוד שחיפשת אינו קיים. <Link to="/dashboard">חזור לדאשבורד</Link></p>
                    </StyledNotFoundBox>
                  )
                  : <Navigate to="/login" replace />
              } />
            </Routes>
          </Box> 
        </Router>
      </StyledRootBox>
    </ThemeContextProvider>
  );
}

export default App;