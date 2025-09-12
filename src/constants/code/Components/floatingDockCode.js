import code from '@content/Components/FloatingDock/FloatingDock.jsx?raw';
import tailwind from '@tailwind/Components/FloatingDock/FloatingDock.jsx?raw';
import tsCode from '@ts-default/Components/FloatingDock/FloatingDock.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/FloatingDock/FloatingDock.tsx?raw';

export const floatingDock = {
  dependencies: `motion clsx tailwind-merge @tabler/icons-react`,
  usage: `import { FloatingDock } from '@/components/ui/floating-dock'

const links = [
  { title: 'Home', icon: <IconHome className='h-full w-full text-neutral-500 dark:text-neutral-300' />, href: '#' },
  { title: 'GitHub', icon: <IconBrandGithub className='h-full w-full text-neutral-500 dark:text-neutral-300' />, href: 'https://github.com' }
];

<FloatingDock
  // demo offset; remove in production
  mobileClassName='translate-y-20'
  items={links}
/>`,
  code,
  tailwind,
  tsTailwind,
  tsCode
};
