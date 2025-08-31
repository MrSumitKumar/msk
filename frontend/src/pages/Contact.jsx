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
  {/* Title & Description */}
  <title>Contact - MSK Institute</title>
  <meta 
    name="description" 
    content="Contact MSK Institute, Shikohabad’s leading computer training and coding institute. Reach us for course inquiries, admissions, support, or collaboration opportunities." 
  />
  <meta 
    name="keywords" 
    content="contact MSK Institute, MSK Institute Shikohabad contact, admissions inquiry, computer training Shikohabad, coding institute support" 
  />
  <meta name="author" content="MSK Institute" />
  <meta name="robots" content="index, follow" />

  {/* Canonical */}
  <link rel="canonical" href="https://mskinstitute.in/contact" />

  {/* Open Graph */}
  <meta property="og:title" content="Contact MSK Institute" />
  <meta 
    property="og:description" 
    content="Get in touch with MSK Institute, Shikohabad's trusted institute for computer training, coding courses, and professional certifications." 
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mskinstitute.in/contact" />
  <meta property="og:image" content="https://mskinstitute.in/static/images/contact-msk-banner.jpg" />
  <meta property="og:locale" content="en_IN" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Contact MSK Institute" />
  <meta 
    name="twitter:description" 
    content="Reach out to MSK Institute in Shikohabad for course inquiries, admissions, or student support. We’re here to help you succeed." 
  />
  <meta name="twitter:image" content="https://mskinstitute.in/static/images/contact-msk-banner.jpg" />

  {/* Schema.org Structured Data */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "mainEntity": {
        "@type": "EducationalOrganization",
        "name": "MSK Institute",
        "url": "https://mskinstitute.in",
        "logo": "https://mskinstitute.in/static/images/msk-institute-logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-8393042166",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["English", "Hindi"]
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "MSK Institute, Main Road",
          "addressLocality": "Shikohabad",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "283135",
          "addressCountry": "India"
        }
      }
    })}
  </script>
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