/**
 * Quick Scan Layout - BRUTALIST CIVIC AUTHORITY
 *
 * Layout for the Quick Scan website scanning flow.
 * Provides consistent header and footer.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, ArrowRight } from 'lucide-react';

export default function QuickScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Skip Link */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Header with Navigation */}
      <header className="border-b-[3px] border-[var(--ink)] bg-[var(--surface)]">
        <div className="container-lg py-4 flex items-center justify-between">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-3 focus-ring">
            <div className="w-10 h-10 bg-[var(--ink)] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[var(--cream)]" aria-hidden="true" />
            </div>
            <span className="text-display text-display-sm text-[var(--ink)] hidden sm:block">
              Responsibly
            </span>
          </Link>

          {/* Navigation - Right */}
          <div className="flex items-center gap-6">
            <Link
              href={`/login?returnTo=${encodeURIComponent(pathname)}`}
              className="text-[var(--ink)] hover:text-[var(--accent)] text-mono text-sm tracking-widest transition-colors"
            >
              Login
            </Link>
            <Link
              href={`/signup?returnTo=${encodeURIComponent(pathname)}`}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--cream)] transition-colors text-mono text-sm tracking-widest focus-ring"
            >
              Sign Up
            </Link>
            <Link
              href="/business-profile"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--cream)] transition-colors text-mono text-sm tracking-widest focus-ring"
            >
              <span>Full Assessment</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main" className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="py-6 bg-[var(--surface)] border-t-[3px] border-[var(--ink)]">
        <div className="container-lg flex justify-center">
          <p className="text-mono text-xs text-[var(--text-muted)] text-center">
            Quick Scan uses web scraping to analyze your website. Results are estimates—verify before acting.
          </p>
        </div>
      </footer>
    </div>
  );
}
