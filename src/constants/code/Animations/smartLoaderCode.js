import code from '@content/Animations/CosmicNexus/ProfessionalLoader.jsx?raw';
import css from '@content/Animations/CosmicNexus/ProfessionalLoader.css?raw';
import tailwind from '@tailwind/Animations/CosmicNexus/ProfessionalLoader.jsx?raw';
import tsCode from '@ts-default/Animations/CosmicNexus/ProfessionalLoader.tsx?raw';

export const smartLoader = {
  usage: `import ProfessionalLoader from './ProfessionalLoader'
  
<ProfessionalLoader
  type="skeleton"
  size="medium"
  color="#3b82f6"
  speed={1}
  theme="dark"
  variant="default"
  animated={true}
  glowing={false}
/>

// Progress loader with auto animation
<ProfessionalLoader
  type="progress"
  autoProgress={true}
  duration={3000}
  onComplete={() => console.log('Done!')}
/>

// Custom styled loader
<ProfessionalLoader
  type="spinner"
  variant="elegant"
  color="#8b5cf6"
  glowing={true}
  size="large"
/>`,
  code,
  css,
  tailwind,
  tsCode
};
