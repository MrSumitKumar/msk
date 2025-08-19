import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const AboutHero = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="text-center mb-16">
      <h1 className={`text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
        About MSK Institute
      </h1>
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
        <div className="lg:w-1/2 space-y-8 text-left">
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-3 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Our Mission
            </h3>
            <p className={`text-lg leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              To empower learners with flexible, industry-relevant education through both online and offline learning modes, making quality tech education accessible to everyone.
            </p>
          </div>
          
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-3 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              Our Vision
            </h3>
            <p className={`text-lg leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              To make learning accessible and practical for all students, professionals, and educators across India, bridging the gap between education and industry needs.
            </p>
          </div>
          
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-3 ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              Our Location
            </h3>
            <p className={`text-lg leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Based in <span className="font-semibold">Shikohabad, Uttar Pradesh</span>, we serve learners nationwide with our comprehensive training programs.
            </p>
          </div>
        </div>
        
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative">
            <div className={`absolute inset-0 rounded-2xl blur-2xl opacity-20 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                : 'bg-gradient-to-r from-blue-400 to-purple-400'
            }`}></div>
            <img 
              src="https://images.unsplash.com/photo-1626910771652-bcf463ae516b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHx0ZWFtJTIwb2ZmaWNlJTIwY29tcHV0ZXJzJTIwZWR1Y2F0aW9uJTIwdGVjaG5vbG9neXxlbnwwfDB8fGJsdWV8MTc1NTQ5NTY4OXww&ixlib=rb-4.1.0&q=85"
              alt="MSK Institute - Professional team working together in modern office, technology education, computer training institute. Photo by Nguyen Dang Hoang Nhu on Unsplash"
              className="relative max-w-md w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              style={{ width: '400px', height: '300px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;