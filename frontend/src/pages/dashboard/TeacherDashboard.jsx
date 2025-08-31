import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Helmet } from "react-helmet-async";
import axios from "../../api/axios";
import { ThemeContext } from '../../context/ThemeContext';
import styles from './TeacherDashboard.module.css';
import { BookOpen, Users, Clock, Plus, Edit2, Trash2, Calendar, Download } from 'lucide-react';
import CourseAnalytics from '../../components/teacher/CourseAnalytics';
import StudentActivity from '../../components/teacher/StudentActivity';
import CoursePerformance from '../../components/teacher/CoursePerformance';
import TeacherSchedule from '../../components/teacher/TeacherSchedule';
import TeacherNotifications from '../../components/teacher/TeacherNotifications';

const TeacherDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    totalHours: 0
  });
  const [analytics, setAnalytics] = useState({
    totalEnrollments: 0,
    enrollmentGrowth: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    completionRate: 0,
    completionRateGrowth: 0,
    averageRating: 0,
    ratingGrowth: 0
  });
  const [activities, setActivities] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    try {
      const [
        coursesRes, 
        statsRes, 
        analyticsRes, 
        activitiesRes,
        scheduleRes,
        notificationsRes
      ] = await Promise.all([
        axios.get('/api/courses/teacher-courses/'),
        axios.get('/api/teacher/dashboard-stats/'),
        axios.get('/api/teacher/course-analytics/'),
        axios.get('/api/teacher/student-activities/'),
        axios.get('/api/teacher/schedule/'),
        axios.get('/api/teacher/notifications/')
      ]);
      
      setCourses(coursesRes.data.results || coursesRes.data);
      setStats(statsRes.data);
      setAnalytics(analyticsRes.data);
      setActivities(activitiesRes.data);
      setSchedule(scheduleRes.data);
      setNotifications(notificationsRes.data);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (type) => {
    try {
      const response = await axios.get(`/api/teacher/export/${type}/`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(`Failed to export ${type} data`);
    }
  };

  const deleteCourse = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`/api/courses/${slug}/`);
      toast.success("Course deleted successfully!");
      fetchData(); // Refresh the data
    } catch (error) {
      toast.error("Failed to delete course.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-6 rounded-lg shadow-md ${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-3 rounded-full ${color.replace('text', 'bg').replace('600', '100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <h3 className={`text-lg font-semibold ${
        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
      }`}>{title}</h3>
    </div>
  );

  if (loading) return (
    <div className={`text-center mt-10 ${
      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    }`}>Loading dashboard data...</div>
  );

  return (
    <>
      <Helmet>
        <title>Teacher Dashboard – MSK Institute</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Access and manage your courses, student progress, and teaching tools from the MSK Institute Teacher Dashboard." />
        <link rel="canonical" href="https://msk.shikohabad.in/teacher-dashboard" />

        <meta property="og:title" content="Teacher Dashboard – MSK Institute" />
        <meta property="og:description" content="Secure dashboard for MSK Institute teachers to manage classes and courses." />
        <meta property="og:url" content="https://msk.shikohabad.in/teacher-dashboard" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>Teacher Dashboard</h2>
          
          <div className="flex gap-3">
            <div className={styles.dropdown}>
              <button
                className={`inline-flex items-center px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
              <div className={`${styles['dropdown-content']} py-2 w-48 rounded-lg shadow-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <button
                  onClick={() => exportData('courses')}
                  className={`w-full text-left px-4 py-2 hover:${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  Export Courses
                </button>
                <button
                  onClick={() => exportData('students')}
                  className={`w-full text-left px-4 py-2 hover:${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  Export Students
                </button>
                <button
                  onClick={() => exportData('analytics')}
                  className={`w-full text-left px-4 py-2 hover:${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  Export Analytics
                </button>
              </div>
            </div>
            
            <Link to="/courses/add" className={`inline-flex items-center px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}>
              <Plus className="h-5 w-5 mr-2" />
              Create New Course
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-b mb-6 border-gray-200 dark:border-gray-700">
          {['overview', 'courses', 'schedule', 'students'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? theme === 'dark'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-blue-600 text-blue-600'
                  : theme === 'dark'
                  ? 'border-transparent text-gray-400 hover:text-gray-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Students"
                value={stats.totalStudents}
                icon={Users}
                color="text-blue-600"
              />
              <StatCard
                title="Active Courses"
                value={stats.activeCourses}
                icon={BookOpen}
                color="text-green-600"
              />
              <StatCard
                title="Teaching Hours"
                value={stats.totalHours}
                icon={Clock}
                color="text-purple-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Analytics Section */}
              <div className={`rounded-lg shadow-md ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } p-6`}>
                <CourseAnalytics analytics={analytics} theme={theme} />
              </div>

              {/* Student Activity */}
              <div className={`rounded-lg shadow-md ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } p-6`}>
                <StudentActivity activities={activities} theme={theme} />
              </div>
            </div>
            
            {/* Course Performance */}
            <div className={`mt-6 rounded-lg shadow-md ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } p-6`}>
              <CoursePerformance courses={courses} theme={theme} />
            </div>
          </>
        )}

        {activeTab === 'courses' && (
          <div className={`rounded-lg shadow-md ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <h3 className={`text-xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>Your Courses</h3>
              
              <div className="grid gap-6">
                {courses.length === 0 ? (
                  <p className={`text-center py-8 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>No courses found. Create your first course!</p>
                ) : (
                  courses.map((course) => (
                    <div key={course.id} className={`p-4 rounded-lg border ${
                      theme === 'dark'
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`text-lg font-semibold mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                          }`}>{course.title}</h4>
                          <p className={`${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>{course.students_count} students enrolled</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/courses/${course.slug}/edit`} className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                          }`}>
                            <Edit2 className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => deleteCourse(course.slug)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-red-900/50 text-gray-400 hover:text-red-400'
                                : 'hover:bg-red-100 text-gray-600 hover:text-red-600'
                            }`}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className={`rounded-lg shadow-md ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <TeacherSchedule schedule={schedule} theme={theme} />
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className={`rounded-lg shadow-md ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <TeacherNotifications notifications={notifications} theme={theme} />
              <div className="mt-6">
                {/* Add student management content here */}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TeacherDashboard;
