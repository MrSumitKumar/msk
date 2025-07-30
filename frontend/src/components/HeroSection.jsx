import React from "react";
import { Link } from "react-router-dom";
import codingImage from "../assets/laptop.webp"; // replace or comment out if not using

const HeroSection = () => {
  const imageExists = Boolean(codingImage); // Conditional check for image

  return (
    <section className="min-h-screen w-full bg-gray-950 text-white flex items-center px-4 md:px-10 py-10">
      <div
        className={`flex flex-col-reverse ${
          imageExists ? "md:flex-row" : "flex-col"
        } items-center justify-between gap-8 w-full max-w-7xl mx-auto`}
      >
        {/* Left Content */}
        <div className={`text-center md:text-left ${imageExists ? "w-full md:w-1/2" : "w-full"}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Learn to Code with <span className="text-blue-500">MSK</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8">
            Join hands-on courses in Python, Web Development, MS-Office & more. Designed for beginners to advance learners.
          </p>
          <Link
            to="/register"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition duration-300"
          >
            Get Started
          </Link>
        </div>

        {/* Right Image (Conditional) */}
        {imageExists && (
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={codingImage}
              alt="Coding Illustration"
              className="max-w-full h-auto md:max-h-[450px] object-contain drop-shadow-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
