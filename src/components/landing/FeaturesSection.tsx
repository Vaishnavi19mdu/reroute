import React from 'react';
import {
  Compass,
  CheckCircle2,
  Users,
  Coins,
  Route,
  Layers,
  Sprout,
  ShieldCheck,
  Scale,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Compass className="w-5 h-5 text-[#317787]" />,
      title: 'AI Reuse Advisor',
      description:
        'Analyzes crop residue characteristics to recommend optimal high-value conversion pathways, including biochar, paper packaging, and clean fuel briquettes.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#088A1A]" />,
      title: 'Residue Quality Assessment',
      description:
        'Standardizes moisture tiers, bale density, and contamination parameters so buyers know raw material suitability in advance.',
    },
    {
      icon: <Users className="w-5 h-5 text-[#1D1160]" />,
      title: 'Intelligent Buyer Matching',
      description:
        'Connects regional biomass demand clusters with farm supply radii to reduce deadhead transport miles and minimize handling delays.',
    },
    {
      icon: <Coins className="w-5 h-5 text-[#9E822E]" />,
      title: 'Reverse Bidding Marketplace',
      description:
        'Allows industrial procurement teams to place competitive gross offers so agricultural producers obtain transparent, market-driven residue pricing.',
    },
    {
      icon: <Route className="w-5 h-5 text-[#317787]" />,
      title: 'Transport Feasibility',
      description:
        'Calculates payload constraints, rural road clearance, and carrier staging to provide clear hauling feasibility prior to offer confirmation.',
    },
    {
      icon: <Layers className="w-5 h-5 text-[#17483C]" />,
      title: 'Community Waste Aggregation',
      description:
        'Combines smaller adjacent field parcels into pooled commercial pickup lots to give smallholder farmers access to bulk industrial contracts.',
    },
    {
      icon: <Sprout className="w-5 h-5 text-[#67C273]" />,
      title: 'Soil Benefit Recommender',
      description:
        'Balances biomass extraction with in-field soil health preservation, recommending what percentage of stubble should be retained or mulched.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#1D1160]" />,
      title: 'Buyer Reliability Indicators',
      description:
        'Provides verification markers, timely payment records, and prompt pickup fulfillment metrics to build trusted rural trading relationships.',
    },
    {
      icon: <Scale className="w-5 h-5 text-[#317787]" />,
      title: 'Circular Economy Impact Score',
      description:
        'Tracks confirmed diversion from open-field burning to calculate estimated localized emission reductions and resource repurposing ratios.',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-[#FBFDFB] border-b border-[#E2EBE5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#317787] mb-2">
            <span>Platform Capabilities</span>
            <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
            <span>Comprehensive Exchange Tools</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#17483C] tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', textWrap: 'balance' }}
          >
            A smarter route for every residue.
          </h2>
          <p className="mt-3 text-base text-[#475569] leading-relaxed">
            Purpose-built tools designed to resolve logistics hurdles, establish objective quality tiers, and ensure equitable economic terms for rural biomass.
          </p>
        </div>

        {/* 9 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs hover:border-[#8FBC8B] hover:shadow-sm transition-all duration-200 flex flex-col justify-start"
            >
              <div className="p-2.5 rounded-[6px] bg-[#E6EEF2] w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-[#1D1160] font-heading mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
