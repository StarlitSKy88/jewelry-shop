import { createTheme } from '@mui/material/styles';
import { breakpoints, spacing } from './breakpoints';

export const theme = createTheme({
  breakpoints: {
    values: breakpoints.values,
  },
  spacing: (factor) => `${0.25 * factor}rem`,
  components: {
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.up('xs')]: {
            padding: theme.spacing(spacing.container.xs),
          },
          [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(spacing.container.sm),
          },
          [theme.breakpoints.up('md')]: {
            padding: theme.spacing(spacing.container.md),
          },
        }),
      },
    },
  },
}); 