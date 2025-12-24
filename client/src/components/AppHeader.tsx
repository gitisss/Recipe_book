// client/src/components/AppHeader.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../contexts/ThemeContext';

interface AppHeaderProps {
  currentUser: { id: string; username: string } | null;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentUser, onLogout }) => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ספר המתכונים שלי
          </Link>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={toggleTheme} aria-label="החלף מצב תצוגה">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          {currentUser ? (
            <>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                שלום, {currentUser.username}
              </Typography>
              <Button color="inherit" onClick={onLogout}>
                התנתק
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                התחבר
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                הירשם
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;