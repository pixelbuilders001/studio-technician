
"use client";

import type { JobStatus } from "@/lib/types";
import { Check, Circle, Loader2, Navigation, Wrench, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { updateJobStatusAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "../ui/button";

type StatusUpdaterProps = {
  jobId: string;
  orderId: string;
  currentStatus: JobStatus;
};

type StatusConfig = {
    [key in JobStatus]?: {
        nextStatus: JobStatus;
        buttonTextKey: string;
        buttonIcon: React.ElementType;
    }
}

const statusFlow: StatusConfig = {
    'assigned': {
        nextStatus: 'accepted',
        buttonTextKey: 'accept_job',
        buttonIcon: Check,
    },
    'accepted': {
        nextStatus: 'on_the_way',
        buttonTextKey: 'start_travel',
        buttonIcon: Navigation,
    },
    'on_the_way': {
        nextStatus: 'in-progress',
        buttonTextKey: 'start_repair',
        buttonIcon: Wrench,
    },
    'in-progress': {
        nextStatus: 'completed',
        buttonTextKey: 'complete_job',
        buttonIcon: CheckCircle,
    }
}

export function StatusUpdater({ jobId, orderId, currentStatus }: StatusUpdaterProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { profile } = useProfile();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleUpdateStatus = (newStatus: JobStatus) => {
    if (!profile) {
      toast({ title: "Error", description: "Technician profile not found.", variant: "destructive" });
      return;
    }
    startTransition(async () => {
      try {
        await updateJobStatusAction({
            booking_id: jobId,
            status: newStatus,
            note: `Technician ${profile.name} updated status to ${newStatus}`,
            order_id: orderId,
        });
        toast({
          title: t('status_updater.toast_title'),
          description: `${t('status_updater.toast_description')} ${t(`job_api_status.${newStatus}`)}`,
        });
        router.refresh();
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: t('status_updater.toast_error_title'),
          description: error.message || t('status_updater.toast_error_description'),
        });
      }
    });
  };

  const nextAction = statusFlow[currentStatus];
  const ButtonIcon = nextAction?.buttonIcon;

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">{t('job_page.current_status')}:</span>
            <span className="font-bold text-primary">{t(`job_api_status.${currentStatus}`)}</span>
        </div>
      
      {nextAction && ButtonIcon && (
          <Button 
            onClick={() => handleUpdateStatus(nextAction.nextStatus)}
            disabled={isPending}
            className="w-full h-12 text-lg"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ButtonIcon className="mr-2 h-5 w-5" />}
            {t(`status_updater.${nextAction.buttonTextKey}`)}
          </Button>
      )}

      {currentStatus === 'in-progress' && (
        <p className="text-xs text-center text-muted-foreground pt-2">
            {t('status_updater.complete_job_note')}
        </p>
      )}
    </div>
  );
}
