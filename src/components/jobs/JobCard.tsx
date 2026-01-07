

"use client";

import { useRouter } from "next/navigation";
import type { Job, JobStatus } from "@/lib/types";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { MapPin, Check, X, Wrench, Tv, Refrigerator, Smartphone, AirVent, WashingMachine, Info, IndianRupee, Phone, Navigation, CheckCircle, ArrowRight, HandCoins, FileText, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useTransition } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { format } from 'date-fns';
import { Separator } from "../ui/separator";
import { updateJobStatusAction } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RepairDetailsForm } from "./RepairDetailsForm";
import { EarningSheet } from "./EarningSheet";
import { InspectionDetailsForm } from "./InspectionDetailsForm";
import { ShareQuoteForm } from "./ShareQuoteForm";

const iconMap: { [key: string]: React.ElementType } = {
  LAPTOPS: Wrench,
  TV: Tv,
  Refrigerator,
  Smartphone,
  "Air Conditioner": AirVent,
  "Washing Machine": WashingMachine,
};

const InfoRow = ({ icon: Icon, value, label }: { icon: React.ElementType, value: React.ReactNode, label: string }) => (
    <div className="flex items-start gap-3 text-sm">
        <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-1" />
        <div>
            <p className="font-semibold text-foreground">{label}</p>
            <p className="text-muted-foreground">{value}</p>
        </div>
    </div>
);

type StatusConfig = {
    [key in JobStatus]?: {
        nextStatus: JobStatus;
        buttonTextKey: string;
        buttonIcon: React.ElementType;
    }
}

const statusFlow: StatusConfig = {
    'accepted': {
        nextStatus: 'on_the_way',
        buttonTextKey: 'start_travel',
        buttonIcon: Navigation,
    },
    'on_the_way': {
        nextStatus: 'inspection_started',
        buttonTextKey: 'start_inspection',
        buttonIcon: Wrench,
    },
    'quotation_approved': {
        nextStatus: 'repair_started',
        buttonTextKey: 'start_repair',
        buttonIcon: Wrench,
    },
}


