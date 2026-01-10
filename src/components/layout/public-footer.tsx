'use client';

import Link from 'next/link';

export function PublicFooter() {
  return (
    <footer className="border-t border-accent-light/20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="text-xl font-semibold text-text-primary font-[family-name:var(--font-dm-serif)]">
            Tranquil
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-text-muted">
            <Link href="/privacy" className="hover:text-text-secondary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-text-secondary transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-text-secondary transition-colors">
              Contact
            </Link>
          </nav>

          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Tranquil. Find your calm.
          </p>
        </div>
      </div>
    </footer>
  );
}


