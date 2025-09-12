import React from 'react';
import { Box } from '@chakra-ui/react';
import { CodeTab, PreviewTab, TabsLayout } from '../../components/common/TabsLayout';
import CodeExample from '../../components/code/CodeExample';
import PropTable from '../../components/common/Preview/PropTable';
import Dependencies from '../../components/code/Dependencies';
import { floatingDock } from '../../constants/code/Components/floatingDockCode';

// Placeholder import (actual will live in external path when integrated)
import FloatingDock from '../../content/Components/FloatingDock/FloatingDock';
import { IconBrandGithub, IconBrandX, IconExchange, IconHome, IconNewSection, IconTerminal2 } from '@tabler/icons-react';

const FloatingDockDemo = () => {
  const links = [
    { title: 'Home', icon: <IconHome className='h-full w-full text-neutral-500 dark:text-neutral-300' />, href: '#' },
    { title: 'Products', icon: <IconTerminal2 className='h-full w-full text-neutral-500 dark:text-neutral-300' />, href: '#' },
    { title: 'Components', icon: <IconNewSection className='h-full w-full text-neutral-500 dark:text-neutral-300' />, href: '#' },
  { title: 'react-bits', icon: <img src='/src/assets/logos/react-bits-logo.svg' width={20} height={20} alt='react-bits Logo' />, href: '#' },
    { title: 'Changelog', icon: <IconExchange className='h-full w-full text-neutral-500 dark:text-neutral-300' />, href: '#' },
    { title: 'Twitter', icon: <IconBrandX className='h-full w-full text-neutral-500 dark:text-neutral-300' />, href: '#' },
    { title: 'GitHub', icon: <IconBrandGithub className='h-full w-full text-neutral-500 dark:text-neutral-300' />, href: 'https://github.com/winshaurya' }
  ];

  const propData = [
    { name: 'items', type: '{ title: string; icon: React.ReactNode; href: string }[]', default: '[]', description: 'Array of items to display in the dock.' },
    { name: 'desktopClassName', type: 'string', default: "''", description: 'Optional class name for the desktop dock.' },
    { name: 'mobileClassName', type: 'string', default: "''", description: 'Optional class name for the mobile dock.' }
  ];

  return (
    <TabsLayout>
      <PreviewTab>
        <Box position='relative' className='demo-container' minH={500} display='flex' alignItems='center' justifyContent='center'>
          <FloatingDock items={links} />
        </Box>
        <PropTable data={propData} />
        <Dependencies dependencyList={['motion', 'clsx', 'tailwind-merge', '@tabler/icons-react']} />
      </PreviewTab>
      <CodeTab>
        <CodeExample codeObject={floatingDock} />
      </CodeTab>
    </TabsLayout>
  );
};

export default FloatingDockDemo;
