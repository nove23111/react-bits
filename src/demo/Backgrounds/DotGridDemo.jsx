import { useState } from 'react';
import { CodeTab, PreviewTab, TabsLayout } from '../../components/common/TabsLayout';
import { Box, Flex, Input, Text } from '@chakra-ui/react';

import Customize from '../../components/common/Preview/Customize';
import CodeExample from '../../components/code/CodeExample';

import PropTable from '../../components/common/Preview/PropTable';
import Dependencies from '../../components/code/Dependencies';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import BackgroundContent from '../../components/common/Preview/BackgroundContent';

import { dotGrid } from '../../constants/code/Backgrounds/dotGridCode';
import DotGrid from '../../content/Backgrounds/DotGrid/DotGrid';

const DotGridDemo = () => {
  const [dotSize] = useState(5);
  const [gap] = useState(15);
  const [baseColor] = useState('#271E37');
  const [activeColor] = useState('#5227FF');
  const [proximity] = useState(120);
  const [shockRadius] = useState(250);
  const [shockStrength] = useState(5);
  const [resistance] = useState(750);
  const [returnDuration] = useState(1.5);

  const propData = [
    {
      name: 'dotSize',
      type: 'number',
      default: '16',
      description: 'Size of each dot in pixels.'
    },
    {
      name: 'gap',
      type: 'number',
      default: '32',
      description: 'Gap between each dot in pixels.'
    },
    {
      name: 'baseColor',
      type: 'string',
      default: "'#5227FF'",
      description: 'Base color of the dots.'
    },
    {
      name: 'activeColor',
      type: 'string',
      default: "'#5227FF'",
      description: 'Color of dots when hovered or activated.'
    },
    {
      name: 'proximity',
      type: 'number',
      default: '150',
      description: 'Radius around the mouse pointer within which dots react.'
    },
    {
      name: 'speedTrigger',
      type: 'number',
      default: '100',
      description: 'Mouse speed threshold to trigger inertia effect.'
    },
    {
      name: 'shockRadius',
      type: 'number',
      default: '250',
      description: 'Radius of the shockwave effect on click.'
    },
    {
      name: 'shockStrength',
      type: 'number',
      default: '5',
      description: 'Strength of the shockwave effect on click.'
    },
    {
      name: 'maxSpeed',
      type: 'number',
      default: '5000',
      description: 'Maximum speed for inertia calculation.'
    },
    {
      name: 'resistance',
      type: 'number',
      default: '750',
      description: 'Resistance for the inertia effect.'
    },
    {
      name: 'returnDuration',
      type: 'number',
      default: '1.5',
      description: 'Duration for dots to return to their original position after inertia.'
    },
    {
      name: 'className',
      type: 'string',
      default: "''",
      description: 'Additional CSS classes for the component.'
    },
    {
      name: 'style',
      type: 'React.CSSProperties',
      default: '{}',
      description: 'Inline styles for the component.'
    }
  ];
  
  return (
    <Box position="relative" w="100%" h="100vh" overflow="hidden" bg="#0F0D13">
      <DotGrid
        dotSize={dotSize}
        gap={gap}
        baseColor={baseColor}
        activeColor={activeColor}
        proximity={proximity}
        shockRadius={shockRadius}
        shockStrength={shockStrength}
        resistance={resistance}
        returnDuration={returnDuration}
      />
    </Box>
  );
};

export default DotGridDemo;
