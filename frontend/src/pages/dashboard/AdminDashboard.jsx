import React from 'react';
import { Helmet } from "react-helmet-async";

const AdminDashboard = () => {
  return (
    <>

      <Helmet>
        <title>Admin Dashboard – MSK Institute</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Manage all courses, staff, students, and institute activities from the MSK Institute Admin Dashboard." />
        <link rel="canonical" href="https://msk.shikohabad.in/admin-dashboard" />

        <meta property="og:title" content="Admin Dashboard – MSK Institute" />
        <meta property="og:description" content="Administrative control panel for MSK Institute. Manage users, content, and courses." />
        <meta property="og:url" content="https://msk.shikohabad.in/admin-dashboard" />
        <meta property="og:type" content="website" />
      </Helmet>


      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <p>Welcome, Admin. Manage the entire institute here.</p>
      </div>
    </>
  );
};

export default AdminDashboard;
