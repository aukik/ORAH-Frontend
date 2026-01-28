/**
 * Report Page - BRUTALIST CIVIC AUTHORITY
 *
 * Displays the comprehensive risk assessment report with 6 tabs.
 * High contrast brutalist design with commanding typography.
 *
 * Accessibility:
 * - Proper loading skeleton instead of spinner
 * - aria-busy during loading
 * - URL sync for active tab
 */

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Download, Save, ArrowLeft, Shield, AlertTriangle, X } from 'lucide-react';
import { ReportTabs } from '@/components/report';
import { ASSESSMENT_STORAGE_KEY, API_BASE_URL } from '@/lib/constants';
import { getSessionStorage, formatDate } from '@/lib/utils';
import { generatePDFReport } from '@/lib/pdf-generator';
import type { Report, AssessmentFormData } from '@/types';

/**
 * Generate a demo report based on assessment data
 * This is used when the API is not available
 */
function generateDemoReport(data: AssessmentFormData): Report {
  // Simple risk calculation for demo
  const dataRisk = data.dataTypes.length * 12;
  const toolRisk = data.aiTools.length * 5;
  // For multi-select patterns, use the highest risk among selected
  const patternRisk = data.usagePatterns?.includes('NO_RESTRICTIONS')
    ? 20
    : data.usagePatterns?.includes('ALL_EMPLOYEES')
      ? 15
      : data.usagePatterns?.includes('CONTRACTORS')
        ? 12
        : 10;
  const safeguardCredit = data.safeguards.length * 8;

  const baseScore = Math.min(100, dataRisk + toolRisk + patternRisk);
  const finalScore = Math.max(0, Math.min(100, baseScore - safeguardCredit));

  const riskLevel =
    finalScore <= 25
      ? 'LOW'
      : finalScore <= 50
        ? 'MEDIUM'
        : finalScore <= 75
          ? 'HIGH'
          : 'CRITICAL';

  return {
    id: 'demo-report',
    assessmentId: 'demo',
    createdAt: new Date().toISOString(),
    riskScore: finalScore,
    riskLevel,
    executiveSummary: {
      riskScore: finalScore,
      riskLevel,
      riskBreakdown: {
        dataExposure: Math.min(30, dataRisk),
        complianceGap: Math.min(25, 15),
        operationalRisk: Math.min(20, patternRisk),
        vendorRisk: Math.min(15, toolRisk),
        policyGap: data.hasWrittenPolicies ? 0 : 10,
      },
      topRisks: [
        data.aiTools.includes('chatgpt')
          ? 'Customer data being sent to US-based ChatGPT servers without adequate consent'
          : 'AI tools may be processing personal data without proper safeguards',
        !data.safeguards.includes('customer_consent')
          ? 'No documented customer consent mechanism for AI processing'
          : 'Consent mechanism may not meet PIPEDA requirements',
        !data.safeguards.includes('ai_privacy_policy')
          ? 'Privacy policy does not mention AI usage'
          : 'Privacy policy may need updates for Bill C-27 compliance',
      ],
      quickWins: [
        'Add an AI disclosure clause to your privacy policy',
        'Implement a simple consent checkbox for AI processing',
        'Create basic AI usage guidelines for employees',
      ],
      industryContext: `As a ${data.industryId} business, you handle sensitive data that requires careful attention to privacy regulations. Your industry has specific compliance requirements that affect how you can use AI tools.`,
      provincialContext: `Operating in ${data.provinceCode}, you must comply with ${data.provinceCode === 'QC' ? 'Quebec Law 25 (strictest in Canada)' : data.provinceCode === 'ON' ? 'PHIPA for any health data' : data.provinceCode === 'BC' || data.provinceCode === 'AB' ? 'provincial PIPA legislation' : 'federal PIPEDA requirements'}.`,
    },
    legalCompliance: {
      pipedaStatus: {
        compliant: data.safeguards.includes('customer_consent') && data.safeguards.includes('ai_privacy_policy'),
        issues: [
          {
            regulation: 'PIPEDA',
            category: 'CONSENT',
            title: 'Meaningful Consent Required',
            description:
              'PIPEDA requires meaningful consent before collecting and using personal information. Using AI to process customer data requires explicit disclosure.',
            severity: 'HIGH',
            remediation:
              'Update your privacy policy to explicitly mention AI usage and implement a consent mechanism.',
            resources: [
              'https://www.priv.gc.ca/en/privacy-topics/collecting-personal-information/consent/',
            ],
          },
        ],
      },
      billC27Status: {
        prepared: data.safeguards.length >= 3,
        recommendations: [
          'Document all AI systems used in your business',
          'Prepare for AI transparency requirements',
          'Consider implementing AI impact assessments',
        ],
      },
      provincialStatus: {
        province: data.provinceCode,
        law:
          data.provinceCode === 'QC'
            ? 'Law 25'
            : data.provinceCode === 'ON'
              ? 'PHIPA'
              : data.provinceCode === 'BC'
                ? 'PIPA BC'
                : data.provinceCode === 'AB'
                  ? 'PIPA AB'
                  : 'PIPEDA (Federal)',
        compliant: data.safeguards.length >= 2,
        issues:
          data.provinceCode === 'QC'
            ? [
                {
                  regulation: 'Law 25',
                  category: 'PRIVACY_OFFICER',
                  title: 'Privacy Officer Required',
                  description:
                    'Quebec Law 25 requires organizations to designate a privacy officer.',
                  severity: 'HIGH',
                  remediation:
                    'Designate a privacy officer and publish their contact information.',
                  resources: [],
                },
              ]
            : [],
      },
    },
    dataRiskAssessment: {
      dataFlows: data.dataTypes.map((dt) => ({
        dataType: dt,
        tools: data.aiTools.length > 0 ? data.aiTools : ['No AI tools selected'],
        riskLevel:
          dt === 'health_info'
            ? 'CRITICAL'
            : dt === 'financial_records' || dt === 'legal_contracts'
              ? 'HIGH'
              : dt === 'employee_data' || dt === 'customer_contact'
                ? 'MEDIUM'
                : 'LOW',
        crossBorder: data.aiTools.some((t) =>
          ['chatgpt', 'claude', 'gemini', 'copilot'].includes(t)
        ),
      })),
      exposureAnalysis: data.dataTypes.map((dt) => ({
        dataType: dt,
        score:
          dt === 'health_info'
            ? 85
            : dt === 'financial_records'
              ? 75
              : dt === 'legal_contracts'
                ? 65
                : dt === 'employee_data'
                  ? 55
                  : dt === 'customer_contact'
                    ? 45
                    : 15,
        concerns:
          dt === 'health_info'
            ? [
                'Health data is PHIPA-regulated in Ontario',
                'Cross-border transfer may violate data residency requirements',
              ]
            : dt === 'financial_records'
              ? ['Financial data requires additional safeguards', 'CRA compliance considerations']
              : ['Standard PIPEDA protections apply'],
      })),
    },
    businessImpact: {
      financialExposure: {
        pipedalMaxPenalty: 100000,
        provincialMaxPenalty:
          data.provinceCode === 'QC'
            ? 25000000
            : data.provinceCode === 'ON'
              ? 1000000
              : 100000,
        reputationalRisk: riskLevel,
      },
      insuranceGaps: [
        'Standard business insurance may not cover AI-related privacy breaches',
        'Consider cyber liability insurance with AI coverage',
      ],
      operationalRisks: [
        'Employees may be using unauthorized AI tools',
        'Client data could be exposed through AI model training',
      ],
    },
    communicationTemplates: [
      {
        title: 'AI Usage Privacy Policy Clause',
        type: 'privacy_policy',
        content: `ARTIFICIAL INTELLIGENCE AND AUTOMATED PROCESSING

We may use artificial intelligence (AI) and automated processing technologies to improve our services. This includes:

- Customer service optimization
- Document analysis and processing
- Business analytics and insights

When we use AI to process your personal information, we ensure:
- Your data is handled in accordance with this privacy policy
- Appropriate security measures are in place
- You have the right to request human review of automated decisions

For questions about our AI practices, contact our Privacy Officer at [EMAIL].`,
        customizable: true,
      },
      {
        title: 'Customer AI Consent Form',
        type: 'consent_form',
        content: `AI PROCESSING CONSENT

${data.businessName || '[Your Business Name]'} uses artificial intelligence tools to improve our services. By providing your consent below, you agree that we may:

[ ] Use AI to analyze and process information you provide to us
[ ] Store your data with our AI service providers (who may be located outside Canada)
[ ] Use insights from AI processing to improve our services to you

You may withdraw this consent at any time by contacting us at [EMAIL].

Signature: _________________ Date: _________________`,
        customizable: true,
      },
      {
        title: 'Employee AI Guidelines Memo',
        type: 'employee_memo',
        content: `MEMO: Guidelines for Using AI Tools at Work

To: All Staff
From: Management
Re: Responsible AI Usage

As AI tools become more common in our workplace, please follow these guidelines:

1. DO NOT enter customer personal information into public AI tools (ChatGPT, etc.)
2. DO NOT upload confidential documents to AI services
3. ALWAYS review AI-generated content before sending to clients
4. REPORT any concerns about AI usage to your supervisor

Approved AI tools: [LIST YOUR APPROVED TOOLS]

Questions? Contact [MANAGER NAME] at [EMAIL].`,
        customizable: true,
      },
    ],
    actionPlan: [
      {
        id: '1',
        title: 'Update Privacy Policy',
        description:
          'Add an AI disclosure clause to your privacy policy explaining how you use AI to process personal information.',
        priority: 'CRITICAL',
        timeline: '30_DAYS',
        category: 'Compliance',
        completed: false,
      },
      {
        id: '2',
        title: 'Implement Consent Mechanism',
        description:
          'Create a consent form or checkbox that explicitly asks customers for permission to process their data with AI.',
        priority: 'HIGH',
        timeline: '30_DAYS',
        category: 'Compliance',
        completed: false,
      },
      {
        id: '3',
        title: 'Create Employee AI Guidelines',
        description:
          'Develop and distribute guidelines for employees on responsible AI usage, including what data can and cannot be entered into AI tools.',
        priority: 'HIGH',
        timeline: '30_DAYS',
        category: 'Operations',
        completed: false,
      },
      {
        id: '4',
        title: 'Review Vendor Agreements',
        description:
          'Review data processing agreements with AI vendors to ensure they meet Canadian privacy requirements.',
        priority: 'MEDIUM',
        timeline: '60_DAYS',
        category: 'Legal',
        completed: false,
      },
      {
        id: '5',
        title: 'Conduct AI Inventory',
        description:
          'Document all AI tools used in your business, including who uses them and what data they access.',
        priority: 'MEDIUM',
        timeline: '60_DAYS',
        category: 'Operations',
        completed: false,
      },
      {
        id: '6',
        title: 'Employee Training',
        description:
          'Train employees on AI privacy risks and your new AI usage guidelines.',
        priority: 'MEDIUM',
        timeline: '90_DAYS',
        category: 'Training',
        completed: false,
      },
      {
        id: '7',
        title: 'Prepare for Bill C-27',
        description:
          'Review upcoming AIDA requirements and begin preparing documentation for AI transparency obligations.',
        priority: 'LOW',
        timeline: '90_DAYS',
        category: 'Compliance',
        completed: false,
      },
    ],
  };
}

