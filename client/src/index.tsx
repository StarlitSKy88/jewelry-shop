import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import theme from './theme';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { ToastProvider } from './components/Toast/ToastProvider';
import { ConfirmProvider } from './components/ConfirmDialog/ConfirmProvider';
import { ImagePreviewProvider } from './components/ImagePreview/ImagePreviewProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastProvider>
            <ConfirmProvider>
              <ImagePreviewProvider>
                <App />
              </ImagePreviewProvider>
            </ConfirmProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// 注册 Service Worker
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('Service Worker 注册成功:', registration);
  },
  onUpdate: (registration) => {
    console.log('Service Worker 更新可用:', registration);
  },
}); 