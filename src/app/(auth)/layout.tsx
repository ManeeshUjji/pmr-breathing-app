import Link from 'next/link';
import { PublicShell } from '@/components/layout/public-shell';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicShell
      headerRight={
        <Link
          href="/"
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Back to home
        </Link>
      }
      showFooter={false}
      mainClassName="px-4 flex items-center justify-center"
    >
      {children}
    </PublicShell>
  );
}



