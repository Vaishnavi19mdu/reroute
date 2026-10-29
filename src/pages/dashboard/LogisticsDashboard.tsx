import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Check,
  Settings,
  Layers,
  ChevronRight,
  Info,
  TrendingUp,
  Inbox,
  Sparkles,
  PackageCheck,
} from 'lucide-react';
import { useMarketplace, TransportRequest, getGreeting } from '../../services/api/marketplaceState';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { AIAdvisorView } from './AIAdvisorView';

interface LogisticsDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const LogisticsDashboard: React.FC<LogisticsDashboardProps> = ({
  activeTab = 'overview',
  onTabChange,
}) => {
  const { transportRequests, logisticsProfile, updateTransportStatus, updateLogisticsProfile, activeProfile } = useMarketplace();
  const greeting = getGreeting(activeProfile?.firstName);

  // Filter state for requests tab
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<string>('All');

  // Profile Edit State
  const [operatorName, setOperatorName] = useState(logisticsProfile.operatorName);
  const [state, setState] = useState(logisticsProfile.state);
  const [district, setDistrict] = useState(logisticsProfile.district);
  const [serviceArea, setServiceArea] = useState(logisticsProfile.serviceArea);
  const [loadCapacity, setLoadCapacity] = useState(logisticsProfile.loadCapacity.toString());
  const [profileSavedFeedback, setProfileSavedFeedback] = useState<string | null>(null);

  const filteredRequests = transportRequests.filter((r) => {
    if (statusFilter === 'All') return true;
    return r.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Filtered deliveries for "My Deliveries" tab (claimed / assigned / completed)
  const myDeliveries = transportRequests.filter((r) => {
    const isClaimed = r.status !== 'Available';
    if (!isClaimed) return false;
    if (deliveryStatusFilter === 'All') return true;
    return r.status === deliveryStatusFilter;
  });

  // Metrics
  const availableCount = transportRequests.filter((r) => r.status === 'Available').length;
  const assignedCount = transportRequests.filter((r) => r.status === 'Assigned').length;
  const inTransitCount = transportRequests.filter((r) => r.status === 'In transit').length;
  const deliveredCount = transportRequests.filter((r) => r.status === 'Delivered').length;

  const handleStatusAdvance = (requestId: string, currentStatus: TransportRequest['status']) => {
    let nextStatus: TransportRequest['status'] | null = null;
    if (currentStatus === 'Available') nextStatus = 'Assigned';
    else if (currentStatus === 'Assigned') nextStatus = 'In transit';
    else if (currentStatus === 'In transit') nextStatus = 'Delivered';

    if (nextStatus) {
      updateTransportStatus(requestId, nextStatus);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateLogisticsProfile({
      operatorName,
      state,
      district,
      serviceArea,
      loadCapacity: Number(loadCapacity) || logisticsProfile.loadCapacity,
    });
    setProfileSavedFeedback('Fleet capabilities and operating radius updated in demo session state.');
    setTimeout(() => setProfileSavedFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          VIEW 1: AI REUSE ADVISOR (SPECS & BULK DENSITY) TAB
          ========================================================================= */}
      {activeTab === 'advisor' && (
        <div className="space-y-6">
          <AIAdvisorView />
        </div>
      )}

      {/* =========================================================================
          VIEW 2: DISPATCH OVERVIEW TAB
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Personalised Greeting & Header Banner */}
          <div className="p-5 sm:p-6 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#317787] mb-1">
                <span>LOGISTICS PARTNER PORTAL</span>
                <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
                <span>{activeProfile?.location?.city || 'Patiala'}, {activeProfile?.location?.state || 'Punjab'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#17483C] font-heading">
                {greeting}
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                {activeProfile?.organizationName || 'Kisan Rural Freight Carrier'} · Dispatch transport fleets, coordinate farm pickups, and optimize rural biomass hauling.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => onTabChange?.('requests')}
              className="shrink-0 cursor-pointer"
            >
              <Truck className="w-4 h-4 mr-1.5" />
              <span>View Hauling Requests</span>
            </Button>
          </div>
          {/* Four Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Available Transport Requests */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E2EBE5] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Available Transport Requests
                </p>
                <h3 className="text-2xl font-black text-[#17483C] font-heading mt-1 tabular-nums">
                  {availableCount} Loads
                </h3>
                <span className="text-[11px] text-[#088A1A] font-medium">Ready for fleet claim</span>
              </div>
              <div className="p-3 bg-[#E6EEF2] rounded-[6px] text-[#17483C]">
                <Truck className="w-5 h-5" />
              </div>
            </div>

            {/* Card 2: Assigned Deliveries */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E2EBE5] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Assigned Deliveries
                </p>
                <h3 className="text-2xl font-black text-[#1D1160] font-heading mt-1 tabular-nums">
                  {assignedCount} Hauls
                </h3>
                <span className="text-[11px] text-[#317787]">Driver staging scheduled</span>
              </div>
              <div className="p-3 bg-[#E6EEF2] rounded-[6px] text-[#1D1160]">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* Card 3: Deliveries In Transit */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E2EBE5] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Deliveries In Transit
                </p>
                <h3 className="text-2xl font-black text-[#317787] font-heading mt-1 tabular-nums">
                  {inTransitCount} En Route
                </h3>
                <span className="text-[11px] text-[#317787]">Moving between gate & plant</span>
              </div>
              <div className="p-3 bg-[#E6EEF2] rounded-[6px] text-[#317787]">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Card 4: Completed Deliveries */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E2EBE5] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Completed Deliveries
                </p>
                <h3 className="text-2xl font-black text-[#088A1A] font-heading mt-1 tabular-nums">
                  {deliveredCount} Delivered
                </h3>
                <span className="text-[11px] text-[#088A1A] font-medium">Weighbridge slip confirmed</span>
              </div>
              <div className="p-3 bg-[#E6EEF2] rounded-[6px] text-[#088A1A]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* AI Specs Advisor Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#317787] to-[#17483C] rounded-[8px] text-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EDD17E] text-[#17483C] px-2 py-0.5 rounded-[4px]">
                  Hauling & Bulk Density Intelligence
                </span>
                <span className="text-xs text-white/80 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#EDD17E]" />
                  Equipment Matching · Moisture Thresholds
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading">
                Residue Bulk Handling & Equipment Advisory
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Check whether lots require high-cage tarps for fluffy straw, tippers for moist bagasse, or weatherproof covers for dry crushed shells.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onTabChange?.('advisor')}
              className="shrink-0 bg-white hover:bg-[#EDD17E] text-[#17483C] px-4 py-2.5 rounded-[6px] text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>Launch Specs Advisor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recent Hauling Activity */}
          <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2EBE5] pb-2.5">
              <h3 className="text-sm font-bold text-[#17483C] font-heading flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#317787]" />
                <span>Recent Dispatch Activity</span>
              </h3>
              <span className="text-[11px] text-[#64748B]">Carrier fleet operations</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-[6px] bg-[#FBFDFB] border border-[#E2EBE5] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#E6EEF2] text-[#317787] flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-[#17483C]">Load LOG-701 assigned to Kisan Rural Carrier</p>
                  <p className="text-[11px] text-[#64748B]">50 MT Rice straw staged from Sunam Tehsil to BioPower Plant.</p>
                </div>
              </div>

              <div className="p-3 rounded-[6px] bg-[#FBFDFB] border border-[#E2EBE5] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#8FBC8B]/20 text-[#088A1A] flex items-center justify-center shrink-0 mt-0.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-[#17483C]">Haul LOG-703 currently in transit</p>
                  <p className="text-[11px] text-[#64748B]">25 MT Groundnut Shells en route from Gondal to Morbi facility.</p>
                </div>
              </div>

              <div className="p-3 rounded-[6px] bg-[#FBFDFB] border border-[#E2EBE5] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#EDD17E]/30 text-[#9E822E] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-[#17483C]">New transport job available: Sugarcane Bagasse</p>
                  <p className="text-[11px] text-[#64748B]">100 MT haul queued in Shiroli MIDC Kolhapur.</p>
                </div>
              </div>

              <div className="p-3 rounded-[6px] bg-[#FBFDFB] border border-[#E2EBE5] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#8FBC8B]/20 text-[#088A1A] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-[#17483C]">Delivery slip confirmed for Patiala cluster</p>
                  <p className="text-[11px] text-[#64748B]">Weighbridge net tonnage certified without discrepancies.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Split Section: Transport Jobs Highlights & Fleet Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Active Jobs Highlights */}
            <div className="bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE5]">
                <div>
                  <h3 className="text-sm font-bold text-[#17483C] font-heading">
                    Active Transport Loads
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Recent jobs generated from confirmed farmer-buyer exchanges.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onTabChange?.('requests')}
                  className="text-xs font-bold text-[#317787] hover:text-[#17483C] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Pool ({transportRequests.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {transportRequests.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-[6px] border border-[#E2EBE5] bg-[#FBFDFB] hover:border-[#317787] transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#17483C] flex items-center gap-1.5">
                        <span>{req.materialName}</span>
                        <span className="text-[10px] font-mono text-neutral-400">({req.id})</span>
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {req.quantity} {req.unit} · {req.pickupLocation.split(',')[0]} → {req.destinationLocation.split(',')[0]}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                          req.status === 'Available'
                            ? 'bg-[#EDD17E]/30 text-[#9E822E]'
                            : req.status === 'Assigned'
                            ? 'bg-[#E6EEF2] text-[#317787]'
                            : req.status === 'In transit'
                            ? 'bg-[#1D1160]/10 text-[#1D1160]'
                            : 'bg-[#8FBC8B]/20 text-[#088A1A]'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-[#E2EBE5]">
                <button
                  type="button"
                  onClick={() => onTabChange?.('requests')}
                  className="text-xs font-bold text-[#17483C] hover:text-[#317787] flex items-center gap-1"
                >
                  <span>Open Transport Requests Pool & Claim Loads</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Fleet Profile Snapshot */}
            <div className="bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE5]">
                <div>
                  <h3 className="text-sm font-bold text-[#17483C] font-heading">
                    Fleet Capabilities & Readiness
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Current registered capacity and active hauling radius.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onTabChange?.('fleet')}
                  className="text-xs font-bold text-[#317787] hover:text-[#17483C] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Configure</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3.5 rounded-[6px] bg-[#F4F7F5] border border-[#E2EBE5] text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Fleet Operator:</span>
                  <strong className="text-[#17483C]">{logisticsProfile.operatorName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Payload Capacity:</span>
                  <strong className="text-[#1D1160] font-heading tabular-nums">
                    {logisticsProfile.loadCapacity} {logisticsProfile.capacityUnit}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Home Hub:</span>
                  <span className="text-neutral-700">{logisticsProfile.district}, {logisticsProfile.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Service Coverage:</span>
                  <span className="text-neutral-700 text-right truncate max-w-[200px]">{logisticsProfile.serviceArea}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-[#E2EBE5]">
                <button
                  type="button"
                  onClick={() => onTabChange?.('fleet')}
                  className="text-xs font-bold text-[#17483C] hover:text-[#317787] flex items-center gap-1"
                >
                  <span>Edit Fleet Capacity & Service Radius</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: TRANSPORT REQUESTS TAB (HAULING POOL)
          ========================================================================= */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="p-5 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#17483C] font-heading">
                Transport Requests Pool
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Pickup jobs generated from accepted buyer offers. Claim available loads and advance delivery statuses.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#17483C] bg-[#8FBC8B]/20 px-3 py-1.5 rounded-[6px]">
                {availableCount} Available to Claim
              </span>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-3 shadow-xs flex items-center gap-1.5 flex-wrap text-xs">
            {['All', 'Available', 'Assigned', 'In transit', 'Delivered'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[#17483C] text-white shadow-xs'
                    : 'bg-[#F4F7F5] text-[#334155] hover:bg-[#E6EEF2]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-12 text-center shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F4F7F5] text-[#64748B] flex items-center justify-center mx-auto">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#17483C] font-heading">
                No Transport Requests Found
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                No transport jobs match the '{statusFilter}' status. When farmers accept buyer offers, new pickup jobs automatically appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-[8px] border border-[#E2EBE5] p-5 shadow-xs hover:border-[#317787] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] text-neutral-500 bg-[#F4F7F5] px-2 py-0.5 rounded-[4px] border border-[#E2EBE5]">
                        {req.id}
                      </span>
                      <h3 className="text-base font-bold text-[#17483C] font-heading">
                        {req.materialName} ({req.quantity} {req.unit})
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] ${
                          req.status === 'Available'
                            ? 'bg-[#EDD17E]/30 text-[#9E822E] border border-[#EDD17E]'
                            : req.status === 'Assigned'
                            ? 'bg-[#E6EEF2] text-[#317787] border border-[#317787]/30'
                            : req.status === 'In transit'
                            ? 'bg-[#1D1160]/10 text-[#1D1160] border border-[#1D1160]/30'
                            : 'bg-[#8FBC8B]/20 text-[#088A1A] border border-[#8FBC8B]'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {/* Route & Destination */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#475569]">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#088A1A] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#17483C]">Pickup:</strong> {req.pickupLocation}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#317787] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#1D1160]">Drop-off:</strong> {req.destinationLocation}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-[#64748B] flex-wrap">
                      <span>Target Date: {req.requestedDate}</span>
                      <span>Equipment: {req.requirementNote}</span>
                      {req.carrierName && (
                        <span className="text-[#17483C] font-semibold">Assigned Fleet: {req.carrierName}</span>
                      )}
                    </div>
                  </div>

                  {/* Workflow Status Advance Control */}
                  <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
                    {req.status === 'Available' && (
                      <Button
                        variant="teal"
                        size="sm"
                        onClick={() => handleStatusAdvance(req.id, req.status)}
                        icon={<Truck className="w-3.5 h-3.5" />}
                      >
                        Claim & Assign to Fleet
                      </Button>
                    )}

                    {req.status === 'Assigned' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusAdvance(req.id, req.status)}
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Start Haul (In Transit)
                      </Button>
                    )}

                    {req.status === 'In transit' && (
                      <Button
                        variant="forest"
                        size="sm"
                        onClick={() => handleStatusAdvance(req.id, req.status)}
                        icon={<Check className="w-3.5 h-3.5" />}
                      >
                        Confirm Delivery
                      </Button>
                    )}

                    {req.status === 'Delivered' && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#088A1A] bg-[#8FBC8B]/20 py-1.5 px-3 rounded-[4px] border border-[#8FBC8B]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Delivery Completed</span>
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
          VIEW 4: MY DELIVERIES TAB
          ========================================================================= */}
      {activeTab === 'deliveries' && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="p-5 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#17483C] font-heading">
                My Active & Completed Deliveries
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Track vehicle dispatches, en-route cargo transit, and delivery completions for claimed lots.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#17483C] bg-[#E6EEF2] px-3 py-1.5 rounded-[6px]">
                {myDeliveries.length} Claimed Hauls
              </span>
            </div>
          </div>

          {/* Stats Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-[8px] border border-[#E2EBE5] shadow-xs">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Assigned Staging
              </span>
              <span className="text-xl font-black text-[#1D1160] font-heading tabular-nums mt-1 block">
                {assignedCount} Hauls
              </span>
            </div>

            <div className="bg-white p-4 rounded-[8px] border border-[#E2EBE5] shadow-xs">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Actively In Transit
              </span>
              <span className="text-xl font-black text-[#317787] font-heading tabular-nums mt-1 block">
                {inTransitCount} En Route
              </span>
            </div>

            <div className="bg-white p-4 rounded-[8px] border border-[#E2EBE5] shadow-xs">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Completed & Verified
              </span>
              <span className="text-xl font-black text-[#088A1A] font-heading tabular-nums mt-1 block">
                {deliveredCount} Delivered
              </span>
            </div>
          </div>

          {/* Delivery Status Filter Tabs */}
          <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-3 shadow-xs flex items-center gap-1.5 flex-wrap text-xs">
            {['All', 'Assigned', 'In transit', 'Delivered'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setDeliveryStatusFilter(status)}
                className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors cursor-pointer ${
                  deliveryStatusFilter === status
                    ? 'bg-[#17483C] text-white shadow-xs'
                    : 'bg-[#F4F7F5] text-[#334155] hover:bg-[#E6EEF2]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Deliveries List */}
          {myDeliveries.length === 0 ? (
            <div className="bg-white rounded-[8px] border border-[#E2EBE5] p-12 text-center shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F4F7F5] text-[#64748B] flex items-center justify-center mx-auto">
                <PackageCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#17483C] font-heading">
                No Deliveries in This Status
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Claim available loads from the Transport Requests pool to schedule dispatches and track hauling status.
              </p>
              <Button
                variant="teal"
                size="sm"
                onClick={() => onTabChange?.('requests')}
                className="mt-2"
              >
                Go to Transport Requests
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myDeliveries.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-[8px] border border-[#E2EBE5] p-5 shadow-xs hover:border-[#317787] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] text-neutral-500 bg-[#F4F7F5] px-2 py-0.5 rounded-[4px] border border-[#E2EBE5]">
                        {req.id}
                      </span>
                      <h3 className="text-base font-bold text-[#17483C] font-heading">
                        {req.materialName} ({req.quantity} {req.unit})
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] ${
                          req.status === 'Assigned'
                            ? 'bg-[#E6EEF2] text-[#317787] border border-[#317787]/30'
                            : req.status === 'In transit'
                            ? 'bg-[#1D1160]/10 text-[#1D1160] border border-[#1D1160]/30'
                            : 'bg-[#8FBC8B]/20 text-[#088A1A] border border-[#8FBC8B]'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#475569]">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#088A1A] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#17483C]">Pickup:</strong> {req.pickupLocation}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#317787] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#1D1160]">Drop-off:</strong> {req.destinationLocation}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-[#64748B] flex-wrap">
                      <span>Target Date: {req.requestedDate}</span>
                      <span>Assigned Vehicle: {req.assignedVehicle || 'Heavy Commercial Vehicle'}</span>
                      <span className="text-[#17483C] font-semibold">Operator: {logisticsProfile.operatorName}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
                    {req.status === 'Assigned' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusAdvance(req.id, req.status)}
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Start Haul (In Transit)
                      </Button>
                    )}

                    {req.status === 'In transit' && (
                      <Button
                        variant="forest"
                        size="sm"
                        onClick={() => handleStatusAdvance(req.id, req.status)}
                        icon={<Check className="w-3.5 h-3.5" />}
                      >
                        Confirm Delivery
                      </Button>
                    )}

                    {req.status === 'Delivered' && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#088A1A] bg-[#8FBC8B]/20 py-1.5 px-3 rounded-[4px] border border-[#8FBC8B]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Weighbridge Certified</span>
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
          VIEW 5: FLEET CAPACITY & SERVICE AREA PROFILE TAB
          ========================================================================= */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="p-5 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#17483C] font-heading">
                Service Area & Fleet Profile
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Configure your registered transport coverage, payload tonnage capacity, and driver dispatch methods.
              </p>
            </div>
          </div>

          {profileSavedFeedback && (
            <div className="p-4 bg-[#8FBC8B]/20 border border-[#8FBC8B] rounded-[6px] text-xs text-[#17483C] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#088A1A] shrink-0" />
              <span>{profileSavedFeedback}</span>
            </div>
          )}

          <div className="bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs p-6">
            <form onSubmit={handleSaveProfile} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Logistics Operator Name" id="operatorName" required>
                  <input
                    id="operatorName"
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-sm text-[#1D1160]"
                  />
                </FormField>

                <FormField label="Total Fleet Capacity (Tonnes)" id="loadCapacity" required>
                  <input
                    id="loadCapacity"
                    type="number"
                    min="1"
                    value={loadCapacity}
                    onChange={(e) => setLoadCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-sm text-[#1D1160]"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Home State" id="state" required>
                  <input
                    id="state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-sm text-[#1D1160]"
                  />
                </FormField>

                <FormField label="Home District" id="district" required>
                  <input
                    id="district"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-sm text-[#1D1160]"
                  />
                </FormField>
              </div>

              <FormField
                label="Operating Service Radius / Locations"
                id="serviceArea"
                required
                helperText="Districts or corridors where your vehicles operate"
              >
                <input
                  id="serviceArea"
                  type="text"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] text-sm text-[#1D1160]"
                />
              </FormField>

              <div className="pt-2 flex justify-end">
                <Button variant="teal" size="md" type="submit">
                  Save Profile Changes (Demo State)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LogisticsDashboard;
