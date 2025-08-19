import React, { useState, useContext } from 'react';
import { LogIn } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const LoginForm = ({ onSubmit, loading }) => {
  const { theme } = useContext(ThemeContext);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form.username, form.password);
  };

  const inputClasses = `w-full px-4 py-3 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    theme === 'dark'
      ? 'bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:bg-gray-700'
      : 'bg-white text-gray-900 border border-gray-300 placeholder-gray-500 focus:bg-gray-50'
  }`;

  const labelClasses = `block text-sm font-medium mb-2 ${
    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="username" className={labelClasses}>
          Username / Email / Mobile
        </label>
        <input
          type="text"
          id="username"
          placeholder="Enter username, email or mobile"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className={inputClasses}
          autoComplete="username"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClasses}>
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={inputClasses}
          autoComplete="current-password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-500/50 ${
          loading 
            ? "opacity-50 cursor-not-allowed bg-gray-400" 
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        }`}
      >
        <LogIn className="w-5 h-5" />
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;