import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'farmer' | 'buyer' | 'logistics';

export interface ResidueListing {
  id: string;
  farmerId: string;
  farmerName: string;
  materialName: string;
  category: 'Cereal Straws' | 'Agro-Industrial' | 'Husks & Shells' | 'Other';
  quantity: number;
  unit: 'tonnes' | 'kg';
  state: string;
  district: string;
  pickupLocation: string;
  indicativePrice: number; // ₹ per unit
  moistureSpec: string;
  status: 'Active' | 'Under Offer' | 'Completed' | 'Closed';
  bidsCount: number;
  createdAt: string;
  description: string;
  imageUrl?: string;
}

export interface BuyerOffer {
  id: string;
  listingId: string;
  listingName: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  buyerType: string;
  offeredPrice: number; // ₹ per unit
  requestedQuantity: number;
  unit: 'tonnes' | 'kg';
  totalGross: number; // offeredPrice * requestedQuantity
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
  submittedAt: string;
  message?: string;
  transportStatus: string;
}

export interface TransportRequest {
  id: string;
  listingId: string;
  materialName: string;
  quantity: number;
  unit: string;
  pickupLocation: string;
  destinationLocation: string;
  carrierName?: string;
  assignedVehicle?: string;
  status: 'Available' | 'Assigned' | 'In transit' | 'Delivered';
  requestedDate: string;
  requirementNote: string;
  estimatedPayloadTons: number;
}

export interface LogisticsProfile {
  operatorName: string;
  state: string;
  district: string;
  serviceArea: string;
  vehicleTypes: string[];
  loadCapacity: number;
  capacityUnit: string;
  contactMethod: string;
}

export interface UserLocation {
  country: string;
  state: string;
  city: string;
  postalCode?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  organizationName: string;
  location: UserLocation;
  farmerDetails?: {
    farmName?: string;
    residueTypes: string[];
    availableQuantity?: string;
    quantityUnit?: string;
    preferredContact?: string;
  };
  buyerDetails?: {
    companyName?: string;
    buyerType?: string;
    materialsOfInterest: string[];
    purchasingCapacity?: string;
    capacityUnit?: string;
    preferredContact?: string;
  };
  logisticsDetails?: {
    operatorName?: string;
    vehicleTypes: string[];
    loadCapacity?: string;
    capacityUnit?: string;
    serviceArea?: string;
    preferredContact?: string;
  };
}

export interface FarmerAlertSetting {
  id: string;
  wasteType: string;
  notifyOnPurchased: boolean;
  notifyOnInTransit: boolean;
  emailEnabled: boolean;
  dashboardEnabled: boolean;
  recipientEmail: string;
  enabled: boolean;
}

export interface FarmerAlertNotification {
  id: string;
  timestamp: string;
  type: 'purchased' | 'in-transit';
  wasteType: string;
  lotId: string;
  title: string;
  message: string;
  deliveredEmail: boolean;
  deliveredDashboard: boolean;
  recipientEmail?: string;
  read: boolean;
}

export const getGreeting = (firstName?: string): string => {
  const hour = new Date().getHours();
  let timeGreeting = 'Welcome back';
  if (hour >= 5 && hour < 12) {
    timeGreeting = 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon';
  } else {
    timeGreeting = 'Good evening';
  }
  const cleanName = firstName?.trim();
  return cleanName ? `${timeGreeting}, ${cleanName}` : 'Welcome back';
};

