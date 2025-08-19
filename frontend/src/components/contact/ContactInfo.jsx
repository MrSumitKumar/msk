import React, { useContext } from 'react';
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ThemeContext } from '../../context/ThemeContext';

const ContactInfo = () => {
  const { theme } = useContext(ThemeContext);

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: "mskshikohabad@gmail.com",
      href: "mailto:mskshikohabad@gmail.com",
      color: "text-blue-500"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 83930 42166",
      href: "tel:+918393042166",
      color: "text-green-500"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Near Subhash Park, Station Road, Shikohabad, Uttar Pradesh 283141",
      href: "https://maps.google.com/?q=MSK+Institute+Shikohabad",
      color: "text-red-500"
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon - Sat: 9:00 AM - 6:00 PM",
      href: null,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2
          className={`text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
        >
          Get in Touch
        </h2>
        <p
          className={`text-lg leading-relaxed ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Whether you're interested in learning to code, improving your computer
          skills, or exploring career opportunities — we're here to help you achieve your goals.
        </p>
      </div>
      
      <div className="space-y-6">
        {contactItems.map((item, index) => {
          const IconComponent = item.icon;
          const content = (
            <div className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
              theme === 'dark' 
                ? 'hover:bg-gray-800/50' 
                : 'hover:bg-gray-50'
            }`}>
              <div className={`p-3 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800' 
                  : 'bg-gray-100'
              }`}>
                <IconComponent className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.label}
                </p>
                <p
                  className={`font-semibold text-lg ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.value}
                </p>
              </div>
            </div>
          );

          return item.href ? (
            <a
              key={index}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : '_self'}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="block"
            >
              {content}
            </a>
          ) : (
            <div key={index}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactInfo;