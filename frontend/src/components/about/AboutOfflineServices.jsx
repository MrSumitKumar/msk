import React, { useContext } from 'react';
import { Building2, ClipboardList, Landmark, FileCheck } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const AboutOfflineServices = () => {
  const { theme } = useContext(ThemeContext);

  const services = [
    {
      title: "Classroom Training",
      icon: Building2,
      desc: "On-campus instructor-led sessions with real-time support and interactive learning.",
      color: "from-teal-500 to-teal-600"
    },
    {
      title: "Practical Lab Access",
      icon: ClipboardList,
      desc: "Hands-on practice in well-equipped computer labs for real-world scenarios.",
      color: "from-rose-500 to-rose-600"
    },
    {
      title: "Government Exams",
      icon: Landmark,
      desc: "Special coaching for CCC, Tally, NIELIT certification and other government exams.",
      color: "from-amber-500 to-amber-600"
    },
    {
      title: "Printed Materials",
      icon: FileCheck,
      desc: "Comprehensive booklets, assignments, and offline study kits included with courses.",
      color: "from-violet-500 to-violet-600"
    }
  ];

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Offline Course Services
        </h2>
        <p className={`text-lg max-w-3xl mx-auto ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          In-person training at our state-of-the-art Shikohabad center with practical labs and hands-on learning experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <div
              key={index}
              className={`group p-8 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                theme === 'dark'
                  ? 'bg-gray-900/50 border-gray-700 hover:border-gray-600 shadow-gray-900/50'
                  : 'bg-white/50 border-gray-200 hover:border-gray-300 shadow-gray-200/50'
              }`}
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <h4 className={`text-xl font-semibold mb-4 text-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {service.title}
              </h4>
              <p className={`text-center leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {service.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutOfflineServices;