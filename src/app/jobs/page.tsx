

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
  const { profile } = useProfile(); // Keep for header, but not for fetching logic
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [technicianId, setTechnicianId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'new';

  const handleTabChange = (newTab: 'new' | 'ongoing' | 'completed') => {
    router.push(`/jobs?tab=${newTab}`);
  }

  // Effect 1: Get Technician ID from localStorage, runs only once.
  useEffect(() => {
    const storedProfile = localStorage.getItem('technicianProfile');
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        if (parsedProfile.id) {
          setTechnicianId(parsedProfile.id);
        } else {
           setLoading(false);
        }
      } catch (e) {
        console.error("Failed to parse technician profile from storage", e);
        setLoading(false);
      }
    } else {
        setLoading(false);
    }
  }, []); // Empty dependency array ensures this runs only once

  // Effect 2: Fetch jobs, runs only when technicianId changes.
  useEffect(() => {
    if (!technicianId) {
      return;
    }

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const fetchedJobs = await getJobsAction(technicianId);
        setJobs(fetchedJobs);
        setError(null);
      } catch (e: any) {
        setError(e.message || "Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [technicianId]); // This will run exactly once when technicianId is set.

  const refreshJobs = () => {
     if (technicianId) {
      getJobsAction(technicianId).then(setJobs);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <h1 className="text-xl font-bold font-headline">{t('jobs_page.title')}</h1>
        {profile && <span className="text-sm font-medium">Welcome, {profile.name.split(' ')[0]}</span>}
      </header>
      {loading ? (
        <JobsSkeleton />
      ) : error ? (
        <div className="flex h-64 items-center justify-center text-destructive">{error}</div>
      ) : (
        <JobTabs 
          jobs={jobs} 
          activeTab={tab as 'new' | 'ongoing' | 'completed'} 
          onTabChange={handleTabChange}
          technicianId={technicianId}
          onJobsUpdate={refreshJobs}
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
