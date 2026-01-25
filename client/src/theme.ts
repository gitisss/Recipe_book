// client/src/theme.ts
import { createTheme } from '@mui/material/styles';
import { blue, teal, cyan, orange, pink, purple } from '@mui/material/colors';

// Theme mode type
export type ThemeMode = 'light' | 'dark' | 'ocean' | 'sunset' | 'theoretical';

// Base theme configuration (shared between light and dark)
const baseTheme = {
  typography: {
    fontFamily: '"Assistant", "Heebo", "Arial", "Helvetica", sans-serif',
    button: {
      textTransform: 'none' as const,
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
  },
};

// Light theme
export const lightTheme = (direction: 'rtl' | 'ltr' = 'ltr') => createTheme({
  ...baseTheme,
  direction,
  palette: {
    mode: 'light',
    primary: {
      main: blue[700],
      light: blue[400],
      dark: blue[900],
    },
    secondary: {
      main: teal[600],
      light: teal[400],
      dark: teal[800],
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    ...baseTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: blue[800],
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: teal[600],
        },
      },
    },
  },
});

// Dark theme
export const darkTheme = (direction: 'rtl' | 'ltr' = 'ltr') => createTheme({
  ...baseTheme,
  direction,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Softer blue
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    secondary: {
      main: '#4db6ac', // Softer teal
      light: '#b2dfdb',
      dark: '#00897b',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    background: {
      default: '#0a1929', // Deep navy background instead of pitch black
      paper: '#101f33',   // Slightly lighter navy for cards
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  components: {
    ...baseTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#101f33',
          backgroundImage: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          ...baseTheme.components.MuiCard.styleOverrides.root,
          backgroundColor: '#172a3d',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#4db6ac',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          },
        },
      },
    },
  },
});

// Default export (light theme for backward compatibility)
const theme = lightTheme;
export default theme;

// Ocean theme (כחול-ירוק)
export const oceanTheme = (direction: 'rtl' | 'ltr' = 'ltr') => createTheme({
  ...baseTheme,
  direction,
  palette: {
    mode: 'light',
    primary: {
      main: cyan[700],
      light: cyan[400],
      dark: cyan[900],
    },
    secondary: {
      main: teal[500],
      light: teal[300],
      dark: teal[700],
    },
    background: {
      default: '#e0f7fa',
      paper: '#ffffff',
    },
  },
  components: {
    ...baseTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: cyan[800],
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: teal[500],
        },
      },
    },
  },
});

// Sunset theme (כתום-ורוד)
export const sunsetTheme = (direction: 'rtl' | 'ltr' = 'ltr') => createTheme({
  ...baseTheme,
  direction,
  palette: {
    mode: 'light',
    primary: {
      main: orange[700],
      light: orange[400],
      dark: orange[900],
    },
    secondary: {
      main: pink[500],
      light: pink[300],
      dark: pink[700],
    },
    background: {
      default: '#fff3e0',
      paper: '#ffffff',
    },
  },
  components: {
    ...baseTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: orange[800],
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: pink[500],
        },
      },
    },
  },
});

// סגול theme
export const purpleTheme = (direction: 'rtl' | 'ltr' = 'ltr') => createTheme({
  ...baseTheme,
  direction,
  palette: {
    mode: 'light',
    primary: {
      main: purple[700],
      light: purple[400],
      dark: purple[900],
    },
    secondary: {
      main: pink[500],
      light: pink[300],
      dark: pink[700],
    },
    background: {
      default: '#f0f0f0',
      paper: '#ffffff',
    },
  },
  components: {
    ...baseTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: purple[800],
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: pink[500],
        },
      },
    },
  },
});

// Helper function to get theme based on mode
export const getTheme = (mode: ThemeMode, direction: 'rtl' | 'ltr' = 'ltr') => {
  switch (mode) {
    case 'dark':
      return darkTheme(direction);
    case 'ocean':
      return oceanTheme(direction);
    case 'sunset':
      return sunsetTheme(direction);
    case 'theoretical':
      return purpleTheme(direction);
    default:
      return lightTheme(direction);
  }
};

