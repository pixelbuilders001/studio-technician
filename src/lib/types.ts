

export type JobStatus = 'assigned' | 'accepted' | 'on_the_way' | 'in-progress' | 'completed' | 'cancelled' | 'rejected';

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
  map_url?: string;
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
  problemDetails?: string;
  finalCost?: number;
  spareParts?: string;
  notes?: string;
};


export type Technician = {
  id: string;
  name: string;
  mobile: string;
  avatarUrl: string;
  selfie_url?: string;
  primary_skill: string;
  serviceCategories: string[];
  other_skills: string[];
  service_area: string;
  total_jobs_completed: number;
  total_jobs_assigned: number;
  total_jobs_cancelled: number;
  lifetime_earnings: number;
  today_earnings: number;
  average_rating: number;
  total_ratings: number;
};
