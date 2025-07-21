import React, { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';

const App = () => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-black'
      } transition-colors duration-300`}
    >
      <Header />

      <div className="flex-1">
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </main>
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
