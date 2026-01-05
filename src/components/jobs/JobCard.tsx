
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
import { MapPin, Check, X, Wrench, Tv, Refrigerator, Smartphone, AirVent, WashingMachine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

const iconMap: { [key: string]: React.ElementType } = {
  LAPTOPS: Wrench,
  TV: Tv,
  Refrigerator,
  Smartphone,
  "Air Conditioner": AirVent,
  "Washing Machine": WashingMachine,
};

export function JobCard({ job }: { job: Job }) {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: t('job_card.job_accepted_title'),
      description: `${t('job_card.job_accepted_description')} #${job.order_id}`,
    });
    router.push(`/jobs/${job.id}`);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: t('job_card.job_rejected_title'),
      variant: "destructive",
      description: `${t('job_card.job_rejected_description')} #${job.order_id}`,
    });
  };
  
  const DeviceIcon = iconMap[job.categories.name] || Wrench;

  const statusBadge = () => {
    const statusKey = job.status?.replace(/_/g, ' ');
    let variant: "secondary" | "default" = "secondary";
    let className = "";

    switch(job.status) {
        case 'assigned':
            variant = "secondary";
            className="bg-orange-100 text-orange-800";
            break;
        case 'accepted':
        case 'in-progress':
            variant = "secondary";
            className="bg-blue-100 text-blue-800";
            break;
        case 'completed':
            variant = "secondary";
            className="bg-green-100 text-green-800";
            break;
    }

    if (statusKey) {
        return <Badge variant={variant} className={className}>{t(`job_api_status.${job.status}`)}</Badge>
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
                <DeviceIcon className="h-7 w-7 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-bold font-headline">{job.categories.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {job.issues.title}
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
              <span>{job.pincode}</span>
            </div>
            <div className="font-semibold text-foreground">
              ₹{job.net_inspection_fee}
              <span className="ml-1 font-normal text-muted-foreground">
                ({t('job_card.inspection_short')})
              </span>
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
    </Link>
  );
}
