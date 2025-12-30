"use client";

import type { ActiveJobStatus } from "@/lib/types";
import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { updateJobStatusAction } from "@/app/actions";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

const statuses: { id: ActiveJobStatus; labelKey: string }[] = [
  { id: "scheduled", labelKey: "scheduled" },
  { id: "reached_location", labelKey: "reached_location" },
  { id: "inspection_done", labelKey: "inspection_done" },
  { id: "repair_in_progress", labelKey: "repair_in_progress" },
  { id: "repair_completed", labelKey: "repair_completed" },
];

type StatusUpdaterProps = {
  jobId: string;
  currentStatus: ActiveJobStatus;
};

export function StatusUpdater({ jobId, currentStatus }: StatusUpdaterProps) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const { toast } = useToast();
  const { t } = useTranslation();
  const currentIndex = statuses.findIndex((s) => s.id === currentStatus);

  const handleUpdateStatus = (statusId: ActiveJobStatus) => {
    startTransition(async () => {
      try {
        await updateJobStatusAction(jobId, pathname);
        toast({
          title: t('status_updater.toast_title'),
          description: `${t('status_updater.toast_description')} ${t(`job_status.${statusId}`)}`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: t('status_updater.toast_error_title'),
          description: t('status_updater.toast_error_description'),
        });
      }
    });
  };

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      <ul className="space-y-4">
        {statuses.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isClickable = index === currentIndex + 1;
          const label = t(`job_status.${status.labelKey}`);

          return (
            <li key={status.id} className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  isCurrent && "bg-primary/80 text-primary-foreground ring-4 ring-primary/20",
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </div>
              <button
                onClick={() => handleUpdateStatus(status.id)}
                disabled={!isClickable || isPending}
                className={cn(
                  "flex-1 text-left font-medium",
                  isCompleted && "text-muted-foreground line-through",
                  isCurrent && "font-bold text-primary",
                  !isClickable && "cursor-not-allowed",
                  isClickable && "hover:text-primary",
                )}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
