import React from 'react';
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Rocket, BookOpenCheck, GraduationCap } from "lucide-react";
import HeroSection from '../components/HeroSection';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home - MSK Institute</title>
        <meta name="description" content="Join MSK Institute in Shikohabad for hands-on computer courses like Python, HTML, CSS, JavaScript, Excel, and more." />
        <link rel="canonical" href="https://msk.shikohabad.in/" />

        <meta property="og:title" content="MSK Institute - Learn Coding Practically" />
        <meta property="og:description" content="Practical computer education in Shikohabad. Learn coding, web development, and digital tools." />
        <meta property="og:url" content="https://msk.shikohabad.in/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="bg-gray-950 text-white min-h-screen">
        {/* Hero Section */}
        <HeroSection />


        {/* Highlights */}
        <section className="py-16 px-6 bg-gray-900">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <Rocket className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Project-Based Learning</h3>
              <p className="text-gray-400">
                Learn by doing with real-world projects that prepare you for the future.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <BookOpenCheck className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Complete Digital Courses</h3>
              <p className="text-gray-400">
                From MS-Office to advanced web development, we cover all essentials.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <GraduationCap className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Affordable & Accessible</h3>
              <p className="text-gray-400">
                Quality education for everyone—online and offline modes available.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-6 bg-gray-950">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose MSK Institute?</h2>
            <p className="text-gray-400 text-lg">
              We believe in empowering students through technology. Our curriculum is designed for practical outcomes—whether you're aiming for a job, a freelance career, or higher education.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-6 bg-blue-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="mb-6 text-lg">
            Join MSK Institute and unlock your full potential today.
          </p>
          <Link
            to="/register"
            className="inline-block px-6 py-3 bg-gray-950 hover:bg-gray-900 rounded-lg text-lg font-semibold transition"
          >
            Register Now
          </Link>
        </section>
      </div>


    </>
  );
};

export default Home;
