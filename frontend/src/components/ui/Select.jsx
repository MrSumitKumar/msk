import React from 'react';

const Select = ({ 
  value,
  onChange,
  children,
  className = '',
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed';
  const themeClasses = 'bg-white border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white';
  
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${baseClasses} ${themeClasses} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;