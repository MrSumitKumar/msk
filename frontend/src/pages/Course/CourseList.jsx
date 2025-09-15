// src/pages/Course/CourseList.jsx
import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { Helmet } from "react-helmet-async";
import axios from "../../api/axios";
import { ThemeContext } from '../../context/ThemeContext';
import SearchBar from '../../components/course/SearchBar';
import useCourseMeta from '../../hooks/useCourseMeta';
import useUrlParams from '../../hooks/useUrlParams';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import CourseGridFallback from '../../components/course/CourseGridFallback';
import FilterPanel from '../../components/course/FilterPanel';
import CourseGrid from '../../components/course/CourseGrid';
import Pagination from '../../components/course/Pagination';

const CourseList = () => {
  const { theme } = useContext(ThemeContext);

  // Hooks
  const {
    categories,
    levels,
    languages,
    loading: metaLoading,
    error: metaError,
  } = useCourseMeta();

  // URL params
  const { getInitialValues, updateUrl, resetParams } = useUrlParams({
    categories: '',
    level: '',
    language: '',
    search: '',
    page: '1'
  });

  // Initialize state from URL
  const initialValues = getInitialValues();

  // State
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialValues.categories);
  const [selectedLevel, setSelectedLevel] = useState(initialValues.level);
  const [selectedLanguage, setSelectedLanguage] = useState(initialValues.language);
  const [searchTerm, setSearchTerm] = useState(initialValues.search);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const [pagination, setPagination] = useState({
    next: null,
    previous: null,
    current: 1,
  });

  // Ref to manage cancellation
  const cancelTokenRef = useRef(null);

  // Build query string for filters/search
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    
    // Basic filters
    if (selectedCategory) params.append('categories', selectedCategory);
    if (selectedLevel) params.append('level', selectedLevel);
    if (selectedLanguage) params.append('language', selectedLanguage);
    if (searchTerm.trim()) params.append('search', searchTerm.trim());

    return params.toString();
  }, [selectedCategory, selectedLevel, selectedLanguage, searchTerm]);

  const hasActiveFilters = !!(selectedCategory || selectedLevel || selectedLanguage);

  // Fetch courses
  const fetchCourses = async (page = 1) => {
    setLoading(true);
    console.log('🔍 Fetching courses...');

    // Cancel previous request
    if (cancelTokenRef.current) cancelTokenRef.current.abort();
    const controller = new AbortController();
    cancelTokenRef.current = controller;

    console.log('Current State:', {
      selectedCategory,
      selectedLevel,
      selectedLanguage,
      searchTerm,
      loading,
      error
    });

    try {
      const query = buildQueryParams();
      const url = `/courses/courses/?page=${page}&${query}`;
      console.log('📡 API Request URL:', url);
      const res = await axios.get(url, {
        signal: controller.signal,
      });
      console.log('📦 API Response:', res.data);
      console.log('Results Array:', res.data.results);

      const coursesToSet = res.data.results || [];
      console.log('Setting courses:', coursesToSet);
      
      setCourses(coursesToSet);
      setPagination({
        next: res.data.next,
        previous: res.data.previous,
        current: page,
      });
      setError(null);
    } catch (err) {
      // Ignore canceled requests
      if (err.name === 'CanceledError') return;

      setCourses([]);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to load courses. Please try again later.";
      setError(errorMessage);
      console.error("❌ Course fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCourses(1);
  }, []);

  // Update URL when filters/search change (debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrl({
        categories: selectedCategory,
        level: selectedLevel,
        language: selectedLanguage,
        search: searchTerm,
        page: pagination.current.toString()
      });
    }, 400);
    return () => clearTimeout(handler);
  }, [selectedCategory, selectedLevel, selectedLanguage, searchTerm, pagination.current, updateUrl]);

  // Fetch courses when URL params change
  useEffect(() => {
    const params = getInitialValues();
    fetchCourses(parseInt(params.page) || 1);
  }, [selectedCategory, selectedLevel, selectedLanguage, searchTerm]);

  // Prevent scroll when filter panel is open
  useEffect(() => {
    document.body.style.overflow = filterOpen ? "hidden" : "";
  }, [filterOpen]);

  const clearFilters = () => {
    // Reset basic filters
    setSelectedCategory('');
    setSelectedLevel('');
    setSelectedLanguage('');
    
    setFilterOpen(false);
    resetParams();
  };

  console.log(courses)

  return (
    <>
      <Helmet>
        <title>Courses - MSK Institute</title>
        {/* Meta tags omitted for brevity */}
      </Helmet>

      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        
        {/* Header */}
        <header className={`sticky top-0 z-40 shadow-sm border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Explore Our Courses</h1>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Discover the best computer and coding courses tailored for you.</p>
            </div>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              hasActiveFilters={hasActiveFilters}
              onFilterToggle={() => setFilterOpen(true)}
              onClearFilters={clearFilters}
            />
          </div>
        </header>

        {/* Filter Panel */}
        <FilterPanel
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          categories={categories}
          levels={levels}
          languages={languages}
          selectedCategory={selectedCategory}
          selectedLevel={selectedLevel}
          selectedLanguage={selectedLanguage}
          onCategoryChange={setSelectedCategory}
          onLevelChange={setSelectedLevel}
          onLanguageChange={setSelectedLanguage}
          onApplyFilters={(filters) => {
            // Update all filter states with basic filters only
            setSelectedCategory(filters.categories || '');
            setSelectedLevel(filters.level || '');
            setSelectedLanguage(filters.language || '');

            // Fetch courses with new filters
            fetchCourses(1);
            setFilterOpen(false);
          }}
          onResetFilters={() => {
            clearFilters();
            fetchCourses(1);
          }}
        />

        {/* Courses Grid */}
        <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${filterOpen ? 'lg:mr-80' : ''}`}>
          {error && <div className="text-red-500 text-center py-4">{error}</div>}
          <ErrorBoundary fallback={error => <CourseGridFallback error={error} />}>
            <CourseGrid 
              courses={courses} 
              loading={loading} 
              error={!error && (!courses || courses.length === 0) && !loading ? "No courses found." : null} 
            />

          </ErrorBoundary>
          <Pagination pagination={pagination} onPageChange={fetchCourses} />
        </main>

        {/* Mobile Overlay */}
        {filterOpen && (
          <div
            className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${theme === 'dark' ? 'bg-black bg-opacity-60' : 'bg-black bg-opacity-40'}`}
            onClick={() => setFilterOpen(false)}
            role="presentation"
          />
        )}
      </div>
    </>
  );
};

export default CourseList;
