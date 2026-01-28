/**
 * Checkbox component - BRUTALIST CIVIC AUTHORITY
 *
 * High contrast checkbox with cream checkmark on ink background.
 * Built on Radix UI Checkbox for accessibility.
 *
 * Accessibility: Proper focus-visible, keyboard navigation,
 * explicit transitions (not 'all')
 */

'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-6 w-6 shrink-0 border-2 border-[var(--ink)]',
      'bg-[var(--surface)]',
      // Focus state - high contrast
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
      // Disabled state
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Checked state - ink background with cream checkmark
      'data-[state=checked]:bg-[var(--ink)] data-[state=checked]:border-[var(--ink)]',
      // Explicit transition properties - not 'all'
      'transition-[background-color,border-color,box-shadow] duration-100 ease-out',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center')}
    >
      <Check
        className="h-4 w-4 text-[var(--cream)]"
        strokeWidth={3}
        aria-hidden="true"
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
