// src/App.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import { routes } from './routes';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const App = () => {
  const { theme } = useContext(ThemeContext);
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // -----------------------------
  // Handle window resize for responsive layout
  // -----------------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // -----------------------------
  // Public path detection
  // -----------------------------
  const publicRegex = [
    /^\/login$/,
    /^\/register$/,
    /^\/about$/,
    /^\/contact$/,
    /^\/notes$/,
    /^\/projects(\/.*)?$/,
    /^\/courses(\/.*)?$/,
    /^\/forgot-password$/,
    /^\/reset-password(\/.*)?$/,
    /^\/verify-certificate$/,
  ];

  const isPublic = publicRegex.some((regex) => regex.test(location.pathname));

  // -----------------------------
  // Auth-based redirection
  // -----------------------------
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated && !isPublic) {
      navigate('/');
    }
  }, [isAuthenticated, loading, location.pathname, navigate, user, isPublic]);

  // -----------------------------
  // Render
  // -----------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1">
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </div>

      {/* Footer */}
      <Footer />

      {/* Notifications */}
      <Toaster
        position={isMobile ? 'top-center' : 'bottom-right'}
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: { fontSize: '0.9rem' },
        }}
      />
    </div>
  );
};

export default App;
