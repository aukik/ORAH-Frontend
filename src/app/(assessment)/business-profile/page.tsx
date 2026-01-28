/**
 * Step 1: Business Profile
 *
 * Collects basic business information: name, industry, province, size.
 *
 * Accessibility:
 * - Proper label association (htmlFor + id)
 * - autocomplete attributes for common fields
 * - aria-live for error messages
 * - Skeleton loading instead of null return
 * - name attributes for form submission
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  SkeletonCard,
} from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { StepIndicator, FormNavigation, RadioCardGroup } from '@/components/assessment';
import {
  INDUSTRIES,
  PROVINCES,
  EMPLOYEE_COUNT_OPTIONS,
  ASSESSMENT_STORAGE_KEY,
} from '@/lib/constants';
import { getSessionStorage, setSessionStorage } from '@/lib/utils';
import type { AssessmentFormData, ProvinceCode, EmployeeCount } from '@/types';

const schema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  industryId: z.string().min(1, 'Please select an industry'),
  provinceCode: z.string().min(1, 'Please select a province'),
  employeeCount: z.enum(['SOLO', 'MICRO', 'SMALL', 'MEDIUM']),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function BusinessProfilePage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: '',
      industryId: '',
      provinceCode: 'ON',
      employeeCount: 'MICRO',
      website: '',
    },
  });

  // Hydrate form from sessionStorage
  useEffect(() => {
    const saved = getSessionStorage<AssessmentFormData | null>(
      ASSESSMENT_STORAGE_KEY,
      null
    );
    if (saved) {
      setValue('businessName', saved.businessName);
      setValue('industryId', saved.industryId);
      setValue('provinceCode', saved.provinceCode);
      setValue('employeeCount', saved.employeeCount);
      setValue('website', saved.website || '');
    }
    setIsHydrated(true);
  }, [setValue]);

  const employeeCount = watch('employeeCount');

  const onSubmit = (data: FormData) => {
    const saved = getSessionStorage<AssessmentFormData | null>(
      ASSESSMENT_STORAGE_KEY,
      null
    );
    const updated: AssessmentFormData = {
      ...(saved || {
        aiTools: [],
        dataTypes: [],
        usagePatterns: [],
        hasWrittenPolicies: false,
        safeguards: [],
        email: '',
        assessmentPath: 'GUIDED',
      }),
      businessName: data.businessName,
      industryId: data.industryId,
      provinceCode: data.provinceCode as ProvinceCode,
      employeeCount: data.employeeCount as EmployeeCount,
      website: data.website || '',
    };
    setSessionStorage(ASSESSMENT_STORAGE_KEY, updated);
    router.push('/ai-tools');
  };

  // Show skeleton during hydration instead of null
  if (!isHydrated) {
    return (
      <div className="space-y-8">
        <StepIndicator currentStep={1} />
        <SkeletonCard className="p-6">
          <div className="space-y-6">
            <div className="h-8 w-64 skeleton rounded" />
            <div className="h-4 w-96 skeleton rounded" />
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 skeleton rounded" />
                  <div className="h-11 w-full skeleton rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </SkeletonCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StepIndicator currentStep={1} />

      <Card>
        <CardHeader>
          <CardTitle>Tell us about your business</CardTitle>
          <CardDescription>
            This helps us assess which regulations apply to you and identify
            industry-specific risks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="businessName" required>
                Business Name
              </Label>
              <Input
                id="businessName"
                placeholder="Your Company Inc."
                {...register('businessName')}
                error={!!errors.businessName}
                errorId="businessName-error"
                autoComplete="organization"
                name="businessName"
              />
              {errors.businessName && (
                <p
                  id="businessName-error"
                  className="text-sm text-[var(--error)]"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.businessName.message}
                </p>
              )}
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry" required>
                Industry
              </Label>
              <Select
                value={watch('industryId')}
                onValueChange={(value) => setValue('industryId', value, { shouldValidate: true })}
                name="industryId"
              >
                <SelectTrigger id="industry" error={!!errors.industryId} aria-describedby={errors.industryId ? 'industry-error' : undefined}>
                  <SelectValue placeholder="Select your industry&hellip;" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industryId && (
                <p
                  id="industry-error"
                  className="text-sm text-[var(--error)]"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.industryId.message}
                </p>
              )}
            </div>

            {/* Province */}
            <div className="space-y-2">
              <Label htmlFor="province" required>
                Province/Territory
              </Label>
              <Select
                value={watch('provinceCode')}
                onValueChange={(value) => setValue('provinceCode', value, { shouldValidate: true })}
                name="provinceCode"
              >
                <SelectTrigger id="province" error={!!errors.provinceCode} aria-describedby={errors.provinceCode ? 'province-error' : undefined}>
                  <SelectValue placeholder="Select your province&hellip;" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((province) => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.provinceCode && (
                <p
                  id="province-error"
                  className="text-sm text-[var(--error)]"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.provinceCode.message}
                </p>
              )}
            </div>

            {/* Employee Count */}
            <RadioCardGroup
              name="employeeCount"
              label="Number of Employees"
              options={EMPLOYEE_COUNT_OPTIONS}
              value={employeeCount}
              onChange={(value) =>
                setValue('employeeCount', value as EmployeeCount)
              }
              columns={4}
            />

            {/* Website (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourcompany.com"
                {...register('website')}
                error={!!errors.website}
                errorId="website-error"
                autoComplete="url"
                name="website"
              />
              {errors.website && (
                <p
                  id="website-error"
                  className="text-sm text-[var(--error)]"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.website.message}
                </p>
              )}
              <p className="text-xs text-[var(--text-muted)]">
                We&apos;ll use this to help identify AI tools you might be using.
              </p>
            </div>

            <FormNavigation isFirstStep={true} isLastStep={false} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
