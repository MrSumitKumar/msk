import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ThemeContext } from '../../context/ThemeContext';
import axios from '../../api/axios';
import { Upload, X, CheckCircle } from 'lucide-react';

const CourseForm = ({ courseData = null }) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [labels, setLabels] = useState([]);

  const [formData, setFormData] = useState({
    title: courseData?.title || '',
    description: courseData?.description || '',
    featured_image: null,
    featured_video: courseData?.featured_video || '',
    categories: courseData?.categories || [],
    level: courseData?.level || '',
    language: courseData?.language || [],
    duration: courseData?.duration || 6,
    price: courseData?.price || 0,
    discount: courseData?.discount || 0,
    discount_end_date: courseData?.discount_end_date || '',
    certificate: courseData?.certificate || 'NO',
    mode: courseData?.mode || 'ONLINE',
    course_type: courseData?.course_type || 'SINGLE',
    status: courseData?.status || 'DRAFT',
    single_courses: courseData?.single_courses || []
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        toast.loading('Loading course data...', { id: 'metadata' });
        const [categoriesRes, languagesRes, labelsRes] = await Promise.all([
          axios.get('/api/courses/categories/'),
          axios.get('/api/courses/languages/'),
          axios.get('/api/courses/labels/')
        ]);
        
        setCategories(categoriesRes.data.results || categoriesRes.data);
        setLanguages(languagesRes.data.results || languagesRes.data);
        setLabels(labelsRes.data.results || labelsRes.data);
        toast.success('Course data loaded!', { id: 'metadata' });

        // If editing, pre-select the values
        if (courseData) {
          setFormData(prev => ({
            ...prev,
            categories: courseData.categories.map(cat => cat.id),
            level: courseData.level?.id || '',
            language: courseData.language.map(lang => lang.id)
          }));
        }
      } catch (error) {
        console.error('Metadata fetch error:', error);
        toast.error('Failed to load course data. Please refresh.', { id: 'metadata' });
      }
    };
    fetchMetadata();
  }, [courseData]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      if (files[0]) {
        setFormData({ ...formData, [name]: files[0] });
        setImagePreview(URL.createObjectURL(files[0]));
      }
    } else if (type === 'select-multiple') {
      const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData({ ...formData, [name]: selectedValues });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateYoutubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}($|&)/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.featured_video && !validateYoutubeUrl(formData.featured_video)) {
        toast.error('Please enter a valid YouTube URL');
        setLoading(false);
        return;
      }

      const courseFormData = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'categories' || key === 'language') {
          // Clear existing values first to avoid duplicates
          formData[key].forEach(value => {
            courseFormData.append(`${key}[]`, value);
          });
        } else if (key === 'featured_image' && formData[key]) {
          if (formData[key] instanceof File) {
            courseFormData.append(key, formData[key]);
          }
        } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          courseFormData.append(key, formData[key]);
        }
      });

      const url = courseData
        ? `/api/courses/${courseData.slug}/update/`
        : '/api/courses/create/';
      
      const response = courseData
        ? await axios.patch(url, courseFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        : await axios.post(url, courseFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

      toast.success(courseData ? 'Course updated successfully!' : 'Course created successfully!');
      navigate('/teacher/dashboard');
    } catch (error) {
      console.error('Course form error:', error);
      const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        Object.values(error.response?.data || {})[0] ||
                        'Failed to save course';
      toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    } rounded-lg shadow-md`}>
      <h2 className="text-2xl font-bold mb-6">
        {courseData ? 'Edit Course' : 'Create New Course'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Course Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          {/* Media Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Featured Image</label>
              <div className={`border-2 border-dashed rounded-lg p-4 ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <input
                  type="file"
                  name="featured_image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="hidden"
                  id="featured_image"
                />
                <label
                  htmlFor="featured_image"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <Upload className="h-12 w-12 mb-2" />
                  )}
                  <span>Click to upload image</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Featured Video (YouTube URL)</label>
              <input
                type="url"
                name="featured_video"
                value={formData.featured_video}
                onChange={handleInputChange}
                placeholder="https://youtube.com/watch?v=..."
                className={`w-full p-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Categories</label>
              <select
                name="categories"
                multiple
                value={formData.categories}
                onChange={handleInputChange}
                className={`w-full p-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className={`w-full p-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="">Select Level</option>
                {labels.map(label => (
                  <option key={label.id} value={label.id}>{label.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Languages</label>
              <select
                name="language"
                multiple
                value={formData.language}
                onChange={handleInputChange}
                className={`w-full p-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Duration (months)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                className={`w-full p-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full p-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
                max="100"
                className={`w-full p-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Discount End Date</label>
              <input
                type="date"
                name="discount_end_date"
                value={formData.discount_end_date}
                onChange={handleInputChange}
                className={`w-full p-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Course Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-2">Certificate</label>
              <select
                name="certificate"
                value={formData.certificate}
                onChange={handleInputChange}
                className={`w-full p-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="NO">No</option>
                <option value="YES">Yes</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleInputChange}
                className={`w-full p-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Course Type</label>
              <select
                name="course_type"
                value={formData.course_type}
                onChange={handleInputChange}
                className={`w-full p-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="SINGLE">Single Course</option>
                <option value="COMBO">Combo Course</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISH">Publish</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/teacher/dashboard')}
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg flex items-center ${
              loading
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⌛</span>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                {courseData ? 'Update Course' : 'Create Course'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
