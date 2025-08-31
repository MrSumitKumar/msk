import React from 'react';
import { Calendar, Clock, Video, Users } from 'lucide-react';

const TeacherSchedule = ({ schedule, theme }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return theme === 'dark' 
          ? 'bg-blue-900/50 text-blue-400' 
          : 'bg-blue-100 text-blue-800';
      case 'live':
        return theme === 'dark'
          ? 'bg-green-900/50 text-green-400'
          : 'bg-green-100 text-green-800';
      case 'cancelled':
        return theme === 'dark'
          ? 'bg-red-900/50 text-red-400'
          : 'bg-red-100 text-red-800';
      default:
        return theme === 'dark'
          ? 'bg-gray-900/50 text-gray-400'
          : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`rounded-lg shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } p-6`}>
      <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        <Calendar className="h-5 w-5" />
        Upcoming Classes
      </h3>

      <div className="space-y-4">
        {schedule.map((session) => (
          <div
            key={session.id}
            className={`p-4 rounded-lg border ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            } ${session.status === 'live' ? 'border-green-500 border-2' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {session.title}
                </h4>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {session.courseName}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(session.status)}`}>
                {session.status}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className={`h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {session.time}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className={`h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {session.enrolledStudents} students enrolled
                </span>
              </div>

              {session.status === 'upcoming' && (
                <button
                  className={`mt-2 w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors`}
                >
                  <Video className="h-4 w-4" />
                  Start Class
                </button>
              )}

              {session.status === 'live' && (
                <button
                  className={`mt-2 w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white transition-colors`}
                >
                  <Video className="h-4 w-4" />
                  Join Ongoing Class
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSchedule;
