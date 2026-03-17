'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ccac71', // Rich Elegant Gold
      light: '#e0c89c',
      dark: '#b39050',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#fcfcfc',
      dark: '#f0f0f0',
      contrastText: '#1c1c1c',
    },
    background: {
      default: '#FFFFFF', // Pure minimalist white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1c1c1c', // Very dark grey, softer than pure black
      secondary: '#888888', // Elegant mid-grey
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Prompt", sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", "Prompt", serif',
      fontWeight: 400,
      color: '#1c1c1c',
    },
    h2: {
      fontFamily: '"Cormorant Garamond", "Prompt", serif',
      fontWeight: 400,
      color: '#1c1c1c',
    },
    h3: {
      fontFamily: '"Cormorant Garamond", "Prompt", serif',
      fontWeight: 400,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", "Prompt", serif',
      fontWeight: 400,
    },
    h5: {
      fontFamily: '"Cormorant Garamond", "Prompt", serif',
      fontWeight: 400,
    },
    h6: {
      fontFamily: '"Montserrat", "Prompt", sans-serif', // Using Montserrat for clean, modern overlines
      fontWeight: 400,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
    },
    overline: {
      fontFamily: '"Montserrat", "Prompt", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 0, // Sharp edges for luxury look
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontWeight: 400,
          fontFamily: '"Montserrat", "Prompt", sans-serif',
          fontSize: '0.8rem',
          padding: '14px 40px',
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: '#ccac71',
          color: '#fff',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#1c1c1c', // Black on hover for ultra modern luxury
            color: '#fff',
            boxShadow: 'none',
          },
        },
        outlinedPrimary: {
          borderColor: '#ccac71',
          borderWidth: '1px',
          color: '#ccac71',
          '&:hover': {
            borderWidth: '1px',
            backgroundColor: '#ccac71',
            color: '#fff',
          },
        },
        textPrimary: {
          color: '#1c1c1c',
          '&:hover': {
            backgroundColor: 'transparent',
            color: '#ccac71',
          },
        },
      },
    },
  },
});

export default theme;
