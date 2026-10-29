import React, { useState } from 'react';
import {
  Sparkles,
  Leaf,
  Layers,
  Scale,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  HelpCircle,
  Building2,
  Wrench,
  ChevronRight,
  TrendingUp,
  Info,
} from 'lucide-react';
import {
  generateReuseRecommendations,
  calculateCircularImpactScore,
  ResidueKey,
  MoistureOption,
  ObjectiveOption,
  RESIDUE_DATABASE,
  ReuseRecommendation,
} from '../../services/ai';
import { Button } from '../../components/common/Button';
import { CircularImpactModal } from '../../components/common/CircularImpactModal';
import { useMarketplace } from '../../services/api/marketplaceState';

interface AIAdvisorViewProps {
  onPreFillListing?: (data: {
    materialName: string;
    category: 'Cereal Straws' | 'Agro-Industrial' | 'Husks & Shells' | 'Other';
    quantity: number;
    unit: 'tonnes' | 'kg';
    state: string;
    district: string;
    moistureSpec: string;
    indicativePrice: number;
    description: string;
  }) => void;
  onNavigateMarketplace?: () => void;
}

export const AIAdvisorView: React.FC<AIAdvisorViewProps> = ({
  onPreFillListing,
  onNavigateMarketplace,
}) => {
  const { activeRole } = useMarketplace();

  // Inputs
  const [residueKey, setResidueKey] = useState<ResidueKey>('rice_straw');
  const [quantity, setQuantity] = useState<string>('50');
  const [unit, setUnit] = useState<'tonnes' | 'kg'>('tonnes');
  const [state, setState] = useState<string>('Punjab');
  const [district, setDistrict] = useState<string>('Sangrur');
  const [moisture, setMoisture] = useState<MoistureOption>('dry');
  const [objective, setObjective] = useState<ObjectiveOption>('all');

  // Selected lot for modal
  const [selectedLotModal, setSelectedLotModal] = useState<{
    materialName: string;
    quantity: number;
    unit: 'tonnes' | 'kg';
    moistureSpec: string;
    pathwayCategory: string;
  } | null>(null);

  // Compute recommendations
  const result = generateReuseRecommendations({
    residueKey,
    quantity: Number(quantity) || 1,
    unit,
    state,
    moisture,
    objective,
  });

  const currentImpact = calculateCircularImpactScore({
    materialName: result.metadata.commonName,
    quantity: Number(quantity) || 1,
    unit,
    moistureSpec: moisture === 'dry' ? '< 14% Dry' : moisture === 'moderate' ? '15-25% Moisture' : 'High Moisture',
    pathwayCategory: result.recommendations[0]?.category,
  });

  const handlePreFill = (rec: ReuseRecommendation) => {
    if (onPreFillListing) {
      onPreFillListing({
        materialName: `${result.metadata.commonName} (${rec.pathwayTitle.split(' ')[0]} Grade)`,
        category: rec.recommendedCategory,
        quantity: Number(quantity) || 10,
        unit,
        state,
        district: district || 'Central Agro Cluster',
        moistureSpec: rec.suggestedMoistureSpec,
        indicativePrice: Math.round((rec.indicativePriceRange.min + rec.indicativePriceRange.max) / 2),
        description: `Pre-assessed via ReRoute AI Advisor for ${rec.pathwayTitle}. Suitability Score: ${rec.suitabilityScore}%. Prepared to off-take specifications.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#17483C] to-[#1D1160] rounded-[8px] p-6 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-[#EDD17E] text-[#17483C] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px]">
                ReRoute Intelligence Engine
              </span>
              <span className="text-white/70 text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#EDD17E]" />
                Lignocellulosic Matching · Scientific Rules
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading">
              AI Agricultural Reuse Advisor
            </h1>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Analyze crop residues, moisture conditions, and biochemical properties to uncover high-value circular off-take pathways, industrial buyers, and compliant preparation specifications.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-[6px] border border-white/15 text-xs space-y-1 shrink-0">
            <div className="text-[#EDD17E] font-bold text-xs">Platform Circularity Engine</div>
            <div className="text-white/90 text-[11px]">
              • Non-combustion priority<br />
              • Transparent mass balances<br />
              • Direct farmer value retention
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Inputs Form Card */}
      <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-5 shadow-xs space-y-5">
        <div className="border-b border-[#E2EBE5] pb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#17483C] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#317787]" />
            <span>Select Residue Parameters</span>
          </h2>
          <span className="text-[11px] text-[#64748B]">
            Interactive Real-time Calculations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Residue Type */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#17483C] block">Crop Residue Type</label>
            <select
              value={residueKey}
              onChange={(e) => setResidueKey(e.target.value as ResidueKey)}
              className="w-full h-10 px-3 bg-[#F4F7F5] border border-[#CCDCD2] rounded-[6px] text-xs font-medium text-[#17483C] focus:outline-none focus:ring-1 focus:ring-[#17483C]"
            >
              <option value="rice_straw">Rice Straw (Paddy Straw)</option>
              <option value="sugarcane_bagasse">Sugarcane Bagasse</option>
              <option value="groundnut_shells">Groundnut / Peanut Shells</option>
              <option value="rice_husk">Rice Husk (Chaff)</option>
              <option value="cotton_stalks">Cotton Stalks & Stems</option>
              <option value="corn_stover">Corn Stover (Maize Stubble)</option>
              <option value="wheat_straw">Wheat Straw (Bhoosa)</option>
              <option value="mustard_stalks">Mustard Stalks</option>
            </select>
          </div>

          {/* Quantity & Unit */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#17483C] block">Available Quantity</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-10 px-3 bg-[#F4F7F5] border border-[#CCDCD2] rounded-[6px] text-xs font-medium text-[#17483C] focus:outline-none focus:ring-1 focus:ring-[#17483C]"
                placeholder="e.g. 50"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'tonnes' | 'kg')}
                className="h-10 px-2 bg-[#F4F7F5] border border-[#CCDCD2] rounded-[6px] text-xs font-semibold text-[#17483C] shrink-0"
              >
                <option value="tonnes">Tonnes</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>

          {/* Moisture Condition */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#17483C] block">Field Moisture Level</label>
            <select
              value={moisture}
              onChange={(e) => setMoisture(e.target.value as MoistureOption)}
              className="w-full h-10 px-3 bg-[#F4F7F5] border border-[#CCDCD2] rounded-[6px] text-xs font-medium text-[#17483C] focus:outline-none focus:ring-1 focus:ring-[#17483C]"
            >
              <option value="dry">Dry (&lt; 14% Moisture)</option>
              <option value="moderate">Moderate (15% – 25% Moisture)</option>
              <option value="high">High (26% – 45% Moisture)</option>
              <option value="fresh">Fresh / Green (&gt; 45% Moisture)</option>
            </select>
          </div>

          {/* State & Objective */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#17483C] block">State Location</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full h-10 px-3 bg-[#F4F7F5] border border-[#CCDCD2] rounded-[6px] text-xs font-medium text-[#17483C] focus:outline-none focus:ring-1 focus:ring-[#17483C]"
            >
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Karnataka">Karnataka</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>
        </div>

        {/* Strategic Goal Selector Tabs */}
        <div className="pt-2 border-t border-[#E2EBE5]">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">
            Target Objective Preference
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Recommended Pathways' },
              { id: 'highest_value', label: 'Molded Packaging & Pulp' },
              { id: 'energy_pellets', label: 'Industrial Pellets & Boilers' },
              { id: 'soil_biochar', label: 'Regenerative Agriculture & Fodder' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setObjective(tab.id as ObjectiveOption)}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                  objective === tab.id
                    ? 'bg-[#17483C] text-white'
                    : 'bg-[#F4F7F5] text-[#475569] hover:bg-[#E2EBE5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Botanical & Lignocellulosic Profile Panel */}
      <div className="bg-[#E6EEF2]/40 border border-[#317787]/25 rounded-[8px] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#1D1160]">
                {result.metadata.commonName}
              </span>
              <span className="text-xs italic text-[#64748B]">
                ({result.metadata.botanicalSource})
              </span>
            </div>
            <p className="text-xs text-[#334155]">
              Harvest Season: <strong className="text-[#17483C]">{result.metadata.typicalHarvestSeason}</strong> · Stubble Burn Risk: {' '}
              <span className={`font-bold ${result.metadata.stubbleBurnRisk === 'Critical' ? 'text-red-600' : 'text-amber-600'}`}>
                {result.metadata.stubbleBurnRisk}
              </span>
            </p>
          </div>

          {/* Chemical composition micro-indicators */}
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <div className="bg-white px-2.5 py-1.5 rounded-[6px] border border-[#CCDCD2] shadow-xs">
              <span className="text-[#64748B]">Cellulose: </span>
              <strong className="text-[#17483C]">{result.metadata.cellulosePercent}%</strong>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-[6px] border border-[#CCDCD2] shadow-xs">
              <span className="text-[#64748B]">Lignin: </span>
              <strong className="text-[#17483C]">{result.metadata.ligninPercent}%</strong>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-[6px] border border-[#CCDCD2] shadow-xs">
              <span className="text-[#64748B]">Calorific: </span>
              <strong className="text-[#17483C]">{result.metadata.calorificKcalKg} kcal/kg</strong>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-[6px] border border-[#CCDCD2] shadow-xs">
              <span className="text-[#64748B]">Silica: </span>
              <strong className="text-[#17483C]">{result.metadata.silicaPercent}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-heading text-[#1D1160]">
            Recommended Circular Pathways ({result.recommendations.length})
          </h2>
          <p className="text-xs text-[#64748B]">
            Prioritized by physical suitability score and localized off-take demand.
          </p>
        </div>

        {/* Quick Batch Impact Score Badge */}
        <button
          onClick={() =>
            setSelectedLotModal({
              materialName: result.metadata.commonName,
              quantity: Number(quantity) || 50,
              unit,
              moistureSpec: moisture === 'dry' ? '< 14% Dry' : 'Moderate Moisture',
              pathwayCategory: result.recommendations[0]?.category,
            })
          }
          className="inline-flex items-center gap-2 bg-[#8FBC8B]/20 hover:bg-[#8FBC8B]/30 text-[#088A1A] border border-[#8FBC8B]/40 px-3 py-1.5 rounded-[6px] text-xs font-bold transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Batch Impact Score: {currentImpact.totalScore}/100</span>
        </button>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {result.recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-[8px] border border-[#E2EBE5] p-5 sm:p-6 shadow-xs hover:border-[#8FBC8B] transition-all space-y-4"
          >
            {/* Recommendation Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2EBE5]">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#17483C] bg-[#8FBC8B]/20 px-2 py-0.5 rounded-[4px]">
                    {rec.category}
                  </span>
                  <span className="text-[11px] font-semibold text-[#317787] bg-[#E6EEF2] px-2 py-0.5 rounded-[4px]">
                    {rec.suitabilityTier}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-heading text-[#1D1160]">
                  {rec.pathwayTitle}
                </h3>
              </div>

              {/* Suitability Score & Price */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[#64748B]">Suitability:</span>
                  <span className="text-lg font-extrabold text-[#088A1A]">
                    {rec.suitabilityScore}%
                  </span>
                </div>
                <div className="text-xs font-bold text-[#17483C]">
                  {rec.indicativePriceRange.min.toLocaleString()} – {rec.indicativePriceRange.max.toLocaleString()} {rec.indicativePriceRange.unit}
                </div>
              </div>
            </div>

            {/* Why Suitable Description */}
            <div className="text-xs sm:text-sm text-[#334155] leading-relaxed">
              <strong className="text-[#17483C]">Scientific Rationale: </strong>
              {rec.whySuitable}
            </div>

            {/* Structured Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Quality & Moisture Requirements */}
              <div className="bg-[#F4F7F5] p-3.5 rounded-[6px] border border-[#E2EBE5] space-y-2">
                <div className="font-bold text-xs text-[#17483C] flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#317787]" />
                  <span>Moisture & Quality Conditions</span>
                </div>
                <ul className="text-xs text-[#475569] space-y-1">
                  {rec.moistureAndQualityRequirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#088A1A] shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Potential Buyers & Preparation */}
              <div className="bg-[#F4F7F5] p-3.5 rounded-[6px] border border-[#E2EBE5] space-y-2">
                <div className="font-bold text-xs text-[#17483C] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#1D1160]" />
                  <span>Target Buyer Industries</span>
                </div>
                <ul className="text-xs text-[#475569] space-y-1">
                  {rec.potentialBuyers.map((buyer, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#317787] shrink-0 mt-1.5" />
                      <span>{buyer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E2EBE5]">
              <div className="text-xs text-[#64748B] flex items-center gap-1.5 self-start sm:self-center">
                <Wrench className="w-3.5 h-3.5 text-[#317787]" />
                <span>Prep: {rec.preparationSteps[0]}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedLotModal({
                      materialName: `${result.metadata.commonName} (${rec.pathwayTitle.split(' ')[0]})`,
                      quantity: Number(quantity) || 50,
                      unit,
                      moistureSpec: rec.suggestedMoistureSpec,
                      pathwayCategory: rec.category,
                    })
                  }
                  className="px-3 py-2 text-xs font-semibold text-[#317787] hover:text-[#17483C] bg-[#E6EEF2] hover:bg-[#d9e5eb] rounded-[6px] transition-colors cursor-pointer"
                >
                  View Impact Score
                </button>

                {activeRole === 'farmer' && onPreFillListing && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handlePreFill(rec)}
                  >
                    <span>Pre-fill Listing with this Pathway</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                )}

                {activeRole === 'buyer' && onNavigateMarketplace && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onNavigateMarketplace}
                  >
                    <span>Browse Matching Residues</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Impact Modal */}
      {selectedLotModal && (
        <CircularImpactModal
          isOpen={true}
          onClose={() => setSelectedLotModal(null)}
          lotData={selectedLotModal}
        />
      )}
    </div>
  );
};
