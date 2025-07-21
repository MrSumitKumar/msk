import React from 'react';
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - MSK Institute</title>
        <meta name="description" content="Learn about MSK Institute, Shikohabad's trusted computer education provider for web development, Excel, Python, and more." />
        <link rel="canonical" href="https://msk.shikohabad.in/about" />

        <meta property="og:title" content="About MSK Institute" />
        <meta property="og:description" content="Shikohabad's best computer training institute for digital skills and programming education." />
        <meta property="og:url" content="https://msk.shikohabad.in/about" />
      </Helmet>

      <h2>About Us</h2>
      <p>MSK Institute provides hands-on, career-focused training in web development, digital literacy, and more.</p>
    </>
  );
};

export default About;
