/**
 * Communication Templates Tab - BRUTALIST CIVIC AUTHORITY
 *
 * Provides ready-to-use templates for privacy policies,
 * consent forms, employee memos, and customer notices.
 * High contrast design with bold typography.
 */

'use client';

import { useState } from 'react';
import { FileText, Copy, Check, Download } from 'lucide-react';
import type { CommunicationTemplate } from '@/types';

interface CommunicationTemplatesTabProps {
  templates: CommunicationTemplate[];
}

const TEMPLATE_DESCRIPTIONS: Record<CommunicationTemplate['type'], string> = {
  privacy_policy: 'Privacy Policy AI Clause',
  consent_form: 'Customer Consent Form',
  employee_memo: 'Employee AI Guidelines Memo',
  customer_notice: 'Customer AI Usage Notice',
};

function TemplateCard({ template }: { template: CommunicationTemplate }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([template.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.type.replace(/_/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal">
      <div className="p-4 border-b-2 border-[var(--ink)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--ink)] flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-[var(--cream)]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-display text-base text-[var(--ink)]">{template.title}</h3>
            <p className="text-sm text-[var(--text-muted)]">
              {TEMPLATE_DESCRIPTIONS[template.type]}
              {template.customizable && (
                <span className="ml-2 text-[var(--accent)]">(Customizable)</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 border-2 border-[var(--ink)] bg-[var(--surface)] hover:bg-[var(--cream)] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label={copied ? 'Copied' : 'Copy to clipboard'}
          >
            {copied ? (
              <Check className="h-5 w-5 text-[var(--success)]" />
            ) : (
              <Copy className="h-5 w-5 text-[var(--ink)]" />
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-2 border-2 border-[var(--ink)] bg-[var(--surface)] hover:bg-[var(--cream)] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Download template"
          >
            <Download className="h-5 w-5 text-[var(--ink)]" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="bg-[var(--cream)] border-2 border-[var(--border)] p-4 max-h-64 overflow-y-auto">
          <pre className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap font-mono leading-relaxed">
            {template.content}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function CommunicationTemplatesTab({
  templates,
}: CommunicationTemplatesTabProps) {
  return (
    <div className="space-y-6">
      {/* Notice banner - Brutalist style */}
      <div className="bg-[var(--accent)] text-white p-4 border-2 border-[var(--ink)]">
        <p className="text-sm">
          <span className="text-mono font-bold uppercase tracking-wider">Note:</span>{' '}
          These templates are starting points. Have them reviewed by a legal professional
          before use to ensure they meet your specific needs and comply with applicable laws.
        </p>
      </div>

      <div className="space-y-6">
        {templates.map((template, index) => (
          <TemplateCard key={index} template={template} />
        ))}
      </div>
    </div>
  );
}
