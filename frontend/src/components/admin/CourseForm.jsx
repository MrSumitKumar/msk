import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { 
  Upload,
  DollarSign,
  Clock,
  BookOpen,
  Tag,
  Users,
  Languages,
  Award,
  Video,
  Plus,
  Minus
} from 'lucide-react';

const CourseForm = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const location = useLocation();
  const isEditMode = location.state?.isEdit || false;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    price: 0,
    discount: 0,
    thumbnail: null,
    preview_video: '',
    duration: '',
    level: '',
    language: '',
    categories: [],
    what_you_learn: [''],
    requirements: [''],
    course_includes: [''],
    status: 'draft',
    certificate: false,
    has_assignment: false,
    has_download: false,
    has_project: false
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    fetchMetadata();
    if (isEditMode) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchMetadata = async () => {
    try {
      const [categoriesRes, languagesRes, levelsRes] = await Promise.all([
        axios.get('/api/courses/categories/'),
        axios.get('/api/courses/languages/'),
        axios.get('/api/courses/labels/')
      ]);
      setCategories(categoriesRes.data);
      setLanguages(languagesRes.data);
      setLevels(levelsRes.data);
    } catch (error) {
      console.error('Error fetching metadata:', error);
      toast.error('Failed to load form data');
    }
  };

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/courses/id/${courseId}/`);
      const courseData = response.data;
      setFormData({
        ...courseData,
        categories: courseData.categories ? courseData.categories.map(c => c.id) : [],
        what_you_learn: courseData.what_you_learn && courseData.what_you_learn.length > 0 ? courseData.what_you_learn : [''],
        requirements: courseData.requirements && courseData.requirements.length > 0 ? courseData.requirements : [''],
        course_includes: courseData.course_includes && courseData.course_includes.length > 0 ? courseData.course_includes : ['']
      });
      if (courseData.thumbnail) {
        setThumbnailPreview(courseData.thumbnail);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // Create FormData object for file upload
      const data = new FormData();
      
      // Handle arrays and nested data properly
      Object.keys(formData).forEach(key => {
        if (key === 'thumbnail' && formData[key] instanceof File) {
          data.append('thumbnail', formData[key]);
        } else if (Array.isArray(formData[key])) {
          // Filter out empty strings from arrays
          const filteredArray = formData[key].filter(item => item.trim());
          // For categories, send as is
          if (key === 'categories') {
            data.append('categories', JSON.stringify(filteredArray));
          } else {
            // For other arrays, send as separate fields
            filteredArray.forEach(item => {
              data.append(key, item);
            });
          }
        } else if (formData[key] !== null && formData[key] !== undefined) {
          // Convert booleans to strings
          if (typeof formData[key] === 'boolean') {
            data.append(key, formData[key].toString());
          } else {
            data.append(key, formData[key]);
          }
        }
      });

      const url = isEditMode 
        ? `/api/courses/${courseId}/update/`
        : '/api/courses/create/';

      const method = isEditMode ? 'patch' : 'post';

      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        toast.success(
          isEditMode 
            ? 'Course updated successfully'
            : 'Course created successfully'
        );
        navigate('/admin/courses');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      if (error.response?.data) {
        // Handle specific validation errors
        const errors = error.response.data;
        Object.keys(errors).forEach(key => {
          toast.error(`${key}: ${errors[key]}`);
        });
      } else {
        toast.error('Failed to save course. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-6 md:col-span-2">
          <h2 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Basic Information
          </h2>
          
          <div>
            <label className={`block mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Short Description
            </label>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              required
              rows="2"
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Full Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Media Section */}
        <div className="space-y-6 md:col-span-2">
          <h2 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Media
          </h2>

          <div>
            <label className={`block mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Course Thumbnail
            </label>
            <div className="flex items-center space-x-4">
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className={`w-full p-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white border-gray-700'
                      : 'bg-white text-gray-900 border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Preview Video URL
            </label>
            <input
              type="url"
              name="preview_video"
              value={formData.preview_video}
              onChange={handleInputChange}
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Course Details */}
        <div className="space-y-6">
          <h2 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Course Details
          </h2>

          <div>
            <label className={`block mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Price
            </label>
            <div className="relative">
              <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                className={`w-full pl-10 p-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-300'
                } focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          <div>
            <label className={`block mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              min="0"
              max="100"
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Duration
            </label>
            <div className="relative">
              <Clock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 10 hours"
                required
                className={`w-full pl-10 p-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-300'
                } focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        </div>

        {/* Course Settings */}
        <div className="space-y-6">
          <h2 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Course Settings
          </h2>

          <div>
            <label className={`block mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Level
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              required
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select Level</option>
              {levels.map(level => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              required
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select Language</option>
              {languages.map(language => (
                <option key={language.id} value={language.id}>{language.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Categories
            </label>
            <select
              name="categories"
              value={formData.categories}
              onChange={(e) => {
                const options = e.target.options;
                const selected = [];
                for (let i = 0; i < options.length; i++) {
                  if (options[i].selected) {
                    selected.push(options[i].value);
                  }
                }
                setFormData(prev => ({ ...prev, categories: selected }));
              }}
              multiple
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
              size="4"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Content Lists */}
        <div className="md:col-span-2 space-y-8">
          {/* What You'll Learn */}
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              What You'll Learn
            </h2>
            {formData.what_you_learn.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayFieldChange('what_you_learn', index, e.target.value)}
                  placeholder="Learning outcome"
                  className={`flex-1 p-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white border-gray-700'
                      : 'bg-white text-gray-900 border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('what_you_learn', index)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <Minus className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('what_you_learn')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Plus className="h-4 w-4" />
              Add Learning Outcome
            </button>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Requirements
            </h2>
            {formData.requirements.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                  placeholder="Course requirement"
                  className={`flex-1 p-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white border-gray-700'
                      : 'bg-white text-gray-900 border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('requirements', index)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <Minus className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('requirements')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Plus className="h-4 w-4" />
              Add Requirement
            </button>
          </div>

          {/* Course Includes */}
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Course Includes
            </h2>
            {formData.course_includes.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayFieldChange('course_includes', index, e.target.value)}
                  placeholder="Course feature"
                  className={`flex-1 p-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white border-gray-700'
                      : 'bg-white text-gray-900 border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('course_includes', index)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <Minus className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('course_includes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Plus className="h-4 w-4" />
              Add Feature
            </button>
          </div>
        </div>

        {/* Additional Features */}
        <div className="md:col-span-2 space-y-4">
          <h2 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Additional Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <input
                type="checkbox"
                name="certificate"
                checked={formData.certificate}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Certificate of Completion
            </label>
            <label className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <input
                type="checkbox"
                name="has_assignment"
                checked={formData.has_assignment}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Includes Assignments
            </label>
            <label className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <input
                type="checkbox"
                name="has_download"
                checked={formData.has_download}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Downloadable Resources
            </label>
            <label className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <input
                type="checkbox"
                name="has_project"
                checked={formData.has_project}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Includes Projects
            </label>
          </div>
        </div>

        {/* Status */}
        <div className="md:col-span-2">
          <label className={`block mb-2 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Course Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className={`w-full p-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 text-white border-gray-700'
                : 'bg-white text-gray-900 border-gray-300'
            } focus:ring-2 focus:ring-blue-500`}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors flex items-center gap-2`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                {isEditMode ? 'Update Course' : 'Create Course'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CourseForm;
