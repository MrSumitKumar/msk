import React, { useContext } from 'react';
import { MapPin, ShieldCheck, CreditCard, Globe2 } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const AboutFeatures = () => {
  const { theme } = useContext(ThemeContext);

  const features = [
    { 
      icon: MapPin, 
      title: "Share Location", 
      desc: "Find training near your city with our location-based services.", 
      color: "from-blue-500 to-blue-600",
      iconColor: "text-blue-500"
    },
    { 
      icon: ShieldCheck, 
      title: "Verified Courses", 
      desc: "Trusted & certified programs with industry recognition.", 
      color: "from-green-500 to-green-600",
      iconColor: "text-green-500"
    },
    { 
      icon: CreditCard, 
      title: "Easy Payments", 
      desc: "Pay securely & flexibly with multiple payment options.", 
      color: "from-yellow-500 to-yellow-600",
      iconColor: "text-yellow-500"
    },
    { 
      icon: Globe2, 
      title: "Nationwide Reach", 
      desc: "Learn from anywhere in India with our online platform.", 
      color: "from-purple-500 to-purple-600",
      iconColor: "text-purple-500"
    },
  ];

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Why Choose MSK Institute
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          We provide comprehensive learning solutions with modern facilities and expert guidance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className={`group p-8 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                theme === 'dark'
                  ? 'bg-gray-900/50 border-gray-700 hover:border-gray-600 shadow-gray-900/50'
                  : 'bg-white/50 border-gray-200 hover:border-gray-300 shadow-gray-200/50'
              }`}
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 text-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {item.title}
              </h3>
              <p className={`text-center leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutFeatures;