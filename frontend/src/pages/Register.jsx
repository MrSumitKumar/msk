import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/AuthContext';
import api from '../api/api';

const Register = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);



  const [form, setForm] = useState({
    role: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [phoneExists, setPhoneExists] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Password strength validator
  useEffect(() => {
    const { password } = form;
    if (!password) {
      setPasswordValid(false);
      setPasswordMsg('');
    } else if (password.length < 8) {
      setPasswordValid(false);
      setPasswordMsg('🔒 Minimum 8 characters required');
    } else if (!/\d/.test(password)) {
      setPasswordValid(false);
      setPasswordMsg('🔒 Must include at least one number');
    } else if (!/[A-Za-z]/.test(password)) {
      setPasswordValid(false);
      setPasswordMsg('🔒 Must include at least one letter');
    } else {
      setPasswordValid(true);
      setPasswordMsg('✅ Password is valid');
    }
  }, [form.password]);

  // Check if phone exists
  useEffect(() => {
    const phone = form.phone.trim();
    if (phone.length === 10 && /^\d{10}$/.test(phone)) {
      const delay = setTimeout(() => {
        checkPhoneUnique(phone);
      }, 500);
      return () => clearTimeout(delay);
    } else {
      setPhoneExists(false);
    }
  }, [form.phone]);

  const checkPhoneUnique = async (phone) => {
    try {
      setCheckingPhone(true);
      const res = await api.post('/auth/check-phone/', { phone });
      setPhoneExists(res.data.exists);
    } catch (err) {
      console.error('Phone validation error:', err);
    } finally {
      setCheckingPhone(false);
    }
  };

  // Check if email exists
  useEffect(() => {
    if (form.email.length >= 5 && form.email.includes('@')) {
      const delay = setTimeout(() => {
        checkEmailUnique(form.email);
      }, 500);
      return () => clearTimeout(delay);
    }
  }, [form.email]);

  const checkEmailUnique = async (email) => {
    try {
      setCheckingEmail(true);
      const res = await api.post('/auth/check-email/', { email });
      setEmailExists(res.data.exists);
    } catch (err) {
      console.error('Email validation error:', err);
    } finally {
      setCheckingEmail(false);
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!form.role) errs.role = "Please select a role";
    if (!form.first_name) errs.first_name = "First name is required";
    if (!form.last_name) errs.last_name = "Last name is required";
    if (!form.email) errs.email = "Email is required";
    if (!form.phone) errs.phone = "Phone number is required";
    if (!form.password) errs.password = "Password is required";

    if (!confirmPassword) {
      errs.confirmPassword = "Please confirm your password";
    } else if (form.password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    if (phoneExists) errs.phone = "This phone number is already registered";
    if (emailExists) errs.email = "This email is already registered";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // 🔒 Lock right away

    if (!validateForm()) {
      setIsSubmitting(false); // 🔓 Unlock on fail
      return;
    }


    try {
      const { confirmPassword, ...submitData } = { ...form };
      await api.post('auth/register/', submitData);
      toast.success('🎉 Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('❌ Registration failed. Please check your inputs.');
    } finally {
      setIsSubmitting(false); // 🔓 Unlock after API
    }
  };





  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>Register - Enroll at MSK</title>
        <meta name="description" content="Create your student account at MSK and start learning top computer and coding courses. Registration is free and easy." />
        <link rel="canonical" href="https://msk.shikohabad.in/register" />
        <meta property="og:title" content="Register – MSK" />
        <meta property="og:description" content="Enroll now at MSK and gain access to hands-on computer and programming courses in Shikohabad." />
        <meta property="og:url" content="https://msk.shikohabad.in/register" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center text-white px-4 py-12">
        <div className="w-full max-w-xl bg-gray-900 rounded-2xl p-6 shadow-2xl space-y-6">
          <h2 className="text-2xl font-bold text-center">Create Your Account</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Role */}
            <div className="col-span-1 md:col-span-2 space-y-1">
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" className="text-gray-400 bg-gray-900">Select Role</option>
                <option value="Student" className="text-white bg-gray-900">Student</option>
                <option value="Teacher" className="text-white bg-gray-900">Teacher</option>
              </select>
              {errors.role && <p className="text-red-400 text-sm">{errors.role}</p>}
            </div>


            {/* First Name */}
            <div className="space-y-1">
              <input
                type="text"
                placeholder="First Name"
                autoComplete="off"
                value={form.first_name}
                onChange={e => setForm({ ...form, first_name: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              />
              {errors.first_name && <p className="text-red-400 text-sm">{errors.first_name}</p>}
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Last Name"
                autoComplete="off"
                value={form.last_name}
                onChange={e => setForm({ ...form, last_name: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              />
              {errors.last_name && <p className="text-red-400 text-sm">{errors.last_name}</p>}
            </div>

            {/* Email */}
            <div className="col-span-1 md:col-span-2 space-y-1">
              <input
                type="email"
                placeholder="Email"
                autoComplete="off"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              />
              {checkingEmail && <p className="text-yellow-300 text-sm">Checking email address...</p>}
              {emailExists && !checkingEmail && <p className="text-red-400 text-sm">❌ Email already registered</p>}
              {!emailExists && form.email && !checkingEmail && (
                <p className="text-green-400 text-sm">✅ Email is available</p>
              )}
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="col-span-1 md:col-span-2 space-y-1">
              <input
                type="tel"
                placeholder="Phone"
                autoComplete="off"
                value={form.phone}
                onChange={e => {
                  const input = e.target.value.replace(/\D/g, '');
                  if (input.length <= 10) {
                    setForm({ ...form, phone: input });
                  }
                }}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              />
              {form.phone.length > 0 && form.phone.length < 10 && (
                <p className="text-yellow-300 text-sm">📱 Enter a 10-digit mobile number</p>
              )}
              {checkingPhone && <p className="text-yellow-300 text-sm">Checking phone number...</p>}
              {form.phone.length === 10 && phoneExists && !checkingPhone && (
                <p className="text-red-400 text-sm">❌ Phone number is already registered</p>
              )}
              {form.phone.length === 10 && !phoneExists && !checkingPhone && (
                <p className="text-green-400 text-sm">✅ Phone number is available</p>
              )}
              {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="col-span-1 md:col-span-2 space-y-1">
              <input
                type="password"
                placeholder="Password"
                autoComplete="off"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              />
              <p className={`text-sm ${passwordValid ? 'text-green-400' : 'text-yellow-400'}`}>{passwordMsg}</p>
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="col-span-1 md:col-span-2 space-y-1">
              <input
                type="password"
                placeholder="Confirm Password"
                autoComplete="off"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              />
              {confirmPassword && form.password !== confirmPassword && (
                <p className="text-red-400 text-sm">❌ Passwords do not match</p>
              )}
              {form.password && confirmPassword && form.password === confirmPassword && (
                <p className="text-green-400 text-sm">✅ Passwords match</p>
              )}
              {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`col-span-1 md:col-span-2 text-white font-semibold py-3 rounded-lg transition duration-200 ease-in-out 
    bg-indigo-600 hover:bg-indigo-700 
    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </button>



          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
