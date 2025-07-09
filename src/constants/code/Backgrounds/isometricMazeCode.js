import { generateCliCommands } from '@/utils/utils';

import code from '@content/Backgrounds/IsometricMaze/isometric-maze.jsx?raw';
import tailwind from '@tailwind/Backgrounds/IsometricMaze/isometric-maze.jsx?raw';
import tsCode from '@ts-default/Backgrounds/IsometricMaze/isometric-maze.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/IsometricMaze/isometric-maze.tsx?raw';

export const IsometricMazeCode = {
  ...(generateCliCommands('Backgrounds/IsometricMaze')),
  usage: `import IsometricMaze from './IsometricMaze';
  
<IsometricMaze
  speed={.5}
  colorScheme={{
    primary: "0,0,0",
    secondary: "150,100,200",
    accent: "100,50,150",
    highlight: "200,150,255"
  }}
/>`,
  code,
  tailwind,
  tsCode,
  tsTailwind
}