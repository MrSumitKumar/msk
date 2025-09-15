import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce, formatCourseData, sortCourses } from '../utils/courseOptimization';
import axios from '../api/axios';

export const useCourseData = (initialFilters = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    hasMore: false
  });

  // Ref for tracking mounted state
  const mounted = useRef(true);
  
  // Ref for canceling previous requests
  const cancelTokenRef = useRef(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      mounted.current = false;
      if (cancelTokenRef.current) {
        cancelTokenRef.current.abort();
      }
    };
  }, []);

  // Fetch courses with debouncing
  const fetchCourses = useCallback(
    debounce(async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        // Cancel previous request
        if (cancelTokenRef.current) {
          cancelTokenRef.current.abort();
        }
        const controller = new AbortController();
        cancelTokenRef.current = controller;

        // Build query params
        const params = new URLSearchParams();
        params.append('page', page);
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        const response = await axios.get(`/courses/courses/?${params.toString()}`, {
          signal: controller.signal
        });

        if (mounted.current) {
          const formattedCourses = response.data.results.map(formatCourseData);
          const sortedCourses = sortCourses(formattedCourses, filters.sort);

          setCourses(sortedCourses);
          setPagination({
            current: page,
            total: Math.ceil(response.data.count / 10),
            hasMore: !!response.data.next
          });
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (mounted.current) {
          setError(err.response?.data?.message || 'Failed to fetch courses');
          setCourses([]);
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    }, 300),
    [filters]
  );

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Initial fetch
  useEffect(() => {
    fetchCourses(1);
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    resetFilters,
    fetchCourses
  };
};

export default useCourseData;