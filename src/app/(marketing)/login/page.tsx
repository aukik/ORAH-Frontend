/**
 * Login Page - BRUTALIST CIVIC AUTHORITY
 *
 * Official access portal for user authentication.
 * Raw, utilitarian design with commanding presence.
 */

'use client';

import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

/**
 * LoginForm component - extracted to enable Suspense wrapping
 * This component uses useSearchParams() which requires a Suspense boundary
 * for Next.js App Router static generation compatibility.
 */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/choose-assessment';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Dummy login - just redirect
    router.push(returnTo);
  };

  return (
    <div className="w-full max-w-md">
      {/* Portal Identity */}
      <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 bg-[var(--ink)] border-[3px] border-[var(--ink)] flex items-center justify-center relative">
                <Shield className="w-12 h-12 text-[var(--cream)]" aria-hidden="true" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--accent)]" />
              </div>
            </div>
            <h1 className="text-display text-4xl text-[var(--ink)] mb-2 tracking-tight">
              SECURE ACCESS
            </h1>
            <p className="text-mono text-sm text-[var(--text-secondary)] tracking-widest">
              AUTHORIZED PERSONNEL ONLY
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-mono text-xs tracking-widest text-[var(--ink)] mb-2 uppercase"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border-2 bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all ${
                    errors.email ? 'border-[var(--danger)]' : 'border-[var(--ink)]'
                  }`}
                  placeholder="your.email@domain.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <div id="email-error" className="mt-2 flex items-start gap-2" role="alert">
                  <AlertCircle className="w-4 h-4 text-[var(--danger)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-[var(--danger)]">{errors.email}</p>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-mono text-xs tracking-widest text-[var(--ink)] mb-2 uppercase"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border-2 bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all ${
                    errors.password ? 'border-[var(--danger)]' : 'border-[var(--ink)]'
                  }`}
                  placeholder="Enter your password"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                </div>
              </div>
              {errors.password && (
                <div id="password-error" className="mt-2 flex items-start gap-2" role="alert">
                  <AlertCircle className="w-4 h-4 text-[var(--danger)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-[var(--danger)]">{errors.password}</p>
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                      rememberMe
                        ? 'bg-[var(--ink)] border-[var(--ink)]'
                        : 'border-[var(--ink)] bg-[var(--surface)]'
                    }`}
                  >
                    {rememberMe && (
                      <div className="w-2 h-2 bg-[var(--accent)]" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                  Remember me
                </span>
              </label>

              <a
                href="#"
                className="text-sm text-[var(--accent)] hover:text-[var(--accent-dark)] underline decoration-2 underline-offset-2 transition-colors focus-ring"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-brutal disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" aria-hidden="true" />
                  LOGIN
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t-2 border-[var(--border)] text-center">
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Don&apos;t have an account?
            </p>
            <Link
              href={`/signup?returnTo=${encodeURIComponent(returnTo)}`}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--cream)] transition-colors text-mono text-sm tracking-widest focus-ring"
            >
              CREATE ACCOUNT
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 border-2 border-[var(--border)] bg-[var(--surface)]">
            <p className="text-mono text-xs text-[var(--text-muted)] leading-relaxed">
              NOTICE: This is a secure authentication portal. All access attempts are logged and monitored.
              Unauthorized access is prohibited.
            </p>
          </div>
        </div>
  );
}

/**
 * LoginPage - Main page component
 * Wraps LoginForm in Suspense boundary to handle useSearchParams() requirement.
 * The loading fallback provides a consistent experience during static generation.
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      {/* Header */}
      <header className="border-b-[3px] border-[var(--ink)] bg-[var(--surface)] py-4">
        <div className="container-lg">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-mono text-sm tracking-widest text-[var(--ink)] hover:text-[var(--accent)] transition-colors focus-ring"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            BACK TO HOME
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={
          <div className="w-full max-w-md text-center">
            <div className="text-mono text-sm text-[var(--text-muted)] tracking-widest">
              LOADING...
            </div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
