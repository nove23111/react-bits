import { useState } from 'react';
import { CodeTab, PreviewTab, TabsLayout } from '../../components/common/TabsLayout';
import { Box, Text } from '@chakra-ui/react';

import CodeExample from '../../components/code/CodeExample';
import PropTable from '../../components/common/Preview/PropTable';
import Dependencies from '../../components/code/Dependencies';
import Customize from '../../components/common/Preview/Customize';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import { cosmicNexusCode } from '../../constants/code/Animations/SmartLoader';
import ProfessionalLoader from '../../content/Animations/CosmicNexus/ProfessionalLoader';

const CosmicNexusDemo = () => {
  const [type, setType] = useState('skeleton');
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

  const propData = [
    {
      name: 'type',
      type: 'string',
      default: 'skeleton',
      description: 'Type of loader: skeleton, progress, pulse, shimmer, dots, spinner, wave, bounce, gradient, ripple'
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
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ 
                width: '80px', 
                height: '32px', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            />
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
        <CodeExample codeObject={cosmicNexusCode} />
      </CodeTab>
    </TabsLayout>
  );
};

export default CosmicNexusDemo;
