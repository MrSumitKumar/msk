import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 py-12 mb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Video + Price */}
            <div className="space-y-6">
              <div className="relative">
                {/* Video Placeholder */}
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-800/50 shadow-2xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-gray-700"></div>
                  </div>
                </div>
                {/* Overlay stats */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-7 w-32 bg-black/60 rounded-full"></div>
                    <div className="h-7 w-32 bg-black/60 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-700 rounded"></div>
                    <div className="h-8 w-32 bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-10 w-20 bg-gray-700 rounded"></div>
                </div>
                <div className="h-12 bg-gray-700 rounded-lg"></div>
              </div>
            </div>
            
            {/* Right: Course Information */}
            <div className="space-y-6">
              {/* Title and Description */}
              <div className="space-y-4">
                <div className="h-10 bg-gray-800/50 rounded-lg w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-800/50 rounded w-full"></div>
                  <div className="h-4 bg-gray-800/50 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-800/50 rounded w-4/6"></div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-800/30 p-4 rounded-lg flex gap-3">
                    <div className="w-10 h-10 rounded bg-gray-700"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-20"></div>
                      <div className="h-4 bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl">
          {/* Tab Buttons */}
          <div className="flex border-b border-gray-700">
            <div className="flex-1 p-4">
              <div className="h-6 bg-gray-700 rounded w-32 mx-auto"></div>
            </div>
            <div className="flex-1 p-4">
              <div className="h-6 bg-gray-700 rounded w-32 mx-auto"></div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 bg-gray-700/30 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-gray-700"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-48"></div>
                      <div className="h-4 bg-gray-700 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;