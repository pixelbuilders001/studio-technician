
"use client";

import { useRouter } from "next/navigation";
import type { Job } from "@/lib/types";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Check, X, Wrench, Tv, Refrigerator, Smartphone, AirVent, WashingMachine, Calendar, User, ShoppingCart, Tag, Camera, Info, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { format } from 'date-fns';
import { Separator } from "../ui/separator";

const iconMap: { [key: string]: React.ElementType } = {
  LAPTOPS: Wrench,
  TV: Tv,
  Refrigerator,
  Smartphone,
  "Air Conditioner": AirVent,
  "Washing Machine": WashingMachine,
};

const InfoRow = ({ icon: Icon, value, className }: { icon: React.ElementType, value: React.ReactNode, className?: string }) => (
    <div className={cn("flex items-center gap-3 text-sm text-muted-foreground", className)}>
        <Icon className="h-4 w-4 flex-shrink-0" />
        <p className="text-foreground">{value}</p>
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
    router.push(`/jobs/${job.id}`);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: t('job_card.job_rejected_title'),
      variant: "destructive",
      description: `${t('job_card.job_rejected_description')} #${job.order_id}`,
    });
  };
  
  const DeviceIcon = iconMap[job.categories.name] || Wrench;

  const statusBadge = () => {
    const statusKey = job.status?.replace(/_/g, ' ');
    let className = "";

    switch(job.status) {
        case 'assigned':
            className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100/80";
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
        return <Badge variant="outline" className={cn("capitalize", className)}>{t(`job_api_status.${job.status}`)}</Badge>
    }
    return null
  }

  const handleCardClick = () => {
    if (job.status !== 'assigned') {
      router.push(`/jobs/${job.id}`);
    }
  };

  return (
      <Card className="overflow-hidden transition-all shadow-md" onClick={handleCardClick}>
        <div className="p-4">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <DeviceIcon className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                        <p className="font-bold font-headline">{job.categories.name}</p>
                        <p className="text-xs text-muted-foreground">
                        #{job.order_id}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {statusBadge()}
                    <p className="font-bold text-lg">₹{job.total_estimated_price}</p>
                </div>
            </div>
        </div>
        <Separator/>
        <CardContent className="p-4 space-y-3 text-sm">
            <InfoRow icon={Info} value={job.issues.title} />
            <InfoRow icon={MapPin} value={job.full_address} />
            <p className="text-sm text-muted-foreground ml-7">{format(new Date(job.created_at), 'MMM dd · h:mm a')}</p>
        </CardContent>
        <Separator/>
        <div className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground"/>
                    <p className="font-medium text-sm">{job.user_name}</p>
                    {job.media_url && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="flex items-center gap-1 cursor-pointer text-muted-foreground">
                                    <Camera className="h-4 w-4" />
                                    <span className="text-sm">1 photo</span>
                                    <div className="ml-1 relative h-6 w-6 rounded overflow-hidden">
                                        <Image src={job.media_url} alt="Job photo" fill className="object-cover"/>
                                    </div>
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
                <div className="text-right">
                    <p className="font-bold text-sm">₹{job.net_inspection_fee}</p>
                </div>
            </div>
        </div>

        {job.status === "assigned" && (
          <CardFooter className="grid grid-cols-2 gap-3 p-2">
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
