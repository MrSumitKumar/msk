import React from 'react';
import { UserCircle, Clock } from 'lucide-react';

const StudentActivity = ({ activities, theme }) => {
  return (
    <div className={`rounded-lg shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } p-6`}>
      <h3 className={`text-xl font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>Recent Student Activity</h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className={`flex items-start gap-4 p-3 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
            }`}>
              <UserCircle className={`h-6 w-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`} />
            </div>
            <div className="flex-1">
              <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                <span className="font-medium">{activity.studentName}</span>
                {' '}{activity.action}{' '}
                <span className="font-medium">{activity.courseName}</span>
              </p>
              <div className="flex items-center mt-1">
                <Clock className={`h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className={`ml-1 text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {activity.time}
                </span>
              </div>
            </div>
            <div className={`px-2 py-1 text-xs rounded ${
              activity.type === 'enrollment'
                ? 'bg-green-100 text-green-800'
                : activity.type === 'completion'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {activity.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentActivity;
