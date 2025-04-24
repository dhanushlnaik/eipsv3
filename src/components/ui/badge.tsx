import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',

        // Glassmorphism variants
        'glass-purple':
          'bg-[rgba(159,122,234,0.2)] text-white border border-[#9F7AEA]/30 shadow-inner shadow-[#9F7AEA]/20',
        'glass-red':
          'bg-[rgba(246,114,128,0.2)] text-[#F67280] border border-[#F67280]/30 shadow-inner shadow-[#F67280]/20',
        'glass-green':
          'bg-[rgba(129,199,132,0.2)] text-[#81C784] border border-[#81C784]/30 shadow-inner shadow-[#81C784]/20',
        'glass-blue':
          'bg-[rgba(100,181,246,0.2)] text-[#64B5F6] border border-[#64B5F6]/30 shadow-inner shadow-[#64B5F6]/20',
        'glass-yellow':
          'bg-[rgba(255,213,79,0.2)] text-[#FFD54F] border border-[#FFD54F]/30 shadow-inner shadow-[#FFD54F]/20',
        'glass-orange':
          'bg-[rgba(255,138,101,0.2)] text-[#FF8A65] border border-[#FF8A65]/30 shadow-inner shadow-[#FF8A65]/20',
        'glass-teal':
          'bg-[rgba(77,182,172,0.2)] text-[#4DB6AC] border border-[#4DB6AC]/30 shadow-inner shadow-[#4DB6AC]/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
