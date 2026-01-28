/**
 * Report Layout - BRUTALIST CIVIC AUTHORITY
 *
 * Shared layout for report viewing pages.
 * High contrast design with commanding header.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header - Brutalist style */}
      <header className="border-b-[3px] border-[var(--ink)] bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo - Left */}
          <Link
            href="/"
            className="flex items-center gap-3 focus-ring"
          >
            <div className="w-10 h-10 bg-[var(--ink)] flex items-center justify-center">
              <Shield className="h-6 w-6 text-[var(--cream)]" aria-hidden="true" />
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

      <main id="main-content">{children}</main>
    </div>
  );
}
