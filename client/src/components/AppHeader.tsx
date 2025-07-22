// client/src/components/AppHeader.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

interface AppHeaderProps {
  currentUser: { id: string; username: string } | null;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ספר המתכונים שלי
          </Link>
        </Typography>
        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              שלום, {currentUser.username}
            </Typography>
            <Button color="inherit" onClick={onLogout}>
              התנתק
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login">
              התחבר
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              הירשם
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;