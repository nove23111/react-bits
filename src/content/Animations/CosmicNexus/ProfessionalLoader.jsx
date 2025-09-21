import { useEffect, useRef, useState, useCallback } from 'react';
import './ProfessionalLoader.css';

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
  variant = 'default', // 'default', 'minimal', 'elegant', 'modern'
  onComplete = null,
  autoProgress = false,
  duration = 3000 // Auto progress duration in ms
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
    const interval = 50; // Update every 50ms for smooth animation
    
    progressInterval.current = setInterval(() => {
      elapsed += interval;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      
      // Add some randomness for realism
      const jitter = Math.random() * 2 - 1; // -1 to 1
      const smoothProgress = Math.min(progressPercent + jitter, 100);
      
      setCurrentProgress(smoothProgress);
      
      if (smoothProgress >= 100) {
        clearInterval(progressInterval.current);
        setIsComplete(true);
        onComplete?.();
        
        // Auto-hide after completion (optional)
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

  const getThemeClass = () => {
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'minimal': return 'variant-minimal';
      case 'elegant': return 'variant-elegant';
      case 'modern': return 'variant-modern';
      default: return 'variant-default';
    }
  };

  const getStyles = () => ({
    '--primary-color': color,
    '--animation-duration': `${2 / speed}s`,
    '--glow-intensity': glowing ? '1' : '0',
    '--border-radius': rounded ? '8px' : '2px'
  });

  const renderSkeleton = () => (
    <div className="pro-loader skeleton">
      {Array.from({ length: lines }, (_, i) => (
        <div 
          key={i} 
          className="skeleton-line"
          style={{ 
            '--delay': `${i * 0.15}s`,
            '--width': i === lines - 1 ? '60%' : i === lines - 2 ? '80%' : '100%'
          }}
        />
      ))}
    </div>
  );

  const renderProgress = () => (
    <div className="pro-loader progress">
      <div className="progress-container">
        <div className="progress-track">
          <div 
            className={`progress-fill ${isComplete ? 'complete' : ''}`}
            style={{ width: `${currentProgress}%` }}
          >
            <div className="progress-shine" />
          </div>
        </div>
        {showPercentage && (
          <span className={`progress-text ${isComplete ? 'complete' : ''}`}>
            {Math.round(currentProgress)}%
          </span>
        )}
      </div>
      {text && (
        <p className="progress-label">
          {isComplete ? '✓ Complete!' : text}
        </p>
      )}
    </div>
  );

  const renderPulse = () => (
    <div className="pro-loader pulse">
      <div className="pulse-circle">
        <div className="pulse-inner" />
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  const renderShimmer = () => (
    <div className="pro-loader shimmer">
      {Array.from({ length: lines }, (_, i) => (
        <div 
          key={i}
          className="shimmer-line"
          style={{
            '--delay': `${i * 0.2}s`,
            '--width': i === lines - 1 ? '70%' : i === lines - 2 ? '85%' : '100%'
          }}
        />
      ))}
    </div>
  );

  const renderDots = () => (
    <div className="pro-loader dots">
      <div className="dots-container">
        {Array.from({ length: 3 }, (_, i) => (
          <div 
            key={i}
            className="dot"
            style={{ '--delay': `${i * 0.16}s` }}
          />
        ))}
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  const renderSpinner = () => (
    <div className="pro-loader spinner">
      <div className="spinner-ring">
        <div className="spinner-inner" />
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  const renderWave = () => (
    <div className="pro-loader wave">
      <div className="wave-container">
        {Array.from({ length: 5 }, (_, i) => (
          <div 
            key={i}
            className="wave-bar"
            style={{ '--delay': `${i * 0.1}s` }}
          />
        ))}
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  const renderBounce = () => (
    <div className="pro-loader bounce">
      <div className="bounce-container">
        {Array.from({ length: 3 }, (_, i) => (
          <div 
            key={i}
            className="bounce-ball"
            style={{ '--delay': `${i * 0.12}s` }}
          />
        ))}
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  const renderGradient = () => (
    <div className="pro-loader gradient">
      <div className="gradient-circle">
        <div className="gradient-inner" />
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  const renderRipple = () => (
    <div className="pro-loader ripple">
      <div className="ripple-container">
        <div className="ripple-circle ripple-1" />
        <div className="ripple-circle ripple-2" />
        <div className="ripple-circle ripple-3" />
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  const getLoader = () => {
    switch (type) {
      case 'skeleton': return renderSkeleton();
      case 'progress': return renderProgress();
      case 'pulse': return renderPulse();
      case 'shimmer': return renderShimmer();
      case 'dots': return renderDots();
      case 'spinner': return renderSpinner();
      case 'wave': return renderWave();
      case 'bounce': return renderBounce();
      case 'gradient': return renderGradient();
      case 'ripple': return renderRipple();
      default: return renderSkeleton();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={loaderRef}
      className={`
        pro-loader-wrapper 
        ${className} 
        ${size} 
        ${getThemeClass()} 
        ${getVariantClass()}
        ${adaptive ? 'adaptive' : ''}
        ${animated ? 'animated' : ''}
        ${glowing ? 'glowing' : ''}
      `}
      style={getStyles()}
    >
      {getLoader()}
    </div>
  );
};

export default ProfessionalLoader;
