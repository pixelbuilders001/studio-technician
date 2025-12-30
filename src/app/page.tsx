"use client";
import { LoginForm } from '@/components/auth/LoginForm';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CheckCircle, ArrowRight, ShieldCheck, Clock, Shield, Award, Banknote, ListChecks, Calendar, LockKeyhole, FileText } from 'lucide-react';

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
    <li className='flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-3 text-foreground/80 shadow-sm'>
        <CheckCircle className='h-6 w-6 text-green-500' />
        <span className='font-medium'>{children}</span>
    </li>
);

const BenefitItem = ({ icon: Icon, children }: { icon: React.ElementType, children: React.ReactNode }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <Icon className="h-5 w-5 text-primary" />
    <span>{children}</span>
  </div>
);

const WhyChooseUsItem = ({ icon: Icon, children }: { icon: React.ElementType, children: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <Icon className="h-5 w-5 text-primary" />
    <span className="font-medium">{children}</span>
  </div>
);


export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-blue-50">
        <div className="absolute inset-0">
            <Image
                src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/hero-bg-A3gN1GkGvKxtiFvWCHiE8GZcT3sJ0cDs.jpg"
                alt="Repair background"
                fill
                className="object-cover opacity-20"
            />
        </div>
        <div className="relative container mx-auto px-4 pt-8 pb-12">
            <h2 className="text-2xl font-bold text-primary font-headline">
                FixFast
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center mt-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground font-headline !leading-tight">
                    {t('login_page.hero_title')}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    {t('login_page.hero_subtitle')}
                </p>
                <ul className='mt-8 space-y-3'>
                   <FeatureListItem>{t('login_page.feature1')}</FeatureListItem>
                   <FeatureListItem>{t('login_page.feature2')}</FeatureListItem>
                   <FeatureListItem>{t('login_page.feature3')}</FeatureListItem>
                   <FeatureListItem>{t('login_page.feature4')}</FeatureListItem>
                </ul>
              </div>
              <div className="hidden md:flex justify-center">
                  <Image
                      src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/technician-YkC9HOCJqA0oB9g6v5yGzB3s4gfZkS1c.png"
                      alt="FixFast Technician"
                      width={400}
                      height={400}
                      className="object-contain"
                      priority
                  />
              </div>
            </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-background rounded-t-3xl -mt-8 relative p-6 pb-20">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-bold text-center font-headline">{t('login_page.form_title')}</h3>
            <p className="text-muted-foreground text-center text-sm mt-1">{t('login_page.form_subtitle')}</p>
            
            <div className="mt-6">
              <LoginForm />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <BenefitItem icon={LockKeyhole}>{t('login_page.benefit1')}</BenefitItem>
              <BenefitItem icon={Banknote}>{t('login_page.benefit2')}</BenefitItem>
              <BenefitItem icon={FileText}>{t('login_page.benefit3')}</BenefitItem>
            </div>

            <div className="mt-8 text-center">
              <Link href="/partner-signup" passHref>
                  <Button variant="link" className="text-lg font-bold text-primary">
                    {t('login_page.become_partner')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
              </Link>
            </div>

            <div className="mt-8 border-t pt-8">
                <h3 className='text-lg font-bold text-center font-headline'>{t('login_page.why_choose_title')}</h3>
                <div className='mt-6 grid grid-cols-2 gap-4'>
                    <WhyChooseUsItem icon={Award}>{t('login_page.why1')}</WhyChooseUsItem>
                    <WhyChooseUsItem icon={Clock}>{t('login_page.why2')}</WhyChooseUsItem>
                    <WhyChooseUsItem icon={Shield}>{t('login_page.why3')}</WhyChooseUsItem>
                    <WhyChooseUsItem icon={ShieldCheck}>{t('login_page.why4')}</WhyChooseUsItem>
                </div>
            </div>
          </div>
      </div>
    </main>
  );
}
