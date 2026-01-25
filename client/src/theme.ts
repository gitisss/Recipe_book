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
export const lightTheme = createTheme({
  ...baseTheme,
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
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: blue[400],
      light: blue[300],
      dark: blue[600],
    },
    secondary: {
      main: teal[400],
      light: teal[300],
      dark: teal[600],
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  components: {
    ...baseTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: teal[400],
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
export const oceanTheme = createTheme({
  ...baseTheme,
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
export const sunsetTheme = createTheme({
  ...baseTheme,
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
export const parpleTheme = createTheme({
  ...baseTheme,
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
export const getTheme = (mode: ThemeMode) => {
  switch (mode) {
    case 'dark':
      return darkTheme;
    case 'ocean':
      return oceanTheme;
    case 'sunset':
      return sunsetTheme;
    case 'theoretical':
      return parpleTheme;
    default:
      return lightTheme;
  }
};