export const DEFAULT_PROFILES: Record<UserRole, UserProfile> = {
  farmer: {
    id: 'user-farmer-demo',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@kisanagro.org',
    role: 'farmer',
    phoneNumber: '+91 98765 43210',
    organizationName: 'Kisan Agro Collective',
    location: {
      country: 'India',
      state: 'Punjab',
      city: 'Sangrur',
      postalCode: '148028',
      address: 'Sunam Tehsil, Staging Area 2',
    },
    farmerDetails: {
      farmName: 'Kisan Agro Collective',
      residueTypes: ['Rice straw', 'Rice husk'],
      availableQuantity: '50',
      quantityUnit: 'tonnes',
      preferredContact: 'Phone Call',
    },
  },
  buyer: {
    id: 'user-buyer-demo',
    firstName: 'Rajesh',
    lastName: 'Patel',
    email: 'rajesh.patel@biopowerclean.com',
    role: 'buyer',
    phoneNumber: '+91 94231 87654',
    organizationName: 'BioPower Clean Fuels Ltd',
    location: {
      country: 'India',
      state: 'Maharashtra',
      city: 'Kolhapur',
      postalCode: '416003',
      address: 'Shiroli MIDC Procurement Yard',
    },
    buyerDetails: {
      companyName: 'BioPower Clean Fuels Ltd',
      buyerType: 'Biomass Pellet & Briquette Manufacturer',
      materialsOfInterest: ['Rice straw', 'Sugarcane bagasse'],
      purchasingCapacity: '500',
      capacityUnit: 'tonnes',
      preferredContact: 'Email',
    },
  },
  logistics: {
    id: 'user-logistics-demo',
    firstName: 'Amit',
    lastName: 'Singh',
    email: 'amit.singh@kisanfreight.in',
    role: 'logistics',
    phoneNumber: '+91 98140 12345',
    organizationName: 'Kisan Rural Freight Carrier',
    location: {
      country: 'India',
      state: 'Punjab',
      city: 'Patiala',
      postalCode: '147001',
      address: 'Industrial Bypass Fleet Hub',
    },
    logisticsDetails: {
      operatorName: 'Kisan Rural Freight Carrier',
      vehicleTypes: ['Medium Commercial Vehicle (5–10 MT)', 'Heavy Multi-Axle Truck (15–25 MT)'],
      loadCapacity: '45',
      capacityUnit: 'tonnes',
      serviceArea: 'Sangrur, Patiala, Ludhiana & Bathinda Rural Radius',
      preferredContact: 'WhatsApp',
    },
  },
};


// Initial Believable Demo Data
const INITIAL_LISTINGS: ResidueListing[] = [
  {
    id: 'LOT-RS-101',
    farmerId: 'FARM-01',
    farmerName: 'Kisan Agro Collective',
    materialName: 'Rice straw (Baled)',
    category: 'Cereal Straws',
    quantity: 50,
    unit: 'tonnes',
    state: 'Punjab',
    district: 'Sangrur',
    pickupLocation: 'Sunam Tehsil, Staging Area 2',
    indicativePrice: 2200, // ₹2,200 per tonne (approx ₹2.20/kg)
    moistureSpec: '< 14% Moisture (Dry machine baled)',
    status: 'Active',
    bidsCount: 2,
    createdAt: '2 days ago',
    description: 'Post-harvest machine baled golden paddy straw, stored on raised dry beds. Ready for immediate transport.',
  },
  {
    id: 'LOT-SB-204',
    farmerId: 'FARM-02',
    farmerName: 'Western Maharashtra Sugarcane Mills',
    materialName: 'Sugarcane Bagasse',
    category: 'Agro-Industrial',
    quantity: 120,
    unit: 'tonnes',
    state: 'Maharashtra',
    district: 'Kolhapur',
    pickupLocation: 'Shiroli MIDC Depository',
    indicativePrice: 1750, // ₹1,750 per tonne
    moistureSpec: '45-48% Moisture (Fresh crushed mill-run)',
    status: 'Under Offer',
    bidsCount: 2,
    createdAt: '1 day ago',
    description: 'Clean fibrous bagasse from early crushing season, ideal for bio-pulp board or biomass cogenerator boilers.',
  },
  {
    id: 'LOT-GS-309',
    farmerId: 'FARM-01',
    farmerName: 'Kisan Agro Collective',
    materialName: 'Groundnut Shells (Crushed)',
    category: 'Husks & Shells',
    quantity: 25,
    unit: 'tonnes',
    state: 'Gujarat',
    district: 'Rajkot',
    pickupLocation: 'Gondal Agro Yard, Bay 4',
    indicativePrice: 3400, // ₹3,400 per tonne
    moistureSpec: '< 9% Moisture (Air dry shells)',
    status: 'Active',
    bidsCount: 1,
    createdAt: '3 days ago',
    description: 'Uniform dry peanut shells with low silica content, highly suitable for solid fuel pelletization.',
  },
  {
    id: 'LOT-RH-412',
    farmerId: 'FARM-03',
    farmerName: 'Tarai Green Fields',
    materialName: 'Rice Husk',
    category: 'Husks & Shells',
    quantity: 40,
    unit: 'tonnes',
    state: 'Haryana',
    district: 'Karnal',
    pickupLocation: 'Taraori Mill Complex',
    indicativePrice: 2800, // ₹2,800 per tonne
    moistureSpec: '< 11% Moisture (Fine uncarbonized)',
    status: 'Active',
    bidsCount: 0,
    createdAt: '5 hours ago',
    description: 'Premium parboiled paddy husk with high calorific yield, ready for gasifier or insulation manufacturing.',
  },
];

