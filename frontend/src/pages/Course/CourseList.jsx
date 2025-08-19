import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from "react-helmet-async";

import axios from "../../api/axios";
import { ThemeContext } from '../../context/ThemeContext';
import SearchBar from '../../components/course/SearchBar';
import FilterPanel from '../../components/course/FilterPanel';
import CourseGrid from '../../components/course/CourseGrid';
import Pagination from '../../components/course/Pagination';

const CourseList = () => {
  const { theme } = useContext(ThemeContext);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [pagination, setPagination] = useState({ next: null, previous: null, current: 1 });

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedLevel) params.append('level', selectedLevel);
    if (selectedLanguage) params.append('language', selectedLanguage);
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    return params.toString();
  };

  const fetchCourses = async (page = 1) => {
    setLoading(true);
    try {
      const query = buildQueryParams();
      const res = await axios.get(`/courses/?page=${page}&${query}`);
      setCourses(res.data.results || []);
      setPagination({
        next: res.data.next,
        previous: res.data.previous,
        current: page,
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setCourses([]);
      setError("Failed to load courses. API Is Not Working");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [catRes, levelRes, langRes] = await Promise.all([
        axios.get('/courses/categories/'),
        axios.get('/courses/labels/'),
        axios.get('/courses/languages/'),
      ]);

      setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.results || []);
      setLevels(Array.isArray(levelRes.data) ? levelRes.data : levelRes.data.results || []);
      setLanguages(Array.isArray(langRes.data) ? langRes.data : langRes.data.results || []);
    } catch (err) {
      console.error('Error loading filters', err);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel, selectedLanguage, searchTerm]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedLevel('');
    setSelectedLanguage('');
    setFilterOpen(false);
  };

  const hasActiveFilters = selectedCategory || selectedLevel || selectedLanguage;

  return (
    <>
      <Helmet>
        <title>Courses - MSK Institute</title>
        <meta name="description" content="Browse all available computer and coding courses at MSK Institute. Learn Python, Django, JavaScript, Excel, and more." />
        <link rel="canonical" href="https://msk.shikohabad.in/courses" />
      </Helmet>

      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-950 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        {/* Header Section */}
        <div className={`sticky top-0 z-40 shadow-sm border-b transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h1 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Explore Our Courses
                </h1>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Discover the best computer and coding courses tailored for you.
                </p>
              </div>

              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                hasActiveFilters={hasActiveFilters}
                onFilterToggle={() => setFilterOpen(true)}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        </div>

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
        />

        {/* Main Content */}
        <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${
          filterOpen ? 'lg:mr-80' : ''
        }`}>
          <CourseGrid courses={courses} loading={loading} error={error} />
          
          <Pagination 
            pagination={pagination} 
            onPageChange={fetchCourses} 
          />
        </main>

        {/* Overlay for mobile filter */}
        {filterOpen && (
          <div
            className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
              theme === 'dark' 
                ? 'bg-black bg-opacity-60' 
                : 'bg-black bg-opacity-40'
            }`}
            onClick={() => setFilterOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default CourseList;