import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { HeroSection } from '../../components/landing/HeroSection';
import { HowItWorksSection } from '../../components/landing/HowItWorksSection';
import { MarketplacePreviewBlock } from '../../components/landing/MarketplacePreviewBlock';
import { CircularImpactBlock } from '../../components/landing/CircularImpactBlock';

interface LandingPageProps {
  onNavigate?: (path: string) => void;
}

/**
 * ReRoute Public Landing Page
 * Contains exactly four cohesive main content blocks in order:
 * BLOCK 1: Hero and Navigation
 * BLOCK 2: How It Works
 * BLOCK 3: Larger Marketplace Preview
 * BLOCK 4: Circular Impact and Closing CTA
 */
export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFDFB] text-[#1D1160]">
      {/* Top Navigation */}
      <Navbar currentPath="/" onNavigate={onNavigate} />

      {/* Main Four-Block Showcase */}
      <main className="flex-1">
        {/* BLOCK 1: HERO */}
        <HeroSection onNavigate={onNavigate} />

        {/* BLOCK 2: HOW IT WORKS */}
        <HowItWorksSection />

        {/* BLOCK 3: LARGER MARKETPLACE PREVIEW */}
        <MarketplacePreviewBlock onNavigate={onNavigate} />

        {/* BLOCK 4: CIRCULAR IMPACT AND CLOSING CTA */}
        <CircularImpactBlock onNavigate={onNavigate} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
