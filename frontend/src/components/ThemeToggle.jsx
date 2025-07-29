import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded text-white bg-gray-700 hover:bg-gray-600"
    >
      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode' }
    </button>
  );
};

export default ThemeToggle;
