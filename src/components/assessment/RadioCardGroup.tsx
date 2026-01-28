/**
 * Radio card group component for single-select options
 *
 * Used for employee count and usage pattern selection
 * with card-style visual presentation.
 */

'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui';
import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioCardGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function RadioCardGroup({
  name,
  label,
  options,
  value,
  onChange,
  columns = 2,
  className,
}: RadioCardGroupProps) {
  return (
    <fieldset className={className}>
      {label && (
        <legend className="text-sm font-medium text-[var(--text-primary)] mb-4">
          {label}
        </legend>
      )}
      <RadioGroup
        name={name}
        value={value}
        onValueChange={onChange}
        className={cn(
          'grid gap-3',
          columns === 1 && 'grid-cols-1',
          columns === 2 && 'grid-cols-1 sm:grid-cols-2',
          columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          columns === 4 && 'grid-cols-2 sm:grid-cols-4'
        )}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          const id = `${name}-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all',
                'hover:border-[var(--primary-200)] hover:bg-[var(--primary-50)]',
                isSelected
                  ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                  : 'border-[var(--border)] bg-[var(--surface)]'
              )}
            >
              <RadioGroupItem
                id={id}
                value={option.value}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-[var(--text-primary)] block">
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}