const INITIAL_OFFERS: BuyerOffer[] = [
  {
    id: 'BID-001',
    listingId: 'LOT-RS-101',
    listingName: 'Rice straw (Baled)',
    farmerName: 'Kisan Agro Collective',
    buyerId: 'BUY-01',
    buyerName: 'BioPower Clean Fuels Pvt Ltd',
    buyerType: 'Biomass Pellet & Briquette Manufacturer',
    offeredPrice: 2300,
    requestedQuantity: 50,
    unit: 'tonnes',
    totalGross: 115000,
    status: 'Pending',
    submittedAt: 'Yesterday',
    message: 'Can dispatch carrier fleet within 48 hours of gross weighment confirmation.',
    transportStatus: 'Estimate pending',
  },
  {
    id: 'BID-002',
    listingId: 'LOT-RS-101',
    listingName: 'Rice straw (Baled)',
    farmerName: 'Kisan Agro Collective',
    buyerId: 'BUY-02',
    buyerName: 'EcoFiber Pulp & Molded Packaging',
    buyerType: 'Agro-Paper Manufacturer',
    offeredPrice: 2400,
    requestedQuantity: 30,
    unit: 'tonnes',
    totalGross: 72000,
    status: 'Pending',
    submittedAt: 'Today, 09:30 AM',
    message: 'Need high silica-free bales for packaging test run.',
    transportStatus: 'Estimate pending',
  },
  {
    id: 'BID-003',
    listingId: 'LOT-SB-204',
    listingName: 'Sugarcane Bagasse',
    farmerName: 'Western Maharashtra Sugarcane Mills',
    buyerId: 'BUY-01',
    buyerName: 'BioPower Clean Fuels Pvt Ltd',
    buyerType: 'Biomass Pellet & Briquette Manufacturer',
    offeredPrice: 1800,
    requestedQuantity: 100,
    unit: 'tonnes',
    totalGross: 180000,
    status: 'Pending',
    submittedAt: 'Yesterday',
    message: 'Require moisture test certificate upon arrival at boiler yard.',
    transportStatus: 'Estimate pending',
  },
];

const INITIAL_TRANSPORT_REQUESTS: TransportRequest[] = [
  {
    id: 'LOG-701',
    listingId: 'LOT-RS-101',
    materialName: 'Rice straw (Baled)',
    quantity: 50,
    unit: 'tonnes',
    pickupLocation: 'Sunam Tehsil, Sangrur, Punjab',
    destinationLocation: 'BioPower Pellet Plant, Patiala, Punjab',
    carrierName: 'Kisan Rural Freight Carrier',
    assignedVehicle: 'Heavy Multi-Axle Truck (15–25 MT)',
    status: 'Assigned',
    requestedDate: '2026-10-27',
    requirementNote: 'Flatbed or high-cage tarp trailer recommended for bulky dry bales.',
    estimatedPayloadTons: 50,
  },
  {
    id: 'LOG-702',
    listingId: 'LOT-SB-204',
    materialName: 'Sugarcane Bagasse',
    quantity: 100,
    unit: 'tonnes',
    pickupLocation: 'Shiroli MIDC, Kolhapur, Maharashtra',
    destinationLocation: 'Industrial Boiler Yard, Pune, Maharashtra',
    status: 'Available',
    requestedDate: '2026-10-28',
    requirementNote: 'High-sided tipper truck needed for moist crushed bagasse.',
    estimatedPayloadTons: 100,
  },
  {
    id: 'LOG-703',
    listingId: 'LOT-GS-309',
    materialName: 'Groundnut Shells',
    quantity: 25,
    unit: 'tonnes',
    pickupLocation: 'Gondal Agro Yard, Rajkot, Gujarat',
    destinationLocation: 'EcoPellet Processing Facility, Morbi, Gujarat',
    carrierName: 'Saurashtra Express Logistics',
    assignedVehicle: 'Medium Commercial Vehicle (10 MT)',
    status: 'In transit',
    requestedDate: '2026-10-25',
    requirementNote: 'Weatherproof tarpaulin enclosure required for dry crushed shells.',
    estimatedPayloadTons: 25,
  },
];

