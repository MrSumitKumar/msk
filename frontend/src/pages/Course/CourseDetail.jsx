// src/pages/Course/CourseDetail.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import VideoPlayer from '../../components/video/VideoPlayer';
import CourseCard from '../../components/course/CourseCard';
import {
  Play, CalendarDays, BookOpenCheck, Users, Languages, Star,
  PlayCircle, FileText, ChevronDown, ChevronRight, Award,
  Clock, GraduationCap, Globe, BadgeCheck, BarChart,
  BookOpen, Loader2
} from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';


const CourseDetail = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [checkEnroll, setCheckEnroll] = useState(null);
  const [openChapter, setOpenChapter] = useState(null);

  // Form states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -----------------------------
  // Fetch course details
  // -----------------------------
  const fetchCourse = useCallback(async (signal) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/courses/courses/${slug}/with_chapters/`, { signal });
      setCourse(data);
      setOpenChapter(data.chapters?.[0]?.id || null);
    } catch (err) {
      if (!signal.aborted) {
        setCourse(null);
        toast.error('Course not found');
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [slug]);

  const toggleChapter = (chapterId) => {
    setOpenChapter(openChapter === chapterId ? null : chapterId);
  };

  const handleEnroll = async () => {
    try {
      setIsSubmitting(true);
      // Add your enrollment logic here
      toast.success("Successfully enrolled in the course!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to enroll. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------
  // Effects with AbortController
  // -----------------------------
  useEffect(() => {
    const controller = new AbortController();
    fetchCourse(controller.signal);
    return () => controller.abort();
  }, [fetchCourse]);

  if (loading) return <LoadingSkeleton />;
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Course Not Found</h2>
          <p className="text-gray-400">The course you're looking for doesn't exist or has been removed.</p>
          <a href="/courses" className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Browse Courses
          </a>
        </div>
      </div>
    );
  }

  const discountedPrice =
    course.discount === 100 || course.price === 0
      ? 'Free'
      : `₹ ${Math.round(course.price * (1 - course.discount / 100))}`;


  return (
    <>

      <Helmet>
        {/* 🔹 Basic Meta */}
        <title>{course.title} | MSK Institute</title>
        <meta
          name="description"
          content={
            course.short_description ||
            "Learn coding and computer skills with MSK Institute – practical, affordable, and career-focused courses."
          }
        />
        <meta
          name="keywords"
          content={`MSK Institute, ${course.title}, ${course.category?.name || ""}, online learning, coding, programming, education`}
        />
        <meta name="author" content="MSK Institute" />
        <link rel="canonical" href={`https://mskinstitute.in/courses/${course.slug}`} />

        {/* 🔹 Open Graph / Facebook / LinkedIn */}
        <meta property="og:title" content={`${course.title} | MSK Institute`} />
        <meta
          property="og:description"
          content={
            course.short_description ||
            "Join MSK Institute's hands-on courses and boost your career in tech."
          }
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://mskinstitute.in/courses/${course.slug}`} />
        <meta
          property="og:image"
          content={course.image || "https://mskinstitute.in/static/default-course.jpg"}
        />
        <meta property="og:site_name" content="MSK Institute" />

        {/* 🔹 Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${course.title} | MSK Institute`} />
        <meta
          name="twitter:description"
          content={
            course.short_description ||
            "Learn practical skills with MSK Institute’s affordable online courses."
          }
        />
        <meta
          name="twitter:image"
          content={course.image || "https://mskinstitute.in/static/default-course.jpg"}
        />

        {/* 🔹 Schema.org JSON-LD for Rich Snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": course.title,
            "description":
              course.short_description ||
              "Learn coding and computer skills with MSK Institute.",
            "provider": {
              "@type": "Organization",
              "name": "MSK Institute",
              "sameAs": "https://mskinstitute.in",
            },
            "educationalCredentialAwarded": course.certificate
              ? "Certificate of Completion"
              : "No Certificate",
            "offers": {
              "@type": "Offer",
              "url": `https://mskinstitute.in/courses/${course.slug}`,
              "priceCurrency": "INR",
              "price": course.discount_price || course.price || "0",
              "availability": "https://schema.org/InStock",
              "validFrom": new Date().toISOString(),
            },
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Online",
              "duration": course.duration ? `P${course.duration}D` : "P30D", // ISO 8601 duration
              "instructor": {
                "@type": "Person",
                "name": course.instructor?.name || "MSK Instructor",
              },
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": course.average_rating || "4.5",
              // "reviewCount": course.total_reviews || "25",
            },
          })}
        </script>
      </Helmet>


      <div className="bg-gray-900 min-h-screen text-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 py-12 mb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left: Video + Price */}
              <div className="space-y-6">
                <div className="relative">
                  {course.featured_video ? (
                    <VideoPlayer 
                      videoId={course.featured_video}
                      poster={course.featured_image?.url || `https://placehold.co/800x400/0f172a/ffffff?text=${encodeURIComponent(course.title)}`}
                    />
                  ) : (
                    <div className="aspect-video rounded-xl overflow-hidden relative shadow-2xl bg-gray-800 flex items-center justify-center">
                      <img
                        src={course.featured_image?.url || `https://placehold.co/800x400/0f172a/ffffff?text=${encodeURIComponent(course.title)}`}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <Play className="w-16 h-16 mx-auto mb-2 opacity-50" />
                          <p>No video available</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                </div>

                {/* Price Section */}
                <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <p className="text-gray-400 text-sm">Course Fee</p>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-green-400">{discountedPrice}</span>
                        {course.discount !== 100 && course.price !== 0 && (
                          <del className="text-lg text-gray-500">₹{course.price}</del>
                        )}
                      </div>
                    </div>
                    {course.discount !== 100 && course.price !== 0 && (
                      <div className="bg-yellow-500/10 text-yellow-500 px-3 py-2 rounded-lg">
                        <span className="text-lg font-bold">{course.discount}%</span>
                        <span className="text-sm"> OFF</span>
                      </div>
                    )}
                  </div>

                  {/* Call to action button */}
                  <button
                    onClick={handleEnroll}
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-5 h-5" />
                        <span>Enroll Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Right: Course Information */}
              <div className="space-y-6">
                {/* Course Title and Description */}
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight">{course.title}</h1>
                  <p className="text-gray-300 text-lg leading-relaxed">{course.description}</p>
                </div>

                {/* Course Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
                    <div className="mt-1">
                      <CalendarDays className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Duration</h3>
                      <p className="text-gray-400">{course.duration} {course.duration === 1 ? "Month" : "Months"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
                    <div className="mt-1">
                      <BookOpenCheck className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{course.course_type === 'COMBO' ? 'Courses' : 'Chapters'}</h3>
                      <p className="text-gray-400">
                        {course.course_type === 'COMBO' 
                          ? `${course.single_courses?.length || 0} courses included`
                          : `${course.chapters?.length || 0} chapters`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
                    <div className="mt-1">
                      <Languages className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Language</h3>
                      <p className="text-gray-400">{course.language || 'English'}</p>
                    </div>
                  </div>

                  {course.certificate && (
                    <div className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
                      <div className="mt-1">
                        <Award className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Certificate</h3>
                        <p className="text-gray-400">Course completion certificate</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl">
            {/* Tab Buttons */}
            <div className="flex border-b border-gray-700">
              {['overview', 'curriculum'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-6 text-sm font-medium tracking-wide transition-colors
                    ${activeTab === tab
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  {tab === 'overview' ? 'Course Overview' : 'Course Curriculum'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Course Description */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                      {course.description}
                    </p>
                  </div>

                  {/* What You'll Learn */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.features?.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="mt-1 flex-shrink-0">
                            <BadgeCheck className="w-5 h-5 text-green-400" />
                          </div>
                          <p className="text-gray-300">{feature}</p>
                        </div>
                      )) || (
                        <p className="text-gray-400">Course features coming soon...</p>
                      )}
                    </div>
                  </div>

                  {/* Course Features Grid */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Course Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-3 bg-gray-700/30 p-4 rounded-lg">
                        <div className="mt-1">
                          <Clock className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Duration</h3>
                          <p className="text-gray-400">{course.duration} {course.duration === 1 ? "Month" : "Months"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 bg-gray-700/30 p-4 rounded-lg">
                        <div className="mt-1">
                          <BookOpenCheck className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{course.course_type === 'COMBO' ? 'Total Courses' : 'Total Chapters'}</h3>
                          <p className="text-gray-400">
                            {course.course_type === 'COMBO' 
                              ? `${course.single_courses?.length || 0} courses`
                              : `${course.chapters?.length || 0} chapters`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 bg-gray-700/30 p-4 rounded-lg">
                        <div className="mt-1">
                          <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Enrolled</h3>
                          <p className="text-gray-400">{course.enrolled_count || 0} students</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    {course.course_type === 'COMBO' ? 'Included Courses' : 'Course Curriculum'}
                  </h2>
                  <div className="space-y-4">
                    {course.course_type === 'COMBO' ? (
                      // Display courses for combo type
                      course.single_courses?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {course.single_courses?.map((includedCourse) => (
                            <CourseCard 
                              key={includedCourse.id} 
                              course={{
                                ...includedCourse,
                                featured_image_url: includedCourse.featured_image_url || null,
                                language: includedCourse.language || []
                              }}
                            />
                          )) || (
                            <div className="text-gray-500">No courses available.</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">No courses added to this combo yet</p>
                        </div>
                      )
                    ) : (
                      // Display chapters for regular course
                      course.chapters?.length > 0 ? (
                        course.chapters.map((chapter) => (
                          <div
                            key={chapter.id}
                            className="bg-gray-700/30 rounded-xl overflow-hidden"
                          >
                            <button
                              onClick={() => toggleChapter(chapter.id)}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                                  <BookOpen className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-100">{chapter.title}</h3>
                                  {chapter.topics?.length > 0 && (
                                    <p className="text-sm text-gray-400">{chapter.topics.length} topics</p>
                                  )}
                                </div>
                              </div>
                              <ChevronDown
                                className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                                  openChapter === chapter.id ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            
                            {openChapter === chapter.id && (
                              <div className="border-t border-gray-600/50">
                                {chapter.topics?.length > 0 ? (
                                  <div className="p-4 space-y-2">
                                    {chapter.topics.map((topic) => (
                                      <div
                                        key={topic.id}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-600/30 transition-colors group"
                                      >
                                        <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                                          {topic.title}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          {topic.video_url && (
                                            <a
                                              href={topic.video_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-indigo-400 hover:text-indigo-300 transition-colors p-1 rounded-full hover:bg-gray-700"
                                              title="Watch Video"
                                            >
                                              <PlayCircle className="w-4 h-4" />
                                            </a>
                                          )}
                                          {topic.notes_url && (
                                            <a
                                              href={topic.notes_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-indigo-400 hover:text-indigo-300 transition-colors p-1 rounded-full hover:bg-gray-700"
                                              title="View Notes"
                                            >
                                              <FileText className="w-4 h-4" />
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="p-4 text-sm text-gray-400">No topics available yet</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">Course curriculum coming soon...</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
