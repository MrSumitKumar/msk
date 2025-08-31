import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const CourseCard = ({ course }) => {
  const { theme } = useContext(ThemeContext);

  const isDefaultImage = course.featured_image_url?.includes("/media/course/poster/default.jpg");

  const imageUrl = isDefaultImage ? `https://placehold.co/600x400/0f172a/ffffff?text=${encodeURIComponent(course.title)}` : course.featured_image_url;



  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${theme === 'dark'
        ? 'bg-gray-900 border-gray-700 hover:border-blue-600'
        : 'bg-white border-gray-200 hover:border-blue-300'
      }`}>
      <Link to={`/courses/${course.slug}`}>
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-5 space-y-3">
        <h3 className={`text-lg font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`} title={course.title}>
          {course.title}
        </h3>

        <p className={`text-sm line-clamp-2 min-h-[40px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
          {course.description || "No description available."}
        </p>

        <div className="flex justify-between items-center mt-3 text-sm">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark'
              ? 'bg-blue-900 text-blue-200'
              : 'bg-blue-100 text-blue-800'
            }`}>
            {course.mode}
          </span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-yellow-500" />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              {(course.rating || 0).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 text-sm">
          <span className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
            ₹{(course.price || 0).toLocaleString("en-IN")}
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
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;