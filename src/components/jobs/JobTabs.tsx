
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Job } from "@/lib/types";
import { JobCard } from "./JobCard";
import { ScrollArea } from "../ui/scroll-area";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";

type JobTabsProps = {
  jobs: Job[];
  activeTab: 'new' | 'ongoing' | 'completed';
  onTabChange: (tab: 'new' | 'ongoing' | 'completed') => void;
};

export function JobTabs({ jobs, activeTab, onTabChange }: JobTabsProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const newJobs = jobs.filter((job) => job.status === "assigned");
  const ongoingJobs = jobs.filter((job) => ["accepted", "on_the_way", "in-progress"].includes(job.status));
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

  const handleTabChange = (value: string) => {
    onTabChange(value as 'new' | 'ongoing' | 'completed');
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-1 flex-col">
      <div className="p-2 pb-0">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new">{t('job_tabs.new')} ({newJobs.length})</TabsTrigger>
          <TabsTrigger value="ongoing">{t('job_tabs.ongoing')} ({ongoingJobs.length})</TabsTrigger>
          <TabsTrigger value="completed">{t('job_tabs.completed')} ({completedJobs.length})</TabsTrigger>
        </TabsList>
      </div>
      <ScrollArea className="flex-1">
        <TabsContent value="new">
          {renderJobList(newJobs, t('job_tabs.no_new_jobs'))}
        </TabsContent>
        <TabsContent value="ongoing">
          {renderJobList(ongoingJobs, t('job_tabs.no_ongoing_jobs'))}
        </TabsContent>
        <TabsContent value="completed">
          {renderJobList(completedJobs, t('job_tabs.no_completed_jobs'))}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
