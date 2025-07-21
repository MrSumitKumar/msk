import React from 'react';
import { Helmet } from "react-helmet-async";

const StudentDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Student Dashboard – MSK Institute</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="View your enrolled courses, progress, results, and certificate details from the MSK Institute Student Dashboard." />
        <link rel="canonical" href="https://msk.shikohabad.in/student-dashboard" />

        <meta property="og:title" content="Student Dashboard – MSK Institute" />
        <meta property="og:description" content="Access your personal dashboard to manage learning at MSK Institute." />
        <meta property="og:url" content="https://msk.shikohabad.in/student-dashboard" />
        <meta property="og:type" content="website" />
      </Helmet>


      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
        <p>Welcome, Student. View your profile, attendance, and results here.</p>
      </div>
    </>
  );
};

export default StudentDashboard;
