/**
 * Choose Assessment Path Page
 *
 * Presents two distinct assessment options with brutalist civic authority aesthetic.
 * Users choose between manual guided assessment or automated quick scan.
 */

'use client';

import Link from 'next/link';
import { ArrowRight, ArrowLeft, Clock, Zap, CheckSquare } from 'lucide-react';

export default function ChooseAssessmentPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Skip Link */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Header with Login Link */}
      <header className="border-b-[3px] border-[var(--ink)] bg-[var(--surface)] py-4">
        <div className="container-lg flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--ink)] hover:text-[var(--accent)] transition-colors focus-ring"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            <span className="text-mono text-sm tracking-widest">BACK TO HOME</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-[var(--ink)] hover:text-[var(--accent)] text-mono text-sm tracking-widest transition-colors focus-ring"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--cream)] transition-colors text-mono text-sm tracking-widest focus-ring"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1 flex items-center py-8 md:py-16">
        <div className="container-lg w-full">
          {/* Page Header */}
          <div className="mb-12 text-center stagger">
            <p className="text-mono text-[var(--accent)] text-sm mb-4 tracking-widest">
              STEP 1: CHOOSE YOUR PATH
            </p>
            <h1 className="text-display text-display-md text-[var(--ink)] mb-4">
              How Would You
              <br />
              Like to Proceed?
            </h1>
            <div className="w-24 h-[3px] bg-[var(--accent)] mx-auto" />
          </div>

          {/* Two Assessment Options - Equal Layout */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-0 border-[3px] border-[var(--ink)] relative">
            {/* Straight vertical accent stripe separator - visible only on desktop */}
            <div
              className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-[var(--brand-secondary)] z-10"
              aria-hidden="true"
            />

            {/* Option 1: Manual Assessment (Larger, Primary) */}
            <div className="bg-[var(--ink)] text-[var(--cream)] p-8 md:p-12 flex flex-col relative md:border-r-[3px] border-[var(--ink)]">
              {/* Icon/Illustration */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-3 mb-4">
                  <Clock className="w-8 h-8 text-[var(--accent-on-dark)]" aria-hidden="true" />
                  <span className="text-mono text-xs tracking-widest text-[var(--accent-on-dark)]">
                    10 MINUTES
                  </span>
                </div>
                <h2 className="text-display text-display-sm text-[var(--cream)] mb-3">
                  Full Assessment
                </h2>
                <div className="w-16 h-[3px] bg-[var(--accent-on-dark)]" aria-hidden="true" />
              </div>

              {/* Description */}
              <p className="text-[var(--cream)]/80 mb-6 text-lg leading-relaxed">
                Answer in 5 quick steps for a comprehensive, tailored analysis of your AI compliance risks.
              </p>

              {/* 5-Step Preview */}
              <div className="mb-8 space-y-2 flex-1">
                {[
                  { num: '01', title: 'Business Profile', desc: 'Industry, location, size' },
                  { num: '02', title: 'AI Tools', desc: 'What tools you use' },
                  { num: '03', title: 'Data Types', desc: 'What data is processed' },
                  { num: '04', title: 'Usage Patterns', desc: 'How AI is used' },
                  { num: '05', title: 'Safeguards', desc: 'Current protections' },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="flex items-start gap-3 py-2 border-b border-[var(--cream)]/10"
                  >
                    <span className="text-display text-xl text-[var(--accent-on-dark)] tabular-nums w-10 flex-shrink-0">
                      {step.num}
                    </span>
                    <div className="flex-1">
                      <span className="text-[var(--cream)] font-medium block">{step.title}</span>
                      <span className="text-[var(--cream)]/60 text-sm">{step.desc}</span>
                    </div>
                    <CheckSquare className="w-4 h-4 text-[var(--cream)]/30 flex-shrink-0 mt-1" aria-hidden="true" />
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-auto">
                <Link
                  href="/business-profile"
                  className="btn-brutal-on-dark w-full justify-center"
                >
                  Start Assessment
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Option 2: Quick Scan (Equal, Secondary) */}
            <div className="bg-[var(--surface)] text-[var(--ink)] p-8 md:p-12 flex flex-col relative border-t-[3px] md:border-t-0 border-[var(--ink)]">
              {/* Icon/Illustration */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[var(--accent)] flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-mono text-xs tracking-widest text-[var(--accent)]">
                    INSTANT
                  </span>
                </div>
                <h2 className="text-display text-display-sm text-[var(--ink)] mb-3">
                  Quick Scan
                </h2>
                <div className="w-16 h-[3px] bg-[var(--accent)]" aria-hidden="true" />
              </div>

              {/* Description */}
              <p className="text-[var(--text-secondary)] mb-6 text-lg leading-relaxed">
                Just enter your website URL. Our AI-powered crawler automatically extracts
                and analyzes your business information for compliance risks.
              </p>

              {/* Scan Process Steps */}
              <div className="mb-8 space-y-2 flex-1">
                {[
                  { num: '01', title: 'Web Crawling', desc: 'Scan your website content' },
                  { num: '02', title: 'AI Detection', desc: 'Identify AI tools in use' },
                  { num: '03', title: 'Privacy Analysis', desc: 'Review policy documents' },
                  { num: '04', title: 'Data Mapping', desc: 'Track data flows' },
                  { num: '05', title: 'Risk Assessment', desc: 'Generate compliance report' },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="flex items-start gap-3 py-2 border-b border-[var(--ink)]/10"
                  >
                    <span className="text-display text-xl text-[var(--accent)] tabular-nums w-10 flex-shrink-0">
                      {step.num}
                    </span>
                    <div className="flex-1">
                      <span className="text-[var(--ink)] font-medium block">{step.title}</span>
                      <span className="text-[var(--text-secondary)] text-sm">{step.desc}</span>
                    </div>
                    <Zap className="w-4 h-4 text-[var(--accent)]/30 flex-shrink-0 mt-1" aria-hidden="true" />
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-auto">
                <Link
                  href="/quick-scan"
                  className="btn-brutal w-full justify-center bg-[var(--accent)] text-white border-[var(--accent)] hover:bg-[var(--accent-dark)]"
                >
                  Try Quick Scan
                  <Zap className="w-5 h-5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* Helper text - aligned with card box above */}
          <div className="max-w-5xl mx-auto text-center mt-8">
            <p className="text-mono text-xs text-[var(--text-muted)] tracking-wider">
              Both options are FREE and GENERATE FULL COMPLIANCE REPORTS
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-[var(--ink)] text-[var(--cream)]/60 border-t-[3px] border-[var(--accent-on-dark)]">
        <div className="container-lg text-center">
          <p className="text-mono text-xs">
            Educational guidance only. Not legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
