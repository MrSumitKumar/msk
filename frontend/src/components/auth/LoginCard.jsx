import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

const LoginCard = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`rounded-2xl shadow-2xl w-full max-w-md p-8 border transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-gray-900 border-gray-700 shadow-gray-900/50'
        : 'bg-white border-gray-200 shadow-gray-200/50'
    }`}>
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
          Welcome Back
        </h2>
        <p className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Login to access your MSK Institute account
        </p>
      </div>

      {children}

      <div className="mt-8 text-center">
        <p className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Don't have an account?{" "}
          <Link 
            to="/register" 
            className={`font-medium transition-colors duration-200 ${
              theme === 'dark' 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-500'
            }`}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginCard;