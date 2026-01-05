
"use client";

import { useState, useEffect } from 'react';

type TechnicianProfile = {
    id: string;
    name: string;
    mobile: string;
};

const staticProfile = {
    serviceCategories: ['TV', 'Washing Machine', 'Refrigerator', 'AC', 'Mobile'],
    areaCovered: 'Anytown',
    totalJobs: 134,
    avatarUrl: 'https://picsum.photos/seed/tech/200/200',
    lifetimeEarnings: 254200,
    todaysEarnings: 1800,
};

export const useProfile = () => {
    const [profile, setProfile] = useState<TechnicianProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedProfile = localStorage.getItem('technicianProfile');
            if (storedProfile) {
                setProfile(JSON.parse(storedProfile));
            }
        } catch (error) {
            console.error("Failed to parse technician profile from localStorage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const combinedProfile = profile ? {
        ...profile,
        ...staticProfile
    } : null;

    return { profile: combinedProfile, loading };
};
