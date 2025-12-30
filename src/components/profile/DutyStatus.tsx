"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export function DutyStatus() {
  const [isOnDuty, setIsOnDuty] = useState(true);

  return (
    <div className="flex items-center gap-2">
       <Switch
        id="duty-status"
        checked={isOnDuty}
        onCheckedChange={setIsOnDuty}
        aria-label="Duty Status"
      />
      <Badge variant={isOnDuty ? "default" : "destructive"} className="pointer-events-none">
        {isOnDuty ? "On Duty" : "Off Duty"}
      </Badge>
    </div>
  );
}
