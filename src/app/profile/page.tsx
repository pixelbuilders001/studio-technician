import Image from 'next/image';
import Link from 'next/link';
import { technicianProfile } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Map, Tag, Briefcase, LogOut, IndianRupee } from 'lucide-react';

const ProfileInfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | React.ReactNode }) => (
    <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    </div>
);

const EarningsStat = ({ label, value }: { label: string, value: number }) => {
    const formattedValue = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);

    return (
        <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{formattedValue}</p>
        </div>
    )
};


export default function ProfilePage() {
  const { name, phone, serviceCategories, areaCovered, totalJobs, avatarUrl, lifetimeEarnings, todaysEarnings } = technicianProfile;

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center border-b bg-background px-4">
        <h1 className="text-xl font-bold font-headline">Profile</h1>
      </header>
      
      <div className="flex-1 space-y-6 p-4">
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                    <div className="relative h-24 w-24">
                        <Image
                            src={avatarUrl}
                            alt={name}
                            width={96}
                            height={96}
                            className="rounded-full object-cover"
                            data-ai-hint="person portrait"
                        />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold font-headline">{name}</h2>
                    <p className="text-muted-foreground">Technician ID: T5-8231</p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="flex justify-around pt-6 text-center">
               <EarningsStat label="Today's Earnings" value={todaysEarnings} />
               <EarningsStat label="Lifetime Earnings" value={lifetimeEarnings} />
            </CardContent>
        </Card>

        <Card>
            <CardContent className="space-y-4 pt-6">
                <ProfileInfoItem icon={Phone} label="Phone Number" value={phone} />
                <Separator />
                <ProfileInfoItem icon={Map} label="Service Area" value={areaCovered} />
                <Separator />
                <ProfileInfoItem 
                    icon={Tag} 
                    label="Service Categories" 
                    value={
                        <div className="flex flex-wrap gap-2 pt-1">
                            {serviceCategories.map(cat => <Badge key={cat} variant="secondary">{cat}</Badge>)}
                        </div>
                    } 
                />
                <Separator />
                <ProfileInfoItem icon={Briefcase} label="Total Jobs Completed" value={`${totalJobs}`} />
            </CardContent>
        </Card>

        <Link href="/" className='w-full'>
            <Button variant="destructive" className="w-full">
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
        </Link>
      </div>
    </div>
  );
}
