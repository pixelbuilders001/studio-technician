"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Map, Tag, Briefcase, LogOut, Star, CheckCircle, XCircle, IndianRupee, CloudCog, HelpCircle, Download, Share2, Smartphone, Instagram, Twitter } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { getTechnicianStats, getProfileAction, logoutAction, getWalletAction } from '@/app/actions';
import { FullPageLoader } from '@/components/ui/FullPageLoader';
import { formatSkillName } from '@/lib/utils';
import { usePwa } from '@/hooks/usePwa';
import { WalletCard } from '@/components/profile/WalletCard';

export default function ProfilePage() {

    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [wallet, setWallet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { isInstallable, installPwa } = usePwa();

    const handleInstallClick = async () => {
        const result = await installPwa();
        if (result.isIOS) {
            alert("To install: Tap the share button below and select 'Add to Home Screen' 📲");
        } else if (!result.success && !isInstallable) {
            alert("App is already installed or your browser doesn't support installation.");
        }
    };

    const handleShareApp = async () => {
        const shareData = {
            title: 'helloFixo Technician',
            text: 'Join helloFixo as a professional technician and grow your business!',
            url: window.location.origin
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(window.location.origin);
                alert('App link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const profileData = await getProfileAction();
                setProfile(profileData);

                const statsData = await getTechnicianStats();
                setStats(statsData);

                const walletData = await getWalletAction();
                setWallet(walletData);
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
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <User className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile Incomplete</h1>
                <p className="text-slate-500 mb-8 max-w-xs">
                    We couldn't find your profile data. Please complete your registration or contact support.
                </p>
                <Button
                    onClick={handleLogout}
                    className="w-full max-w-xs h-14 text-base font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    Complete your profile
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-slate-50 min-h-screen pb-10">
            {/* Glassmorphism Header */}
            <header className="flex h-16 items-center border-b border-white/20 bg-white/70 backdrop-blur-lg px-4 justify-between sticky top-0 z-50">
                <div className="flex items-center">
                    <Image
                        src="/logo-image.png"
                        alt="helloFixo"
                        width={120}
                        height={40}
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="tel:+918000000000"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-95"
                    >
                        <Phone className="h-4 w-4" />
                        <span className="text-sm font-bold">Help</span>
                    </a>

                </div>
            </header>

            <div className="flex-1 space-y-6">
                {/* Hero Section with Gradient - Reduced Size */}
                <div className="relative pt-6 pb-8 px-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl opacity-50"></div>

                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                            <div className="relative h-20 w-20 rounded-full border-4 border-white shadow-xl overflow-hidden ring-4 ring-primary/5">
                                <Image
                                    src={profile.selfie_url || 'https://picsum.photos/seed/tech/200/200'}
                                    alt={profile.full_name}
                                    width={80}
                                    height={80}
                                    className="object-cover h-full w-full"
                                    priority
                                />
                            </div>
                            {profile.role && (
                                <Badge className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-[10px] text-white border-white shadow-lg whitespace-nowrap">
                                    {formatSkillName(stats?.primary_skill)} Expert
                                </Badge>
                            )}
                        </div>
                        <h2 className="mt-4 text-2xl font-black font-headline text-slate-900 tracking-tight">
                            {profile.full_name}
                        </h2>
                        <div className="mt-1 flex items-center gap-2 text-slate-400 font-bold uppercase tracking-[0.1em] text-[10px]">
                            <span>ID: {profile.id.substring(0, 8).toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                <div className="px-4 space-y-6 -mt-4 relative z-20">
                    {/* Wallet UI Section - NEW */}
                    <WalletCard balance={wallet?.balance ?? 0} />

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
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Other Skills</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.primary_skill && (
                                            <Badge className="bg-violet-100 text-violet-700 border-none hover:bg-violet-200 transition-colors">
                                                {formatSkillName(profile.primary_skill)}
                                            </Badge>
                                        )}
                                        {stats.other_skills?.map((cat: string) => (
                                            <Badge key={cat} variant="secondary" className="bg-slate-100 text-slate-600 border-none capitalize">
                                                {formatSkillName(cat)}
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

                    {/* PWA Download Strip - Redesigned to match image but with project brand consistency */}
                    <div
                        onClick={handleInstallClick}
                        className="bg-white rounded-[24px] p-5 flex items-center justify-between border border-slate-100 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                                <Smartphone className="h-7 w-7 text-slate-900" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black italic tracking-tight text-slate-900 leading-tight uppercase">NATIVE APP</span>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">FASTER EXPERIENCE</span>
                            </div>
                        </div>
                        <div className="bg-primary/10 text-primary px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-primary/20 hover:bg-primary/20 transition-colors">
                            GET APP
                        </div>
                    </div>

                    {/* Quick Share Strip - Redesigned to match image */}
                    <div
                        className="bg-white rounded-[24px] p-5 flex items-center justify-between border border-dashed border-slate-200 transition-all shadow-sm"
                    >
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">QUICK SHARE</span>
                        <div className="flex items-center gap-5 pr-1">
                            {/* WhatsApp Share */}
                            <div
                                onClick={handleShareApp}
                                className="cursor-pointer text-emerald-500 hover:scale-110 transition-transform p-1"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.539 2.016 2.074-.544c.953.519 1.945.835 3.16.835 3.226 0 5.851-2.624 5.852-5.852 0-3.182-2.587-5.764-5.853-5.764h-.001zm3.435 8.169c-.147.415-.845.749-1.2.791-.326.039-.752.074-1.205-.074-.294-.097-.66-.231-1.123-.432-1.968-.857-3.236-2.842-3.334-2.975-.098-.133-.794-.949-.794-1.81s.449-1.284.609-1.442c.16-.158.348-.198.464-.198l.332.006c.093.003.222-.034.348.274.129.315.441 1.073.48 1.15.039.078.065.168.012.274-.052.106-.078.17-.154.259-.077.089-.161.2-.23.269-.078.077-.16.16-.068.318.093.158.411.678.882 1.097.607.541 1.118.71 1.285.811.166.101.263.084.361-.027.098-.111.42-.489.532-.656.113-.167.227-.14.382-.084l1.073.504c.156.074.259.111.298.177.039.066.039.382-.108.797zM12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                                </svg>
                            </div>
                            {/* Instagram Share Fallback */}
                            <div
                                onClick={handleShareApp}
                                className="cursor-pointer text-pink-600 hover:scale-110 transition-transform p-1"
                            >
                                <Instagram className="w-6 h-6" />
                            </div>
                            {/* Twitter/X Share Fallback */}
                            <div
                                onClick={handleShareApp}
                                className="cursor-pointer text-slate-900 hover:scale-110 transition-transform p-1"
                            >
                                <Twitter className="w-5 h-5 fill-current" />
                            </div>
                            {/* Generic Share */}
                            <div
                                onClick={handleShareApp}
                                className="cursor-pointer text-blue-600 hover:scale-110 transition-transform p-1"
                            >
                                <Share2 className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 space-y-3">
                        <Button
                            variant="outline"
                            className="w-full h-14 text-base font-bold text-rose-500 border-rose-100 bg-rose-50/30 hover:bg-rose-50 hover:text-rose-600 border-2 rounded-2xl transition-all active:scale-[0.98]"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-5 w-5" /> Logout
                        </Button>
                        <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest pb-8">
                            App Version 1.0.4 • © hellofixo
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
