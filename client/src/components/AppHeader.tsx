import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Tooltip, Avatar, Divider, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import PaletteIcon from '@mui/icons-material/Palette';
import { useThemeMode } from '../contexts/ThemeContext';
import type { ThemeMode } from '../theme';

// Flag Icons
const IsraelFlag = () => (
  <svg width="20" height="15" viewBox="0 0 330 240" style={{ marginRight: '8px', marginLeft: '8px' }}>
    <rect width="330" height="240" fill="#fff" />
    <rect width="330" height="40" y="20" fill="#0038b8" />
    <rect width="330" height="40" y="180" fill="#0038b8" />
    <path d="M165 65l35 60h-70l35-60zM165 175l35-60h-70l35 60z" fill="none" stroke="#0038b8" strokeWidth="8" />
    <path d="M130 90h70l-35 60-35-60zM130 150h70l-35-60-35 60z" fill="none" stroke="#0038b8" strokeWidth="8" />
  </svg>
);

const UKFlag = () => (
  <svg width="20" height="15" viewBox="0 0 60 30" style={{ marginRight: '8px', marginLeft: '8px' }}>
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#s)" stroke="#C8102E" strokeWidth="4" />
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

interface AppHeaderProps {
  currentUser: { id: string; username: string } | null;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentUser, onLogout }) => {
  const { t, i18n } = useTranslation();
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

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('he') ? 'en' : 'he';
    i18n.changeLanguage(newLang);
    // document.dir intentionaly left unchanged per user request to keep layout stable
  };

  const currentLang = i18n.language.split('-')[0];

  const themeLabels: Record<ThemeMode, string> = {
    light: t('header.themes.light'),
    dark: t('header.themes.dark'),
    ocean: t('header.themes.ocean'),
    sunset: t('header.themes.sunset'),
    theoretical: t('header.themes.theoretical'),
  };

  // Get first letter of username for avatar
  const getAvatarInitial = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <AppBar
      position="fixed"
      dir="ltr"
      sx={(theme) => ({
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          animation: 'pulse-header 10s infinite linear',
        },
        '@keyframes pulse-header': {
          '0%': { opacity: 0.5 },
          '50%': { opacity: 0.8 },
          '100%': { opacity: 0.5 },
        }
      })}>
      <Toolbar dir="ltr" sx={{ minHeight: '48px !important', py: 0.5, gap: 1 }}>
        <IconButton
          component={Link}
          to="/"
          color="inherit"
          size="small"
          edge="start"
          sx={{ mr: 1, '&:hover': { transform: 'scale(1.1)' }, transition: 'all 0.2s' }}
        >
          <HomeIcon fontSize="small" />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: '1.1rem', fontWeight: 700 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            {t('header.appTitle')}
          </Link>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* אזור ערכת נושא */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={t('header.selectTheme')}>
              <Button
                color="inherit"
                onClick={handleClick}
                startIcon={<PaletteIcon fontSize="small" />}
                aria-controls={open ? 'theme-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{ textTransform: 'none', fontSize: '0.875rem', py: 0.5 }}
              >
                {t('header.theme')} {themeLabels[mode]}
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

          {/* אזור שפה - Toggle Button */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              color="inherit"
              onClick={toggleLanguage}
              startIcon={currentLang === 'he' ? <IsraelFlag /> : <UKFlag />}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                py: 0.5,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                px: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {currentLang === 'he' ? 'עברית' : 'English'}
            </Button>
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
                  {t('auth.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login" sx={{ textTransform: 'none', fontSize: '0.875rem', py: 0.5 }}>
                  {t('auth.login')}
                </Button>
                <Button color="inherit" component={Link} to="/signup" sx={{ textTransform: 'none', fontSize: '0.875rem', py: 0.5 }}>
                  {t('auth.signup')}
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