import React, { useContext } from 'react';
import { Helmet } from "react-helmet-async";
import { ThemeContext } from "../context/ThemeContext";
import ContactMap from '../components/contact/ContactMap';
import ContactHero from '../components/contact/ContactHero';
import ContactInfo from '../components/contact/ContactInfo';
import ContactForm from '../components/contact/ContactForm';
import ContactCards from '../components/contact/ContactCards';

const Contact = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Helmet>
        <title>Contact - MSK Institute</title>
        <meta
          name="description"
          content="Contact MSK Institute, Shikohabad's premier computer training center. Inquire about our courses, admissions, or support."
        />
        <link rel="canonical" href="https://mskinstitute.in/contact" />
        <meta property="og:title" content="Contact MSK Institute" />
        <meta
          property="og:description"
          content="Get in touch with MSK Institute, Shikohabad's trusted computer education and coding skills training center."
        />
        <meta property="og:url" content="https://mskinstitute.in/contact" />
      </Helmet>

      {/* Map Section */}
      <ContactMap />

      {/* Hero Section with Image */}
      <ContactHero />

      {/* Contact Info and Form Section */}
      <section
        className={`py-20 transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Details */}
          <div className="flex items-center">
            <ContactInfo />
          </div>

          {/* Contact Form */}
          <div className="flex items-center">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <ContactCards />
    </>
  );
};

export default Contact;