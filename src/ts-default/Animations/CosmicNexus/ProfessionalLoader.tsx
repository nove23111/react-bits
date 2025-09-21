import { useEffect, useRef, useState, useCallback } from 'react';
import './ProfessionalLoader.css';

interface ProfessionalLoaderProps {
  className?: string;
  type?: 'skeleton' | 'progress' | 'pulse' | 'shimmer' | 'dots' | 'spinner' | 'wave' | 'bounce' | 'gradient' | 'ripple';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  speed?: number;
  lines?: number;
  showPercentage?: boolean;
  progress?: number;
  text?: string;
  adaptive?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  animated?: boolean;
  rounded?: boolean;
  glowing?: boolean;
  variant?: 'default' | 'minimal' | 'elegant' | 'modern';
  onComplete?: (() => void) | null;
  autoProgress?: boolean;
  duration?: number;
}

const ProfessionalLoader: React.FC<ProfessionalLoaderProps> = ({ 
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
  const [currentProgress, setCurrentProgress] = useState<number>(progress);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

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
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
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

  const getThemeClass = (): string => {
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const getVariantClass = (): string => {
    switch (variant) {
      case 'minimal': return 'variant-minimal';
      case 'elegant': return 'variant-elegant';
      case 'modern': return 'variant-modern';
      default: return 'variant-default';
    }
  };

  const getStyles = (): React.CSSProperties => ({
    '--primary-color': color,
    '--animation-duration': `${2 / speed}s`,
    '--glow-intensity': glowing ? '1' : '0',
    '--border-radius': rounded ? '8px' : '2px'
  } as React.CSSProperties);

  const renderSkeleton = (): JSX.Element => (
    <div className="pro-loader skeleton">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton-line" />
      ))}
    </div>
  );

  const renderProgress = (): JSX.Element => (
    <div className="pro-loader progress">
      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{ width: `${currentProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="progress-text">
          {Math.round(currentProgress)}%
        </div>
      )}
      {text && <div className="loader-text">{text}</div>}
    </div>
  );

  const renderSpinner = (): JSX.Element => (
    <div className="pro-loader spinner">
      <div className="spinner-circle" />
      {text && <div className="loader-text">{text}</div>}
    </div>
  );

  const renderDots = (): JSX.Element => (
    <div className="pro-loader dots">
      <div className="dots-container">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="dot" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
      {text && <div className="loader-text">{text}</div>}
    </div>
  );

  const renderPulse = (): JSX.Element => (
    <div className="pro-loader pulse">
      <div className="pulse-circle" />
      {text && <div className="loader-text">{text}</div>}
    </div>
  );

  const getLoader = (): JSX.Element => {
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
