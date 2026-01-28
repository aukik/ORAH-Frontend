/**
 * Input component with consistent styling
 *
 * Supports all standard HTML input types with proper
 * focus states, error handling, and accessibility attributes.
 *
 * Accessibility requirements:
 * - Always pair with <Label htmlFor={id}>
 * - Include autocomplete for common fields (email, name, etc.)
 * - Include name attribute for form submission
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Whether input has validation error */
  error?: boolean;
  /**
   * Error message to display - creates aria-describedby connection
   * For inline error messages, wrap in a span with this ID
   */
  errorId?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorId, id, ...props }, ref) => {
    return (
      <input
        type={type}
        id={id}
        className={cn(
          // Base styles
          'flex h-11 w-full rounded-lg border bg-[var(--surface)] px-4 py-2 text-base',
          // Placeholder
          'placeholder:text-[var(--text-placeholder)]',
          // Explicit transition properties - no 'all'
          'transition-[border-color,box-shadow] duration-150 ease-out',
          // Focus state with ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-1',
          // Disabled state
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--surface-secondary)]',
          // File input styling
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--text-primary)]',
          // Error vs normal border
          error
            ? 'border-[var(--error)] focus-visible:ring-[var(--error)]'
            : 'border-[var(--border)] hover:border-[var(--border-strong)]',
          className
        )}
        ref={ref}
        aria-invalid={error || undefined}
        aria-describedby={error && errorId ? errorId : undefined}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
