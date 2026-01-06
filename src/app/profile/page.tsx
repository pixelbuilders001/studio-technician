
"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Map, Tag, Briefcase, LogOut } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { useProfile } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileInfoItem = ({ icon: Icon, label, value, isLoading }: { icon: React.ElementType, label: string, value?: string | React.ReactNode, isLoading: boolean }) => {
    if (isLoading) {
        return (
            <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-4">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium">{value}</p>
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


export default function ProfilePage() {
  const { t } = useTranslation();
  const { profile, loading } = useProfile();
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('technicianProfile');
  };

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center border-b bg-background px-4 justify-between">
        <h1 className="text-xl font-bold font-headline">{t('profile_page.title')}</h1>
        <LanguageSelector />
      </header>
      
      <div className="flex-1 space-y-6 p-4">
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                    {loading ? (
                        <div className='flex flex-col items-center space-y-4'>
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <Skeleton className="h-8 w-40" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    ) : profile && (
                        <>
                             <div className="relative h-24 w-24">
                                <Image
                                    src={profile.avatarUrl}
                                    alt={profile.name}
                                    width={96}
                                    height={96}
                                    className="rounded-full object-cover"
                                    data-ai-hint="person portrait"
                                />
                            </div>
                            <h2 className="mt-4 text-2xl font-bold font-headline">{profile.name}</h2>
                            <p className="text-muted-foreground">{t('profile_page.technician_id')}: {profile.id.substring(0, 8).toUpperCase()}</p>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="flex justify-around pt-6 text-center">
               <EarningsStat label={t('profile_page.todays_earnings')} value={profile?.todaysEarnings ?? 0} isLoading={loading} />
               <EarningsStat label={t('profile_page.lifetime_earnings')} value={profile?.lifetimeEarnings ?? 0} isLoading={loading} />
            </CardContent>
        </Card>

        <Card>
            <CardContent className="space-y-4 pt-6">
                <ProfileInfoItem icon={Phone} label={t('profile_page.phone_number')} value={profile?.mobile} isLoading={loading} />
                <Separator />
                <ProfileInfoItem icon={Map} label={t('profile_page.service_area')} value={profile?.areaCovered} isLoading={loading} />
                <Separator />
                <ProfileInfoItem 
                    icon={Tag} 
                    label={t('profile_page.service_categories')} 
                    value={
                        <div className="flex flex-wrap gap-2 pt-1">
                            {profile?.serviceCategories.map(cat => <Badge key={cat} variant="secondary">{cat}</Badge>)}
                        </div>
                    }
                    isLoading={loading} 
                />
                <Separator />
                <ProfileInfoItem icon={Briefcase} label={t('profile_page.total_jobs_completed')} value={`${profile?.totalJobs ?? 0}`} isLoading={loading} />
            </CardContent>
        </Card>

        <Link href="/" className='w-full' onClick={handleLogout}>
            <Button variant="destructive" className="w-full">
                <LogOut className="mr-2 h-4 w-4" /> {t('profile_page.logout')}
            </Button>
        </Link>
      </div>
    </div>
  );
}