const INITIAL_LOGISTICS_PROFILE: LogisticsProfile = {
  operatorName: 'Kisan Rural Freight & Logistics',
  state: 'Punjab',
  district: 'Sangrur',
  serviceArea: 'Sangrur, Patiala, Ludhiana & Bathinda Rural Radius',
  vehicleTypes: ['Medium Commercial Vehicle (5–10 MT)', 'Heavy Multi-Axle Truck (15–25 MT)'],
  loadCapacity: 45,
  capacityUnit: 'tonnes',
  contactMethod: 'WhatsApp',
};

interface MarketplaceContextType {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeProfile: UserProfile;
  updateActiveProfile: (updates: Partial<UserProfile>) => void;
  registerProfile: (newProfile: Omit<UserProfile, 'id'>) => void;
  listings: ResidueListing[];
  offers: BuyerOffer[];
  transportRequests: TransportRequest[];
  logisticsProfile: LogisticsProfile;
  addListing: (listing: Omit<ResidueListing, 'id' | 'createdAt' | 'bidsCount' | 'status'>) => void;
  submitOffer: (offer: {
    listingId: string;
    buyerName: string;
    buyerType: string;
    offeredPrice: number;
    requestedQuantity: number;
    unit: 'tonnes' | 'kg';
    message?: string;
  }) => { success: boolean; error?: string };
  acceptOffer: (offerId: string) => void;
  rejectOffer: (offerId: string) => void;
  withdrawOffer: (offerId: string) => void;
  updateTransportStatus: (
    requestId: string,
    newStatus: 'Available' | 'Assigned' | 'In transit' | 'Delivered'
  ) => void;
  updateLogisticsProfile: (profile: Partial<LogisticsProfile>) => void;
  alertSettings: FarmerAlertSetting[];
  saveAlertSetting: (setting: Omit<FarmerAlertSetting, 'id'> & { id?: string }) => void;
  deleteAlertSetting: (id: string) => void;
  alertNotifications: FarmerAlertNotification[];
  markAlertNotificationRead: (id: string) => void;
  clearAllAlertNotifications: () => void;
  triggerSimulatedAlert: (wasteType: string, type: 'purchased' | 'in-transit') => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | null>(null);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('farmer');
  const [listings, setListings] = useState<ResidueListing[]>(INITIAL_LISTINGS);
  const [offers, setOffers] = useState<BuyerOffer[]>(INITIAL_OFFERS);
  const [transportRequests, setTransportRequests] = useState<TransportRequest[]>(INITIAL_TRANSPORT_REQUESTS);
  const [logisticsProfile, setLogisticsProfile] = useState<LogisticsProfile>(INITIAL_LOGISTICS_PROFILE);

  // Farmer Automated Alert Rules State
  const [alertSettings, setAlertSettings] = useState<FarmerAlertSetting[]>(() => {
    try {
      const saved = localStorage.getItem('reroute_farmer_alert_settings_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'ALERT-01',
        wasteType: 'Rice straw (Baled)',
        notifyOnPurchased: true,
        notifyOnInTransit: true,
        emailEnabled: true,
        dashboardEnabled: true,
        recipientEmail: 'priya.sharma@kisanagro.org',
        enabled: true,
      },
      {
        id: 'ALERT-02',
        wasteType: 'Wheat straw',
        notifyOnPurchased: true,
        notifyOnInTransit: true,
        emailEnabled: true,
        dashboardEnabled: true,
        recipientEmail: 'priya.sharma@kisanagro.org',
        enabled: true,
      },
      {
        id: 'ALERT-03',
        wasteType: 'All Waste Types',
        notifyOnPurchased: true,
        notifyOnInTransit: true,
        emailEnabled: true,
        dashboardEnabled: true,
        recipientEmail: 'priya.sharma@kisanagro.org',
        enabled: true,
      },
    ];
  });

