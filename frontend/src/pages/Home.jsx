import React, { useContext } from 'react';
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Rocket, BookOpenCheck, GraduationCap, ArrowRight, Play, Users, Award, BookOpen } from "lucide-react";
import { ThemeContext } from '../context/ThemeContext';
import Reviews from '../components/Reviews';
import InstallPWAButton from '../components/InstallPWAButton';
import codingImage from '../assets/laptop.webp';

const Home = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Helmet>
        {/* Title & Description */}
        <title>MSK Institute - Best Computer & Coding Courses in Shikohabad</title>
        <meta
          name="description"
          content="MSK Institute is Shikohabad’s leading computer training and coding institute. Learn Python, HTML, CSS, JavaScript, Excel, SQL, Django, and more through practical, hands-on courses."
        />
        <meta
          name="keywords"
          content="MSK Institute, computer courses Shikohabad, coding classes, Python training, web development Shikohabad, JavaScript courses, Excel training, best institute in Shikohabad"
        />
        <meta name="author" content="MSK Institute" />
        <meta name="robots" content="index, follow" />

        {/* Canonical */}
        <link rel="canonical" href="https://msk.shikohabad.in/" />

        {/* Open Graph */}
        <meta property="og:title" content="MSK Institute - Learn Coding Practically" />
        <meta
          property="og:description"
          content="Practical computer education in Shikohabad. Master coding, web development, Excel, and digital skills with MSK Institute."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://msk.shikohabad.in/" />
        <meta property="og:image" content="https://msk.shikohabad.in/static/images/msk-institute-banner.jpg" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MSK Institute - Learn Coding Practically" />
        <meta
          name="twitter:description"
          content="Join MSK Institute in Shikohabad for hands-on computer courses in coding, web development, and digital tools."
        />
        <meta name="twitter:image" content="https://msk.shikohabad.in/static/images/msk-institute-banner.jpg" />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "MSK Institute",
            "url": "https://msk.shikohabad.in",
            "logo": "https://msk.shikohabad.in/static/images/msk-institute-logo.png",
            "description": "MSK Institute is Shikohabad’s top computer and coding institute, offering practical courses in Python, HTML, CSS, JavaScript, Excel, SQL, and Django.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Shikohabad",
              "addressRegion": "Uttar Pradesh",
              "postalCode": "283135",
              "addressCountry": "India"
            },
            "sameAs": [
              "https://www.facebook.com/mskinstitute",
              "https://www.instagram.com/mskinstitute",
              "https://www.linkedin.com/company/mskinstitute"
            ]
          })}
        </script>
      </Helmet>


      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
        }`}>

        {/* Hero Section */}
        <section className={`relative overflow-hidden transition-colors duration-300 ${theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900'
            : 'bg-gradient-to-br from-blue-50 via-white to-indigo-100'
          }`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8 order-2 lg:order-1">
                <div className="space-y-4">
                  <h1 className={`text-4xl lg:text-6xl font-bold leading-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                    Learn to Code with{' '}
                    <span className={`transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                      MSK
                    </span>
                  </h1>

                  <p className={`text-lg leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                    }`}>
                    From Python and JavaScript to MS Office and digital marketing, we offer comprehensive courses designed for real-world success. Join thousands of students who've transformed their careers with MSK.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                      500+
                    </div>
                    <div className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Students Trained
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                      15+
                    </div>
                    <div className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Courses Available
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                      95%
                    </div>
                    <div className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Success Rate
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/courses"
                    className={`inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
                      }`}
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Explore Courses
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>

                  <Link
                    to="/about"
                    className={`inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg border-2 transition-all duration-300 transform hover:scale-105 ${theme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <Users className={`w-5 h-5 transition-colors duration-300 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`} />
                    <span className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Join 500+ happy students
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className={`w-5 h-5 transition-colors duration-300 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                      }`} />
                    <span className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Certified courses
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Content - Image */}
              <div className="relative order-1 lg:order-2">
                {/* Main Image */}
                <div className="relative z-10">
                  <img
                    src={codingImage}
                    alt="Students learning coding at MSK Institute"
                    className={`w-full h-auto rounded-2xl shadow-2xl transition-all duration-300 ${theme === 'dark' ? 'shadow-blue-500/20' : 'shadow-blue-500/20'
                      }`}
                    loading="eager"
                  />
                </div>

                {/* Floating Cards */}
                <div className={`absolute -top-6 -left-6 p-4 rounded-xl shadow-lg backdrop-blur-sm transition-colors duration-300 ${theme === 'dark'
                    ? 'bg-gray-800/80 border border-gray-700'
                    : 'bg-white/80 border border-gray-200'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'
                      }`}></div>
                    <span className={`text-sm font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                      Live Classes Available
                    </span>
                  </div>
                </div>

                <div className={`absolute -bottom-6 -right-6 p-4 rounded-xl shadow-lg backdrop-blur-sm transition-colors duration-300 ${theme === 'dark'
                    ? 'bg-gray-800/80 border border-gray-700'
                    : 'bg-white/80 border border-gray-200'
                  }`}>
                  <div className="text-center">
                    <div className={`text-2xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                      4.9★
                    </div>
                    <div className={`text-xs transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Student Rating
                    </div>
                  </div>
                </div>

                {/* Background Decoration */}
                <div className={`absolute inset-0 -z-10 transform translate-x-4 translate-y-4 rounded-2xl transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100/50'
                  }`}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={`py-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className={`text-3xl lg:text-4xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                Why Students Choose MSK
              </h2>
              <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                We provide practical, industry-relevant education that prepares you for real-world challenges
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`p-8 rounded-2xl text-center transition-all duration-300 hover:transform hover:scale-105 ${theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                  : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-lg'
                }`}>
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'
                  }`}>
                  <Rocket className={`w-8 h-8 transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                </div>
                <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                  Project-Based Learning
                </h3>
                <p className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Learn by doing with real-world projects that prepare you for the industry and build your portfolio.
                </p>
              </div>

              <div className={`p-8 rounded-2xl text-center transition-all duration-300 hover:transform hover:scale-105 ${theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                  : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-lg'
                }`}>
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100'
                  }`}>
                  <BookOpenCheck className={`w-8 h-8 transition-colors duration-300 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                </div>
                <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                  Complete Digital Courses
                </h3>
                <p className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  From MS-Office to advanced web development, we cover all essentials for digital literacy.
                </p>
              </div>

              <div className={`p-8 rounded-2xl text-center transition-all duration-300 hover:transform hover:scale-105 ${theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                  : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-lg'
                }`}>
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'
                  }`}>
                  <GraduationCap className={`w-8 h-8 transition-colors duration-300 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                </div>
                <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                  Affordable & Accessible
                </h3>
                <p className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Quality education for everyone—online and offline modes available with flexible payment options.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className={`py-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'
          }`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={`text-3xl lg:text-4xl font-bold mb-8 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
              Why Choose MSK Institute?
            </h2>
            <p className={`text-lg leading-relaxed mb-8 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
              We believe in empowering students through technology. Our curriculum is designed for practical outcomes—whether you're aiming for a job, a freelance career, or higher education. Located in the heart of Shikohabad, we've been transforming lives through quality education.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                  5+
                </div>
                <div className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Years Experience
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>
                  100%
                </div>
                <div className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Placement Support
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                  24/7
                </div>
                <div className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Student Support
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                  ₹5K+
                </div>
                <div className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Starting from
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <Reviews /> */}

        <InstallPWAButton />

        {/* Call to Action */}
        <section className={`py-24 lg:py-32 text-center transition-colors duration-300 ${theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white'
            : 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 text-gray-900'
          }`}>
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
              Ready to Start Your Learning Journey?
            </h2>
            <p className={`text-xl sm:text-2xl lg:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
              }`}>
              Join MSK Institute today and unlock your full potential with our comprehensive courses and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className={`inline-flex items-center justify-center px-10 py-5 rounded-xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl min-w-[200px] ${theme === 'dark'
                    ? 'bg-white hover:bg-gray-50 text-slate-900 hover:text-slate-800 shadow-slate-900/40 hover:shadow-slate-900/60'
                    : 'bg-slate-900 hover:bg-slate-800 text-white hover:text-gray-100 shadow-slate-900/30 hover:shadow-slate-900/50'
                  }`}
              >
                Register Now
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
              <Link
                to="/contact"
                className={`inline-flex items-center justify-center px-10 py-5 rounded-xl text-xl font-bold border-3 transition-all duration-300 transform hover:scale-105 min-w-[200px] ${theme === 'dark'
                    ? 'border-slate-400 text-slate-300 hover:bg-slate-400 hover:text-slate-900 hover:border-slate-300'
                    : 'border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-600'
                  }`}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
