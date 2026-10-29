import React, { useState, useEffect } from 'react';
import {
  Tractor,
  Factory,
  Truck,
  Layers,
  ShoppingBag,
  FileText,
  Settings,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Info,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { ReRouteLogo } from '../../assets/icons/ReRouteLogo';
import {
  useMarketplace,
  UserRole,
  getGreeting,
  UserProfile,
} from '../../services/api/marketplaceState';
import { Modal } from '../../components/common/Modal';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import { User, MapPin } from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onRoleChange?: (role: UserRole) => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  onNavigate,
  activeTab = 'overview',
  onTabChange,
  onRoleChange,
}) => {
  const { activeRole, setActiveRole, offers, activeProfile, updateActiveProfile } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Edit Profile Form State
  const [editFirstName, setEditFirstName] = useState(activeProfile?.firstName || '');
  const [editLastName, setEditLastName] = useState(activeProfile?.lastName || '');
  const [editOrgName, setEditOrgName] = useState(activeProfile?.organizationName || '');
  const [editCity, setEditCity] = useState(activeProfile?.location?.city || '');
  const [editState, setEditState] = useState(activeProfile?.location?.state || '');
  const [editCountry, setEditCountry] = useState(activeProfile?.location?.country || 'India');
  const [editPostalCode, setEditPostalCode] = useState(activeProfile?.location?.postalCode || '');

  // Keep edit state synced with active profile
  useEffect(() => {
    if (activeProfile) {
      setEditFirstName(activeProfile.firstName || '');
      setEditLastName(activeProfile.lastName || '');
      setEditOrgName(activeProfile.organizationName || '');
      setEditCity(activeProfile.location?.city || '');
      setEditState(activeProfile.location?.state || '');
      setEditCountry(activeProfile.location?.country || 'India');
      setEditPostalCode(activeProfile.location?.postalCode || '');
    }
  }, [activeProfile, activeRole]);

  const greeting = getGreeting(activeProfile?.firstName);
  const initials = `${activeProfile?.firstName?.[0] || ''}${activeProfile?.lastName?.[0] || ''}`.toUpperCase() || 'RR';

  // Compute pending incoming bids for the farmer to drive dynamic notification badges
  const pendingBidsCount = offers ? offers.filter((o) => o.status === 'Pending').length : 0;

  // Role details with exact portal headings and navigation requested
  const roleConfig = {
    farmer: {
      portalHeading: 'FARMER / GENERATOR PORTAL',
      name: 'Farmer / Generator',
      userTitle: activeProfile?.role === 'farmer' ? activeProfile.organizationName : 'Kisan Agro Collective',
      subTitle: activeProfile?.role === 'farmer' ? `${activeProfile.location.city}, ${activeProfile.location.state}` : 'Sangrur Cluster, Punjab',
      icon: <Tractor className="w-5 h-5 text-[#17483C]" />,
      navItems: [
        { id: 'overview', label: 'Dashboard Overview', icon: Layers },
        { id: 'advisor', label: 'AI Reuse Advisor', icon: Sparkles },
        { id: 'listings', label: 'My Residue Listings', icon: FileText },
        { id: 'bids', label: 'Incoming Bids', icon: ShoppingBag },
      ],
    },
    buyer: {
      portalHeading: 'BUYER PORTAL',
      name: 'Industrial Buyer',
      userTitle: activeProfile?.role === 'buyer' ? activeProfile.organizationName : 'BioPower Clean Fuels Ltd',
      subTitle: activeProfile?.role === 'buyer' ? `${activeProfile.location.city}, ${activeProfile.location.state}` : 'Procurement Division',
      icon: <Factory className="w-5 h-5 text-[#1D1160]" />,
      navItems: [
        { id: 'overview', label: 'Dashboard Overview', icon: Layers },
        { id: 'advisor', label: 'AI Reuse Advisor', icon: Sparkles },
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
        { id: 'offers', label: 'My Offers', icon: FileText },
      ],
    },
    logistics: {
      portalHeading: 'LOGISTICS PARTNER PORTAL',
      name: 'Logistics Partner',
      userTitle: activeProfile?.role === 'logistics' ? activeProfile.organizationName : 'Kisan Rural Freight Carrier',
      subTitle: activeProfile?.role === 'logistics' ? `${activeProfile.location.city}, ${activeProfile.location.state}` : 'Punjab & Haryana Fleet',
      icon: <Truck className="w-5 h-5 text-[#317787]" />,
      navItems: [
        { id: 'overview', label: 'Dashboard Overview', icon: Layers },
        { id: 'advisor', label: 'AI Reuse Advisor', icon: Sparkles },
        { id: 'requests', label: 'Transport Requests', icon: Truck },
        { id: 'deliveries', label: 'My Deliveries', icon: CheckCircle2 },
        { id: 'fleet', label: 'Service Area & Fleet Profile', icon: Settings },
      ],
    },
  }[activeRole];

  // Safeguard: Redirect to role overview if activeTab does not belong to the active role
  useEffect(() => {
    const validTabIds = roleConfig.navItems.map((item) => item.id);
    if (activeTab && !validTabIds.includes(activeTab)) {
      onTabChange?.('overview');
    }
  }, [activeRole, activeTab, roleConfig.navItems, onTabChange]);

  const handleRoleClick = (newRole: UserRole) => {
    if (onRoleChange) {
      onRoleChange(newRole);
    } else {
      setActiveRole(newRole);
      onTabChange?.('overview');
      onNavigate(`/dashboard/${newRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col text-[#1D1160]">
      
      {/* Top Demo Role Switcher Bar */}
      <div className="bg-[#17483C] text-white px-4 py-2.5 border-b border-[#12382F] text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#EDD17E] uppercase tracking-wider text-[10px] bg-[#12382F] px-2 py-0.5 rounded-[4px] border border-[#EDD17E]/40">
              Demo Role Preview
            </span>
            <span className="text-white/80 hidden md:inline">
              Switch role context to preview different portal experiences:
            </span>
          </div>

          {/* Three Role Buttons with clearly visible selected state */}
          <div className="flex items-center gap-1.5 bg-[#12382F] p-1 rounded-[6px] border border-[#8FBC8B]/30">
            <button
              type="button"
              onClick={() => handleRoleClick('farmer')}
              className={`px-3 py-1.5 rounded-[4px] text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                activeRole === 'farmer'
                  ? 'bg-white text-[#17483C] font-extrabold shadow-sm ring-1 ring-white/60'
                  : 'text-white/85 hover:text-white hover:bg-white/10 font-semibold'
              }`}
              aria-pressed={activeRole === 'farmer'}
            >
              <Tractor className="w-3.5 h-3.5" />
              <span>Farmer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleClick('buyer')}
              className={`px-3 py-1.5 rounded-[4px] text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                activeRole === 'buyer'
                  ? 'bg-white text-[#1D1160] font-extrabold shadow-sm ring-1 ring-white/60'
                  : 'text-white/85 hover:text-white hover:bg-white/10 font-semibold'
              }`}
              aria-pressed={activeRole === 'buyer'}
            >
              <Factory className="w-3.5 h-3.5" />
              <span>Buyer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleClick('logistics')}
              className={`px-3 py-1.5 rounded-[4px] text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                activeRole === 'logistics'
                  ? 'bg-white text-[#317787] font-extrabold shadow-sm ring-1 ring-white/60'
                  : 'text-white/85 hover:text-white hover:bg-white/10 font-semibold'
              }`}
              aria-pressed={activeRole === 'logistics'}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Logistics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="bg-white border-b border-[#E2EBE5] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-[6px] text-[#17483C] hover:bg-[#F4F7F5]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <button
              onClick={() => onNavigate('/')}
              className="cursor-pointer flex items-center"
              aria-label="ReRoute Home"
            >
              <ReRouteLogo variant="compact" />
            </button>

            <span className="text-neutral-300 hidden sm:inline">|</span>

            {/* Exact Required Role Portal Heading */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#17483C] font-heading bg-[#F4F7F5] px-2.5 py-1 rounded-[4px] border border-[#E2EBE5]">
                {roleConfig.portalHeading}
              </span>
              <span className="hidden lg:inline text-xs font-semibold text-[#17483C]">
                {greeting}
              </span>
            </div>
          </div>

          {/* Right Header Navigation & Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-[#17483C] hover:text-[#317787] transition-colors py-1.5 px-3 rounded-[6px] hover:bg-[#F4F7F5] border border-[#E2EBE5]"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Profile Greeting & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-[6px] hover:bg-[#F4F7F5] border border-transparent hover:border-[#E2EBE5] transition-colors cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-[6px] bg-[#E6EEF2] flex items-center justify-center font-bold text-xs text-[#17483C]">
                  {initials}
                </div>
                <div className="hidden sm:block leading-tight text-left">
                  <div className="text-xs font-bold text-[#17483C]">{activeProfile.firstName} {activeProfile.lastName}</div>
                  <div className="text-[10px] text-[#64748B]">{activeProfile.location.city}, {activeProfile.location.state}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Profile Popup */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-[8px] border border-[#E2EBE5] shadow-lg p-3 space-y-2 z-50 text-xs animate-in fade-in duration-100">
                  <div className="pb-2 border-b border-[#E2EBE5]">
                    <p className="font-bold text-[#17483C] text-sm">{activeProfile.firstName} {activeProfile.lastName}</p>
                    <p className="text-[#317787] font-medium text-[11px]">{roleConfig.name} · {activeProfile.organizationName}</p>
                    <p className="text-[#64748B] text-[11px] mt-0.5">{activeProfile.location.city}, {activeProfile.location.state}, {activeProfile.location.country}</p>
                    <p className="text-[#64748B] text-[10px] truncate">{activeProfile.email}</p>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setEditProfileOpen(true);
                      }}
                      className="w-full text-left py-1.5 px-2 rounded-[4px] hover:bg-[#F4F7F5] font-semibold text-[#17483C] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Edit Profile Details</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onNavigate('/marketplace');
                      }}
                      className="w-full text-left py-1.5 px-2 rounded-[4px] hover:bg-[#F4F7F5] font-medium text-[#17483C]"
                    >
                      Browse Public Marketplace
                    </button>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onNavigate('/');
                      }}
                      className="w-full text-left py-1.5 px-2 rounded-[4px] hover:bg-[#F4F7F5] font-medium text-[#17483C] flex items-center justify-between"
                    >
                      <span>Return to Landing Page</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Main Layout Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Desktop Sidebar (Left) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs p-4 space-y-1">
            <div className="pb-3 mb-2 border-b border-[#E2EBE5] flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#317787]">
                {roleConfig.name} Navigation
              </span>
            </div>

            {roleConfig.navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const showBidBadge = activeRole === 'farmer' && item.id === 'bids' && pendingBidsCount > 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange?.(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#17483C] text-white shadow-xs'
                      : 'text-[#475569] hover:bg-[#F4F7F5] hover:text-[#17483C]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {showBidBadge && (
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded-[4px] tabular-nums tracking-wide shrink-0 ${
                        isActive
                          ? 'bg-[#EDD17E] text-[#17483C]'
                          : 'bg-[#8FBC8B]/25 text-[#088A1A] border border-[#8FBC8B]/50'
                      }`}
                      title={`${pendingBidsCount} pending incoming bid${pendingBidsCount > 1 ? 's' : ''}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#088A1A] animate-pulse" />
                      <span>{pendingBidsCount} new</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Informational Card */}
          <div className="p-4 bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-[#317787] font-bold">
              <Info className="w-4 h-4 shrink-0" />
              <span>Shared Demo Ecosystem</span>
            </div>
            <p className="text-[#64748B] text-[11px] leading-relaxed">
              Switch roles using the top banner anytime. Listings created by Farmers appear in the Buyer marketplace, offers submitted by Buyers route to Farmer bids, and accepted deals queue in the Logistics pool.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border border-[#E2EBE5] rounded-[8px] p-4 shadow-md mb-4 space-y-2">
            <div className="text-xs font-bold text-[#17483C] uppercase tracking-wider mb-2">
              {roleConfig.name} Navigation
            </div>
            {roleConfig.navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const showBidBadge = activeRole === 'farmer' && item.id === 'bids' && pendingBidsCount > 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onTabChange?.(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[6px] text-xs font-semibold text-left ${
                    isActive
                      ? 'bg-[#17483C] text-white'
                      : 'text-[#475569] hover:bg-[#F4F7F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {showBidBadge && (
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded-[4px] tabular-nums ${
                        isActive
                          ? 'bg-[#EDD17E] text-[#17483C]'
                          : 'bg-[#8FBC8B]/25 text-[#088A1A] border border-[#8FBC8B]/50'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#088A1A] animate-pulse" />
                      <span>{pendingBidsCount} new</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Dynamic Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

      {/* Compact Dashboard Footer */}
      <footer className="bg-white border-t border-[#E2EBE5] py-4 px-6 text-center text-xs text-[#64748B]">
        <p>ReRoute — Waste to Worth · Circular Resource Management Portal · Team Syndicates</p>
      </footer>

    </div>
  );
};

export default DashboardShell;