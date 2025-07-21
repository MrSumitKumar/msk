import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import { XCircle, Filter, FilterX } from 'lucide-react';

import api from '../../api/api';
import CourseCard from '../../components/CourseCard';


const CourseList = () => {
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
      const res = await api.get(`/courses/?page=${page}&${query}`);
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
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [catRes, levelRes, langRes] = await Promise.all([
        api.get('/courses/categories/'),
        api.get('/courses/labels/'),
        api.get('/courses/languages/'),
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
  };

  return (
    <>
      <Helmet>
        <title>Courses - MSK Institute</title>
        <meta name="description" content="Browse all available computer and coding courses at MSK Institute. Learn Python, Django, JavaScript, Excel, and more." />
        <link rel="canonical" href="https://msk.shikohabad.in/courses" />
      </Helmet>

      <div className="bg-gray-950 text-white min-h-screen">
        {/* Fixed Top Bar */}

        <div className="sticky top-0 z-40 bg-gray-900 shadow px-4 py-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-0">
          <div>
            <h1 className="text-xl font-bold">Explore Our Courses</h1>
            <p className="text-sm text-gray-400 mt-1">
              Discover the best computer and coding courses tailored for you.
            </p>
          </div>

          <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="bg-gray-800 text-white px-3 py-2 pr-14 rounded w-full focus:outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                {(selectedCategory || selectedLevel || selectedLanguage) ? (
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedLevel('');
                      setSelectedLanguage('');
                      setFilterOpen(false);
                    }}
                    title="Clear Filters"
                    className="text-red-500 hover:text-red-700"
                  >
                    <FilterX className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setFilterOpen(true)}
                    title="Filter"
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* Filter Panel */}
        <div
          className={`fixed top-[56px] right-0 h-[calc(100vh-56px)] w-72 bg-gray-900 border-l border-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${filterOpen ? 'translate-x-0' : 'translate-x-full'} md:top-[64px] md:h-[calc(100vh-64px)]`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={() => setFilterOpen(false)} className="text-white hover:text-gray-300">
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto h-full">
            <div>
              <label className="block text-sm mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded"
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded"
              >
                <option value="">All</option>
                {levels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded"
              >
                <option value="">All</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course List */}
        <main className={`transition-all duration-300 ease-in-out px-4 pt-6 pb-20 ${filterOpen && window.innerWidth >= 768 ? 'md:mr-72' : ''}`}>
          {loading ? (
            <p className="text-center text-gray-400">Loading courses...</p>
          ) : error ? (
            <p className="text-center text-red-400">{error}</p>
          ) : courses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No courses found.</p>
          )}
        </main>

        {(pagination.previous || pagination.next) && (
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => fetchCourses(pagination.current - 1)}
              disabled={!pagination.previous}
              className={`px-4 py-2 rounded ${pagination.previous ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 cursor-not-allowed'} text-white`}
            >
              Previous
            </button>
            <span className="text-white">Page {pagination.current}</span>
            <button
              onClick={() => fetchCourses(pagination.current + 1)}
              disabled={!pagination.next}
              className={`px-4 py-2 rounded ${pagination.next ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 cursor-not-allowed'} text-white`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseList;
