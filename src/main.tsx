import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against benign vite HMR websocket closing notices in sandboxed iframe environment
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason === 'object' && event.reason.message && event.reason.message.includes('WebSocket')) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
