import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Send,
  Eye,
  Tag,
  MapPin,
  Scale,
  XCircle,
  FileText,
  Building2,
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Inbox,
} from 'lucide-react';
import { useMarketplace, ResidueListing, BuyerOffer, getGreeting } from '../../services/api/marketplaceState';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FormField } from '../../components/common/FormField';
import { calculateCircularImpactScore } from '../../services/ai';
import { CircularImpactModal } from '../../components/common/CircularImpactModal';
import { AIAdvisorView } from './AIAdvisorView';

interface BuyerDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  activeTab = 'overview',
  onTabChange,
}) => {
  const { listings, offers, submitOffer, withdrawOffer, activeProfile } = useMarketplace();
  const greeting = getGreeting(activeProfile?.firstName);

  // Search & Filter state for Marketplace tab
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'priceAsc' | 'priceDesc' | 'qtyDesc'>('priceAsc');

  // Filter state for Submitted Offers tab
  const [offersStatusFilter, setOffersStatusFilter] = useState<string>('All');

  // Offer submission modal state
  const [selectedLotForOffer, setSelectedLotForOffer] = useState<ResidueListing | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [requestedQuantity, setRequestedQuantity] = useState('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [offerErrors, setOfferErrors] = useState<Record<string, string>>({});
  const [offerFeedback, setOfferFeedback] = useState<string | null>(null);

  // Lot detail modal
  const [inspectLot, setInspectLot] = useState<ResidueListing | null>(null);
  const [impactModalLot, setImpactModalLot] = useState<ResidueListing | null>(null);

  // Filter listings for marketplace
  const filteredListings = listings
    .filter((lot) => {
      const matchSearch =
        lot.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.state.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'All' || lot.category === categoryFilter;
      const matchLocation = locationFilter === 'All' || lot.state === locationFilter;
      return matchSearch && matchCategory && matchLocation;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.indicativePrice - b.indicativePrice;
      if (sortBy === 'priceDesc') return b.indicativePrice - a.indicativePrice;
      if (sortBy === 'qtyDesc') return b.quantity - a.quantity;
      return 0;
    });

  // Filter offers for submitted offers tab
  const filteredOffers = offers.filter((o) => {
    if (offersStatusFilter === 'All') return true;
    return o.status === offersStatusFilter;
  });

  // Buyer metrics
  const availableLotsCount = listings.filter((l) => l.status === 'Active' || l.status === 'Under Offer').length;
  const activeBidsCount = offers.filter((o) => o.status === 'Pending').length;
  const acceptedBidsCount = offers.filter((o) => o.status === 'Accepted').length;
  const rejectedBidsCount = offers.filter((o) => o.status === 'Rejected').length;
  const totalPurchasingGross = offers
    .filter((o) => o.status === 'Accepted')
    .reduce((acc, curr) => acc + curr.totalGross, 0);

  const handleOpenOfferModal = (lot: ResidueListing) => {
    setSelectedLotForOffer(lot);
    setOfferPrice(lot.indicativePrice.toString());
    setRequestedQuantity(lot.quantity.toString());
    setBuyerMessage('');
    setOfferErrors({});
    setOfferFeedback(null);
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLotForOffer) return;

    const errs: Record<string, string> = {};
    const priceNum = Number(offerPrice);
    const qtyNum = Number(requestedQuantity);

    if (!offerPrice.trim() || isNaN(priceNum) || priceNum <= 0) {
      errs.offerPrice = 'Enter a valid positive unit offer.';
    }
    if (!requestedQuantity.trim() || isNaN(qtyNum) || qtyNum <= 0) {
      errs.requestedQuantity = 'Enter a valid requested quantity.';
    } else if (qtyNum > selectedLotForOffer.quantity) {
      errs.requestedQuantity = `Cannot exceed available quantity (${selectedLotForOffer.quantity} ${selectedLotForOffer.unit}).`;
    }

    if (Object.keys(errs).length > 0) {
      setOfferErrors(errs);
      return;
    }

    const res = submitOffer({
      listingId: selectedLotForOffer.id,
      buyerName: 'BioPower Clean Fuels Ltd (Current Buyer)',
      buyerType: 'Biomass Pellet & Briquette Manufacturer',
      offeredPrice: priceNum,
      requestedQuantity: qtyNum,
      unit: selectedLotForOffer.unit,
      message: buyerMessage,
    });

    if (res.success) {
      setOfferFeedback(
        'Offer submitted! This bid is now queued in the farmer’s incoming bids list and updated in your submitted offers.'
      );
      setTimeout(() => {
        setSelectedLotForOffer(null);
        setOfferFeedback(null);
      }, 1500);
    } else if (res.error) {
      setOfferErrors({ form: res.error });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          VIEW 1: AI MATERIAL ADVISOR TAB
          ========================================================================= */}
      {activeTab === 'advisor' && (
        <AIAdvisorView
          onNavigateMarketplace={() => onTabChange && onTabChange('marketplace')}
        />
      )}

      {/* =========================================================================
          VIEW 2: BUYER OVERVIEW TAB
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Personalised Greeting & Header Banner */}
          <div className="p-5 sm:p-6 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D1160] mb-1">
                <span>BUYER PORTAL</span>
                <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
                <span>{activeProfile?.location?.city || 'Kolhapur'}, {activeProfile?.location?.state || 'Maharashtra'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1D1160] font-heading">
                {greeting}
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                {activeProfile?.organizationName || 'BioPower Clean Fuels Ltd'} · Source circular biomass lots, track pending offers, and monitor supply fulfillment.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => onTabChange?.('marketplace')}
              className="shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              <span>Explore Marketplace Lots</span>
            </Button>
          </div>
          {/* Four Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Available Residue Lots */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E2EBE5] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Available Residue Lots
                </p>
                <h3 className="text-2xl font-black text-[#17483C] font-heading mt-1 tabular-nums">
                  {availableLotsCount} Lots
                </h3>
                <span className="text-[11px] text-[#088A1A] font-medium">Ready for procurement bids</span>
              </div>
              <div className="p-3 bg-[#E6EEF2] rounded-[6px] text-[#17483C]">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>

            {/* Card 2: Active Offers Submitted */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E2EBE5] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Active Offers Submitted
                </p>
                <h3 className="text-2xl font-black text-[#1D1160] font-heading mt-1 tabular-nums">
                  {offers.length} Offers
                </h3>
                <span className="text-[11px] text-[#317787]">Submitted by procurement</span>
              </div>
              <div className="p-3 bg-[#E6EEF2] rounded-[6px] text-[#1D1160]">
                <Send className="w-5 h-5" />
              </div>
            </div>

            {/* Card 3: Accepted Offers */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E2EBE5] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Accepted Offers
                </p>
                <h3 className="text-2xl font-black text-[#088A1A] font-heading mt-1 tabular-nums">
                  {acceptedBidsCount} Deals
                </h3>
                <span className="text-[11px] text-[#088A1A] font-medium">Queued for logistics hauling</span>
              </div>
              <div className="p-3 bg-[#E6EEF2] rounded-[6px] text-[#088A1A]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Card 4: Pending Offers */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E2EBE5] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Pending Offers
                </p>
                <h3 className="text-2xl font-black text-[#317787] font-heading mt-1 tabular-nums">
                  {activeBidsCount} Pending
                </h3>
                <span className="text-[11px] text-[#64748B]">Awaiting supplier decision</span>
              </div>
              <div className="p-3 bg-[#E6EEF2] rounded-[6px] text-[#317787]">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* AI Advisor Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1D1160] to-[#17483C] rounded-[8px] text-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EDD17E] text-[#1D1160] px-2 py-0.5 rounded-[4px]">
                  Procurement Intelligence
                </span>
                <span className="text-xs text-white/80 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#EDD17E]" />
                  Residue Matching & Circular Specifications
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading">
                Match Verified Agricultural Residues to Your Plant Requirements
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Filter by cellulose purity, moisture limits, and regional hauling radius. Source verified non-combustion feedstocks with transparent circularity certifications.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onTabChange?.('advisor')}
              className="shrink-0 bg-white hover:bg-[#EDD17E] text-[#1D1160] px-4 py-2.5 rounded-[6px] text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>Launch Material Advisor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recent Procurement Activity */}
          <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2EBE5] pb-2.5">
              <h3 className="text-sm font-bold text-[#1D1160] font-heading flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#317787]" />
                <span>Recent Procurement Feed</span>
              </h3>
              <span className="text-[11px] text-[#64748B]">Real-time exchange updates</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-[6px] bg-[#FBFDFB] border border-[#E2EBE5] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#8FBC8B]/20 text-[#088A1A] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-[#17483C]">Deal confirmed: 50 MT Rice straw</p>
                  <p className="text-[11px] text-[#64748B]">Kisan Agro Collective accepted offer of ₹2,300/MT.</p>
                </div>
              </div>

              <div className="p-3 rounded-[6px] bg-[#FBFDFB] border border-[#E2EBE5] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#E6EEF2] text-[#317787] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-[#1D1160]">Carrier dispatched for Patiala delivery</p>
                  <p className="text-[11px] text-[#64748B]">Multi-axle flatbed trailer staged for pickup in Sangrur.</p>
                </div>
              </div>

              <div className="p-3 rounded-[6px] bg-[#FBFDFB] border border-[#E2EBE5] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#EDD17E]/30 text-[#9E822E] flex items-center justify-center shrink-0 mt-0.5">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-[#17483C]">Reverse bid submitted for Sugarcane Bagasse</p>
                  <p className="text-[11px] text-[#64748B]">Offered ₹1,800/MT for 100 MT to Western Maharashtra Mills.</p>
                </div>
              </div>

              <div className="p-3 rounded-[6px] bg-[#FBFDFB] border border-[#E2EBE5] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#8FBC8B]/20 text-[#088A1A] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-[#17483C]">Low silica parboiled husk batch verified</p>
                  <p className="text-[11px] text-[#64748B]">New Karnal parcel matches gasifier boiler tolerances.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Split Section: Marketplace Highlights & Submitted Offers Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Marketplace Highlights */}
            <div className="bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE5]">
                <div>
                  <h3 className="text-sm font-bold text-[#17483C] font-heading">
                    Marketplace Highlights
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Fresh agricultural residue lots open for procurement bids.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onTabChange?.('marketplace')}
                  className="text-xs font-bold text-[#317787] hover:text-[#17483C] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Browse All ({listings.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {listings.slice(0, 3).map((lot) => (
                  <div
                    key={lot.id}
                    className="p-3 rounded-[6px] border border-[#E2EBE5] bg-[#FBFDFB] hover:border-[#8FBC8B] transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#17483C]">{lot.materialName}</div>
                      <div className="text-[11px] text-[#64748B]">
                        {lot.quantity} {lot.unit} · {lot.district}, {lot.state}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#17483C] font-heading">
                        ₹{lot.indicativePrice.toLocaleString('en-IN')}/{lot.unit}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenOfferModal(lot)}
                      >
                        Bid
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-[#E2EBE5]">
                <button
                  type="button"
                  onClick={() => onTabChange?.('marketplace')}
                  className="text-xs font-bold text-[#1D1160] hover:text-[#317787] flex items-center gap-1"
                >
                  <span>Open Full Residue Marketplace & Filters</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Recent Submitted Offers Summary */}
            <div className="bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE5]">
                <div>
                  <h3 className="text-sm font-bold text-[#1D1160] font-heading">
                    Submitted Procurement Bids
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Active reverse offers placed by your procurement desk.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onTabChange?.('offers')}
                  className="text-xs font-bold text-[#317787] hover:text-[#1D1160] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({offers.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {offers.length === 0 ? (
                <div className="text-center py-6 text-neutral-400 text-xs">
                  No bids submitted yet. Browse the marketplace to place an offer.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {offers.slice(0, 3).map((offer) => (
                    <div
                      key={offer.id}
                      className="p-3 rounded-[6px] border border-[#E2EBE5] bg-[#FBFDFB] hover:border-[#8FBC8B] transition-colors flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#17483C]">{offer.listingName}</div>
                        <div className="text-[11px] text-[#64748B]">
                          Rate: ₹{offer.offeredPrice.toLocaleString('en-IN')}/{offer.unit} · {offer.requestedQuantity} {offer.unit}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#088A1A] font-heading tabular-nums">
                          ₹{offer.totalGross.toLocaleString('en-IN')}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                            offer.status === 'Accepted'
                              ? 'bg-[#8FBC8B]/20 text-[#088A1A]'
                              : offer.status === 'Pending'
                              ? 'bg-[#EDD17E]/30 text-[#9E822E]'
                              : 'bg-[#FFF8F8] text-[#C5221F]'
                          }`}
                        >
                          {offer.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 flex justify-between items-center border-t border-[#E2EBE5]">
                <button
                  type="button"
                  onClick={() => onTabChange?.('offers')}
                  className="text-xs font-bold text-[#1D1160] hover:text-[#317787] flex items-center gap-1"
                >
                  <span>Manage All Submitted Offers & Tracking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: RESIDUE MARKETPLACE TAB
          ========================================================================= */}
      {activeTab === 'marketplace' && (
        <div className="space-y-5">
          {/* Marketplace Header */}
          <div className="bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#17483C] font-heading">
                Agricultural Residue Exchange Marketplace
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Discover verified agricultural residues listed by regional farm clusters and submit reverse procurement bids.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#317787] bg-[#E6EEF2] px-2.5 py-1 rounded-[4px] self-start md:self-auto">
              Live Shared Demo State
            </span>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by crop, straw, district..."
                className="w-full px-3 py-2 pl-9 rounded-[6px] border border-[#D5DFD9] text-xs text-[#1D1160]"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-xs text-[#1D1160]"
              >
                <option value="All">All Categories ({listings.length})</option>
                <option value="Cereal Straws">Cereal Straws</option>
                <option value="Agro-Industrial">Agro-Industrial Bagasse</option>
                <option value="Husks & Shells">Husks & Shells</option>
                <option value="Other">Other Materials</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-xs text-[#1D1160]"
              >
                <option value="All">All Regions</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-xs text-[#1D1160]"
              >
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="qtyDesc">Quantity: High to Low</option>
              </select>
            </div>
          </div>

          {/* Listings Cards Grid */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-12 text-center text-xs text-[#64748B] shadow-xs">
              No agricultural residues matched your search criteria. Try resetting filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredListings.map((lot) => (
                <div
                  key={lot.id}
                  className="bg-white p-5 rounded-[8px] border border-[#E2EBE5] flex flex-col justify-between hover:border-[#8FBC8B] hover:shadow-xs transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[10px] text-neutral-400 bg-[#F4F7F5] px-2 py-0.5 rounded-[4px] border border-[#E2EBE5]">
                        {lot.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] ${
                          lot.status === 'Active'
                            ? 'bg-[#8FBC8B]/20 text-[#088A1A]'
                            : lot.status === 'Under Offer'
                            ? 'bg-[#EDD17E]/30 text-[#9E822E]'
                            : 'bg-[#E6EEF2] text-[#317787]'
                        }`}
                      >
                        {lot.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#17483C] font-heading mb-0.5">
                      {lot.materialName}
                    </h3>
                    <p className="text-xs text-[#317787] font-medium mb-2">
                      {lot.category} · {lot.farmerName}
                    </p>

                    {/* Circular Impact Score Badge */}
                    {(() => {
                      const impact = calculateCircularImpactScore({
                        materialName: lot.materialName,
                        quantity: lot.quantity,
                        unit: lot.unit,
                        moistureSpec: lot.moistureSpec,
                        pathwayCategory: lot.category,
                      });
                      return (
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E2EBE5]">
                          <span className="text-[11px] text-[#64748B]">Circularity Score:</span>
                          <button
                            type="button"
                            onClick={() => setImpactModalLot(lot)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#8FBC8B]/20 hover:bg-[#8FBC8B]/35 text-[#088A1A] font-bold text-[11px] transition-colors cursor-pointer border border-[#8FBC8B]/30"
                            title="Click to view scientific mass-balance breakdown"
                          >
                            <Sparkles className="w-3 h-3 text-[#088A1A]" />
                            <span>{impact.totalScore}/100</span>
                          </button>
                        </div>
                      );
                    })()}

                    <div className="space-y-1.5 text-xs text-[#475569] mb-4">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Available Batch:</span>
                        <strong className="text-[#1D1160] tabular-nums font-heading">
                          {lot.quantity} {lot.unit}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Pickup Location:</span>
                        <span className="text-[#17483C] font-medium">{lot.district}, {lot.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Indicative Guide:</span>
                        <span className="text-[#17483C] font-bold font-heading tabular-nums">
                          ₹{lot.indicativePrice.toLocaleString('en-IN')}/{lot.unit}
                        </span>
                      </div>
                      <div className="pt-1 text-[11px] text-neutral-400">
                        Condition: <span className="text-neutral-600">{lot.moistureSpec}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E2EBE5] flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 justify-center"
                      icon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setInspectLot(lot)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 justify-center"
                      icon={<Send className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenOfferModal(lot)}
                    >
                      Submit Bid
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 4: MY SUBMITTED OFFERS TAB
          ========================================================================= */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="p-5 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#1D1160] font-heading">
                My Submitted Procurement Offers
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Real-time status tracking for reverse bids placed on farm residues. Updates dynamically when farmers accept or reject.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#1D1160] bg-[#E6EEF2] px-3 py-1.5 rounded-[6px]">
                {offers.length} Total Offers
              </span>
            </div>
          </div>

          {/* Stats Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-[8px] border border-[#E2EBE5] shadow-xs">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Pending Decisions
              </span>
              <span className="text-xl font-black text-[#317787] font-heading tabular-nums mt-1 block">
                {activeBidsCount} Bids
              </span>
            </div>

            <div className="bg-white p-4 rounded-[8px] border border-[#E2EBE5] shadow-xs">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Accepted Deals
              </span>
              <span className="text-xl font-black text-[#088A1A] font-heading tabular-nums mt-1 block">
                {acceptedBidsCount} Deals
              </span>
            </div>

            <div className="bg-white p-4 rounded-[8px] border border-[#E2EBE5] shadow-xs">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Total Committed Value
              </span>
              <span className="text-xl font-black text-[#17483C] font-heading tabular-nums mt-1 block">
                ₹{totalPurchasingGross.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-3 shadow-xs flex items-center gap-1.5 flex-wrap text-xs">
            {[
              { id: 'All', label: `All Offers (${offers.length})` },
              { id: 'Pending', label: `Pending (${activeBidsCount})` },
              { id: 'Accepted', label: `Accepted (${acceptedBidsCount})` },
              { id: 'Rejected', label: `Rejected (${rejectedBidsCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setOffersStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors cursor-pointer ${
                  offersStatusFilter === tab.id
                    ? 'bg-[#1D1160] text-white shadow-xs'
                    : 'bg-[#F4F7F5] text-[#475569] hover:bg-[#E6EEF2]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Offers List */}
          {filteredOffers.length === 0 ? (
            <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-12 text-center shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F4F7F5] text-[#64748B] flex items-center justify-center mx-auto">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1D1160] font-heading">
                No Offers Found
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                You haven't submitted any offers matching this filter. Explore the marketplace to place a bid on agricultural residues.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onTabChange?.('marketplace')}
                className="mt-2"
              >
                Go to Marketplace
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-[8px] border border-[#E2EBE5] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#317787] transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] text-neutral-500 bg-[#F4F7F5] px-2 py-0.5 rounded-[3px] border border-[#E2EBE5]">
                        {offer.id}
                      </span>
                      <strong className="text-sm font-bold text-[#17483C] font-heading">
                        {offer.listingName}
                      </strong>
                      <span className="text-xs text-neutral-500">Supplier: {offer.farmerName}</span>
                    </div>

                    <div className="text-xs text-[#475569] flex flex-wrap gap-x-4 gap-y-1 pt-1">
                      <span>
                        Offered Rate: <strong className="text-[#17483C] font-heading tabular-nums">₹{offer.offeredPrice.toLocaleString('en-IN')}/{offer.unit}</strong>
                      </span>
                      <span>
                        Requested: <strong className="text-[#17483C] tabular-nums">{offer.requestedQuantity} {offer.unit}</strong>
                      </span>
                      <span>
                        Total Gross Deal: <strong className="text-[#088A1A] font-heading font-black tabular-nums">₹{offer.totalGross.toLocaleString('en-IN')}</strong>
                      </span>
                      <span className="italic text-[#9E822E]">
                        Hauling: {offer.transportStatus}
                      </span>
                    </div>

                    {offer.message && (
                      <p className="text-[11px] text-neutral-500 pt-1 italic">
                        Message sent: "{offer.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                    <span
                      className={`px-3 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider ${
                        offer.status === 'Accepted'
                          ? 'bg-[#8FBC8B]/20 text-[#088A1A] border border-[#8FBC8B]'
                          : offer.status === 'Pending'
                          ? 'bg-[#EDD17E]/30 text-[#9E822E] border border-[#EDD17E]'
                          : offer.status === 'Rejected'
                          ? 'bg-[#FFF8F8] text-[#C5221F] border border-[#C5221F]/30'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {offer.status}
                    </span>

                    {offer.status === 'Pending' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => withdrawOffer(offer.id)}
                        className="text-xs text-neutral-500 hover:text-[#C5221F]"
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUBMIT REVERSE OFFER MODAL
          ========================================================================= */}
      {selectedLotForOffer && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLotForOffer(null)}
          title={`Submit Purchase Offer: ${selectedLotForOffer.materialName}`}
          subtitle={`Lot ID: ${selectedLotForOffer.id} · Farmer: ${selectedLotForOffer.farmerName}`}
        >
          {offerFeedback ? (
            <div className="p-4 bg-[#8FBC8B]/20 border border-[#8FBC8B] rounded-[6px] text-xs text-[#17483C] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#088A1A] shrink-0" />
              <span>{offerFeedback}</span>
            </div>
          ) : (
            <form onSubmit={handleOfferSubmit} className="space-y-4" noValidate>
              <div className="p-3 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Available Batch:</span>
                  <span className="font-bold text-[#1D1160] tabular-nums">
                    {selectedLotForOffer.quantity} {selectedLotForOffer.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Indicative Guide Price:</span>
                  <span className="font-bold text-[#17483C] font-heading tabular-nums">
                    ₹{selectedLotForOffer.indicativePrice.toLocaleString('en-IN')} / {selectedLotForOffer.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Pickup Location:</span>
                  <span className="text-neutral-700">{selectedLotForOffer.pickupLocation}, {selectedLotForOffer.state}</span>
                </div>
              </div>

              {offerErrors.form && (
                <p className="text-xs text-[#C5221F] font-medium">{offerErrors.form}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <FormField
                  label={`Offered Unit Price (₹ / ${selectedLotForOffer.unit})`}
                  id="offerPrice"
                  required
                  error={offerErrors.offerPrice}
                >
                  <input
                    id="offerPrice"
                    type="number"
                    min="1"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="e.g. 2350"
                    className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-sm text-[#1D1160]"
                  />
                </FormField>

                <FormField
                  label={`Requested Quantity (${selectedLotForOffer.unit})`}
                  id="requestedQuantity"
                  required
                  helperText={`Max: ${selectedLotForOffer.quantity} ${selectedLotForOffer.unit}`}
                  error={offerErrors.requestedQuantity}
                >
                  <input
                    id="requestedQuantity"
                    type="number"
                    min="1"
                    max={selectedLotForOffer.quantity}
                    value={requestedQuantity}
                    onChange={(e) => setRequestedQuantity(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-sm text-[#1D1160]"
                  />
                </FormField>
              </div>

              {/* Real-time calculated gross value */}
              {Number(offerPrice) > 0 && Number(requestedQuantity) > 0 && (
                <div className="p-3 bg-[#E6EEF2]/50 rounded-[6px] border border-[#317787]/20 flex items-center justify-between text-xs">
                  <span className="font-medium text-[#17483C]">Gross Bid Value:</span>
                  <span className="text-base font-black text-[#088A1A] font-heading tabular-nums">
                    ₹{(Number(offerPrice) * Number(requestedQuantity)).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <FormField
                label="Message or Special Logistics Requirements"
                id="buyerMessage"
                optional
                helperText="Specify unloading schedule, moisture tolerance, etc."
              >
                <textarea
                  id="buyerMessage"
                  rows={2}
                  value={buyerMessage}
                  onChange={(e) => setBuyerMessage(e.target.value)}
                  placeholder="e.g. Can stage carrier within 48 hours. Require standard weighbridge slip."
                  className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-xs text-[#1D1160]"
                />
              </FormField>

              <div className="pt-2 flex justify-end gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedLotForOffer(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Submit Offer to Farmer
                </Button>
              </div>

              <p className="text-[11px] text-neutral-400 italic pt-2">
                * Note: Offer is client-side demo state and instantly synchronizes with the Farmer's incoming bids review view.
              </p>
            </form>
          )}
        </Modal>
      )}

      {/* INSPECT LOT MODAL */}
      {inspectLot && (
        <Modal
          isOpen={true}
          onClose={() => setInspectLot(null)}
          title={`Residue Lot Inspection: ${inspectLot.materialName}`}
          subtitle={`Lot ID: ${inspectLot.id} · ${inspectLot.farmerName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Category:</span>
                <span className="font-semibold text-[#17483C]">{inspectLot.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Available Quantity:</span>
                <span className="font-bold text-[#1D1160] tabular-nums">{inspectLot.quantity} {inspectLot.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Indicative Price:</span>
                <span className="font-bold text-[#17483C] font-heading tabular-nums">
                  ₹{inspectLot.indicativePrice.toLocaleString('en-IN')}/{inspectLot.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Origin / Location:</span>
                <span className="text-neutral-700">{inspectLot.pickupLocation}, {inspectLot.district}, {inspectLot.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Moisture / Spec:</span>
                <span className="text-neutral-700">{inspectLot.moistureSpec}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#E2EBE5]">
                <span className="text-neutral-500">Circular Impact:</span>
                <button
                  type="button"
                  onClick={() => setImpactModalLot(inspectLot)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#8FBC8B]/20 hover:bg-[#8FBC8B]/35 text-[#088A1A] font-bold text-xs cursor-pointer border border-[#8FBC8B]/40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#088A1A]" />
                  <span>
                    {calculateCircularImpactScore({
                      materialName: inspectLot.materialName,
                      quantity: inspectLot.quantity,
                      unit: inspectLot.unit,
                      moistureSpec: inspectLot.moistureSpec,
                      pathwayCategory: inspectLot.category,
                    }).totalScore}/100 · View Breakdown
                  </span>
                </button>
              </div>
            </div>

            <div>
              <p className="font-bold text-[#17483C] mb-1">Lot Description & Context:</p>
              <p className="text-neutral-600 leading-relaxed bg-[#FBFDFB] p-3 rounded-[6px] border border-[#E2EBE5]">
                {inspectLot.description}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setInspectLot(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const target = inspectLot;
                  setInspectLot(null);
                  handleOpenOfferModal(target);
                }}
              >
                Place Bid on This Lot
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Circular Impact Breakdown Modal */}
      {impactModalLot && (
        <CircularImpactModal
          isOpen={true}
          onClose={() => setImpactModalLot(null)}
          lotData={{
            materialName: impactModalLot.materialName,
            quantity: impactModalLot.quantity,
            unit: impactModalLot.unit,
            moistureSpec: impactModalLot.moistureSpec,
            pathwayCategory: impactModalLot.category,
            location: `${impactModalLot.district}, ${impactModalLot.state}`,
          }}
        />
      )}

    </div>
  );
};

export default BuyerDashboard;
