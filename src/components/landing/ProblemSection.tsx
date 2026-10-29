import React from 'react';
import { AlertCircle, MapPinOff, TrendingDown, Truck } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: <MapPinOff className="w-5 h-5 text-[#317787]" />,
      title: 'Stranded Supply for Farmers',
      description:
        'Farmers frequently struggle to find reliable buyers for agricultural residues before the next planting cycle begins, leading to seasonal burning under strict time constraints.',
    },
    {
      icon: <TrendingDown className="w-5 h-5 text-[#317787]" />,
      title: 'Opaque Sourcing for Buyers',
      description:
        'Biomass processors, paper mills, and bio-energy plants need suitable raw materials at consistent quality, but lack visibility into where supply exists across dispersed rural acreage.',
    },
    {
      icon: <Truck className="w-5 h-5 text-[#317787]" />,
      title: 'Scattered Logistics & High Hauling Costs',
      description:
        'Uncoordinated transport, fragmented volume lots, and scattered offers make manual exchanges financially uneconomical and difficult to schedule.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#F4F7F5] border-b border-[#E2EBE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#317787] mb-2">
            <span>The Agricultural Disconnect</span>
            <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
            <span>Market Inefficiencies</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#17483C] tracking-tight leading-tight"
            style={{ fontFamily: 'var(--font-heading)', textWrap: 'balance' }}
          >
            Good residues are stranded between farms and buyers.
          </h2>
          <p className="mt-3 text-base text-[#334155] leading-relaxed">
            Every harvest season, millions of tons of energy-rich crop stalks and straw are treated as liabilities rather than high-value circular commodities.
          </p>
        </div>

        {/* Content Grid: 3 Problem Cards + Residue Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Problem Cards Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {problems.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs hover:border-[#8FBC8B] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-[6px] bg-[#E6EEF2] shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1D1160] font-heading">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-[#475569] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Photo & Contrast Panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full rounded-[8px] overflow-hidden border border-[#D5DFD9] bg-white shadow-xs flex flex-col">
              <div className="relative h-60 sm:h-68 lg:h-72 overflow-hidden bg-[#E6EEF2]">
                <img
                  src="/src/assets/images/crop_residue_straw_1792923063314.jpg"
                  alt="Bundles of harvested dry rice straw resting on agricultural soil"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#17483C]/85 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-[4px]">
                  Uncollected Rice Straw
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-center bg-[#FBFDFB]">
                <p className="text-xs font-semibold text-[#8FBC8B] uppercase tracking-wider mb-1">
                  The Circular Opportunity
                </p>
                <p className="text-sm font-semibold text-[#17483C] leading-snug">
                  Transforming open-field residue liabilities into steady farm income and fossil-free bio-inputs.
                </p>
                <p className="text-xs text-[#64748B] mt-2">
                  ReRoute provides the digital matchmaking and transport routing layer to bridge this gap.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProblemSection;
