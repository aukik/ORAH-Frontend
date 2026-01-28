/**
 * Legal Compliance Tab - BRUTALIST CIVIC AUTHORITY
 *
 * Displays PIPEDA compliance status, Bill C-27 preparation,
 * and provincial law compliance with detailed issues.
 * High contrast design with bold typography.
 */

'use client';

import { Scale, AlertCircle, Info, ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { LegalCompliance, ComplianceIssue } from '@/types';

interface LegalComplianceTabProps {
  compliance: LegalCompliance;
}

function IssueCard({ issue }: { issue: ComplianceIssue }) {
  return (
    <div className="p-4 border-2 border-[var(--ink)] bg-[var(--surface)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle
              className="h-5 w-5 text-[var(--danger)]"
              aria-hidden="true"
            />
            <h4 className="text-display text-base text-[var(--ink)]">
              {issue.title}
            </h4>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
            {issue.description}
          </p>
          <div className="bg-[var(--cream)] p-4 border-l-4 border-[var(--accent)]">
            <p className="text-sm">
              <span className="text-mono text-xs uppercase tracking-wider text-[var(--accent)]">
                Remediation:
              </span>
              <br />
              <span className="text-[var(--text-secondary)] mt-1 block">
                {issue.remediation}
              </span>
            </p>
          </div>
          {issue.resources.length > 0 && (
            <div className="mt-4">
              <p className="text-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Resources:
              </p>
              <ul className="space-y-1">
                {issue.resources.map((resource, idx) => (
                  <li key={idx}>
                    <a
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                    >
                      {resource}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <span
          className="text-mono text-xs font-bold px-3 py-1 uppercase tracking-wider border-2 flex-shrink-0"
          style={{
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            borderColor: 'var(--danger)',
          }}
        >
          {issue.severity}
        </span>
      </div>
    </div>
  );
}

function ComplianceBadge({ compliant, label }: { compliant: boolean; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-mono text-sm font-bold px-4 py-2 uppercase tracking-wider border-2"
      style={{
        backgroundColor: compliant ? 'var(--success-bg)' : 'var(--danger-bg)',
        color: compliant ? 'var(--success)' : 'var(--danger)',
        borderColor: compliant ? 'var(--success)' : 'var(--danger)',
      }}
    >
      {compliant ? (
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
      ) : (
        <ShieldAlert className="h-4 w-4" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

export function LegalComplianceTab({ compliance }: LegalComplianceTabProps) {
  return (
    <div className="space-y-6">
      {/* PIPEDA Compliance */}
      <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal">
        <div className="p-4 border-b-2 border-[var(--ink)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Scale className="h-5 w-5 text-[var(--ink)]" aria-hidden="true" />
              <h3 className="text-display text-lg text-[var(--ink)]">PIPEDA Compliance</h3>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Personal Information Protection and Electronic Documents Act
            </p>
          </div>
          <ComplianceBadge
            compliant={compliance.pipedaStatus.compliant}
            label={compliance.pipedaStatus.compliant ? 'Compliant' : 'Non-Compliant'}
          />
        </div>
        <div className="p-6">
          {compliance.pipedaStatus.issues.length > 0 ? (
            <div className="space-y-4">
              {compliance.pipedaStatus.issues.map((issue, index) => (
                <IssueCard key={index} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-[var(--success)]">
              <Info className="h-5 w-5" />
              <p className="text-sm">No PIPEDA compliance issues identified.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bill C-27 Preparation */}
      <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal">
        <div className="p-4 border-b-2 border-[var(--ink)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-display text-lg text-[var(--ink)]">Bill C-27 Readiness</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Artificial Intelligence and Data Act (AIDA) preparation
            </p>
          </div>
          <ComplianceBadge
            compliant={compliance.billC27Status.prepared}
            label={compliance.billC27Status.prepared ? 'Prepared' : 'Action Needed'}
          />
        </div>
        <div className="p-6">
          {compliance.billC27Status.recommendations.length > 0 && (
            <div className="space-y-3">
              <p className="text-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                Recommendations to prepare:
              </p>
              <ul className="space-y-3">
                {compliance.billC27Status.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 border-2 border-[var(--border)] bg-[var(--cream)]"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-[var(--accent)] text-white flex items-center justify-center text-mono text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm text-[var(--text-secondary)] pt-0.5">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Provincial Compliance */}
      <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal">
        <div className="p-4 border-b-2 border-[var(--ink)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-display text-lg text-[var(--ink)]">
              {compliance.provincialStatus.province} Provincial Law
            </h3>
            <p className="text-sm text-[var(--text-muted)]">{compliance.provincialStatus.law}</p>
          </div>
          <ComplianceBadge
            compliant={compliance.provincialStatus.compliant}
            label={compliance.provincialStatus.compliant ? 'Compliant' : 'Non-Compliant'}
          />
        </div>
        <div className="p-6">
          {compliance.provincialStatus.issues.length > 0 ? (
            <div className="space-y-4">
              {compliance.provincialStatus.issues.map((issue, index) => (
                <IssueCard key={index} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-[var(--success)]">
              <Info className="h-5 w-5" />
              <p className="text-sm">
                No additional provincial compliance issues identified.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
