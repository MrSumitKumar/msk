import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import { Helmet } from "react-helmet-async";
import LoginCard from '../../components/auth/LoginCard';
import LoginForm from '../../components/auth/LoginForm';

const Login = () => {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const { login, user } = useAuth();

  if (user) { navigate("/") }

  const handleLogin = async (username, password) => {
    setLoading(true);
    const success = await login(username, password);
    setLoginSuccess(success);
    setLoading(false);

    if (success) {
      toast.success('Login successful!');
    } else {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  useEffect(() => {
    if (loginSuccess && user?.role) {
      navigate(`/${user.role}-dashboard`);
    }
  }, [loginSuccess, user, navigate]);

  return (
    <>
      <Helmet>
        <title>Login - MSK Institute</title>
        <meta
          name="description"
          content="Access your MSK account to view dashboard, courses, and progress. Secure login for students, teachers, and admins."
        />
        <link rel="canonical" href="https://msk.shikohabad.in/login" />
        <meta property="og:title" content="Login – MSK Portal" />
        <meta
          property="og:description"
          content="Secure login to your MSK account. For students, teachers, and administrators."
        />
        <meta property="og:url" content="https://msk.shikohabad.in/login" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, ${theme === 'dark' ? '#3B82F6' : '#60A5FA'} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${theme === 'dark' ? '#8B5CF6' : '#A78BFA'} 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative z-10">
          <LoginCard>
            <LoginForm onSubmit={handleLogin} loading={loading} />
          </LoginCard>
        </div>
      </div>
    </>
  );
};

export default Login;