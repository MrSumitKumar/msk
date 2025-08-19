import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const RegisterCard = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Join MSK Institute
        </h2>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Create your account to start your learning journey
        </p>
        <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <Link 
            to="/login" 
            className={`font-medium transition-colors duration-200 ${
              theme === 'dark' 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-500'
            }`}
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* Form Card */}
      <div className={`rounded-2xl shadow-2xl border transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-700 shadow-gray-900/50'
          : 'bg-white border-gray-200 shadow-gray-200/50'
      }`}>
        <div className="p-8">
          {children}
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="mt-6 text-center">
        <Link 
          to="/" 
          className={`inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
            theme === 'dark' 
              ? 'text-gray-400 hover:text-gray-300' 
              : 'text-gray-600 hover:text-gray-500'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default RegisterCard;