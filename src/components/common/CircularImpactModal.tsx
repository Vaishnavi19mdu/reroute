import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Scale,
  Leaf,
  Truck,
  Layers,
  ShieldCheck,
  X,
} from 'lucide-react';
import { calculateCircularImpactScore, CircularImpactBreakdown } from '../../services/ai';
import { Button } from './Button';

interface CircularImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  lotData: {
    materialName: string;
    quantity: number;
    unit: 'tonnes' | 'kg';
    moistureSpec?: string;
    pathwayCategory?: string;
    location?: string;
  };
}

export const CircularImpactModal: React.FC<CircularImpactModalProps> = ({
  isOpen,
  onClose,
  lotData,
}) => {
  if (!isOpen) return null;

  const impact: CircularImpactBreakdown = calculateCircularImpactScore({
    materialName: lotData.materialName,
    quantity: lotData.quantity,
    unit: lotData.unit,
    moistureSpec: lotData.moistureSpec,
    pathwayCategory: lotData.pathwayCategory,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1160]/40 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-[8px] border border-[#E2EBE5] shadow-2xl p-6 sm:p-7 text-[#17483C] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2EBE5]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[6px] bg-[#8FBC8B]/20 text-[#088A1A] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-[#1D1160]">
                Circular Economy Impact Score
              </h3>
              <p className="text-xs text-[#317787]">
                Deterministic Mass-Balance & Material Valorization Breakdown
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-[6px] text-neutral-400 hover:text-neutral-700 hover:bg-[#F4F7F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-6 text-xs sm:text-sm text-[#334155]">
          {/* Top Score Showcase */}
          <div className="bg-[#F4F7F5] border border-[#E2EBE5] rounded-[8px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#317787]">
                Evaluated Exchange Lot
              </span>
              <h4 className="text-base font-bold text-[#17483C]">
                {lotData.materialName} ({lotData.quantity} {lotData.unit})
              </h4>
              <p className="text-xs text-[#64748B]">
                {lotData.moistureSpec || 'Standard verified moisture specification'}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-[8px] border border-[#8FBC8B]/30 shadow-xs">
              <div className="text-right">
                <div className="text-3xl font-extrabold text-[#17483C] leading-none">
                  {impact.totalScore}
                  <span className="text-sm font-medium text-[#64748B]">/100</span>
                </div>
                <span className="inline-block mt-1 text-[11px] font-bold text-[#088A1A]">
                  {impact.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Transparent 4-Factor Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#17483C] mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#317787]" />
              <span>Scoring Factors & Criteria</span>
            </h4>

            <div className="space-y-2.5">
              {/* Factor 1: Pathway */}
              <div className="p-3 bg-white rounded-[6px] border border-[#E2EBE5] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-[#1D1160] flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-[#088A1A]" />
                    <span>Mapped Non-Combustion Pathway</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Primary target: {impact.metrics.primaryEndUse}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-xs text-[#17483C]">
                    {impact.factors.pathwayPoints} / {impact.factors.pathwayMax} pts
                  </span>
                </div>
              </div>

              {/* Factor 2: Moisture & Quality */}
              <div className="p-3 bg-white rounded-[6px] border border-[#E2EBE5] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-[#1D1160] flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#317787]" />
                    <span>Moisture & Quality Spec Compliance</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Condition: {lotData.moistureSpec || 'Controlled dry lot'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-xs text-[#17483C]">
                    {impact.factors.moisturePoints} / {impact.factors.moistureMax} pts
                  </span>
                </div>
              </div>

              {/* Factor 3: Logistics */}
              <div className="p-3 bg-white rounded-[6px] border border-[#E2EBE5] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-[#1D1160] flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#EDD17E]" />
                    <span>Localized Staging & Radius Efficiency</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Designated rural staging point within regional transit cluster (&lt;50 km)
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-xs text-[#17483C]">
                    {impact.factors.logisticsPoints} / {impact.factors.logisticsMax} pts
                  </span>
                </div>
              </div>

              {/* Factor 4: Field Diversion */}
              <div className="p-3 bg-white rounded-[6px] border border-[#E2EBE5] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-[#1D1160] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#088A1A]" />
                    <span>Direct Open-Field Stubble Burn Avoidance</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    100% of volume routed to industrial or regenerative reuse
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-xs text-[#17483C]">
                    {impact.factors.diversionPoints} / {impact.factors.diversionMax} pts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Mass-Balance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#E6EEF2]/40 rounded-[6px] border border-[#317787]/20 space-y-1">
              <span className="text-[11px] font-bold text-[#317787] uppercase tracking-wider">
                Diverted Biomass Volume
              </span>
              <div className="text-lg font-bold text-[#17483C]">
                {impact.metrics.divertedTonnage} MT ({impact.metrics.divertedKilograms.toLocaleString()} kg)
              </div>
              <p className="text-[11px] text-[#64748B]">
                Physical agricultural residue diverted from open disposal.
              </p>
            </div>

            <div className="p-3.5 bg-[#8FBC8B]/15 rounded-[6px] border border-[#8FBC8B]/40 space-y-1">
              <span className="text-[11px] font-bold text-[#088A1A] uppercase tracking-wider">
                Stubble Burn Avoidance
              </span>
              <div className="text-lg font-bold text-[#088A1A]">
                100% Verified Diversion
              </div>
              <p className="text-[11px] text-[#64748B]">
                Direct off-take commitment by verified buyer.
              </p>
            </div>
          </div>

          {/* Transparent Methodology Disclaimer */}
          <div className="p-3 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5] text-[11px] text-[#64748B] flex items-start gap-2 leading-relaxed">
            <HelpCircle className="w-4 h-4 text-[#317787] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#17483C]">Standardized ReRoute Circularity Standard: </strong>
              {impact.methodologyNote}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2EBE5]">
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
