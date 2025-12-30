"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Job } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Settings, Check, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function JobCard({ job }: { job: Job }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Job Accepted",
      description: `Job #${job.id} has been moved to Active Jobs.`,
    });
    // In a real app, this would be an API call.
    // For now, we just navigate.
    router.push(`/jobs/${job.id}`);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Job Rejected",
      variant: "destructive",
      description: `You have rejected job #${job.id}.`,
    });
    // In a real app, this would be an API call.
  };

  const statusBadge = () => {
    if (job.status === "active") {
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">{job.activeStatus?.replace(/_/g, ' ')}</Badge>
    }
    if (job.status === "completed") {
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
    }
    return null
  }

  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <job.deviceIcon className="h-7 w-7 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-bold font-headline">{job.deviceType}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {job.problemSummary}
                </p>
              </div>
            </div>
            {statusBadge()}
          </div>
        </CardHeader>
        <CardContent className="border-t p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="font-semibold text-foreground">
              ₹{job.inspectionCharge}
              <span className="ml-1 font-normal text-muted-foreground">
                (insp.)
              </span>
            </div>
          </div>
        </CardContent>
        {job.status === "new" && (
          <CardFooter className="grid grid-cols-2 gap-3 bg-muted/50 p-2">
            <Button variant="outline" className="w-full bg-card" onClick={handleReject}>
              <X className="mr-2 h-4 w-4" /> Reject
            </Button>
            <Button className="w-full" onClick={handleAccept}>
              <Check className="mr-2 h-4 w-4" /> Accept
            </Button>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
