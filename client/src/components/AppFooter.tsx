// client/src/components/AppFooter.tsx
import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

// אייקון GitHub SVG
const GitHubIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }}
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
    />
  </svg>
);

const AppFooter: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box sx={(theme) => {
      const isDark = theme.palette.mode === 'dark';
      return {
        background: isDark
          ? `rgba(16, 31, 51, 0.8)` // Glassmorphism for dark mode
          : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        backdropFilter: isDark ? 'blur(10px)' : 'none',
        borderTop: isDark ? `1px solid rgba(255, 255, 255, 0.1)` : 'none',
        color: isDark ? theme.palette.text.primary : 'white',
        p: 1,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        boxShadow: isDark ? '0 -2px 10px rgba(0,0,0,0.3)' : '0 -2px 10px rgba(0,0,0,0.1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? 'radial-gradient(circle at 80% 50%, rgba(144, 202, 249, 0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          animation: 'pulse-footer 12s infinite linear',
          pointerEvents: 'none', // Allow clicks to pass through
        },
        '@keyframes pulse-footer': {
          '0%': { opacity: 0.3 },
          '50%': { opacity: 0.6 },
          '100%': { opacity: 0.3 },
        }
      };
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="body2" align="center" sx={{ fontSize: '0.875rem' }}>
          <Link
            color="inherit"
            href="https://github.com/gitisss/CookBook"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            {' © '}
            {t('header.appTitle')}
            <GitHubIcon size={18} />
            {' '}
            {new Date().getFullYear()}
            {'.'}
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default AppFooter;