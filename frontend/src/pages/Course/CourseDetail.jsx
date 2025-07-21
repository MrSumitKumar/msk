import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const CourseDetail = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${slug}/`);
      setCourse(response.data);
    } catch (error) {
      toast.error('Course not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  if (loading) {
    return <div className="text-center mt-10">Loading course details...</div>;
  }

  if (!course) {
    return <div className="text-center mt-10 text-red-600">Course not found.</div>;
  }

  return (
    <>
      <Helmet>
        <title>{course.title} - MSK Institute</title>
        <meta name="description" content={course.description || course.description?.slice(0, 160)} />
        <link rel="canonical" href={`https://msk.shikohabad.in/courses/${course.slug}`} />

        <meta property="og:title" content={`${course.title} - MSK Institute`} />
        <meta property="og:description" content={course.description || course.description?.slice(0, 160)} />
        <meta property="og:url" content={`https://msk.shikohabad.in/courses/${course.slug}`} />
        <meta property="og:type" content="article" />
      </Helmet>

      <motion.div
        className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-md rounded-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={course.featured_image}
            alt={course.title}
            className="w-full md:w-1/3 h-60 object-cover rounded-lg border"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <p><strong>Price:</strong> ₹{course.price}</p>
              <p><strong>Discount:</strong> {course.discount}%</p>
              <p><strong>Duration:</strong> {course.duration} months</p>
              <p><strong>Level:</strong> {course.level?.name}</p>
              <p><strong>Mode:</strong> {course.mode}</p>
              <p><strong>Certificate:</strong> {course.certificate}</p>
              <p><strong>Languages:</strong> {course.language?.map(lang => lang.language).join(', ')}</p>
              <p><strong>Status:</strong> {course.status}</p>
              <p className="text-sm text-gray-500">Created by: {course.created_by}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CourseDetail;
