
"use client";

import { useState, useEffect } from 'react';

type TechnicianProfile = {
    id: string;
    name: string;
    mobile: string;
    selfie_url?: string;
};

const staticProfile = {
    serviceCategories: ['TV', 'Washing Machine', 'Refrigerator', 'AC', 'Mobile'],
    areaCovered: 'Anytown',
    totalJobs: 134,
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
        ...staticProfile, // load static data first
        ...profile, // override with dynamic data
        avatarUrl: profile.selfie_url || 'https://picsum.photos/seed/tech/200/200' // map selfie_url to avatarUrl, with fallback
    } : null;

    return { profile: combinedProfile, loading };
};
