/**
 * AI Responsibility Checker - Constants and Reference Data
 *
 * Contains all static reference data for industries, provinces, AI tools,
 * data types, safeguards, and form configuration.
 */

import type {
  Industry,
  Province,
  AITool,
  DataType,
  Safeguard,
  FormStep,
  EmployeeCount,
  UsagePattern,
  RiskLevel,
} from '@/types';

/**
 * Form steps for the assessment flow
 */
export const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: 'Business Profile',
    description: 'Tell us about your business',
    path: '/business-profile',
  },
  {
    id: 2,
    title: 'AI Tools',
    description: 'Which AI tools do you use?',
    path: '/ai-tools',
  },
  {
    id: 3,
    title: 'Data Types',
    description: 'What data do you process with AI?',
    path: '/data-types',
  },
  {
    id: 4,
    title: 'Usage Patterns',
    description: 'How is AI used in your organization?',
    path: '/usage-patterns',
  },
  {
    id: 5,
    title: 'Safeguards',
    description: 'What protections do you have in place?',
    path: '/safeguards',
  },
];

/**
 * Employee count options with labels
 */
export const EMPLOYEE_COUNT_OPTIONS: Array<{
  value: EmployeeCount;
  label: string;
  description: string;
}> = [
  { value: 'SOLO', label: 'Solo', description: 'Just me' },
  { value: 'MICRO', label: 'Micro', description: '2-10 employees' },
  { value: 'SMALL', label: 'Small', description: '11-25 employees' },
  { value: 'MEDIUM', label: 'Medium', description: '26-50 employees' },
];

/**
 * Usage pattern options with descriptions
 * Multi-select: users can choose multiple patterns that apply to their organization
 */
export const USAGE_PATTERN_OPTIONS: Array<{
  value: UsagePattern;
  label: string;
  description: string;
}> = [
  {
    value: 'OWNER_MANAGER',
    label: 'Owner/Manager',
    description: 'Business owner or managers use AI tools',
  },
  {
    value: 'SPECIFIC_DEPARTMENTS',
    label: 'Specific departments',
    description: 'Certain teams like marketing, HR, or IT use AI',
  },
  {
    value: 'ALL_EMPLOYEES',
    label: 'All employees',
    description: 'Everyone in the organization can use AI tools',
  },
  {
    value: 'CONTRACTORS',
    label: 'Contractors/Freelancers',
    description: 'External contractors or freelancers use AI',
  },
  {
    value: 'NO_RESTRICTIONS',
    label: 'No restrictions',
    description: 'Anyone can use any AI tool without guidelines',
  },
];

/**
 * Industries with risk multipliers
 * Multipliers are based on data sensitivity and regulatory requirements
 */
export const INDUSTRIES: Industry[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Medical clinics, dental offices, health services',
    riskMultiplier: 1.5,
    commonDataTypes: ['health_info', 'customer_contact', 'employee_data'],
  },
  {
    id: 'finance',
    name: 'Finance & Banking',
    description: 'Financial services, lending, investment',
    riskMultiplier: 1.4,
    commonDataTypes: ['financial_records', 'customer_contact', 'employee_data'],
  },
  {
    id: 'legal',
    name: 'Legal Services',
    description: 'Law firms, legal consultants, notaries',
    riskMultiplier: 1.35,
    commonDataTypes: ['legal_contracts', 'customer_contact', 'employee_data'],
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Accountants, bookkeepers, tax preparers',
    riskMultiplier: 1.3,
    commonDataTypes: ['financial_records', 'customer_contact', 'employee_data'],
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Schools, tutoring, training providers',
    riskMultiplier: 1.2,
    commonDataTypes: ['customer_contact', 'employee_data'],
  },
  {
    id: 'hr_recruiting',
    name: 'HR & Recruiting',
    description: 'Staffing agencies, HR consultants',
    riskMultiplier: 1.2,
    commonDataTypes: ['employee_data', 'customer_contact'],
  },
  {
    id: 'insurance',
    name: 'Insurance',
    description: 'Insurance brokers, agents',
    riskMultiplier: 1.15,
    commonDataTypes: ['financial_records', 'health_info', 'customer_contact'],
  },
  {
    id: 'real_estate',
    name: 'Real Estate',
    description: 'Realtors, property management',
    riskMultiplier: 1.1,
    commonDataTypes: ['financial_records', 'customer_contact'],
  },
  {
    id: 'consulting',
    name: 'Consulting',
    description: 'Business consultants, advisors',
    riskMultiplier: 1.1,
    commonDataTypes: ['customer_contact', 'financial_records'],
  },
  {
    id: 'tech_software',
    name: 'Technology & Software',
    description: 'Software companies, IT services',
    riskMultiplier: 1.05,
    commonDataTypes: ['customer_contact', 'employee_data'],
  },
  {
    id: 'marketing',
    name: 'Marketing & Advertising',
    description: 'Marketing agencies, PR firms',
    riskMultiplier: 1.0,
    commonDataTypes: ['customer_contact', 'public_marketing'],
  },
  {
    id: 'retail',
    name: 'Retail',
    description: 'Stores, e-commerce, wholesale',
    riskMultiplier: 0.95,
    commonDataTypes: ['customer_contact', 'financial_records'],
  },
  {
    id: 'restaurant_food',
    name: 'Restaurant & Food Service',
    description: 'Restaurants, cafes, catering',
    riskMultiplier: 0.9,
    commonDataTypes: ['customer_contact', 'employee_data'],
  },
  {
    id: 'construction',
    name: 'Construction',
    description: 'Contractors, builders, trades',
    riskMultiplier: 0.9,
    commonDataTypes: ['customer_contact', 'employee_data'],
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Product manufacturing, fabrication',
    riskMultiplier: 0.85,
    commonDataTypes: ['customer_contact', 'employee_data'],
  },
];

