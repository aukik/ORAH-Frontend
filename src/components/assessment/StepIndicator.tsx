/**
 * Step Indicator - BRUTALIST CIVIC AUTHORITY
 *
 * High contrast progress indicator for assessment flow.
 * Uses ink/cream/accent colors for clear visibility.
 */

'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FORM_STEPS } from '@/lib/constants';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Assessment progress" className="w-full">
      <ol className="flex items-center justify-between">
        {FORM_STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <li
              key={step.id}
              className={cn('flex items-center', index !== 0 && 'flex-1')}
            >
              {/* Connector line */}
              {index !== 0 && (
                <div className="flex-1 mx-2">
                  <div
                    className={cn(
                      'h-[3px] w-full transition-colors duration-200',
                      isCompleted || isCurrent
                        ? 'bg-[var(--ink)]'
                        : 'bg-[var(--border-strong)]'
                    )}
                  />
                </div>
              )}

              {/* Step circle */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(stepNumber)}
                disabled={!isClickable}
                className={cn(
                  'relative flex h-12 w-12 items-center justify-center border-[3px] transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
                  isCompleted && [
                    'border-[var(--ink)] bg-[var(--ink)]',
                    isClickable && 'cursor-pointer hover:bg-[var(--ink-light)]',
                  ],
                  isCurrent && 'border-[var(--accent)] bg-[var(--surface)]',
                  !isCompleted &&
                    !isCurrent &&
                    'border-[var(--border-strong)] bg-[var(--surface)]',
                  !isClickable && 'cursor-default'
                )}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${step.title}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check
                      className="h-6 w-6 text-[var(--cream)]"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  </motion.div>
                ) : (
                  <span
                    className={cn(
                      'text-display text-lg tabular-nums',
                      isCurrent
                        ? 'text-[var(--accent)]'
                        : 'text-[var(--text-muted)]'
                    )}
                  >
                    {stepNumber}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Step labels - visible on larger screens */}
      <div className="mt-4 hidden sm:flex justify-between">
        {FORM_STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={`label-${step.id}`}
              className={cn(
                'text-center text-mono text-xs font-semibold uppercase tracking-wider transition-colors duration-200',
                index === 0 && 'text-left',
                index === FORM_STEPS.length - 1 && 'text-right',
                isCurrent
                  ? 'text-[var(--ink)]'
                  : isCompleted
                    ? 'text-[var(--text-secondary)]'
                    : 'text-[var(--text-muted)]'
              )}
              style={{
                width: `${100 / FORM_STEPS.length}%`,
              }}
            >
              {step.title}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
