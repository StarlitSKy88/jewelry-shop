import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C4A661', // 金色
      light: '#D4B671',
      dark: '#B49651',
    },
    secondary: {
      main: '#1A1A1A', // 深灰色
      light: '#2A2A2A',
      dark: '#0A0A0A',
    },
    background: {
      default: '#000000',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      letterSpacing: '0.2rem',
      textTransform: 'uppercase',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      letterSpacing: '0.1rem',
      textTransform: 'uppercase',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '0.1rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      letterSpacing: '0.05rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 600,
      letterSpacing: '0.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '12px 24px',
        },
        contained: {
          backgroundColor: '#C4A661',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#D4B671',
          },
        },
        outlined: {
          borderColor: '#C4A661',
          color: '#C4A661',
          '&:hover': {
            borderColor: '#D4B671',
            backgroundColor: 'rgba(196, 166, 97, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1A1A1A',
          color: '#FFFFFF',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          borderRadius: 0,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
        },
      },
    },
  },
});

export default theme; 