// src/pages/Course/CourseList.jsx
import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { Helmet } from "react-helmet-async";
import axios from "../../api/axios";
import { ThemeContext } from '../../context/ThemeContext';
import SearchBar from '../../components/course/SearchBar';
import useUrlParams from '../../hooks/useUrlParams';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import CourseGridFallback from '../../components/course/CourseGridFallback';
import CourseGrid from '../../components/course/CourseGrid';
import CourseGridPlaceholder from '../../components/course/CourseGridPlaceholder';
import Pagination from '../../components/course/Pagination';

const CourseList = () => {
  const { theme } = useContext(ThemeContext);

  // URL params
  const { getInitialValues, updateUrl, resetParams } = useUrlParams({
    search: '',
    page: '1'
  });

  // Initialize state from URL
  const initialValues = getInitialValues();

  // State
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialValues.search);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (searchTerm.trim()) params.append('search', searchTerm.trim());

    return params.toString();
  }, [searchTerm]);

  // Fetch courses
  const fetchCourses = async (page = 1) => {
    // Cancel previous request
    if (cancelTokenRef.current) cancelTokenRef.current.abort();
    const controller = new AbortController();
    cancelTokenRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      
      const query = buildQueryParams();
      const url = `/courses/courses/?page=${page}${query ? `&${query}` : ''}`;
      
      const res = await axios.get(url, {
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setCourses(res.data.results || []);
        setPagination({
          next: res.data.next,
          previous: res.data.previous,
          current: page,
        });
      }
    } catch (err) {
      // Only update state if request wasn't cancelled
      if (!controller.signal.aborted) {
        if (err.name !== 'CanceledError') {
          setCourses([]);
          const errorMessage =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Failed to load courses. Please try again later.";
          setError(errorMessage);
        }
      }
    } finally {
      // Only update loading state if request wasn't cancelled
      if (!controller.signal.aborted) {
        setLoading(false);
      }
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
        search: searchTerm,
        page: pagination.current.toString()
      });
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm, pagination.current, updateUrl]);

  // Fetch courses when search param changes
  useEffect(() => {
    const params = getInitialValues();
    const page = parseInt(params.page) || 1;
    console.log('🔄 Re-fetching courses:', {
      page,
      search: searchTerm || 'none'
    });
    fetchCourses(page);
  }, [searchTerm]);

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
              hasActiveFilters={false}
            />
          </div>
        </header>

        {/* Courses Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && <div className="text-red-500 text-center py-4">{error}</div>}
          <ErrorBoundary fallback={error => <CourseGridFallback error={error} />}>
            {loading ? (
              <CourseGridPlaceholder />
            ) : (
              <CourseGrid 
                courses={courses}
                error={!loading && (!courses || courses.length === 0) ? "No courses found." : null}
              />
            )}
          </ErrorBoundary>
          {!loading && <Pagination pagination={pagination} onPageChange={fetchCourses} />}
        </main>
      </div>
    </>
  );
};

export default CourseList;
