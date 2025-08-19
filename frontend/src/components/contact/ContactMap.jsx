import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ContactMap = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <section
      className={`w-full h-[500px] relative overflow-hidden ${
        theme === "dark" ? "bg-gray-950" : "bg-gray-100"
      }`}
    >
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className={`absolute top-4 left-4 px-4 py-2 rounded-lg shadow-lg ${
          theme === 'dark' 
            ? 'bg-gray-900/90 text-white border border-gray-700' 
            : 'bg-white/90 text-gray-900 border border-gray-200'
        }`}>
          <h3 className="font-semibold text-sm">MSK Institute</h3>
          <p className="text-xs opacity-75">Shikohabad, Uttar Pradesh</p>
        </div>
      </div>
      
      <iframe
        title="MSK Institute Location"
        className="w-full h-full border-0 transition-opacity duration-300"
        loading="lazy"
        allowFullScreen
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3551.898758865274!2d78.57903227475175!3d27.096487976538132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39744bce0745fc55%3A0xaca626641b821c20!2sMSK%20Institute!5e0!3m2!1sen!2sin!4v1755221963148!5m2!1sen!2sin"
      ></iframe>
    </section>
  );
};

export default ContactMap;