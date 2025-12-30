import { LoginForm } from '@/components/auth/LoginForm';
import { Wrench } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-primary p-4 text-primary-foreground">
            <Wrench className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-headline">
            FixFast Technician
          </h1>
          <p className="text-muted-foreground">
            Sign in to manage your repair jobs.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
