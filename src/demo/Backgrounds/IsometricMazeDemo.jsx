import { CodeTab, PreviewTab, CliTab, TabbedLayout } from "../../components/common/TabbedLayout";
import { Box, Flex, Text } from "@chakra-ui/react";

import CodeExample from "../../components/code/CodeExample";
import CliInstallation from "../../components/code/CliInstallation";
import PropTable from "../../components/common/Preview/PropTable";
import Dependencies from '../../components/code/Dependencies';

import { useState } from "react";
import useForceRerender from "../../hooks/useForceRerender";
import IsometricMaze from "../../content/Backgrounds/IsometricMaze/isometric-maze";
import { IsometricMazeCode } from "../../constants/code/Backgrounds/isometricMazeCode";
import PreviewSlider from "../../components/common/Preview/PreviewSlider";
import Customize from "../../components/common/Preview/Customize";

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r},${g},${b}`;
  }
  return '150,100,200';
};

const rgbToHex = (rgb) => {
  const [r, g, b] = rgb.split(',').map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const IsometricMazeDemo = () => {
    const [color1, setColor1] = useState('186,85,211');
    const [color2, setColor2] = useState('0,255,255');
    const [color3, setColor3] = useState('255,215,0');
    const [color4, setColor4] = useState('255,105,180');

  const [speed, setSpeed] = useState(0.3);

  const [key, forceRerender] = useForceRerender();

  const propData = [
    {
      name: "speed",
      type: "number",
      default: "1",
      description: "Controls the animation speed.",
    },
    {
      name: "colorScheme",
      type: "object",
      default: "{ primary: '0,255,255', secondary: '255,0,255', accent: '255,255,0', highlight: '255,255,255' }",
      description: "Color scheme object.",
    },
    {
      name: "colorScheme.primary",
      type: "string",
      default: "'0,255,255'",
      description: "Primary color for the gradient.",
    },
    {
      name: "colorScheme.secondary", 
      type: "string",
      default: "'255,0,255'",
      description: "Secondary color for the gradient.",
    },
    {
      name: "colorScheme.accent",
      type: "string", 
      default: "'255,255,0'",
      description: "Accent color.",
    },
    {
      name: "colorScheme.highlight",
      type: "string",
      default: "'255,255,255'",
      description: "Highlight color.",
    },
  ];

  return (
    <TabbedLayout>
      <PreviewTab>
        <Box position="relative" className="demo-container" h={500} p={0} overflow="hidden">
          <IsometricMaze key={key} speed={speed} colorScheme={{ primary: color1, secondary: color2, accent: color3, highlight: color4 }} />
        </Box>

        <Customize>
          <Flex gap={4} mb={2}>
            <Flex alignItems="center">
              <Text mr={2}>Primary</Text>
              <input
                type="color"
                value={rgbToHex(color1)}
                style={{ height: '22px', outline: 'none', border: 'none' }}
                onChange={(e) => {
                  setColor1(hexToRgb(e.target.value));
                  forceRerender();
                }}
              />
            </Flex>

            <Flex alignItems="center">
              <Text mr={2}>Secondary</Text>
              <input
                type="color"
                value={rgbToHex(color2)}
                style={{ height: '22px', outline: 'none', border: 'none' }}
                onChange={(e) => {
                  setColor2(hexToRgb(e.target.value));
                  forceRerender();
                }}
              />
            </Flex>

            <Flex alignItems="center">
              <Text mr={2}>Accent</Text>
              <input
                type="color"
                value={rgbToHex(color3)}
                style={{ height: '22px', outline: 'none', border: 'none' }}
                onChange={(e) => {
                  setColor3(hexToRgb(e.target.value));
                  forceRerender();
                }}
              />
            </Flex>

            <Flex alignItems="center">
              <Text mr={2}>Highlight</Text>
              <input
                type="color"
                value={rgbToHex(color4)}
                style={{ height: '22px', outline: 'none', border: 'none' }}
                onChange={(e) => {
                  setColor4(hexToRgb(e.target.value));
                  forceRerender();
                }}
              />
            </Flex>
          </Flex>

          <PreviewSlider
            title="Speed"
            min={0}
            max={2}
            step={0.1}
            value={speed}
            onChange={(val) => {
              setSpeed(val);
              forceRerender();
            }}
          />
        </Customize>

        <PropTable data={propData} />
      </PreviewTab>

      <CodeTab>
        <CodeExample codeObject={IsometricMazeCode} />
      </CodeTab>

      <CliTab>
        <CliInstallation {...IsometricMazeCode} />
      </CliTab>
    </TabbedLayout>
  );
};

export default IsometricMazeDemo;