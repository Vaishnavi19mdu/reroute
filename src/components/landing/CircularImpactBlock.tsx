import React from 'react';
import {
  Leaf,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  RefreshCw,
  Cpu,
  FlameKindling,
} from 'lucide-react';
import { Button } from '../common/Button';

interface CircularImpactBlockProps {
  onNavigate?: (path: string) => void;
}

export const CircularImpactBlock: React.FC<CircularImpactBlockProps> = ({ onNavigate }) => {
  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate('/signup');
    } else {
      window.history.pushState({}, '', '/signup');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div id="impact" className="scroll-mt-20">
      {/* 4A: Circular Economy Impact & AI Reuse Advisor Section */}
      <section className="py-16 sm:py-24 bg-[#FBFDFB] border-b border-[#E2EBE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#317787] mb-2">
              <span>Platform Capability</span>
              <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
              <span>Circular Economy Impact Score</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-[#17483C] tracking-tight"
              style={{ fontFamily: 'var(--font-heading)', textWrap: 'balance' }}
            >
              Measuring Waste Diversion & Resource Recovery
            </h2>
            <p className="mt-3 text-base text-[#475569] leading-relaxed">
              ReRoute's planned Circular Economy Impact Score tracks confirmed biomass pickup volumes and estimates how much agricultural residue is redirected from open burning toward productive industrial reuse.
            </p>
          </div>

          {/* Illustrative Example Card: 100 kg of Rice Straw */}
          <div className="max-w-4xl mx-auto bg-white rounded-[8px] border border-[#E2EBE5] p-6 sm:p-8 shadow-xs mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E2EBE5]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#317787]">
                  Illustrative Diversion Model
                </span>
                <h3 className="text-xl font-bold text-[#1D1160] font-heading mt-0.5">
                  Sample Case: 100 kg of Rice Straw
                </h3>
              </div>
              <span className="text-xs font-medium text-[#9E822E] bg-[#F4F0DF] px-2.5 py-1 rounded-[4px] self-start sm:self-auto">
                Demonstration metric
              </span>
            </div>

            {/* Visual Flow: 100kg Farm Residue -> ReRoute Matching -> Productive Biomass */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Step 1: Farm Origin */}
              <div className="p-4 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5] text-center">
                <div className="w-10 h-10 rounded-[6px] bg-white mx-auto flex items-center justify-center text-[#17483C] shadow-xs mb-3">
                  <Scale className="w-5 h-5" />
                </div>
                <div className="text-xs text-neutral-500">Listed Raw Residue</div>
                <div className="text-lg font-bold text-[#17483C] font-heading mt-0.5 tabular-nums">
                  100 kg
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">
                  Field straw harvested in post-monsoon cycle
                </div>
              </div>

              {/* Step 2: Prevention of Open Burning */}
              <div className="p-4 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5] text-center">
                <div className="w-10 h-10 rounded-[6px] bg-white mx-auto flex items-center justify-center text-[#9E822E] shadow-xs mb-3">
                  <FlameKindling className="w-5 h-5" />
                </div>
                <div className="text-xs text-neutral-500">Disposal Diversion</div>
                <div className="text-lg font-bold text-[#1D1160] font-heading mt-0.5">
                  100% Diverted
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">
                  Prevented from in-field open-air stubble burning
                </div>
              </div>

              {/* Step 3: Useful Industrial Input */}
              <div className="p-4 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5] text-center">
                <div className="w-10 h-10 rounded-[6px] bg-white mx-auto flex items-center justify-center text-[#088A1A] shadow-xs mb-3">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="text-xs text-neutral-500">Productive Reuse</div>
                <div className="text-lg font-bold text-[#088A1A] font-heading mt-0.5">
                  Thermal Biomass
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">
                  Converted into compressed briquettes or paper fiber
                </div>
              </div>

            </div>

            <p className="text-xs text-[#64748B] text-center italic border-t border-[#E2EBE5] pt-4">
              * Note: Demonstrates mass balance diversion. ReRoute models material flow directly rather than asserting unverified emissions claims.
            </p>
          </div>

          {/* AI Reuse Advisor Feature Showcase */}
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#17483C]/5 via-[#317787]/5 to-[#8FBC8B]/10 rounded-[8px] border border-[#8FBC8B]/40 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#17483C] text-white rounded-[6px] shrink-0">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-[#17483C] font-heading">
                      AI Reuse Advisor & Circular Scoring
                    </h3>
                    <span className="text-[11px] font-semibold text-[#088A1A] bg-[#8FBC8B]/20 px-2 py-0.5 rounded-[4px] border border-[#8FBC8B]/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#088A1A]" />
                      Active Intelligence Engine
                    </span>
                  </div>
                  <p className="text-sm text-[#334155] leading-relaxed">
                    The <strong>AI Reuse Advisor</strong> analyzes moisture content, cellulose-to-lignin composition, and regional off-take viability to recommend certified circular conversion pathways (e.g. bio-coal briquetting vs. molded fiber packaging vs. pyrolysis biochar) for any listed crop residue with deterministic mass-balance circularity scoring.
                  </p>
                </div>
              </div>

              <Button
                variant="forest"
                size="sm"
                onClick={() => onNavigate ? onNavigate('/dashboard/farmer') : undefined}
                className="shrink-0 whitespace-nowrap self-start sm:self-center"
              >
                <span>Launch Advisor in Portal</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 4B: Closing CTA Section */}
      <section className="relative overflow-hidden bg-[#17483C] text-white py-16 sm:py-20 border-b border-[#12382F]">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#EDD17E]">
            <span>Join the Exchange</span>
            <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
            <span>Waste to Worth</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
            style={{ fontFamily: 'var(--font-heading)', textWrap: 'balance' }}
          >
            Give agricultural residues a better route.
          </h2>

          <p className="text-base sm:text-lg text-[#E6EEF2]/90 max-w-2xl mx-auto leading-relaxed font-normal">
            Join farmers, industrial processors, and logistics providers building a transparent, productive circular economy for agricultural leftovers.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="teal"
              size="lg"
              onClick={handleGetStarted}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Get Started with ReRoute
            </Button>
            <Button
              variant="ghost"
              size="lg"
              asAnchor={true}
              href="#how-it-works"
              className="text-white hover:bg-white/10 border border-white/20"
            >
              Review How It Works
            </Button>
          </div>

          <div className="pt-8 border-t border-[#8FBC8B]/20 flex flex-wrap items-center justify-center gap-6 text-xs text-[#8FBC8B]">
            <span>Farmer Listing Portal</span>
            <span aria-hidden="true" className="text-[#8FBC8B]/40">·</span>
            <span>Industrial Buyer Reverse Bidding</span>
            <span aria-hidden="true" className="text-[#8FBC8B]/40">·</span>
            <span>Hauling & Transport Coordination</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CircularImpactBlock;