/**
 * Canadian provinces and territories with regulatory info
 */
export const PROVINCES: Province[] = [
  {
    code: 'ON',
    name: 'Ontario',
    riskMultiplier: 1.15,
    primaryLaw: 'PHIPA (health data)',
    hasProvincialPrivacyLaw: true,
  },
  {
    code: 'QC',
    name: 'Quebec',
    riskMultiplier: 1.25,
    primaryLaw: 'Law 25',
    hasProvincialPrivacyLaw: true,
  },
  {
    code: 'BC',
    name: 'British Columbia',
    riskMultiplier: 1.1,
    primaryLaw: 'PIPA BC',
    hasProvincialPrivacyLaw: true,
  },
  {
    code: 'AB',
    name: 'Alberta',
    riskMultiplier: 1.1,
    primaryLaw: 'PIPA AB',
    hasProvincialPrivacyLaw: true,
  },
  {
    code: 'MB',
    name: 'Manitoba',
    riskMultiplier: 1.0,
    primaryLaw: 'FIPPA/PHIA',
    hasProvincialPrivacyLaw: false,
  },
  {
    code: 'SK',
    name: 'Saskatchewan',
    riskMultiplier: 1.0,
    primaryLaw: 'FOIP/HIPA',
    hasProvincialPrivacyLaw: false,
  },
  {
    code: 'NS',
    name: 'Nova Scotia',
    riskMultiplier: 1.0,
    primaryLaw: 'PIIDPA/PHIA',
    hasProvincialPrivacyLaw: false,
  },
  {
    code: 'NB',
    name: 'New Brunswick',
    riskMultiplier: 1.0,
    primaryLaw: 'RTIPPA',
    hasProvincialPrivacyLaw: false,
  },
  {
    code: 'NL',
    name: 'Newfoundland and Labrador',
    riskMultiplier: 1.0,
    primaryLaw: 'ATIPPA',
    hasProvincialPrivacyLaw: false,
  },
  {
    code: 'PE',
    name: 'Prince Edward Island',
    riskMultiplier: 1.0,
    primaryLaw: 'FOIPP',
    hasProvincialPrivacyLaw: false,
  },
  {
    code: 'YT',
    name: 'Yukon',
    riskMultiplier: 1.0,
    primaryLaw: 'ATIPP',
    hasProvincialPrivacyLaw: false,
  },
  {
    code: 'NT',
    name: 'Northwest Territories',
    riskMultiplier: 1.0,
    primaryLaw: 'ATIPP',
    hasProvincialPrivacyLaw: false,
  },
  {
    code: 'NU',
    name: 'Nunavut',
    riskMultiplier: 1.0,
    primaryLaw: 'ATIPP',
    hasProvincialPrivacyLaw: false,
  },
];

/**
 * AI tools with risk profiles
 */
