import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Helmet } from "react-helmet-async";
import api from '../../api/api';


const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/');
      setCourses(response.data.results || response.data);
    } catch (error) {
      toast.error("Failed to load your courses.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/courses/${slug}/`);
      toast.success("Course deleted successfully!");
      fetchCourses(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete course.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading courses...</div>;

  return (
    <>

      <Helmet>
        <title>Teacher Dashboard – MSK Institute</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Access and manage your courses, student progress, and teaching tools from the MSK Institute Teacher Dashboard." />
        <link rel="canonical" href="https://msk.shikohabad.in/teacher-dashboard" />

        <meta property="og:title" content="Teacher Dashboard – MSK Institute" />
        <meta property="og:description" content="Secure dashboard for MSK Institute teachers to manage classes and courses." />
        <meta property="og:url" content="https://msk.shikohabad.in/teacher-dashboard" />
        <meta property="og:type" content="website" />
      </Helmet>


      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Your Courses</h1>
          <Link to="/courses/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add New Course
          </Link>
        </div>
        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white p-4 rounded shadow hover:shadow-md transition">
                <h2 className="font-semibold text-lg mb-2">{course.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{course.description?.slice(0, 100)}...</p>
                <div className="flex gap-3">
                  <Link
                    to={`/courses/edit/${course.slug}/`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCourse(course.slug)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>

  );
};

export default TeacherDashboard;
