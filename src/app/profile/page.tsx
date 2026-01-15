"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Map, Tag, Briefcase, LogOut, Star, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { getTechnicianStats, getProfileAction, logoutAction } from '@/app/actions';

export default function ProfilePage() {
    const { t } = useTranslation();
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
        localStorage.removeItem('authToken');
        localStorage.removeItem('technicianProfile');
        await logoutAction();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-7 w-32 mb-2" />
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-5 w-40 mb-2" />
            </div>
        );
    }

    if (!profile || !stats) {
        return <div className="p-8 text-center text-destructive">No profile data found.</div>;
    }

    return (
        <div className="flex flex-col bg-secondary/30 min-h-screen">
            <header className="flex h-14 items-center border-b bg-background px-4 justify-between sticky top-0 z-10">
                <h1 className="text-xl font-bold font-headline">{t('profile_page.title')}</h1>
                <LanguageSelector />
            </header>

            <div className="flex-1 space-y-4 p-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative h-24 w-24">
                                <Image
                                    src={profile.selfie_url || 'https://picsum.photos/seed/tech/200/200'}
                                    alt={profile.full_name}
                                    width={96}
                                    height={96}
                                    className="rounded-full object-cover border-4 border-background shadow-md"
                                    data-ai-hint="person portrait"
                                />
                            </div>
                            <h2 className="mt-3 text-2xl font-bold font-headline">{profile.full_name}</h2>
                            <p className="text-muted-foreground text-sm">{t('profile_page.technician_id')}: {profile.id.substring(0, 8).toUpperCase()}</p>
                            {stats.average_rating && stats.average_rating > 0 &&
                                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-foreground">{stats.average_rating.toFixed(1)}</span>
                                    ({stats.total_ratings} ratings)
                                </div>
                            }
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex justify-around pt-6 text-center">
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-muted-foreground">{t('profile_page.todays_earnings')}</p>
                            <p className="text-2xl font-bold">{new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(stats.today_earnings ?? 0)}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-muted-foreground">{t('profile_page.lifetime_earnings')}</p>
                            <p className="text-2xl font-bold">{new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(stats.lifetime_earnings ?? 0)}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Job Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center justify-center space-y-1 rounded-lg p-3 text-white bg-blue-400">
                            <Briefcase className="h-7 w-7" />
                            <p className="text-sm font-medium">Assigned</p>
                            <p className="text-2xl font-bold">{stats.total_jobs_assigned ?? 0}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-1 rounded-lg p-3 text-white bg-green-500">
                            <CheckCircle className="h-7 w-7" />
                            <p className="text-sm font-medium">Completed</p>
                            <p className="text-2xl font-bold">{stats.total_jobs_completed ?? 0}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-1 rounded-lg p-3 text-white bg-red-500">
                            <XCircle className="h-7 w-7" />
                            <p className="text-sm font-medium">Cancelled</p>
                            <p className="text-2xl font-bold">{stats.total_jobs_cancelled ?? 0}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Profile Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex items-start gap-4">
                            <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t('profile_page.phone_number')}</p>
                                <div className="font-medium">{profile?.phone}</div>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-4">
                            <Map className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t('profile_page.service_area')}</p>
                                <div className="font-medium">{stats.service_area}</div>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-4">
                            <Tag className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t('profile_page.service_categories')}</p>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {stats.other_skills && stats.other_skills.length > 0 ? stats.other_skills.map((cat: string) => <Badge key={cat} variant="secondary">{cat.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</Badge>) : <span className="text-muted-foreground">No skills listed</span>}
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-4">
                            <Tag className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                            <div>
                                <p className="text-sm text-muted-foreground">Primary Skill</p>
                                <div className="font-medium">{profile.primary_skill || '-'}</div>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-4">
                                <Briefcase className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Assigned</p>
                                    <div className="font-medium">{stats.total_jobs_assigned?.toString()}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Completed</p>
                                    <div className="font-medium">{stats.total_jobs_completed?.toString()}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Cancelled</p>
                                    <div className="font-medium">{stats.total_jobs_cancelled?.toString()}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Star className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Average Rating</p>
                                    <div className="font-medium">{stats.average_rating?.toFixed(1)}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Ratings</p>
                                    <div className="font-medium">{stats.total_ratings?.toString()}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Tag className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Today Earnings</p>
                                    <div className="font-medium">{stats.today_earnings?.toString()}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Tag className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Lifetime Earnings</p>
                                    <div className="font-medium">{stats.lifetime_earnings?.toString()}</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Button variant="destructive" className="w-full h-12 text-base" onClick={handleLogout}>
                    <LogOut className="mr-2 h-5 w-5" /> {t('profile_page.logout')}
                </Button>
            </div>
        </div>
    );
}
