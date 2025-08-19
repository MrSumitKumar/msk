import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className={`text-center p-4 mt-auto shadow-inner transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-gray-300 border-t border-gray-700' 
        : 'bg-blue-800 text-white'
    }`}>
      <p>© 2025 MSK Institute. All rights reserved.</p>
    </footer>
  );
};

export default Footer;