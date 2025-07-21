import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './hooks/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
}
