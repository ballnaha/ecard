import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#615b56', // Warm deep grey
      light: '#88827c',
      dark: '#4a4542',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d4cfc7', // Border grey
      dark: '#b6b0a8',
      contrastText: '#4a4542',
    },
    background: {
      default: '#ffffff', // Set to white to resolve extra gold color on mobile
      paper: '#f9f8f6', // Clean warm white card
    },
    text: {
      primary: '#4a4542', // Grey-brown text
      secondary: '#8a837e', // Lighter text
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Prompt", sans-serif',
    h1: {
      fontFamily: '"Parisienne", "Prompt", serif',
      fontWeight: 400,
      fontSize: '3.5rem',
      color: '#4a4542',
    },
    h2: {
      fontFamily: '"Parisienne", "Prompt", serif',
      fontWeight: 400,
      fontSize: '3rem',
      color: '#4a4542',
    },
    h3: {
      fontFamily: '"Parisienne", "Prompt", cursive',
      fontWeight: 400,
      color: '#615b56',
      fontSize: '4rem',
    },
    h4: {
      fontFamily: '"Cormorant Garamond", "Prompt", serif',
      fontWeight: 400,
      fontStyle: 'italic',
      color: '#615b56',
    },
    h5: {
      fontFamily: '"Montserrat", "Prompt", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Montserrat", "Prompt", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Montserrat", "Prompt", sans-serif',
    },
    subtitle2: {
      fontFamily: '"Montserrat", "Prompt", sans-serif',
    },
    body1: {
      fontFamily: '"Montserrat", "Prompt", sans-serif',
      fontSize: '0.9rem',
      lineHeight: 1.8,
      fontWeight: 300,
      color: '#615b56',
    },
    body2: {
      fontFamily: '"Montserrat", "Prompt", sans-serif',
      fontSize: '0.85rem',
    },
    button: {
      fontFamily: '"Montserrat", "Prompt", sans-serif',
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"Montserrat", "Prompt", sans-serif',
    },
    overline: {
      fontFamily: '"Montserrat", "Prompt", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      fontSize: '0.65rem',
      color: '#8a837e',
    },
  },
  shape: {
    borderRadius: 24, // Rounded cards matching the slide style
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Pill shaped buttons like 'Anna De - creator'
          textTransform: 'none', // No uppercase for buttons here
          fontWeight: 600,
          fontFamily: '"Prompt", sans-serif',
          fontSize: '0.95rem',
          padding: '6px 24px',
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: 'transparent',
          color: '#4a4542',
          border: '1px solid #4a4542',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#f9f8f6',
            boxShadow: 'none',
          },
        },
        outlinedPrimary: {
          borderColor: '#4a4542',
          borderWidth: '1px',
          color: '#4a4542',
          '&:hover': {
            borderWidth: '1px',
            backgroundColor: 'rgba(74, 69, 66, 0.05)',
            borderColor: '#4a4542',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontWeight: 500,
            color: 'rgba(74, 69, 66, 0.85)',
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            color: 'rgba(74, 69, 66, 0.6)',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          color: 'rgba(74, 69, 66, 0.85)',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          color: 'rgba(74, 69, 66, 0.65)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontWeight: 500,
          color: 'rgba(74, 69, 66, 0.85)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          color: 'rgba(74, 69, 66, 0.85)',
          fontFamily: '"Prompt", sans-serif',
        },
      },
    },
  },
});

export default theme;
