import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Sprout,
  Tractor,
  Factory,
  FlameKindling,
} from 'lucide-react';
import { Button } from '../common/Button';

interface HeroSectionProps {
  onNavigate?: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const handleScrollToMarketplace = () => {
    const el = document.getElementById('marketplace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigate) {
      onNavigate('/marketplace');
    }
  };

  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate('/signup');
    } else {
      window.history.pushState({}, '', '/signup');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#F4F0E6] border-b border-[#C1AEA0]/40 min-h-[580px] lg:min-h-[660px] flex items-center">
      {/* Background Layer: High-resolution post-harvest agricultural field with rice straw biomass in foreground */}
      <div
        className="absolute inset-0 bg-cover bg-center sm:bg-[center_right] scale-[1.01] opacity-95 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `url('/src/assets/images/reroute_hero_golden_harvest_field_1793123027774.jpg')`,
        }}
        aria-hidden="true"
      />

      {/* Layer 2: Directional warm cream gradient overlay smoothly dissolving into agricultural landscape */}
      {/* Strong opacity on the left ensures impeccable text contrast and readability */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#F4F0E6] via-[#F4F0E6]/95 via-45% to-[#F4F0E6]/25 sm:to-transparent"
        aria-hidden="true"
      />

      {/* Mobile vertical gradient wash for high-contrast mobile text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#F4F0E6] via-[#F4F0E6]/90 to-[#F4F0E6]/40 sm:hidden"
        aria-hidden="true"
      />

      {/* Layer 3: Subtle warm taupe and umber atmospheric vignette */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(163,139,120,0.15),_transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Layer 4: Foreground Content (100% sharp text, luminous icons, and actions) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
        <div className="max-w-2xl lg:max-w-3xl space-y-7">
          
          {/* Unboxed Metadata with Warm Taupe, Umber, and Luminous Shimmer Icons (Zero-Pill) */}
          <div className="flex items-center gap-3 text-xs font-semibold tracking-wider uppercase text-[#6F452C] flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-bold">
              <Sprout className="w-4 h-4 text-[#088A1A] hero-icon-shimmer-green shrink-0" />
              <span className="text-[#4A3025]">Circular Agriculture</span>
            </span>
            <span aria-hidden="true" className="text-[#A38B78]">·</span>
            <span className="inline-flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#9E822E] hero-icon-shimmer-gold shrink-0" />
              <span className="text-[#6F452C]">Waste to Worth</span>
            </span>
            <span aria-hidden="true" className="text-[#A38B78]">·</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#6F452C] border border-[#C1AEA0]/60 bg-[#F4F0E6]/85 px-2 py-0.5 rounded-[5px]">
              Biomass Recovery Exchange
            </span>
          </div>

          {/* Exact Required Hero Headline */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17483C] tracking-tight leading-[1.12]"
            style={{ fontFamily: 'var(--font-heading)', textWrap: 'balance' }}
          >
            Give every harvest a second life.
          </h1>

          {/* Supporting Copy with high-contrast umber tone */}
          <p className="text-base sm:text-lg text-[#4A3025] leading-relaxed font-normal max-w-2xl">
            ReRoute connects agricultural waste generators with businesses that can turn leftover crop materials into valuable resources.
          </p>

          {/* Action CTAs: Preserving exact actions and non-pill button discipline */}
          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Button
              variant="primary"
              size="lg"
              onClick={handleScrollToMarketplace}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="rounded-[6px] shadow-sm cursor-pointer"
            >
              Explore Marketplace
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleGetStarted}
              className="rounded-[6px] border border-[#A38B78]/50 bg-white/85 hover:bg-white text-[#17483C] font-bold shadow-xs cursor-pointer"
            >
              Get Started
            </Button>
          </div>

          {/* Three Feature Highlights with Taupe/Umber Accents and Luminous Shimmer Icons */}
          <div className="pt-6 border-t border-[#C1AEA0]/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {/* Highlight 1: For Farmers */}
            <div className="flex items-start gap-3 p-3 rounded-[6px] bg-white/80 backdrop-blur-xs border border-[#C1AEA0]/60 shadow-xs hover:border-[#A38B78] transition-colors">
              <div className="p-2 rounded-[6px] bg-[#F4F0E6] text-[#17483C] border border-[#C1AEA0]/40 shrink-0">
                <Tractor className="w-4 h-4 text-[#17483C] hero-icon-shimmer-green" />
              </div>
              <div>
                <p className="text-[11px] text-[#6F452C] font-semibold uppercase tracking-wider">For Farmers</p>
                <p className="text-sm font-bold text-[#17483C] font-heading mt-0.5">
                  Monetize Residue
                </p>
              </div>
            </div>

            {/* Highlight 2: For Buyers */}
            <div className="flex items-start gap-3 p-3 rounded-[6px] bg-white/80 backdrop-blur-xs border border-[#C1AEA0]/60 shadow-xs hover:border-[#A38B78] transition-colors">
              <div className="p-2 rounded-[6px] bg-[#F4F0E6] text-[#317787] border border-[#C1AEA0]/40 shrink-0">
                <Factory className="w-4 h-4 text-[#317787] hero-icon-shimmer-teal" />
              </div>
              <div>
                <p className="text-[11px] text-[#6F452C] font-semibold uppercase tracking-wider">For Buyers</p>
                <p className="text-sm font-bold text-[#17483C] font-heading mt-0.5">
                  Direct Raw Biomass
                </p>
              </div>
            </div>

            {/* Highlight 3: For Planet */}
            <div className="flex items-start gap-3 p-3 rounded-[6px] bg-white/80 backdrop-blur-xs border border-[#C1AEA0]/60 shadow-xs hover:border-[#A38B78] transition-colors">
              <div className="p-2 rounded-[6px] bg-[#F4F0E6] text-[#088A1A] border border-[#C1AEA0]/40 shrink-0">
                <FlameKindling className="w-4 h-4 text-[#9E822E] hero-icon-shimmer-gold" />
              </div>
              <div>
                <p className="text-[11px] text-[#6F452C] font-semibold uppercase tracking-wider">For Planet</p>
                <p className="text-sm font-bold text-[#17483C] font-heading mt-0.5">
                  Zero Field Burning
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
