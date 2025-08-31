import React from 'react';
import { Bell, MessageSquare, AlertCircle, CheckCircle, Info } from 'lucide-react';

const TeacherNotifications = ({ notifications, theme }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5" />;
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'message':
        return theme === 'dark'
          ? 'bg-blue-900/50 text-blue-400'
          : 'bg-blue-100 text-blue-800';
      case 'alert':
        return theme === 'dark'
          ? 'bg-red-900/50 text-red-400'
          : 'bg-red-100 text-red-800';
      case 'success':
        return theme === 'dark'
          ? 'bg-green-900/50 text-green-400'
          : 'bg-green-100 text-green-800';
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
        <Bell className="h-5 w-5" />
        Notifications & Announcements
      </h3>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            } ${notification.unread ? 'border-l-4 border-blue-500' : ''}`}
          >
            <div className="flex gap-3">
              <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {notification.title}
                </h4>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {notification.message}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {notification.time}
                  </span>
                  {notification.unread && (
                    <button
                      className={`text-xs ${
                        theme === 'dark'
                          ? 'text-blue-400 hover:text-blue-300'
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      Mark as read
                    </button>
                  )}
                  {notification.actionable && (
                    <button
                      className={`text-xs ${
                        theme === 'dark'
                          ? 'text-green-400 hover:text-green-300'
                          : 'text-green-600 hover:text-green-700'
                      }`}
                    >
                      Take action
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherNotifications;
