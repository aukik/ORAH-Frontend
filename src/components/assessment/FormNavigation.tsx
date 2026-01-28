/**
 * Form Navigation - BRUTALIST CIVIC AUTHORITY
 *
 * High contrast navigation buttons with brutal styling.
 * Clear visibility against any background.
 */

'use client';

import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
  className?: string;
}

export function FormNavigation({
  onBack,
  onNext,
  isFirstStep,
  isLastStep,
  isSubmitting = false,
  nextDisabled = false,
  nextLabel,
  className,
}: FormNavigationProps) {
  const defaultNextLabel = isLastStep ? 'Generate Report' : 'Continue';

  return (
    <div
      className={cn(
        'flex items-center justify-between pt-8 mt-8 border-t-[3px] border-[var(--ink)]',
        className
      )}
    >
      <div>
        {!isFirstStep && (
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="btn-ghost text-base py-3 px-6"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Back
          </button>
        )}
      </div>

      <button
        type={onNext ? 'button' : 'submit'}
        onClick={onNext}
        disabled={nextDisabled || isSubmitting}
        className={cn(
          'btn-brutal text-base py-3 px-8',
          (nextDisabled || isSubmitting) && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <>
            <span className="animate-pulse">Processing…</span>
          </>
        ) : (
          <>
            {nextLabel || defaultNextLabel}
            {isLastStep ? (
              <Send className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            )}
          </>
        )}
      </button>
    </div>
  );
}
