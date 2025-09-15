// src/pages/auth/ResetPassword.jsx
import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import SuccessScreen from "./SuccessScreen";
import { ThemeContext } from "../../context/ThemeContext";
import { KeyIcon } from "lucide-react";
import { Helmet } from "react-helmet-async";
import axios from "../../api/axios";

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // NEW
  const { theme } = useContext(ThemeContext);

  const [validations, setValidations] = useState({
    length: false,
    number: false,
    lowercase: false,
    uppercase: false,
    special: false,
    match: false
  });

  // Validate password
  const validatePassword = (password, confirm = "") => {
    const newValidations = {
      length: password.length >= 8,
      number: /\d/.test(password),
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password && confirm && password === confirm
    };
    setValidations(newValidations);
    return Object.values(newValidations).every(Boolean);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    validatePassword(password, newConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading

    // Validate password before submission
    if (!validatePassword(password, confirmPassword)) {
      setError("Please meet all password requirements");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`/auth/password/reset/${uidb64}/${token}/`, { password });
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.error || "Invalid or expired link.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (success) {
    return (
      <SuccessScreen
        title="Password Reset Successful!"
        message="✅ Your password has been updated successfully. You can now log in with your new password."
        buttonText="Go to Login"
        redirectTo="/login"
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Reset Password - MSK Institute</title>
        <meta
          name="description"
          content="Reset your MSK Institute account password securely."
        />
      </Helmet>

      <div
        className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, ${
                theme === "dark" ? "#3B82F6" : "#60A5FA"
              } 0%, transparent 50%), 
                           radial-gradient(circle at 80% 80%, ${
                             theme === "dark" ? "#8B5CF6" : "#A78BFA"
                           } 0%, transparent 50%)`
            }}
          ></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div
            className={`${
              theme === "dark"
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            } border rounded-2xl shadow-xl p-8 space-y-6`}
          >
            <div className="text-center">
              <div className="inline-block p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                <KeyIcon className="w-6 h-6 text-white" />
              </div>
              <h2
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Reset Password
              </h2>
              <p
                className={`mt-2 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Please enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    theme === "dark"
                      ? "bg-red-900/50 text-red-200"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {error}
                </div>
              )}

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-gray-800 text-white border-gray-700"
                      : "bg-white text-gray-900 border-gray-300"
                  } border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                />

                {/* Password Validations */}
                <div className="mt-2 space-y-1.5">
                  {[
                    { key: "length", label: "At least 8 characters" },
                    { key: "number", label: "At least one number" },
                    { key: "lowercase", label: "At least one lowercase letter" },
                    { key: "uppercase", label: "At least one uppercase letter" },
                    { key: "special", label: "At least one special character" }
                  ].map(({ key, label }) => (
                    <div className="flex items-center" key={key}>
                      <span
                        className={`mr-2 text-sm ${
                          validations[key]
                            ? theme === "dark"
                              ? "text-green-400"
                              : "text-green-500"
                            : theme === "dark"
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        {validations[key] ? "✓" : "○"}
                      </span>
                      <span
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-gray-800 text-white border-gray-700"
                      : "bg-white text-gray-900 border-gray-300"
                  } border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                />
                {confirmPassword && (
                  <div className="flex items-center mt-2">
                    <span
                      className={`mr-2 text-sm ${
                        validations.match
                          ? theme === "dark"
                            ? "text-green-400"
                            : "text-green-500"
                          : theme === "dark"
                          ? "text-red-400"
                          : "text-red-500"
                      }`}
                    >
                      {validations.match ? "✓" : "✕"}
                    </span>
                    <span
                      className={`text-xs ${
                        validations.match
                          ? theme === "dark"
                            ? "text-green-400"
                            : "text-green-500"
                          : theme === "dark"
                          ? "text-red-400"
                          : "text-red-500"
                      }`}
                    >
                      {validations.match
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
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
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
