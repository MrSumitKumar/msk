import { Toaster } from 'react-hot-toast';
import React, { useContext } from 'react';
import Footer from './components/layout/Footer';
import { routes } from './routes';
import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext';
import Header from './components/layout/Header';

const App = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header />

      <div className="flex-1">
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
      </div>

      <Footer />

      {/* Notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme={theme}
      />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
          },
        }}
      />
    </div>
  );
};

export default App;