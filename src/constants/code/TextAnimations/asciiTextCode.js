import code from '@content/TextAnimations/AsciiText/AsciiText.jsx?raw';
import tailwind from '@tailwind/TextAnimations/AsciiText/AsciiText.jsx?raw';
import tsCode from '@ts-default/TextAnimations/AsciiText/AsciiText.tsx?raw';
import tsTailwind from '@ts-tailwind/TextAnimations/AsciiText/AsciiText.tsx?raw';

export const asciiText = {
  dependencies: `three`,
  usage: `// Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE
  
import AsciiText from './AsciiText';

<AsciiText
  text='hello_world'
  enableWaves={true}
  asciiFontSize={8}
/>`,
  code,
  tailwind,
  tsCode,
  tsTailwind
};
