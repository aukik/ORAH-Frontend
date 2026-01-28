/**
 * Assessment Context Provider
 *
 * Provides shared state for the multi-step assessment form.
 * Handles form data persistence and step navigation.
 */

'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

interface AssessmentContextValue {
  formData: AssessmentFormData;
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  progressPercentage: number;
  updateFormData: (data: Partial<AssessmentFormData>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | undefined>(
  undefined
);

/**
 * Get current step number from pathname
 */
function getStepFromPath(pathname: string): number {
  const stepIndex = FORM_STEPS.findIndex((step) => pathname.includes(step.path));
  return stepIndex >= 0 ? stepIndex + 1 : 1;
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [formData, setFormData] = useState<AssessmentFormData>(defaultFormData);
  const [isHydrated, setIsHydrated] = useState(false);

  const currentStep = getStepFromPath(pathname);
  const totalSteps = FORM_STEPS.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const progressPercentage = (currentStep / totalSteps) * 100;

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

  const updateFormData = useCallback((data: Partial<AssessmentFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
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

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    clearSessionStorage(ASSESSMENT_STORAGE_KEY);
    router.push('/business-profile');
  }, [router]);

  return (
    <AssessmentContext.Provider
      value={{
        formData,
        currentStep,
        totalSteps,
        isFirstStep,
        isLastStep,
        progressPercentage,
        updateFormData,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        resetForm,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessmentContext() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error(
      'useAssessmentContext must be used within an AssessmentProvider'
    );
  }
  return context;
}
