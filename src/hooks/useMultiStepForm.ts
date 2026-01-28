/**
 * Multi-step form hook for the assessment flow
 *
 * Manages form state across multiple steps, handles navigation,
 * and persists data to sessionStorage for recovery.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getSessionStorage,
  setSessionStorage,
  clearSessionStorage,
} from '@/lib/utils';
import { FORM_STEPS, ASSESSMENT_STORAGE_KEY } from '@/lib/constants';
import type { AssessmentFormData } from '@/types';

/**
 * Default empty form data
 */
const defaultFormData: AssessmentFormData = {
  businessName: '',
  industryId: '',
  provinceCode: 'ON',
  employeeCount: 'MICRO',
  website: '',
  aiTools: [],
  dataTypes: [],
  usagePatterns: [],
  hasWrittenPolicies: false,
  safeguards: [],
  email: '',
  assessmentPath: 'GUIDED',
};

interface UseMultiStepFormReturn {
  // Current state
  currentStep: number;
  totalSteps: number;
  formData: AssessmentFormData;
  isFirstStep: boolean;
  isLastStep: boolean;
  progressPercentage: number;

  // Navigation
  goToStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Data management
  updateFormData: (data: Partial<AssessmentFormData>) => void;
  resetForm: () => void;

  // Step info
  currentStepInfo: (typeof FORM_STEPS)[number];
}

export function useMultiStepForm(initialStep = 1): UseMultiStepFormReturn {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<AssessmentFormData>(defaultFormData);
  const [isHydrated, setIsHydrated] = useState(false);

  const totalSteps = FORM_STEPS.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const progressPercentage = (currentStep / totalSteps) * 100;
  const currentStepInfo = FORM_STEPS[currentStep - 1];

  // Hydrate form data from sessionStorage on mount
  useEffect(() => {
    const savedData = getSessionStorage<AssessmentFormData | null>(
      ASSESSMENT_STORAGE_KEY,
      null
    );
    if (savedData) {
      setFormData(savedData);
    }
    setIsHydrated(true);
  }, []);

  // Persist form data to sessionStorage on change
  useEffect(() => {
    if (isHydrated) {
      setSessionStorage(ASSESSMENT_STORAGE_KEY, formData);
    }
  }, [formData, isHydrated]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
        const stepInfo = FORM_STEPS[step - 1];
        router.push(stepInfo.path);
      }
    },
    [totalSteps, router]
  );

  const goToNextStep = useCallback(() => {
    if (!isLastStep) {
      goToStep(currentStep + 1);
    }
  }, [currentStep, isLastStep, goToStep]);

  const goToPreviousStep = useCallback(() => {
    if (!isFirstStep) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, isFirstStep, goToStep]);

  const updateFormData = useCallback((data: Partial<AssessmentFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    clearSessionStorage(ASSESSMENT_STORAGE_KEY);
    setCurrentStep(1);
  }, []);

  return {
    currentStep,
    totalSteps,
    formData,
    isFirstStep,
    isLastStep,
    progressPercentage,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    updateFormData,
    resetForm,
    currentStepInfo,
  };
}
