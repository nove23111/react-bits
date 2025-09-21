import { useState } from 'react';
import { CodeTab, PreviewTab, TabsLayout } from '../../components/common/TabsLayout';
import { Box, Text } from '@chakra-ui/react';

import CodeExample from '../../components/code/CodeExample';
import PropTable from '../../components/common/Preview/PropTable';
import Dependencies from '../../components/code/Dependencies';
import Customize from '../../components/common/Preview/Customize';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import { smartLoader } from '../../constants/code/Animations/smartLoaderCode';
import ProfessionalLoader from '../../content/Animations/CosmicNexus/ProfessionalLoader';

const CosmicNexusDemo = () => {
  const [type, setType] = useState('matrix');
  const [size, setSize] = useState('medium');
  const [color, setColor] = useState('#3b82f6');
  const [speed, setSpeed] = useState(1);
  const [lines, setLines] = useState(3);
  const [showPercentage, setShowPercentage] = useState(true);
  const [progress, setProgress] = useState(65);
  const [text, setText] = useState('Loading...');
  const [adaptive, setAdaptive] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [animated, setAnimated] = useState(true);
  const [rounded, setRounded] = useState(true);
  const [glowing, setGlowing] = useState(false);
  const [variant, setVariant] = useState('default');
  const [autoProgress, setAutoProgress] = useState(false);
  const [duration, setDuration] = useState(3000);
  const [ariaLabel, setAriaLabel] = useState('Loading content');
  const [testId, setTestId] = useState('professional-loader');

  const propData = [
    {
      name: 'type',
      type: 'string',
      default: 'skeleton',
      description: 'Type of loader: skeleton, progress, pulse, shimmer, dots, spinner, wave, bounce, gradient, ripple, orbit, matrix, dna'
    },
    {
      name: 'size',
      type: 'string',
      default: 'medium',
      description: 'Size of the loader: small, medium, large'
    },
    {
      name: 'color',
      type: 'string',
      default: '#3b82f6',
      description: 'Primary color for the loader animation'
    },
    {
      name: 'speed',
      type: 'number',
      default: '1',
      description: 'Animation speed multiplier (0.5 = slower, 2 = faster)'
    },
    {
      name: 'lines',
      type: 'number',
      default: '3',
      description: 'Number of lines for skeleton and shimmer loaders'
    },
    {
      name: 'showPercentage',
      type: 'boolean',
      default: 'true',
      description: 'Show percentage text for progress loader'
    },
    {
      name: 'progress',
      type: 'number',
      default: '0',
      description: 'Progress value (0-100) for progress loader'
    },
    {
      name: 'text',
      type: 'string',
      default: 'Loading...',
      description: 'Text to display below the loader'
    },
    {
      name: 'adaptive',
      type: 'boolean',
      default: 'true',
      description: 'Automatically adapt to container size'
    },
    {
      name: 'variant',
      type: 'string',
      default: 'default',
      description: 'Visual variant: default, minimal, elegant, modern'
    },
    {
      name: 'autoProgress',
      type: 'boolean',
      default: 'false',
      description: 'Automatically animate progress from 0 to 100%'
    },
    {
      name: 'duration',
      type: 'number',
      default: '3000',
      description: 'Duration for auto progress animation in milliseconds'
    },
    {
      name: 'onComplete',
      type: 'function',
      default: 'null',
      description: 'Callback function when progress reaches 100%'
    }
  ];

  return (
    <TabsLayout>
      <PreviewTab>
        <Box position="relative" className="demo-container" h={500} p={0} overflow="hidden" bg={theme === 'dark' ? 'gray.900' : 'white'} borderRadius="lg" border="1px solid" borderColor={theme === 'dark' ? 'gray.700' : 'gray.200'}>
          <ProfessionalLoader
            key={`${type}-${variant}-${color}-${theme}`}
            type={type}
            size={size}
            color={color}
            speed={speed}
            lines={lines}
            showPercentage={showPercentage}
            progress={autoProgress ? 0 : progress}
            text={text}
            adaptive={adaptive}
            theme={theme}
            animated={animated}
            rounded={rounded}
            glowing={glowing}
            variant={variant}
            autoProgress={autoProgress}
            duration={duration}
            ariaLabel={ariaLabel}
            testId={testId}
            onComplete={() => console.log('Loading complete!')}
          />
        </Box>

        <Customize className="preview-options">
          <Box mb={3}>
            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">Loader Type</Text>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              style={{
                width: '160px',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: 'white',
                fontSize: '14px',
                fontFamily: 'inherit',
                color: '#374151',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease'
              }}
            >
              <option value="skeleton">Skeleton</option>
              <option value="progress">Progress</option>
              <option value="pulse">Pulse</option>
              <option value="shimmer">Shimmer</option>
              <option value="dots">Dots</option>
              <option value="spinner">Spinner</option>
              <option value="wave">Wave</option>
              <option value="bounce">Bounce</option>
              <option value="gradient">Gradient</option>
              <option value="ripple">Ripple</option>
              <option value="orbit">Orbit</option>
              <option value="matrix">Matrix</option>
              <option value="dna">DNA</option>
            </select>
          </Box>

          <Box mb={3}>
            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">Size</Text>
            <select 
              value={size} 
              onChange={(e) => setSize(e.target.value)}
              style={{
                width: '120px',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: 'white',
                fontSize: '14px',
                fontFamily: 'inherit',
                color: '#374151',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease'
              }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </Box>

          <Box mb={3}>
            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">Color</Text>
            <Box display="flex" alignItems="center" gap={2}>
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  console.log('Color changed to:', e.target.value);
                  setColor(e.target.value);
                }}
                style={{ 
                  width: '50px', 
                  height: '32px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              />
              <Text fontSize="xs" color="gray.600">{color}</Text>
            </Box>
          </Box>

          <PreviewSlider
            title="Speed"
            min={0.5}
            max={3}
            step={0.1}
            value={speed}
            onChange={val => setSpeed(val)}
            width={120}
          />

          <PreviewSlider
            title="Lines"
            min={1}
            max={6}
            step={1}
            value={lines}
            onChange={val => setLines(val)}
            width={120}
          />

          {type === 'progress' && (
            <PreviewSlider
              title="Progress"
              min={0}
              max={100}
              step={1}
              value={progress}
              onChange={val => setProgress(val)}
              width={120}
            />
          )}

          <PreviewSwitch
            title="Show Percentage"
            isChecked={showPercentage}
            onChange={checked => setShowPercentage(checked)}
          />

          <Box h="1px" bg="gray.200" my={4} />
          
          <Box mb={3}>
            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">Variant</Text>
            <select 
              value={variant} 
              onChange={(e) => setVariant(e.target.value)}
              style={{
                width: '140px',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: 'white',
                fontSize: '14px',
                fontFamily: 'inherit',
                color: '#374151',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease'
              }}
            >
              <option value="default">Default</option>
              <option value="minimal">Minimal</option>
              <option value="elegant">Elegant</option>
              <option value="modern">Modern</option>
              <option value="glassmorphism">Glassmorphism</option>
              <option value="neon">Neon</option>
              <option value="retro">Retro</option>
              <option value="premium">Premium</option>
            </select>
          </Box>

          <Box mb={3}>
            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">Theme</Text>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
              style={{
                width: '100px',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: 'white',
                fontSize: '14px',
                fontFamily: 'inherit',
                color: '#374151',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease'
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </Box>

          {type === 'progress' && (
            <>
              <PreviewSwitch
                title="Auto Progress"
                isChecked={autoProgress}
                onChange={checked => setAutoProgress(checked)}
              />
              
              {autoProgress && (
                <PreviewSlider
                  title="Duration (ms)"
                  min={1000}
                  max={10000}
                  step={500}
                  value={duration}
                  onChange={val => setDuration(val)}
                  width={120}
                />
              )}
            </>
          )}

          <Box h="1px" bg="gray.200" my={4} />

          <PreviewSwitch
            title="Adaptive Size"
            isChecked={adaptive}
            onChange={checked => setAdaptive(checked)}
          />

          <PreviewSwitch
            title="Animated"
            isChecked={animated}
            onChange={checked => setAnimated(checked)}
          />

          <PreviewSwitch
            title="Rounded Corners"
            isChecked={rounded}
            onChange={checked => setRounded(checked)}
          />

          <PreviewSwitch
            title="Glowing Effect"
            isChecked={glowing}
            onChange={checked => setGlowing(checked)}
          />
        </Customize>


        <PropTable data={propData} />
        <Dependencies dependencyList={[]} />
      </PreviewTab>

      <CodeTab>

        <CodeExample codeObject={{
          usage: `import ProfessionalLoader from './ProfessionalLoader'

// Basic ${type} loader
<ProfessionalLoader type="${type}" />

// Styled ${type} loader
<ProfessionalLoader 
  type="${type}"
  variant="${variant}"
  color="${color}"
  theme="${theme}"
${glowing ? '  glowing={true}' : ''}
${!rounded ? '  rounded={false}' : ''}
/>

${type === 'progress' ? `// Progress with auto-animation
<ProfessionalLoader 
  type="progress" 
  autoProgress={true}
  duration={${duration}}
  showPercentage={${showPercentage}}
  onComplete={() => alert('Loading complete!')}
/>` : type === 'skeleton' ? `// Multi-line skeleton
<ProfessionalLoader 
  type="skeleton" 
  lines={${lines}}
  speed={${speed}}
  variant="${variant}"
/>` : `// Custom ${type} loader
<ProfessionalLoader 
  type="${type}"
  size="${size}"
  speed={${speed}}
  variant="${variant}"
  animated={${animated}}
/>`}

// ${variant.charAt(0).toUpperCase() + variant.slice(1)} variant features
<ProfessionalLoader 
  variant="${variant}"
  type="${type}"
${variant === 'glassmorphism' ? '  theme="dark"  // Best with dark theme' : variant === 'neon' ? '  color="#00ffff"  // Bright colors work best' : variant === 'premium' ? '  color="#FFD700"  // Gold accent' : variant === 'retro' ? '  rounded={false}  // Sharp edges for retro feel' : ''}
${variant === 'neon' || variant === 'premium' ? '  glowing={true}' : ''}
/>`,
          
          code: `// JavaScript + CSS - ${type.charAt(0).toUpperCase() + type.slice(1)} ${variant !== 'default' ? `(${variant} variant)` : ''}
import React from 'react';
import './ProfessionalLoader.css';

const ${type.charAt(0).toUpperCase() + type.slice(1)}Loader = () => {
  return (
    <ProfessionalLoader
      type="${type}"${variant !== 'default' ? `
      variant="${variant}"` : ''}${color !== '#3b82f6' ? `
      color="${color}"` : ''}${size !== 'medium' ? `
      size="${size}"` : ''}${speed !== 1 ? `
      speed={${speed}}` : ''}${glowing ? `
      glowing={true}` : ''}${theme !== 'dark' ? `
      theme="${theme}"` : ''}
    />
  );
};

export default ${type.charAt(0).toUpperCase() + type.slice(1)}Loader;`,

          css: `/* CSS for ${type} loader with ${variant} variant */
.pro-loader-wrapper {
  --primary-color: ${color};
  --animation-duration: ${2 / speed}s;
  --glow-intensity: ${glowing ? '1' : '0'};
  --border-radius: ${rounded ? '8px' : '2px'};
}

${variant === 'glassmorphism' ? `/* Glassmorphism variant styles */
.pro-loader-wrapper.variant-glassmorphism {
  backdrop-filter: blur(20px) saturate(180%);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}` : variant === 'neon' ? `/* Neon variant styles */
.pro-loader-wrapper.variant-neon {
  background: #000;
  border: 2px solid var(--primary-color);
  box-shadow: 0 0 10px var(--primary-color);
  animation: neonPulse 2s ease-in-out infinite alternate;
}` : variant === 'premium' ? `/* Premium variant styles */
.pro-loader-wrapper.variant-premium {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.1);
}` : ''}

${type === 'skeleton' ? `/* Skeleton loader styles */
.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-primary) 50%, var(--bg-secondary) 75%);
  animation: skeleton-shimmer var(--animation-duration) ease-in-out infinite;
}` : type === 'progress' ? `/* Progress loader styles */
.progress-fill {
  background: var(--primary-color);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}` : type === 'spinner' ? `/* Spinner loader styles */
.spinner-circle {
  border: 3px solid var(--bg-secondary);
  border-top: 3px solid var(--primary-color);
  animation: spin var(--animation-duration) linear infinite;
}` : ''}`,

          tailwind: `// JavaScript + Tailwind - ${type.charAt(0).toUpperCase() + type.slice(1)} ${variant !== 'default' ? `(${variant} variant)` : ''}
import React from 'react';

const ${type.charAt(0).toUpperCase() + type.slice(1)}Loader = () => {
  return (
    <div className={\`
      flex items-center justify-center p-8
      ${size === 'small' ? 'w-32 h-8' : size === 'large' ? 'w-96 h-16' : 'w-64 h-12'}
      ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
      ${variant === 'glassmorphism' ? 'backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl' : 
        variant === 'neon' ? 'bg-black border-2 shadow-lg shadow-blue-500/50' : 
        variant === 'premium' ? 'bg-gradient-to-br from-yellow-50 to-transparent border border-yellow-200' : 
        rounded ? 'rounded-lg' : 'rounded-sm'}
    \`}>
      ${type === 'skeleton' ? `{Array.from({ length: ${lines} }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
      ))}` : type === 'progress' ? `<div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="h-2.5 rounded-full transition-all duration-300" 
             style={{ width: '${progress}%', backgroundColor: '${color}' }} />
      </div>` : type === 'spinner' ? `<div className="animate-spin rounded-full border-4 border-gray-200 border-t-current"
           style={{ borderTopColor: '${color}', animationDuration: '${2/speed}s' }} />` : ''}
    </div>
  );
};`,

          tsCode: `// TypeScript + CSS - ${type.charAt(0).toUpperCase() + type.slice(1)} ${variant !== 'default' ? `(${variant} variant)` : ''}
import React from 'react';
import './ProfessionalLoader.css';

interface ${type.charAt(0).toUpperCase() + type.slice(1)}LoaderProps {
  variant?: '${variant}';
  color?: string;
  size?: '${size}';
  speed?: number;
  ${type === 'skeleton' ? 'lines?: number;' : type === 'progress' ? 'progress?: number; showPercentage?: boolean;' : ''}
}

const ${type.charAt(0).toUpperCase() + type.slice(1)}Loader: React.FC<${type.charAt(0).toUpperCase() + type.slice(1)}LoaderProps> = ({
  variant = '${variant}',
  color = '${color}',
  size = '${size}',
  speed = ${speed},
  ${type === 'skeleton' ? `lines = ${lines},` : type === 'progress' ? `progress = ${progress}, showPercentage = ${showPercentage},` : ''}
}) => {
  return (
    <ProfessionalLoader
      type="${type}"
      variant={variant}
      color={color}
      size={size}
      speed={speed}
      ${type === 'skeleton' ? 'lines={lines}' : type === 'progress' ? 'progress={progress} showPercentage={showPercentage}' : ''}
    />
  );
};

export default ${type.charAt(0).toUpperCase() + type.slice(1)}Loader;`,

          tsTailwind: `// TypeScript + Tailwind - ${type.charAt(0).toUpperCase() + type.slice(1)} ${variant !== 'default' ? `(${variant} variant)` : ''}
import React from 'react';

interface ${type.charAt(0).toUpperCase() + type.slice(1)}LoaderProps {
  variant?: '${variant}';
  color?: string;
  size?: '${size}';
  ${type === 'skeleton' ? 'lines?: number;' : type === 'progress' ? 'progress?: number;' : ''}
}

const ${type.charAt(0).toUpperCase() + type.slice(1)}Loader: React.FC<${type.charAt(0).toUpperCase() + type.slice(1)}LoaderProps> = ({
  variant = '${variant}',
  color = '${color}',
  size = '${size}',
  ${type === 'skeleton' ? `lines = ${lines}` : type === 'progress' ? `progress = ${progress}` : ''}
}) => {
  const sizeClasses = size === 'small' ? 'w-32 h-8' : size === 'large' ? 'w-96 h-16' : 'w-64 h-12';
  const variantClasses = variant === 'glassmorphism' ? 'backdrop-blur-sm bg-white/10' : 
                        variant === 'neon' ? 'bg-black border-2' : 
                        'bg-white';

  return (
    <div className={\`flex items-center justify-center p-8 \${sizeClasses} \${variantClasses}\`}>
      ${type === 'skeleton' ? `{Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
      ))}` : type === 'progress' ? `<div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="h-2.5 rounded-full" style={{ width: \`\${progress}%\`, backgroundColor: color }} />
      </div>` : ''}
    </div>
  );
};`
        }} />
      </CodeTab>
    </TabsLayout>
  );
};

export default CosmicNexusDemo;
