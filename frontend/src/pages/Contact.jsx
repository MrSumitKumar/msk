import React from 'react';
import { Helmet } from "react-helmet-async";

const Contact = () => {
  return (
    <>

      <Helmet>
        <title>Contact - MSK Institute</title>
        <meta name="description" content="Reach out to MSK Institute for course inquiries, admissions, or support. We're happy to assist you." />
        <link rel="canonical" href="https://msk.shikohabad.in/contact" />

        <meta property="og:title" content="Contact MSK Institute" />
        <meta property="og:description" content="Get in touch with MSK Institute, Shikohabad's leading computer training center." />
        <meta property="og:url" content="https://msk.shikohabad.in/contact" />
      </Helmet>

      <h2>Contact Us</h2>
      <p>Email: contact@mskinstitute.com</p>
      <p>Phone: +91-XXXXXXXXXX</p>
    </>
  );
};

export default Contact;