  // Farmer Alert Notifications History
  const [alertNotifications, setAlertNotifications] = useState<FarmerAlertNotification[]>(() => {
    try {
      const saved = localStorage.getItem('reroute_farmer_alert_notifications_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'NOTIF-01',
        timestamp: 'Today, 10:15 AM',
        type: 'purchased',
        wasteType: 'Rice straw (Baled)',
        lotId: 'LOT-RS-101',
        title: 'Residue Lot Purchased (Offer Accepted)',
        message: 'BioPower Clean Fuels Ltd offer of ₹2,300/MT for 50 MT Rice straw was confirmed as purchased. Logistics dispatch generated.',
        deliveredEmail: true,
        deliveredDashboard: true,
        recipientEmail: 'priya.sharma@kisanagro.org',
        read: false,
      },
      {
        id: 'NOTIF-02',
        timestamp: 'Yesterday, 3:45 PM',
        type: 'in-transit',
        wasteType: 'Rice straw (Baled)',
        lotId: 'LOT-RS-101',
        title: 'Residue Lot In-Transit (Dispatched)',
        message: 'Kisan Rural Freight Carrier marked vehicle PB-11-K-8820 as In-Transit from Sunam Tehsil Staging Yard.',
        deliveredEmail: true,
        deliveredDashboard: true,
        recipientEmail: 'priya.sharma@kisanagro.org',
        read: false,
      },
    ];
  });

