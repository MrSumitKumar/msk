import React, { useContext, useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { ThemeContext } from '../../context/ThemeContext';
import { 
  Users, BookOpen, Calendar, ChartBar, Settings, 
  AlertCircle, DollarSign, GraduationCap, Bell,
  Search, Filter, Download, Trash2, Edit2, PieChart,
  LineChart, TrendingUp, CheckCircle2, Clock, ListTodo,
  CalendarClock, FileBarChart, Wallet, BookCheck,
  Server, Cpu, Activity, CircleDollarSign, UserCheck,
  ShieldCheck, BarChart3, BrainCircuit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from "../../api/axios";

const AdminDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const defaultStats = {
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    activeEnrollments: 0,
    revenueThisMonth: 0,
    pendingApprovals: 0,
    completionRate: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalCompletions: 0,
    activeUsers: 0,
    systemStatus: {
      cpu: 0,
      memory: 0,
      storage: 0,
      uptime: 0
    },
    financialMetrics: {
      totalEarnings: 0,
      pendingPayouts: 0,
      revenueGrowth: 0,
      averageOrderValue: 0
    },
    courseMetrics: {
      mostPopular: [],
      highestRated: [],
      recentlyAdded: []
    },
    userMetrics: {
      newUsersToday: 0,
      activeTeachers: 0,
      verificationPending: 0
    },
    performanceMetrics: {
      averageCompletionTime: 0,
      satisfactionRate: 0,
      engagementRate: 0
    }
  };

  const [stats, setStats] = useState(defaultStats);
  
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [realtimeStats, setRealtimeStats] = useState({
    activeUsers: 0,
    ongoingClasses: 0,
    systemLoad: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [
          statsRes, 
          activitiesRes, 
          approvalsRes, 
          notificationsRes,
          tasksRes,
          scheduleRes,
          systemStatusRes
        ] = await Promise.all([
          axios.get('/admin/dashboard-stats/'),
          axios.get('/admin/recent-activities/'),
          axios.get('/admin/pending-approvals/'),
          axios.get('/admin/notifications/'),
          axios.get('/admin/tasks/'),
          axios.get('/admin/schedule/'),
          axios.get('/admin/system-status/')
        ]);
        
        // Deep merge the API response with default values
        const mergedStats = {
          ...defaultStats,
          ...statsRes.data,
          systemStatus: {
            ...defaultStats.systemStatus,
            ...(statsRes.data?.systemStatus || {})
          },
          financialMetrics: {
            ...defaultStats.financialMetrics,
            ...(statsRes.data?.financialMetrics || {})
          },
          courseMetrics: {
            ...defaultStats.courseMetrics,
            ...(statsRes.data?.courseMetrics || {})
          },
          userMetrics: {
            ...defaultStats.userMetrics,
            ...(statsRes.data?.userMetrics || {})
          },
          performanceMetrics: {
            ...defaultStats.performanceMetrics,
            ...(statsRes.data?.performanceMetrics || {})
          }
        };
        setStats(mergedStats);

        setRecentActivities(Array.isArray(activitiesRes.data) ? activitiesRes.data : []);
        setPendingApprovals(Array.isArray(approvalsRes.data) ? approvalsRes.data : []);
        setNotifications(Array.isArray(notificationsRes.data) ? notificationsRes.data : []);
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        setSchedule(Array.isArray(scheduleRes.data) ? scheduleRes.data : []);

        // Update realtime stats
        setRealtimeStats(systemStatusRes.data || {
          activeUsers: 0,
          ongoingClasses: 0,
          systemLoad: 0
        });

      } catch (error) {
        setError('Failed to fetch dashboard data');
        toast.error('Failed to fetch dashboard data');
        console.error('Failed to fetch dashboard data:', error);
        // Initialize with empty arrays on error
        setRecentActivities([]);
        setPendingApprovals([]);
        setNotifications([]);
        setTasks([]);
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time updates every 30 seconds
    const realtimeInterval = setInterval(async () => {
      try {
        const systemStatusRes = await axios.get('/admin/system-status/');
        setRealtimeStats(systemStatusRes.data || {
          activeUsers: 0,
          ongoingClasses: 0,
          systemLoad: 0
        });
      } catch (error) {
        console.error('Failed to fetch realtime stats:', error);
      }
    }, 30000);

    return () => {
      clearInterval(realtimeInterval);
    };
  }, []);

  const handleApproval = async (id, status) => {
    try {
      await axios.post(`/admin/approve-request/${id}/`, { status });
      toast.success(`Request ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      // Refresh pending approvals
      const response = await axios.get('/admin/pending-approvals/');
      setPendingApprovals(response.data);
    } catch (error) {
      toast.error('Failed to process approval');
    }
  };

  const handleAddTask = async (task) => {
    try {
      const response = await axios.post('/admin/tasks/', task);
      setTasks([...tasks, response.data]);
      toast.success('Task added successfully');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      await axios.patch(`/admin/tasks/${id}/`, updates);
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleScheduleEvent = async (event) => {
    try {
      const response = await axios.post('/admin/schedule/', event);
      setSchedule([...schedule, response.data]);
      toast.success('Event scheduled successfully');
    } catch (error) {
      toast.error('Failed to schedule event');
    }
  };

  const handleExportData = async (type) => {
    try {
      const response = await axios.get(`/admin/export/${type}/`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(`Failed to export ${type} data`);
    }
  };

  const DashboardCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className={`p-6 rounded-lg shadow-md ${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>{title}</h3>
          <p className={`text-3xl font-bold ${color}`}>
            {typeof value === 'number' && title.toLowerCase().includes('revenue') ? 
              `₹${value.toLocaleString()}` : value}
          </p>
          {subtitle && (
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text', 'bg').replace('600', '100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const NotificationPanel = () => (
    <div className={`absolute right-0 mt-2 w-96 rounded-lg shadow-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="p-4">
        <h4 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>Notifications</h4>
        {notifications.length === 0 ? (
          <p className={`text-center py-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>No new notifications</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                  {notification.message}
                </p>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {new Date(notification.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Admin Dashboard – MSK Institute</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Manage all courses, staff, students, and institute activities from the MSK Institute Admin Dashboard." />
        <link rel="canonical" href="https://msk.shikohabad.in/admin-dashboard" />

        <meta property="og:title" content="Admin Dashboard – MSK Institute" />
        <meta property="og:description" content="Administrative control panel for MSK Institute. Manage users, content, and courses." />
        <meta property="og:url" content="https://msk.shikohabad.in/admin-dashboard" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>Admin Dashboard</h2>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg relative ${
                  theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <Bell className={theme === 'dark' ? 'text-white' : 'text-gray-800'} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              {showNotifications && <NotificationPanel />}
            </div>
          </div>
        </div>

        {loading ? (
          <div className={`text-center py-10 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>Loading dashboard data...</div>
        ) : (
          <>
            {/* Main Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard
                title="Active Users"
                value={stats?.userMetrics?.activeUsers || 0}
                icon={Users}
                color="text-blue-600"
                subtitle={`${stats?.userMetrics?.newUsersToday || 0} new today`}
              />
              <DashboardCard
                title="Total Revenue"
                value={stats?.financialMetrics?.totalEarnings || 0}
                icon={Wallet}
                color="text-green-600"
                subtitle={`${stats?.financialMetrics?.revenueGrowth || 0}% growth`}
              />
              <DashboardCard
                title="Course Completions"
                value={stats?.totalCompletions || 0}
                icon={BookCheck}
                color="text-purple-600"
                subtitle={`${stats?.completionRate || 0}% completion rate`}
              />
              <DashboardCard
                title="System Health"
                value={`${stats?.systemStatus?.cpu || 0}% CPU`}
                icon={Server}
                color="text-cyan-600"
                subtitle={`${stats?.systemStatus?.uptime || 0}% uptime`}
              />
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <DashboardCard
                title="Student Engagement"
                value={`${stats?.performanceMetrics?.engagementRate || 0}%`}
                icon={Activity}
                color="text-indigo-600"
                subtitle="Average daily engagement"
              />
              <DashboardCard
                title="Course Revenue"
                value={stats?.financialMetrics?.averageOrderValue || 0}
                icon={CircleDollarSign}
                color="text-emerald-600"
                subtitle="Average per enrollment"
              />
              <DashboardCard
                title="Teacher Performance"
                value={(stats?.averageRating || 0).toFixed(1)}
                icon={UserCheck}
                color="text-yellow-600"
                subtitle="Average rating"
              />
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <DashboardCard
                title="Memory Usage"
                value={`${stats?.systemStatus?.memory || 0}%`}
                icon={Cpu}
                color="text-red-600"
                subtitle="Server memory"
              />
              <DashboardCard
                title="Storage"
                value={`${stats?.systemStatus?.storage || 0}%`}
                icon={ShieldCheck}
                color="text-teal-600"
                subtitle="Available space"
              />
              <DashboardCard
                title="Active Sessions"
                value={realtimeStats?.activeUsers || 0}
                icon={BrainCircuit}
                color="text-violet-600"
                subtitle={`${realtimeStats?.ongoingClasses || 0} classes ongoing`}
              />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className={`p-6 rounded-lg shadow-md ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Recent Activities</h3>
                  <button
                    onClick={() => handleExportData('activities')}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {error ? (
                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'
                    }`}>
                      <p className={theme === 'dark' ? 'text-red-200' : 'text-red-600'}>
                        Failed to load recent activities
                      </p>
                    </div>
                  ) : recentActivities.length === 0 ? (
                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        No recent activities found
                      </p>
                    </div>
                  ) : (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <p className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                          {activity.description}
                        </p>
                        <p className={`text-sm mt-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={`p-6 rounded-lg shadow-md ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Pending Approvals</h3>
                  <div className="flex items-center space-x-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className={`rounded-lg px-3 py-2 text-sm ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-white text-gray-800 border-gray-200'
                      }`}
                    >
                      <option value="all">All Types</option>
                      <option value="teacher">Teacher</option>
                      <option value="course">Course</option>
                      <option value="withdrawal">Withdrawal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {pendingApprovals
                    .filter(item => filterStatus === 'all' || item.type === filterStatus)
                    .map((item) => (
                    <div key={item.id} className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                          }`}>{item.title}</h4>
                          <p className={`text-sm mt-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>{item.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproval(item.id, 'approved')}
                            className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproval(item.id, 'rejected')}
                            className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task Management & Schedule Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Task Management */}
              <div className={`p-6 rounded-lg shadow-md ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Tasks</h3>
                  <button
                    onClick={() => handleAddTask({ title: '', priority: 'medium', status: 'pending' })}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <ListTodo className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`p-4 rounded-lg flex items-center justify-between ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={task.status === 'completed'}
                          onChange={() => handleUpdateTask(task.id, {
                            status: task.status === 'completed' ? 'pending' : 'completed'
                          })}
                          className="h-5 w-5 rounded border-gray-300"
                        />
                        <span className={`${
                          task.status === 'completed' 
                            ? 'line-through text-gray-500' 
                            : theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                          {task.title}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className={`p-6 rounded-lg shadow-md ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Schedule</h3>
                  <button
                    onClick={() => handleScheduleEvent({ title: '', date: new Date() })}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    <CalendarClock className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {schedule.map((event) => (
                    <div 
                      key={event.id} 
                      className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                          }`}>{event.title}</h4>
                          <p className={`text-sm mt-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {new Date(event.date).toLocaleString()}
                          </p>
                        </div>
                        {event.type && (
                          <span className={`px-2 py-1 rounded text-sm ${
                            event.type === 'class' 
                              ? 'bg-blue-100 text-blue-800' 
                              : event.type === 'meeting'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {event.type}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className={`p-6 rounded-lg shadow-md ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/admin/users" className={`p-4 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}>
                  <Users className="h-6 w-6 mb-2" />
                  <span>Manage Users</span>
                </Link>
                <Link to="/admin/courses" className={`p-4 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}>
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span>Manage Courses</span>
                </Link>
                <Link to="/reports" className={`p-4 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}>
                  <ChartBar className="h-6 w-6 mb-2" />
                  <span>View Reports</span>
                </Link>
                <Link to="/settings" className={`p-4 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}>
                  <Settings className="h-6 w-6 mb-2" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
