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
  duration = 3000, // Auto progress duration in ms
  ariaLabel = 'Loading content',
  role = 'status',
  testId = 'professional-loader'
}) => {
  // Input validation
  const validTypes = ['skeleton', 'progress', 'pulse', 'shimmer', 'dots', 'spinner', 'wave', 'bounce', 'gradient', 'ripple', 'orbit', 'matrix', 'dna'];
  const validSizes = ['small', 'medium', 'large'];
  const validThemes = ['light', 'dark', 'auto'];
  const validVariants = ['default', 'minimal', 'elegant', 'modern', 'glassmorphism', 'neon', 'retro', 'premium'];

  const safeType = validTypes.includes(type) ? type : 'skeleton';
  const safeSize = validSizes.includes(size) ? size : 'medium';
  const safeTheme = validThemes.includes(theme) ? theme : 'light';
  const safeVariant = validVariants.includes(variant) ? variant : 'default';
  const safeSpeed = Math.max(0.1, Math.min(10, speed)); // Clamp between 0.1 and 10
  const safeLines = Math.max(1, Math.min(10, lines)); // Clamp between 1 and 10
  const safeProgress = Math.max(0, Math.min(100, progress)); // Clamp between 0 and 100
  const safeDuration = Math.max(500, Math.min(30000, duration)); // Clamp between 0.5s and 30s
  const [currentProgress, setCurrentProgress] = useState(safeProgress);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isInViewport, setIsInViewport] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const loaderRef = useRef(null);
  const progressInterval = useRef(null);
  const animationFrameRef = useRef(null);
  const isUnmountedRef = useRef(false);
  const intersectionObserverRef = useRef(null);
  const performanceMetricsRef = useRef({
    startTime: 0,
    frameCount: 0,
    lastFPSCheck: 0,
    averageFPS: 60,
    droppedFrames: 0
  });
  const throttleRef = useRef(null);

  // Viewport intersection observer for performance optimization
  const setupIntersectionObserver = useCallback(() => {
    if (!loaderRef.current || !('IntersectionObserver' in window)) return;

    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isInView = entry.isIntersecting;
        setIsInViewport(isInView);
        
        // Pause animations when not visible to save resources
        if (!isInView && animated) {
          setIsPaused(true);
        } else if (isInView && animated) {
          setIsPaused(false);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    intersectionObserverRef.current.observe(loaderRef.current);
  }, [animated]);

  // Performance monitoring
  const monitorPerformance = useCallback((currentTime) => {
    const metrics = performanceMetricsRef.current;
    metrics.frameCount++;
    
    if (currentTime - metrics.lastFPSCheck >= 1000) { // Check every second
      const fps = metrics.frameCount;
      metrics.averageFPS = (metrics.averageFPS + fps) / 2;
      
      // Detect performance issues
      if (fps < 30) {
        metrics.droppedFrames++;
        console.warn(`ProfessionalLoader: Low FPS detected (${fps}). Consider reducing animation complexity.`);
      }
      
      metrics.frameCount = 0;
      metrics.lastFPSCheck = currentTime;
    }
  }, []);

  // Enhanced auto-progress with realistic timing and error handling
  const startAutoProgress = useCallback(() => {
    if (!autoProgress || safeProgress > 0 || isUnmountedRef.current) return;
    
    try {
      let elapsed = 0;
      const interval = 16; // 60fps for smoother animation
      let lastTime = performance.now();
      
      const updateProgress = (currentTime) => {
        if (isUnmountedRef.current || isPaused) return;
        
        // Performance monitoring
        monitorPerformance(currentTime);
        
        const deltaTime = currentTime - lastTime;
        elapsed += deltaTime;
        lastTime = currentTime;
        
        // Adaptive frame rate based on performance
        const targetFPS = performanceMetricsRef.current.averageFPS < 45 ? 30 : 60;
        const frameInterval = 1000 / targetFPS;
        
        if (deltaTime < frameInterval * 0.8) {
          // Skip frame if we're running too fast
          animationFrameRef.current = requestAnimationFrame(updateProgress);
          return;
        }
        
        // Realistic progress curve with multiple easing options
        const normalizedTime = Math.min(elapsed / safeDuration, 1);
        let easeProgress;
        
        switch (safeVariant) {
          case 'elegant':
            // Smooth ease-in-out with gentle acceleration
            easeProgress = normalizedTime < 0.5 
              ? 2 * normalizedTime * normalizedTime 
              : 1 - Math.pow(-2 * normalizedTime + 2, 3) / 2;
            break;
          case 'modern':
            // Bounce effect near end with spring physics
            easeProgress = normalizedTime < 0.8 
              ? normalizedTime * 1.25 
              : 1 + Math.sin((normalizedTime - 0.8) * Math.PI * 5) * 0.02;
            break;
          case 'glassmorphism':
            // Smooth glass-like flow
            easeProgress = 1 - Math.cos((normalizedTime * Math.PI) / 2);
            break;
          case 'neon':
            // Pulsating neon effect with steps
            const steps = Math.floor(normalizedTime * 10) / 10;
            easeProgress = steps + (normalizedTime % 0.1) * 10 * 0.1;
            break;
          case 'retro':
            // Stepped retro animation
            easeProgress = Math.floor(normalizedTime * 8) / 8 + 
                          (normalizedTime % 0.125) * 8 * 0.125;
            break;
          case 'premium':
            // Luxury smooth curve with anticipation
            easeProgress = normalizedTime < 0.1 
              ? normalizedTime * 0.5 
              : 0.05 + (normalizedTime - 0.1) * 1.055;
            break;
          case 'minimal':
            // Linear progression
            easeProgress = normalizedTime;
            break;
          default:
            // Ease-out cubic
            easeProgress = 1 - Math.pow(1 - normalizedTime, 3);
        }
        
        let progressPercent = Math.min(easeProgress * 100, 100);
        
        // Add subtle randomness for realism (reduced when performance is poor)
        const jitterIntensity = performanceMetricsRef.current.averageFPS > 45 ? 0.5 : 0.1;
        const jitter = (Math.random() - 0.5) * jitterIntensity;
        progressPercent = Math.max(0, Math.min(100, progressPercent + jitter));
        
        setCurrentProgress(progressPercent);
        
        if (progressPercent >= 100) {
          setIsComplete(true);
          
          // Enhanced completion handling
          try {
            onComplete?.();
            
            // Dispatch custom event for external listeners
            if (loaderRef.current) {
              const event = new CustomEvent('loaderComplete', {
                detail: { 
                  duration: elapsed,
                  type: safeType,
                  averageFPS: performanceMetricsRef.current.averageFPS
                }
              });
              loaderRef.current.dispatchEvent(event);
            }
          } catch (err) {
            console.warn('Error in onComplete callback:', err);
            setError('Completion callback failed');
          }
          
          // Auto-hide after completion with fade effect
          setTimeout(() => {
            if (!isUnmountedRef.current) {
              setIsVisible(false);
            }
          }, 1000);
        } else if (isInViewport) {
          animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    } catch (err) {
      console.error('Error starting auto-progress:', err);
      setError('Failed to start progress animation');
    }
  }, [autoProgress, safeDuration, safeProgress, onComplete]);

  // Setup intersection observer for viewport detection
  useEffect(() => {
    setupIntersectionObserver();
    
    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
        intersectionObserverRef.current = null;
      }
    };
  }, [setupIntersectionObserver]);

  // Battery and connection optimization
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    // Detect slow connections and reduce animation complexity
    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        console.info('ProfessionalLoader: Slow connection detected, optimizing animations');
        setIsPaused(true);
      }
    }

    // Battery API optimization
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        if (battery.level < 0.2 && !battery.charging) {
          console.info('ProfessionalLoader: Low battery detected, reducing animations');
          setIsPaused(true);
        }
      });
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Main progress logic
  useEffect(() => {
    performanceMetricsRef.current.startTime = performance.now();
    
    if (autoProgress && safeType === 'progress') {
      startAutoProgress();
    } else if (safeProgress >= 0) {
      setCurrentProgress(safeProgress);
      setIsComplete(safeProgress >= 100);
    }

    // Enhanced cleanup function
    return () => {
      isUnmountedRef.current = true;
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
        throttleRef.current = null;
      }
    };
  }, [safeProgress, autoProgress, safeType, startAutoProgress]);

  const getThemeClass = () => {
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const getVariantClass = () => {
    switch (safeVariant) {
      case 'minimal': return 'variant-minimal';
      case 'elegant': return 'variant-elegant';
      case 'modern': return 'variant-modern';
      case 'glassmorphism': return 'variant-glassmorphism';
      case 'neon': return 'variant-neon';
      case 'retro': return 'variant-retro';
      case 'premium': return 'variant-premium';
      default: return 'variant-default';
    }
  };

  const getStyles = () => ({
    '--primary-color': color,
    '--animation-duration': `${2 / safeSpeed}s`,
    '--glow-intensity': glowing && !isPaused ? '1' : '0',
    '--border-radius': rounded ? '8px' : '2px',
    '--performance-scale': performanceMetricsRef.current.averageFPS < 30 ? '0.5' : '1'
  });

  // Dynamic performance class calculation
  const getPerformanceClasses = () => {
    const classes = [];
    
    if (isPaused) classes.push('paused');
    if (performanceMetricsRef.current.averageFPS < 45) classes.push('low-performance');
    if (!isInViewport) classes.push('out-of-viewport');
    
    // Battery optimization
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        if (battery.level < 0.2 && !battery.charging) {
          classes.push('battery-saver');
        }
      });
    }
    
    // Connection optimization
    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        classes.push('slow-connection');
      }
    }
    
    return classes.join(' ');
  };

  const renderSkeleton = () => (
    <div className="pro-loader skeleton" role="img" aria-label="Content loading">
      {Array.from({ length: safeLines }, (_, i) => (
        <div 
          key={i} 
          className="skeleton-line"
          style={{ 
            '--delay': `${i * 0.15}s`,
            '--width': i === safeLines - 1 ? '60%' : i === safeLines - 2 ? '80%' : '100%',
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        />
      ))}
      {text && <p className="loader-text" aria-live="polite">{text}</p>}
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

  const renderOrbit = () => (
    <div className="pro-loader orbit">
      <div className="orbit-system">
        <div className="orbit-center" />
        <div className="orbit-ring orbit-ring-1">
          <div className="orbit-dot orbit-dot-1" />
        </div>
        <div className="orbit-ring orbit-ring-2">
          <div className="orbit-dot orbit-dot-2" />
        </div>
        <div className="orbit-ring orbit-ring-3">
          <div className="orbit-dot orbit-dot-3" />
        </div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  const renderMatrix = () => (
    <div className="pro-loader matrix">
      <div className="matrix-container">
        {Array.from({ length: 8 }, (_, i) => (
          <div 
            key={i} 
            className="matrix-column"
            style={{ '--delay': `${i * 0.1}s` }}
          >
            {Array.from({ length: 6 }, (_, j) => (
              <div 
                key={j} 
                className="matrix-char"
                style={{ '--char-delay': `${j * 0.05}s` }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDNA = () => (
    <div className="pro-loader dna">
      <div className="dna-helix">
        {Array.from({ length: 12 }, (_, i) => (
          <div 
            key={i} 
            className="dna-strand"
            style={{ '--strand-delay': `${i * 0.1}s` }}
          >
            <div className="dna-base dna-base-left" />
            <div className="dna-connection" />
            <div className="dna-base dna-base-right" />
          </div>
        ))}
      </div>
    </div>
  );

  const getLoader = () => {
    switch (safeType) {
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
      case 'orbit': return renderOrbit();
      case 'matrix': return renderMatrix();
      case 'dna': return renderDNA();
      default: return renderSkeleton();
    }
  };

  if (!isVisible) return null;

  // Error boundary for graceful failure
  if (error) {
    return (
      <div 
        className="pro-loader-wrapper error"
        role="alert"
        aria-label="Loading failed"
        data-testid={`${testId}-error`}
      >
        <div className="error-message">
          <span>⚠️</span>
          <span>Loading failed</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={loaderRef}
      className={`
        pro-loader-wrapper 
        ${className} 
        ${safeSize} 
        ${getThemeClass()} 
        ${getVariantClass()}
        ${getPerformanceClasses()}
        ${adaptive ? 'adaptive' : ''}
        ${animated ? 'animated' : ''}
        ${glowing ? 'glowing' : ''}
        ${isComplete ? 'complete' : ''}
        ${isPaused ? 'paused' : ''}
      `}
      style={getStyles()}
      role={role}
      aria-label={ariaLabel}
      aria-live="polite"
      aria-busy={!isComplete}
      aria-valuenow={safeType === 'progress' ? Math.round(currentProgress) : undefined}
      aria-valuemin={safeType === 'progress' ? 0 : undefined}
      aria-valuemax={safeType === 'progress' ? 100 : undefined}
      data-testid={testId}
      data-type={safeType}
      data-variant={safeVariant}
      data-progress={safeType === 'progress' ? Math.round(currentProgress) : undefined}
      data-performance={performanceMetricsRef.current.averageFPS}
      data-in-viewport={isInViewport}
      tabIndex={0}
      onFocus={() => setIsPaused(false)}
      onBlur={() => setIsPaused(true)}
    >
      {getLoader()}
    </div>
  );
};

export default ProfessionalLoader;
