import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { ArrowUpDown, Grid3X3, Grid2X2 } from 'lucide-react';
import CourseCard from './CourseCard';

const CourseGrid = ({ courses, loading, error, onSort }) => {
  const { theme } = useContext(ThemeContext);
  const [gridView, setGridView] = useState('3x3'); // '3x3' or '2x2'
  const [sortBy, setSortBy] = useState('newest');
  const [sortedCourses, setSortedCourses] = useState(courses);

  // Sorting options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
  ];

  // Effect to update sorted courses when courses prop changes
  useEffect(() => {
    const doSort = (items, sortValue) => {
      const sorted = [...items];
      switch (sortValue) {
        case 'newest':
          sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case 'oldest':
          sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          break;
        case 'price-low':
          sorted.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          sorted.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'popular':
          sorted.sort((a, b) => (b.enrolled_count || 0) - (a.enrolled_count || 0));
          break;
        default:
          break;
      }
      return sorted;
    };

    setSortedCourses(doSort(courses, sortBy));
  }, [courses, sortBy]);

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
    if (onSort) onSort(value);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-6">
          <div className={`h-10 w-48 rounded animate-pulse ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          }`}></div>
          <div className={`h-10 w-32 rounded animate-pulse ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          }`}></div>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className={`rounded-2xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <div className={`h-48 animate-pulse ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
              <div className="p-5 space-y-3">
                <div className={`h-6 rounded animate-pulse ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <div className={`h-16 rounded animate-pulse ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <div className={`h-8 rounded animate-pulse ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
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

  if (!loading && (!courses || courses.length === 0)) {
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
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        {/* Sort Dropdown */}
        <div className="flex-1 min-w-[200px] max-w-xs">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 text-white border-gray-700'
                : 'bg-white text-gray-900 border-gray-200'
            } focus:ring-2 focus:ring-blue-500`}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Toggle */}
        <div className={`flex items-center gap-2 p-1 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <button
            onClick={() => setGridView('3x3')}
            className={`p-2 rounded-lg transition-colors ${
              gridView === '3x3'
                ? theme === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-900 shadow'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow'
            }`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setGridView('2x2')}
            className={`p-2 rounded-lg transition-colors ${
              gridView === '2x2'
                ? theme === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-900 shadow'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow'
            }`}
          >
            <Grid2X2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Course Grid */}
      <div className={`grid gap-6 ${
        gridView === '3x3'
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 md:grid-cols-2'
      }`}>
        {sortedCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;