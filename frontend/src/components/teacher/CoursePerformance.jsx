import React from 'react';
import { Star, Zap, BookOpen } from 'lucide-react';

const CoursePerformance = ({ courses, theme }) => {
  return (
    <div className={`rounded-lg shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } p-6`}>
      <h3 className={`text-xl font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>Course Performance</h3>

      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{course.title}</h4>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Last updated: {course.lastUpdated}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                course.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : course.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {course.status}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Star className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                }`} />
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Rating</p>
                  <p className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{course.rating}/5.0</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Zap className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                }`} />
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Completion</p>
                  <p className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{course.completionRate}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-500'
                }`} />
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Enrolled</p>
                  <p className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{course.enrolledCount}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Course Progress</span>
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePerformance;
