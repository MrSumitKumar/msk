import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2 } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const SuccessScreen = ({ title, message, buttonText, redirectTo }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Helmet>
        <title>{title} - MSK Institute</title>
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
          } border rounded-2xl shadow-xl p-8 text-center`}>
            {/* Success Icon with Gradient Background */}
            <div className="inline-block p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6 animate-bounce">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>

            <h2 className={`text-2xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              {title}
            </h2>

            <p className={`mb-8 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {message}
            </p>

            <Link
              to={redirectTo}
              className="inline-block w-full px-6 py-3 rounded-lg font-semibold 
                       bg-gradient-to-r from-blue-600 to-purple-600 
                       hover:from-blue-700 hover:to-purple-700 
                       text-white transition-all duration-200 
                       transform hover:scale-105 
                       focus:ring-4 focus:ring-blue-500/50"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessScreen;
