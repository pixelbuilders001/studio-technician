
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Job } from "@/lib/types";
import { JobCard } from "./JobCard";
import { ScrollArea } from "../ui/scroll-area";
import { useTranslation } from "@/hooks/useTranslation";

type JobTabsProps = {
  jobs: Job[];
};

export function JobTabs({ jobs }: JobTabsProps) {
  const { t } = useTranslation();
  
  const newJobs = jobs.filter((job) => job.status === "assigned");
  const activeJobs = jobs.filter((job) => job.status === "accepted" || job.status === "in-progress");
  const completedJobs = jobs.filter((job) => job.status === "completed");

  const renderJobList = (jobList: Job[], emptyMessage: string) => {
    if (jobList.length === 0) {
      return (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }
    return (
      <div className="space-y-3 p-4">
        {jobList.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="new" className="flex flex-1 flex-col">
      <div className="p-2 pb-0">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new">{t('job_tabs.new')} ({newJobs.length})</TabsTrigger>
          <TabsTrigger value="active">{t('job_tabs.active')} ({activeJobs.length})</TabsTrigger>
          <TabsTrigger value="completed">{t('job_tabs.completed')} ({completedJobs.length})</TabsTrigger>
        </TabsList>
      </div>
      <ScrollArea className="flex-1">
        <TabsContent value="new">
          {renderJobList(newJobs, t('job_tabs.no_new_jobs'))}
        </TabsContent>
        <TabsContent value="active">
          {renderJobList(activeJobs, t('job_tabs.no_active_jobs'))}
        </TabsContent>
        <TabsContent value="completed">
          {renderJobList(completedJobs, t('job_tabs.no_completed_jobs'))}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
