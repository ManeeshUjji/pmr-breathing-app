import { PublicShell } from '@/components/layout/public-shell';

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicShell showHeader={false} showFooter={false} mainClassName="px-0 pb-0">
      {children}
    </PublicShell>
  );
}


