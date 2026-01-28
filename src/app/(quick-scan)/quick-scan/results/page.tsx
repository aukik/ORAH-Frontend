/**
 * Quick Scan Results - Review and Complete
 *
 * BRUTALIST CIVIC AUTHORITY
 *
 * Shows extracted data from website scan and allows user to:
 * 1. Review what was found
 * 2. Fill in missing required fields
 * 3. Add additional data types or AI tools
 * 4. Skip and generate report with scraped data only
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  X,
  AlertCircle,
  ArrowRight,
  Loader2,
  ChevronDown,
  ChevronUp,
  Globe,
  Building2,
  MapPin,
  Users,
  Shield,
  FileText,
  Zap,
} from 'lucide-react';
import { API_BASE_URL, INDUSTRIES, PROVINCES, EMPLOYEE_COUNT_OPTIONS, DATA_TYPES, AI_TOOLS } from '@/lib/constants';
import type { QuickScanResponse, ExtractedBusinessInfo } from '@/types';

export default function QuickScanResultsPage() {
  const router = useRouter();
  const [scanResults, setScanResults] = useState<QuickScanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showOptionalModal, setShowOptionalModal] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // User overrides/additions
  const [businessName, setBusinessName] = useState('');
  const [industryId, setIndustryId] = useState('');
  const [provinceCode, setProvinceCode] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [additionalDataTypes, setAdditionalDataTypes] = useState<string[]>([]);
  const [additionalAiTools, setAdditionalAiTools] = useState<string[]>([]);
  const [email, setEmail] = useState('');

  // Load scan results from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('quick-scan-results');
    if (stored) {
      try {
        const data = JSON.parse(stored) as QuickScanResponse;
        setScanResults(data);

        // Pre-fill form with detected values
        if (data.extractedInfo.businessName) {
          setBusinessName(data.extractedInfo.businessName);
        }
        if (data.extractedInfo.industryDetected) {
          setIndustryId(data.extractedInfo.industryDetected);
        }
        if (data.extractedInfo.provinceDetected) {
          setProvinceCode(data.extractedInfo.provinceDetected);
        }

        // Pre-fill employee count for example.com demo (SMALL = 11-25 employees)
        if (data.websiteUrl.includes('example.com')) {
          setEmployeeCount('SMALL');
        }

        // Check if all required fields are found (including employee count check via missingRequiredFields)
        const allRequiredFound =
          data.extractedInfo.businessName &&
          data.extractedInfo.industryDetected &&
          data.extractedInfo.provinceDetected &&
          !data.missingRequiredFields.includes('employee_count');

        if (allRequiredFound) {
          // Show optional modal after a brief delay
          setTimeout(() => {
            setShowOptionalModal(true);
          }, 500);
        }
      } catch {
        setError('Failed to load scan results');
      }
    } else {
      // No scan results - redirect back
      router.push('/quick-scan');
    }
    setIsLoading(false);
  }, [router]);

  const handleSubmit = async (skipMissing = false) => {
    setError(null);

    if (!scanResults) return;

    // Validate required fields if not skipping
    if (!skipMissing) {
      if (!businessName.trim()) {
        setError('Please enter your business name');
        return;
      }
      if (!industryId) {
        setError('Please select your industry');
        return;
      }
      if (!provinceCode) {
        setError('Please select your province');
        return;
      }
      if (!employeeCount) {
        setError('Please select your employee count');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Convert snake_case to camelCase for the API
      const extractedInfoForApi = {
        business_name: scanResults.extractedInfo.businessName,
        industry_detected: scanResults.extractedInfo.industryDetected,
        province_detected: scanResults.extractedInfo.provinceDetected,
        ai_tools_mentioned: scanResults.extractedInfo.aiToolsMentioned,
        technology_stack: scanResults.extractedInfo.technologyStack,
        data_types_indicated: scanResults.extractedInfo.dataTypesIndicated,
        has_privacy_policy: scanResults.extractedInfo.hasPrivacyPolicy,
        privacy_policy_url: scanResults.extractedInfo.privacyPolicyUrl,
        mentions_customer_data: scanResults.extractedInfo.mentionsCustomerData,
        mentions_employee_data: scanResults.extractedInfo.mentionsEmployeeData,
        mentions_consent: scanResults.extractedInfo.mentionsConsent,
        mentions_gdpr: scanResults.extractedInfo.mentionsGdpr,
        mentions_pipeda: scanResults.extractedInfo.mentionsPipeda,
        has_contact_form: scanResults.extractedInfo.hasContactForm,
        evidence: scanResults.extractedInfo.evidence,
      };

      const response = await fetch(`${API_BASE_URL}/scraper/quick-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          website_url: scanResults.websiteUrl,
          extracted_info: extractedInfoForApi,
          business_name: businessName || undefined,
          industry_id: industryId || undefined,
          province_code: provinceCode || undefined,
          employee_count: employeeCount || undefined,
          additional_data_types: additionalDataTypes,
          additional_ai_tools: additionalAiTools,
          email: email || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create assessment');
      }

      const data = await response.json();

      // Create assessment data for report generation
      const assessmentData = {
        businessName: businessName || scanResults.extractedInfo.businessName || '',
        industryId: industryId || scanResults.extractedInfo.industryDetected || '',
        provinceCode: provinceCode || scanResults.extractedInfo.provinceDetected || 'ON',
        employeeCount: employeeCount || 'SMALL',
        website: scanResults.websiteUrl,
        aiTools: [...scanResults.extractedInfo.aiToolsMentioned, ...additionalAiTools],
        dataTypes: [...scanResults.extractedInfo.dataTypesIndicated, ...additionalDataTypes],
        usagePatterns: scanResults.extractedInfo.mentionsCustomerData ? ['CUSTOMER_SERVICE'] : ['INTERNAL_ONLY'],
        hasWrittenPolicies: scanResults.extractedInfo.hasPrivacyPolicy,
        safeguards: [
          ...(scanResults.extractedInfo.hasPrivacyPolicy ? ['ai_privacy_policy'] : []),
          ...(scanResults.extractedInfo.mentionsConsent ? ['customer_consent'] : []),
          ...(scanResults.extractedInfo.mentionsPipeda ? ['pipeda_compliance'] : []),
        ],
        email: email || undefined,
        assessmentPath: 'QUICK_SCAN' as const,
      };

      // Save assessment data for report generation
      sessionStorage.setItem('ai-responsibility-assessment', JSON.stringify(assessmentData));

      // Clear scan results from storage
      sessionStorage.removeItem('quick-scan-results');

      // Navigate to report
      router.push(`/report/${data.data.assessmentId}`);
    } catch (err) {
      console.warn('Backend not available, using mock assessment for demo:', err);

      // Generate mock assessment ID and navigate to report
      const mockAssessmentId = `mock-${Date.now()}`;

      // Create assessment data for report generation
      const assessmentData = {
        businessName: businessName || scanResults.extractedInfo.businessName || '',
        industryId: industryId || scanResults.extractedInfo.industryDetected || '',
        provinceCode: provinceCode || scanResults.extractedInfo.provinceDetected || 'ON',
        employeeCount: employeeCount || 'SMALL',
        website: scanResults.websiteUrl,
        aiTools: [...scanResults.extractedInfo.aiToolsMentioned, ...additionalAiTools],
        dataTypes: [...scanResults.extractedInfo.dataTypesIndicated, ...additionalDataTypes],
        usagePatterns: scanResults.extractedInfo.mentionsCustomerData ? ['CUSTOMER_SERVICE'] : ['INTERNAL_ONLY'],
        hasWrittenPolicies: scanResults.extractedInfo.hasPrivacyPolicy,
        safeguards: [
          ...(scanResults.extractedInfo.hasPrivacyPolicy ? ['ai_privacy_policy'] : []),
          ...(scanResults.extractedInfo.mentionsConsent ? ['customer_consent'] : []),
          ...(scanResults.extractedInfo.mentionsPipeda ? ['pipeda_compliance'] : []),
        ],
        email: email || undefined,
        assessmentPath: 'QUICK_SCAN' as const,
      };

      // Save assessment data for report generation
      sessionStorage.setItem('ai-responsibility-assessment', JSON.stringify(assessmentData));

      // Clear scan results from storage
      sessionStorage.removeItem('quick-scan-results');

      // Navigate to report page with mock ID
      // The report page will generate its own mock data
      router.push(`/report/${mockAssessmentId}`);
    }
  };

  const toggleDataType = (value: string) => {
    setAdditionalDataTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleAiTool = (value: string) => {
    setAdditionalAiTools((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--accent)]" />
        <p className="mt-4 text-[var(--text-muted)]">Loading scan results…</p>
      </div>
    );
  }

  if (!scanResults) {
    return null;
  }

  const { extractedInfo, confidence, summary, pagesScanned, missingRequiredFields } = scanResults;

  // Check if all required fields are filled
  const canSubmit = businessName.trim() && industryId && provinceCode && employeeCount;

  return (
    <div className="py-12 md:py-16">
      <div className="container-lg">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4 text-mono text-sm text-[var(--accent)]">
            <Check className="w-4 h-4" aria-hidden="true" />
            <span>SCAN COMPLETE • {pagesScanned} PAGES ANALYZED</span>
          </div>

          <h1 className="text-display text-display-md text-[var(--ink)] mb-4">
            Review Results
          </h1>

          <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
            {summary}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-8 p-4 border-2 border-[var(--danger)] bg-[var(--danger-bg)] flex items-center gap-3"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-[var(--danger)] flex-shrink-0" />
            <p className="text-[var(--danger)]">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Detected Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detected Business Info */}
            <section className="border-2 border-[var(--ink)] bg-[var(--surface)]">
              <div className="p-6 border-b-2 border-[var(--border)]">
                <h2 className="text-display text-xl text-[var(--ink)]">
                  Detected Information
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  <span className="text-[var(--danger)]">*</span> Required fields
                </p>

                {/* Business Name */}
                <div>
                  <label htmlFor="business-name" className="flex items-center gap-2 text-sm font-medium text-[var(--ink)] mb-2">
                    <Building2 className="w-4 h-4" aria-hidden="true" />
                    Business Name <span className="text-[var(--danger)]">*</span>
                    {extractedInfo.businessName && (
                      <span className="text-xs text-[var(--safe)] font-normal">
                        (detected: {confidence.business_name || confidence.businessName}% confidence)
                      </span>
                    )}
                  </label>
                  <input
                    id="business-name"
                    name="business-name"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your business name…"
                    autoComplete="organization"
                    className={`w-full px-4 py-3 border-2 bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                      !businessName.trim() ? 'border-[var(--danger)]' : 'border-[var(--border)] focus:border-[var(--ink)]'
                    }`}
                  />
                  {!businessName.trim() && (
                    <p className="mt-1 text-sm text-[var(--danger)]">This field is required</p>
                  )}
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="flex items-center gap-2 text-sm font-medium text-[var(--ink)] mb-2">
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    Industry <span className="text-[var(--danger)]">*</span>
                    {extractedInfo.industryDetected && (
                      <span className="text-xs text-[var(--safe)] font-normal">
                        (detected: {confidence.industry}% confidence)
                      </span>
                    )}
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={industryId}
                    onChange={(e) => setIndustryId(e.target.value)}
                    className={`w-full px-4 py-3 border-2 bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                      !industryId ? 'border-[var(--danger)]' : 'border-[var(--border)] focus:border-[var(--ink)]'
                    }`}
                  >
                    <option value="">Select your industry…</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.name}
                      </option>
                    ))}
                  </select>
                  {!industryId && (
                    <p className="mt-1 text-sm text-[var(--danger)]">This field is required</p>
                  )}
                </div>

                {/* Province */}
                <div>
                  <label htmlFor="province" className="flex items-center gap-2 text-sm font-medium text-[var(--ink)] mb-2">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    Province <span className="text-[var(--danger)]">*</span>
                    {extractedInfo.provinceDetected && (
                      <span className="text-xs text-[var(--safe)] font-normal">
                        (detected: {confidence.province}% confidence)
                      </span>
                    )}
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={provinceCode}
                    onChange={(e) => setProvinceCode(e.target.value)}
                    className={`w-full px-4 py-3 border-2 bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                      !provinceCode ? 'border-[var(--danger)]' : 'border-[var(--border)] focus:border-[var(--ink)]'
                    }`}
                  >
                    <option value="">Select your province…</option>
                    {PROVINCES.map((prov) => (
                      <option key={prov.code} value={prov.code}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                  {!provinceCode && (
                    <p className="mt-1 text-sm text-[var(--danger)]">This field is required</p>
                  )}
                </div>

                {/* Employee Count */}
                <div>
                  <label htmlFor="employee-count" className="flex items-center gap-2 text-sm font-medium text-[var(--ink)] mb-2">
                    <Users className="w-4 h-4" aria-hidden="true" />
                    Employee Count <span className="text-[var(--danger)]">*</span>
                  </label>
                  {missingRequiredFields.includes('employee_count') && (
                    <div className="mb-2 p-3 bg-[var(--caution-bg)] border-l-4 border-[var(--caution)] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[var(--caution)] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[var(--caution)]">
                        <span className="font-medium">COULD NOT DETECT</span> - Please select your employee count manually
                      </p>
                    </div>
                  )}
                  <select
                    id="employee-count"
                    name="employee-count"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    className={`w-full px-4 py-3 border-2 bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                      !employeeCount ? 'border-[var(--danger)]' : 'border-[var(--border)] focus:border-[var(--ink)]'
                    }`}
                  >
                    <option value="">Select employee count…</option>
                    {EMPLOYEE_COUNT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.description})
                      </option>
                    ))}
                  </select>
                  {!employeeCount && (
                    <p className="mt-1 text-sm text-[var(--danger)]">This field is required</p>
                  )}
                </div>

                {/* Email (optional) */}
                <div>
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-[var(--ink)] mb-2">
                    Email (optional)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 border-2 border-[var(--border)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--ink)]"
                  />
                </div>
              </div>
            </section>

            {/* AI Tools Detected */}
            <section className="border-2 border-[var(--ink)] bg-[var(--surface)]">
              <div className="p-6 border-b-2 border-[var(--border)]">
                <h2 className="text-display text-xl text-[var(--ink)]">
                  AI Tools
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Tools detected from your website. Add any we missed.
                </p>
              </div>

              <div className="p-6">
                {/* Detected Tools */}
                {extractedInfo.aiToolsMentioned.length > 0 && (
                  <div className="mb-6">
                    <p className="text-mono text-xs text-[var(--safe)] mb-3">DETECTED</p>
                    <div className="flex flex-wrap gap-2">
                      {extractedInfo.aiToolsMentioned.map((tool) => {
                        const toolInfo = AI_TOOLS.find((t) => t.id === tool);
                        return (
                          <span
                            key={tool}
                            className="px-3 py-1 bg-[var(--safe-bg)] border-2 border-[var(--safe)] text-[var(--safe)] text-sm flex items-center gap-2"
                          >
                            <Check className="w-3 h-3" aria-hidden="true" />
                            {toolInfo?.name || tool}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Additional Tools */}
                <p className="text-mono text-xs text-[var(--text-muted)] mb-3">
                  ADD MORE (OPTIONAL)
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {AI_TOOLS.filter(
                    (tool) => !extractedInfo.aiToolsMentioned.includes(tool.id)
                  ).map((tool) => (
                    <label
                      key={tool.id}
                      className={`flex items-center gap-3 p-3 border-2 cursor-pointer transition-colors duration-100 ${
                        additionalAiTools.includes(tool.id)
                          ? 'border-[var(--ink)] bg-[var(--cream)]'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--cream)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={additionalAiTools.includes(tool.id)}
                        onChange={() => toggleAiTool(tool.id)}
                        className="sr-only"
                      />
                      <span
                        className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 ${
                          additionalAiTools.includes(tool.id)
                            ? 'bg-[var(--ink)] border-[var(--ink)]'
                            : 'border-[var(--border)]'
                        }`}
                      >
                        {additionalAiTools.includes(tool.id) && (
                          <Check className="w-3 h-3 text-[var(--cream)]" />
                        )}
                      </span>
                      <span className="text-sm">{tool.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Data Types */}
            <section className="border-2 border-[var(--ink)] bg-[var(--surface)]">
              <div className="p-6 border-b-2 border-[var(--border)]">
                <h2 className="text-display text-xl text-[var(--ink)]">
                  Data Types
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Data types detected. Add any we missed.
                </p>
              </div>

              <div className="p-6">
                {/* Detected Data Types */}
                {extractedInfo.dataTypesIndicated.length > 0 && (
                  <div className="mb-6">
                    <p className="text-mono text-xs text-[var(--safe)] mb-3">DETECTED</p>
                    <div className="flex flex-wrap gap-2">
                      {extractedInfo.dataTypesIndicated.map((dt) => {
                        const dtInfo = DATA_TYPES.find((d) => d.value === dt);
                        return (
                          <span
                            key={dt}
                            className="px-3 py-1 bg-[var(--safe-bg)] border-2 border-[var(--safe)] text-[var(--safe)] text-sm flex items-center gap-2"
                          >
                            <Check className="w-3 h-3" aria-hidden="true" />
                            {dtInfo?.label || dt}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Additional Data Types */}
                <p className="text-mono text-xs text-[var(--text-muted)] mb-3">
                  ADD MORE (OPTIONAL)
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {DATA_TYPES.filter(
                    (dt) => !extractedInfo.dataTypesIndicated.includes(dt.value)
                  ).map((dt) => (
                    <label
                      key={dt.value}
                      className={`flex items-center gap-3 p-3 border-2 cursor-pointer transition-colors duration-100 ${
                        additionalDataTypes.includes(dt.value)
                          ? 'border-[var(--ink)] bg-[var(--cream)]'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--cream)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={additionalDataTypes.includes(dt.value)}
                        onChange={() => toggleDataType(dt.value)}
                        className="sr-only"
                      />
                      <span
                        className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 ${
                          additionalDataTypes.includes(dt.value)
                            ? 'bg-[var(--ink)] border-[var(--ink)]'
                            : 'border-[var(--border)]'
                        }`}
                      >
                        {additionalDataTypes.includes(dt.value) && (
                          <Check className="w-3 h-3 text-[var(--cream)]" />
                        )}
                      </span>
                      <span className="text-sm">{dt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Evidence (collapsible) */}
            <section className="border-2 border-[var(--border)] bg-[var(--surface)]">
              <button
                type="button"
                onClick={() => setShowEvidence(!showEvidence)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--cream)] transition-colors duration-100"
                aria-expanded={showEvidence}
              >
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  View scan evidence ({extractedInfo.evidence.length} sources)
                </span>
                {showEvidence ? (
                  <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                )}
              </button>

              {showEvidence && (
                <div className="p-4 border-t-2 border-[var(--border)] space-y-4">
                  {extractedInfo.evidence.map((ev, i) => (
                    <div key={i} className="text-sm">
                      <p className="text-mono text-xs text-[var(--accent)] mb-1">
                        {ev.type.toUpperCase()}
                      </p>
                      <p className="font-medium text-[var(--ink)]">{ev.title}</p>
                      <p className="text-[var(--text-muted)] text-xs truncate">
                        {ev.url}
                      </p>
                      {ev.content && (
                        <p className="text-[var(--text-secondary)] mt-1 line-clamp-2">
                          {ev.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)] p-6 sticky top-4">
              <h3 className="text-display text-xl mb-6">Scan Summary</h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--cream)]/70">Website</span>
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[var(--accent-on-dark)]" />
                    <span className="truncate max-w-[120px]">
                      {scanResults.websiteUrl.replace(/^https?:\/\//, '')}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--cream)]/70">Privacy Policy</span>
                  {extractedInfo.hasPrivacyPolicy ? (
                    <Check className="w-5 h-5 text-[var(--safe)]" />
                  ) : (
                    <X className="w-5 h-5 text-[var(--danger)]" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--cream)]/70">AI Tools Found</span>
                  <span>{extractedInfo.aiToolsMentioned.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--cream)]/70">Data Types Found</span>
                  <span>{extractedInfo.dataTypesIndicated.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--cream)]/70">Mentions PIPEDA</span>
                  {extractedInfo.mentionsPipeda ? (
                    <Check className="w-5 h-5 text-[var(--safe)]" />
                  ) : (
                    <X className="w-5 h-5 text-[var(--caution)]" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--cream)]/70">Mentions Consent</span>
                  {extractedInfo.mentionsConsent ? (
                    <Check className="w-5 h-5 text-[var(--safe)]" />
                  ) : (
                    <X className="w-5 h-5 text-[var(--caution)]" />
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting || !canSubmit}
                  className="w-full btn-brutal-on-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      Get My Report
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                {!canSubmit && !isSubmitting && (
                  <p className="text-xs text-[var(--danger)] text-center">
                    Please fill in all required fields
                  </p>
                )}

                {/* Only show Skip button if all required fields were detected */}
                {missingRequiredFields.length === 0 && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSubmit(true)}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-[var(--cream)] bg-transparent text-[var(--cream)] font-display text-lg uppercase tracking-wide hover:bg-[var(--cream)] hover:text-[var(--ink)] transition-colors duration-100 disabled:opacity-50"
                    >
                      <Zap className="w-5 h-5" />
                      Skip & Use Scraped Data Only
                    </button>
                    <p className="mt-4 text-xs text-[var(--cream)]/50 text-center">
                      &quot;Skip&quot; uses detected data only.
                      Fill in details for a more accurate report.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Removed: Missing Fields Warning - Now shown inline next to each field */}
          </div>
        </div>

        {/* Optional Data Modal */}
        {showOptionalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-[var(--surface)] border-[3px] border-[var(--ink)] max-w-lg w-full p-8 relative">
              {/* Close button */}
              <button
                onClick={() => setShowOptionalModal(false)}
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--ink)] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-[var(--safe-bg)] border-2 border-[var(--safe)] flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-[var(--safe)]" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <h3 className="text-display text-2xl text-[var(--ink)] mb-3">
                  All Required Data Found!
                </h3>
                <p className="text-[var(--text-secondary)] text-lg">
                  We found all required information. Want to add more details for better accuracy?
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowOptionalModal(false);
                    setShowOptionalFields(true);
                  }}
                  className="w-full btn-brutal bg-[var(--accent)] text-white border-[var(--ink)] hover:bg-[var(--accent-dark)]"
                >
                  Yes, Add More Details
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOptionalModal(false);
                    handleSubmit(true); // Skip validation - all required fields were detected
                  }}
                  className="w-full btn-ghost"
                >
                  Generate Report
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
