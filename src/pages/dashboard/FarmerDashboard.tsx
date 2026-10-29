import React, { useState } from 'react';
import {
  FileText,
  ShoppingBag,
  Scale,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Check,
  X,
  MapPin,
  Tag,
  AlertCircle,
  Sparkles,
  Leaf,
  Filter,
  Search,
  Building2,
  ChevronRight,
  Inbox,
  TrendingUp,
  Download,
  Bell,
  Mail,
  Truck,
  Trash2,
  Send,
} from 'lucide-react';
import {
  useMarketplace,
  ResidueListing,
  BuyerOffer,
  getGreeting,
  FarmerAlertSetting,
  FarmerAlertNotification,
} from '../../services/api/marketplaceState';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FormField } from '../../components/common/FormField';
import { calculateCircularImpactScore } from '../../services/ai';
import { CircularImpactModal } from '../../components/common/CircularImpactModal';
import { AIAdvisorView } from './AIAdvisorView';

interface FarmerDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  activeTab = 'overview',
  onTabChange,
}) => {
  const {
    listings,
    offers,
    addListing,
    acceptOffer,
    rejectOffer,
    activeProfile,
    alertSettings,
    saveAlertSetting,
    deleteAlertSetting,
    alertNotifications,
    markAlertNotificationRead,
    clearAllAlertNotifications,
    triggerSimulatedAlert,
  } = useMarketplace();
  const greeting = getGreeting(activeProfile?.firstName);

  // Automated Alerts Modal State
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertWasteType, setAlertWasteType] = useState('Rice straw (Baled)');
  const [alertNotifyPurchased, setAlertNotifyPurchased] = useState(true);
  const [alertNotifyInTransit, setAlertNotifyInTransit] = useState(true);
  const [alertEmailEnabled, setAlertEmailEnabled] = useState(true);
  const [alertDashboardEnabled, setAlertDashboardEnabled] = useState(true);
  const [alertRecipientEmail, setAlertRecipientEmail] = useState(activeProfile?.email || 'priya.sharma@kisanagro.org');
  const [alertSaveFeedback, setAlertSaveFeedback] = useState<string | null>(null);

  // Create listing modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createFeedback, setCreateFeedback] = useState<string | null>(null);
  const [impactModalLot, setImpactModalLot] = useState<ResidueListing | null>(null);

  // Form State
  const [materialName, setMaterialName] = useState('Rice straw (Baled)');
  const [category, setCategory] = useState<'Cereal Straws' | 'Agro-Industrial' | 'Husks & Shells' | 'Other'>('Cereal Straws');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<'tonnes' | 'kg'>('tonnes');
  const [state, setState] = useState('Punjab');
  const [district, setDistrict] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [indicativePrice, setIndicativePrice] = useState('');
  const [moistureSpec, setMoistureSpec] = useState('< 14% Dry Baled');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter state for "My Residue Listings" tab
  const [listingsSearch, setListingsSearch] = useState('');
  const [listingsCategoryFilter, setListingsCategoryFilter] = useState('All');
  const [listingsStatusFilter, setListingsStatusFilter] = useState('All');

  // Filter state for "Incoming Bids" tab
  const [bidsStatusFilter, setBidsStatusFilter] = useState('All');
  const [bidsListingFilter, setBidsListingFilter] = useState('All');
  const [bidActionFeedback, setBidActionFeedback] = useState<string | null>(null);

  const handlePreFillFromAdvisor = (prefill: {
    materialName: string;
    category: 'Cereal Straws' | 'Agro-Industrial' | 'Husks & Shells' | 'Other';
    quantity: number;
    unit: 'tonnes' | 'kg';
    state: string;
    district: string;
    moistureSpec: string;
    indicativePrice: number;
    description: string;
  }) => {
    setMaterialName(prefill.materialName);
    setCategory(prefill.category);
    setQuantity(prefill.quantity.toString());
    setUnit(prefill.unit);
    setState(prefill.state);
    setDistrict(prefill.district);
    setPickupLocation(`Staging Yard, ${prefill.district}`);
    setIndicativePrice(prefill.indicativePrice.toString());
    setMoistureSpec(prefill.moistureSpec);
    setDescription(prefill.description);
    setCreateModalOpen(true);
  };

  const previewImpact = calculateCircularImpactScore({
    materialName: materialName || 'Agricultural Residue',
    quantity: Number(quantity) || 1,
    unit,
    moistureSpec,
  });

  // Summary Metrics calculations
  const activeListingsCount = listings.filter((l) => l.status === 'Active' || l.status === 'Under Offer').length;
  const totalTonnageListed = listings.reduce((acc, curr) => {
    return acc + (curr.unit === 'tonnes' ? curr.quantity : curr.quantity / 1000);
  }, 0);
  const totalBidsCount = offers.length;
  const pendingBidsCount = offers.filter((o) => o.status === 'Pending').length;
  const acceptedBidsCount = offers.filter((o) => o.status === 'Accepted').length;
  const completedListingsCount = listings.filter((l) => l.status === 'Completed').length;
  const totalAcceptedGross = offers
    .filter((o) => o.status === 'Accepted')
    .reduce((acc, curr) => acc + curr.totalGross, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!materialName.trim()) errs.materialName = 'Material name is required.';
    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      errs.quantity = 'Please enter a valid positive quantity.';
    }
    if (!district.trim()) errs.district = 'District is required.';
    if (!pickupLocation.trim()) errs.pickupLocation = 'Pickup location / staging point is required.';
    if (!indicativePrice.trim() || isNaN(Number(indicativePrice)) || Number(indicativePrice) <= 0) {
      errs.indicativePrice = 'Please enter an indicative asking price.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    addListing({
      farmerId: 'FARM-CURRENT',
      farmerName: 'Kisan Agro Collective (Current User)',
      materialName,
      category,
      quantity: Number(quantity),
      unit,
      state,
      district,
      pickupLocation,
      indicativePrice: Number(indicativePrice),
      moistureSpec,
      description: description || 'Fresh post-harvest crop residue ready for collection.',
    });

    setCreateFeedback('Listing created! Your lot is now published to the shared demo marketplace and open for buyer bids.');
    setTimeout(() => {
      setCreateModalOpen(false);
      setCreateFeedback(null);
      setQuantity('');
      setDistrict('');
      setPickupLocation('');
      setIndicativePrice('');
      setDescription('');
    }, 1500);
  };

  const handleAcceptBid = (bidId: string, buyerName: string) => {
    acceptOffer(bidId);
    setBidActionFeedback(`Accepted offer from ${buyerName}! A logistics dispatch request has been automatically generated in the hauling pool.`);
    setTimeout(() => setBidActionFeedback(null), 4000);
  };

  const handleRejectBid = (bidId: string, buyerName: string) => {
    rejectOffer(bidId);
    setBidActionFeedback(`Offer from ${buyerName} rejected.`);
    setTimeout(() => setBidActionFeedback(null), 3000);
  };

  // Filtered listings for 'listings' tab
  const filteredListings = listings.filter((lot) => {
    const matchSearch =
      lot.materialName.toLowerCase().includes(listingsSearch.toLowerCase()) ||
      lot.district.toLowerCase().includes(listingsSearch.toLowerCase()) ||
      lot.id.toLowerCase().includes(listingsSearch.toLowerCase());
    const matchCategory = listingsCategoryFilter === 'All' || lot.category === listingsCategoryFilter;
    const matchStatus = listingsStatusFilter === 'All' || lot.status === listingsStatusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  // Filtered bids for 'bids' tab
  const filteredBids = offers.filter((bid) => {
    const matchStatus = bidsStatusFilter === 'All' || bid.status === bidsStatusFilter;
    const matchListing = bidsListingFilter === 'All' || bid.listingId === bidsListingFilter;
    return matchStatus && matchListing;
  });

  // Export bids to CSV for bookkeeping & accounting tools
  const handleExportCSV = () => {
    const bidsToExport = filteredBids.length > 0 ? filteredBids : offers;
    const headers = [
      'Bid ID',
      'Target Lot ID',
      'Material Name',
      'Buyer Organization',
      'Buyer Type',
      'Offered Price (INR/unit)',
      'Requested Quantity',
      'Unit',
      'Total Gross Value (INR)',
      'Status',
      'Submission Date',
      'Logistics Dispatch Status',
      'Buyer Notes'
    ];

    const escapeField = (val: string | number | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const clean = String(val).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = bidsToExport.map((b) => [
      escapeField(b.id),
      escapeField(b.listingId),
      escapeField(b.listingName),
      escapeField(b.buyerName),
      escapeField(b.buyerType),
      b.offeredPrice,
      b.requestedQuantity,
      escapeField(b.unit),
      b.totalGross,
      escapeField(b.status),
      escapeField(b.submittedAt),
      escapeField(b.transportStatus),
      escapeField(b.message || '')
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `reroute_incoming_bids_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          VIEW 1: AI REUSE ADVISOR TAB
          ========================================================================= */}
      {activeTab === 'advisor' && (
        <AIAdvisorView
          onPreFillListing={handlePreFillFromAdvisor}
          onNavigateMarketplace={() => onTabChange?.('listings')}
        />
      )}

      {/* =========================================================================
          VIEW 2: DASHBOARD OVERVIEW TAB
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Personalised Greeting & Header Banner */}
          <div className="p-5 sm:p-6 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#317787] mb-1">
                <span>FARMER / GENERATOR PORTAL</span>
                <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
                <span>{activeProfile?.location?.city || 'Sangrur'}, {activeProfile?.location?.state || 'Punjab'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#17483C] font-heading">
                {greeting}
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                {activeProfile?.organizationName || 'Kisan Agro Collective'} · Manage your agricultural residue inventory, review buyer bids, and explore circular conversion.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setAlertModalOpen(true)}
                className="cursor-pointer border border-[#CCDCD2] bg-[#F4F7F5] hover:bg-white text-[#17483C] font-semibold flex items-center gap-2"
                title="Configure automated email and dashboard alerts for your listed waste types"
              >
                <Bell className="w-4 h-4 text-[#17483C]" />
                <span>Status Alerts</span>
                {alertNotifications.some((n) => !n.read) && (
                  <span className="w-2 h-2 rounded-full bg-[#088A1A] animate-pulse" />
                )}
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setCreateModalOpen(true)}
                className="cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>List New Residue Lot</span>
              </Button>
            </div>
          </div>

          {/* Live Automated Status Alerts Ribbon (Email & Dashboard) */}
          {alertNotifications.length > 0 && (
            <div className="p-4 bg-white rounded-[8px] border border-[#CCDCD2] shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2EBE5]">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-[4px] bg-[#E6EEF2] text-[#17483C]">
                    <Bell className="w-3.5 h-3.5 text-[#17483C]" />
                  </span>
                  <span className="text-xs font-bold text-[#17483C] uppercase tracking-wider">
                    Automated Residue Status Alerts
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    ({alertNotifications.filter((n) => !n.read).length} new updates)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAlertModalOpen(true)}
                    className="text-[11px] font-bold text-[#317787] hover:underline cursor-pointer"
                  >
                    Configure Alert Rules →
                  </button>
                  <span className="text-neutral-300">·</span>
                  <button
                    type="button"
                    onClick={clearAllAlertNotifications}
                    className="text-[11px] text-[#64748B] hover:text-[#C5221F] cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {alertNotifications.slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-[6px] border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
                      notif.read
                        ? 'bg-[#FBFDFB] border-[#E2EBE5] text-[#64748B]'
                        : 'bg-[#F4F7F5] border-[#8FBC8B] text-[#17483C]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'purchased' ? (
                          <div className="w-5 h-5 rounded-full bg-[#8FBC8B]/20 text-[#088A1A] flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#E6EEF2] text-[#317787] flex items-center justify-center">
                            <Truck className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="font-bold text-[#17483C]">{notif.title}</strong>
                          <span className="text-[10px] font-mono text-neutral-400">({notif.lotId})</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-[3px] text-[10px] font-bold uppercase tracking-wider ${
                              notif.type === 'purchased'
                                ? 'bg-[#8FBC8B]/20 text-[#088A1A]'
                                : 'bg-[#E6EEF2] text-[#317787]'
                            }`}
                          >
                            {notif.type === 'purchased' ? 'Marked Purchased' : 'In-Transit'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#475569] mt-0.5">{notif.message}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-[#64748B]">
                          <span>{notif.timestamp}</span>
                          {notif.deliveredEmail && (
                            <span className="flex items-center gap-1 text-[#088A1A]">
                              <Mail className="w-3 h-3" />
                              <span>Email alert dispatched to {notif.recipientEmail}</span>
                            </span>
                          )}
                          {notif.deliveredDashboard && (
                            <span className="flex items-center gap-1 text-[#317787]">
                              <Bell className="w-3 h-3" />
                              <span>Logged to dashboard</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {!notif.read && (
                      <button
                        type="button"
                        onClick={() => markAlertNotificationRead(notif.id)}
                        className="self-end sm:self-center px-2 py-1 bg-white hover:bg-[#EAE4D6] text-[#17483C] border border-[#CCDCD2] rounded-[4px] text-[10px] font-bold shrink-0 cursor-pointer"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Four Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Active Listings */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E2EBE5] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Active Listings
                </p>
                <h3 className="text-2xl font-black text-[#17483C] font-heading mt-1 tabular-nums">
                  {activeListingsCount} Lots
                </h3>
                <span className="text-[11px] text-[#088A1A] font-medium">Open for buyer offers</span>
              </div>
              <div className="p-3 bg-[#E6EEF2] rounded-[6px] text-[#17483C]">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            {/* Card 2: Total Quantity Listed */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E2EBE5] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Total Listed Biomass
                </p>
                <h3 className="text-2xl font-black text-[#1D1160] font-heading mt-1 tabular-nums">
                  {totalTonnageListed.toLocaleString('en-IN')} MT
                </h3>
                <span className="text-[11px] text-[#64748B]">Across all active parcels</span>
              </div>
              <div className="p-3 bg-[#E6EEF2] rounded-[6px] text-[#1D1160]">
                <Scale className="w-5 h-5" />
              </div>
            </div>

            {/* Card 3: Incoming Bids */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E2EBE5] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Incoming Reverse Bids
                </p>
                <h3 className="text-2xl font-black text-[#317787] font-heading mt-1 tabular-nums">
                  {totalBidsCount} Bids
                </h3>
                <span className="text-[11px] text-[#317787] font-medium">
                  {pendingBidsCount} pending farmer review
                </span>
              </div>
              <div className="p-3 bg-[#E6EEF2] rounded-[6px] text-[#317787]">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>

            {/* Card 4: Completed Exchanges */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E2EBE5] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Completed Exchanges
                </p>
                <h3 className="text-2xl font-black text-[#088A1A] font-heading mt-1 tabular-nums">
                  {completedListingsCount} Deals
                </h3>
                <span className="text-[11px] text-[#64748B]">Dispatched to buyers</span>
              </div>
              <div className="p-3 bg-[#E6EEF2] rounded-[6px] text-[#088A1A]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* AI Reuse Advisor Launcher Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#17483C] to-[#1D1160] rounded-[8px] text-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EDD17E] text-[#17483C] px-2 py-0.5 rounded-[4px]">
                  AI Advisory
                </span>
                <span className="text-xs text-white/80 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#EDD17E]" />
                  Lignocellulosic Matching & Circular Impact
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading">
                Explore High-Value Non-Combustion Pathways for Your Residues
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Match paddy straw, bagasse, or hulls to certified industrial off-takers. Predict Circular Impact Scores and pre-fill listing specifications in one click.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onTabChange?.('advisor')}
              className="shrink-0 bg-white hover:bg-[#EDD17E] text-[#17483C] px-4 py-2.5 rounded-[6px] text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>Launch AI Advisor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2EBE5] pb-2.5">
              <h3 className="text-sm font-bold text-[#17483C] font-heading flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#317787]" />
                <span>Concise Recent Activity</span>
              </h3>
              <span className="text-[11px] text-[#64748B]">Updated live in session</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-[6px] bg-[#FBFDFB] border border-[#E2EBE5] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#8FBC8B]/20 text-[#088A1A] flex items-center justify-center shrink-0 mt-0.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-[#17483C]">Reverse bid submitted by BioPower Clean Fuels</p>
                  <p className="text-[11px] text-[#64748B]">Offered ₹2,300/MT for 50 MT Rice straw (LOT-RS-101).</p>
                </div>
              </div>

              <div className="p-3 rounded-[6px] bg-[#FBFDFB] border border-[#E2EBE5] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#8FBC8B]/20 text-[#088A1A] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-[#17483C]">Circular Impact Certified (88/100 · Grade A)</p>
                  <p className="text-[11px] text-[#64748B]">Dry baled paddy straw verified for molded fiber packaging.</p>
                </div>
              </div>

              <div className="p-3 rounded-[6px] bg-[#FBFDFB] border border-[#E2EBE5] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#E6EEF2] text-[#317787] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-[#1D1160]">Hauling scheduled for Sunam Tehsil Yard</p>
                  <p className="text-[11px] text-[#64748B]">Kisan Rural Freight Carrier dispatched 25 MT vehicle.</p>
                </div>
              </div>

              <div className="p-3 rounded-[6px] bg-[#FBFDFB] border border-[#E2EBE5] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#EDD17E]/30 text-[#9E822E] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-[#17483C]">New lot listed: Groundnut Shells (Crushed)</p>
                  <p className="text-[11px] text-[#64748B]">25 tonnes published to Gujarat regional buyer pool.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Split Summary: Current Listings Overview & Incoming Bids Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Small Summary of Current Listings */}
            <div className="bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE5]">
                <div>
                  <h3 className="text-sm font-bold text-[#17483C] font-heading">
                    Current Residue Listings
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Active biomass lots visible to verified industrial buyers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onTabChange?.('listings')}
                  className="text-xs font-bold text-[#317787] hover:text-[#17483C] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({listings.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {listings.slice(0, 3).map((lot) => {
                  const impact = calculateCircularImpactScore({
                    materialName: lot.materialName,
                    quantity: lot.quantity,
                    unit: lot.unit,
                    moistureSpec: lot.moistureSpec,
                  });

                  return (
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
                        <span
                          className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
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
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-[#E2EBE5]">
                <Button
                  variant="forest"
                  size="sm"
                  onClick={() => setCreateModalOpen(true)}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Create New Listing
                </Button>
                <button
                  type="button"
                  onClick={() => onTabChange?.('listings')}
                  className="text-xs font-semibold text-[#17483C] hover:underline"
                >
                  Manage inventory & details →
                </button>
              </div>
            </div>

            {/* Small Summary of Incoming Bids */}
            <div className="bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE5]">
                <div>
                  <h3 className="text-sm font-bold text-[#17483C] font-heading">
                    Pending Incoming Bids
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Reverse procurement offers awaiting farmer decision.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onTabChange?.('bids')}
                  className="text-xs font-bold text-[#317787] hover:text-[#17483C] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({offers.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {offers.length === 0 ? (
                <div className="text-center py-6 text-neutral-400 text-xs">
                  No bids currently received.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {offers.slice(0, 3).map((bid) => (
                    <div
                      key={bid.id}
                      className="p-3 rounded-[6px] border border-[#E2EBE5] bg-[#FBFDFB] hover:border-[#8FBC8B] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#1D1160] flex items-center gap-1.5">
                          <span>{bid.buyerName}</span>
                          <span className="text-[10px] font-mono text-neutral-400">({bid.id})</span>
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          Target: <strong className="text-[#17483C]">{bid.listingName}</strong> · Rate: ₹{bid.offeredPrice.toLocaleString('en-IN')}/{bid.unit}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="font-extrabold text-[#088A1A] font-heading tabular-nums">
                          ₹{bid.totalGross.toLocaleString('en-IN')}
                        </span>
                        {bid.status === 'Pending' ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleAcceptBid(bid.id, bid.buyerName)}
                              className="px-2 py-1 bg-[#17483C] hover:bg-[#12382F] text-white rounded-[4px] text-[11px] font-bold cursor-pointer"
                              title="Accept offer"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectBid(bid.id, bid.buyerName)}
                              className="px-2 py-1 bg-white hover:bg-[#FFF8F8] text-[#C5221F] border border-[#C5221F]/30 rounded-[4px] text-[11px] font-bold cursor-pointer"
                              title="Reject offer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                              bid.status === 'Accepted'
                                ? 'bg-[#8FBC8B]/20 text-[#088A1A]'
                                : 'bg-[#FFF8F8] text-[#C5221F]'
                            }`}
                          >
                            {bid.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 flex justify-between items-center border-t border-[#E2EBE5]">
                <button
                  type="button"
                  onClick={() => onTabChange?.('bids')}
                  className="text-xs font-bold text-[#17483C] hover:text-[#317787] flex items-center gap-1"
                >
                  <span>Open Full Bids Review & Negotiation Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: MY RESIDUE LISTINGS TAB
          ========================================================================= */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="p-5 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#17483C] font-heading">
                My Residue Listings & Inventory
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Manage harvested crop residues, monitor Circular Impact Scores, and publish new lots to the marketplace.
              </p>
            </div>
            <Button
              variant="forest"
              size="md"
              onClick={() => setCreateModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
              className="shrink-0"
            >
              Create New Residue Listing
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="relative">
              <input
                type="text"
                value={listingsSearch}
                onChange={(e) => setListingsSearch(e.target.value)}
                placeholder="Search residue name, lot ID, district..."
                className="w-full px-3 py-2 pl-9 rounded-[6px] border border-[#D5DFD9] text-xs text-[#1D1160]"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            <div>
              <select
                value={listingsCategoryFilter}
                onChange={(e) => setListingsCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-xs text-[#1D1160]"
              >
                <option value="All">All Categories ({listings.length})</option>
                <option value="Cereal Straws">Cereal Straws</option>
                <option value="Agro-Industrial">Agro-Industrial</option>
                <option value="Husks & Shells">Husks & Shells</option>
                <option value="Other">Other Materials</option>
              </select>
            </div>

            <div>
              <select
                value={listingsStatusFilter}
                onChange={(e) => setListingsStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-xs text-[#1D1160]"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active (Open)</option>
                <option value="Under Offer">Under Offer</option>
                <option value="Completed">Completed / Dispatched</option>
              </select>
            </div>
          </div>

          {/* Full Listings Table */}
          <div className="bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE5]">
              <div>
                <h3 className="text-sm font-bold text-[#17483C] font-heading">
                  Residue Lots ({filteredListings.length} of {listings.length})
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Click on Circular Impact scores to inspect the transparent scientific mass-balance breakdown.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#317787] bg-[#E6EEF2] px-2.5 py-1 rounded-[4px]">
                Demo Farm State
              </span>
            </div>

            {filteredListings.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 text-xs">
                No residue listings match your filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[700px] lg:min-w-full">
                  <thead>
                    <tr className="border-b border-[#E2EBE5] bg-[#F4F7F5] text-neutral-600 font-semibold">
                      <th className="py-2.5 px-3">Lot ID & Material</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Available Quantity</th>
                      <th className="py-2.5 px-3">Pickup Location</th>
                      <th className="py-2.5 px-3">Asking Price</th>
                      <th className="py-2.5 px-3">Circular Impact</th>
                      <th className="py-2.5 px-3">Bids</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2EBE5]">
                    {filteredListings.map((lot) => {
                      const impact = calculateCircularImpactScore({
                        materialName: lot.materialName,
                        quantity: lot.quantity,
                        unit: lot.unit,
                        moistureSpec: lot.moistureSpec,
                      });

                      return (
                        <tr key={lot.id} className="hover:bg-[#FBFDFB] transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-[#17483C] font-heading">{lot.materialName}</div>
                            <div className="text-[10px] font-mono text-neutral-400">{lot.id} · {lot.createdAt}</div>
                          </td>
                          <td className="py-3 px-3 text-[#317787] font-medium">
                            {lot.category}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#1D1160] tabular-nums">
                              {lot.quantity} {lot.unit}
                            </span>
                            <span className="block text-[10px] text-neutral-400">{lot.moistureSpec}</span>
                          </td>
                          <td className="py-3 px-3 text-[#334155]">
                            <div>{lot.district}, {lot.state}</div>
                            <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">{lot.pickupLocation}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#17483C] tabular-nums font-heading">
                              ₹{lot.indicativePrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-neutral-500"> / {lot.unit}</span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              type="button"
                              onClick={() => setImpactModalLot(lot)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#8FBC8B]/20 hover:bg-[#8FBC8B]/35 text-[#088A1A] font-bold text-xs transition-colors cursor-pointer border border-[#8FBC8B]/40"
                              title="Click to view full circular impact breakdown"
                            >
                              <Sparkles className="w-3 h-3 text-[#088A1A]" />
                              <span>{impact.totalScore}/100</span>
                            </button>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              type="button"
                              onClick={() => {
                                setBidsListingFilter(lot.id);
                                onTabChange?.('bids');
                              }}
                              className={`inline-flex items-center gap-1 font-bold hover:underline cursor-pointer ${
                                lot.bidsCount > 0 ? 'text-[#088A1A]' : 'text-neutral-400'
                              }`}
                              title="Click to inspect bids for this lot"
                            >
                              {lot.bidsCount} Bids →
                            </button>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                                lot.status === 'Active'
                                  ? 'bg-[#8FBC8B]/20 text-[#088A1A]'
                                  : lot.status === 'Under Offer'
                                  ? 'bg-[#EDD17E]/30 text-[#9E822E]'
                                  : 'bg-[#E6EEF2] text-[#317787]'
                              }`}
                            >
                              {lot.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: INCOMING BIDS TAB (DEDICATED BID MANAGEMENT)
          ========================================================================= */}
      {activeTab === 'bids' && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="p-5 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#17483C] font-heading">
                Incoming Buyer Reverse Bids
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Review transparent procurement offers submitted by verified industrial off-takers. Accept or reject offers to advance the exchange.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportCSV}
                icon={<Download className="w-3.5 h-3.5" />}
                className="cursor-pointer"
                title="Export current bids as CSV for external accounting tools"
              >
                Export Bids (CSV)
              </Button>
              <span className="text-xs font-semibold text-[#17483C] bg-[#8FBC8B]/20 px-3 py-1.5 rounded-[6px] border border-[#8FBC8B]/40">
                {pendingBidsCount} Action Required
              </span>
            </div>
          </div>

          {/* Feedback banner if bid accepted/rejected */}
          {bidActionFeedback && (
            <div className="p-4 bg-[#8FBC8B]/20 border border-[#8FBC8B] rounded-[6px] text-xs text-[#17483C] flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-[#088A1A] shrink-0" />
              <span className="font-medium">{bidActionFeedback}</span>
            </div>
          )}

          {/* Stats Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-[8px] border border-[#E2EBE5] shadow-xs">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Total Bids Received
              </span>
              <span className="text-xl font-black text-[#17483C] font-heading tabular-nums mt-1 block">
                {offers.length} Offers
              </span>
            </div>

            <div className="bg-white p-4 rounded-[8px] border border-[#E2EBE5] shadow-xs">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Pending Farmer Decision
              </span>
              <span className="text-xl font-black text-[#317787] font-heading tabular-nums mt-1 block">
                {pendingBidsCount} Pending
              </span>
            </div>

            <div className="bg-white p-4 rounded-[8px] border border-[#E2EBE5] shadow-xs">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Total Contracted Value
              </span>
              <span className="text-xl font-black text-[#088A1A] font-heading tabular-nums mt-1 block">
                ₹{totalAcceptedGross.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Filters Bar: Status & Specific Lot */}
          <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
              {[
                { id: 'All', label: `All (${offers.length})` },
                { id: 'Pending', label: `Pending (${pendingBidsCount})` },
                { id: 'Accepted', label: `Accepted (${acceptedBidsCount})` },
                { id: 'Rejected', label: `Rejected (${offers.filter(o => o.status === 'Rejected').length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBidsStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors cursor-pointer ${
                    bidsStatusFilter === tab.id
                      ? 'bg-[#17483C] text-white shadow-xs'
                      : 'bg-[#F4F7F5] text-[#475569] hover:bg-[#E6EEF2]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filter by Target Listing */}
            <div className="w-full sm:w-64">
              <select
                value={bidsListingFilter}
                onChange={(e) => setBidsListingFilter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-[6px] border border-[#D5DFD9] bg-white text-xs text-[#1D1160]"
              >
                <option value="All">All Residue Lots</option>
                {listings.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.materialName} ({l.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bids List */}
          {filteredBids.length === 0 ? (
            <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-12 text-center shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F4F7F5] text-[#64748B] flex items-center justify-center mx-auto">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#17483C] font-heading">
                No Bids Found
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                No reverse bids match the selected status or listing filter. When industrial buyers place offers on your published lots, they will appear here for your review.
              </p>
              {bidsStatusFilter !== 'All' || bidsListingFilter !== 'All' ? (
                <button
                  type="button"
                  onClick={() => {
                    setBidsStatusFilter('All');
                    setBidsListingFilter('All');
                  }}
                  className="text-xs font-bold text-[#17483C] underline cursor-pointer pt-2"
                >
                  Reset all bid filters
                </button>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBids.map((bid) => (
                <div
                  key={bid.id}
                  className="bg-white rounded-[8px] border border-[#E2EBE5] p-5 shadow-xs hover:border-[#8FBC8B] transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2EBE5]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] text-neutral-500 bg-[#F4F7F5] px-2 py-0.5 rounded-[4px] border border-[#E2EBE5]">
                        {bid.id}
                      </span>
                      <strong className="text-sm font-bold text-[#1D1160] font-heading">
                        {bid.buyerName}
                      </strong>
                      <span className="text-xs text-[#317787] font-medium">({bid.buyerType})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#64748B]">Submitted {bid.submittedAt}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                          bid.status === 'Accepted'
                            ? 'bg-[#8FBC8B]/20 text-[#088A1A] border border-[#8FBC8B]'
                            : bid.status === 'Pending'
                            ? 'bg-[#EDD17E]/30 text-[#9E822E] border border-[#EDD17E]'
                            : 'bg-[#FFF8F8] text-[#C5221F] border border-[#C5221F]/30'
                        }`}
                      >
                        {bid.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-500 block">Target Lot:</span>
                      <strong className="text-[#17483C] text-sm font-heading">{bid.listingName}</strong>
                      <span className="text-[10px] font-mono text-neutral-400 block">{bid.listingId}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 block">Requested Volume:</span>
                      <strong className="text-[#1D1160] text-sm tabular-nums font-heading">
                        {bid.requestedQuantity} {bid.unit}
                      </strong>
                    </div>

                    <div>
                      <span className="text-neutral-500 block">Offered Unit Rate:</span>
                      <strong className="text-[#17483C] text-sm font-heading tabular-nums">
                        ₹{bid.offeredPrice.toLocaleString('en-IN')}/{bid.unit}
                      </strong>
                    </div>

                    <div>
                      <span className="text-neutral-500 block">Total Gross Deal Value:</span>
                      <strong className="text-[#088A1A] text-base font-black font-heading tabular-nums">
                        ₹{bid.totalGross.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {bid.message && (
                    <div className="p-3 rounded-[6px] bg-[#FBFDFB] border border-[#E2EBE5] text-xs text-[#475569]">
                      <span className="font-semibold text-[#17483C]">Buyer Procurement Note: </span>
                      <span className="italic">"{bid.message}"</span>
                    </div>
                  )}

                  {/* Action Buttons for Pending or Status details */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E2EBE5]">
                    <div className="text-[11px] text-[#64748B]">
                      {bid.status === 'Accepted' && (
                        <span className="text-[#088A1A] font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Accepted deal queued for carrier dispatch in the logistics pool.
                        </span>
                      )}
                      {bid.status === 'Pending' && (
                        <span>Accepting this offer confirms the transaction and allocates hauling.</span>
                      )}
                      {bid.status === 'Rejected' && (
                        <span>Offer declined. The buyer may submit a revised proposal.</span>
                      )}
                    </div>

                    {bid.status === 'Pending' && (
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRejectBid(bid.id, bid.buyerName)}
                          icon={<X className="w-3.5 h-3.5" />}
                          className="text-[#C5221F] hover:bg-[#FFF8F8] border-[#C5221F]/30"
                        >
                          Reject Offer
                        </Button>
                        <Button
                          variant="forest"
                          size="sm"
                          onClick={() => handleAcceptBid(bid.id, bid.buyerName)}
                          icon={<Check className="w-3.5 h-3.5" />}
                        >
                          Accept Offer
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          CREATE NEW LISTING MODAL
          ========================================================================= */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Agricultural Residue Listing"
        subtitle="Farmer Exchange Inventory"
      >
        {createFeedback ? (
          <div className="p-4 bg-[#8FBC8B]/20 border border-[#8FBC8B] rounded-[6px] text-xs text-[#17483C] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#088A1A] shrink-0" />
            <span>{createFeedback}</span>
          </div>
        ) : (
          <form onSubmit={handleCreateSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormField
                label="Material Type / Name"
                id="materialName"
                required
                error={errors.materialName}
              >
                <input
                  id="materialName"
                  type="text"
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  placeholder="e.g. Rice straw (Baled), Wheat straw"
                  className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-sm text-[#1D1160]"
                />
              </FormField>

              <FormField label="Material Category" id="category" required>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                >
                  <option value="Cereal Straws">Cereal Straws</option>
                  <option value="Agro-Industrial">Agro-Industrial</option>
                  <option value="Husks & Shells">Husks & Shells</option>
                  <option value="Other">Other</option>
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormField
                label="Available Quantity"
                id="quantity"
                required
                error={errors.quantity}
              >
                <div className="flex gap-2">
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 50"
                    className="flex-1 px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-sm text-[#1D1160]"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160] shrink-0"
                  >
                    <option value="tonnes">Tonnes (MT)</option>
                    <option value="kg">Kilograms (kg)</option>
                  </select>
                </div>
              </FormField>

              <FormField
                label="Indicative Asking Price (₹ per unit)"
                id="indicativePrice"
                required
                error={errors.indicativePrice}
              >
                <input
                  id="indicativePrice"
                  type="number"
                  min="1"
                  value={indicativePrice}
                  onChange={(e) => setIndicativePrice(e.target.value)}
                  placeholder="e.g. 2200 per tonne"
                  className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-sm text-[#1D1160]"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormField label="State" id="state" required>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Other">Other State</option>
                </select>
              </FormField>

              <FormField
                label="District"
                id="district"
                required
                error={errors.district}
              >
                <input
                  id="district"
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Sangrur or Ludhiana"
                  className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-sm text-[#1D1160]"
                />
              </FormField>
            </div>

            <FormField
              label="Village / Pickup Location"
              id="pickupLocation"
              required
              helperText="Exact staging yard accessible to carriers"
              error={errors.pickupLocation}
            >
              <input
                id="pickupLocation"
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g. Sunam Tehsil, Staging Area 3, Pin 148028"
                className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-sm text-[#1D1160]"
              />
            </FormField>

            <FormField
              label="Moisture & Condition Description"
              id="moistureSpec"
              helperText="Helps buyers determine suitability"
            >
              <input
                id="moistureSpec"
                type="text"
                value={moistureSpec}
                onChange={(e) => setMoistureSpec(e.target.value)}
                placeholder="e.g. < 14% Dry Machine Baled, Low silica"
                className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-sm text-[#1D1160]"
              />
            </FormField>

            {/* Live Circular Impact Preview in Modal */}
            <div className="p-3 bg-[#F4F7F5] rounded-[6px] border border-[#CCDCD2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[4px] bg-[#8FBC8B]/20 text-[#088A1A] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#17483C]">Predicted Circular Impact:</span>
                  <span className="block text-[10px] text-[#64748B]">
                    Deterministic score based on {category} & moisture spec
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-[#088A1A]">{previewImpact.totalScore}/100</span>
                <span className="block text-[10px] font-bold text-[#17483C]">{previewImpact.grade}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="forest"
                size="sm"
              >
                Publish to Demo Marketplace
              </Button>
            </div>

            <p className="text-[11px] text-neutral-400 italic pt-2">
              * Note: Listing exists only in the current demo session and is immediately visible to buyers in the shared marketplace.
            </p>
          </form>
        )}
      </Modal>

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

      {/* Automated Status Alerts Setup Modal */}
      <Modal
        isOpen={alertModalOpen}
        onClose={() => {
          setAlertModalOpen(false);
          setAlertSaveFeedback(null);
        }}
        title="Automated Status Alerts for Residue Lots"
        subtitle="Notification Preferences"
      >
        <div className="space-y-5 text-xs">
          <p className="text-[#475569] leading-relaxed">
            Configure automated alerts so you are notified immediately when a buyer marks your listed agricultural waste as <strong>Purchased</strong> or when a logistics partner marks it as <strong>In-Transit</strong>.
          </p>

          {alertSaveFeedback && (
            <div className="p-3 bg-[#8FBC8B]/20 border border-[#8FBC8B] rounded-[6px] text-xs text-[#17483C] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#088A1A] shrink-0" />
              <span>{alertSaveFeedback}</span>
            </div>
          )}

          {/* Create / Update Rule Form */}
          <div className="p-4 bg-[#F4F7F5] rounded-[8px] border border-[#CCDCD2] space-y-3.5">
            <h4 className="font-bold text-[#17483C] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[#088A1A]" />
              <span>Set Up New Status Alert Trigger</span>
            </h4>

            {/* Waste Type Selector */}
            <FormField
              label="Select Residue Waste Type"
              id="alertWasteType"
              helperText="Target specific crop residues or monitor all lots simultaneously"
            >
              <select
                id="alertWasteType"
                value={alertWasteType}
                onChange={(e) => setAlertWasteType(e.target.value)}
                className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-xs text-[#1D1160]"
              >
                <option value="Rice straw (Baled)">Rice straw (Baled)</option>
                <option value="Wheat straw">Wheat straw</option>
                <option value="Sugarcane bagasse">Sugarcane bagasse</option>
                <option value="Cotton stalk">Cotton stalk</option>
                <option value="Groundnut shells">Groundnut shells</option>
                <option value="Mustard husk">Mustard husk</option>
                <option value="All Waste Types">All Waste Types (Global Rule)</option>
              </select>
            </FormField>

            {/* Event Triggers */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#17483C]">
                Trigger Alert When Marked As:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2.5 rounded-[6px] bg-white border border-[#D5DFD9] cursor-pointer hover:border-[#8FBC8B]">
                  <input
                    type="checkbox"
                    checked={alertNotifyPurchased}
                    onChange={(e) => setAlertNotifyPurchased(e.target.checked)}
                    className="rounded text-[#17483C] focus:ring-[#17483C]"
                  />
                  <div>
                    <span className="font-bold text-[#17483C] block">Marked as 'Purchased'</span>
                    <span className="text-[10px] text-[#64748B]">Buyer procurement accepted</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-[6px] bg-white border border-[#D5DFD9] cursor-pointer hover:border-[#8FBC8B]">
                  <input
                    type="checkbox"
                    checked={alertNotifyInTransit}
                    onChange={(e) => setAlertNotifyInTransit(e.target.checked)}
                    className="rounded text-[#17483C] focus:ring-[#17483C]"
                  />
                  <div>
                    <span className="font-bold text-[#17483C] block">Marked as 'In-Transit'</span>
                    <span className="text-[10px] text-[#64748B]">Logistics partner hauling dispatched</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Delivery Channels */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#17483C]">
                Notification Delivery Channels:
              </label>
              <div className="space-y-2">
                <label className="flex items-start gap-2 p-2.5 rounded-[6px] bg-white border border-[#D5DFD9] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertEmailEnabled}
                    onChange={(e) => setAlertEmailEnabled(e.target.checked)}
                    className="mt-0.5 rounded text-[#17483C] focus:ring-[#17483C]"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-[#17483C] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#317787]" />
                      <span>Send Automated Email Alert</span>
                    </span>
                    <p className="text-[10px] text-[#64748B] mt-0.5">
                      Dispatches immediate email receipt with buyer/carrier payload details.
                    </p>
                    {alertEmailEnabled && (
                      <input
                        type="email"
                        value={alertRecipientEmail}
                        onChange={(e) => setAlertRecipientEmail(e.target.value)}
                        placeholder="e.g. farmer@kisanagro.org"
                        className="mt-2 w-full px-2.5 py-1.5 rounded-[4px] border border-[#D5DFD9] text-xs bg-[#FBFDFB]"
                      />
                    )}
                  </div>
                </label>

                <label className="flex items-start gap-2 p-2.5 rounded-[6px] bg-white border border-[#D5DFD9] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertDashboardEnabled}
                    onChange={(e) => setAlertDashboardEnabled(e.target.checked)}
                    className="mt-0.5 rounded text-[#17483C] focus:ring-[#17483C]"
                  />
                  <div>
                    <span className="font-bold text-[#17483C] flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-[#088A1A]" />
                      <span>Dashboard In-App Alert & Badge</span>
                    </span>
                    <p className="text-[10px] text-[#64748B] mt-0.5">
                      Displays status indicator ribbon and top notification badge in the Farmer Portal.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <Button
                variant="forest"
                size="sm"
                onClick={() => {
                  saveAlertSetting({
                    wasteType: alertWasteType,
                    notifyOnPurchased: alertNotifyPurchased,
                    notifyOnInTransit: alertNotifyInTransit,
                    emailEnabled: alertEmailEnabled,
                    dashboardEnabled: alertDashboardEnabled,
                    recipientEmail: alertRecipientEmail,
                    enabled: true,
                  });
                  setAlertSaveFeedback(`Alert rule saved for ${alertWasteType}! Automated alerts are now active.`);
                  setTimeout(() => setAlertSaveFeedback(null), 3500);
                }}
              >
                Save Alert Rule
              </Button>
            </div>
          </div>

          {/* Configured Alert Rules List */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#17483C] text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Configured Alert Rules ({alertSettings.length})</span>
            </h4>

            {alertSettings.length === 0 ? (
              <p className="text-neutral-400 italic text-center py-2">No active alert rules configured.</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {alertSettings.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-2.5 rounded-[6px] border border-[#E2EBE5] bg-white flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-[#17483C] font-semibold">{rule.wasteType}</strong>
                        <span className="text-[10px] font-mono text-neutral-400">({rule.id})</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#64748B] mt-0.5 flex-wrap">
                        {rule.notifyOnPurchased && <span>· On Purchased</span>}
                        {rule.notifyOnInTransit && <span>· On In-Transit</span>}
                        {rule.emailEnabled && (
                          <span className="text-[#088A1A] font-medium">· Email: {rule.recipientEmail}</span>
                        )}
                        {rule.dashboardEnabled && <span className="text-[#317787]">· In-App</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          saveAlertSetting({
                            ...rule,
                            enabled: !rule.enabled,
                          });
                        }}
                        className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold cursor-pointer ${
                          rule.enabled
                            ? 'bg-[#8FBC8B]/20 text-[#088A1A]'
                            : 'bg-neutral-100 text-neutral-400'
                        }`}
                      >
                        {rule.enabled ? 'Active' : 'Paused'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteAlertSetting(rule.id)}
                        className="p-1 text-neutral-400 hover:text-[#C5221F] rounded cursor-pointer"
                        title="Remove alert rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test Simulation Controls */}
          <div className="p-3 bg-[#E6EEF2]/50 rounded-[6px] border border-[#CCDCD2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div>
              <span className="font-bold text-[#17483C] block">Instant Simulation & Test</span>
              <span className="text-[10px] text-[#64748B]">
                Verify email dispatch and dashboard logging in real time.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  triggerSimulatedAlert(alertWasteType, 'purchased');
                  setAlertSaveFeedback(`Test 'Purchased' alert generated for ${alertWasteType}. Dispatched to ${alertRecipientEmail}.`);
                }}
                className="text-[11px]"
              >
                Test 'Purchased'
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  triggerSimulatedAlert(alertWasteType, 'in-transit');
                  setAlertSaveFeedback(`Test 'In-Transit' alert generated for ${alertWasteType}. Dispatched to ${alertRecipientEmail}.`);
                }}
                className="text-[11px]"
              >
                Test 'In-Transit'
              </Button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setAlertModalOpen(false);
                setAlertSaveFeedback(null);
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FarmerDashboard;
