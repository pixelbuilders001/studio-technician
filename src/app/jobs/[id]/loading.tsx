import { PageHeader } from '@/components/layout/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function LoadingJobDetail() {
  return (
    <div className="flex flex-col">
      <PageHeader title="Loading Job..." />
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        <Separator />

        <div className="space-y-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>

        <Separator />

        <div className="space-y-4">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>

      </div>
    </div>
  );
}