export function JobCard({ job, technicianId, onJobsUpdate }: { job: Job, technicianId: string | null, onJobsUpdate: () => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [isRepairFormOpen, setIsRepairFormOpen] = useState(false);

  const handleStatusUpdate = (status: JobStatus) => {
    if (!technicianId) {
        toast({ title: "Error", description: "Technician profile not found.", variant: "destructive" });
        return;
    }

    startTransition(async () => {
        try {
            await updateJobStatusAction({
                booking_id: job.id,
                status: status,
                note: `Technician has updated the job to ${status}.`,
                order_id: job.order_id,
            });
            toast({
                title: t('status_updater.toast_title'),
                description: `${t('status_updater.toast_description')} ${t(`job_api_status.${status}`)}`,
            });
            onJobsUpdate();
            
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message || "Could not update job status.",
                variant: "destructive",
            });
        }
    });
  };
  
  const DeviceIcon = iconMap[job.categories.name] || Wrench;

  const statusBadge = () => {
    let className = "";
    const statusKey = job.status as JobStatus;

    switch(statusKey) {
        case 'assigned':
            className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100/80";
            break;
        case 'accepted':
            className="bg-blue-100 text-blue-800 border-blue-200";
            break;
        case 'on_the_way':
            className="bg-cyan-100 text-cyan-800 border-cyan-200";
            break;
        case 'in-progress': // This might be deprecated by more specific statuses
        case 'inspection_started':
        case 'repair_started':
             className="bg-purple-100 text-purple-800 border-purple-200";
            break;
        case 'inspection_completed':
        case 'quotation_shared':
        case 'quotation_approved':
            className="bg-yellow-100 text-yellow-800 border-yellow-200";
            break;
        case 'completed':
        case 'repair_completed':
        case 'closed_no_repair':
            className="bg-green-100 text-green-800 border-green-200";
            break;
        case 'cancelled':
        case 'rejected':
        case 'quotation_rejected':
            className="bg-red-100 text-red-800 border-red-200";
            break;
        default:
            className="bg-gray-100 text-gray-800 border-gray-200";
    }

    if (job.status) {
        return <Badge variant="outline" className={cn("capitalize whitespace-nowrap", className)}>{t(`job_api_status.${statusKey}`)}</Badge>
    }
    return null
  }

  const formatPhoneNumber = (phone: string) => {
    if (!phone || phone.length < 10) return phone;
    const countryCode = phone.length > 10 ? phone.slice(0, -10) : '91';
    const number = phone.slice(-10);
    return `+${countryCode}XXXXXX${number.slice(-2)}`;
  }

  const nextAction = statusFlow[job.status];
  const NextActionIcon = nextAction?.buttonIcon;


  const renderFooter = () => {
    if (job.status === 'assigned') {
        return (
             <>
              <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full bg-card" disabled={isPending}>
                          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                          {t('job_card.reject')}
                      </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to reject this job?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This action cannot be undone. This job will be removed from your list.
                      </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleStatusUpdate('rejected')}>
                          Confirm Reject
                      </AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
              <Button className="w-full" onClick={() => handleStatusUpdate('accepted')} disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                {t('job_card.accept')}
              </Button>
            </>
        )
    }

    if (['completed', 'repair_completed', 'closed_no_repair'].includes(job.status)) {
        return (
             <div className="col-span-2">
                <EarningSheet job={job}>
                    <Button variant="secondary" className="w-full">
                        <HandCoins className="mr-2 h-4 w-4" />
                        See Earning
                    </Button>
                </EarningSheet>
            </div>
        )
    }

    // Default buttons for ongoing jobs
    let mainActionButton = null;

    if (nextAction && NextActionIcon) {
        mainActionButton = (
            <Button size="sm" className="w-full text-xs" onClick={() => handleStatusUpdate(nextAction.nextStatus)} disabled={isPending}>
                {isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <NextActionIcon className="mr-1 h-4 w-4" />}
                {t(`status_updater.${nextAction.buttonTextKey}`)}
            </Button>
        );
    } else if (job.status === 'inspection_started' && technicianId) {
        mainActionButton = (
             <InspectionDetailsForm
                job={job}
                technicianId={technicianId}
                onFormSubmit={onJobsUpdate}
             >
                <Button size="sm" className="w-full text-xs" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <FileText className="mr-1 h-4 w-4" />}
                    {t('status_updater.inspection_done')}
                </Button>
            </InspectionDetailsForm>
        );
    } else if (job.status === 'inspection_completed') {
        mainActionButton = (
            <ShareQuoteForm
                job={job}
                onFormSubmit={onJobsUpdate}
            >
                <Button size="sm" className="w-full text-xs" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Share2 className="mr-1 h-4 w-4" />}
                    {t('status_updater.share_quote')}
                </Button>
            </ShareQuoteForm>
        );
    } else if (job.status === 'quotation_shared') {
        mainActionButton = (
            <Button size="sm" className="w-full text-xs" disabled>
                <Check className="mr-1 h-4 w-4" />
                {t('status_updater.quote_sent')}
            </Button>
        );
    } else if (job.status === 'repair_started') {
        mainActionButton = (
             <RepairDetailsForm
                job={job}
                onFormSubmit={onJobsUpdate}
             >
                <Button size="sm" className="w-full text-xs" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-1 h-4 w-4" />}
                    {t('status_updater.complete_job')}
                </Button>
            </RepairDetailsForm>
        );
    }


    return (
        <div className="col-span-2 grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                <a href={`tel:${job.mobile_number}`}><Phone className="mr-1 h-4 w-4" /> Call</a>
            </Button>
            {job.map_url ? (
                <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                    <a href={job.map_url} target="_blank" rel="noopener noreferrer">
                        <Navigation className="mr-1 h-4 w-4" /> Navigate
                    </a>
                </Button>
            ) : (
                <Button variant="outline" size="sm" className="w-full text-xs" disabled>
                    <Navigation className="mr-1 h-4 w-4" /> Navigate
                </Button>
            )}
            {mainActionButton}
        </div>
    )
  }

  return (
      <Card className="overflow-hidden transition-all shadow-md">
         <CardHeader className="flex-row items-start justify-between gap-4 p-4">
             <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary flex-shrink-0">
                    <DeviceIcon className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <CardTitle className="text-base font-bold font-headline truncate">{job.categories.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                        {format(new Date(job.created_at), 'MMM dd, yyyy · h:mm a')}
                    </p>
                </div>
            </div>
             <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                <p className="font-bold text-lg">₹{job.total_estimated_price}</p>
                 {statusBadge()}
            </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 space-y-4">
            <InfoRow icon={Info} label="Problem" value={job.issues.title} />
            <InfoRow icon={MapPin} label="Address" value={job.full_address} />
            <InfoRow icon={IndianRupee} label="Inspection Fee" value={`₹${job.net_inspection_fee}`} />
        </CardContent>

        <Separator/>

        <div className="p-4 flex items-center justify-between">
             <div>
                <p className="font-semibold text-sm">{job.user_name}</p>
                 {job.mobile_number && <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone size={12}/> {formatPhoneNumber(job.mobile_number)}</p>}
            </div>
            {job.media_url && (
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="relative h-12 w-12 rounded-md overflow-hidden cursor-pointer flex-shrink-0">
                            <Image src={job.media_url} alt="Job photo" fill className="object-cover"/>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="p-0 border-0 max-w-screen-md">
                            <Image 
                            src={job.media_url} 
                            alt="Job photo" 
                            width={800}
                            height={600}
                            className="w-full h-auto object-contain rounded-lg"
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
        
        <CardFooter className="grid grid-cols-2 gap-3 p-2 bg-muted/50">
          {renderFooter()}
        </CardFooter>

      </Card>
  );
}
