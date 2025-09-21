import { useEffect, useRef, useState, useCallback } from 'react';

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
  ariaLabel?: string;
  role?: string;
  testId?: string;
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
  duration = 3000,
  ariaLabel = 'Loading content',
  role = 'status',
  testId = 'professional-loader'
}) => {
  // Input validation
  const validTypes = ['skeleton', 'progress', 'pulse', 'shimmer', 'dots', 'spinner', 'wave', 'bounce', 'gradient', 'ripple'];
  const validSizes = ['small', 'medium', 'large'];
  const validThemes = ['light', 'dark', 'auto'];
  const validVariants = ['default', 'minimal', 'elegant', 'modern'];

  const safeType = validTypes.includes(type) ? type : 'skeleton';
  const safeSize = validSizes.includes(size) ? size : 'medium';
  const safeTheme = validThemes.includes(theme) ? theme : 'light';
  const safeVariant = validVariants.includes(variant) ? variant : 'default';
  const safeSpeed = Math.max(0.1, Math.min(10, speed));
  const safeLines = Math.max(1, Math.min(10, lines));
  const safeProgress = Math.max(0, Math.min(100, progress));
  const safeDuration = Math.max(500, Math.min(30000, duration));

  const [currentProgress, setCurrentProgress] = useState<number>(safeProgress);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isInViewport, setIsInViewport] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isUnmountedRef = useRef<boolean>(false);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const performanceMetricsRef = useRef({
    startTime: 0,
    frameCount: 0,
    lastFPSCheck: 0,
    averageFPS: 60,
    droppedFrames: 0
  });

  // Enhanced auto-progress with realistic timing
  const startAutoProgress = useCallback(() => {
    if (!autoProgress || safeProgress > 0 || isUnmountedRef.current) return;
    
    try {
      let elapsed = 0;
      let lastTime = performance.now();
      
      const updateProgress = (currentTime: number) => {
        if (isUnmountedRef.current || isPaused) return;
        
        const deltaTime = currentTime - lastTime;
        elapsed += deltaTime;
        lastTime = currentTime;
        
        const normalizedTime = Math.min(elapsed / safeDuration, 1);
        let easeProgress: number;
        
        switch (safeVariant) {
          case 'elegant':
            easeProgress = normalizedTime < 0.5 
              ? 2 * normalizedTime * normalizedTime 
              : 1 - Math.pow(-2 * normalizedTime + 2, 3) / 2;
            break;
          case 'modern':
            easeProgress = normalizedTime < 0.8 
              ? normalizedTime * 1.25 
              : 1 + Math.sin((normalizedTime - 0.8) * Math.PI * 5) * 0.02;
            break;
          default:
            easeProgress = 1 - Math.pow(1 - normalizedTime, 3);
        }
        
        let progressPercent = Math.min(easeProgress * 100, 100);
        const jitter = (Math.random() - 0.5) * 0.5;
        progressPercent = Math.max(0, Math.min(100, progressPercent + jitter));
        
        setCurrentProgress(progressPercent);
        
        if (progressPercent >= 100) {
          setIsComplete(true);
          try {
            onComplete?.();
          } catch (err) {
            console.warn('Error in onComplete callback:', err);
            setError('Completion callback failed');
          }
          
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
  }, [autoProgress, safeDuration, safeProgress, onComplete, isPaused, isInViewport, safeVariant]);

  useEffect(() => {
    if (autoProgress && safeType === 'progress') {
      startAutoProgress();
    } else if (safeProgress >= 0) {
      setCurrentProgress(safeProgress);
      setIsComplete(safeProgress >= 100);
    }

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
    };
  }, [safeProgress, autoProgress, safeType, startAutoProgress]);

  const getSizeClasses = (): string => {
    switch (safeSize) {
      case 'small': return 'w-32 h-8 text-xs';
      case 'large': return 'w-96 h-16 text-lg';
      default: return 'w-64 h-12 text-sm';
    }
  };

  const getThemeClasses = (): string => {
    if (safeTheme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-900';
    }
    return safeTheme === 'dark' 
      ? 'bg-gray-900 text-white' 
      : 'bg-white text-gray-900';
  };

  const getVariantClasses = (): string => {
    switch (safeVariant) {
      case 'minimal': return 'p-4';
      case 'elegant': return 'bg-gradient-to-br from-blue-50 to-transparent rounded-lg';
      case 'modern': return 'backdrop-blur-sm border border-white/10 rounded-2xl';
      default: return '';
    }
  };

  const renderSkeleton = (): React.ReactElement => (
    <div className={`w-full max-w-md space-y-3 ${getThemeClasses()}`} role="img" aria-label="Content loading">
      {Array.from({ length: safeLines }, (_, i) => (
        <div
          key={i}
          className={`h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse ${
            rounded ? 'rounded-lg' : 'rounded-sm'
          } ${glowing ? 'shadow-lg shadow-blue-500/20' : ''}`}
          style={{
            animationDuration: `${2 / safeSpeed}s`,
            animationPlayState: isPaused ? 'paused' : 'running',
            width: i === safeLines - 1 ? '75%' : i === safeLines - 2 ? '90%' : '100%'
          }}
        />
      ))}
      {text && <p className="text-center mt-3 opacity-75 text-sm" aria-live="polite">{text}</p>}
    </div>
  );

  const renderProgress = (): React.ReactElement => (
    <div className={`w-full max-w-md ${getThemeClasses()}`}>
      <div className={`w-full bg-gray-200 ${rounded ? 'rounded-full' : 'rounded-sm'} h-2.5 mb-3 overflow-hidden`}>
        <div
          className={`h-2.5 transition-all duration-300 ease-out ${rounded ? 'rounded-full' : 'rounded-sm'} ${
            glowing ? 'shadow-lg shadow-blue-500/50' : ''
          } ${isComplete ? 'animate-pulse' : ''}`}
          style={{
            width: `${currentProgress}%`,
            backgroundColor: color,
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        />
      </div>
      {showPercentage && (
        <div className="text-center font-medium mb-2">
          {Math.round(currentProgress)}%
        </div>
      )}
      {text && <div className="text-center text-xs opacity-75" aria-live="polite">{text}</div>}
    </div>
  );

  const renderSpinner = (): React.ReactElement => (
    <div className="flex flex-col items-center space-y-3">
      <div
        className={`animate-spin ${getSizeClasses()} border-4 border-gray-200 ${
          rounded ? 'rounded-full' : 'rounded-sm'
        } ${glowing ? 'shadow-lg shadow-blue-500/30' : ''}`}
        style={{
          borderTopColor: color,
          animationDuration: `${2 / safeSpeed}s`,
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      />
      {text && <div className="text-sm opacity-75" aria-live="polite">{text}</div>}
    </div>
  );

  const renderDots = (): React.ReactElement => (
    <div className="flex items-center space-x-2">
      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          className={`w-3 h-3 animate-bounce ${rounded ? 'rounded-full' : 'rounded-sm'} ${
            glowing ? 'shadow-lg shadow-blue-500/40' : ''
          }`}
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${2 / safeSpeed}s`,
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        />
      ))}
      {text && <span className="ml-3 text-sm opacity-75" aria-live="polite">{text}</span>}
    </div>
  );

  const renderPulse = (): React.ReactElement => (
    <div className="flex flex-col items-center space-y-3">
      <div
        className={`${getSizeClasses()} animate-pulse ${rounded ? 'rounded-lg' : 'rounded-sm'} ${
          glowing ? 'shadow-lg shadow-blue-500/30' : ''
        }`}
        style={{
          backgroundColor: color,
          animationDuration: `${2 / safeSpeed}s`,
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      />
      {text && <div className="text-sm opacity-75" aria-live="polite">{text}</div>}
    </div>
  );

  const getLoader = (): React.ReactElement => {
    switch (safeType) {
      case 'skeleton': return renderSkeleton();
      case 'progress': return renderProgress();
      case 'pulse': return renderPulse();
      case 'spinner': return renderSpinner();
      case 'dots': return renderDots();
      default: return renderSkeleton();
    }
  };

  if (!isVisible) return null;

  // Error boundary for graceful failure
  if (error) {
    return (
      <div 
        className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
        role="alert"
        aria-label="Loading failed"
        data-testid={`${testId}-error`}
      >
        <div className="flex items-center space-x-2">
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
        flex items-center justify-center w-full h-full p-8
        ${className}
        ${getSizeClasses()}
        ${getThemeClasses()}
        ${getVariantClasses()}
        ${adaptive ? 'min-h-0' : ''}
        ${animated ? '' : 'animate-none'}
        ${isComplete ? 'opacity-75' : ''}
        ${isPaused ? 'opacity-50' : ''}
        font-sans
      `}
      style={{
        '--primary-color': color,
        '--animation-duration': `${2 / safeSpeed}s`
      } as React.CSSProperties}
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
      tabIndex={0}
      onFocus={() => setIsPaused(false)}
      onBlur={() => setIsPaused(true)}
    >
      {getLoader()}
    </div>
  );
};

export default ProfessionalLoader;
