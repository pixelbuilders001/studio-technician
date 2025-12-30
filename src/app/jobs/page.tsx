import { JobTabs } from "@/components/jobs/JobTabs";
import { DutyStatus } from "@/components/profile/DutyStatus";
import { jobs } from "@/lib/data";

export default function JobsPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <h1 className="text-xl font-bold font-headline">Jobs</h1>
        <DutyStatus />
      </header>
      <JobTabs jobs={jobs} />
    </div>
  );
}
