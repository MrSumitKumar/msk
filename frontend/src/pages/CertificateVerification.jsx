import { useState, useContext, useEffect } from 'react';
import { Search, User, BookOpen, Calendar, CheckCircle } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';

const CertificateVerification = () => {
  const { theme } = useContext(ThemeContext);
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const enrollFromUrl = searchParams.get('enrollment');
    if (enrollFromUrl) {
      verifyEnrollment(enrollFromUrl);
    }
  }, [searchParams]);

  // Function to verify enrollment
  const verifyEnrollment = async (number) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.get(`/courses/verify-certificate/${number}/`);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Certificate Verification
        </h1>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Scan the Qr Code on your certificate to verify its authenticity.
        </p>
      </div>

      {error && (
        <div className="max-w-md mx-auto p-4 rounded-lg bg-red-100 border border-red-300 text-red-700">
          {error}
        </div>
      )}

      {result && result.valid && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Certificate Status */}
          <div className={`p-6 rounded-lg ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200 shadow-lg'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Verified Certificate
              </h2>
            </div>

            {/* Student Details */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                {result.student.profile_image ? (
                  <img 
                    src={result.student.profile_image} 
                    alt={result.student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-full h-full p-3 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {result.student.name}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Enrollment: {result.student.enrollment_no}
                </p>
              </div>
            </div>

            {/* Course Details */}
            <div className="space-y-4">
              {/* Course Title & Level */}
              <div className="flex items-start gap-3">
                <BookOpen className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {result.course.name}
                    </h4>
                    <a 
                      href={`/courses/${result.course.slug}`}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 hover:scale-105 ${
                        theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      View Course
                    </a>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Level: {result.course.level} • Duration: {result.course.duration} {result.course.duration > 1 ? "Months" : "Month"}
                  </p>
                </div>
              </div>

              {/* Certificate Timeline */}
              <div className="flex items-center gap-3">
                <Calendar className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Certificate Timeline</p>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(result.certificate.enrollment_date).toLocaleDateString()} - {new Date(result.certificate.completion_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Section */}
          <div className={`p-6 rounded-lg text-center ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-blue-900 to-purple-900 border border-gray-700' 
              : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200'
          }`}>
            <p className={`text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {result.marketing.success_story}
            </p>
            <div className="flex justify-center items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
              <span>⭐ {result.marketing.rating.toFixed(1)} Rating</span>
              <span>👥 {result.marketing.total_students}+ Students</span>
            </div>
            <a 
              href={result.marketing.course_url} 
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {result.marketing.cta_text}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateVerification;