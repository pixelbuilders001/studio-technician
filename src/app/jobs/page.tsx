
"use client"
import { JobTabs } from "@/components/jobs/JobTabs";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState, Suspense } from "react";
import { getJobsAction } from "../actions";
import { useProfile } from "@/hooks/useProfile";
import type { Job } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, useRouter } from "next/navigation";

function JobsSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}

function JobsPageContent() {
  const { t } = useTranslation();
  const { profile, loading: profileLoading } = useProfile();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'new';

  const handleTabChange = (newTab: 'new' | 'active' | 'completed') => {
    router.push(`/jobs?tab=${newTab}`);
  }

  useEffect(() => {
    if (profile?.id) {
      const fetchJobs = async () => {
        try {
          setLoading(true);
          const fetchedJobs = await getJobsAction(profile.id);
          setJobs(fetchedJobs);
          setError(null);
        } catch (e: any) {
          setError(e.message || "Failed to fetch jobs.");
        } finally {
          setLoading(false);
        }
      };
      fetchJobs();
    }
  }, [profile?.id]);

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <h1 className="text-xl font-bold font-headline">{t('jobs_page.title')}</h1>
        {profile && <span className="text-sm font-medium">Welcome, {profile.name.split(' ')[0]}</span>}
      </header>
      {profileLoading || loading ? (
        <JobsSkeleton />
      ) : error ? (
        <div className="flex h-64 items-center justify-center text-destructive">{error}</div>
      ) : (
        <JobTabs 
          jobs={jobs} 
          activeTab={tab as 'new' | 'active' | 'completed'} 
          onTabChange={handleTabChange} 
        />
      )}
    </div>
  );
}


export default function JobsPage() {
  return (
    <Suspense fallback={<JobsSkeleton />}>
      <JobsPageContent />
    </Suspense>
  )
}
