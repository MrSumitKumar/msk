import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ContactForm = () => {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const inputClasses = `p-3 rounded-lg w-full placeholder-gray-400 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    theme === "dark"
      ? "bg-gray-800 border border-gray-600 text-white focus:bg-gray-700"
      : "bg-white border border-gray-300 text-gray-900 focus:bg-gray-50"
  }`;

  return (
    <div
      className={`shadow-2xl rounded-xl p-8 border transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700 text-white shadow-gray-900/50"
          : "bg-white border-gray-200 text-gray-900 shadow-gray-200/50"
      }`}
    >
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Send a Message
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className={inputClasses}
              required
            />
          </div>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className={inputClasses}
            required
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What is this about?"
            className={inputClasses}
            required
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us more about your inquiry..."
            className={inputClasses}
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-500/50"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;