import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { FeatureSection } from '@/components/FeatureSection';
import { PricingSection } from '@/components/PricingSection';
import { FooterSection } from '@/components/FooterSection';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <ThemeToggle />
      <main className="relative z-10">
        <HeroSection />
        <FeatureSection />
        <PricingSection />
      </main>
      <FooterSection />
      <Toaster richColors closeButton />
    </div>
  );
}