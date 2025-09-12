/**
 * Floating Dock (TypeScript)
 * Desktop: typically fixed bottom center; Mobile: bottom-right toggle.
 */
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { IconLayoutNavbarCollapse } from '@tabler/icons-react';
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform
} from 'motion/react';

export interface FloatingDockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

export interface FloatingDockProps {
  items: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({ items, desktopClassName, mobileClassName }) => (
  <>
    <FloatingDockDesktop items={items} className={desktopClassName} />
    <FloatingDockMobile items={items} className={mobileClassName} />
  </>
);

// Mobile (expandable) dock
const FloatingDockMobile: React.FC<{ items: FloatingDockItem[]; className?: string }> = ({ items, className }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn('relative block md:hidden', className)}>
      <AnimatePresence>
        {open && (
          <motion.div layoutId="nav" className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2">
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { delay: idx * 0.05 } }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href}
                  aria-label={item.title}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900"
                >
                  <div className="h-4 w-4">{item.icon}</div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        onClick={() => setOpen(o => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800"
      >
        <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

// Desktop (hover magnification) dock
const FloatingDockDesktop: React.FC<{ items: FloatingDockItem[]; className?: string }> = ({ items, className }) => {
  const mouseX = useMotionValue<number>(Number.POSITIVE_INFINITY);
  return (
    <motion.div
      onMouseMove={e => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className={cn(
        'mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-gray-50 px-4 pb-3 md:flex dark:bg-neutral-900',
        className
      )}
    >
      {items.map(item => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

interface IconContainerProps extends FloatingDockItem {
  mouseX: MotionValue<number>;
}

function IconContainer({ mouseX, title, icon, href }: IconContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const distance = useTransform(mouseX, val => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Number.POSITIVE_INFINITY;
    return val - (bounds.left + bounds.width / 2);
  });

  const widthRange: [number, number, number] = [40, 80, 40];
  const iconRange: [number, number, number] = [20, 40, 20];

  const widthSpring = useSpring(useTransform(distance, [-150, 0, 150], widthRange), {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });
  const heightSpring = useSpring(useTransform(distance, [-150, 0, 150], widthRange), {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });
  const iconWidth = useSpring(useTransform(distance, [-150, 0, 150], iconRange), {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });
  const iconHeight = useSpring(useTransform(distance, [-150, 0, 150], iconRange), {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href} aria-label={title}>
      <motion.div
        ref={ref}
        style={{ width: widthSpring, height: heightSpring }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 2, x: '-50%' }}
              className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div style={{ width: iconWidth, height: iconHeight }} className="flex items-center justify-center">
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}

export default FloatingDock;
