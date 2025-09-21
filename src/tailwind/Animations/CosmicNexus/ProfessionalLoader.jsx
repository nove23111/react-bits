import { useEffect, useRef, useState, useCallback } from 'react';

const ProfessionalLoader = ({ 
  className = '',
  type = 'skeleton',
  size = 'medium',
  color = '#3b82f6',
  speed = 1,
  lines = 3,
  showPercentage = true,
  progress = 0,
  text = 'Loading...',
  adaptive = true,
  theme = 'light',
  animated = true,
  rounded = true,
  glowing = false,
  variant = 'default',
  onComplete = null,
  autoProgress = false,
  duration = 3000
}) => {
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const loaderRef = useRef(null);
  const progressInterval = useRef(null);

  // Enhanced auto-progress with realistic timing
  const startAutoProgress = useCallback(() => {
    if (!autoProgress || progress > 0) return;
    
    let elapsed = 0;
    const interval = 50;
    
    progressInterval.current = setInterval(() => {
      elapsed += interval;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      
      const jitter = Math.random() * 2 - 1;
      const smoothProgress = Math.min(progressPercent + jitter, 100);
      
      setCurrentProgress(smoothProgress);
      
      if (smoothProgress >= 100) {
        clearInterval(progressInterval.current);
        setIsComplete(true);
        onComplete?.();
        
        setTimeout(() => {
          setIsVisible(false);
        }, 1000);
      }
    }, interval);
  }, [autoProgress, duration, progress, onComplete]);

  useEffect(() => {
    if (autoProgress && type === 'progress') {
      startAutoProgress();
    } else if (progress >= 0) {
      setCurrentProgress(progress);
      setIsComplete(progress >= 100);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [progress, autoProgress, type, startAutoProgress]);

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-32 h-8';
      case 'large': return 'w-96 h-16';
      default: return 'w-64 h-12';
    }
  };

  const getThemeClasses = () => {
    return theme === 'dark' 
      ? 'bg-gray-900 text-white' 
      : 'bg-white text-gray-900';
  };

  const renderSkeleton = () => (
    <div className={`w-full max-w-md space-y-3 ${getThemeClasses()}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse ${
            rounded ? 'rounded-lg' : 'rounded-sm'
          } ${glowing ? 'shadow-lg' : ''}`}
          style={{
            animationDuration: `${2 / speed}s`,
            width: i === lines - 1 ? '75%' : '100%'
          }}
        />
      ))}
    </div>
  );

  const renderProgress = () => (
    <div className={`w-full max-w-md ${getThemeClasses()}`}>
      <div className={`w-full bg-gray-200 ${rounded ? 'rounded-full' : 'rounded-sm'} h-2.5 mb-2`}>
        <div
          className={`bg-blue-600 h-2.5 transition-all duration-300 ${rounded ? 'rounded-full' : 'rounded-sm'} ${
            glowing ? 'shadow-lg shadow-blue-500/50' : ''
          }`}
          style={{
            width: `${currentProgress}%`,
            backgroundColor: color
          }}
        />
      </div>
      {showPercentage && (
        <div className="text-sm font-medium text-center">
          {Math.round(currentProgress)}%
        </div>
      )}
      {text && <div className="text-xs text-center mt-2 opacity-75">{text}</div>}
    </div>
  );

  const renderSpinner = () => (
    <div className="flex flex-col items-center space-y-3">
      <div
        className={`animate-spin ${getSizeClasses()} border-4 border-gray-200 border-t-blue-600 ${
          rounded ? 'rounded-full' : 'rounded-sm'
        } ${glowing ? 'shadow-lg' : ''}`}
        style={{
          borderTopColor: color,
          animationDuration: `${2 / speed}s`
        }}
      />
      {text && <div className="text-sm opacity-75">{text}</div>}
    </div>
  );

  const renderDots = () => (
    <div className="flex items-center space-x-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 bg-blue-600 animate-bounce ${rounded ? 'rounded-full' : 'rounded-sm'} ${
            glowing ? 'shadow-lg' : ''
          }`}
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${2 / speed}s`
          }}
        />
      ))}
      {text && <span className="ml-3 text-sm opacity-75">{text}</span>}
    </div>
  );

  const renderPulse = () => (
    <div className="flex flex-col items-center space-y-3">
      <div
        className={`${getSizeClasses()} bg-blue-600 animate-pulse ${rounded ? 'rounded-lg' : 'rounded-sm'} ${
          glowing ? 'shadow-lg' : ''
        }`}
        style={{
          backgroundColor: color,
          animationDuration: `${2 / speed}s`
        }}
      />
      {text && <div className="text-sm opacity-75">{text}</div>}
    </div>
  );

  const getLoader = () => {
    switch (type) {
      case 'skeleton': return renderSkeleton();
      case 'progress': return renderProgress();
      case 'pulse': return renderPulse();
      case 'spinner': return renderSpinner();
      case 'dots': return renderDots();
      default: return renderSkeleton();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={loaderRef}
      className={`flex items-center justify-center w-full h-full p-8 ${className} ${
        adaptive ? 'min-h-0' : ''
      } ${animated ? '' : 'animate-none'}`}
    >
      {getLoader()}
    </div>
  );
};

export default ProfessionalLoader;
