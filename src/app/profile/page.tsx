"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Map, Tag, Briefcase, LogOut, Star, CheckCircle, XCircle, IndianRupee, CloudCog } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { getTechnicianStats, getProfileAction, logoutAction } from '@/app/actions';
import { FullPageLoader } from '@/components/ui/FullPageLoader';

export default function ProfilePage() {
    const { t } = useTranslation();
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const profileData = await getProfileAction();
                setProfile(profileData);

                const statsData = await getTechnicianStats();
                setStats(statsData);
            } catch (error) {
                console.error("Failed to fetch profile/stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        // Add a small delay for better UX so the loader is visible
        await new Promise(resolve => setTimeout(resolve, 1500));
        localStorage.removeItem('authToken');
        localStorage.removeItem('technicianProfile');
        await logoutAction();
    };

    if (isLoggingOut) {
        return <FullPageLoader text="Logging out..." subtext="Thanks for your hard work today!" />;
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
                <Skeleton className="h-28 w-28 rounded-full" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="grid grid-cols-2 gap-4 w-full">
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        );
    }

    if (!profile || !stats) {
        return <div className="p-8 text-center text-destructive">No profile data found.</div>;
    }

    return (
        <div className="flex flex-col bg-slate-50 min-h-screen pb-10">
            {/* Glassmorphism Header */}
            <header className="flex h-16 items-center border-b border-white/20 bg-white/70 backdrop-blur-lg px-4 justify-between sticky top-0 z-50">
                <h1 className="text-xl font-bold font-headline bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {t('profile_page.title')}
                </h1>
                <LanguageSelector />
            </header>

            <div className="flex-1 space-y-6">
                {/* Hero Section with Gradient */}
                <div className="relative pt-8 pb-12 px-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl opacity-50"></div>

                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                            <div className="relative h-28 w-28 rounded-full border-4 border-white shadow-2xl overflow-hidden ring-4 ring-primary/10">
                                <Image
                                    src={profile.selfie_url || 'https://picsum.photos/seed/tech/200/200'}
                                    alt={profile.full_name}
                                    width={112}
                                    height={112}
                                    className="object-cover h-full w-full"
                                    priority
                                />
                            </div>
                            {profile.role && (
                                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white border-white shadow-lg">
                                    {profile.role.toUpperCase()}
                                </Badge>
                            )}
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold font-headline text-slate-900 tracking-tight">
                            {profile.full_name}
                        </h2>
                        <div className="mt-1 flex items-center gap-2 text-slate-500 font-medium">
                            <span className="bg-slate-200/50 px-2 py-0.5 rounded text-xs uppercase tracking-wider">
                                ID: {profile.id.substring(0, 8).toUpperCase()}
                            </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-slate-500 font-medium">
                            <span className="bg-slate-200/50 px-2 py-0.5 rounded text-xs uppercase tracking-wider">
                                {stats?.primary_skill ? stats?.primary_skill : "Not mentioned"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-4 space-y-6 -mt-8 relative z-20">
                    {/* Earnings Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white group overflow-hidden">
                            <CardContent className="p-5 relative">
                                <div className="absolute -right-4 -top-4 w-12 h-12 bg-green-50 rounded-full transition-transform group-hover:scale-150 duration-500"></div>
                                <div className="space-y-1 relative z-10">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Earnings</p>
                                    <div className="flex items-center text-lg font-semibold text-slate-800">
                                        <IndianRupee className="w-4 h-4" />
                                        <span>{stats.today_earnings ?? 0}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white group overflow-hidden">
                            <CardContent className="p-5 relative">
                                <div className="absolute -right-4 -top-4 w-12 h-12 bg-primary/5 rounded-full transition-transform group-hover:scale-150 duration-500"></div>
                                <div className="space-y-1 relative z-10">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lifetime Earnings</p>
                                    <div className="flex items-center text-lg font-semibold text-slate-800">
                                        <IndianRupee className="w-4 h-4" />
                                        <span>{stats.lifetime_earnings ?? 0}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Work Summary Grid */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-bold font-headline flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                Work Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col items-center justify-center space-y-1 rounded-2xl p-4 bg-blue-50/50 border border-blue-100/50 transition-colors hover:bg-blue-50">
                                    <p className="text-2xl font-bold text-blue-600">{stats.total_jobs_assigned ?? 0}</p>
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Assigned</p>
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-1 rounded-2xl p-4 bg-emerald-50/50 border border-emerald-100/50 transition-colors hover:bg-emerald-50">
                                    <p className="text-2xl font-bold text-emerald-600">{stats.total_jobs_completed ?? 0}</p>
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Completed</p>
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-1 rounded-2xl p-4 bg-rose-50/50 border border-rose-100/50 transition-colors hover:bg-rose-50">
                                    <p className="text-2xl font-bold text-rose-600">{stats.total_jobs_cancelled ?? 0}</p>
                                    <p className="text-[10px] font-bold text-rose-400 uppercase tracking-tighter">Rejected</p>
                                </div>
                            </div>

                            {stats.average_rating && stats.average_rating > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-yellow-100 p-1.5 rounded-lg">
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{stats.average_rating.toFixed(1)} Rating</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">From {stats.total_ratings} reviews</p>
                                        </div>
                                    </div>
                                    <CheckCircle className="h-5 w-5 text-primary opacity-20" />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Professional Info */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                        <CardHeader className="pb-3 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold font-headline">Professional Info</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                <div className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50/50">
                                    <div className="p-2.5 bg-indigo-50 rounded-xl">
                                        <Phone className="h-5 w-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</p>
                                        <p className="text-sm font-bold text-slate-900">{profile?.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50/50">
                                    <div className="p-2.5 bg-sky-50 rounded-xl">
                                        <Map className="h-5 w-5 text-sky-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Service Area</p>
                                        <p className="text-sm font-bold text-slate-900">{stats.service_area}</p>
                                    </div>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-violet-50 rounded-lg">
                                            <Tag className="h-4 w-4 text-violet-500" />
                                        </div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Specialties</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.primary_skill && (
                                            <Badge className="bg-violet-100 text-violet-700 border-none hover:bg-violet-200 transition-colors">
                                                {profile.primary_skill}
                                            </Badge>
                                        )}
                                        {stats.other_skills?.map((cat: string) => (
                                            <Badge key={cat} variant="secondary" className="bg-slate-100 text-slate-600 border-none capitalize">
                                                {cat.replace(/_/g, ' ')}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Statistics List - Restored */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                        <CardHeader className="pb-3 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold font-headline">Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Briefcase className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Assigned</p>
                                        <p className="text-lg font-bold text-slate-900">{stats.total_jobs_assigned}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-lg">
                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Completed</p>
                                        <p className="text-lg font-bold text-slate-900">{stats.total_jobs_completed}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-rose-50 rounded-lg">
                                        <XCircle className="h-4 w-4 text-rose-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Cancelled</p>
                                        <p className="text-lg font-bold text-slate-900">{stats.total_jobs_cancelled}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-yellow-50 rounded-lg">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Rating</p>
                                        <p className="text-lg font-bold text-slate-900">{stats.average_rating?.toFixed(1) || '0.0'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <User className="h-4 w-4 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Ratings</p>
                                        <p className="text-lg font-bold text-slate-900">{stats.total_ratings || 0}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-50 rounded-lg">
                                        <Tag className="h-4 w-4 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today Earnings</p>
                                        <div className="flex items-center text-lg font-semibold text-slate-800">
                                            <IndianRupee className="w-4 h-4" />
                                            <span>{stats.today_earnings ?? 0}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <Tag className="h-4 w-4 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lifetime Earnings</p>
                                        <div className="flex items-center text-lg font-semibold text-slate-800">
                                            <IndianRupee className="w-4 h-4" />
                                            <span>{stats.lifetime_earnings ?? 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="pt-4 space-y-3">
                        <Button
                            variant="outline"
                            className="w-full h-14 text-base font-bold text-rose-500 border-rose-100 bg-rose-50/30 hover:bg-rose-50 hover:text-rose-600 border-2 rounded-2xl transition-all active:scale-[0.98]"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-5 w-5" /> {t('profile_page.logout')}
                        </Button>
                        <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest pb-8">
                            App Version 1.0.4 • © SevaSetu
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
