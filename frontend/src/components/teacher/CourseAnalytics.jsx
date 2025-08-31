import React from 'react';
import { BarChart, DollarSign, TrendingUp, Users } from 'lucide-react';

const CourseAnalytics = ({ analytics, theme }) => {
  return (
    <div className={`rounded-lg shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } p-6`}>
      <h3 className={`text-xl font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>Course Analytics</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'
            }`}>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Total Enrollments</p>
              <p className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{analytics.totalEnrollments}</p>
            </div>
          </div>
          <div className="mt-2">
            <p className={`text-sm ${analytics.enrollmentGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {analytics.enrollmentGrowth >= 0 ? '↑' : '↓'} {Math.abs(analytics.enrollmentGrowth)}%
              <span className={`ml-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>vs last month</span>
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100'
            }`}>
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Revenue</p>
              <p className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>${analytics.totalRevenue}</p>
            </div>
          </div>
          <div className="mt-2">
            <p className={`text-sm ${analytics.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {analytics.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(analytics.revenueGrowth)}%
              <span className={`ml-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>vs last month</span>
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-yellow-900/50' : 'bg-yellow-100'
            }`}>
              <BarChart className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Completion Rate</p>
              <p className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{analytics.completionRate}%</p>
            </div>
          </div>
          <div className="mt-2">
            <p className={`text-sm ${analytics.completionRateGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {analytics.completionRateGrowth >= 0 ? '↑' : '↓'} {Math.abs(analytics.completionRateGrowth)}%
              <span className={`ml-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>vs last month</span>
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'
            }`}>
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Average Rating</p>
              <p className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{analytics.averageRating}/5.0</p>
            </div>
          </div>
          <div className="mt-2">
            <p className={`text-sm ${analytics.ratingGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {analytics.ratingGrowth >= 0 ? '↑' : '↓'} {Math.abs(analytics.ratingGrowth)}%
              <span className={`ml-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>vs last month</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics;
