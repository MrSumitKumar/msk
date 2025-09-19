import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Users, BookOpen, Heart } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import OptimizedImage from "../common/OptimizedImage";

const CourseCard = ({ course }) => {
  const { theme } = useContext(ThemeContext);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isDefaultImage = !course.featured_image_url || course.featured_image_url?.includes("/media/course/poster/default.jpg");
  const imageUrl = isDefaultImage ? `https://placehold.co/600x400/0f172a/ffffff?text=${encodeURIComponent(course.title?.slice(0, 30) || 'Course')}` : course.featured_image_url;

  const discountedPrice =
    course.discount === 100 || course.price === 0
      ? 'Free'
      : `₹ ${Math.round(course.price * (1 - course.discount / 100))}`;



  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg border group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${theme === 'dark'
      ? 'bg-gray-900 border-gray-700 hover:border-blue-600'
      : 'bg-white border-gray-200 hover:border-blue-300'
      }`}>
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsWishlisted(!isWishlisted);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${theme === 'dark'
          ? 'bg-gray-800/80 hover:bg-gray-700'
          : 'bg-white/80 hover:bg-gray-100'
          }`}
      >
        <Heart
          className={`w-5 h-5 transition-colors duration-300 ${isWishlisted
            ? 'fill-red-500 stroke-red-500'
            : theme === 'dark'
              ? 'stroke-gray-300'
              : 'stroke-gray-600'
            }`}
        />
      </button>

      <Link to={`/courses/${course.slug}`} className="block relative">
        <OptimizedImage
          src={imageUrl}
          alt={course.title}
          className="w-full h-48"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          fallbackSrc={`https://placehold.co/600x400/0f172a/ffffff?text=${encodeURIComponent("Loading...")}`}
        />
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4`}>
          <span className="text-white text-sm font-medium">Click to view details</span>
        </div>
      </Link>

      <div className="p-5 space-y-3">
        <h3 className={`text-lg font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`} title={course.title}>
          {course.title}
        </h3>

        <p className={`text-sm line-clamp-2 min-h-[40px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
          {course.sort_description || "No description available."}
        </p>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-4 mt-3">
          {/* Duration + Chapters/Courses */}
          <div
            className={`flex items-center gap-1.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
          >
            {/* Agar combo course hai to Courses icon, warna Chapters icon */}
            {course.course_type === "COMBO" ? (
              <BookOpen className="w-4 h-4" />
            ) : (
              <BookOpen className="w-4 h-4" />
            )}
            <span className="text-sm">
              {course.course_type === "COMBO"
                ? `${course.single_courses?.length || 0} Courses`
                : `${course.chapters_count || 0} Chapters`}
            </span>
          </div>

          {/* Duration */}
          {course.duration && (
            <div
              className={`flex items-center gap-1.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {course.duration} {course.duration > 1 ? "Months" : "Month"}
              </span>
            </div>
          )}

        </div>


        {/* Course Mode, Level and Type */}
        <div className="flex flex-wrap gap-2 mt-3">
          {/* Level */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark'
            ? 'bg-purple-900 text-purple-200'
            : 'bg-purple-100 text-purple-800'
            }`}>
            {course.level?.name}
          </span>

          {/* Mode(s) */}
          {course.mode === 'BOTH' ? (
            <>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark'
                ? 'bg-blue-900 text-blue-200'
                : 'bg-blue-100 text-blue-800'
                }`}>
                Online
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark'
                ? 'bg-indigo-900 text-indigo-200'
                : 'bg-indigo-100 text-indigo-800'
                }`}>
                Offline
              </span>
            </>
          ) : (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark'
              ? 'bg-blue-900 text-blue-200'
              : 'bg-blue-100 text-blue-800'
              }`}>
              {course.mode}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-3 text-sm">
          <span className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
            {(discountedPrice || 0).toLocaleString("en-IN")}
          </span>
          {course.discount > 0 && (
            <div className="flex flex-col items-end">
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                {course.discount}% OFF
              </span>
              <span className={`text-xs line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                ₹{(course.price || 0).toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>

        <Link
          to={`/courses/${course.slug}`}
          className={`block mt-4 w-full text-center py-2.5 text-white font-semibold rounded-lg transition-colors duration-200 ${theme === 'dark'
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          Explore Course <BookOpen className="w-4 h-4 ml-2 inline" />
        </Link>

        {/* Course Progress (if enrolled) */}
        {course.is_enrolled && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                {course.progress || 0}%
              </span>
            </div>
            <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${course.progress || 0}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;