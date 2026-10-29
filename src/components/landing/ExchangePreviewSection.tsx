import React, { useState } from 'react';
import { Check, Info, ArrowRight, ShieldCheck, Truck, Scale, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface OfferItem {
  id: string;
  buyerName: string;
  buyerType: string;
  unitRate: number; // in ₹/kg
  grossTotal: number; // in ₹
  transportCostText: string;
  intendedReuse: string;
  pickupWindow: string;
  reliabilityScore: string;
  note: string;
}

export const ExchangePreviewSection: React.FC = () => {
  const [selectedOfferId, setSelectedOfferId] = useState<string>('buyer-b');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Exact sample data from user prompt:
  // Material: Rice straw
  // Available quantity: 1,000 kg
  // Buyer A: ₹2.00/kg -> ₹2,000 gross
  // Buyer B: ₹2.50/kg -> ₹2,500 gross
  // Transport: "Estimate pending"
  const materialData = {
    material: 'Rice straw',
    quantityKg: 1000,
    moistureSpec: '< 14% (Dry Baled)',
    locationCluster: 'Northern Agricultural Belt',
  };

  const offers: OfferItem[] = [
    {
      id: 'buyer-a',
      buyerName: 'Buyer A (BioPower Energy)',
      buyerType: 'Industrial Biomass Energy Facility',
      unitRate: 2.0,
      grossTotal: 2000,
      transportCostText: 'Estimate pending',
      intendedReuse: 'Thermal Bio-Coal & Briquettes',
      pickupWindow: '48 to 72 hrs',
      reliabilityScore: 'Verified Buyer',
      note: 'Accepts standard moisture bales; regional collection depot located within 35 km.',
    },
    {
      id: 'buyer-b',
      buyerName: 'Buyer B (EcoFiber Packaging)',
      buyerType: 'Molded Fiber & Paperboard Manufacturer',
      unitRate: 2.5,
      grossTotal: 2500,
      transportCostText: 'Estimate pending',
      intendedReuse: 'Molded Agro-Pulp Packaging',
      pickupWindow: '24 to 48 hrs',
      reliabilityScore: 'Verified Buyer',
      note: 'Premium tier offer for clean straw with low silica content; self-loading transport support.',
    },
  ];

  const selectedOffer = offers.find((o) => o.id === selectedOfferId) || offers[1];

  return (
    <section id="exchange-preview" className="py-16 sm:py-24 bg-white border-b border-[#E2EBE5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#317787] mb-2">
            <span>Marketplace Interaction</span>
            <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
            <span>Reverse Bidding Model</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#17483C] tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', textWrap: 'balance' }}
          >
            Illustrative Exchange Preview
          </h2>
          <p className="mt-3 text-base text-[#475569] leading-relaxed">
            See how agricultural producers compare competing buyer offers for harvested crop residues with clear gross totals and separate transport evaluations.
          </p>
        </div>

        {/* Demo Notice Banner */}
        <div className="mb-8 p-3.5 bg-[#F4F0DF]/60 border border-[#EDD17E] rounded-[6px] flex items-center justify-between flex-wrap gap-2 text-xs text-[#17483C]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#9E822E] shrink-0" />
            <span className="font-semibold">Illustrative demonstration data, not live marketplace offers.</span>
          </div>
          <button
            onClick={() => setCompareModalOpen(true)}
            className="text-xs font-bold text-[#1D1160] hover:text-[#33006F] underline underline-offset-2 cursor-pointer"
          >
            View Detailed Side-by-Side Comparison
          </button>
        </div>

        {/* Main Preview Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Listed Lot Details (5 cols) */}
          <div className="lg:col-span-5 bg-[#FBFDFB] p-6 rounded-[8px] border border-[#E2EBE5] shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#317787] uppercase tracking-wider">
                  Active Listing Example
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  LOT #RR-ST-1000
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#17483C] font-heading">
                {materialData.material}
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                Post-harvest field residue staged for scheduled dispatch
              </p>
            </div>

            {/* Spec Sheet */}
            <div className="space-y-3 pt-4 border-t border-[#E2EBE5] text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Available Quantity:</span>
                <span className="font-bold text-[#1D1160] tabular-nums font-heading">
                  1,000 kg (1.0 Metric Tonne)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Material Grade:</span>
                <span className="font-medium text-[#17483C]">
                  {materialData.moistureSpec}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Regional Cluster:</span>
                <span className="font-medium text-[#17483C]">
                  {materialData.locationCluster}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Competing Offers:</span>
                <span className="font-semibold text-[#088A1A]">
                  2 Verified Bids Received
                </span>
              </div>
            </div>

            {/* Explanatory Note on Transport Calculation */}
            <div className="p-3.5 bg-[#E6EEF2]/50 rounded-[6px] border border-[#D5DFD9] text-xs text-[#17483C] leading-relaxed">
              <p className="font-semibold mb-1 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#317787]" />
                Transport Cost Calculation
              </p>
              <p>
                Estimated transport costs are determined separately once pickup staging and carrier routing are coordinated. Because hauling distance depends on buyer depot selection, transport is kept distinct from gross crop residue values.
              </p>
            </div>
          </div>

          {/* Right Column: Competing Buyer Offers (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#17483C] font-heading">
                Select an offer to review terms:
              </span>
              <span className="text-xs text-neutral-500">
                Click cards to toggle selection
              </span>
            </div>

            {offers.map((offer) => {
              const isSelected = selectedOfferId === offer.id;
              return (
                <div
                  key={offer.id}
                  onClick={() => setSelectedOfferId(offer.id)}
                  className={`p-6 rounded-[8px] border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[#1D1160] bg-white ring-2 ring-[#1D1160]/10 shadow-sm'
                      : 'border-[#E2EBE5] bg-white hover:border-[#8FBC8B] shadow-xs'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedOfferId(offer.id);
                    }
                  }}
                  aria-pressed={isSelected}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2EBE5]">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-[#1D1160] font-heading">
                          {offer.buyerName}
                        </h4>
                        <span className="text-[11px] text-[#088A1A] font-semibold bg-[#8FBC8B]/15 px-2 py-0.5 rounded-[4px]">
                          {offer.reliabilityScore}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {offer.buyerType}
                      </p>
                    </div>

                    {/* Price and Gross Value */}
                    <div className="text-left sm:text-right">
                      <div className="flex sm:flex-col items-baseline sm:items-end gap-2 sm:gap-0">
                        <span className="text-2xl font-black text-[#17483C] font-heading tabular-nums">
                          ₹{offer.grossTotal.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-semibold text-[#317787] tabular-nums">
                          ₹{offer.unitRate.toFixed(2)} / kg gross
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400">
                        Gross offer (1,000 kg)
                      </span>
                    </div>
                  </div>

                  {/* Offer Details Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
                    <div>
                      <p className="text-neutral-500">Planned Reuse</p>
                      <p className="font-semibold text-[#17483C] mt-0.5">
                        {offer.intendedReuse}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Pickup Window</p>
                      <p className="font-semibold text-[#17483C] mt-0.5">
                        {offer.pickupWindow}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Transport Cost</p>
                      <p className="font-semibold text-[#9E822E] mt-0.5 italic">
                        {offer.transportCostText}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#475569] mt-3 pt-3 border-t border-dashed border-[#E2EBE5]">
                    {offer.note}
                  </p>
                </div>
              );
            })}

            {/* Selection Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#F4F7F5] rounded-[8px] border border-[#E2EBE5]">
              <div className="text-xs text-[#17483C]">
                Currently Selected: <strong className="font-bold">{selectedOffer.buyerName}</strong> for <strong className="font-heading font-black tabular-nums">₹{selectedOffer.grossTotal.toLocaleString('en-IN')}</strong> gross.
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => setDemoModalOpen(true)}
                >
                  Review Offer Terms
                </Button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Review Offer Modal */}
      <Modal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        title={`Offer Evaluation: ${selectedOffer.buyerName}`}
        subtitle="Frontend Demonstration Mode"
      >
        <div className="space-y-4">
          <div className="p-3 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Material & Quantity:</span>
              <span className="font-semibold text-[#17483C]">Rice straw (1,000 kg)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Gross Unit Rate:</span>
              <span className="font-semibold text-[#17483C] font-heading tabular-nums">₹{selectedOffer.unitRate.toFixed(2)}/kg</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#1D1160] pt-1 border-t border-[#E2EBE5]">
              <span>Gross Deal Value:</span>
              <span className="font-heading tabular-nums">₹{selectedOffer.grossTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Hauling & Transport:</span>
              <span className="font-semibold italic text-[#9E822E]">Estimate pending carrier staging</span>
            </div>
          </div>

          <p className="text-xs text-[#334155] leading-relaxed">
            In live exchange operations, accepting an offer triggers automated pickup window scheduling, carrier capacity booking, and verified settlement upon gross weighment at the destination depot.
          </p>

          <p className="text-xs text-neutral-400">
            * Note: Illustrative demonstration data, not live marketplace offers. No backend transactions were initiated.
          </p>
        </div>
      </Modal>

      {/* Side-by-Side Comparison Modal */}
      <Modal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        title="Side-by-Side Offer Comparison"
        subtitle="Sample 1,000 kg Rice Straw Listing"
      >
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2EBE5] bg-[#F4F7F5]">
                  <th className="py-2.5 px-3 font-semibold text-neutral-600">Metric</th>
                  <th className="py-2.5 px-3 font-bold text-[#1D1160]">Buyer A</th>
                  <th className="py-2.5 px-3 font-bold text-[#1D1160]">Buyer B</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EBE5]">
                <tr>
                  <td className="py-2 px-3 text-neutral-500">Unit Offer Rate</td>
                  <td className="py-2 px-3 font-semibold text-[#17483C] font-heading tabular-nums">₹2.00 / kg</td>
                  <td className="py-2 px-3 font-semibold text-[#17483C] font-heading tabular-nums">₹2.50 / kg</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-neutral-500">Gross Total (1,000 kg)</td>
                  <td className="py-2 px-3 font-bold text-[#17483C] font-heading tabular-nums">₹2,000</td>
                  <td className="py-2 px-3 font-bold text-[#088A1A] font-heading tabular-nums">₹2,500 (+₹500)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-neutral-500">Transport Cost</td>
                  <td className="py-2 px-3 italic text-[#9E822E]">Estimate pending</td>
                  <td className="py-2 px-3 italic text-[#9E822E]">Estimate pending</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-neutral-500">Planned Conversion</td>
                  <td className="py-2 px-3 text-[#334155]">Bio-Coal Briquettes</td>
                  <td className="py-2 px-3 text-[#334155]">Agro-Pulp Packaging</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-neutral-500">Fulfillment Window</td>
                  <td className="py-2 px-3 text-[#334155]">48–72 hours</td>
                  <td className="py-2 px-3 text-[#334155]">24–48 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-neutral-500">
            Demonstration view showcasing ReRoute's transparent reverse bidding interface.
          </p>
        </div>
      </Modal>
    </section>
  );
};

export default ExchangePreviewSection;
