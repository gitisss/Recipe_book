import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import { Box, styled } from '@mui/material';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

interface UserData {
  id: string;
  username: string;
}


const StyledRootBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  width: '100%',
  backgroundColor: theme.palette.background.default,
  backgroundImage: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(0,0,0,0.9) 100%)`
    : `linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(30,136,229,0.1) 100%)`,
  backgroundAttachment: 'fixed',
  animation: 'color-shift 30s infinite alternate linear', // NEW: Global color shift
  fontFamily: theme.typography.fontFamily,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle at center, ${theme.palette.mode === 'dark' ? 'rgba(30,136,229,0.2)' : 'rgba(30,136,229,0.15)'} 0%, transparent 70%)`,
    animation: 'pulse 25s infinite ease-in-out',
    zIndex: 0,
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'fixed',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle at 70% 30%, ${theme.palette.mode === 'dark' ? 'rgba(156,39,176,0.15)' : 'rgba(156,39,176,0.12)'} 0%, transparent 60%)`,
    animation: 'pulse-slow 35s infinite ease-in-out alternate',
    zIndex: 0,
    pointerEvents: 'none',
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1) rotate(0deg)' },
    '50%': { transform: 'scale(1.2) rotate(180deg)' },
    '100%': { transform: 'scale(1) rotate(360deg)' },
  },
  '@keyframes pulse-slow': {
    '0%': { transform: 'scale(1) translate(-5%, -5%)' },
    '100%': { transform: 'scale(1.3) translate(5%, 5%)' },
  },
  '@keyframes color-shift': {
    '0%': { filter: 'hue-rotate(0deg)' },
    '100%': { filter: 'hue-rotate(45deg)' }, // Subtle but noticeable color shift
  }
}));

// Added a third moving layer for extra "WOW" factor
const AnimatedBackgroundLayer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '-50%',
  left: '-50%',
  width: '200%',
  height: '200%',
  background: `radial-gradient(circle at 20% 80%, ${theme.palette.mode === 'dark' ? 'rgba(76,175,80,0.12)' : 'rgba(76,175,80,0.1)'} 0%, transparent 50%)`,
  animation: 'pulse-extra 40s infinite ease-in-out alternate',
  zIndex: 0,
  pointerEvents: 'none',
  '@keyframes pulse-extra': {
    '0%': { transform: 'scale(1) translate(5%, -5%)' },
    '100%': { transform: 'scale(1.2) translate(-5%, 5%)' },
  }
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

function App() {
  const { t } = useTranslation();
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
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  useEffect(() => {
    const handleAuthLogout = () => {
      handleLogout();
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [handleLogout]);

  if (isLoadingAuth) {
    return (
      <ThemeContextProvider>
        <StyledLoadingBox>{t('common.loading')}</StyledLoadingBox>
      </ThemeContextProvider>
    );
  }

  return (
    <ThemeContextProvider>
      <StyledRootBox>
        <AnimatedBackgroundLayer />
        <Router>
          <AppHeader currentUser={currentUser} onLogout={handleLogout} />
          <Box component="main" sx={{
            flexGrow: 1,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
            pt: '48px',
            pb: '40px',
            boxSizing: 'border-box',
            overflow: 'hidden' // Ensure children manage their own scrolling
          }}>
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
                element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/"
                element={<HomePage isAuthenticated={isAuthenticated} />}
              />
              <Route path="*" element={
                isAuthenticated
                  ? (
                    <StyledNotFoundBox>
                      <h1>{t('common.notFound')}</h1>
                      <p>{t('common.notFoundMessage')} <Link to="/dashboard">{t('common.backToDashboard')}</Link></p>
                    </StyledNotFoundBox>
                  )
                  : <Navigate to="/login" replace />
              } />
            </Routes>
          </Box>
          <AppFooter />
        </Router>
      </StyledRootBox>
    </ThemeContextProvider>
  );
}

export default App;