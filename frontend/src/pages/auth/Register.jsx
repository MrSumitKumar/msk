import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';
import axios from '../../api/axios';
import { Helmet } from "react-helmet-async";
import RegisterCard from '../../components/auth/RegisterCard';
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  // Parse referral parameters from URL
  const params = new URLSearchParams(location.search);
  const referralUsername = params.get('ref');
  const referralPosition = params.get('pos');

  const [loading, setLoading] = useState(false);
  const [sponsorDetails, setSponsorDetails] = useState(null);

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // If referral username exists in URL, validate sponsor
  useEffect(() => {
    if (referralUsername) {
      checkSponsor(referralUsername);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralUsername]);

  // Sponsor validation
  const checkSponsor = async (username) => {
    if (!username) return;
    try {
      const response = await axios.post('/auth/check-sponsor/', { username });
      if (response.data.exists) {
        setSponsorDetails(response.data.details);
      }
    } catch (error) {
      console.error('Error checking sponsor:', error);
    }
  };

  // Form validation
  const validateForm = async (formData) => {
    const newErrors = {};

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else {
      try {
        const response = await axios.post('/auth/check-email/', { email: formData.email });
        if (response.data.exists) {
          newErrors.email = 'Email already registered';
        }
      } catch { }
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    } else {
      try {
        const response = await axios.post('/auth/check-phone/', { phone: formData.phone });
        if (response.data.exists) {
          newErrors.phone = 'Phone number already registered';
        }
      } catch { }
    }

    // Passwords
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      if (formData.password.length < 8)
        newErrors.password = 'Password must be at least 8 characters long';
      if (!/\d/.test(formData.password))
        newErrors.password = 'Password must contain at least one digit';
      if (!/[a-z]/.test(formData.password))
        newErrors.password = 'Password must contain at least one lowercase letter';
      if (!/[A-Z]/.test(formData.password))
        newErrors.password = 'Password must contain at least one uppercase letter';
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
        newErrors.password = 'Password must contain at least one special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Basic required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';

    // Referral-specific validation
    if (referralUsername || formData.isReferral) {
      if (!formData.sponsorUsername) {
        newErrors.sponsorUsername = 'Sponsor username is required';
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (formData) => {
    if (!(await validateForm(formData))) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      // Build payload
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        sponsor_username: referralUsername || formData.sponsorUsername || '',
        position: (referralPosition || formData.position || null)?.toUpperCase() || null,
        auto_placement: (!!(referralUsername || formData.sponsorUsername)) && !referralPosition && !formData.position,
      };

      const response = await axios.post('/auth/register/', payload);

      if (response.data.success) {
        toast.success('Registration successful!');
        navigate('/login');
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        {/* Title & Description */}
        <title>Register - MSK Institute</title>
        <meta
          name="description"
          content="Register at MSK Institute to access computer courses, coding classes, and track your learning progress. Secure sign-up for students, teachers, and admins."
        />
        <meta
          name="keywords"
          content="MSK Institute register, signup MSK Institute, student registration, teacher account creation, join MSK Shikohabad"
        />
        <meta name="author" content="MSK Institute" />

        {/* Prevent indexing (recommended for registration pages) */}
        <meta name="robots" content="noindex, nofollow" />

        {/* Canonical */}
        <link rel="canonical" href="https://msk.shikohabad.in/register" />

        {/* Open Graph */}
        <meta property="og:title" content="Register – MSK Institute Portal" />
        <meta
          property="og:description"
          content="Sign up securely at MSK Institute. For students, teachers, and administrators to join our learning community."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://msk.shikohabad.in/register" />
        <meta property="og:image" content="https://msk.shikohabad.in/static/images/msk-register-banner.jpg" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Register – MSK Institute Portal" />
        <meta
          name="twitter:description"
          content="Create your MSK Institute account to enroll in computer courses, coding classes, and certifications."
        />
        <meta name="twitter:image" content="https://msk.shikohabad.in/static/images/msk-register-banner.jpg" />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Register - MSK Institute",
            "url": "https://msk.shikohabad.in/register",
            "description": "Registration page for MSK Institute students, teachers, and admins to join and access courses.",
            "potentialAction": {
              "@type": "RegisterAction",
              "target": "https://msk.shikohabad.in/register"
            },
            "publisher": {
              "@type": "EducationalOrganization",
              "name": "MSK Institute",
              "url": "https://msk.shikohabad.in"
            }
          })}
        </script>
      </Helmet>


      <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
        }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, ${theme === 'dark' ? '#3B82F6' : '#60A5FA'} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${theme === 'dark' ? '#8B5CF6' : '#A78BFA'} 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative z-10">
          <RegisterCard>
            <RegisterForm
              onSubmit={handleSubmit}
              loading={loading}
              referralUsername={referralUsername}
              referralPosition={referralPosition}
              sponsorDetails={sponsorDetails}
              setSponsorDetails={setSponsorDetails}
            />
          </RegisterCard>
        </div>
      </div>
    </>
  );
};

export default Register;