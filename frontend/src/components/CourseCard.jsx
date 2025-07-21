import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const CourseCard = ({ course }) => {
  const imageUrl =
    course.featured_image?.url ||
    `https://placehold.co/600x400/0f172a/ffffff?text=${encodeURIComponent(course.title)}`;

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg transition transform hover:scale-[1.02] hover:shadow-xl duration-300">
      <Link to={`/courses/${course.slug}`}>
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-white truncate" title={course.title}>
          {course.title}
        </h3>

        <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px]">
          {course.description || "No description available."}
        </p>

        <div className="flex justify-between items-center mt-2 text-sm">
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">
            {course.mode}
          </span>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 text-white text-sm">
          <span className="font-medium">
            ₹{course.price.toLocaleString("en-IN")}
          </span>
          {course.discount > 0 && (
            <span className="text-green-400 text-xs">
              {course.discount}% OFF
            </span>
          )}
        </div>

        <Link
          to={`/courses/${course.slug}`}
          className="block mt-4 w-full text-center py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
