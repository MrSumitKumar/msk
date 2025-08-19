import React, { useContext } from 'react';
import { 
  Laptop, BookOpenCheck, Users, GraduationCap, 
  UserCheck, BrainCog, MessageCircleQuestion, BadgeCheck 
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const AboutOnlineServices = () => {
  const { theme } = useContext(ThemeContext);

  const services = [
    { 
      title: "Online Courses", 
      icon: Laptop, 
      desc: "Live and recorded courses for key technologies with expert instructors.", 
      color: "from-blue-500 to-blue-600" 
    },
    { 
      title: "E-Certification", 
      icon: BookOpenCheck, 
      desc: "Earn industry-recognized credentials after comprehensive assessments.", 
      color: "from-green-500 to-green-600" 
    },
    { 
      title: "Workshops", 
      icon: Users, 
      desc: "Live interactive group training sessions with experienced mentors.", 
      color: "from-pink-500 to-pink-600" 
    },
    { 
      title: "Student Programs", 
      icon: GraduationCap, 
      desc: "Special programs designed for school and college students.", 
      color: "from-yellow-500 to-yellow-600" 
    },
    { 
      title: "Interview Prep", 
      icon: UserCheck, 
      desc: "Mock interviews, resume building, and career guidance sessions.", 
      color: "from-cyan-500 to-cyan-600" 
    },
    { 
      title: "Self-Improvement", 
      icon: BrainCog, 
      desc: "Focus, productivity, and soft skills training for personal growth.", 
      color: "from-orange-500 to-orange-600" 
    },
    { 
      title: "Doubt Solving", 
      icon: MessageCircleQuestion, 
      desc: "One-on-one doubt clearing sessions with expert instructors.", 
      color: "from-lime-500 to-lime-600" 
    },
    { 
      title: "Placement Guidance", 
      icon: BadgeCheck, 
      desc: "Comprehensive help with job and internship placement support.", 
      color: "from-indigo-500 to-indigo-600" 
    },
  ];

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Our Online Services
        </h2>
        <p className={`text-lg max-w-3xl mx-auto ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Empowering students and professionals through comprehensive virtual learning experiences with cutting-edge technology and expert guidance.
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

export default AboutOnlineServices;