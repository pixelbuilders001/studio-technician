"use client"
import { jobs, sparePartsInventory } from "@/lib/data";
import type { Job } from "@/lib/types";
import { notFound } from "next/navigation";
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
  DollarSign,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { StatusUpdater } from "@/components/jobs/StatusUpdater";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { EstimateTime } from "@/components/jobs/EstimateTime";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RepairDetailsForm } from "@/components/jobs/RepairDetailsForm";
import { useTranslation } from "@/hooks/useTranslation";

async function getJob(id: string): Promise<Job | undefined> {
  // In a real app, you would fetch this from an API
  return jobs.find((job) => job.id === id);
}

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { t } = useTranslation();
  const job = await getJob(params.id);

  if (!job) {
    notFound();
  }

  const jobPhotos = PlaceHolderImages.filter((img) =>
    job.photos.includes(img.id)
  );

  const estimateTimeInput = {
    deviceType: job.deviceType,
    problemSummary: job.problemSummary,
    location: job.location,
    sparePartsAvailable: sparePartsInventory,
  };

  return (
    <div className="flex flex-col bg-secondary/30">
      <PageHeader title={`${t('job_page.job')} #${job.id}`} />
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

        {job.status === "active" && job.activeStatus && (
          <Card>
            <CardHeader>
              <CardTitle>{t('job_page.update_status')}</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusUpdater jobId={job.id} currentStatus={job.activeStatus} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t('job_page.customer_details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="font-medium">{job.customer.name}</div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
                <a href={`tel:${job.customer.phone}`}>
                    <Button variant="outline" className="w-full">
                        <Phone className="mr-2 h-4 w-4" /> {t('job_page.call_customer')}
                    </Button>
                </a>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.customer.address)}`} target="_blank" rel="noopener noreferrer">
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
              {job.deviceType}
            </p>
            <p className="whitespace-pre-wrap">
              <span className="font-semibold text-muted-foreground">{t('job_page.problem')}: </span>
              {job.problemDetails}
            </p>
             <p>
              <span className="font-semibold text-muted-foreground">{t('job_page.price_range')}: </span>
              ₹{job.estimatedPrice}
            </p>
             <p>
              <span className="font-semibold text-muted-foreground">{t('job_page.inspection')}: </span>
               ₹{job.inspectionCharge}
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

        {job.status === "new" && (
             <div className="grid grid-cols-2 gap-3 pt-4">
                <Button variant="destructive" className="w-full">
                     {t('job_page.cancel_job')}
                </Button>
                <Button className="w-full">
                    {t('job_page.start_job')}
                </Button>
            </div>
        )}
        
        {job.activeStatus === 'repair_completed' && !job.finalCost && (
            <RepairDetailsForm />
        )}

      </div>
    </div>
  );
}
