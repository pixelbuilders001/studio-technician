"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Job } from "@/lib/types";
import { JobCard } from "./JobCard";
import { ScrollArea } from "../ui/scroll-area";

type JobTabsProps = {
  jobs: Job[];
};

export function JobTabs({ jobs }: JobTabsProps) {
  const newJobs = jobs.filter((job) => job.status === "new");
  const activeJobs = jobs.filter((job) => job.status === "active");
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
          <TabsTrigger value="new">New ({newJobs.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedJobs.length})</TabsTrigger>
        </TabsList>
      </div>
      <ScrollArea className="flex-1">
        <TabsContent value="new">
          {renderJobList(newJobs, "No new jobs available.")}
        </TabsContent>
        <TabsContent value="active">
          {renderJobList(activeJobs, "You have no active jobs.")}
        </TabsContent>
        <TabsContent value="completed">
          {renderJobList(completedJobs, "No jobs completed yet.")}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
