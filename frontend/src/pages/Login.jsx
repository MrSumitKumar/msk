import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { toast } from 'react-toastify';
import { Helmet } from "react-helmet-async";
import { LogIn } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, user } = useAuth();

  if (user) { navigate("/") }

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    const success = await login(form.username, form.password);
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
          content="Access your MSK Institute account to view dashboard, courses, and progress. Secure login for students, teachers, and admins."
        />
        <link rel="canonical" href="https://msk.shikohabad.in/login" />
        <meta property="og:title" content="Login – MSK Institute Portal" />
        <meta
          property="og:description"
          content="Secure login to your MSK Institute account. For students, teachers, and administrators."
        />
        <meta property="og:url" content="https://msk.shikohabad.in/login" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="bg-gray-900 text-white rounded-xl shadow-lg w-full max-w-md p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Login to MSK Institute</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username / Email / Mobile
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter username, email or mobile"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200 font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
