import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({ src, alt, sizes, className, fallbackSrc = '/placeholder.jpg' }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Reset state when src changes
    setError(false);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    let observer;
    const currentImageRef = imageRef.current;

    // Create IntersectionObserver if not already observing
    if (!observerRef.current && currentImageRef) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              // Load the real image
              img.src = img.dataset.src;
              // Stop observing once loaded
              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: '50px', // Start loading when image is 50px from viewport
          threshold: 0.01
        }
      );
      observerRef.current = observer;
      observer.observe(currentImageRef);
    }

    return () => {
      if (observerRef.current && currentImageRef) {
        observerRef.current.unobserve(currentImageRef);
      }
    };
  }, []);

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  // Generate srcset for responsive images
  const generateSrcSet = () => {
    if (!src) return '';
    const widths = [320, 480, 640, 768, 1024, 1280];
    return widths
      .map(width => {
        const url = new URL(src);
        url.searchParams.set('width', width.toString());
        return `${url.toString()} ${width}w`;
      })
      .join(', ');
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading Placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}

      {/* The Image */}
      <img
        ref={imageRef}
        data-src={src}
        src={fallbackSrc}
        srcSet={error ? undefined : generateSrcSet()}
        sizes={sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`
          transition-opacity duration-300 w-full h-full object-cover
          ${loaded ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;