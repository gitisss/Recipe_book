// client/src/components/AppHeader.tsx
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Tooltip, Avatar, Divider} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { Link } from 'react-router-dom';
import PaletteIcon from '@mui/icons-material/Palette';
import { useThemeMode } from '../contexts/ThemeContext';
import type { ThemeMode } from '../theme';

interface AppHeaderProps {
  currentUser: { id: string; username: string } | null;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentUser, onLogout }) => {
  const { mode, setMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (themeMode: ThemeMode) => {
    setMode(themeMode);
    handleClose();
  };

  const themeLabels: Record<ThemeMode, string> = {
    light: 'בהיר',
    dark: 'כהה',
    ocean: 'אוקיינוס',
    sunset: 'שקיעה',
    theoretical: 'סגול',
  };

  // Get first letter of username for avatar
  const getAvatarInitial = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, zIndex: 1100 }}>
      <Toolbar sx={{ minHeight: '48px !important', py: 0.5 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: '1.1rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ספר המתכונים שלי
          </Link>
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* אזור ערכת נושא */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="בחר ערכת נושא">
                <Button
                color="inherit"
                onClick={handleClick}
                startIcon={<PaletteIcon fontSize="small" />}
                aria-controls={open ? 'theme-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{ textTransform: 'none', fontSize: '0.875rem', py: 0.5 }}
              >
                ערכת נושא: {themeLabels[mode]}
              </Button>
            </Tooltip>
            <Menu
              id="theme-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'theme-button',
              }}
            >
              <MenuItem onClick={() => handleThemeSelect('light')} selected={mode === 'light'}>
                {themeLabels.light}
              </MenuItem>
              <MenuItem onClick={() => handleThemeSelect('dark')} selected={mode === 'dark'}>
                {themeLabels.dark}
              </MenuItem>
              <MenuItem onClick={() => handleThemeSelect('ocean')} selected={mode === 'ocean'}>
                {themeLabels.ocean}
              </MenuItem>
              <MenuItem onClick={() => handleThemeSelect('sunset')} selected={mode === 'sunset'}>
                {themeLabels.sunset}
              </MenuItem>
              <MenuItem onClick={() => handleThemeSelect('theoretical')} selected={mode === 'theoretical'}>
                {themeLabels.theoretical}
              </MenuItem>
            </Menu>
          </Box>

          {/* Divider בין האזורים */}
          {currentUser && <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />}

          {/* אזור יוזר */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {currentUser ? (
              <>
                <Avatar sx={{ width: 28, height: 28 }}>
                  {getAvatarInitial(currentUser.username)}
                </Avatar>
                <Typography variant="subtitle1" sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '0.875rem' }}>
                  {currentUser.username}
                </Typography>
                <Button 
                  color="inherit" 
                  onClick={onLogout}
                  size="small"
                  startIcon={<LogoutIcon fontSize="small" />}
                  sx={{ textTransform: 'none', fontSize: '0.875rem', py: 0.5 }}
                >
                  התנתק
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login" sx={{ textTransform: 'none', fontSize: '0.875rem', py: 0.5 }}>
                  התחבר
                </Button>
                <Button color="inherit" component={Link} to="/signup" sx={{ textTransform: 'none', fontSize: '0.875rem', py: 0.5 }}>
                  הירשם
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;