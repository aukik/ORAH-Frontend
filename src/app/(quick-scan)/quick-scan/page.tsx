/**
 * Quick Scan - Enter Website URL
 *
 * BRUTALIST CIVIC AUTHORITY
 *
 * First step of Quick Scan flow. User enters their website URL
 * and we scan it to extract business information.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, ArrowRight, AlertCircle, Loader2, Zap } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';
import type { QuickScanResponse } from '@/types';

// Convert snake_case API response to camelCase frontend types
function transformScanResponse(apiResponse: Record<string, unknown>): QuickScanResponse {
  const extractedInfo = apiResponse.extracted_info as Record<string, unknown>;

  return {
    success: apiResponse.success as boolean,
    websiteUrl: apiResponse.website_url as string,
    pagesScanned: apiResponse.pages_scanned as number,
    extractedInfo: {
      businessName: extractedInfo.business_name as string | null,
      industryDetected: extractedInfo.industry_detected as string | null,
      provinceDetected: extractedInfo.province_detected as string | null,
      aiToolsMentioned: extractedInfo.ai_tools_mentioned as string[] || [],
      technologyStack: extractedInfo.technology_stack as string[] || [],
      dataTypesIndicated: extractedInfo.data_types_indicated as string[] || [],
      hasPrivacyPolicy: extractedInfo.has_privacy_policy as boolean,
      privacyPolicyUrl: extractedInfo.privacy_policy_url as string | null,
      mentionsCustomerData: extractedInfo.mentions_customer_data as boolean,
      mentionsEmployeeData: extractedInfo.mentions_employee_data as boolean,
      mentionsConsent: extractedInfo.mentions_consent as boolean,
      mentionsGdpr: extractedInfo.mentions_gdpr as boolean,
      mentionsPipeda: extractedInfo.mentions_pipeda as boolean,
      hasContactForm: extractedInfo.has_contact_form as boolean,
      evidence: extractedInfo.evidence as Array<{
        type: string;
        title: string;
        url: string;
        content: string;
      }> || [],
    },
    missingRequiredFields: apiResponse.missing_required_fields as string[] || [],
    confidence: apiResponse.confidence as Record<string, number> || {},
    summary: apiResponse.summary as string,
  };
}

export default function QuickScanPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic URL validation
    let normalizedUrl = url.trim();
    if (!normalizedUrl) {
      setError('Please enter your website URL');
      return;
    }

    // Add https:// if missing
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Validate URL format
    try {
      new URL(normalizedUrl);
    } catch {
      setError('Please enter a valid website URL');
      return;
    }

    setIsScanning(true);

    try {
      const response = await fetch(`${API_BASE_URL}/scraper/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          website_url: normalizedUrl,
          include_subpages: true,
        }),
      });

      if (!response.ok) {
        console.warn('Backend not available, using mock data for demo');
        await new Promise(resolve => setTimeout(resolve, 3000));

        const mockData: QuickScanResponse = {
          success: true,
          websiteUrl: normalizedUrl,
          pagesScanned: 5,
          extractedInfo: {
            businessName: 'Demo Company Inc.',
            industryDetected: 'consulting',
            provinceDetected: 'ON',
            aiToolsMentioned: ['chatgpt', 'github_copilot'],
            technologyStack: ['react', 'nodejs', 'aws'],
            dataTypesIndicated: ['customer_data', 'employee_data'],
            hasPrivacyPolicy: true,
            privacyPolicyUrl: `${normalizedUrl}/privacy`,
            mentionsCustomerData: true,
            mentionsEmployeeData: true,
            mentionsConsent: false,
            mentionsGdpr: true,
            mentionsPipeda: false,
            hasContactForm: true,
            evidence: [{
              type: 'privacy_policy',
              title: 'Privacy Policy',
              url: `${normalizedUrl}/privacy`,
              content: 'We collect and process customer data...'
            }]
          },
          missingRequiredFields: ['employee_count', 'specific_ai_use_cases'],
          confidence: {
            business_name: 0.85,
            industry: 0.75,
            province: 0.90
          },
          summary: 'Successfully scanned website and detected business profile with AI tool usage.'
        };

        sessionStorage.setItem('quick-scan-results', JSON.stringify(mockData));
        router.push('/quick-scan/results');
        return;
      }

      const apiResponse = await response.json();
      const data = transformScanResponse(apiResponse);

      sessionStorage.setItem('quick-scan-results', JSON.stringify(data));
      router.push('/quick-scan/results');
    } catch (err) {
      console.warn('Network error, using mock data for demo:', err);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Determine scenario based on URL
      const isCompleteScenario = normalizedUrl.toLowerCase().includes('example');
      const isIncompleteScenario = normalizedUrl.toLowerCase().includes('demo');

      let mockData: QuickScanResponse;

      if (isCompleteScenario) {
        // Scenario A: All required fields found (example.com)
        mockData = {
          success: true,
          websiteUrl: normalizedUrl,
          pagesScanned: 5,
          extractedInfo: {
            businessName: 'Example Corp',
            industryDetected: 'tech_software',
            provinceDetected: 'BC',
            aiToolsMentioned: ['chatgpt', 'github_copilot'],
            technologyStack: ['react', 'nodejs', 'aws'],
            dataTypesIndicated: ['customer_data', 'employee_data'],
            hasPrivacyPolicy: true,
            privacyPolicyUrl: `${normalizedUrl}/privacy`,
            mentionsCustomerData: true,
            mentionsEmployeeData: true,
            mentionsConsent: true,
            mentionsGdpr: true,
            mentionsPipeda: true,
            hasContactForm: true,
            evidence: [{
              type: 'privacy_policy',
              title: 'Privacy Policy',
              url: `${normalizedUrl}/privacy`,
              content: 'We collect and process customer data in compliance with PIPEDA...'
            }]
          },
          missingRequiredFields: [],
          confidence: {
            business_name: 0.95,
            industry: 0.90,
            province: 0.92
          },
          summary: 'Successfully scanned website and detected complete business profile with all required information.'
        };
      } else if (isIncompleteScenario) {
        // Scenario B: Missing employee_count (demo.com)
        mockData = {
          success: true,
          websiteUrl: normalizedUrl,
          pagesScanned: 3,
          extractedInfo: {
            businessName: 'Demo Company Inc.',
            industryDetected: 'consulting',
            provinceDetected: 'ON',
            aiToolsMentioned: ['chatgpt'],
            technologyStack: ['wordpress'],
            dataTypesIndicated: ['customer_data'],
            hasPrivacyPolicy: true,
            privacyPolicyUrl: `${normalizedUrl}/privacy`,
            mentionsCustomerData: true,
            mentionsEmployeeData: false,
            mentionsConsent: false,
            mentionsGdpr: false,
            mentionsPipeda: false,
            hasContactForm: true,
            evidence: [{
              type: 'privacy_policy',
              title: 'Privacy Policy',
              url: `${normalizedUrl}/privacy`,
              content: 'We collect and process customer data...'
            }]
          },
          missingRequiredFields: ['employee_count'],
          confidence: {
            business_name: 0.85,
            industry: 0.75,
            province: 0.88
          },
          summary: 'Scanned website and detected partial business information. Some required fields need manual input.'
        };
      } else {
        // Default scenario - complete data
        mockData = {
          success: true,
          websiteUrl: normalizedUrl,
          pagesScanned: 5,
          extractedInfo: {
            businessName: 'Sample Business Ltd.',
            industryDetected: 'consulting',
            provinceDetected: 'ON',
            aiToolsMentioned: ['chatgpt', 'github_copilot'],
            technologyStack: ['react', 'nodejs'],
            dataTypesIndicated: ['customer_data', 'employee_data'],
            hasPrivacyPolicy: true,
            privacyPolicyUrl: `${normalizedUrl}/privacy`,
            mentionsCustomerData: true,
            mentionsEmployeeData: true,
            mentionsConsent: false,
            mentionsGdpr: true,
            mentionsPipeda: false,
            hasContactForm: true,
            evidence: [{
              type: 'privacy_policy',
              title: 'Privacy Policy',
              url: `${normalizedUrl}/privacy`,
              content: 'We collect and process customer data...'
            }]
          },
          missingRequiredFields: [],
          confidence: {
            business_name: 0.88,
            industry: 0.80,
            province: 0.90
          },
          summary: 'Successfully scanned website and detected business profile with AI tool usage.'
        };
      }

      sessionStorage.setItem('quick-scan-results', JSON.stringify(mockData));
      router.push('/quick-scan/results');
    }
  };

  return (
    <div className="py-12 md:py-16">
      <div className="container-md">
          {/* Page Title Section - In Main Content */}
          <div className="text-center mb-10 stagger">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[var(--accent)] text-white text-mono text-sm tracking-widest">
              <Zap className="w-4 h-4" aria-hidden="true" />
              <span>INSTANT WEBSITE ANALYSIS</span>
            </div>

            <h1 className="text-display text-display-md text-[var(--ink)] mb-0">
              Quick Scan
            </h1>
          </div>

          {/* Form - Wider, more prominent */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* URL Input Section */}
              <div className="relative">
                {/* Description - Left-aligned with input box, single line */}
                <p className="text-base text-[var(--text-secondary)] mb-4 whitespace-nowrap text-ellipsis">
                  Enter your website URL. We&apos;ll scan it to detect AI tools, data practices, and compliance risks.
                </p>

                {/* URL Input - Wider and more prominent */}
                <div className="relative group">
                  <div className="relative bg-[var(--surface)] border-[3px] border-[var(--ink)] shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] focus-within:shadow-[6px_6px_0_0_rgba(0,0,0,0.15)] transition-[box-shadow] duration-200">
                    <div className="flex items-center">
                      <div className="pl-5 pr-3">
                        <Globe className="w-6 h-6 text-[var(--text-muted)]" aria-hidden="true" />
                      </div>

                      <input
                        id="website-url"
                        name="url"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="example.com"
                        autoComplete="off"
                        spellCheck={false}
                        disabled={isScanning}
                        className="flex-1 py-5 pr-5 bg-transparent text-[var(--ink)] text-xl font-medium placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-describedby={error ? 'url-error' : undefined}
                        aria-invalid={error ? 'true' : 'false'}
                        aria-label="Website URL"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Message - Only show on error */}
                {error && (
                  <div
                    id="url-error"
                    className="mt-3 p-3 bg-[var(--danger-bg)] border-l-4 border-[var(--danger)] flex items-start gap-3"
                    role="alert"
                  >
                    <AlertCircle className="w-5 h-5 text-[var(--danger)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-[var(--danger)] font-medium">{error}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isScanning}
                className="w-full btn-brutal text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    Scanning Website…
                  </>
                ) : (
                  <>
                    Scan My Website
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            {/* Scanning Indicator */}
            {isScanning && (
              <div className="mt-6 p-5 bg-[var(--ink)] text-[var(--cream)] border-2 border-[var(--ink)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 bg-[var(--accent)] animate-pulse" aria-hidden="true" />
                  <span className="text-mono text-sm text-[var(--accent)]">
                    Scanning in progress…
                  </span>
                </div>
                <div className="space-y-1.5 text-mono text-xs text-[var(--cream)]/60">
                  <p>→ Searching for company information…</p>
                  <p>→ Looking for privacy policy…</p>
                  <p>→ Detecting AI tools and technologies…</p>
                  <p>→ Analyzing data handling practices…</p>
                </div>
              </div>
            )}

            {/* Info Cards - Compact */}
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              <div className="p-5 border-2 border-[var(--border)] bg-[var(--surface)]">
                <h2 className="text-display text-lg text-[var(--ink)] mb-3">
                  What We Scan
                </h2>
                <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                  <li>• Business name and industry</li>
                  <li>• Location/province</li>
                  <li>• Privacy policy presence</li>
                  <li>• AI tool mentions</li>
                  <li>• Data handling indicators</li>
                </ul>
              </div>

              <div className="p-5 border-2 border-[var(--border)] bg-[var(--surface)]">
                <h2 className="text-display text-lg text-[var(--ink)] mb-3">
                  What Happens Next
                </h2>
                <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                  <li>• Review extracted information</li>
                  <li>• Fill in any missing details</li>
                  <li>• Get your instant risk report</li>
                  <li>• Or skip and use scraped data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
