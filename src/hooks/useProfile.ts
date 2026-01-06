
"use client";

import { useState, useEffect } from 'react';
import type { Technician } from '@/lib/types';
import { getTechnicianStatsAction } from '@/app/actions';

type BasicProfile = {
    id: string;
    name: string;
    mobile: string;
    selfie_url?: string;
    primary_skill?: string;
};

export const useProfile = () => {
    const [profile, setProfile] = useState<Technician | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const storedProfileString = localStorage.getItem('technicianProfile');
                if (storedProfileString) {
                    const basicProfile: BasicProfile = JSON.parse(storedProfileString);
                    
                    // Set initial profile from localStorage
                    const initialData: Technician = {
                        ...basicProfile,
                        avatarUrl: basicProfile.selfie_url || `https://picsum.photos/seed/${basicProfile.id}/200/200`,
                        primary_skill: basicProfile.primary_skill || '',
                        // Set defaults for stats while they are loading
                        serviceCategories: [],
                        other_skills: [],
                        service_area: 'Loading...',
                        total_jobs_completed: 0,
                        total_jobs_assigned: 0,
                        total_jobs_cancelled: 0,
                        lifetime_earnings: 0,
                        today_earnings: 0,
                        average_rating: 0,
                        total_ratings: 0,
                    };
                    setProfile(initialData);

                    // Fetch detailed stats from API
                    const stats = await getTechnicianStatsAction(basicProfile.id);
                    
                    // Merge stats with profile data
                    setProfile(prevProfile => ({
                        ...prevProfile!,
                        ...stats,
                    }));

                }
            } catch (error) {
                console.error("Failed to fetch technician profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    return { profile, loading };
};
