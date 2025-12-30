"use client"
import { JobTabs } from "@/components/jobs/JobTabs";
import { DutyStatus } from "@/components/profile/DutyStatus";
import { jobs } from "@/lib/data";
import { useTranslation } from "@/hooks/useTranslation";

export default function JobsPage() {
  const { t } = useTranslation();
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <h1 className="text-xl font-bold font-headline">{t('jobs_page.title')}</h1>
        <DutyStatus />
      </header>
      <JobTabs jobs={jobs} />
    </div>
  );
}
