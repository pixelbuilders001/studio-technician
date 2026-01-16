

"use client"
import { JobTabs } from "@/components/jobs/JobTabs";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState, Suspense } from "react";
import { getJobsAction, getProfileAction } from "../actions";
import { useProfile } from "@/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";
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
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  console.log("jfjjfdjfdjj", jobs)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [technicianId, setTechnicianId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'new';

  const handleTabChange = (newTab: 'new' | 'ongoing' | 'completed') => {
    router.push(`/jobs?tab=${newTab}`);
  }

  // Effect 1: Get Technician Profile from Server Action
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileData = await getProfileAction();
        setProfile(profileData);
        setTechnicianId(profileData.id);
      } catch (e: any) {
        console.error("Failed to fetch technician profile", e);
        setError(e.message || "Failed to load profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Effect 2: Fetch jobs, runs only when technicianId changes.
  useEffect(() => {
    if (!technicianId) {
      return;
    }

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const fetchedJobs = await getJobsAction();
        setJobs(fetchedJobs);
        setError(null);
      } catch (e: any) {
        setError(e.message || "Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [technicianId]); // This will run whenever technicianId is set.

  const refreshJobs = async (newTab?: 'new' | 'ongoing' | 'completed') => {
    setLoading(true);
    try {
      const fetchedJobs = await getJobsAction();
      setJobs(fetchedJobs);
      if (newTab) {
        handleTabChange(newTab);
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 items-center border-b border-white/20 bg-white/70 backdrop-blur-lg px-4 justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold font-headline bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {t('jobs_page.title')}
        </h1>
        {profile && (
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
            <span className="text-xs font-semibold text-primary">{profile.full_name}</span>
          </div>
        )}
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
