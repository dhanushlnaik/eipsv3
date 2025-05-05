import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',

        // New variants
        glass:
          'bg-white/10 border border-white/20 backdrop-blur-md text-white hover:bg-white/20 hover:shadow-md',
        purpleGlow:
          'bg-[#6b46c1] text-white shadow-[0_4px_14px_0_rgb(107,70,193,0.39)] hover:shadow-[0_6px_20px_rgba(107,70,193,0.23)] hover:bg-[rgba(107,70,193,0.9)] hover:scale-[1.03] transition duration-200 ease-linear',
        minimal:
          'text-gray-300 hover:text-white hover:underline hover:underline-offset-4 bg-transparent',
        download:
          'bg-[#6b46c1] text-white font-light px-6 py-1 text-xs shadow-[0_4px_14px_0_rgb(107,70,193,0.39)] hover:shadow-[0_6px_20px_rgba(107,70,193,0.23)] hover:bg-[rgba(107,70,193,0.9)] transition duration-200 ease-linear',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
