import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const ClosingCTASection: React.FC = () => {
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#17483C] text-white py-20 lg:py-24 border-b border-[#12382F]">
      {/* Subtle organic background vector lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#8FBC8B" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#EDD17E] mb-4">
          <span>Circular Economy in Action</span>
          <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
          <span>Waste to Worth</span>
        </div>

        {/* Heading */}
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
          style={{ fontFamily: 'var(--font-heading)', textWrap: 'balance' }}
        >
          Give agricultural residues a better route.
        </h2>

        {/* Supporting Copy */}
        <p className="mt-4 text-base sm:text-lg text-[#E6EEF2]/90 max-w-2xl mx-auto leading-relaxed font-normal">
          Connect your farm supply or industrial processing facility with ReRoute. Turn post-harvest residues into predictable revenue, clean raw materials, and verified environmental benefits.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="teal"
            size="lg"
            onClick={() => setGetStartedModalOpen(true)}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Get Started
          </Button>

          <Button
            variant="ghost"
            size="lg"
            asAnchor={true}
            href="#how-it-works"
            className="text-white hover:bg-white/10 border border-white/20"
          >
            Learn How It Works
          </Button>
        </div>

        {/* Small Trust Markers */}
        <div className="mt-12 pt-8 border-t border-[#8FBC8B]/20 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#8FBC8B]">
          <span>Transparent Reverse Bidding</span>
          <span aria-hidden="true" className="text-[#8FBC8B]/40">·</span>
          <span>Verified Moisture & Quality Tiers</span>
          <span aria-hidden="true" className="text-[#8FBC8B]/40">·</span>
          <span>Coordinated Rural Hauling</span>
        </div>
      </div>

      {/* Get Started Onboarding Dialog */}
      <Modal
        isOpen={getStartedModalOpen}
        onClose={() => setGetStartedModalOpen(false)}
        title="Get Started with ReRoute"
        subtitle="Participant Registration Preview"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#334155] leading-relaxed">
            Welcome to ReRoute! In the upcoming platform segment, you can register as one of three primary stakeholders:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5]">
              <strong className="text-[#17483C]">1. Agricultural Producer / Farmer:</strong> List straw, stalks, or husk residues, specify crop harvest date, and receive verified bids.
            </div>
            <div className="p-3 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5]">
              <strong className="text-[#1D1160]">2. Commercial / Industrial Buyer:</strong> Set raw material specifications, configure procurement radius, and submit offers.
            </div>
            <div className="p-3 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5]">
              <strong className="text-[#317787]">3. Fleet & Logistics Carrier:</strong> Claim regional transport loads, plan multi-stop collections, and ensure timely drop-offs.
            </div>
          </div>
          <p className="text-xs text-neutral-500 pt-2 border-t border-[#E2EBE5]">
            Segment 1 preview focuses on presentation and architecture. Full profile management will activate in subsequent releases.
          </p>
        </div>
      </Modal>
    </section>
  );
};

export default ClosingCTASection;