  const saveAlertSetting = (setting: Omit<FarmerAlertSetting, 'id'> & { id?: string }) => {
    setAlertSettings((prev) => {
      const existingIndex = setting.id ? prev.findIndex((s) => s.id === setting.id) : -1;
      let next: FarmerAlertSetting[];
      if (existingIndex >= 0) {
        next = prev.map((s, idx) => (idx === existingIndex ? { ...(setting as FarmerAlertSetting) } : s));
      } else {
        const newSetting: FarmerAlertSetting = {
          ...setting,
          id: `ALERT-${Date.now().toString().slice(-4)}`,
        };
        next = [newSetting, ...prev];
      }
      try {
        localStorage.setItem('reroute_farmer_alert_settings_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const deleteAlertSetting = (id: string) => {
    setAlertSettings((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('reroute_farmer_alert_settings_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const markAlertNotificationRead = (id: string) => {
    setAlertNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      try {
        localStorage.setItem('reroute_farmer_alert_notifications_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const clearAllAlertNotifications = () => {
    setAlertNotifications([]);
    try {
      localStorage.removeItem('reroute_farmer_alert_notifications_v1');
    } catch (e) {}
  };

  const triggerSimulatedAlert = (wasteType: string, type: 'purchased' | 'in-transit') => {
    const isPurchased = type === 'purchased';
    const notif: FarmerAlertNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      type,
      wasteType,
      lotId: 'LOT-DEMO',
      title: isPurchased ? `Alert: ${wasteType} marked as Purchased` : `Alert: ${wasteType} marked as In-Transit`,
      message: isPurchased
        ? `Buyer BioPower Clean Fuels finalized procurement for ${wasteType}. Automated alert dispatched to your registered email.`
        : `Logistics Carrier dispatched hauling truck for ${wasteType}. Real-time tracking link initiated.`,
      deliveredEmail: true,
      deliveredDashboard: true,
      recipientEmail: activeProfile.email,
      read: false,
    };
    setAlertNotifications((prev) => {
      const next = [notif, ...prev];
      try {
        localStorage.setItem('reroute_farmer_alert_notifications_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const [userProfiles, setUserProfiles] = useState<Record<UserRole, UserProfile>>(() => {
    try {
      const saved = localStorage.getItem('reroute_user_profiles_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_PROFILES;
  });

  const activeProfile = userProfiles[activeRole] || DEFAULT_PROFILES[activeRole];

  const registerProfile = (newProfile: Omit<UserProfile, 'id'>) => {
    const profileWithId: UserProfile = {
      ...newProfile,
      id: `user-${Date.now()}`,
    };
    setUserProfiles((prev) => {
      const next = { ...prev, [newProfile.role]: profileWithId };
      try {
        localStorage.setItem('reroute_user_profiles_v2', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setActiveRole(newProfile.role);
    if (newProfile.role === 'logistics' && newProfile.logisticsDetails) {
      setLogisticsProfile((prev) => ({
        ...prev,
        operatorName: newProfile.organizationName || prev.operatorName,
        state: newProfile.location.state || prev.state,
        district: newProfile.location.city || prev.district,
        vehicleTypes: newProfile.logisticsDetails?.vehicleTypes || prev.vehicleTypes,
        serviceArea: newProfile.logisticsDetails?.serviceArea || prev.serviceArea,
      }));
    }
  };

  const updateActiveProfile = (updates: Partial<UserProfile>) => {
    setUserProfiles((prev) => {
      const current = prev[activeRole] || DEFAULT_PROFILES[activeRole];
      const updated: UserProfile = {
        ...current,
        ...updates,
        location: updates.location ? { ...current.location, ...updates.location } : current.location,
      };
      const next = { ...prev, [activeRole]: updated };
      try {
        localStorage.setItem('reroute_user_profiles_v2', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Add new listing (Farmer)
  const addListing = (newLot: Omit<ResidueListing, 'id' | 'createdAt' | 'bidsCount' | 'status'>) => {
    const created: ResidueListing = {
      ...newLot,
      id: `LOT-${newLot.materialName.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: 'Just now',
      bidsCount: 0,
      status: 'Active',
    };
    setListings((prev) => [created, ...prev]);
  };

  // Submit buyer reverse offer
  const submitOffer = ({
    listingId,
    buyerName,
    buyerType,
    offeredPrice,
    requestedQuantity,
    unit,
    message,
  }: {
    listingId: string;
    buyerName: string;
    buyerType: string;
    offeredPrice: number;
    requestedQuantity: number;
    unit: 'tonnes' | 'kg';
    message?: string;
  }) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return { success: false, error: 'Listing not found.' };

    if (requestedQuantity <= 0) {
      return { success: false, error: 'Requested quantity must be greater than zero.' };
    }
    if (requestedQuantity > listing.quantity) {
      return {
        success: false,
        error: `Requested quantity cannot exceed available lot quantity (${listing.quantity} ${listing.unit}).`,
      };
    }
    if (offeredPrice <= 0) {
      return { success: false, error: 'Offered price must be a positive value.' };
    }

    const newOffer: BuyerOffer = {
      id: `BID-${Math.floor(100 + Math.random() * 900)}`,
      listingId,
      listingName: listing.materialName,
      farmerName: listing.farmerName,
      buyerId: 'BUY-DEMO',
      buyerName,
      buyerType,
      offeredPrice,
      requestedQuantity,
      unit,
      totalGross: offeredPrice * requestedQuantity,
      status: 'Pending',
      submittedAt: 'Just now',
      message: message || 'Standard procurement pickup requested upon inspection.',
      transportStatus: 'Estimate pending',
    };

    setOffers((prev) => [newOffer, ...prev]);

    // Update listing bid count and status
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId
          ? {
              ...l,
              bidsCount: l.bidsCount + 1,
              status: l.status === 'Active' ? 'Under Offer' : l.status,
            }
          : l
      )
    );

    return { success: true };
  };

  // Accept offer (Farmer)
  const acceptOffer = (offerId: string) => {
    const targetOffer = offers.find((o) => o.id === offerId);
    if (!targetOffer) return;

    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === offerId) return { ...o, status: 'Accepted' };
        if (o.listingId === targetOffer.listingId && o.status === 'Pending') {
          return { ...o, status: 'Rejected' };
        }
        return o;
      })
    );

    // Update listing to Completed
    setListings((prev) =>
      prev.map((l) => (l.id === targetOffer.listingId ? { ...l, status: 'Completed' } : l))
    );

    // Automatically generate a Transport Request in Logistics pool
    const newTransport: TransportRequest = {
      id: `LOG-${Math.floor(700 + Math.random() * 200)}`,
      listingId: targetOffer.listingId,
      materialName: targetOffer.listingName,
      quantity: targetOffer.requestedQuantity,
      unit: targetOffer.unit,
      pickupLocation: 'Confirmed Farm Pickup Gate',
      destinationLocation: `${targetOffer.buyerName} Unloading Yard`,
      status: 'Available',
      requestedDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      requirementNote: `Confirmed exchange lot. Payload: ${targetOffer.requestedQuantity} ${targetOffer.unit}. Coordinate driver dispatch.`,
      estimatedPayloadTons: targetOffer.requestedQuantity,
    };
    setTransportRequests((prev) => [newTransport, ...prev]);

    // Check if farmer has alert configured for this material marked as purchased
    const matchingSetting = alertSettings.find(
      (s) =>
        s.enabled &&
        s.notifyOnPurchased &&
        (s.wasteType === 'All Waste Types' ||
          s.wasteType.toLowerCase().includes(targetOffer.listingName.toLowerCase()) ||
          targetOffer.listingName.toLowerCase().includes(s.wasteType.toLowerCase()))
    );

    if (matchingSetting) {
      const notif: FarmerAlertNotification = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        type: 'purchased',
        wasteType: targetOffer.listingName,
        lotId: targetOffer.listingId,
        title: `Residue Lot Purchased: ${targetOffer.listingName}`,
        message: `Buyer ${targetOffer.buyerName} confirmed purchase at ₹${targetOffer.offeredPrice.toLocaleString('en-IN')}/${targetOffer.unit} for lot ${targetOffer.listingId}. Automated dispatch generated.`,
        deliveredEmail: matchingSetting.emailEnabled,
        deliveredDashboard: matchingSetting.dashboardEnabled,
        recipientEmail: matchingSetting.recipientEmail || activeProfile.email,
        read: false,
      };
      setAlertNotifications((prev) => {
        const next = [notif, ...prev];
        try {
          localStorage.setItem('reroute_farmer_alert_notifications_v1', JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    }
  };

  // Reject offer (Farmer)
  const rejectOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'Rejected' } : o))
    );
  };

  // Withdraw offer (Buyer)
  const withdrawOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'Withdrawn' } : o))
    );
  };

  // Update logistics workflow status
  const updateTransportStatus = (
    requestId: string,
    newStatus: 'Available' | 'Assigned' | 'In transit' | 'Delivered'
  ) => {
    const targetReq = transportRequests.find((r) => r.id === requestId);
    setTransportRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: newStatus,
              carrierName: newStatus !== 'Available' ? logisticsProfile.operatorName : undefined,
            }
          : r
      )
    );

    if (targetReq) {
      setOffers((prev) =>
        prev.map((o) =>
          o.listingId === targetReq.listingId
            ? { ...o, transportStatus: newStatus }
            : o
        )
      );

      // Trigger automated alert for farmer if status transitioned to 'In transit'
      if (newStatus === 'In transit') {
        const matchingSetting = alertSettings.find(
          (s) =>
            s.enabled &&
            s.notifyOnInTransit &&
            (s.wasteType === 'All Waste Types' ||
              s.wasteType.toLowerCase().includes(targetReq.materialName.toLowerCase()) ||
              targetReq.materialName.toLowerCase().includes(s.wasteType.toLowerCase()))
        );

        if (matchingSetting) {
          const notif: FarmerAlertNotification = {
            id: `NOTIF-${Date.now().toString().slice(-4)}`,
            timestamp: 'Just now',
            type: 'in-transit',
            wasteType: targetReq.materialName,
            lotId: targetReq.listingId,
            title: `Residue Lot In-Transit: ${targetReq.materialName}`,
            message: `Carrier ${logisticsProfile.operatorName} has marked hauling as In-Transit for lot ${targetReq.listingId} (${targetReq.pickupLocation} → ${targetReq.destinationLocation}).`,
            deliveredEmail: matchingSetting.emailEnabled,
            deliveredDashboard: matchingSetting.dashboardEnabled,
            recipientEmail: matchingSetting.recipientEmail || activeProfile.email,
            read: false,
          };
          setAlertNotifications((prev) => {
            const next = [notif, ...prev];
            try {
              localStorage.setItem('reroute_farmer_alert_notifications_v1', JSON.stringify(next));
            } catch (e) {}
            return next;
          });
        }
      }
    }
  };

  // Update logistics profile
  const updateLogisticsProfile = (profile: Partial<LogisticsProfile>) => {
    setLogisticsProfile((prev) => ({ ...prev, ...profile }));
  };

  return (
    <MarketplaceContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeProfile,
        updateActiveProfile,
        registerProfile,
        listings,
        offers,
        transportRequests,
        logisticsProfile,
        addListing,
        submitOffer,
        acceptOffer,
        rejectOffer,
        withdrawOffer,
        updateTransportStatus,
        updateLogisticsProfile,
        alertSettings,
        saveAlertSetting,
        deleteAlertSetting,
        alertNotifications,
        markAlertNotificationRead,
        clearAllAlertNotifications,
        triggerSimulatedAlert,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return ctx;
};
