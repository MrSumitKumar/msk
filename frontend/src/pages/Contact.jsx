import React from 'react';
import { Helmet } from "react-helmet-async";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact - MSK</title>
        <meta name="description" content="Reach out to MSK for course inquiries, admissions, or support. We're happy to assist you." />
        <link rel="canonical" href="https://msk.shikohabad.in/contact" />
        <meta property="og:title" content="Contact MSK" />
        <meta property="og:description" content="Get in touch with MSK, Shikohabad's leading computer training center." />
        <meta property="og:url" content="https://msk.shikohabad.in/contact" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-cover bg-center bg-no-repeat overflow-hidden h-[600px] flex items-center">
        <div className="absolute inset-0 bg-[hsl(224,71%,4%)] bg-opacity-80"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-white grid grid-cols-1 md:grid-cols-2 gap-12 z-10">
          {/* Contact Details */}
          <div>
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-300 mb-6">
              Reach out for inquiries, support, or career guidance.
            </p>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <Mail className="text-xl mt-1 text-blue-400" />
                <div>
                  <p className="text-sm">Email</p>
                  <p className="font-semibold">info@mskinstitute.in</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="text-xl mt-1 text-blue-400" />
                <div>
                  <p className="text-sm">Phone</p>
                  <p className="font-semibold">+91 98765 43210</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="text-xl mt-1 text-blue-400" />
                <div>
                  <p className="text-sm">Location</p>
                  <p className="font-semibold">Shikohabad, UP</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="text-xl mt-1 text-blue-400" />
                <div>
                  <p className="text-sm">Working Hours</p>
                  <p className="font-semibold">Mon - Sat: 9am - 6pm</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="bg-[hsl(224,71%,4%)] text-white shadow-2xl rounded-lg p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="bg-transparent border border-gray-600 p-3 rounded w-full text-white placeholder-gray-400" />
                <input type="text" placeholder="Last Name" className="bg-transparent border border-gray-600 p-3 rounded w-full text-white placeholder-gray-400" />
              </div>
              <input type="email" placeholder="Email Address" className="bg-transparent border border-gray-600 p-3 rounded w-full text-white placeholder-gray-400" />
              <input type="text" placeholder="Subject" className="bg-transparent border border-gray-600 p-3 rounded w-full text-white placeholder-gray-400" />
              <textarea rows="4" placeholder="Your Message" className="bg-transparent border border-gray-600 p-3 rounded w-full text-white placeholder-gray-400"></textarea>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold">
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="bg-[hsl(224,71%,4%)] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">We’d love to connect with you</h2>
          <p className="text-gray-400 mb-12 max-w-xl mx-auto">Have a question or need help? Reach out anytime.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[hsl(224,71%,6%)] p-6 rounded-lg shadow border border-gray-700">
              <Mail className="text-blue-400 text-2xl mb-2" />
              <h4 className="font-semibold mb-1">Email Us</h4>
              <p className="text-sm text-gray-300">info@mskinstitute.in</p>
            </div>
            <div className="bg-[hsl(224,71%,6%)] p-6 rounded-lg shadow border border-gray-700">
              <Phone className="text-blue-400 text-2xl mb-2" />
              <h4 className="font-semibold mb-1">Call Us</h4>
              <p className="text-sm text-gray-300">+91 98765 43210</p>
            </div>
            <div className="bg-[hsl(224,71%,6%)] p-6 rounded-lg shadow border border-gray-700">
              <MapPin className="text-blue-400 text-2xl mb-2" />
              <h4 className="font-semibold mb-1">Visit</h4>
              <p className="text-sm text-gray-300">Shikohabad, UP</p>
            </div>
            <div className="bg-[hsl(224,71%,6%)] p-6 rounded-lg shadow border border-gray-700">
              <Clock className="text-blue-400 text-2xl mb-2" />
              <h4 className="font-semibold mb-1">Hours</h4>
              <p className="text-sm text-gray-300">Mon - Sat: 9am - 6pm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[400px] bg-[hsl(224,71%,4%)]">
        <iframe
          title="MSK Map"
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.909547640067!2d78.59143387521978!3d26.75752767671588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3974a7f8cfbdad17%3A0xd6935c9471d8a7e0!2sShikohabad%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1721000000000"
        ></iframe>
      </section>
    </>
  );
};

export default Contact;
