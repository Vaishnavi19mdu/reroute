import React from 'react';
import { Leaf, ArrowRight, ShieldCheck, BarChart3, Recycle, FileCheck } from 'lucide-react';

export const ImpactSection: React.FC = () => {
  const journeyStages = [
    {
      title: '1. Listed Residue',
      description: 'Documented field location, dry weight tonnage, and verified crop type.',
      icon: <FileCheck className="w-5 h-5 text-[#17483C]" />,
    },
    {
      title: '2. Matched Supply',
      description: 'Consolidated rural collection routes and carrier dispatch without empty deadheading.',
      icon: <Recycle className="w-5 h-5 text-[#317787]" />,
    },
    {
      title: '3. Completed Reuse',
      description: 'Confirmed weighbridge delivery at licensed bio-conversion facilities.',
      icon: <Leaf className="w-5 h-5 text-[#088A1A]" />,
    },
  ];

  return (
    <section id="impact" className="py-16 sm:py-24 bg-[#FBFDFB] border-b border-[#E2EBE5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#317787] mb-2">
            <span>Environmental Accountability</span>
            <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
            <span>Circular Lifecycle</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#17483C] tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', textWrap: 'balance' }}
          >
            Make every exchange count.
          </h2>
          <p className="mt-3 text-base text-[#475569] leading-relaxed">
            ReRoute is designed to track confirmed collection and reuse quantities and estimate environmental benefits using documented factors, ensuring full traceability from farm gate to factory floor.
          </p>
        </div>

        {/* Visual Journey: Listed Residue -> Matched Supply -> Completed Reuse */}
        <div className="mb-14 bg-white p-8 rounded-[8px] border border-[#E2EBE5] shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#17483C] mb-6 font-heading text-center">
            The Verified Chain of Custody
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-stretch">
            {journeyStages.map((stage, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-white rounded-[6px] border border-[#D5DFD9]">
                      {stage.icon}
                    </div>
                    <span className="text-xs font-bold text-[#317787]">Stage {idx + 1}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#17483C] font-heading mb-1.5">
                    {stage.title}
                  </h4>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Methodology Note & Demonstration Parameters (Strictly Labelled Illustrative) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
              Methodology Focus
            </p>
            <h4 className="text-base font-bold text-[#1D1160] font-heading mb-2">
              Displaced Open Burning
            </h4>
            <p className="text-xs text-[#475569] leading-relaxed">
              Every metric tonne diverted from open-field burning mitigates particulate matter (PM2.5/PM10), greenhouse gas emissions, and severe seasonal smog.
            </p>
            <span className="inline-block mt-4 text-[11px] text-neutral-400 font-medium">
              * Modeled against IPCC agricultural residue factors
            </span>
          </div>

          <div className="p-6 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
              Methodology Focus
            </p>
            <h4 className="text-base font-bold text-[#1D1160] font-heading mb-2">
              Fossil Fuel Substitution
            </h4>
            <p className="text-xs text-[#475569] leading-relaxed">
              Residues supplied to industrial boilers replace coal and petroleum coke with renewable, carbon-neutral agricultural biomass.
            </p>
            <span className="inline-block mt-4 text-[11px] text-neutral-400 font-medium">
              * Dependent on destination conversion thermal efficiency
            </span>
          </div>

          <div className="p-6 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
              Methodology Focus
            </p>
            <h4 className="text-base font-bold text-[#1D1160] font-heading mb-2">
              Traceable Green Accounting
            </h4>
            <p className="text-xs text-[#475569] leading-relaxed">
              Industrial buyers receive verifiable delivery records indicating geographic origin and confirmed gross tonnage for ESG compliance reporting.
            </p>
            <span className="inline-block mt-4 text-[11px] text-neutral-400 font-medium">
              * Illustrative demonstration framework, not certified audit
            </span>
          </div>
        </div>

        {/* Clear Demonstration Note (Strict compliance with prompt) */}
        <div className="mt-8 text-center text-xs text-[#64748B] italic">
          Note: Impact estimations are based on standardized academic emission factors. Demonstration models do not represent real completed transaction volumes.
        </div>

      </div>
    </section>
  );
};

export default ImpactSection;
