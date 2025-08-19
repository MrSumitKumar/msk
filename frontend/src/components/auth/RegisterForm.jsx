import React, { useState, useContext, useCallback } from 'react';
import { User, Mail, Phone, Lock, Calendar, UserPlus, Check, X } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import axios from '../../api/axios';

// Debounce helper
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const RegisterForm = ({ onSubmit, loading, referralUsername, referralPosition, sponsorDetails, setSponsorDetails }) => {
  const { theme } = useContext(ThemeContext);
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    role: 'STUDENT',
    sponsorUsername: referralUsername || '',
    position: referralPosition || '',
    isReferral: Boolean(referralUsername),
  });

  const [checkingSponsor, setCheckingSponsor] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    number: false,
    lowercase: false,
    uppercase: false,
    special: false,
    match: false,
  });

  // Debounced email check
  const checkEmailDebounced = useCallback(
    debounce(async (email) => {
      if (email && /\S+@\S+\.\S+/.test(email)) {
        try {
          const response = await axios.post('/auth/check-email/', { email });
          if (response.data.exists) {
            setErrors((prev) => ({ ...prev, email: 'Email already registered' }));
          }
        } catch { }
      }
    }, 800),
    []
  );

  // Debounced phone check
  const checkPhoneDebounced = useCallback(
    debounce(async (phone) => {
      if (phone && /^\d{10}$/.test(phone)) {
        try {
          const response = await axios.post('/auth/check-phone/', { phone });
          if (response.data.exists) {
            setErrors((prev) => ({ ...prev, phone: 'Phone number already registered' }));
          }
        } catch { }
      }
    }, 800),
    []
  );

  // Password validation
  const validatePassword = useCallback((password, confirmPassword) => {
    const validation = {
      length: password.length >= 8,
      number: /\d/.test(password),
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword,
    };
    setPasswordValidation(validation);
    return validation;
  }, []);

  // Sponsor validation
  const checkSponsor = async (username) => {
    if (!username) return;
    setCheckingSponsor(true);
    try {
      const response = await axios.post('/auth/check-sponsor/', { username });
      if (response.data.exists) {
        setSponsorDetails(response.data.details);
        setErrors((prev) => ({ ...prev, sponsorUsername: '' }));
      } else {
        setSponsorDetails(null);
        setErrors((prev) => ({ ...prev, sponsorUsername: 'Sponsor not found' }));
      }
    } catch (error) {
      setSponsorDetails(null);
      setErrors((prev) => ({
        ...prev,
        sponsorUsername: error.response?.data?.message || 'Error checking sponsor',
      }));
    } finally {
      setCheckingSponsor(false);
    }
  };

  // Change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Validate passwords live
    if (name === 'password' || name === 'confirmPassword') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      validatePassword(password, confirmPassword);
    }

    // Debounced checks
    if (name === 'email') {
      if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
      } else {
        checkEmailDebounced(value);
      }
    }

    if (name === 'phone') {
      if (!/^\d{10}$/.test(value)) {
        setErrors((prev) => ({ ...prev, phone: 'Invalid phone number format' }));
      } else {
        checkPhoneDebounced(value);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = `w-full px-4 py-3 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    theme === 'dark'
      ? 'bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:bg-gray-700'
      : 'bg-white text-gray-900 border border-gray-300 placeholder-gray-500 focus:bg-gray-50'
  }`;

  const labelClasses = `block text-sm font-medium mb-2 ${
    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Role Selection */}
      <div>
        <label className={labelClasses}>Register as</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: 'STUDENT' }))}
            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
              formData.role === 'STUDENT'
                ? theme === 'dark'
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-blue-500 bg-blue-50 text-blue-700'
                : theme === 'dark'
                  ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            <UserPlus className="h-5 w-5 mx-auto mb-1" />
            Student
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: 'TEACHER' }))}
            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
              formData.role === 'TEACHER'
                ? theme === 'dark'
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-blue-500 bg-blue-50 text-blue-700'
                : theme === 'dark'
                  ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            <User className="h-5 w-5 mx-auto mb-1" />
            Teacher
          </button>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={labelClasses}>First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`${inputClasses} ${errors.firstName ? 'border-red-500' : ''}`}
            placeholder="First name"
            required
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className={labelClasses}>Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Last name"
          />
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className={labelClasses}>Email</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`pl-10 ${inputClasses} ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Enter your email"
            required
          />
        </div>
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className={labelClasses}>Phone Number</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`pl-10 ${inputClasses} ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="Enter your phone number"
            required
          />
        </div>
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className={labelClasses}>Gender</label>
        <div className="grid grid-cols-2 gap-4">
          <label
            className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              formData.gender === 'MALE'
                ? theme === 'dark'
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-blue-500 bg-blue-50 text-blue-700'
                : theme === 'dark'
                  ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name="gender"
              value="MALE"
              checked={formData.gender === 'MALE'}
              onChange={handleChange}
              className="sr-only"
            />
            <span className="text-sm font-medium">Male</span>
          </label>
          <label
            className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              formData.gender === 'FEMALE'
                ? theme === 'dark'
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-blue-500 bg-blue-50 text-blue-700'
                : theme === 'dark'
                  ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name="gender"
              value="FEMALE"
              checked={formData.gender === 'FEMALE'}
              onChange={handleChange}
              className="sr-only"
            />
            <span className="text-sm font-medium">Female</span>
          </label>
        </div>
        {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
      </div>

      {/* Date of Birth */}
      <div>
        <label htmlFor="dateOfBirth" className={labelClasses}>Date of Birth</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`pl-10 ${inputClasses} ${errors.dateOfBirth ? 'border-red-500' : ''}`}
            required
          />
        </div>
        {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className={labelClasses}>Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className={`pl-10 ${inputClasses} ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Enter your password"
            required
          />
        </div>
        
        {/* Password Requirements */}
        <div className={`mt-3 space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {[
            { key: 'length', text: 'At least 8 characters' },
            { key: 'number', text: 'Contains a number' },
            { key: 'lowercase', text: 'Contains a lowercase letter' },
            { key: 'uppercase', text: 'Contains an uppercase letter' },
            { key: 'special', text: 'Contains a special character' }
          ].map(({ key, text }) => (
            <div key={key} className="flex items-center gap-2">
              {passwordValidation[key] ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className={labelClasses}>Confirm Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`pl-10 ${inputClasses} ${errors.confirmPassword ? 'border-red-500' : ''}`}
            placeholder="Confirm your password"
            required
          />
        </div>
        
        {/* Password Match Indicator */}
        {formData.confirmPassword && (
          <div className="flex items-center gap-2 mt-2">
            {passwordValidation.match ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Passwords match</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">Passwords do not match</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Referral Section */}
      {referralUsername ? (
        <div className={`p-4 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Referral Information:
          </h3>
          <div className="space-y-2">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Sponsor: {sponsorDetails?.name || referralUsername}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {referralPosition
                ? `Position: ${referralPosition}`
                : "Position will be auto-assigned by the system"}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className={labelClasses}>Register with Referral</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isReferral"
                checked={formData.isReferral}
                onChange={(e) => {
                  handleChange(e);
                  if (!e.target.checked) {
                    setSponsorDetails(null);
                    setFormData((prev) => ({ ...prev, sponsorUsername: '' }));
                    setErrors((prev) => ({ ...prev, sponsorUsername: '' }));
                  }
                }}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 peer-checked:bg-blue-600'
                  : 'bg-gray-200 peer-checked:bg-blue-600'
              } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
          </div>

          {formData.isReferral && (
            <div>
              <label htmlFor="sponsorUsername" className={labelClasses}>Sponsor Username</label>
              <div className="relative">
                <input
                  type="text"
                  name="sponsorUsername"
                  id="sponsorUsername"
                  value={formData.sponsorUsername}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({ ...prev, sponsorUsername: value }));
                    if (value) {
                      checkSponsor(value);
                    } else {
                      setSponsorDetails(null);
                      setErrors((prev) => ({ ...prev, sponsorUsername: '' }));
                    }
                  }}
                  className={`${inputClasses} ${errors.sponsorUsername ? 'border-red-500' : ''}`}
                  placeholder="Enter sponsor's username"
                />
                {checkingSponsor && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              {errors.sponsorUsername && (
                <p className="mt-1 text-xs text-red-500">{errors.sponsorUsername}</p>
              )}
              {sponsorDetails && (
                <div className={`mt-2 p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Sponsor: {sponsorDetails.name}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Position will be auto-assigned
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-500/50 ${
          loading 
            ? "opacity-50 cursor-not-allowed bg-gray-400" 
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        }`}
      >
        <UserPlus className="w-5 h-5" />
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default RegisterForm;