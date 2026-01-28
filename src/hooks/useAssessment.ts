/**
 * Assessment submission hook
 *
 * Handles API communication for creating assessments and
 * retrieving reports.
 */

'use client';

import { useState, useCallback } from 'react';
import { API_BASE_URL } from '@/lib/constants';
import type {
  AssessmentFormData,
  CreateAssessmentRequest,
  Report,
  ApiResponse,
} from '@/types';

interface UseAssessmentReturn {
  isSubmitting: boolean;
  error: string | null;
  submitAssessment: (data: AssessmentFormData) => Promise<string | null>;
  fetchReport: (assessmentId: string) => Promise<Report | null>;
}

/**
 * Transforms frontend form data to API request format
 */
function toApiRequest(data: AssessmentFormData): CreateAssessmentRequest {
  return {
    business_name: data.businessName,
    industry_id: data.industryId,
    province_code: data.provinceCode,
    employee_count: data.employeeCount,
    website: data.website || undefined,
    ai_tools: data.aiTools,
    data_types: data.dataTypes,
    usage_patterns: data.usagePatterns,
    has_written_policies: data.hasWrittenPolicies,
    safeguards: data.safeguards,
    email: data.email || undefined,
    assessment_path: data.assessmentPath,
  };
}

export function useAssessment(): UseAssessmentReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAssessment = useCallback(
    async (data: AssessmentFormData): Promise<string | null> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/assessments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(toApiRequest(data)),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail || `Request failed with status ${response.status}`
          );
        }

        const result: ApiResponse<{ id: string }> = await response.json();

        if (result.success && result.data) {
          return result.data.id;
        } else {
          throw new Error(result.error || 'Failed to create assessment');
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const fetchReport = useCallback(
    async (assessmentId: string): Promise<Report | null> => {
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/assessments/${assessmentId}/report`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail || `Request failed with status ${response.status}`
          );
        }

        const result: ApiResponse<Report> = await response.json();

        if (result.success && result.data) {
          return result.data;
        } else {
          throw new Error(result.error || 'Failed to fetch report');
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
        return null;
      }
    },
    []
  );

  return {
    isSubmitting,
    error,
    submitAssessment,
    fetchReport,
  };
}
