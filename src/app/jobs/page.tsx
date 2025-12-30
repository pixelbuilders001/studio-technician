import { JobTabs } from "@/components/jobs/JobTabs";
import { jobs } from "@/lib/data";

export default function JobsPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center border-b bg-background px-4">
        <h1 className="text-xl font-bold font-headline">Jobs</h1>
      </header>
      <JobTabs jobs={jobs} />
    </div>
  );
}
