import { createTheme, ThemeOptions } from '@mui/material/styles';

// 定义调色板
const palette = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#fff',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#fff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
    contrastText: '#fff',
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
    contrastText: '#fff',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
    contrastText: '#fff',
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#fff',
  },
};

// 定义排版
const typography = {
  fontFamily: [
    'Noto Sans SC',
    'Roboto',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 500,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 500,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 500,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 400,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 400,
    textTransform: 'uppercase',
  },
};

// 定义组件样式覆盖
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)',
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
};

// 创建亮色主题
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...palette,
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography,
  components,
} as ThemeOptions);

// 创建暗色主题
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...palette,
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography,
  components,
} as ThemeOptions);

export { lightTheme, darkTheme }; 