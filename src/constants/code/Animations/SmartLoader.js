export const cosmicNexusCode = {
  jsx: `import { useEffect, useRef, useState, useCallback } from 'react';
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
  variant = 'default',
  onComplete = null,
  autoProgress = false,
  duration = 3000
}) => {
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [isComplete, setIsComplete] = useState(false);
  const loaderRef = useRef(null);

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

  return (
    <div 
      ref={loaderRef}
      className={\`pro-loader-wrapper \${className} \${size} \${theme} \${variant}\`}
      style={{
        '--primary-color': color,
        '--animation-duration': \`\${2 / speed}s\`
      }}
    >
      {getLoader()}
    </div>
  );
};

export default ProfessionalLoader;`,

  css: `.pro-loader-wrapper {
  --primary-color: #3b82f6;
  --animation-duration: 2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
}

.pro-loader.skeleton {
  width: 100%;
  max-width: 400px;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, 
    rgba(156, 163, 175, 0.1) 25%, 
    rgba(156, 163, 175, 0.3) 50%, 
    rgba(156, 163, 175, 0.1) 75%
  );
  background-size: 200% 100%;
  margin-bottom: 12px;
  border-radius: 8px;
  animation: skeleton-shimmer var(--animation-duration) ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}`
};
