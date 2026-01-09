import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { FeatureSection } from '@/components/FeatureSection';
import { PricingSection } from '@/components/PricingSection';
import { FooterSection } from '@/components/FooterSection';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { Parallax } from 'react-parallax';
export function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background selection:bg-indigo-500/30">
      <ThemeToggle />
      <main className="relative z-10">
        <Parallax
          bgImage="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2070&auto=format&fit=crop"
          bgImageAlt="LMP Background"
          strength={200}
          blur={{ min: -15, max: 15 }}
          renderLayer={percentage => (
            <div
              className="absolute inset-0 bg-hero-gradient mix-blend-overlay"
              style={{
                opacity: percentage * 0.5,
              }}
            />
          )}
        >
          <div className="relative">
            <HeroSection />
          </div>
        </Parallax>
        <div className="bg-background relative">
          <FeatureSection />
          <PricingSection />
        </div>
      </main>
      <FooterSection />
      <Toaster richColors closeButton />
    </div>
  );
}