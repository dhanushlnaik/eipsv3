import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10',
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href={item?.link}
          key={item?.link}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-r from-gray-700 via-gray-900 to-black dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-900 dark:to-black block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl h-full w-full p-4 overflow-hidden bg-gradient-to-l from-white/10 via-white/10 to-transparent backdrop-filter backdrop-blur-[42%] border-[1px] border-white/30 group-hover:border-white/60 relative z-20',
        className
      )}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none border-[1px] border-white/40 group-hover:border-white/70"
        style={{
          maskImage:
            'radial-gradient(circle, rgba(255, 255, 255, 1) 90%, rgba(255, 255, 255, 0) 100%)',
          WebkitMaskImage:
            'radial-gradient(circle, rgba(255, 255, 255, 1) 90%, rgba(255, 255, 255, 0) 100%)',
        }}
      />
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn('text-gray-300 font-bold tracking-wide mt-4', className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        'mt-8 text-gray-400 tracking-wide leading-relaxed text-sm',
        className
      )}
    >
      {children}
    </p>
  );
};
