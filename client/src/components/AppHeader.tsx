// client/src/components/AppHeader.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';

// הגדרת מבנה לנתוני משתמש (User)
interface UserData {
  id: string;
  username: string;
}

interface AppHeaderProps {
  currentUser: UserData | null;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ספר המתכונים שלי
        </Typography>
        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              שלום, {currentUser.username}!
            </Typography>
            <Button color="inherit" onClick={onLogout}>
              התנתק
            </Button>
          </Box>
        )}
        {!currentUser && (
          <Button color="inherit" onClick={() => alert('ניווט לדף התחברות (לא מחובר כרגע)')}>
            התחבר
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;