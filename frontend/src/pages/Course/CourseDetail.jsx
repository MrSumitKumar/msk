import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../../api/axios";
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import {
  Play, CalendarDays, BookOpenCheck, Users, Languages
} from 'lucide-react';

const CourseDetail = ({ checkEnroll, singleCoursesCount, chaptersCount }) => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchCourse = async () => {
    try {
      const courseRes = await axios.get(`/courses/${slug}/`);
      const reviewRes = await axios.get(`/courses/${slug}/reviews/`);
      setCourse(courseRes.data);
      setReviews(reviewRes.data);
    } catch (err) {
      toast.error('Course not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
  if (!course) return <div className="text-center mt-10 text-red-500">Course not found</div>;

  const discountedPrice =
    course.discount === 100 || course.price === 0
      ? 'Free'
      : `₹ ${Math.round(course.price * (1 - course.discount / 100))}`;

  return (
    <>
      <Helmet>
        <title>{course.title} - MSK Institute</title>
        <meta
          name="description"
          content={course.description?.slice(0, 160) || `Learn ${course.title} at MSK Institute. High-quality, hands-on coding and computer courses in Shikohabad.`}
        />
        <meta name="keywords" content={`${course.title}, online course, ${course.get_languages}, coding classes, MSK Institute, Shikohabad`} />
        <meta name="author" content="MSK Institute" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={`${course.title} - MSK Institute`} />
        <meta property="og:description" content={course.description?.slice(0, 160)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://msk.shikohabad.in/courses/${course.slug}`} />
        <meta property="og:image" content={course.featured_image?.url} />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${course.title} - MSK Institute`} />
        <meta name="twitter:description" content={course.description?.slice(0, 160)} />
        <meta name="twitter:image" content={course.featured_image?.url} />

        {/* Canonical */}
        <link rel="canonical" href={`https://msk.shikohabad.in/courses/${course.slug}`} />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": course.title,
            "description": course.description,
            "provider": {
              "@type": "Organization",
              "name": "MSK Institute",
              "sameAs": "https://msk.shikohabad.in"
            },
            "educationalCredentialAwarded": "Certificate",
            "timeRequired": `${course.duration}M`,
            "inLanguage": course.get_languages,
            "offers": {
              "@type": "Offer",
              "price": course.price,
              "priceCurrency": "INR",
              "url": `https://msk.shikohabad.in/courses/${course.slug}`,
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>


      <div className="bg-gray-900 min-h-screen px-5 md:px-8 py-10 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left: Video + Price */}
          <div>
            <a
              href={`https://www.youtube.com/watch?v=${course.featured_video}`}
              className="block aspect-video rounded-lg overflow-hidden relative group"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={course.featured_image?.url}
                alt="Course thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
                  <Play className="text-black w-6 h-6" />
                </div>
              </div>
            </a>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-green-400 text-2xl font-bold">{discountedPrice}</span>
              {course.discount !== 100 && course.price !== 0 && (
                <>
                  <del className="text-red-400 text-xl">₹ {course.price}</del>
                  <span className="bg-yellow-500 text-black px-2 py-1 text-sm rounded-md font-semibold">
                    {course.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="mt-2 flex items-center text-sm text-gray-300 gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>10 days left at this price</span>
            </div>

            <div className="mt-6">
              {checkEnroll === null ? (
                <a
                  href={`/course/checkout/${course.slug}`}
                  className="block w-full bg-indigo-600 text-white text-center font-semibold py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  Enroll Now
                </a>
              ) : (
                <button className="w-full bg-gray-700 text-white py-3 rounded-lg cursor-not-allowed">
                  Already Enrolled
                </button>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <div>
            <h1 className="text-3xl font-semibold mb-3">{course.title}</h1>
            <p className="text-gray-300 mb-6">{course.description?.slice(0, 120)}...</p>

            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-gray-700 py-2">
                <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Duration</span>
                <span> {course.duration} {course.duration === 1 ? "Month" : "Months"} </span>
              </li>

              <li className="flex justify-between border-b border-gray-700 py-2">
                <span className="flex items-center gap-2">
                  <BookOpenCheck className="w-4 h-4" />
                  {course.is_combo_course ? "Included Courses" : "Chapters"}
                </span>
                <span>
                  {course.is_combo_course
                    ? `${singleCoursesCount} Courses`
                    : `${chaptersCount} Chapters`}
                </span>
              </li>

              <li className="flex justify-between border-b border-gray-700 py-2">
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Enrolled</span>
                <span>{course.enrollments?.count ?? 0}</span>
              </li>

              <li className="flex justify-between border-b border-gray-700 py-2">
                <span className="flex items-center gap-2"><Languages className="w-4 h-4" /> Language</span>
                <span>{course.languages}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto mt-12 bg-gray-800 rounded-xl overflow-hidden">
          <div className="flex border-b border-gray-700">
            {['overview', 'curriculum', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium tracking-wide transition-colors
                  ${activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Course Description</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {course.description}
                </p>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Curriculum</h2>
                <p className="text-gray-400">[TODO: Show curriculum details here]</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Student Feedback</h2>
                {reviews.length === 0 ? (
                  <p className="text-gray-400">No reviews yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {reviews.map((review, idx) => (
                      <li key={idx} className="bg-gray-700 p-4 rounded-md text-sm text-white">
                        <p className="font-bold">{review.reviewer_name}</p>
                        <p className="text-yellow-400">Rating: {review.rating} / 5</p>
                        <p className="mt-2 text-gray-200">{review.comment}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
