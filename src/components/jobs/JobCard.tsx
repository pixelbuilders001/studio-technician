
"use client";

import { useRouter } from "next/navigation";
import type { Job } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Check, X, Wrench, Tv, Refrigerator, Smartphone, AirVent, WashingMachine, Calendar, User, ShoppingCart, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { format } from 'date-fns';

const iconMap: { [key: string]: React.ElementType } = {
  LAPTOPS: Wrench,
  TV: Tv,
  Refrigerator,
  Smartphone,
  "Air Conditioner": AirVent,
  "Washing Machine": WashingMachine,
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
        <div className="text-sm">
            <p className="font-medium text-foreground">{label}</p>
            <p className="text-muted-foreground">{value}</p>
        </div>
    </div>
);


export function JobCard({ job }: { job: Job }) {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: t('job_card.job_accepted_title'),
      description: `${t('job_card.job_accepted_description')} #${job.order_id}`,
    });
    // In a real app, you would also update the job status via an API call
    // and then likely refresh the list or move the card.
    router.push(`/jobs/${job.id}`); // For demo, we navigate
  };

  const handleReject = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: t('job_card.job_rejected_title'),
      variant: "destructive",
      description: `${t('job_card.job_rejected_description')} #${job.order_id}`,
    });
    // In a real app, you'd call an API to reject.
  };
  
  const DeviceIcon = iconMap[job.categories.name] || Wrench;

  const statusBadge = () => {
    const statusKey = job.status?.replace(/_/g, ' ');
    let className = "";

    switch(job.status) {
        case 'assigned':
            className="bg-orange-100 text-orange-800 border-orange-200";
            break;
        case 'accepted':
        case 'in-progress':
            className="bg-blue-100 text-blue-800 border-blue-200";
            break;
        case 'completed':
            className="bg-green-100 text-green-800 border-green-200";
            break;
        default:
            className="bg-gray-100 text-gray-800 border-gray-200";
    }

    if (statusKey) {
        return <Badge variant="outline" className={className}>{t(`job_api_status.${job.status}`)}</Badge>
    }
    return null
  }

  const handleCardClick = () => {
    if (job.status !== 'assigned') {
      router.push(`/jobs/${job.id}`);
    }
  };

  return (
      <Card className="overflow-hidden transition-all" onClick={handleCardClick}>
        <CardHeader className="p-4 bg-muted/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <DeviceIcon className="h-7 w-7 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base font-bold font-headline leading-tight">{job.categories.name}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  ID: {job.order_id}
                </p>
              </div>
            </div>
            {statusBadge()}
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
            <InfoRow icon={Tag} label={t('job_page.problem')} value={job.issues.title} />
            <InfoRow icon={User} label={t('job_page.customer_details')} value={job.user_name} />
            <InfoRow icon={MapPin} label={t('job_card.address')} value={job.full_address} />
            <InfoRow icon={Calendar} label={t('job_card.booked_on')} value={format(new Date(job.created_at), 'MMM dd, yyyy @ h:mm a')} />
            
            <div className="flex items-center justify-between text-sm rounded-lg bg-secondary/50 p-3">
                <div className='text-center'>
                    <p className="text-xs text-muted-foreground">{t('job_card.inspection_short')}</p>
                    <p className="font-bold text-sm text-foreground">₹{job.net_inspection_fee}</p>
                </div>
                <div className='text-center'>
                     <p className="text-xs text-muted-foreground">{t('job_page.price_range')}</p>
                     <p className="font-bold text-sm text-foreground">₹{job.total_estimated_price}</p>
                </div>
            </div>
        </CardContent>
        {job.status === "assigned" && (
          <CardFooter className="grid grid-cols-2 gap-3 bg-muted/50 p-2">
            <Button variant="outline" className="w-full bg-card" onClick={handleReject}>
              <X className="mr-2 h-4 w-4" /> {t('job_card.reject')}
            </Button>
            <Button className="w-full" onClick={handleAccept}>
              <Check className="mr-2 h-4 w-4" /> {t('job_card.accept')}
            </Button>
          </CardFooter>
        )}
      </Card>
  );
}
