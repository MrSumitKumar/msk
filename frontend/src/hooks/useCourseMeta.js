import { useState, useEffect } from 'react';
import axios from '../api/axios';

const CACHE_TTL = 1000 * 60 * 60; // 1 hour

const getCachedData = (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const { value, timestamp } = JSON.parse(item);
  if (Date.now() - timestamp > CACHE_TTL) {
    localStorage.removeItem(key);
    return null;
  }

  return value;
};

const setCachedData = (key, value) => {
  const data = {
    value,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(data));
};

const useCourseMeta = () => {
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check cache first
        const cachedCategories = getCachedData('courseCategories');
        const cachedLevels = getCachedData('courseLevels');
        const cachedLanguages = getCachedData('courseLanguages');

        if (cachedCategories && cachedLevels && cachedLanguages) {
          setCategories(cachedCategories);
          setLevels(cachedLevels);
          setLanguages(cachedLanguages);
          setLoading(false);
          return;
        }

        // Fetch fresh data if cache is invalid or missing
        const [catRes, levelRes, langRes] = await Promise.all([
          axios.get('/courses/categories/'),
          axios.get('/courses/levels/'),
          axios.get('/courses/languages/'),
        ]);

        const categoriesData = Array.isArray(catRes.data) ? catRes.data : catRes.data.results || [];
        const levelsData = Array.isArray(levelRes.data) ? levelRes.data : levelRes.data.results || [];
        const languagesData = Array.isArray(langRes.data) ? langRes.data : langRes.data.results || [];

        // Update state
        setCategories(categoriesData);
        setLevels(levelsData);
        setLanguages(languagesData);

        // Cache the results
        setCachedData('courseCategories', categoriesData);
        setCachedData('courseLevels', levelsData);
        setCachedData('courseLanguages', languagesData);

      } catch (err) {
        console.error('❌ Metadata fetch error:', err.response || err);
        setError("Failed to load filters");
        
        // Try to use cached data as fallback
        const cachedCategories = getCachedData('courseCategories');
        const cachedLevels = getCachedData('courseLevels');
        const cachedLanguages = getCachedData('courseLanguages');

        if (cachedCategories) setCategories(cachedCategories);
        if (cachedLevels) setLevels(cachedLevels);
        if (cachedLanguages) setLanguages(cachedLanguages);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Only fetch on mount

  const clearCache = () => {
    localStorage.removeItem('courseCategories');
    localStorage.removeItem('courseLevels');
    localStorage.removeItem('courseLanguages');
  };

  return {
    categories,
    levels,
    languages,
    loading,
    error,
    clearCache,
  };
};

export default useCourseMeta;