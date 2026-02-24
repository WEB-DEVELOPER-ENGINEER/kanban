'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { queryClient } from '@/lib/queryClient';
import { theme } from '@/theme/muiTheme';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * AppProviders component wraps the application with necessary providers
 * - QueryClientProvider: Manages server state and caching
 * - ThemeProvider: Provides MUI theme tokens
 * - CssBaseline: Normalizes CSS across browsers
 * - SnackbarProvider: Provides toast notifications for user feedback
 * 
 * Requirements: 2.3, 2.5, 3.3, 3.5, 4.2, 4.3, 5.4
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          autoHideDuration={3000}
        >
          <CssBaseline />
          {children}
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
