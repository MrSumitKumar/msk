import React from 'react';
import { Helmet } from "react-helmet-async";
import {
  MapPin, ShieldCheck, CreditCard, Globe2, Laptop,
  BookOpenCheck, Users, GraduationCap, UserCheck,
  BrainCog, MessageCircleQuestion, BadgeCheck, Building2,
  ClipboardList, Landmark, FileCheck
} from 'lucide-react';

import about_hero from '../assets/about.png'

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - MSK</title>
        <meta name="description" content="Learn about MSK, your trusted platform for online and offline courses and certifications in tech, business, and education." />
        <link rel="canonical" href="https://msk.shikohabad.in/about" />
        <meta property="og:title" content="About MSK" />
        <meta property="og:description" content="Shikohabad's best computer training institute for digital skills and programming education." />
        <meta property="og:url" content="https://msk.shikohabad.in/about" />
      </Helmet>

      <div style={{ backgroundColor: 'hsl(224, 71%, 4%)' }} className="text-white min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">About Us</h1>
          </div>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
            <div className="md:w-1/2 space-y-6">
              <p className="text-lg text-gray-300">
                <strong className="text-blue-400">MSK's mission</strong> is to empower learners with flexible, industry-relevant education through both online and offline learning modes.
              </p>
              <p className="text-lg text-gray-300">
                <strong className="text-blue-400">Our vision</strong> is to make learning accessible and practical for all students, professionals, and educators across India.
              </p>
              <p className="text-lg text-gray-300">
                Based in <strong className="text-blue-400">Shikohabad, Uttar Pradesh</strong>, we serve learners nationwide.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img src={about_hero} alt="MSK Hero" className="max-w-md w-full rounded-xl shadow-xl" />
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-16">
            {[
              { icon: MapPin, title: "Share Location", desc: "Find training near your city.", color: "text-blue-400" },
              { icon: ShieldCheck, title: "Verified Courses", desc: "Trusted & certified programs.", color: "text-green-400" },
              { icon: CreditCard, title: "Easy Payments", desc: "Pay securely & flexibly.", color: "text-yellow-400" },
              { icon: Globe2, title: "Nationwide Reach", desc: "Learn from anywhere in India.", color: "text-purple-400" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg transition">
                <item.icon size={36} className={`mx-auto ${item.color}`} />
                <h3 className="font-semibold mt-4">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Online Services */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Our Online Services</h2>
            <p className="text-gray-400 mt-2">Empowering students and professionals through virtual learning.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { title: "Online Courses", icon: Laptop, desc: "Live and recorded courses for key technologies.", color: "text-blue-400" },
              { title: "E-Certification", icon: BookOpenCheck, desc: "Earn credentials after assessments.", color: "text-green-400" },
              { title: "Workshops", icon: Users, desc: "Live Zoom/Meet group training with mentors.", color: "text-pink-400" },
              { title: "Student Programs", icon: GraduationCap, desc: "Special programs for school/college students.", color: "text-yellow-400" },
              { title: "Interview Prep", icon: UserCheck, desc: "Mock interviews and resume tips.", color: "text-cyan-400" },
              { title: "Self-Improvement", icon: BrainCog, desc: "Focus, productivity, soft skills training.", color: "text-orange-400" },
              { title: "Doubt Solving", icon: MessageCircleQuestion, desc: "1:1 doubt clearing with instructors.", color: "text-lime-400" },
              { title: "Placement Guidance", icon: BadgeCheck, desc: "Help with job/internship placement.", color: "text-indigo-400" },
            ].map((s, i) => (
              <div key={i} className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg transition text-center">
                <s.icon size={40} className={`${s.color} mx-auto`} />
                <h4 className="text-lg font-semibold mt-4">{s.title}</h4>
                <p className="text-sm text-gray-400 mt-2">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Offline Services */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Offline Course Services</h2>
            <p className="text-gray-400 mt-2">In-person training at our Shikohabad center with practical labs.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Classroom Training",
                icon: Building2,
                desc: "On-campus instructor-led sessions with real-time support.",
                color: "text-teal-400"
              },
              {
                title: "Practical Lab Access",
                icon: ClipboardList,
                desc: "Hands-on practice in computer labs for real-world scenarios.",
                color: "text-rose-400"
              },
              {
                title: "Government Exams",
                icon: Landmark,
                desc: "Special coaching for CCC, Tally, and NIELIT certification.",
                color: "text-amber-400"
              },
              {
                title: "Printed Materials",
                icon: FileCheck,
                desc: "Booklets, assignments, and offline study kits included.",
                color: "text-violet-400"
              }
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg transition text-center">
                <item.icon size={40} className={`${item.color} mx-auto`} />
                <h4 className="text-lg font-semibold mt-4">{item.title}</h4>
                <p className="text-sm text-gray-400 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default About;
