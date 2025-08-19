import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Users, Award, BookOpen } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import codingImage from "../assets/laptop.webp";

const HeroSection = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <section className={`relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-100'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-blue-900/50 text-blue-300 border border-blue-700' 
                : 'bg-blue-100 text-blue-700 border border-blue-200'
            }`}>
              <Award className="w-4 h-4 mr-2" />
              Shikohabad's #1 Computer Training Institute
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className={`text-4xl lg:text-6xl font-bold leading-tight transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Learn{" "}
                <span className={`transition-colors duration-300 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Coding
                </span>{" "}
                Practically
              </h1>
              <p className={`text-xl lg:text-2xl transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Master programming, web development, and digital skills with hands-on projects and expert guidance.
              </p>
            </div>

            {/* Description */}
            <p className={`text-lg leading-relaxed transition-colors duration-300 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
            }`}>
              From Python and JavaScript to MS Office and digital marketing, we offer comprehensive courses designed for real-world success. Join thousands of students who've transformed their careers with MSK.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  500+
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Students Trained
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  15+
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Courses Available
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  95%
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Success Rate
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/courses"
                className={`inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
                }`}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Courses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                to="/about"
                className={`inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  theme === 'dark' 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Users className={`w-5 h-5 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`text-sm transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Join 500+ happy students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className={`w-5 h-5 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <span className={`text-sm transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Certified courses
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative z-10">
              <img
                src={codingImage}
                alt="Students learning coding at MSK Institute"
                className={`w-full h-auto rounded-2xl shadow-2xl transition-all duration-300 ${
                  theme === 'dark' ? 'shadow-blue-500/20' : 'shadow-blue-500/20'
                }`}
                loading="eager"
              />
            </div>

            {/* Floating Cards */}
            <div className={`absolute -top-6 -left-6 p-4 rounded-xl shadow-lg backdrop-blur-sm transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-gray-800/80 border border-gray-700' 
                : 'bg-white/80 border border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-green-400' : 'bg-green-500'
                }`}></div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Live Classes Available
                </span>
              </div>
            </div>

            <div className={`absolute -bottom-6 -right-6 p-4 rounded-xl shadow-lg backdrop-blur-sm transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-gray-800/80 border border-gray-700' 
                : 'bg-white/80 border border-gray-200'
            }`}>
              <div className="text-center">
                <div className={`text-2xl font-bold transition-colors duration-300 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  4.9★
                </div>
                <div className={`text-xs transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Student Rating
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className={`absolute inset-0 -z-10 transform translate-x-4 translate-y-4 rounded-2xl transition-colors duration-300 ${
              theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100/50'
            }`}></div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className={`w-full h-16 transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-900' : 'text-white'
          }`}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
          ></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="currentColor"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;