import { generateCliCommands } from "@/utils/utils";

import code from "@content/TextAnimations/CurvedLoop/CurvedLoop.jsx?raw";
import css from "@content/TextAnimations/CurvedLoop/CurvedLoop.css?raw";
import tailwind from "@tailwind/TextAnimations/CurvedLoop/CurvedLoop.jsx?raw";
import tsCode from "@ts-default/TextAnimations/CurvedLoop/CurvedLoop.tsx?raw";
import tsTailwind from "@ts-tailwind/TextAnimations/CurvedLoop/CurvedLoop.tsx?raw";

export const curvedLoop = {
  ...generateCliCommands("TextAnimations/CurvedLoop"),
  usage: `import CurvedLoop from './CurvedLoop';

// Basic usage
<CurvedLoop marqueeText="Welcome to React Bits ✦" />

// With custom props
<CurvedLoop 
  marqueeText="Be ✦ Creative ✦ With ✦ React ✦ Bits ✦"
  speed={3}
  curveAmount={500}
  direction="right"
  interactive={true}
  pauseOnHover={false}
  className="custom-text-style"
/>

// Non-interactive with slower speed and pause on hover
<CurvedLoop 
  marqueeText="Smooth Curved Animation"
  speed={1}
  curveAmount={300}
  interactive={false}
  pauseOnHover={true}
/>`,

  description: `
A customizable SVG-based curved text marquee animation.

✨ **Features**:
- Looping animated text along a curved SVG path
- Adjustable speed, direction, and curve shape
- Interactive drag-to-scroll option
- Pause on hover (non-interactive mode)
- Screen reader-friendly with aria support
- Responsive SVG layout

Great for headers, hero sections, or interactive text art.`,

  code,
  css,
  tailwind,
  tsCode,
  tsTailwind,
};
