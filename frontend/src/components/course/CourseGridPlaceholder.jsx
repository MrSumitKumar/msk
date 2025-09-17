import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const CoursePlaceholder = ({ theme }) => (
  <div className={`group relative flex flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
    theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800/80' : 'bg-white hover:bg-gray-50'
  }`}>
    {/* Image Placeholder */}
    <div className="relative aspect-video overflow-hidden">
      <div className={`w-full h-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
      {/* Badge Placeholder */}
      <div className="absolute top-3 right-3">
        <div className={`h-6 w-24 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`} />
      </div>
    </div>
    
    {/* Content Placeholders */}
    <div className="flex flex-1 flex-col p-5 space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <div className={`h-6 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className={`h-6 w-3/4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className={`h-5 w-24 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-5 w-28 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>
        <div className="space-y-2">
          <div className={`h-5 w-24 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-5 w-28 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>
      </div>
      
      {/* Price Section */}
      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="space-y-1">
          <div className={`h-4 w-16 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className="flex items-center gap-2">
            <div className={`h-6 w-20 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-5 w-16 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </div>
        </div>
        <div className={`h-8 w-24 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
      </div>
    </div>
  </div>
);

const CourseGridPlaceholder = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="space-y-6">
      {/* Controls Placeholder */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className={`h-10 w-48 rounded animate-pulse ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
        }`} />
      </div>

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
        {Array.from({ length: 9 }).map((_, index) => (
          <CoursePlaceholder key={index} theme={theme} />
        ))}
      </div>
    </div>
  );
};

export default CourseGridPlaceholder;