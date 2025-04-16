import React, { useId } from "react";
import "./CpuArchitecture.css";

// Simple className merging utility function since i don't have access to the cn utility
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface CpuArchitectureSvgProps {
  className?: string;
  width?: string;
  height?: string;
  text?: string;
  showCpuConnections?: boolean;
  lineMarkerSize?: number;
  animateText?: boolean;
  animateLines?: boolean;
  animateMarkers?: boolean;
}

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
}: CpuArchitectureSvgProps) => {
  // Generate unique IDs for SVG elements to prevent conflicts
  const uniqueId = useId();
  const markerId = `cpu-circle-marker-${uniqueId}`;
  const blueGradId = `cpu-blue-grad-${uniqueId}`;
  const yellowGradId = `cpu-yellow-grad-${uniqueId}`;
  const pinkishGradId = `cpu-pinkish-grad-${uniqueId}`;
  const whiteGradId = `cpu-white-grad-${uniqueId}`;
  const greenGradId = `cpu-green-grad-${uniqueId}`;
  const orangeGradId = `cpu-orange-grad-${uniqueId}`;
  const cyanGradId = `cpu-cyan-grad-${uniqueId}`;
  const roseGradId = `cpu-rose-grad-${uniqueId}`;
  const connectionGradId = `cpu-connection-gradient-${uniqueId}`;
  const textGradId = `cpu-text-gradient-${uniqueId}`;
  const shadowId = `cpu-light-shadow-${uniqueId}`;
  const mask1Id = `cpu-mask-1-${uniqueId}`;
  const mask2Id = `cpu-mask-2-${uniqueId}`;
  const mask3Id = `cpu-mask-3-${uniqueId}`;
  const mask4Id = `cpu-mask-4-${uniqueId}`;
  const mask5Id = `cpu-mask-5-${uniqueId}`;
  const mask6Id = `cpu-mask-6-${uniqueId}`;
  const mask7Id = `cpu-mask-7-${uniqueId}`;
  const mask8Id = `cpu-mask-8-${uniqueId}`;

  return (
    <svg
      className={cn("text-muted", className)}
      width={width}
      height={height}
      viewBox="0 0 200 100"
    >
      {/* Paths */}
      <g
        stroke="currentColor"
        fill="none"
        strokeWidth="0.3"
        strokeDasharray="100 100"
        pathLength="100"
        markerStart={`url(#${markerId})`}
      >
        {/* 1st */}
        <path
          strokeDasharray="100 100"
          pathLength="100"
          d="M 10 20 h 79.5 q 5 0 5 5 v 30"
        />
        {/* 2nd */}
        <path
          strokeDasharray="100 100"
          pathLength="100"
          d="M 180 10 h -69.7 q -5 0 -5 5 v 30"
        />
        {/* 3rd */}
        <path d="M 130 20 v 21.8 q 0 5 -5 5 h -10" />
        {/* 4th */}
        <path d="M 170 80 v -21.8 q 0 -5 -5 -5 h -50" />
        {/* 5th */}
        <path
          strokeDasharray="100 100"
          pathLength="100"
          d="M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20"
        />
        {/* 6th */}
        <path d="M 94.8 95 v -36" />
        {/* 7th */}
        <path d="M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14" />
        {/* 8th */}
        <path d="M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 20" />
        {/* Animation For Path Starting */}
        {animateLines && (
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="1s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.25,0.1,0.5,1"
            keyTimes="0; 1"
          />
        )}
      </g>

      {/* 1. Blue Light */}
      <g mask={`url(#${mask1Id})`}>
        <circle
          className="cpu-architecture cpu-line-1"
          cx="0"
          cy="0"
          r="8"
          fill={`url(#${blueGradId})`}
        />
      </g>
      {/* 2. Yellow Light */}
      <g mask={`url(#${mask2Id})`}>
        <circle
          className="cpu-architecture cpu-line-2"
          cx="0"
          cy="0"
          r="8"
          fill={`url(#${yellowGradId})`}
        />
      </g>
      {/* 3. Pinkish Light */}
      <g mask={`url(#${mask3Id})`}>
        <circle
          className="cpu-architecture cpu-line-3"
          cx="0"
          cy="0"
          r="8"
          fill={`url(#${pinkishGradId})`}
        />
      </g>
      {/* 4. White Light */}
      <g mask={`url(#${mask4Id})`}>
        <circle
          className="cpu-architecture cpu-line-4"
          cx="0"
          cy="0"
          r="8"
          fill={`url(#${whiteGradId})`}
        />
      </g>
      {/* 5. Green Light */}
      <g mask={`url(#${mask5Id})`}>
        <circle
          className="cpu-architecture cpu-line-5"
          cx="0"
          cy="0"
          r="8"
          fill={`url(#${greenGradId})`}
        />
      </g>
      {/* 6. Orange Light */}
      <g mask={`url(#${mask6Id})`}>
        <circle
          className="cpu-architecture cpu-line-6"
          cx="0"
          cy="0"
          r="8"
          fill={`url(#${orangeGradId})`}
        />
      </g>
      {/* 7. Cyan Light */}
      <g mask={`url(#${mask7Id})`}>
        <circle
          className="cpu-architecture cpu-line-7"
          cx="0"
          cy="0"
          r="8"
          fill={`url(#${cyanGradId})`}
        />
      </g>
      {/* 8. Rose Light */}
      <g mask={`url(#${mask8Id})`}>
        <circle
          className="cpu-architecture cpu-line-8"
          cx="0"
          cy="0"
          r="8"
          fill={`url(#${roseGradId})`}
        />
      </g>
      {/* CPU Box */}
      <g>
        {/* Cpu connections */}
        {showCpuConnections && (
          <g fill={`url(#${connectionGradId})`}>
            <rect x="93" y="37" width="2.5" height="5" rx="0.7" />
            <rect x="104" y="37" width="2.5" height="5" rx="0.7" />
            <rect
              x="116.3"
              y="44"
              width="2.5"
              height="5"
              rx="0.7"
              transform="rotate(90 116.25 45.5)"
            />
            <rect
              x="122.8"
              y="44"
              width="2.5"
              height="5"
              rx="0.7"
              transform="rotate(90 116.25 45.5)"
            />
            <rect
              x="104"
              y="16"
              width="2.5"
              height="5"
              rx="0.7"
              transform="rotate(180 105.25 39.5)"
            />
            <rect
              x="114.5"
              y="16"
              width="2.5"
              height="5"
              rx="0.7"
              transform="rotate(180 105.25 39.5)"
            />
            <rect
              x="80"
              y="-13.6"
              width="2.5"
              height="5"
              rx="0.7"
              transform="rotate(270 115.25 19.5)"
            />
            <rect
              x="87"
              y="-13.6"
              width="2.5"
              height="5"
              rx="0.7"
              transform="rotate(270 115.25 19.5)"
            />
          </g>
        )}
        {/* Main CPU Rectangle */}
        <rect
          x="85"
          y="40"
          width="30"
          height="20"
          rx="2"
          fill="#181818"
          filter={`url(#${shadowId})`}
        />
        {/* CPU Text */}
        <text
          x="92"
          y="52.5"
          fontSize="7"
          fill={animateText ? `url(#${textGradId})` : "white"}
          fontWeight="600"
          letterSpacing="0.05em"
        >
          {text}
        </text>
      </g>
      {/* Masks */}
      <defs>
        <mask id={mask1Id}>
          <path
            d="M 10 20 h 79.5 q 5 0 5 5 v 24"
            strokeWidth="0.5"
            stroke="white"
          />
        </mask>
        <mask id={mask2Id}>
          <path
            d="M 180 10 h -69.7 q -5 0 -5 5 v 24"
            strokeWidth="0.5"
            stroke="white"
          />
        </mask>
        <mask id={mask3Id}>
          <path
            d="M 130 20 v 21.8 q 0 5 -5 5 h -10"
            strokeWidth="0.5"
            stroke="white"
          />
        </mask>
        <mask id={mask4Id}>
          <path
            d="M 170 80 v -21.8 q 0 -5 -5 -5 h -50"
            strokeWidth="0.5"
            stroke="white"
          />
        </mask>
        <mask id={mask5Id}>
          <path
            d="M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20"
            strokeWidth="0.5"
            stroke="white"
          />
        </mask>
        <mask id={mask6Id}>
          <path d="M 94.8 95 v -36" strokeWidth="0.5" stroke="white" />
        </mask>
        <mask id={mask7Id}>
          <path
            d="M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14"
            strokeWidth="0.5"
            stroke="white"
          />
        </mask>
        <mask id={mask8Id}>
          <path
            d="M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 20"
            strokeWidth="0.5"
            stroke="white"
          />
        </mask>
        {/* Gradients */}
        <radialGradient id={blueGradId} fx="1">
          <stop offset="0%" stopColor="#00E8ED" />
          <stop offset="50%" stopColor="#08F" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={yellowGradId} fx="1">
          <stop offset="0%" stopColor="#FFD800" />
          <stop offset="50%" stopColor="#FFD800" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={pinkishGradId} fx="1">
          <stop offset="0%" stopColor="#830CD1" />
          <stop offset="50%" stopColor="#FF008B" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={whiteGradId} fx="1">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={greenGradId} fx="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={orangeGradId} fx="1">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={cyanGradId} fx="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={roseGradId} fx="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter
          id={shadowId}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feDropShadow
            dx="1.5"
            dy="1.5"
            stdDeviation="1"
            floodColor="black"
            floodOpacity="0.1"
          />
        </filter>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth={lineMarkerSize}
          markerHeight={lineMarkerSize}
        >
          <circle
            id="innerMarkerCircle"
            cx="5"
            cy="5"
            r="2"
            fill="black"
            stroke="#232323"
            strokeWidth="0.5"
          >
            {animateMarkers && (
              <animate attributeName="r" values="0; 3; 2" dur="0.5s" />
            )}
          </circle>
        </marker>
        {/* Cpu connection gradient */}
        <linearGradient
          id={connectionGradId}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#4F4F4F" />
          <stop offset="60%" stopColor="#121214" />
        </linearGradient>
        {/* Add CPU Text Gradient */}
        <linearGradient id={textGradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#666666">
            <animate
              attributeName="offset"
              values="-2; -1; 0"
              dur="5s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0; 0.5; 1"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
            />
          </stop>
          <stop offset="25%" stopColor="white">
            <animate
              attributeName="offset"
              values="-1; 0; 1"
              dur="5s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0; 0.5; 1"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
            />
          </stop>
          <stop offset="50%" stopColor="#666666">
            <animate
              attributeName="offset"
              values="0; 1; 2;"
              dur="5s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0; 0.5; 1"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
            />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

export { CpuArchitecture }; 