// src/pages/auth/ForgotPassword.jsx

import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MailIcon, KeyIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "../../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // Clear any previous success state when component mounts
    setSuccess(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/auth/password/forgot/", { email });
      setSuccess(true);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(error.response?.data?.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-950" : "bg-gray-50"
      }`}>
        <div className="max-w-md w-full text-center">
          <div className={`p-8 rounded-2xl border ${
            theme === "dark" 
              ? "bg-gray-900 border-gray-800" 
              : "bg-white border-gray-200"
          } shadow-xl`}>
            <div className="inline-block p-3 rounded-full bg-green-100 mb-4">
              <svg 
                className="w-8 h-8 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              Reset Link Sent!
            </h2>
            <p className={`mb-6 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              📩 Please check your email. We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password - MSK Institute</title>
        <meta
          name="description"
          content="Reset your MSK Institute account password. We'll send you a secure link to reset your password."
        />
      </Helmet>

      <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-950" : "bg-gray-50"
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, ${theme === 'dark' ? '#3B82F6' : '#60A5FA'} 0%, transparent 50%), 
                           radial-gradient(circle at 80% 80%, ${theme === 'dark' ? '#8B5CF6' : '#A78BFA'} 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className={`${
            theme === "dark"
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-200"
          } border rounded-2xl shadow-xl p-8 space-y-6`}>
            <div className="text-center">
              <div className="inline-block p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                <KeyIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                Forgot Password?
              </h2>
              <p className={`mt-2 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                No worries! Enter your email and we'll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-gray-800 text-white border-gray-700"
                        : "bg-white text-gray-900 border-gray-300"
                    } border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-500/50 ${
                  loading
                    ? "opacity-50 cursor-not-allowed bg-gray-400"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <div className="text-center">
                <Link 
                  to="/login"
                  className={`text-sm font-medium hover:underline ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}


export default ForgotPassword;
