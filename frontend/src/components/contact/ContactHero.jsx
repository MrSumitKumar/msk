import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ContactHero = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <section
      className={`relative bg-cover bg-center bg-no-repeat overflow-hidden py-20 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-950" : "bg-white"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${theme === 'dark' ? '#3B82F6' : '#60A5FA'} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${theme === 'dark' ? '#8B5CF6' : '#A78BFA'} 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Get in Touch with MSK Institute
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Ready to start your learning journey? We're here to help you every step of the way. 
            Contact us for course information, admissions, or any questions you may have.
          </p>
        </div>

        {/* Hero Image */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className={`absolute inset-0 rounded-3xl blur-3xl opacity-30 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                : 'bg-gradient-to-r from-blue-400 to-purple-400'
            }`}></div>
            <img 
              src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxjdXN0b21lciUyMHNlcnZpY2UlMjBzdXBwb3J0JTIwb2ZmaWNlJTIwcHJvZmVzc2lvbmFsJTIwY29udGFjdHxlbnwwfDB8fGJsdWV8MTc1NTQ5NjA3OXww&ixlib=rb-4.1.0&q=85"
              alt="Professional customer service representative at MSK Institute - contact support, modern office environment, friendly team. Photo by Icons8 Team on Unsplash"
              className="relative rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              style={{ width: '600px', height: '400px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;