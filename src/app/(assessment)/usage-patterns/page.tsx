/**
 * Step 4: Usage Patterns
 *
 * Collects information about how AI is used within the organization.
 * Multi-select to allow users to specify all groups who use AI.
 *
 * Accessibility:
 * - Skeleton loading instead of null return
 * - Proper label association for policy checkbox
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  SkeletonCard,
} from '@/components/ui';
import { Checkbox } from '@/components/ui';
import { StepIndicator, FormNavigation, CheckboxGroup } from '@/components/assessment';
import { USAGE_PATTERN_OPTIONS, ASSESSMENT_STORAGE_KEY } from '@/lib/constants';
import { getSessionStorage, setSessionStorage } from '@/lib/utils';
import type { AssessmentFormData, UsagePattern } from '@/types';

export default function UsagePatternsPage() {
  const router = useRouter();
  const [usagePatterns, setUsagePatterns] = useState<UsagePattern[]>([]);
  const [hasWrittenPolicies, setHasWrittenPolicies] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from sessionStorage
  useEffect(() => {
    const saved = getSessionStorage<AssessmentFormData | null>(
      ASSESSMENT_STORAGE_KEY,
      null
    );
    if (saved) {
      setUsagePatterns(saved.usagePatterns || []);
      setHasWrittenPolicies(saved.hasWrittenPolicies);
    }
    setIsHydrated(true);
  }, []);

  const handleNext = () => {
    const saved = getSessionStorage<AssessmentFormData | null>(
      ASSESSMENT_STORAGE_KEY,
      null
    );
    if (saved) {
      const updated: AssessmentFormData = {
        ...saved,
        usagePatterns,
        hasWrittenPolicies,
      };
      setSessionStorage(ASSESSMENT_STORAGE_KEY, updated);
    }
    router.push('/safeguards');
  };

  const handleBack = () => {
    router.push('/data-types');
  };

  // Show skeleton during hydration instead of null
  if (!isHydrated) {
    return (
      <div className="space-y-8">
        <StepIndicator currentStep={4} />
        <SkeletonCard className="p-6">
          <div className="space-y-6">
            <div className="h-8 w-80 skeleton rounded" />
            <div className="h-4 w-full max-w-lg skeleton rounded" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 skeleton rounded-lg" />
              ))}
            </div>
            <div className="h-20 skeleton rounded-lg" />
          </div>
        </SkeletonCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StepIndicator currentStep={4} />

      <Card>
        <CardHeader>
          <CardTitle>How is AI used in your organization?</CardTitle>
          <CardDescription>
            Understanding your AI usage patterns helps us identify operational
            risks and recommend appropriate safeguards. Select all that apply.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <CheckboxGroup
              name="usagePatterns"
              label="Who uses AI tools in your business? (Select all that apply)"
              options={USAGE_PATTERN_OPTIONS}
              value={usagePatterns}
              onChange={(value) => setUsagePatterns(value as UsagePattern[])}
              columns={1}
            />

            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              <label
                htmlFor="hasWrittenPolicies"
                className="flex items-start gap-3 cursor-pointer"
              >
                <Checkbox
                  id="hasWrittenPolicies"
                  name="hasWrittenPolicies"
                  checked={hasWrittenPolicies}
                  onCheckedChange={(checked) =>
                    setHasWrittenPolicies(checked === true)
                  }
                  className="mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-[var(--text-primary)] block">
                    We have written AI usage policies
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                    Documented guidelines that employees are expected to follow
                    when using AI tools
                  </span>
                </div>
              </label>
            </div>

            <FormNavigation
              isFirstStep={false}
              isLastStep={false}
              onBack={handleBack}
              onNext={handleNext}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
