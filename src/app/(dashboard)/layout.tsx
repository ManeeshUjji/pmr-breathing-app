import { UserProvider } from '@/contexts/user-context';
import { DashboardNav } from '@/components/layout/dashboard-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-bg-primary">
        <DashboardNav />
        <main className="pb-20 md:pb-8">{children}</main>
      </div>
    </UserProvider>
  );
}



