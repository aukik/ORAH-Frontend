/**
 * Assessment Flow Layout - BRUTALIST CIVIC AUTHORITY
 *
 * Shared layout for all assessment steps.
 * High contrast design for accessibility.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header - Brutalist style */}
      <header className="border-b-[3px] border-[var(--ink)] bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo - Left */}
          <Link
            href="/"
            className="flex items-center gap-3 focus-ring"
          >
            <div className="w-8 h-8 bg-[var(--ink)] flex items-center justify-center">
              <Shield className="h-5 w-5 text-[var(--cream)]" aria-hidden="true" />
            </div>
            <span className="text-display text-xl text-[var(--ink)]">
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
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
