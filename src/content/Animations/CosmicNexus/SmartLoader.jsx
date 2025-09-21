import { useEffect, useRef, useState } from 'react';
import './SmartLoader.css';

const SmartLoader = ({ 
  className = '',
  type = 'skeleton', // 'skeleton', 'progress', 'pulse', 'shimmer', 'dots'
  size = 'medium', // 'small', 'medium', 'large'
  color = '#3b82f6',
  speed = 1,
  lines = 3,
  showPercentage = true,
  progress = 0,
  text = 'Loading...',
  adaptive = true // Adapts to content size
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const loaderRef = useRef(null);

  // Simulate progress if not provided
  useEffect(() => {
    if (progress === 0 && type === 'progress') {
      const interval = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= 100) return 0; // Reset for demo
          return prev + Math.random() * 10;
        });
      }, 200 / speed);
      return () => clearInterval(interval);
    } else {
      setCurrentProgress(progress);
    }
  }, [progress, speed, type]);

  const renderSkeleton = () => (
    <div className={`smart-loader skeleton ${size}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div 
          key={i} 
          className="skeleton-line" 
          style={{ 
            '--delay': `${i * 0.2}s`,
            '--color': color,
            animationDuration: `${2 / speed}s`
          }}
        />
      ))}
    </div>
  );

  const renderProgress = () => (
    <div className={`smart-loader progress ${size}`}>
      <div className="progress-container">
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${currentProgress}%`,
              backgroundColor: color,
              transition: `width ${0.3 / speed}s ease`
            }}
          />
        </div>
        {showPercentage && (
          <span className="progress-text" style={{ color }}>
            {Math.round(currentProgress)}%
          </span>
        )}
      </div>
      {text && <p className="progress-label">{text}</p>}
    </div>
  );

  const renderPulse = () => (
    <div className={`smart-loader pulse ${size}`}>
      <div 
        className="pulse-circle"
        style={{ 
          '--color': color,
          animationDuration: `${2 / speed}s`
        }}
      />
      {text && <p className="pulse-text">{text}</p>}
    </div>
  );

  const renderShimmer = () => (
    <div className={`smart-loader shimmer ${size}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div 
          key={i}
          className="shimmer-line"
          style={{
            '--delay': `${i * 0.3}s`,
            '--color': color,
            animationDuration: `${1.5 / speed}s`
          }}
        />
      ))}
    </div>
  );

  const renderDots = () => (
    <div className={`smart-loader dots ${size}`}>
      <div className="dots-container">
        {Array.from({ length: 3 }, (_, i) => (
          <div 
            key={i}
            className="dot"
            style={{
              '--delay': `${i * 0.2}s`,
              backgroundColor: color,
              animationDuration: `${1.2 / speed}s`
            }}
          />
        ))}
      </div>
      {text && <p className="dots-text">{text}</p>}
    </div>
  );

  const renderSpinner = () => (
    <div className={`smart-loader spinner ${size}`}>
      <div 
        className="spinner-ring"
        style={{
          borderTopColor: color,
          animationDuration: `${1 / speed}s`
        }}
      />
      {text && <p className="spinner-text">{text}</p>}
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
      default: return renderSkeleton();
    }
  };

  return (
    <div 
      ref={loaderRef}
      className={`smart-loader-wrapper ${className} ${adaptive ? 'adaptive' : ''}`}
    >
      {getLoader()}
    </div>
  );
};

export default SmartLoader;