export const AI_TOOLS: AITool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI general-purpose assistant',
    category: 'General AI',
    baseRiskScore: 6.5,
    usesDataForTraining: true,
    dataResidency: 'US',
    hasEnterpriseOption: true,
  },
  {
    id: 'chatgpt_enterprise',
    name: 'ChatGPT Enterprise',
    description: 'OpenAI enterprise version with data protection',
    category: 'General AI',
    baseRiskScore: 4.0,
    usesDataForTraining: false,
    dataResidency: 'US',
    hasEnterpriseOption: true,
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic AI assistant',
    category: 'General AI',
    baseRiskScore: 5.5,
    usesDataForTraining: false,
    dataResidency: 'US',
    hasEnterpriseOption: true,
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    description: 'Microsoft AI assistant integrated with Office',
    category: 'Productivity',
    baseRiskScore: 4.5,
    usesDataForTraining: false,
    dataResidency: 'US',
    hasEnterpriseOption: true,
  },
  {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    description: 'AI code completion assistant',
    category: 'Development',
    baseRiskScore: 5.0,
    usesDataForTraining: true,
    dataResidency: 'US',
    hasEnterpriseOption: true,
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Google AI assistant',
    category: 'General AI',
    baseRiskScore: 6.0,
    usesDataForTraining: true,
    dataResidency: 'US',
    hasEnterpriseOption: true,
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'AI image generation',
    category: 'Creative',
    baseRiskScore: 4.0,
    usesDataForTraining: true,
    dataResidency: 'US',
    hasEnterpriseOption: false,
  },
  {
    id: 'dall_e',
    name: 'DALL-E',
    description: 'OpenAI image generation',
    category: 'Creative',
    baseRiskScore: 4.5,
    usesDataForTraining: true,
    dataResidency: 'US',
    hasEnterpriseOption: true,
  },
  {
    id: 'notion_ai',
    name: 'Notion AI',
    description: 'AI writing assistant in Notion',
    category: 'Productivity',
    baseRiskScore: 5.0,
    usesDataForTraining: false,
    dataResidency: 'US',
    hasEnterpriseOption: true,
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    description: 'AI writing and grammar assistant',
    category: 'Writing',
    baseRiskScore: 4.0,
    usesDataForTraining: false,
    dataResidency: 'US',
    hasEnterpriseOption: true,
  },
];

/**
 * Data types with descriptions and risk scores
 */
export const DATA_TYPES: Array<{
  value: DataType;
  label: string;
  description: string;
  riskScore: number;
}> = [
  {
    value: 'health_info',
    label: 'Health Information',
    description: 'Medical records, health conditions, prescriptions',
    riskScore: 25,
  },
  {
    value: 'financial_records',
    label: 'Financial Records',
    description: 'Bank statements, income, credit information',
    riskScore: 20,
  },
  {
    value: 'employee_data',
    label: 'Employee Data',
    description: 'HR records, performance reviews, payroll',
    riskScore: 18,
  },
  {
    value: 'legal_contracts',
    label: 'Legal Contracts',
    description: 'Agreements, contracts, legal documents',
    riskScore: 15,
  },
  {
    value: 'customer_contact',
    label: 'Customer Contact Info',
    description: 'Names, emails, phone numbers, addresses',
    riskScore: 12,
  },
  {
    value: 'public_marketing',
    label: 'Public Marketing Content',
    description: 'Blog posts, social media, public announcements',
    riskScore: 3,
  },
];

/**
 * Safeguards with descriptions and credit values
 */
export const SAFEGUARDS: Array<{
  value: Safeguard;
  label: string;
  description: string;
  credit: number;
}> = [
  {
    value: 'canadian_hosted',
    label: 'Canadian-hosted AI tools only',
    description: 'All AI tools store data in Canada',
    credit: 20,
  },
  {
    value: 'customer_consent',
    label: 'Customer consent mechanism',
    description: 'Customers are informed and consent to AI processing',
    credit: 15,
  },
  {
    value: 'vendor_agreements',
    label: 'Vendor agreements reviewed',
    description: 'Data Processing Agreements signed with AI vendors',
    credit: 12,
  },
  {
    value: 'ai_privacy_policy',
    label: 'AI mentioned in privacy policy',
    description: 'Privacy policy updated to disclose AI use',
    credit: 10,
  },
  {
    value: 'employee_training',
    label: 'Employee AI training',
    description: 'Staff trained on responsible AI use',
    credit: 8,
  },
  {
    value: 'data_masking',
    label: 'Data masking/anonymization',
    description: 'PII removed before AI processing',
    credit: 8,
  },
  {
    value: 'audit_logging',
    label: 'AI usage audit logging',
    description: 'Tracking who uses AI and for what',
    credit: 5,
  },
];

/**
 * Risk level configuration
 */
export const RISK_LEVELS: Record<
  RiskLevel,
  { label: string; color: string; bgColor: string; description: string }
> = {
  LOW: {
    label: 'Low Risk',
    color: 'var(--risk-low)',
    bgColor: 'var(--risk-low-bg)',
    description: 'Minimal risk, good practices in place',
  },
  MEDIUM: {
    label: 'Medium Risk',
    color: 'var(--risk-medium)',
    bgColor: 'var(--risk-medium-bg)',
    description: 'Some gaps to address soon',
  },
  HIGH: {
    label: 'High Risk',
    color: 'var(--risk-high)',
    bgColor: 'var(--risk-high-bg)',
    description: 'Significant risk, act now',
  },
  CRITICAL: {
    label: 'Critical Risk',
    color: 'var(--risk-critical)',
    bgColor: 'var(--risk-critical-bg)',
    description: 'Urgent action required',
  },
};

/**
 * Get risk level from score
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score <= 25) return 'LOW';
  if (score <= 50) return 'MEDIUM';
  if (score <= 75) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Session storage key for assessment data persistence
 */
export const ASSESSMENT_STORAGE_KEY = 'ai-responsibility-assessment';

/**
 * API base URL - uses environment variable or defaults to localhost
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
