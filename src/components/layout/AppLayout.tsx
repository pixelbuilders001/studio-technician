import { BottomNav } from './BottomNav';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-card shadow-lg">
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
