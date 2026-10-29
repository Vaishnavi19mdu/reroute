import React from 'react';
import { ClipboardList, Search, RefreshCw, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'List Agricultural Waste',
      description:
        'Farmers or other generators publish available agricultural residues, quantities, and pickup locations.',
      icon: <ClipboardList className="w-6 h-6 text-[#17483C]" />,
      accent: 'border-t-[#17483C]',
      tag: 'Step 1: Generators',
    },
    {
      number: '02',
      title: 'Discover and Bid',
      description:
        'Buyers browse materials and submit competitive offers.',
      icon: <Search className="w-6 h-6 text-[#317787]" />,
      accent: 'border-t-[#317787]',
      tag: 'Step 2: Buyers',
    },
    {
      number: '03',
      title: 'Connect and Reuse',
      description:
        'Participants coordinate collection and turn residues into useful resources.',
      icon: <RefreshCw className="w-6 h-6 text-[#088A1A]" />,
      accent: 'border-t-[#67C273]',
      tag: 'Step 3: Circular Cycle',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white border-b border-[#E2EBE5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#317787] mb-2">
            <span>Exchange Model</span>
            <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
            <span>Three Simple Steps</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#17483C] tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', textWrap: 'balance' }}
          >
            How ReRoute Works
          </h2>
          <p className="mt-3 text-base text-[#475569] leading-relaxed">
            A simple, transparent process connecting waste generators with industrial reuse markets.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={item.number}
              className={`relative bg-[#FBFDFB] p-7 rounded-[8px] border border-[#E2EBE5] border-t-4 ${item.accent} shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xl font-black text-[#17483C]/30 font-heading tracking-tight">
                    {item.number}
                  </span>
                  <div className="p-2.5 rounded-[6px] bg-[#E6EEF2]">
                    {item.icon}
                  </div>
                </div>

                <div className="text-xs font-semibold text-[#317787] mb-1.5 uppercase tracking-wider">
                  {item.tag}
                </div>

                <h3 className="text-lg font-bold text-[#1D1160] font-heading mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-[#475569] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Connecting arrow for desktop flow */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3.5 lg:-right-4.5 top-1/2 -translate-y-1/2 z-10 p-1 bg-white rounded-full border border-[#D5DFD9] text-[#317787] shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
