import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import CourseCard from './CourseCard';

const CourseGrid = ({ courses, loading, error }) => {
  const { theme } = useContext(ThemeContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
          theme === 'dark' ? 'border-blue-400' : 'border-blue-600'
        }`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className={`text-lg ${
          theme === 'dark' ? 'text-red-400' : 'text-red-500'
        }`}>{error}</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-16">
        <p className={`text-lg ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>No courses found.</p>
        <p className={`text-sm mt-2 ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseGrid;