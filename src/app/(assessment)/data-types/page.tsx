/**
 * Step 3: Data Types
 *
 * Collects information about what types of data are processed with AI tools.
 *
 * Accessibility:
 * - Skeleton loading instead of null return
 * - Proper fieldset grouping via CheckboxGroup
 * - Required field indication
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
import { DATA_TYPES, ASSESSMENT_STORAGE_KEY } from '@/lib/constants';
import { getSessionStorage, setSessionStorage } from '@/lib/utils';
import type { AssessmentFormData, DataType } from '@/types';

export default function DataTypesPage() {
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showError, setShowError] = useState(false);

  // Hydrate from sessionStorage
  useEffect(() => {
    const saved = getSessionStorage<AssessmentFormData | null>(
      ASSESSMENT_STORAGE_KEY,
      null
    );
    if (saved?.dataTypes) {
      setSelectedTypes(saved.dataTypes);
    }
    setIsHydrated(true);
  }, []);

  const handleNext = () => {
    if (selectedTypes.length === 0) {
      setShowError(true);
      return;
    }

    const saved = getSessionStorage<AssessmentFormData | null>(
      ASSESSMENT_STORAGE_KEY,
      null
    );
    if (saved) {
      const updated: AssessmentFormData = {
        ...saved,
        dataTypes: selectedTypes as DataType[],
      };
      setSessionStorage(ASSESSMENT_STORAGE_KEY, updated);
    }
    router.push('/usage-patterns');
  };

  const handleBack = () => {
    router.push('/ai-tools');
  };

  const handleChange = (value: string[]) => {
    setSelectedTypes(value);
    if (value.length > 0) {
      setShowError(false);
    }
  };

  // Show skeleton during hydration instead of null
  if (!isHydrated) {
    return (
      <div className="space-y-8">
        <StepIndicator currentStep={3} />
        <SkeletonCard className="p-6">
          <div className="space-y-6">
            <div className="h-8 w-96 skeleton rounded" />
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

  // Format data types for checkbox group
  const dataTypeOptions = DATA_TYPES.map((type) => ({
    value: type.value,
    label: type.label,
    description: type.description,
  }));

  return (
    <div className="space-y-8">
      <StepIndicator currentStep={3} />

      <Card>
        <CardHeader>
          <CardTitle>What types of data do you process with AI?</CardTitle>
          <CardDescription>
            Select all types of data that your business feeds into AI tools.
            This significantly affects your compliance requirements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <CheckboxGroup
              name="dataTypes"
              options={dataTypeOptions}
              value={selectedTypes}
              onChange={handleChange}
              columns={2}
              required
              error={showError ? 'Please select at least one data type to continue.' : undefined}
            />

            {selectedTypes.length === 0 && !showError && (
              <p className="text-sm text-[var(--text-muted)] text-center py-4">
                Select at least one data type to continue. If you only use AI
                for general tasks without personal data, select &quot;Public Marketing
                Content&quot;.
              </p>
            )}

            <FormNavigation
              isFirstStep={false}
              isLastStep={false}
              onBack={handleBack}
              onNext={handleNext}
              nextDisabled={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
