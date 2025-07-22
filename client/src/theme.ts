// client/src/theme.ts
import { createTheme } from '@mui/material/styles';
import { blue, teal, grey, lightBlue, green } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: blue['700'],
      light: blue['400'],
      dark: blue['800'],
    },
    secondary: {
      main: teal['A400'],
      light: teal['A200'],
      dark: teal['A700'],
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: grey['100'],
      paper: '#ffffff',
    },
    text: {
      primary: grey['900'],
      secondary: grey['700'],
    },
  },
  typography: {
    fontFamily: 'Heebo, Arial, sans-serif',
    h4: {
      fontWeight: 600,
      color: blue['800'],
    },
    h5: {
      fontWeight: 500,
      color: grey['800'],
    },
    h6: {
      fontWeight: 500,
      color: grey['800'],
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: blue['800'],
          color: 'white',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        containedPrimary: {
          backgroundColor: blue['600'],
          color: 'white',
          '&:hover': {
            backgroundColor: blue['700'],
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          },
        },
        outlinedPrimary: {
          borderColor: blue['500'],
          color: blue['700'],
          '&:hover': {
            borderColor: blue['600'],
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
        },
        containedSecondary: {
          backgroundColor: teal['A400'],
          color: 'white',
          '&:hover': {
            backgroundColor: teal['A700'],
          },
        },
        outlinedSecondary: {
          borderColor: teal['A400'],
          color: teal['A700'],
          '&:hover': {
            backgroundColor: 'rgba(0, 150, 136, 0.08)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: grey['600'],
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: teal['A400'],
          color: 'white',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: grey['300'],
          margin: '24px 0',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: blue['700'],
          '&:hover': {
            color: blue['500'],
          },
        },
      },
    },
    MuiContainer: { 
      styleOverrides: {
        root: {
        },
      },
    },
  },
});

export default theme;