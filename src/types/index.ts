/**
 * AI Responsibility Checker - TypeScript Type Definitions
 *
 * Central type definitions for the assessment flow and report generation.
 * These types mirror the backend Pydantic schemas for type safety across the stack.
 */

// Employee count categories
export type EmployeeCount = 'SOLO' | 'MICRO' | 'SMALL' | 'MEDIUM';

// Assessment path types
export type AssessmentPath = 'EXPRESS' | 'GUIDED';

// Risk level thresholds
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Usage pattern options (who uses AI in the organization)
export type UsagePattern =
  | 'OWNER_MANAGER'
  | 'SPECIFIC_DEPARTMENTS'
  | 'ALL_EMPLOYEES'
  | 'CONTRACTORS'
  | 'NO_RESTRICTIONS';

// Data types that can be processed by AI tools
export type DataType =
  | 'health_info'
  | 'financial_records'
  | 'employee_data'
  | 'legal_contracts'
  | 'customer_contact'
  | 'public_marketing';

// Safeguard options
export type Safeguard =
  | 'canadian_hosted'
  | 'customer_consent'
  | 'vendor_agreements'
  | 'ai_privacy_policy'
  | 'employee_training'
  | 'data_masking'
  | 'audit_logging';

// Province codes
export type ProvinceCode =
  | 'ON' | 'QC' | 'BC' | 'AB' | 'MB' | 'SK'
  | 'NS' | 'NB' | 'NL' | 'PE' | 'YT' | 'NT' | 'NU';

/**
 * Industry definition with risk profile
 */
export interface Industry {
  id: string;
  name: string;
  description: string;
  riskMultiplier: number;
  commonDataTypes: DataType[];
}

/**
 * Province definition with regulatory info
 */
export interface Province {
  code: ProvinceCode;
  name: string;
  riskMultiplier: number;
  primaryLaw: string;
  hasProvincialPrivacyLaw: boolean;
}

/**
 * AI tool with risk profile
 */
export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  baseRiskScore: number;
  usesDataForTraining: boolean;
  dataResidency: 'US' | 'EU' | 'CANADA' | 'UNKNOWN';
  hasEnterpriseOption: boolean;
}

/**
 * Assessment form data - collected across all steps
 */
export interface AssessmentFormData {
  // Step 1: Business Profile
  businessName: string;
  industryId: string;
  provinceCode: ProvinceCode;
  employeeCount: EmployeeCount;
  website?: string;

  // Step 2: AI Tools
  aiTools: string[];

  // Step 3: Data Types
  dataTypes: DataType[];

  // Step 4: Usage Patterns
  usagePatterns: UsagePattern[];
  hasWrittenPolicies: boolean;

  // Step 5: Safeguards
  safeguards: Safeguard[];

  // Optional
  email?: string;
  assessmentPath: AssessmentPath;
}

/**
 * API request to create assessment
 */
export interface CreateAssessmentRequest {
  business_name: string;
  industry_id: string;
  province_code: ProvinceCode;
  employee_count: EmployeeCount;
  website?: string;
  ai_tools: string[];
  data_types: DataType[];
  usage_patterns: UsagePattern[];
  has_written_policies: boolean;
  safeguards: Safeguard[];
  email?: string;
  assessment_path: AssessmentPath;
}

/**
 * Risk score breakdown by category
 */
export interface RiskBreakdown {
  dataExposure: number;
  complianceGap: number;
  operationalRisk: number;
  vendorRisk: number;
  policyGap: number;
}

/**
 * Compliance issue identified during assessment
 */
export interface ComplianceIssue {
  regulation: string;
  category: string;
  title: string;
  description: string;
  severity: RiskLevel;
  remediation: string;
  resources: string[];
}

/**
 * Executive summary section of report
 */
export interface ExecutiveSummary {
  riskScore: number;
  riskLevel: RiskLevel;
  riskBreakdown: RiskBreakdown;
  topRisks: string[];
  quickWins: string[];
  industryContext: string;
  provincialContext: string;
}

/**
 * Legal compliance section of report
 */
export interface LegalCompliance {
  pipedaStatus: {
    compliant: boolean;
    issues: ComplianceIssue[];
  };
  billC27Status: {
    prepared: boolean;
    recommendations: string[];
  };
  provincialStatus: {
    province: string;
    law: string;
    compliant: boolean;
    issues: ComplianceIssue[];
  };
}

/**
 * Data risk assessment section of report
 */
export interface DataRiskAssessment {
  dataFlows: Array<{
    dataType: DataType;
    tools: string[];
    riskLevel: RiskLevel;
    crossBorder: boolean;
  }>;
  exposureAnalysis: Array<{
    dataType: DataType;
    score: number;
    concerns: string[];
  }>;
}

/**
 * Business impact section of report
 */
export interface BusinessImpact {
  financialExposure: {
    pipedalMaxPenalty: number;
    provincialMaxPenalty: number;
    reputationalRisk: string;
  };
  insuranceGaps: string[];
  operationalRisks: string[];
}

/**
 * Communication template
 */
export interface CommunicationTemplate {
  title: string;
  type: 'privacy_policy' | 'consent_form' | 'employee_memo' | 'customer_notice';
  content: string;
  customizable: boolean;
}

/**
 * Action plan item
 */
export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timeline: '30_DAYS' | '60_DAYS' | '90_DAYS';
  category: string;
  completed: boolean;
}

/**
 * Complete report structure
 */
export interface Report {
  id: string;
  assessmentId: string;
  createdAt: string;
  riskScore: number;
  riskLevel: RiskLevel;
  executiveSummary: ExecutiveSummary;
  legalCompliance: LegalCompliance;
  dataRiskAssessment: DataRiskAssessment;
  businessImpact: BusinessImpact;
  communicationTemplates: CommunicationTemplate[];
  actionPlan: ActionItem[];
}

/**
 * Assessment with associated report
 */
export interface Assessment {
  id: string;
  createdAt: string;
  businessName: string;
  industryId: string;
  provinceCode: ProvinceCode;
  employeeCount: EmployeeCount;
  report?: Report;
}

/**
 * Step in the multi-step form
 */
export interface FormStep {
  id: number;
  title: string;
  description: string;
  path: string;
}

/**
 * Form validation error
 */
export interface FormError {
  field: string;
  message: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Quick Scan - Extracted business information from website
 */
export interface ExtractedBusinessInfo {
  businessName: string | null;
  industryDetected: string | null;
  provinceDetected: string | null;
  aiToolsMentioned: string[];
  technologyStack: string[];
  dataTypesIndicated: string[];
  hasPrivacyPolicy: boolean;
  privacyPolicyUrl: string | null;
  mentionsCustomerData: boolean;
  mentionsEmployeeData: boolean;
  mentionsConsent: boolean;
  mentionsGdpr: boolean;
  mentionsPipeda: boolean;
  hasContactForm: boolean;
  evidence: Array<{
    type: string;
    title: string;
    url: string;
    content: string;
  }>;
}

/**
 * Quick Scan - Response from website scan
 */
export interface QuickScanResponse {
  success: boolean;
  websiteUrl: string;
  pagesScanned: number;
  extractedInfo: ExtractedBusinessInfo;
  missingRequiredFields: string[];
  confidence: Record<string, number>;
  summary: string;
}

/**
 * Quick Scan - Request to create assessment
 */
export interface QuickAssessmentRequest {
  websiteUrl: string;
  extractedInfo: ExtractedBusinessInfo;
  businessName?: string;
  industryId?: string;
  provinceCode?: string;
  employeeCount?: string;
  additionalDataTypes: string[];
  additionalAiTools: string[];
  email?: string;
}
