import React, { useContext } from 'react';
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ThemeContext } from '../../context/ThemeContext';

const ContactCards = () => {
  const { theme } = useContext(ThemeContext);

  const cards = [
    { 
      icon: Mail, 
      title: "Email Us", 
      text: "mskshikohabad@gmail.com",
      href: "mailto:mskshikohabad@gmail.com",
      color: "from-blue-500 to-blue-600"
    },
    { 
      icon: Phone, 
      title: "Call Us", 
      text: "+91 83930 42166",
      href: "tel:+918393042166",
      color: "from-green-500 to-green-600"
    },
    { 
      icon: MapPin, 
      title: "Visit Us", 
      text: "Shikohabad, Uttar Pradesh",
      href: "https://maps.google.com/?q=MSK+Institute+Shikohabad",
      color: "from-red-500 to-red-600"
    },
    { 
      icon: Clock, 
      title: "Working Hours", 
      text: "Mon - Sat: 9:00 AM - 6:00 PM",
      href: null,
      color: "from-purple-500 to-purple-600"
    },
  ];

  return (
    <section
      className={`py-20 px-6 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          We'd Love to Connect With You
        </h2>
        <p
          className={`text-lg mb-16 max-w-2xl mx-auto ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Have a question or need help? Reach out anytime — our dedicated team is here to assist you on your learning journey.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            const cardContent = (
              <div
                className={`group p-8 rounded-2xl shadow-lg border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  theme === "dark"
                    ? "bg-gray-900 border-gray-700 hover:border-gray-600 shadow-gray-900/50"
                    : "bg-white border-gray-200 hover:border-gray-300 shadow-gray-200/50"
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h4 className={`font-bold text-xl mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {card.title}
                </h4>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {card.text}
                </p>
              </div>
            );

            return card.href ? (
              <a
                key={index}
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : '_self'}
                rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block"
              >
                {cardContent}
              </a>
            ) : (
              <div key={index}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactCards;