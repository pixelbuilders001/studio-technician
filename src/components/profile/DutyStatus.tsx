"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

export function DutyStatus() {
  const [isOnDuty, setIsOnDuty] = useState(true);
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
       <Switch
        id="duty-status"
        checked={isOnDuty}
        onCheckedChange={setIsOnDuty}
        aria-label="Duty Status"
      />
      <Badge variant={isOnDuty ? "default" : "destructive"} className="pointer-events-none">
        {isOnDuty ? t('duty_status.on_duty') : t('duty_status.off_duty')}
      </Badge>
    </div>
  );
}
