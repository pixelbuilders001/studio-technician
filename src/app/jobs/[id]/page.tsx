
"use client"
import type { Job } from "@/lib/types";
import { notFound, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Phone,
  MapPin,
  Settings,
  Camera,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { StatusUpdater } from "@/components/jobs/StatusUpdater";
import Image from "next/image";
import { EstimateTime } from "@/components/jobs/EstimateTime";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RepairDetailsForm } from "@/components/jobs/RepairDetailsForm";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";
import { getJobsAction, updateJobStatusAction } from "@/app/actions";
import { useProfile } from "@/hooks/useProfile";
import LoadingJobDetail from "./loading";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

async function getJob(id: string, technicianId: string): Promise<Job | undefined> {
  const allJobs = await getJobsAction(technicianId);
  const job = allJobs.find((job: Job) => job.id === id);
  return job;
}

export default function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { t } = useTranslation();
  const [job, setJob] = useState<Job | undefined | null>(null);
  const { profile } = useProfile();
  const router = useRouter();
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);


  useEffect(() => {
    if (profile?.id) {
      getJob(params.id, profile.id).then(job => {
        if (!job) {
            // If job is not found, maybe it was cancelled or completed
            // and the list on the previous page is stale.
            toast({
                title: "Job not found",
                description: "It might have been updated. Refreshing job list.",
                variant: "destructive"
            });
            router.push('/jobs');
        } else {
            setJob(job);
        }
      });
    }
  }, [params.id, profile?.id, router, toast]);

  const handleCancelJob = async () => {
      if (!job || !profile) return;
      setIsCancelling(true);
      try {
          await updateJobStatusAction({
              booking_id: job.id,
              status: 'cancelled',
              note: 'Cancelled by technician',
              order_id: job.order_id
          });
          toast({
              title: "Job Cancelled",
              description: `Job #${job.order_id} has been cancelled.`
          });
          router.push('/jobs');
      } catch (error: any) {
          toast({
              title: "Cancellation Failed",
              description: error.message || "Could not cancel the job.",
              variant: "destructive"
          });
      } finally {
          setIsCancelling(false);
      }
  }


  if (job === null) {
    return <LoadingJobDetail />;
  }

  if (!job) {
    notFound();
  }

  const jobPhotos = job.media_url ? [{ id: '1', imageUrl: job.media_url, description: 'Job photo', imageHint: 'repair' }] : [];
  
  const estimateTimeInput = {
    deviceType: job.categories.name,
    problemSummary: job.issues.title,
    location: job.full_address,
    sparePartsAvailable: "N/A", // This would come from inventory
  };

  const isJobActive = !['completed', 'cancelled', 'rejected'].includes(job.status);


  return (
    <div className="flex flex-col bg-secondary/30 min-h-screen">
      <PageHeader title={`${t('job_page.job')} #${job.order_id}`} />
      <div className="flex-1 space-y-4 p-4">
        {job.status === 'completed' && job.finalCost && (
            <Alert variant="default" className="bg-green-100 border-green-200 text-green-900">
                <AlertCircle className="h-4 w-4 !text-green-900" />
                <AlertTitle className="font-bold">{t('job_page.job_completed')}</AlertTitle>
                <AlertDescription>
                   {t('job_page.final_amount_to_collect')} ₹{job.finalCost}. {t('job_page.remind_customer')}
                </AlertDescription>
            </Alert>
        )}

        {isJobActive && (
          <Card>
            <CardHeader>
              <CardTitle>{t('job_page.update_status')}</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusUpdater jobId={job.id} orderId={job.order_id} currentStatus={job.status} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t('job_page.customer_details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="font-medium">{job.user_name}</div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
                <a href={`tel:${job.mobile_number || 'N/A'}`}>
                    <Button variant="outline" className="w-full">
                        <Phone className="mr-2 h-4 w-4" /> {t('job_page.call_customer')}
                    </Button>
                </a>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.full_address)}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                        <MapPin className="mr-2 h-4 w-4" /> {t('job_page.open_maps')}
                    </Button>
                </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t('job_page.job_details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              <span className="font-semibold text-muted-foreground">{t('job_page.device')}: </span>
              {job.categories.name}
            </p>
            <p className="whitespace-pre-wrap">
              <span className="font-semibold text-muted-foreground">{t('job_page.problem')}: </span>
              {job.issues.title}
            </p>
             <p>
              <span className="font-semibold text-muted-foreground">{t('job_page.price_range')}: </span>
              ₹{job.total_estimated_price}
            </p>
             <p>
              <span className="font-semibold text-muted-foreground">{t('job_page.inspection')}: </span>
               ₹{job.net_inspection_fee}
            </p>
            <EstimateTime jobDetails={estimateTimeInput} />
          </CardContent>
        </Card>

        {jobPhotos.length > 0 && (
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <Camera className="h-5 w-5 text-muted-foreground" />
              <CardTitle>{t('job_page.uploaded_photos')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {jobPhotos.map((photo) => (
                <Image
                  key={photo.id}
                  src={photo.imageUrl}
                  alt={photo.description}
                  data-ai-hint={photo.imageHint}
                  width={200}
                  height={150}
                  className="rounded-lg object-cover"
                />
              ))}
            </CardContent>
          </Card>
        )}

        {job.status === "assigned" && (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full" disabled={isCancelling}>
                        {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                         {t('job_page.cancel_job')}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently cancel the job and remove it from your list. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Back</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelJob}>Confirm Cancel</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
        
        {job.status === 'in-progress' && !job.finalCost && (
            <RepairDetailsForm />
        )}

      </div>
    </div>
  );
}
