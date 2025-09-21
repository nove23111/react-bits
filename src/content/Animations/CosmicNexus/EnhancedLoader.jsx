import { useEffect, useRef, useState, useCallback } from 'react';
import './EnhancedLoader.css';

const EnhancedLoader = ({ 
  className = '',
  type = 'skeleton', // 'skeleton', 'progress', 'pulse', 'shimmer', 'dots', 'spinner', 'wave', 'bounce', 'gradient'
  size = 'medium', // 'small', 'medium', 'large'
  color = '#3b82f6',
  speed = 1,
  lines = 3,
  showPercentage = true,
  progress = 0,
  text = 'Loading...',
  adaptive = true,
  theme = 'light', // 'light', 'dark', 'auto'
  animated = true,
  rounded = true,
  glowing = false,
  onComplete = null // Callback when progress reaches 100%
}) => {
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [isComplete, setIsComplete] = useState(false);
  const loaderRef = useRef(null);
  const animationRef = useRef(null);

  // Auto-progress simulation for demo
  const simulateProgress = useCallback(() => {
    if (progress === 0 && type === 'progress' && !isComplete) {
      const increment = Math.random() * 5 + 2; // 2-7% increments
      setCurrentProgress(prev => {
        const newProgress = Math.min(prev + increment, 100);
        if (newProgress >= 100 && !isComplete) {
          setIsComplete(true);
          onComplete?.();
        }
        return newProgress;
      });
    }
  }, [progress, type, isComplete, onComplete]);

  useEffect(() => {
    if (progress > 0) {
      setCurrentProgress(progress);
      if (progress >= 100 && !isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
    } else if (type === 'progress') {
      const interval = setInterval(simulateProgress, 300 / speed);
      return () => clearInterval(interval);
    }
  }, [progress, speed, type, simulateProgress, isComplete, onComplete]);

  // Reset completion state when progress changes
  useEffect(() => {
    if (progress < 100) {
      setIsComplete(false);
    }
  }, [progress]);

  const getColorVariables = () => ({
    '--primary-color': color,
    '--animation-duration': `${2 / speed}s`,
    '--glow-intensity': glowing ? '0.5' : '0'
  });

  const renderSkeleton = () => (
    <div className={`enhanced-loader skeleton ${size} ${theme}`} style={getColorVariables()}>
      {Array.from({ length: lines }, (_, i) => (
        <div 
          key={i} 
          className={`skeleton-line ${rounded ? 'rounded' : ''} ${animated ? 'animated' : ''}`}
          style={{ 
            '--delay': `${i * 0.2}s`,
            '--width': i === lines - 1 ? '60%' : i === lines - 2 ? '80%' : '100%'
          }}
        />
      ))}
    </div>
  );

  const renderProgress = () => (
    <div className={`enhanced-loader progress ${size} ${theme}`} style={getColorVariables()}>
      <div className="progress-container">
        <div className={`progress-track ${rounded ? 'rounded' : ''}`}>
          <div 
            className={`progress-fill ${glowing ? 'glowing' : ''} ${isComplete ? 'complete' : ''}`}
            style={{ 
              width: `${currentProgress}%`,
              backgroundColor: color,
              transition: `width ${0.3 / speed}s ease-out`
            }}
          >
            {animated && <div className="progress-shine" />}
          </div>
        </div>
        {showPercentage && (
          <span className={`progress-text ${isComplete ? 'complete' : ''}`} style={{ color }}>
            {Math.round(currentProgress)}%
          </span>
        )}
      </div>
      {text && <p className="progress-label">{isComplete ? 'Complete!' : text}</p>}
    </div>
  );

  const renderPulse = () => (
    <div className={`enhanced-loader pulse ${size} ${theme}`} style={getColorVariables()}>
      <div className={`pulse-circle ${glowing ? 'glowing' : ''} ${animated ? 'animated' : ''}`} />
      {text && <p className="pulse-text">{text}</p>}
    </div>
  );

  const renderShimmer = () => (
    <div className={`enhanced-loader shimmer ${size} ${theme}`} style={getColorVariables()}>
      {Array.from({ length: lines }, (_, i) => (
        <div 
          key={i}
          className={`shimmer-line ${rounded ? 'rounded' : ''} ${animated ? 'animated' : ''}`}
          style={{
            '--delay': `${i * 0.3}s`,
            '--width': i === lines - 1 ? '70%' : i === lines - 2 ? '85%' : '100%'
          }}
        />
      ))}
    </div>
  );

  const renderDots = () => (
    <div className={`enhanced-loader dots ${size} ${theme}`} style={getColorVariables()}>
      <div className="dots-container">
        {Array.from({ length: 3 }, (_, i) => (
          <div 
            key={i}
            className={`dot ${glowing ? 'glowing' : ''} ${animated ? 'animated' : ''}`}
            style={{
              '--delay': `${i * 0.2}s`,
              backgroundColor: color
            }}
          />
        ))}
      </div>
      {text && <p className="dots-text">{text}</p>}
    </div>
  );

  const renderSpinner = () => (
    <div className={`enhanced-loader spinner ${size} ${theme}`} style={getColorVariables()}>
      <div 
        className={`spinner-ring ${glowing ? 'glowing' : ''} ${animated ? 'animated' : ''}`}
        style={{
          borderTopColor: color,
          borderRightColor: `${color}40`,
          borderBottomColor: `${color}20`,
          borderLeftColor: `${color}10`
        }}
      />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );

  const renderWave = () => (
    <div className={`enhanced-loader wave ${size} ${theme}`} style={getColorVariables()}>
      <div className="wave-container">
        {Array.from({ length: 5 }, (_, i) => (
          <div 
            key={i}
            className={`wave-bar ${animated ? 'animated' : ''}`}
            style={{
              '--delay': `${i * 0.1}s`,
              backgroundColor: color
            }}
          />
        ))}
      </div>
      {text && <p className="wave-text">{text}</p>}
    </div>
  );

  const renderBounce = () => (
    <div className={`enhanced-loader bounce ${size} ${theme}`} style={getColorVariables()}>
      <div className="bounce-container">
        {Array.from({ length: 3 }, (_, i) => (
          <div 
            key={i}
            className={`bounce-ball ${glowing ? 'glowing' : ''} ${animated ? 'animated' : ''}`}
            style={{
              '--delay': `${i * 0.15}s`,
              backgroundColor: color
            }}
          />
        ))}
      </div>
      {text && <p className="bounce-text">{text}</p>}
    </div>
  );

  const renderGradient = () => (
    <div className={`enhanced-loader gradient ${size} ${theme}`} style={getColorVariables()}>
      <div 
        className={`gradient-circle ${animated ? 'animated' : ''}`}
        style={{
          background: `conic-gradient(from 0deg, ${color}, ${color}80, ${color}40, ${color})`
        }}
      />
      {text && <p className="gradient-text">{text}</p>}
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
      default: return renderSkeleton();
    }
  };

  return (
    <div 
      ref={loaderRef}
      className={`enhanced-loader-wrapper ${className} ${adaptive ? 'adaptive' : ''} ${theme}`}
    >
      {getLoader()}
    </div>
  );
};

export default EnhancedLoader;
