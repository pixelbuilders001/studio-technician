
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Job } from "@/lib/types";
import { JobCard } from "./JobCard";
import { ScrollArea } from "../ui/scroll-area";

import { Briefcase, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

type JobTabsProps = {
  jobs: Job[];
  activeTab: 'new' | 'ongoing' | 'completed';
  onTabChange: (tab: 'new' | 'ongoing' | 'completed') => void;
  technicianId: string | null;
  onJobsUpdate: (newTab?: 'new' | 'ongoing' | 'completed') => void;
};

export function JobTabs({ jobs, activeTab, onTabChange, technicianId, onJobsUpdate }: JobTabsProps) {

  const router = useRouter();

  const newJobs = jobs.filter((job) => job.status === "assigned");
  const ongoingJobs = jobs.filter((job) => [
    "accepted",
    "on_the_way",
    "inspection_started",
    "inspection_completed",
    "quotation_shared",
    "quotation_approved",
    "repair_started",
    "in-progress",// Keep for backward compatibility
    "code_sent",
    "payment_pending"
  ].includes(job.status));

  const completedJobs = jobs.filter((job) => [
    "completed",
    "repair_completed",
    "closed_no_repair",
    "cancelled",
    "job_rejected",
    "quotation_rejected"
  ].includes(job.status));


  const renderJobList = (jobList: Job[], emptyMessage: string) => {
    if (jobList.length === 0) {
      return (
        <div className="flex h-96 flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-slate-200/50 rounded-full animate-ping [animation-duration:3s]"></div>
            <Briefcase className="w-10 h-10 text-slate-300 relative z-10" />
          </div>
          <div className="space-y-4 max-w-[280px]">
            <div className="space-y-1">
              <p className="font-bold text-slate-900">{emptyMessage}</p>
              <p className="text-sm text-slate-400">Pull down to refresh or check back later.</p>
            </div>

            <button
              onClick={() => onJobsUpdate()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all w-full justify-center"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh Now
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-4 p-4 pb-20">
        {jobList.map((job) => (
          <JobCard key={job.id} job={job} technicianId={technicianId} onJobsUpdate={onJobsUpdate} />
        ))}
      </div>
    );
  };

  const handleTabChange = (value: string) => {
    onTabChange(value as 'new' | 'ongoing' | 'completed');
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-1 flex-col">
      <div className="p-4 pb-2 sticky top-16 bg-white/50 backdrop-blur-md z-40">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100/80 p-1.5 h-12 rounded-2xl border border-white">
          <TabsTrigger value="new" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all font-bold text-xs uppercase tracking-wider">
            New ({newJobs.length})
          </TabsTrigger>
          <TabsTrigger value="ongoing" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all font-bold text-xs uppercase tracking-wider">
            Ongoing ({ongoingJobs.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all font-bold text-xs uppercase tracking-wider">
            Completed ({completedJobs.length})
          </TabsTrigger>
        </TabsList>
      </div>
      <ScrollArea className="flex-1">
        <TabsContent value="new" className="m-0 focus-visible:ring-0">
          {renderJobList(newJobs, "No new jobs available.")}
        </TabsContent>
        <TabsContent value="ongoing" className="m-0 focus-visible:ring-0">
          {renderJobList(ongoingJobs, "You have no ongoing jobs.")}
        </TabsContent>
        <TabsContent value="completed" className="m-0 focus-visible:ring-0">
          {renderJobList(completedJobs, "No jobs completed yet.")}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
