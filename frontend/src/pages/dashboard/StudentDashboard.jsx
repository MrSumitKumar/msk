import { useContext, useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import { ThemeContext } from '../../context/ThemeContext';
import { BookOpen, GraduationCap, Award, Clock, BarChart, Medal, BookCheck, Target } from 'lucide-react';
import api from '../../api/axios';


const StudentDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        console.log('Fetching enrollments...');
        const response = await api.get('/auth/my-enrollments/');
        console.log('Raw API Response:', response);
        console.log('Response data:', response.data);

        if (!response.data || !response.data.results) {
          throw new Error('No data received from the API');
        }

        if (!Array.isArray(response.data.results)) {
          console.error('Expected results to be an array, got:', typeof response.data.results);
          throw new Error('Invalid data format received');
        }

        const transformedCourses = response.data.results.map(enrollment => {
          console.log('Processing enrollment:', enrollment);
          if (!enrollment.course) {
            console.warn('Enrollment missing course data:', enrollment);
            return null;
          }

          return {
            id: enrollment.course.id,
            title: enrollment.course.title || 'Untitled Course',
            image: enrollment.course.featured_image_url || '',
            lessons: enrollment.course.chapters_count || 0,
            enrollmentNo: enrollment.enrollment_no,
            certificate: enrollment.certificate || false,
            enrolled_at: enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString() : 'Not enrolled',
            end_at: enrollment.end_at ? new Date(enrollment.end_at).toLocaleDateString() : 'No end date',
            status: enrollment.status,
            payment_complete: enrollment.payment_complete,
            payment_method: enrollment.payment_method,
            amount: enrollment.amount,
            total_due_amount: enrollment.total_due_amount,
            total_paid_amount: enrollment.total_paid_amount
          };
        }).filter(course => course !== null);

        console.log('Transformed courses:', transformedCourses);
        setEnrolledCourses(transformedCourses);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        if (err.response?.status === 401) {
          setError('Please login to view your enrolled courses');
        } else {
          setError(
            err.response?.data?.message || 
            err.response?.data?.detail ||
            err.message ||
            'Failed to fetch enrolled courses'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const stats = [
    {
      title: "Enrolled Courses",
      value: enrolledCourses.length,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100'
    },
    {
      title: "Certificates",
      value: enrolledCourses.filter(course => course.certificate).length,
      icon: Award,
      color: "text-yellow-600",
      bgColor: theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-100'
    }
  ];

  const StatsCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className={`rounded-2xl p-6 transition-all duration-300 ${theme === 'dark'
        ? 'bg-gray-800 border border-gray-700 hover:bg-gray-750'
        : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl'
      }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>{title}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const CourseCard = ({ course }) => (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-300 ${theme === 'dark'
        ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
      }`}>
      {/* Course Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={course.image || '/placeholder-course.jpg'}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium
          ${course.status === 'Pending' 
            ? theme === 'dark' ? 'bg-yellow-900/90 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
            : theme === 'dark' ? 'bg-green-900/90 text-green-200' : 'bg-green-100 text-green-800'
          }`}>
          {course.status}
        </div>

        {/* Lessons Count */}
        <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-sm ${theme === 'dark'
            ? 'bg-gray-800/90 text-white'
            : 'bg-white/90 text-gray-900'
          }`}>
          {course.lessons} lessons
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        <h3 className={`font-bold text-lg mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
          {course.title}
        </h3>

        {/* Enrollment Details */}
        <div className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="flex justify-between mb-1">
            <span>Enrollment No:</span>
            <span className="font-medium">{course.enrollmentNo}</span>
          </div>
          <div className="flex justify-between">
            <span>Enrolled On:</span>
            <span>{course.enrolled_at}</span>
          </div>
        </div>

        {/* Actions */}
        {course.status === 'Approved' ? (
          <div className="flex items-center justify-between gap-3">
            <button 
              className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all duration-300 ${theme === 'dark'
                ? 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
              }`}>
              Course Details
            </button>
            <button 
              className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all duration-300 ${theme === 'dark'
                ? 'bg-green-600/10 hover:bg-green-600/20 text-green-400'
                : 'bg-green-50 hover:bg-green-100 text-green-600'
              }`}>
              Fee History
            </button>
          </div>
        ) : (
          <div className={`text-sm text-center py-2 rounded-lg ${theme === 'dark'
            ? 'bg-yellow-900/20 text-yellow-400'
            : 'bg-yellow-50 text-yellow-600'
          }`}>
            Waiting for approval
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Student Dashboard – MSK Institute</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="View your enrolled courses, progress, results, and certificate details from the MSK Institute Student Dashboard." />
        <link rel="canonical" href="https://msk.shikohabad.in/student-dashboard" />
        <meta property="og:title" content="Student Dashboard – MSK Institute" />
        <meta property="og:description" content="Access your personal dashboard to manage learning at MSK Institute." />
        <meta property="og:url" content="https://msk.shikohabad.in/student-dashboard" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={`min-h-screen p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, ${theme === 'dark' ? '#3B82F6' : '#60A5FA'} 0%, transparent 50%), 
                         radial-gradient(circle at 80% 80%, ${theme === 'dark' ? '#8B5CF6' : '#A78BFA'} 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                Student Dashboard
              </h1>
              <p className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Welcome back! Track your learning progress
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Enrolled Courses */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                Enrolled Courses
              </h2>
              <button className={`px-4 py-2 rounded-lg transition-all duration-300 ${theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                }`}>
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center items-center py-8">
                  <div className={`animate-spin rounded-full h-8 w-8 border-2 ${theme === 'dark' ? 'border-blue-500' : 'border-blue-600'} border-t-transparent`}></div>
                </div>
              ) : error ? (
                <div className={`col-span-full p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-600'}`}>
                  {error}
                </div>
              ) : enrolledCourses.length === 0 ? (
                <div className={`col-span-full p-8 text-center rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                  <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Courses Enrolled</h3>
                  <p>You haven't enrolled in any courses yet. Start your learning journey today!</p>
                </div>
              ) : (
                enrolledCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))
              )}
            </div>
          </div>

          {/* Learning Progress Section */}
          <div className="mb-8">
            <div className={`rounded-2xl p-6 transition-all duration-300 ${theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200 shadow-lg'
              }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                  Learning Progress
                </h2>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-6">
                {[
                  {
                    course: "Web Development",
                    completed: 8,
                    total: 12,
                    lastActivity: "2 hours ago",
                    nextLesson: "CSS Flexbox & Grid"
                  },
                  {
                    course: "Python Programming",
                    completed: 6,
                    total: 15,
                    lastActivity: "Yesterday",
                    nextLesson: "Functions & Classes"
                  },
                  {
                    course: "Data Science",
                    completed: 3,
                    total: 10,
                    lastActivity: "3 days ago",
                    nextLesson: "Data Analysis with Pandas"
                  }
                ].map((progress, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className={`font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                          {progress.course}
                        </h3>
                        <p className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          Next: {progress.nextLesson}
                        </p>
                      </div>
                      <div className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        Last activity: {progress.lastActivity}
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          Progress
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {progress.completed}/{progress.total} lessons
                        </span>
                      </div>
                      <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Certificates */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200 shadow-lg'
              }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                  Certificates
                </h2>
                <button className={`px-4 py-2 rounded-lg transition-all duration-300 ${theme === 'dark'
                    ? 'bg-yellow-600/10 hover:bg-yellow-600/20 text-yellow-400'
                    : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600'
                  }`}>
                  View All
                </button>
              </div>

              {/* Certificate List */}
              <div className="space-y-4">
                {[
                  {
                    name: "Web Development Fundamentals",
                    issueDate: "Aug 2025",
                    icon: GraduationCap
                  },
                  {
                    name: "Python Programming",
                    issueDate: "Jul 2025",
                    icon: Award
                  },
                  {
                    name: "Database Management",
                    issueDate: "Jun 2025",
                    icon: Medal
                  }
                ].map((cert, index) => {
                  const Icon = cert.icon;
                  return (
                    <div key={index} className={`flex items-center p-4 rounded-xl transition-all duration-300 ${theme === 'dark'
                        ? 'bg-gray-700/50 hover:bg-gray-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                      }`}>
                      <div className={`p-3 rounded-xl mr-4 ${theme === 'dark'
                          ? 'bg-yellow-900/20 text-yellow-400'
                          : 'bg-yellow-100 text-yellow-600'
                        }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                          {cert.name}
                        </h3>
                        <p className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          Issued {cert.issueDate}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Badges and Achievements */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200 shadow-lg'
              }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                  Badges & Achievements
                </h2>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  {
                    name: "Quick Learner",
                    description: "Completed 3 courses in a month",
                    icon: Target,
                    color: "purple"
                  },
                  {
                    name: "Perfect Score",
                    description: "100% in all assignments",
                    icon: BookCheck,
                    color: "green"
                  },
                  {
                    name: "Dedication",
                    description: "30 days streak",
                    icon: Award,
                    color: "blue"
                  },
                  {
                    name: "Early Bird",
                    description: "First to complete course",
                    icon: Medal,
                    color: "yellow"
                  },
                  {
                    name: "Top Performer",
                    description: "Ranked #1 in course",
                    icon: GraduationCap,
                    color: "red"
                  }
                ].map((badge, index) => {
                  const Icon = badge.icon;
                  return (
                    <div key={index} className={`p-4 rounded-xl text-center transition-all duration-300 ${theme === 'dark'
                        ? 'bg-gray-700/50 hover:bg-gray-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                      }`}>
                      <div className={`mx-auto w-12 h-12 rounded-xl mb-2 flex items-center justify-center ${theme === 'dark'
                          ? `bg-${badge.color}-900/20 text-${badge.color}-400`
                          : `bg-${badge.color}-100 text-${badge.color}-600`
                        }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className={`font-semibold text-sm mb-1 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        {badge.name}
                      </h3>
                      <p className={`text-xs transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        {badge.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;