/**
 * Step 2: AI Tools Selection
 *
 * Allows users to select which AI tools their business uses.
 *
 * Accessibility:
 * - Skeleton loading instead of null return
 * - Proper fieldset grouping via CheckboxGroup
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
import { StepIndicator, FormNavigation, CheckboxGroup } from '@/components/assessment';
import { AI_TOOLS, ASSESSMENT_STORAGE_KEY } from '@/lib/constants';
import { getSessionStorage, setSessionStorage } from '@/lib/utils';
import type { AssessmentFormData } from '@/types';

export default function AIToolsPage() {
  const router = useRouter();
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from sessionStorage
  useEffect(() => {
    const saved = getSessionStorage<AssessmentFormData | null>(
      ASSESSMENT_STORAGE_KEY,
      null
    );
    if (saved?.aiTools) {
      setSelectedTools(saved.aiTools);
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
        aiTools: selectedTools,
      };
      setSessionStorage(ASSESSMENT_STORAGE_KEY, updated);
    }
    router.push('/data-types');
  };

  const handleBack = () => {
    router.push('/business-profile');
  };

  // Show skeleton during hydration instead of null
  if (!isHydrated) {
    return (
      <div className="space-y-8">
        <StepIndicator currentStep={2} />
        <SkeletonCard className="p-6">
          <div className="space-y-6">
            <div className="h-8 w-80 skeleton rounded" />
            <div className="h-4 w-full max-w-lg skeleton rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-24 skeleton rounded-lg" />
              ))}
            </div>
          </div>
        </SkeletonCard>
      </div>
    );
  }

  // Format tools for the checkbox group
  const toolOptions = AI_TOOLS.map((tool) => ({
    value: tool.id,
    label: tool.name,
    description: `${tool.description} - ${tool.dataResidency} servers`,
  }));

  return (
    <div className="space-y-8">
      <StepIndicator currentStep={2} />

      <Card>
        <CardHeader>
          <CardTitle>Which AI tools does your business use?</CardTitle>
          <CardDescription>
            Select all AI tools that are used in your business operations.
            This includes tools used by any employee.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <CheckboxGroup
              name="aiTools"
              options={toolOptions}
              value={selectedTools}
              onChange={setSelectedTools}
              columns={2}
            />

            {selectedTools.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] text-center py-4">
                If you don&apos;t use any AI tools, you can skip this step. Your risk
                score will be lower.
              </p>
            )}

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
