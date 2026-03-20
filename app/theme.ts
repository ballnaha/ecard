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
      default: '#efece5', // Linen scrapbook outer background
      paper: '#f9f8f6', // Clean warm white card
    },
    text: {
      primary: '#4a4542', // Grey-brown text
      secondary: '#8a837e', // Lighter text
    },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
      color: '#4a4542',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 400,
      color: '#4a4542',
    },
    h3: {
      fontFamily: '"Italianno", cursive',
      fontWeight: 400,
      color: '#615b56',
      fontSize: '4rem',
    },
    h4: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 400,
      fontStyle: 'italic',
      color: '#615b56',
    },
    body1: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '0.9rem',
      lineHeight: 1.8,
      fontWeight: 300,
      color: '#615b56',
    },
    overline: {
      fontFamily: '"Montserrat", sans-serif',
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
          fontWeight: 500,
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: '1rem',
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
    }
  },
});

export default theme;
