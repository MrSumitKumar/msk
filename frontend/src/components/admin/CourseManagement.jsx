import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { 
  Search, Filter, Edit2, Trash2, Eye, 
  BookOpen, Clock, Users, Star, CheckCircle
} from 'lucide-react';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CourseManagement = () => {
  const { theme } = useContext(ThemeContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [filterCategory, filterStatus]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (searchTerm) params.append('search', searchTerm);
      if (sortBy) params.append('ordering', getSortValue(sortBy));

      const response = await axios.get(`/admin/courses/?${params.toString()}`);
      // Ensure we're setting an array
      let coursesData = Array.isArray(response.data) ? response.data : (response.data.results || []);
      
      // Apply client-side sorting if needed
      if (sortBy && !params.has('ordering')) {
        coursesData = sortCourses(coursesData, sortBy);
      }
      
      setCourses(coursesData);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to fetch courses');
      setCourses([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getSortValue = (sort) => {
    switch (sort) {
      case 'newest': return '-created_at';
      case 'oldest': return 'created_at';
      case 'title': return 'title';
      case 'rating': return '-rating';
      case 'students': return '-enrolled_students';
      default: return '-created_at';
    }
  };

  const sortCourses = (coursesData, sort) => {
    return [...coursesData].sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'students':
          return (b.enrolled_students || 0) - (a.enrolled_students || 0);
        default:
          return 0;
      }
    });
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/admin/courses/${courseId}/`);
      toast.success('Course deleted successfully');
      fetchCourses(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete course:', error);
      toast.error('Failed to delete course');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedCourses.map(id => axios.delete(`/admin/courses/${id}/`)));
      toast.success('Selected courses deleted successfully');
      setSelectedCourses([]);
      fetchCourses();
    } catch (error) {
      console.error('Failed to delete courses:', error);
      toast.error('Failed to delete selected courses');
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      await Promise.all(
        selectedCourses.map(id => 
          axios.patch(`/admin/courses/${id}/`, { status })
        )
      );
      toast.success('Course status updated successfully');
      setSelectedCourses([]);
      fetchCourses();
    } catch (error) {
      console.error('Failed to update course status:', error);
      toast.error('Failed to update course status');
    }
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Course Management
        </h1>
        <Link
          to="/admin/courses/create"
          className={`px-4 py-2 rounded-lg ${
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors`}
        >
          Add New Course
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Courses', value: courses.length, icon: BookOpen },
          { label: 'Active Courses', value: courses.filter(c => c.status === 'active').length, icon: CheckCircle },
          { label: 'Total Students', value: courses.reduce((acc, c) => acc + (c.enrolled_students || 0), 0), icon: Users },
          { label: 'Average Rating', value: (courses.reduce((acc, c) => acc + (c.rating || 0), 0) / courses.length || 0).toFixed(1), icon: Star }
        ].map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {stat.label}
                </p>
                <p className={`text-2xl font-semibold mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`} />
            </div>
          </div>
        ))}
      </div>

      {/* Search, Filters, and Sort */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchCourses()}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-200'
              } border focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={`px-4 py-2 rounded-lg ${
            theme === 'dark'
              ? 'bg-gray-800 text-white border-gray-700'
              : 'bg-white text-gray-900 border-gray-200'
          } border focus:ring-2 focus:ring-blue-500`}
        >
          <option value="all">All Categories</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
          <option value="marketing">Marketing</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 rounded-lg ${
            theme === 'dark'
              ? 'bg-gray-800 text-white border-gray-700'
              : 'bg-white text-gray-900 border-gray-200'
          } border focus:ring-2 focus:ring-blue-500`}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`px-4 py-2 rounded-lg ${
            theme === 'dark'
              ? 'bg-gray-800 text-white border-gray-700'
              : 'bg-white text-gray-900 border-gray-200'
          } border focus:ring-2 focus:ring-blue-500`}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title A-Z</option>
          <option value="rating">Highest Rated</option>
          <option value="students">Most Students</option>
        </select>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', 'Programming', 'Design', 'Business', 'Marketing'].map((category) => (
          <button
            key={category}
            onClick={() => setFilterCategory(category.toLowerCase())}
            className={`px-3 py-1 rounded-full text-sm ${
              filterCategory === category.toLowerCase()
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } transition-colors`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedCourses.length > 0 && (
        <div className={`flex items-center gap-4 mb-6 p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            {selectedCourses.length} courses selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all selected courses? This action cannot be undone.')) {
                  // Handle bulk delete
                }
              }}
              className={`px-3 py-1 rounded-lg ${
                theme === 'dark'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-red-500 hover:bg-red-600'
              } text-white transition-colors`}
            >
              Delete Selected
            </button>
            <select
              onChange={(e) => {
                if (window.confirm('Are you sure you want to update the status of all selected courses?')) {
                  // Handle bulk status update
                }
              }}
              className={`px-3 py-1 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-gray-800 border-gray-300'
              } border`}
            >
              <option value="">Update Status</option>
              <option value="active">Set Active</option>
              <option value="draft">Set Draft</option>
              <option value="archived">Set Archived</option>
            </select>
          </div>
        </div>
      )}

      {/* Course List */}
      {loading ? (
        <div className={`text-center py-8 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Loading courses...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`rounded-lg shadow-md overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } ${selectedCourses.includes(course.id) ? 'ring-2 ring-blue-500' : ''}`}
            >
              {/* Course Image */}
              <img
                src={course.thumbnail || '/default-course.jpg'}
                alt={course.title}
                className="w-full h-48 object-cover"
              />

              {/* Course Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      {course.title}
                    </h3>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCourses([...selectedCourses, course.id]);
                        } else {
                          setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                        }
                      }}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className={`flex items-center ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{course.duration || 'N/A'}</span>
                  </div>
                  
                  <div className={`flex items-center ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <Users className="h-4 w-4 mr-2" />
                    <span>{course.enrolled_students || 0} students</span>
                  </div>
                  
                  <div className={`flex items-center ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <Star className="h-4 w-4 mr-2" />
                    <span>{course.rating ? `${course.rating.toFixed(1)}/5.0` : 'No ratings'}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    course.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : course.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {course.status}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end space-x-2">
                  <Link
                    to={`/courses/${course.slug}`}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <Link
                    to={`/admin/courses/${course.id}`}
                    state={{ isEdit: true }}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-blue-900/50 text-gray-300'
                        : 'hover:bg-blue-100 text-blue-600'
                    }`}
                  >
                    <Edit2 className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-red-900/50 text-gray-300'
                        : 'hover:bg-red-100 text-red-600'
                    }`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {courses.length === 0 && !loading && (
        <div className={`text-center py-8 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          No courses found
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
