import { useState } from "react";
import { CodeTab, PreviewTab, CliTab, TabbedLayout } from "../../components/common/TabbedLayout";
import { Box, Input, FormLabel, FormControl } from "@chakra-ui/react";

import PreviewSwitch from "../../components/common/PreviewSwitch";
import Customize from "../../components/common/Customize";
import PreviewSlider from "../../components/common/PreviewSlider";
import CodeExample from "../../components/code/CodeExample";
import Dependencies from "../../components/code/Dependencies";
import PropTable from "../../components/common/PropTable";
import CliInstallation from "../../components/code/CliInstallation";

import { CpuArchitecture } from "../../content/Components/CpuArchitecture/CpuArchitecture";
import { cpuArchitecture } from "../../constants/code/Components/cpuArchitectureCode";

const CpuArchitectureDemo = () => {
  // State for customizable props
  const [text, setText] = useState("CPU");
  const [showCpuConnections, setShowCpuConnections] = useState(true);
  const [animateText, setAnimateText] = useState(true);
  const [animateLines, setAnimateLines] = useState(true);
  const [animateMarkers, setAnimateMarkers] = useState(true);
  const [lineMarkerSize, setLineMarkerSize] = useState(18);

  // PropTable data
  const propData = [
    {
      name: "className",
      type: "string",
      default: "undefined",
      description: "Additional CSS classes for the component."
    },
    {
      name: "width",
      type: "string",
      default: "100%",
      description: "Width of the SVG."
    },
    {
      name: "height",
      type: "string",
      default: "100%",
      description: "Height of the SVG."
    },
    {
      name: "text",
      type: "string",
      default: "CPU",
      description: "Text to display inside the CPU box."
    },
    {
      name: "showCpuConnections",
      type: "boolean",
      default: "true",
      description: "Whether to show the CPU connection rectangles."
    },
    {
      name: "lineMarkerSize",
      type: "number",
      default: "18",
      description: "Size of the circle markers at the beginning of each path."
    },
    {
      name: "animateText",
      type: "boolean",
      default: "true",
      description: "Whether to animate the CPU text with a gradient effect."
    },
    {
      name: "animateLines",
      type: "boolean",
      default: "true",
      description: "Whether to animate the lines drawing effect."
    },
    {
      name: "animateMarkers",
      type: "boolean",
      default: "true",
      description: "Whether to animate the circle markers."
    }
  ];

  return (
    <TabbedLayout>
      <PreviewTab>
        <Box position="relative" className="demo-container" minH={300} overflow="hidden" bg="black" p={8} borderRadius="xl">
          <CpuArchitecture
            text={text}
            showCpuConnections={showCpuConnections}
            animateText={animateText}
            animateLines={animateLines}
            animateMarkers={animateMarkers}
            lineMarkerSize={lineMarkerSize}
            width="100%"
            height="300px"
          />
        </Box>

        <Customize className="preview-options">
          <FormControl>
            <FormLabel>CPU Text</FormLabel>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              mb={4}
            />
          </FormControl>

          <PreviewSlider
            title="Marker Size"
            min={5}
            max={30}
            step={1}
            value={lineMarkerSize}
            onChange={setLineMarkerSize}
          />

          <PreviewSwitch 
            title="Show CPU Connections" 
            isChecked={showCpuConnections} 
            onChange={(e) => { setShowCpuConnections(e.target.checked); }} 
          />
          
          <PreviewSwitch 
            title="Animate Text" 
            isChecked={animateText} 
            onChange={(e) => { setAnimateText(e.target.checked); }} 
          />
          
          <PreviewSwitch 
            title="Animate Lines" 
            isChecked={animateLines} 
            onChange={(e) => { setAnimateLines(e.target.checked); }} 
          />
          
          <PreviewSwitch 
            title="Animate Markers" 
            isChecked={animateMarkers} 
            onChange={(e) => { setAnimateMarkers(e.target.checked); }} 
          />
        </Customize>

        <PropTable data={propData} />
        <Dependencies dependencyList={[]} />
      </PreviewTab>

      <CodeTab>
        <CodeExample codeObject={cpuArchitecture} />
      </CodeTab>

      <CliTab>
        <CliInstallation {...cpuArchitecture} />
      </CliTab>
    </TabbedLayout>
  );
};

export default CpuArchitectureDemo; 