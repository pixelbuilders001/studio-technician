
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
import { useProfile } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const ProfileInfoItem = ({ icon: Icon, label, value, isLoading }: { icon: React.ElementType, label: string, value?: string | React.ReactNode, isLoading: boolean }) => {
    if (isLoading) {
        return (
            <div className="flex items-start gap-4">
                <Skeleton className="h-5 w-5 rounded-full mt-1" />
                <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </div>
        )
    }

    if (!value || (Array.isArray(value) && value.length === 0)) {
        return null;
    }

    return (
        <div className="flex items-start gap-4">
            <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className="font-medium">{value}</div>
            </div>
        </div>
    );
}

const EarningsStat = ({ label, value, isLoading }: { label: string, value: number, isLoading: boolean }) => {
    const formattedValue = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-28" />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{formattedValue}</p>
        </div>
    )
};

const ProfileStat = ({ icon: Icon, label, value, isLoading, className }: { icon: React.ElementType, label: string, value: number, isLoading: boolean, className?: string }) => {
    if (isLoading) {
        return <Skeleton className="h-24 w-full rounded-lg" />;
    }
    return (
         <div className={cn("flex flex-col items-center justify-center space-y-1 rounded-lg p-3 text-white", className)}>
            <Icon className="h-7 w-7" />
            <p className="text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    )
}


export default function ProfilePage() {
  const { t } = useTranslation();
  const { profile, loading } = useProfile();
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('technicianProfile');
  };

  const skills = [...(profile?.serviceCategories || []), ...(profile?.other_skills || [])];

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
                    {loading && !profile ? (
                        <div className='flex flex-col items-center space-y-3'>
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <Skeleton className="h-7 w-32" />
                            <Skeleton className="h-5 w-40" />
                        </div>
                    ) : profile && (
                        <>
                             <div className="relative h-24 w-24">
                                <Image
                                    src={profile.avatarUrl}
                                    alt={profile.name}
                                    width={96}
                                    height={96}
                                    className="rounded-full object-cover border-4 border-background shadow-md"
                                    data-ai-hint="person portrait"
                                />
                            </div>
                            <h2 className="mt-3 text-2xl font-bold font-headline">{profile.name}</h2>
                            <p className="text-muted-foreground text-sm">{t('profile_page.technician_id')}: {profile.id.substring(0, 8).toUpperCase()}</p>
                            {loading ? <Skeleton className="h-5 w-24 mt-2" /> : (profile.average_rating > 0 &&
                                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-foreground">{profile.average_rating.toFixed(1)}</span>
                                    ({profile.total_ratings} ratings)
                                </div>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="flex justify-around pt-6 text-center">
               <EarningsStat label={t('profile_page.todays_earnings')} value={profile?.today_earnings ?? 0} isLoading={loading} />
               <EarningsStat label={t('profile_page.lifetime_earnings')} value={profile?.lifetime_earnings ?? 0} isLoading={loading} />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">Job Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3">
                <ProfileStat icon={Briefcase} label="Assigned" value={profile?.total_jobs_assigned ?? 0} isLoading={loading} className="bg-blue-400" />
                <ProfileStat icon={CheckCircle} label="Completed" value={profile?.total_jobs_completed ?? 0} isLoading={loading} className="bg-green-500" />
                <ProfileStat icon={XCircle} label="Cancelled" value={profile?.total_jobs_cancelled ?? 0} isLoading={loading} className="bg-red-500" />
            </CardContent>
        </Card>

        <Card>
            <CardContent className="space-y-4 pt-6">
                <ProfileInfoItem icon={Phone} label={t('profile_page.phone_number')} value={profile?.mobile} isLoading={loading && !profile} />
                <Separator />
                <ProfileInfoItem icon={Map} label={t('profile_page.service_area')} value={profile?.service_area} isLoading={loading} />
                <Separator />
                 <ProfileInfoItem 
                    icon={Tag} 
                    label={t('profile_page.service_categories')} 
                    value={
                        <div className="flex flex-wrap gap-2 pt-1">
                            {skills.map(cat => <Badge key={cat} variant="secondary">{cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Badge>)}
                        </div>
                    }
                    isLoading={loading} 
                />
            </CardContent>
        </Card>

        <Link href="/" className='w-full' onClick={handleLogout}>
            <Button variant="destructive" className="w-full h-12 text-base">
                <LogOut className="mr-2 h-5 w-5" /> {t('profile_page.logout')}
            </Button>
        </Link>
      </div>
    </div>
  );
}
