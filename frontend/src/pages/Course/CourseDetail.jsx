import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../../api/axios";
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import {
  Play, CalendarDays, BookOpenCheck, Users, Languages, Star,
  PlayCircle, FileText, ChevronDown, ChevronRight, Award
} from "lucide-react";


const CourseDetail = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [checkEnroll, setCheckEnroll] = useState(null);
  const [openChapter, setOpenChapter] = useState(null);

  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);



  // Fetch course details
  const fetchCourse = async () => {
    try {
      const { data } = await axios.get(`/courses/${slug}/with-chapters/`);
      setCourse(data);
      setOpenChapter(data.chapters?.[0]?.id || null); // first chapter open
    } catch (err) {
      toast.error('Course not found');
    } finally {
      setLoading(false);
    }
  };

  // Fetch course reviews
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/courses/${slug}/public-reviews/`);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  // Submit review (for logged-in users)
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.error("Please add rating and comment");
      return;
    }
    try {
      setSubmitting(true);
      await axios.post(`/courses/${slug}/reviews/`, { rating, comment });
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      fetchReviews(); // refresh reviews
    } catch (err) {
      toast.error("Error submitting review. Are you logged in?");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleChapter = (chapterId) => {
    setOpenChapter(openChapter === chapterId ? null : chapterId);
  };

  useEffect(() => {
    fetchCourse();
    fetchReviews();
  }, [slug]);

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
  if (!course) return <div className="text-center mt-10 text-red-500">Course not found</div>;

  const discountedPrice =
    course.discount === 100 || course.price === 0
      ? 'Free'
      : `₹ ${Math.round(course.price * (1 - course.discount / 100))}`;

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

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
              "reviewCount": course.total_reviews || "25",
            },
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

            {/* Price */}
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

            {/* Enroll */}
            <div className="mt-6">
              {checkEnroll ? (
                <button className="w-full bg-gray-700 text-white py-3 rounded-lg cursor-not-allowed">
                  Already Enrolled
                </button>
              ) : (
                <a
                  href={`/course/checkout/${course.slug}`}
                  className="block w-full bg-indigo-600 text-white text-center font-semibold py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  Enroll Now
                </a>
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
                <span>{course.duration} {course.duration === 1 ? "Month" : "Months"}</span>
              </li>
              <li className="flex justify-between border-b border-gray-700 py-2">
                <span className="flex items-center gap-2"><BookOpenCheck className="w-4 h-4" /> Chapters</span>
                <span>{course.chapters?.length || 0}</span>
              </li>
              <li className="flex justify-between border-b border-gray-700 py-2">
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Enrolled</span>
                <span>{course.enrollments?.count ?? 0}</span>
              </li>
              <li className="flex justify-between border-b border-gray-700 py-2">
                <span className="flex items-center gap-2"><Languages className="w-4 h-4" /> Language</span>
                <span>{course.language}</span>
              </li>
              {course.certificate && (
                <li className="flex justify-between border-b border-gray-700 py-2">
                  <span className="flex items-center gap-2"><Award className="w-4 h-4" /> Certificate</span>
                  <span>Yes</span>
                </li>
              )}
              {avgRating && (
                <li className="flex justify-between border-b border-gray-700 py-2">
                  <span className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> Rating</span>
                  <span>{avgRating} / 5 ({reviews.length} reviews)</span>
                </li>
              )}
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

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Course Description</h2>
                <p className="text-gray-300 text-sm leading-relaxed">{course.description}</p>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div>
                <h2 className="text-xl font-bold mb-5 text-gray-100">📖 Curriculum</h2>

                {course.chapters?.length > 0 ? (
                  <div className="space-y-3">
                    {course.chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="bg-gray-800 rounded-xl shadow-md overflow-hidden"
                      >
                        {/* Chapter Header */}
                        <button
                          onClick={() => toggleChapter(chapter.id)}
                          className="w-full flex items-center justify-between px-5 py-3 text-left text-gray-200 font-semibold hover:bg-gray-700 transition"
                        >
                          <span>{chapter.title}</span>
                          {openChapter === chapter.id ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </button>

                        {/* Topics */}
                        {openChapter === chapter.id && (
                          <div className="px-6 py-3 space-y-3 border-t border-gray-700">
                            {chapter.topics?.length > 0 ? (
                              chapter.topics.map((topic) => (
                                <div
                                  key={topic.id}
                                  className="flex items-center justify-between bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition"
                                >
                                  <span className="text-gray-200 text-sm font-medium">
                                    {topic.title}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    {topic.video_url && (
                                      <a
                                        href={topic.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-400 hover:text-green-300"
                                        title="Watch Video"
                                      >
                                        <PlayCircle className="w-5 h-5" />
                                      </a>
                                    )}
                                    {topic.notes_url && (
                                      <a
                                        href={topic.notes_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300"
                                        title="View Notes"
                                      >
                                        <FileText className="w-5 h-5" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-400 text-sm">No topics available</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No chapters available</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Student Feedback</h2>

                {/* Review Form (for logged-in users) */}
                <form onSubmit={handleSubmitReview} className="mb-6 space-y-3 bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium">Your Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  >
                    <option value="0">Select rating</option>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review..."
                    rows={3}
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-semibold"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>

                {/* Review List */}
                {reviews.length === 0 ? (
                  <p className="text-gray-400">No reviews yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {reviews.map((review, idx) => (
                      <li key={idx} className="bg-gray-700 p-4 rounded-md text-sm text-white">
                        <p className="font-bold">{review.user?.full_name || "Anonymous"}</p>
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
