import React, { useState } from 'react';
import {
  Tag,
  MapPin,
  Scale,
  HandCoins,
  Truck,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface ListingItem {
  id: string;
  name: string;
  category: string;
  categoryKey: string;
  quantity: string;
  quantityNum: number;
  location: string;
  indicativePrice: string;
  moistureSpec: string;
  statusTag: string;
  offers: {
    buyerName: string;
    buyerType: string;
    unitPrice: number;
    grossTotal: number;
    transportStatus: string;
    intendedReuse: string;
  }[];
}

interface MarketplacePreviewBlockProps {
  onNavigate?: (path: string) => void;
}

export const MarketplacePreviewBlock: React.FC<MarketplacePreviewBlockProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedLot, setSelectedLot] = useState<ListingItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [futureRouteModalOpen, setFutureRouteModalOpen] = useState(false);

  // Sample Agricultural Residue Listings (Section 4 Block 3 required)
  const listings: ListingItem[] = [
    {
      id: 'LOT-RS-101',
      name: 'Rice Straw (Baled)',
      category: 'Cereal Crop Residue',
      categoryKey: 'cereal',
      quantity: '1,000 kg (1 MT)',
      quantityNum: 1000,
      location: 'Sangrur, Punjab',
      indicativePrice: '₹2.00 – ₹2.50 / kg',
      moistureSpec: '< 14% Moisture (Dry Bales)',
      statusTag: 'Sample listing',
      offers: [
        {
          buyerName: 'Buyer A (BioPower Energy)',
          buyerType: 'Bio-Coal Briquette Facility',
          unitPrice: 2.0,
          grossTotal: 2000,
          transportStatus: 'Estimate pending',
          intendedReuse: 'Thermal Fuel Briquettes',
        },
        {
          buyerName: 'Buyer B (EcoFiber Packaging)',
          buyerType: 'Molded Pulp Manufacturer',
          unitPrice: 2.5,
          grossTotal: 2500,
          transportStatus: 'Estimate pending',
          intendedReuse: 'Eco-Packaging Board',
        },
      ],
    },
    {
      id: 'LOT-SB-204',
      name: 'Sugarcane Bagasse',
      category: 'Agro-Industrial Residue',
      categoryKey: 'industrial',
      quantity: '5,000 kg (5 MT)',
      quantityNum: 5000,
      location: 'Kolhapur, Maharashtra',
      indicativePrice: '₹1.60 – ₹1.90 / kg',
      moistureSpec: '45–50% Moisture (Mill-run)',
      statusTag: 'Sample listing',
      offers: [
        {
          buyerName: 'Bio-Paper Mills Ltd',
          buyerType: 'Specialty Paper Maker',
          unitPrice: 1.85,
          grossTotal: 9250,
          transportStatus: 'Estimate pending',
          intendedReuse: 'Unbleached Kraft Paper',
        },
        {
          buyerName: 'Cogeneration Energy Hub',
          buyerType: 'Power Cogeneration Plant',
          unitPrice: 1.7,
          grossTotal: 8500,
          transportStatus: 'Estimate pending',
          intendedReuse: 'Boiler Steam Biomass',
        },
      ],
    },
    {
      id: 'LOT-GS-309',
      name: 'Groundnut Shells',
      category: 'Oilseed Shells & Husks',
      categoryKey: 'husks',
      quantity: '2,500 kg (2.5 MT)',
      quantityNum: 2500,
      location: 'Rajkot, Gujarat',
      indicativePrice: '₹3.20 – ₹3.60 / kg',
      moistureSpec: '< 10% Moisture (Dry Crushed)',
      statusTag: 'Sample listing',
      offers: [
        {
          buyerName: 'GreenPellet Fuel Industry',
          buyerType: 'Solid Fuel Producer',
          unitPrice: 3.5,
          grossTotal: 8750,
          transportStatus: 'Estimate pending',
          intendedReuse: 'Compressed Fuel Pellets',
        },
        {
          buyerName: 'BioChar Agro Solutions',
          buyerType: 'Soil Amendment Facility',
          unitPrice: 3.3,
          grossTotal: 8250,
          transportStatus: 'Estimate pending',
          intendedReuse: 'Carbon Biochar Conditioning',
        },
      ],
    },
  ];

  const filteredListings =
    activeCategory === 'all'
      ? listings
      : listings.filter((l) => l.categoryKey === activeCategory);

  const handleOpenLot = (lot: ListingItem) => {
    setSelectedLot(lot);
    setDetailModalOpen(true);
  };

  const handleGoToMarketplace = () => {
    if (onNavigate) {
      onNavigate('/marketplace');
    } else {
      setFutureRouteModalOpen(true);
    }
  };

  return (
    <section id="marketplace" className="py-16 sm:py-24 bg-[#F4F7F5] border-b border-[#E2EBE5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#317787] mb-2">
            <span>Live Exchange Preview</span>
            <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
            <span>Marketplace Interface</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#17483C] tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', textWrap: 'balance' }}
          >
            Explore Agricultural Residue Listings
          </h2>
          <p className="mt-3 text-base text-[#475569] leading-relaxed">
            Browse genuine agricultural residues listed by regional farms. Compare indicative price ranges, moisture conditions, and active buyer reverse bids.
          </p>
        </div>

        {/* Demo Data Banner */}
        <div className="mb-8 p-3.5 bg-white border border-[#EDD17E] rounded-[6px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#17483C] shadow-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#9E822E] shrink-0" />
            <span>
              <strong>Demo Data:</strong> All listings, locations, and buyer bids below are illustrative sample values to demonstrate platform functionality.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#317787] bg-[#E6EEF2] px-2.5 py-1 rounded-[4px] shrink-0">
            Interactive Preview
          </span>
        </div>

        {/* Marketplace Interactive Container */}
        <div className="bg-white rounded-[8px] border border-[#E2EBE5] shadow-sm p-5 sm:p-7">
          
          {/* Top Bar: Category Filters & Search Mock */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E2EBE5]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-[6px] transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-[#1D1160] text-white shadow-xs'
                    : 'bg-[#F4F7F5] text-[#334155] hover:bg-[#E6EEF2]'
                }`}
              >
                All Residues ({listings.length})
              </button>
              <button
                onClick={() => setActiveCategory('cereal')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-[6px] transition-all cursor-pointer ${
                  activeCategory === 'cereal'
                    ? 'bg-[#1D1160] text-white shadow-xs'
                    : 'bg-[#F4F7F5] text-[#334155] hover:bg-[#E6EEF2]'
                }`}
              >
                Cereal Straws
              </button>
              <button
                onClick={() => setActiveCategory('industrial')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-[6px] transition-all cursor-pointer ${
                  activeCategory === 'industrial'
                    ? 'bg-[#1D1160] text-white shadow-xs'
                    : 'bg-[#F4F7F5] text-[#334155] hover:bg-[#E6EEF2]'
                }`}
              >
                Industrial Bagasse
              </button>
              <button
                onClick={() => setActiveCategory('husks')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-[6px] transition-all cursor-pointer ${
                  activeCategory === 'husks'
                    ? 'bg-[#1D1160] text-white shadow-xs'
                    : 'bg-[#F4F7F5] text-[#334155] hover:bg-[#E6EEF2]'
                }`}
              >
                Shells & Husks
              </button>
            </div>

            <div className="text-xs text-neutral-500 font-medium">
              Showing {filteredListings.length} of {listings.length} sample lots
            </div>
          </div>

          {/* Listings Grid (Responsive Grid / Stacked on Mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="bg-[#FBFDFB] rounded-[8px] border border-[#E2EBE5] p-5 flex flex-col justify-between hover:border-[#8FBC8B] hover:shadow-xs transition-all duration-200"
              >
                <div>
                  {/* Lot Header & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono text-neutral-500 bg-white px-2 py-0.5 rounded-[4px] border border-[#E2EBE5]">
                      {item.id}
                    </span>
                    <span className="text-[11px] font-medium text-[#9E822E] bg-[#F4F0DF] px-2 py-0.5 rounded-[4px]">
                      {item.statusTag}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-lg font-bold text-[#17483C] font-heading mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#317787] font-medium mb-4">
                    {item.category}
                  </p>

                  {/* Lot Metadata */}
                  <div className="space-y-2 text-xs text-[#475569] mb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-[#317787]" /> Available Quantity:
                      </span>
                      <strong className="text-[#1D1160] font-semibold tabular-nums">
                        {item.quantity}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#317787]" /> Pickup Hub:
                      </span>
                      <span className="text-[#17483C] font-medium">
                        {item.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#317787]" /> Indicative Price:
                      </span>
                      <span className="text-[#17483C] font-bold font-heading tabular-nums">
                        {item.indicativePrice}
                      </span>
                    </div>

                    <div className="pt-2 text-[11px] text-neutral-500">
                      Condition: <span className="font-medium text-neutral-700">{item.moistureSpec}</span>
                    </div>
                  </div>

                  {/* Bid Preview Box */}
                  <div className="p-3 bg-white rounded-[6px] border border-[#E2EBE5] mb-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#17483C] flex items-center gap-1">
                        <HandCoins className="w-3.5 h-3.5 text-[#088A1A]" />
                        Active Offers ({item.offers.length}):
                      </span>
                      <span className="text-[11px] text-[#088A1A] font-bold">
                        Top: ₹{item.offers[item.offers.length - 1].unitPrice.toFixed(2)}/kg
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64748B] flex justify-between">
                      <span>Gross Offer:</span>
                      <strong className="text-[#1D1160] font-heading tabular-nums">
                        ₹{item.offers[item.offers.length - 1].grossTotal.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div className="text-[10px] text-neutral-400 italic">
                      Transport: Estimate pending
                    </div>
                  </div>
                </div>

                {/* Inspect Action */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                  icon={<Eye className="w-3.5 h-3.5" />}
                  onClick={() => handleOpenLot(item)}
                >
                  Inspect Lot & Offers
                </Button>
              </div>
            ))}
          </div>

          {/* Prominent Action to Marketplace */}
          <div className="mt-8 pt-6 border-t border-[#E2EBE5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#64748B]">
              Looking to procure bulk biomass or sell farm residues at scale?
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleGoToMarketplace}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Open Full Marketplace
            </Button>
          </div>

        </div>

      </div>

      {/* Lot Inspection Detail Modal */}
      {selectedLot && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`Residue Lot: ${selectedLot.name}`}
          subtitle={`${selectedLot.id} · ${selectedLot.location}`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Material Category:</span>
                <span className="font-semibold text-[#17483C]">{selectedLot.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Available Batch:</span>
                <span className="font-semibold text-[#1D1160] font-heading tabular-nums">{selectedLot.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Moisture & Quality Spec:</span>
                <span className="font-medium text-[#17483C]">{selectedLot.moistureSpec}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#17483C] pt-1 border-t border-[#E2EBE5]">
                <span>Indicative Guide Price:</span>
                <span className="font-heading tabular-nums">{selectedLot.indicativePrice}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#17483C]">
                Buyer Offers on this Lot:
              </p>
              {selectedLot.offers.map((offer, idx) => (
                <div key={idx} className="p-3 bg-white rounded-[6px] border border-[#E2EBE5] text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-[#1D1160]">{offer.buyerName}</strong>
                    <span className="text-sm font-bold text-[#088A1A] font-heading tabular-nums">
                      ₹{offer.grossTotal.toLocaleString('en-IN')} (₹{offer.unitPrice.toFixed(2)}/kg)
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-500 text-[11px]">
                    <span>Facility: {offer.buyerType}</span>
                    <span>Intended: {offer.intendedReuse}</span>
                  </div>
                  <div className="text-[10px] text-[#9E822E] italic">
                    Hauling: {offer.transportStatus}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-neutral-400 italic">
              * Note: Sample listing data for demonstration. Active exchange trading and counter-bidding will be enabled in Segment 3.
            </p>
          </div>
        </Modal>
      )}

      {/* Future Route Notice Modal */}
      <Modal
        isOpen={futureRouteModalOpen}
        onClose={() => setFutureRouteModalOpen(false)}
        title="Marketplace Route Notice"
        subtitle="Platform Roadmap"
      >
        <div className="space-y-3 text-xs text-[#334155] leading-relaxed">
          <p>
            You clicked <strong>Open Full Marketplace</strong>.
          </p>
          <div className="p-3 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5]">
            <p className="font-semibold text-[#17483C] mb-1">Segment 1 Scope:</p>
            <p>
              In Segment 1, the marketplace preview is embedded directly in this landing page. The dedicated interactive exchange portal (`/marketplace`) and bidding workflows will be implemented in subsequent segments.
            </p>
          </div>
          <p className="text-neutral-500">
            You can continue testing the sample lot filters and inspections directly on this page.
          </p>
        </div>
      </Modal>
    </section>
  );
};

export default MarketplacePreviewBlock;
