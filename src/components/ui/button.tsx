/**
 * Button component with multiple variants and sizes
 *
 * Uses class-variance-authority for variant management.
 * Accessibility: focus-visible ring, aria-busy for loading, aria-label support
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles - shared across all variants
  // Using explicit transition properties (not 'all') per accessibility guidelines
  // Added transform for hover lift effect with spring physics timing
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold',
    'transition-[color,background-color,border-color,box-shadow,transform] duration-200',
    'hover:-translate-y-0.5 active:translate-y-0',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-[var(--primary-900)] text-[var(--text-inverse)] shadow-sm hover:bg-[var(--primary-700)] hover:shadow-md active:bg-[var(--primary-800)] active:shadow-sm',
        secondary:
          'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-sm hover:bg-[var(--surface-secondary)] hover:border-[var(--border-strong)] hover:shadow-md active:bg-[var(--background)] active:shadow-sm',
        outline:
          'border-2 border-[var(--primary-700)] text-[var(--primary-700)] bg-transparent hover:bg-[var(--primary-50)] hover:shadow-md active:bg-[var(--primary-100)]',
        ghost:
          'text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] active:bg-[var(--border-subtle)] hover:translate-y-0',
        danger:
          'bg-[var(--error)] text-white shadow-sm hover:bg-[#a82828] hover:shadow-md active:bg-[#8b2020] active:shadow-sm',
        success:
          'bg-[var(--success)] text-white shadow-sm hover:bg-[#0a6a4f] hover:shadow-md active:bg-[#08573f] active:shadow-sm',
        link: 'text-[var(--primary-700)] underline-offset-4 hover:underline p-0 h-auto font-normal hover:translate-y-0',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        default: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-0',
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
  /** Whether button is in loading state */
  loading?: boolean;
  /**
   * Accessible label for icon-only buttons
   * Required when size="icon" and no visible text
   */
  'aria-label'?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, disabled, children, 'aria-label': ariaLabel, ...props },
    ref
  ) => {
    // Warn in development if icon button lacks aria-label
    if (process.env.NODE_ENV === 'development' && size === 'icon' && !ariaLabel && !children) {
      console.warn('Button: Icon buttons should have an aria-label for accessibility');
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-label={ariaLabel}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading&hellip;</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
