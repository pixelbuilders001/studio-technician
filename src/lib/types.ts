
export type JobStatus = 'assigned' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
export type ActiveJobStatus = 'scheduled' | 'reached_location' | 'inspection_done' | 'repair_in_progress' | 'repair_completed';

// This represents the data structure from your API
export type Job = {
  id: string;
  order_id: string;
  status: JobStatus;
  created_at: string;
  full_address: string;
  pincode: string;
  total_estimated_price: number;
  net_inspection_fee: number;
  media_url: string | null;
  user_name: string;
  mobile_number: string;
  categories: {
    id: string;
    name: string;
  };
  issues: {
    id: string;
    title: string;
  };
  // The fields below are from the old static data structure and might need to be integrated
  // or removed depending on your final API structure.
  activeStatus?: ActiveJobStatus;
  customer?: {
    name: string;
    phone: string;
    address: string;
  };
  problemDetails?: string;
  finalCost?: number;
  spareParts?: string;
  notes?: string;
};


export type Technician = {
  id: string;
  name: string;
  mobile: string;
  serviceCategories: string[];
  areaCovered: string;
  totalJobs: number;
  avatarUrl: string;
  lifetimeEarnings: number;
  todaysEarnings: number;
};
