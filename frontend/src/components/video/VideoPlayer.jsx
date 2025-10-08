import React, { useState, useRef, useContext, useEffect } from 'react';
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import './VideoPlayer.css';

const VideoPlayer = ({ videoId, poster }) => {
  const { theme } = useContext(ThemeContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Handle mouse movement to show/hide controls
  useEffect(() => {
    const showControlsTemp = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', showControlsTemp);
    container.addEventListener('mouseenter', showControlsTemp);
    container.addEventListener('mouseleave', () => setShowControls(false));

    return () => {
      container.removeEventListener('mousemove', showControlsTemp);
      container.removeEventListener('mouseenter', showControlsTemp);
      container.removeEventListener('mouseleave', () => setShowControls(false));
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Load YouTube IFrame API
  useEffect(() => {
    const loadYouTubeAPI = () => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    };

    if (window.YT) {
      initializePlayer();
    } else {
      loadYouTubeAPI();
    }

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, [videoId]);

  // Update progress bar
  useEffect(() => {
    let interval;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        setCurrentTime(currentTime);
        setDuration(duration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const initializePlayer = () => {
    if (!document.getElementById('youtube-player')) return;
    
    playerRef.current = new window.YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: videoId,
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0,
        loop: 0,
        fs: 0,
        origin: window.location.origin,
        widget_referrer: window.location.origin,
        color: 'white',
        autohide: 1,
        cc_load_policy: 0,
        hl: 'en',
        wmode: 'transparent',
        playlist: videoId,
        ecver: 2,
        mute: 0,
        start: 0
      },
      events: {
        onStateChange: (event) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          setIsBuffering(event.data === window.YT.PlayerState.BUFFERING);
        },
        onReady: (event) => {
          setDuration(event.target.getDuration());
        },
        onError: (error) => {
          console.error('YouTube Player Error:', error);
          setLoadError(true);
        }
      }
    });
  };

  const formatTime = (seconds) => {
    const pad = (num) => num.toString().padStart(2, '0');
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${pad(remainingMinutes)}:${pad(remainingSeconds)}`;
    }
    return `${remainingMinutes}:${pad(remainingSeconds)}`;
  };

  const handleProgressClick = (e) => {
    if (!playerRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative aspect-video rounded-xl overflow-hidden shadow-2xl ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
      }`}
    >
      {!videoId || loadError ? (
        // Show featured image when no video or error
        <div className="relative w-full h-full">
          <img
            src={poster || `https://placehold.co/800x400/1a1b1e/ffffff?text=No+Video+Available`}
            alt="Course Featured"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
            <Play className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">
              {videoId ? 'Video unavailable' : 'No preview available'}
            </p>
          </div>
        </div>
      ) : (
        // Show YouTube player when video ID exists
        <div className="custom-youtube-player">
          <div className="player-wrapper">
            <div id="youtube-player"></div>
          </div>
        </div>
      )}

      {videoId && !loadError && (
        <>
          {/* Video Overlay for Play/Pause on Click */}
          <div 
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={(e) => {
              // Only toggle play if clicking the overlay directly
              if (e.target === e.currentTarget) {
                togglePlay();
              }
            }}
          />

          {/* Loading Indicator */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {/* Central Play Button (shown when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-20 h-20 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all transform hover:scale-110 pointer-events-auto"
              >
                <Play className="w-10 h-10 text-white" />
              </button>
            </div>
          )}

          {/* Custom Controls */}
        </>
      )}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar */}
        <div 
          ref={progressRef}
          className="h-1 w-full bg-white/20 cursor-pointer group"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-indigo-500 relative"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Controls Bar */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>

              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5 text-white" />
              ) : (
                <Maximize className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;