/** Loading skeleton for the report page - Brutalist style */
function ReportSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="h-10 w-80 bg-[var(--border)] mb-3" />
          <div className="h-5 w-48 bg-[var(--border-strong)]" />
        </div>
        <div className="flex gap-3">
          <div className="h-12 w-40 bg-[var(--border)] border-2 border-[var(--ink)]" />
          <div className="h-12 w-44 bg-[var(--ink)]" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1 p-1 bg-[var(--surface)] border-2 border-[var(--ink)]">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-12 flex-1 min-w-[100px] bg-[var(--border)]" />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Gauge skeleton */}
          <div className="flex justify-center">
            <div className="h-48 w-64 bg-[var(--border)] border-2 border-[var(--ink)]" />
          </div>

          {/* Risk breakdown skeleton */}
          <div className="md:col-span-2">
            <div className="h-64 bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal" />
          </div>
        </div>

        {/* More content skeletons */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="h-48 bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal" />
          <div className="h-48 bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal" />
        </div>
      </div>
    </div>
  );
}

/** Inner component that uses searchParams - needs Suspense boundary */
function ReportContent() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentFormData | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);

      // Get assessment data from session storage
      const saved = getSessionStorage<AssessmentFormData | null>(
        ASSESSMENT_STORAGE_KEY,
        null
      );
      setAssessmentData(saved);

      // Try to fetch from API first
      try {
        const response = await fetch(
          `${API_BASE_URL}/assessments/${params.id}/report`
        );
        if (response.ok) {
          const data = await response.json();
          setReport(data.data || data);
          setLoading(false);
          return;
        }
      } catch {
        // API not available, use demo report
      }

      // Generate demo report from saved assessment data
      if (saved) {
        const demoReport = generateDemoReport(saved);
        setReport(demoReport);
      } else {
        setError('No assessment data found. Please complete the assessment first.');
      }

      setLoading(false);
    }

    loadReport();
  }, [params.id]);

  if (loading) {
    return <ReportSkeleton />;
  }

  if (error || !report) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-8 bg-[var(--ink)] flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-[var(--cream)]" aria-hidden="true" />
          </div>
          <h1 className="text-display text-display-sm text-[var(--ink)] mb-4">
            Report Not Found
          </h1>
          <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
            {error || 'Unable to load the report. Please try again.'}
          </p>
          <Link
            href="/business-profile"
            className="btn-brutal inline-flex"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Start New Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Report Header - Brutalist style */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div>
          <p className="text-mono text-[var(--accent)] text-sm mb-2 tracking-widest">
            COMPLIANCE REPORT
          </p>
          <h1 className="text-display text-display-sm text-[var(--ink)] mb-2">
            Risk Assessment
          </h1>
          <p className="text-[var(--text-secondary)]">
            {assessmentData?.businessName && (
              <span className="font-semibold text-[var(--ink)]">{assessmentData.businessName}</span>
            )}
            {assessmentData?.businessName && ' — '}
            Generated {formatDate(report.createdAt)}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            className="btn-ghost text-base py-3 px-6"
            aria-label="Download PDF report"
            onClick={() => generatePDFReport(report, assessmentData)}
          >
            <Download className="h-5 w-5" aria-hidden="true" />
            Download PDF
          </button>
          <button
            onClick={() => setShowLoginModal(true)}
            className="btn-brutal text-base py-3 px-6"
          >
            <Save className="h-5 w-5" aria-hidden="true" />
            Save Assessment
          </button>
        </div>
      </div>

      {/* Report Content - wrapped in Suspense for URL params */}
      <Suspense fallback={<ReportSkeleton />}>
        <ReportTabs report={report} />
      </Suspense>

      {/* Login Modal for New Assessment */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--surface)] border-[3px] border-[var(--ink)] max-w-lg w-full p-8 relative">
            {/* Close button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--ink)] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-[var(--accent)] flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h3 className="text-display text-2xl text-[var(--ink)] mb-3">
                Login to Save This Assessment
              </h3>
              <p className="text-[var(--text-secondary)] text-lg">
                Create an account or login to save your assessment and access it later.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full btn-brutal bg-[var(--accent)] text-white border-[var(--ink)] hover:bg-[var(--accent-dark)] flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Login
              </Link>
              <Link
                href="/login"
                className="w-full btn-ghost flex items-center justify-center gap-2"
              >
                Create Account
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-[var(--text-muted)] hover:text-[var(--ink)] text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<ReportSkeleton />}>
      <ReportContent />
    </Suspense>
  );
}
