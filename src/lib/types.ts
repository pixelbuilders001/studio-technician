import type { LucideIcon } from "lucide-react";

export type JobStatus = 'new' | 'active' | 'completed';

export type ActiveJobStatus = 'scheduled' | 'reached_location' | 'inspection_done' | 'repair_in_progress' | 'repair_completed';

export type Job = {
  id: string;
  deviceType: string;
  deviceIcon: React.ElementType | string;
  problemSummary: string;
  location: string;
  estimatedPrice: string;
  inspectionCharge: number;
  status: JobStatus;
  activeStatus?: ActiveJobStatus;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  problemDetails: string;
  photos: string[];
  finalCost?: number;
  spareParts?: string;
  notes?: string;
};

export type Technician = {
  name: string;
  phone: string;
  serviceCategories: string[];
  areaCovered: string;
  totalJobs: number;
  avatarUrl: string;
  lifetimeEarnings: number;
  todaysEarnings: number;
};
