import React, { useState, useContext, useEffect, useRef } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { 
  Users, Search, Filter, Download, Edit2, Trash2, 
  CheckSquare, Square, ChevronDown, Mail, Phone,
  UserPlus, RefreshCw, Eye, X, FileSpreadsheet,
  KeyRound, ActivitySquare, SendHorizontal, UserCog,
  Upload, FileUp, FilePlus, FileQuestion
} from 'lucide-react';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';

  const UserModal = ({ user, onClose, onSave, theme }) => {
    const [formData, setFormData] = useState({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || 'STUDENT',
      status: user?.status || 'INACTIVE',
      is_approved: user?.is_approved || false,
      password: user ? undefined : '' // Only for new users
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.first_name.trim()) {
        newErrors.first_name = 'First name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      
      if (!user && !formData.password) {
        newErrors.password = 'Password is required for new users';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validateForm()) {
        await onSave(formData);
      }
    };

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h3 className={`text-xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          {user ? 'Edit User' : 'Add New User'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } ${errors.first_name ? 'border-red-500' : ''} focus:border-blue-500 focus:ring-blue-500`}
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
              )}
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } focus:border-blue-500 focus:ring-blue-500`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:border-blue-500 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:border-blue-500 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:border-blue-500 focus:ring-blue-500`}
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-gray-900 border-gray-300'
              } focus:border-blue-500 focus:ring-blue-500`}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_approved"
              checked={formData.is_approved}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className={`ml-2 block text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Approved
            </label>
          </div>

          {/* Password field only for new users */}
          {!user && (
            <div>
              <label className={`block text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } focus:border-blue-500 focus:ring-blue-500`}
                required={!user}
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-600 hover:bg-gray-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { theme } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortBy, setSortBy] = useState('date_joined');
  const [sortOrder, setSortOrder] = useState('desc');
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    byRole: {}
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [userActivity, setUserActivity] = useState([]);
  const [exportFormat, setExportFormat] = useState('csv');
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [importTemplate, setImportTemplate] = useState(null);
  const [importErrors, setImportErrors] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  const [totalPages, setTotalPages] = useState(1);
  const [availableRoles, setAvailableRoles] = useState([
    'ADMIN', 'TEACHER', 'STUDENT', 'MANAGER'
  ]);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, sortOrder, sortBy, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      params.append('ordering', sortOrder === 'desc' ? '-' + sortBy : sortBy);
      params.append('page', currentPage);
      
      const response = await axios.get(`/auth/admin/users/?${params.toString()}`);
      
      let userData = [];
      if (Array.isArray(response.data)) {
        userData = response.data;
      } else if (response.data.results && Array.isArray(response.data.results)) {
        userData = response.data.results;
      } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
        // If it's a plain object but not an array
        if (response.data.users && Array.isArray(response.data.users)) {
          userData = response.data.users;
        } else {
          userData = Object.values(response.data).filter(item => typeof item === 'object');
        }
      }
      
      // Calculate user statistics
      const stats = {
        total: response.data.count || response.data.total || userData.length,
        active: userData.filter(u => u && (u.status === 'ACTIVE' || u.is_approved)).length,
        pending: userData.filter(u => u && (u.status === 'INACTIVE' || !u.is_approved)).length,
        byRole: userData.reduce((acc, user) => {
          if (user && user.role) {
            acc[user.role] = (acc[user.role] || 0) + 1;
          }
          return acc;
        }, {})
      };
      
      setUserStats(stats);
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users: ' + (error.response?.data?.message || error.message));
      setUsers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleExportUsers = async () => {
    try {
      let endpoint = '/auth/admin/users/export/';
      let mimeType;
      
      switch(exportFormat) {
        case 'xlsx':
          endpoint += '?format=excel';
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'pdf':
          endpoint += '?format=pdf';
          mimeType = 'application/pdf';
          break;
        default:
          endpoint += '?format=csv';
          mimeType = 'text/csv';
      }

      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`${endpoint}&${params.toString()}`, {
        responseType: 'blob',
        headers: {
          'Accept': mimeType
        }
      });

      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.${exportFormat}`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
      toast.success(`Users exported successfully as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export users: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSendBulkEmail = async () => {
    try {
      if (!emailSubject.trim() || !emailBody.trim()) {
        toast.error('Please provide both subject and body for the email');
        return;
      }

      const response = await axios.post('/auth/admin/users/send-bulk-email/', {
        user_ids: selectedUsers,
        subject: emailSubject,
        body: emailBody
      });

      toast.success('Bulk email sent successfully');
      setShowEmailModal(false);
      setEmailSubject('');
      setEmailBody('');
    } catch (error) {
      toast.error('Failed to send bulk email: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      await axios.post(`/auth/admin/users/${userId}/reset-password/`);
      toast.success('Password reset email sent successfully');
    } catch (error) {
      toast.error('Failed to send password reset email');
    }
  };

  const handleViewActivity = async (userId) => {
    try {
      const response = await axios.get(`/auth/admin/users/${userId}/activity/`);
      setUserActivity(response.data);
      setShowActivityModal(true);
    } catch (error) {
      toast.error('Failed to fetch user activity');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axios.patch(`/auth/admin/users/${userId}/role/`, {
        role: newRole
      });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get('/auth/admin/users/import-template/', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bulk-users-template.xlsx');
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
      toast.success('Template downloaded successfully');
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setIsImporting(true);
    setImportErrors([]);

    try {
      const response = await axios.post('/auth/admin/users/bulk-import/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.errors && response.data.errors.length > 0) {
        setImportErrors(response.data.errors);
        toast.warning('Import completed with some errors');
      } else {
        toast.success('Users imported successfully');
        setShowBulkImportModal(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import users: ' + (error.response?.data?.message || error.message));
      if (error.response?.data?.errors) {
        setImportErrors(error.response.data.errors);
      }
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleUpdateUser = async (data) => {
    if (!editingUser) return;
    
    try {
      const response = await axios.patch(`/auth/admin/users/${editingUser.id}/`, data);
      toast.success('User updated successfully');
      await fetchUsers();
      setShowUserModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update user: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAddUser = async (data) => {
    try {
      const response = await axios.post('/auth/admin/users/', {
        ...data,
        username: data.email.split('@')[0].toUpperCase() + Math.floor(Math.random() * 100000000)
      });
      
      toast.success('User added successfully');
      await fetchUsers();
      setShowUserModal(false);
    } catch (error) {
      console.error('Add user error:', error);
      toast.error('Failed to add user: ' + (error.response?.data?.error || error.message));
    }
  };


  const handleBulkAction = async (action) => {
    if (!selectedUsers.length) {
      toast.error('Please select users first');
      return;
    }

    try {
      await axios.post(`/auth/admin/users/bulk-action/`, {
        action,
        user_ids: selectedUsers
      });

      toast.success(`Bulk ${action} completed successfully`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      toast.error(`Failed to ${action} users`);
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const toggleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      const response = await axios.delete(`/auth/admin/users/${userId}/`);
      if (response.status === 204) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        toast.error('Failed to delete user: ' + response.data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete user: ' + (error.response?.data?.error || error.message));
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    if (!user) return false;
    const searchTermLower = searchTerm.toLowerCase();
    const searchFields = [
      user.email,
      user.first_name,
      user.last_name,
      user.username,
      user.name // fallback
    ];
    return !searchTerm || // If no search term, include all users
      searchFields.some(field => 
        field && field.toLowerCase().includes(searchTermLower)
      );
  }) : [];

  return (
    <div className={`p-6 rounded-lg shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="space-y-6">
        {/* Stats Section */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-white'
          } shadow`}>
            <div className="text-sm text-gray-500">Total Users</div>
            <div className="text-2xl font-bold">{userStats.total}</div>
          </div>
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-white'
          } shadow`}>
            <div className="text-sm text-gray-500">Active Users</div>
            <div className="text-2xl font-bold text-green-500">{userStats.active}</div>
          </div>
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-white'
          } shadow`}>
            <div className="text-sm text-gray-500">Pending Approval</div>
            <div className="text-2xl font-bold text-yellow-500">{userStats.pending}</div>
          </div>
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-white'
          } shadow`}>
            <div className="text-sm text-gray-500">User Roles</div>
            <div className="text-sm mt-2">
              {Object.entries(userStats.byRole).map(([role, count]) => (
                <div key={role} className="flex justify-between">
                  <span>{role}:</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h2 className={`text-2xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>User Management</h2>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setEditingUser(null);
                  setShowUserModal(true);
                }}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                <span>Add User</span>
              </button>
              <button
                onClick={() => setShowBulkImportModal(true)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <FilePlus className="h-4 w-4" />
                <span>Bulk Import</span>
              </button>
              <button
                onClick={handleExportUsers}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
            <button
              onClick={() => fetchUsers()}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                  : 'bg-white text-gray-800 placeholder-gray-400 border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-800 border-gray-200'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="all">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="TEACHER">Teachers</option>
            <option value="ADMIN">Admins</option>
            <option value="MANAGER">Managers</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-800 border-gray-200'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-800 border-gray-200'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="date_joined">Date Joined</option>
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </select>

          <button
            onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <ChevronDown className={`h-5 w-5 transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-white'
          } shadow-sm flex items-center justify-between`}>
            <div className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
              {selectedUsers.length} users selected
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Deactivate
              </button>
              <button
                onClick={() => setShowEmailModal(true)}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
              >
                <SendHorizontal className="h-4 w-4" />
                Send Email
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="flex items-center space-x-2 my-4">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className={`px-3 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-800 border-gray-200'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="csv">CSV</option>
            <option value="xlsx">Excel</option>
            <option value="pdf">PDF</option>
          </select>
          <button
            onClick={handleExportUsers}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <FileSpreadsheet className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className={`text-center py-8 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>Loading users...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-left ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <th className="px-4 py-3">
                    <div className="flex items-center">
                      <button
                        onClick={toggleSelectAll}
                        className={`p-1 rounded transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-gray-600'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {selectedUsers.length === users.length ? (
                          <CheckSquare className="h-5 w-5" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </th>
                  <th className="px-4 py-3">User Info</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className={`border-t ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleSelectUser(user.id)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-gray-600'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {selectedUsers.includes(user.id) ? (
                          <CheckSquare className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className={`px-4 py-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      <div className="flex flex-col">
                        <div className="font-medium">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : user.name || user.username || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          Joined: {new Date(user.date_joined).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{user.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{user.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'TEACHER'
                          ? 'bg-blue-100 text-blue-800'
                          : user.role === 'MANAGER'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role?.toLowerCase() || 'N/A'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status || 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className={`p-1 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'hover:bg-blue-900/50 text-gray-400 hover:text-blue-400'
                              : 'hover:bg-blue-100 text-gray-600 hover:text-blue-600'
                          }`}
                          title="Edit User"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className={`p-1 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'hover:bg-red-900/50 text-gray-400 hover:text-red-400'
                              : 'hover:bg-red-100 text-gray-600 hover:text-red-600'
                          }`}
                          title="Delete User"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className={`p-1 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'hover:bg-yellow-900/50 text-gray-400 hover:text-yellow-400'
                              : 'hover:bg-yellow-100 text-gray-600 hover:text-yellow-600'
                          }`}
                          title="Reset Password"
                        >
                          <KeyRound className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleViewActivity(user.id)}
                          className={`p-1 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'hover:bg-purple-900/50 text-gray-400 hover:text-purple-400'
                              : 'hover:bg-purple-100 text-gray-600 hover:text-purple-600'
                          }`}
                          title="View Activity"
                        >
                          <ActivitySquare className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowRoleModal(true);
                          }}
                          className={`p-1 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'hover:bg-green-900/50 text-gray-400 hover:text-green-400'
                              : 'hover:bg-green-100 text-gray-600 hover:text-green-600'
                          }`}
                          title="Manage Roles"
                        >
                          <UserCog className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => window.location.href = `/admin/users/${user.id}`}
                          className={`p-1 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-300'
                              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                          }`}
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className={`text-center py-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No users found
            </div>
          )}
        </>
      )}

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          onSave={editingUser ? handleUpdateUser : handleAddUser}
          theme={theme}
        />
      )}

      {/* Bulk Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Send Bulk Email
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } focus:border-blue-500 focus:ring-blue-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Message
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={4}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } focus:border-blue-500 focus:ring-blue-500`}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className={`px-4 py-2 rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-600 hover:bg-gray-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendBulkEmail}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`relative w-full max-w-3xl p-6 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <button
              onClick={() => setShowActivityModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              User Activity Log
            </h3>
            
            <div className="max-h-96 overflow-y-auto">
              {userActivity.map((activity, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg mb-2 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {activity.action}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                  {activity.details && (
                    <div className={`mt-1 text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {activity.details}
                    </div>
                  )}
                </div>
              ))}
              
              {userActivity.length === 0 && (
                <div className={`text-center py-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No activity found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Role Management Modal */}
      {showRoleModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <button
              onClick={() => {
                setShowRoleModal(false);
                setEditingUser(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Manage User Role
            </h3>
            
            <div className="space-y-4">
              {availableRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    handleUpdateRole(editingUser.id, role);
                    setShowRoleModal(false);
                    setEditingUser(null);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    editingUser.role === role
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-800'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-white text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`relative w-full max-w-lg p-6 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <button
              onClick={() => {
                setShowBulkImportModal(false);
                setImportErrors([]);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Bulk Import Users
            </h3>

            <div className="space-y-6">
              {/* Template Download Section */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileQuestion className="h-6 w-6 text-blue-500" />
                    <div>
                      <h4 className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>Need a template?</h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>Download the Excel template to get started</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadTemplate}
                    className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Template</span>
                  </button>
                </div>
              </div>

              {/* File Upload Section */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className={`h-8 w-8 mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <p className={`mb-2 text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Excel files only (XLSX)
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".xlsx"
                      onChange={handleFileUpload}
                      disabled={isImporting}
                    />
                  </label>
                </div>
              </div>

              {/* Error Display */}
              {importErrors.length > 0 && (
                <div className={`mt-4 p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-red-900/50' : 'bg-red-50'
                }`}>
                  <h4 className={`font-medium mb-2 ${
                    theme === 'dark' ? 'text-red-200' : 'text-red-800'
                  }`}>Import Errors:</h4>
                  <ul className={`list-disc list-inside space-y-1 ${
                    theme === 'dark' ? 'text-red-200' : 'text-red-600'
                  }`}>
                    {importErrors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
