import React, { useContext } from 'react';
import { Helmet } from "react-helmet-async";
import { ThemeContext } from "../context/ThemeContext";
import AboutHero from '../components/about/AboutHero';
import AboutFeatures from '../components/about/AboutFeatures';
import AboutOnlineServices from '../components/about/AboutOnlineServices';
import AboutOfflineServices from '../components/about/AboutOfflineServices';

const About = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Helmet>
        <title>About Us - MSK Institute</title>
        <meta name="description" content="Learn about MSK Institute, your trusted platform for online and offline courses and certifications in tech, business, and education." />
        <link rel="canonical" href="https://msk.shikohabad.in/about" />
        <meta property="og:title" content="About MSK Institute" />
        <meta property="og:description" content="Shikohabad's best computer training institute for digital skills and programming education." />
        <meta property="og:url" content="https://msk.shikohabad.in/about" />
      </Helmet>

      <div className={`min-h-screen py-16 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, ${theme === 'dark' ? '#3B82F6' : '#60A5FA'} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${theme === 'dark' ? '#8B5CF6' : '#A78BFA'} 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          {/* Hero Section */}
          <AboutHero />

          {/* Features Section */}
          <AboutFeatures />

          {/* Online Services Section */}
          <AboutOnlineServices />

          {/* Offline Services Section */}
          <AboutOfflineServices />

          {/* Call to Action */}
          <div className={`text-center py-16 px-8 rounded-3xl border ${
            theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Start Your Learning Journey?
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join thousands of students who have transformed their careers with MSK Institute. 
              Choose from our comprehensive online and offline programs designed for your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-500/50">
                Explore Courses
              </button>
              <button className={`px-8 py-4 border-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                theme === 'dark'
                  ? 'border-gray-600 text-white hover:bg-gray-800'
                  : 'border-gray-300 text-gray-900 hover:bg-gray-100'
              }`}>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;