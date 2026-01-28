/**
 * Checkbox group component - BRUTALIST CIVIC AUTHORITY
 *
 * Multi-select options with high contrast brutalist styling.
 * Used for AI tools, data types, and safeguards selection.
 *
 * Accessibility:
 * - Uses fieldset with legend for grouping
 * - role="group" for screen reader context
 * - Explicit transition properties (not 'all')
 * - Proper label association
 */

'use client';

import { Checkbox } from '@/components/ui';
import { cn } from '@/lib/utils';

interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

interface CheckboxGroupProps {
  /** Form field name for the group */
  name: string;
  /** Group label displayed as legend */
  label?: string;
  /** Available options */
  options: CheckboxOption[];
  /** Currently selected values */
  value: string[];
  /** Called when selection changes */
  onChange: (value: string[]) => void;
  /** Number of columns in grid layout */
  columns?: 1 | 2 | 3;
  /** Additional CSS classes */
  className?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
}

export function CheckboxGroup({
  name,
  label,
  options,
  value,
  onChange,
  columns = 2,
  className,
  required,
  error,
}: CheckboxGroupProps) {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const errorId = error ? `${name}-error` : undefined;

  return (
    <fieldset className={className} role="group" aria-describedby={errorId}>
      {label && (
        <legend className="text-display text-lg text-[var(--ink)] mb-4">
          {label}
          {required && <span className="text-[var(--danger)] ml-1" aria-hidden="true">*</span>}
          {required && <span className="sr-only">(required)</span>}
        </legend>
      )}
      <div
        className={cn(
          'grid gap-3',
          columns === 1 && 'grid-cols-1',
          columns === 2 && 'grid-cols-1 sm:grid-cols-2',
          columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {options.map((option) => {
          const isChecked = value.includes(option.value);
          const id = `${name}-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                'flex items-start gap-4 p-4 border-2 cursor-pointer',
                // Explicit transition properties - not 'all'
                'transition-[border-color,background-color,box-shadow] duration-100 ease-out',
                'hover:bg-[var(--cream)]',
                'focus-within:ring-2 focus-within:ring-[var(--accent)] focus-within:ring-offset-2',
                isChecked
                  ? 'border-[var(--ink)] bg-[var(--cream)] shadow-brutal'
                  : 'border-[var(--border-strong)] bg-[var(--surface)]'
              )}
            >
              <Checkbox
                id={id}
                name={name}
                checked={isChecked}
                onCheckedChange={() => handleToggle(option.value)}
                className="mt-0.5 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-[var(--ink)] block">
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-xs text-[var(--text-secondary)] mt-1 block leading-relaxed">
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-[var(--danger)] mt-3 font-medium" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
