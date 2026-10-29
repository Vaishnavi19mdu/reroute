import React from 'react';
import { Tractor, Factory, Truck, ArrowRight, Check } from 'lucide-react';

export const StakeholdersSection: React.FC = () => {
  const workflowSteps = [
    'Farmers List Residues',
    'ReRoute Matches Opportunities',
    'Buyers Make Offers',
    'Logistics Supports Delivery',
    'Residues Gain New Value',
  ];

  return (
    <section id="stakeholders" className="py-16 sm:py-24 bg-[#F4F7F5] border-b border-[#E2EBE5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#317787] mb-2">
            <span>Collaborative Ecosystem</span>
            <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
            <span>Multi-Stakeholder Architecture</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#17483C] tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', textWrap: 'balance' }}
          >
            One platform. Three stakeholders. A smarter agricultural waste cycle.
          </h2>
          <p className="mt-3 text-base text-[#475569] leading-relaxed">
            By aligning incentives across agriculture, manufacturing, and transport logistics, ReRoute creates an uninterrupted path from field surplus to industrial input.
          </p>
        </div>

        {/* 3 Stakeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1: Farmers */}
          <div
            id="farmers"
            className="bg-white p-7 rounded-[8px] border border-[#E2EBE5] shadow-xs flex flex-col justify-between hover:border-[#8FBC8B] transition-colors scroll-mt-24"
          >
            <div>
              <div className="w-12 h-12 rounded-[6px] bg-[#E6EEF2] flex items-center justify-center text-[#17483C] mb-5">
                <Tractor className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#17483C] font-heading mb-2">
                Farmers
              </h3>
              <p className="text-sm text-[#334155] leading-relaxed mb-6 font-medium">
                List residues, discover reuse opportunities, compare offers and choose suitable exchanges.
              </p>
              <ul className="space-y-2.5 text-xs text-[#475569]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#088A1A] shrink-0 mt-0.5" />
                  <span>Monetize post-harvest biomass before replanting deadlines</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#088A1A] shrink-0 mt-0.5" />
                  <span>Receive competitive offers directly without informal middlemen</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#088A1A] shrink-0 mt-0.5" />
                  <span>Maintain farm soil health with stubble retention guidance</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-[#E2EBE5] text-xs font-semibold text-[#17483C]">
              Role: Primary Biomass Producer
            </div>
          </div>

          {/* Card 2: Buyers */}
          <div
            id="buyers"
            className="bg-white p-7 rounded-[8px] border border-[#E2EBE5] shadow-xs flex flex-col justify-between hover:border-[#317787] transition-colors scroll-mt-24"
          >
            <div>
              <div className="w-12 h-12 rounded-[6px] bg-[#E6EEF2] flex items-center justify-center text-[#317787] mb-5">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1D1160] font-heading mb-2">
                Buyers
              </h3>
              <p className="text-sm text-[#334155] leading-relaxed mb-6 font-medium">
                Discover agricultural residues, find suitable potential inputs and submit offers.
              </p>
              <ul className="space-y-2.5 text-xs text-[#475569]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#317787] shrink-0 mt-0.5" />
                  <span>Procure standardized raw materials with known moisture & quality specs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#317787] shrink-0 mt-0.5" />
                  <span>Submit gross bids based on batch volume and proximity radiuses</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#317787] shrink-0 mt-0.5" />
                  <span>Diversify renewable feedstock supply chains reliably</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-[#E2EBE5] text-xs font-semibold text-[#317787]">
              Role: Industrial Bio-Converter
            </div>
          </div>

          {/* Card 3: Logistics Partners */}
          <div
            id="logistics"
            className="bg-white p-7 rounded-[8px] border border-[#E2EBE5] shadow-xs flex flex-col justify-between hover:border-[#1D1160] transition-colors scroll-mt-24"
          >
            <div>
              <div className="w-12 h-12 rounded-[6px] bg-[#E6EEF2] flex items-center justify-center text-[#1D1160] mb-5">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1D1160] font-heading mb-2">
                Logistics Partners
              </h3>
              <p className="text-sm text-[#334155] leading-relaxed mb-6 font-medium">
                Discover collection opportunities, estimate transport feasibility and coordinate deliveries.
              </p>
              <ul className="space-y-2.5 text-xs text-[#475569]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1D1160] shrink-0 mt-0.5" />
                  <span>Access pre-aggregated collection jobs with mapped rural access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1D1160] shrink-0 mt-0.5" />
                  <span>Optimize vehicle payload capacities for bulky biomass hauling</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1D1160] shrink-0 mt-0.5" />
                  <span>Minimize empty backhauls by connecting return farm freight</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-[#E2EBE5] text-xs font-semibold text-[#1D1160]">
              Role: Hauling & Route Coordinator
            </div>
          </div>

        </div>

        {/* Compact Visual Sequence Strip */}
        <div className="bg-white p-6 sm:p-7 rounded-[8px] border border-[#E2EBE5] shadow-xs">
          <p className="text-xs font-semibold text-center uppercase tracking-wider text-[#317787] mb-6 font-heading">
            End-to-End Exchange Cycle
          </p>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-center">
            {workflowSteps.map((stepLabel, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-1 w-full p-3 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5] flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold text-[#17483C] font-heading">
                    {stepLabel}
                  </span>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <div className="text-[#8FBC8B] rotate-90 lg:rotate-0 my-1 lg:my-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default StakeholdersSection;
