import { generateCliCommands } from "../../../utils/utils";

export const cpuArchitecture = {
  code: `import React from "react";
import "./CpuArchitecture.css";

/**
 * CPU Architecture component that displays a visual representation of a CPU with animated paths and lights.
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional classes for the component
 * @param {string} [props.width="100%"] - Width of the SVG
 * @param {string} [props.height="100%"] - Height of the SVG
 * @param {string} [props.text="CPU"] - Text to display in the CPU box
 * @param {boolean} [props.showCpuConnections=true] - Whether to show the CPU connection rectangles
 * @param {number} [props.lineMarkerSize=18] - Size of the marker at the start of each path
 * @param {boolean} [props.animateText=true] - Whether to animate the CPU text
 * @param {boolean} [props.animateLines=true] - Whether to animate the lines
 * @param {boolean} [props.animateMarkers=true] - Whether to animate the markers
 */
const CpuArchitecture = ({
  className,
  width = "100%",
  height = "100%",
  text = "CPU",
  showCpuConnections = true,
  animateText = true,
  lineMarkerSize = 18,
  animateLines = true,
  animateMarkers = true,
}) => {
  const classNames = ["text-muted", className].filter(Boolean).join(" ");

  return (
    <svg
      className={classNames}
      width={width}
      height={height}
      viewBox="0 0 200 100"
    >
      {/* SVG content with paths, masks, and animations */}
      {/* For brevity, see full component code */}
    </svg>
  );
};

export { CpuArchitecture };
`,
  usage: `import React from "react";
import { CpuArchitecture } from "./CpuArchitecture";
import "./CpuArchitecture.css";

export default function App() {
  return (
    <div className="p-4 rounded-xl bg-black">
      <CpuArchitecture 
        text="CPU"
        showCpuConnections={true}
        animateText={true}
        animateLines={true}
        animateMarkers={true}
        lineMarkerSize={18}
        width="100%"
        height="300px"
      />
    </div>
  );
}`,
  css: `/* CpuArchitecture.css */

/* Animation for each light */
.cpu-architecture {
  animation-duration: 8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.cpu-line-1 {
  animation-name: moveBlueLine;
}

.cpu-line-2 {
  animation-name: moveYellowLine;
  animation-delay: 0.5s;
}

/* And other animation classes... */

/* Path animations */
@keyframes moveBlueLine {
  0% { transform: translate(10px, 20px); }
  50% { transform: translate(90px, 55px); }
  100% { transform: translate(10px, 20px); }
}

/* And other keyframes... */
`,
  // Generate CLI commands
  ...generateCliCommands("Components/CpuArchitecture")
}; 