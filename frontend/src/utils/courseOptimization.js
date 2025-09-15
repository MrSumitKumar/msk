// Debounce function for search and filter inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Memoize expensive calculations
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Calculate discount price
export const calculateDiscountPrice = memoize((price, discount) => {
  return discount === 100 || price === 0
    ? 'Free'
    : `₹${Math.round(price * (1 - discount / 100))}`;
});

// Format course data for better performance
export const formatCourseData = (course) => ({
  id: course.id,
  title: course.title,
  slug: course.slug,
  description: course.description || 'No description available.',
  imageUrl: course.featured_image_url,
  isDefaultImage: course.featured_image_url?.includes('/media/course/poster/default.jpg'),
  price: course.price || 0,
  discount: course.discount || 0,
  rating: (course.rating || 0).toFixed(1),
  enrolledCount: course.enrolled_count || 0,
  duration: course.duration || 0,
  mode: course.mode,
  level: course.level,
  isEnrolled: course.is_enrolled || false,
  progress: course.progress || 0,
});

// Check if an element is in viewport
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Image loading optimization
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Chunk array for pagination
export const chunkArray = (array, size) => {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

// Sort courses efficiently
export const sortCourses = memoize((courses, sortBy) => {
  const sortedCourses = [...courses];
  switch (sortBy) {
    case 'price-low':
      return sortedCourses.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sortedCourses.sort((a, b) => b.price - a.price);
    case 'rating':
      return sortedCourses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'newest':
      return sortedCourses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    case 'popular':
      return sortedCourses.sort((a, b) => (b.enrolled_count || 0) - (a.enrolled_count || 0));
    default:
      return sortedCourses;
  }
});