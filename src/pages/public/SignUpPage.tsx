import React, { useState } from 'react';
import {
  ArrowLeft,
  Tractor,
  Factory,
  Truck,
  CheckCircle2,
  Check,
  MapPin,
  Locate,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';
import { ReRouteLogo } from '../../assets/icons/ReRouteLogo';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { PasswordInput } from '../../components/common/PasswordInput';
import { Modal } from '../../components/common/Modal';
import { useMarketplace, UserRole, UserProfile } from '../../services/api/marketplaceState';

interface SignUpPageProps {
  onNavigate: (path: string) => void;
}

const COMMON_STATES = [
  'Punjab',
  'Haryana',
  'Uttar Pradesh',
  'Maharashtra',
  'Gujarat',
  'Madhya Pradesh',
  'Rajasthan',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Tamil Nadu',
  'Bihar',
  'West Bengal',
  'Odisha',
  'Other',
];

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const { registerProfile } = useMarketplace();

  // Exactly 3 public participant roles (Admin is never public)
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  // Terms and Privacy modals
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Common User Profile Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Location State
  const [locationData, setLocationData] = useState({
    country: 'India',
    state: 'Punjab',
    city: '',
    postalCode: '',
    address: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });

  // Geolocation button state & messages
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoNotice, setGeoNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Role-Specific: Farmer
  const [farmerData, setFarmerData] = useState({
    farmName: '',
    residueTypes: ['Rice straw'] as string[],
    otherResidueText: '',
    availableQuantity: '',
    quantityUnit: 'tonnes' as 'tonnes' | 'kg',
    preferredContact: 'Phone Call',
  });

  // Role-Specific: Buyer
  const [buyerData, setBuyerData] = useState({
    companyName: '',
    buyerType: 'Biomass pellet & briquette manufacturer',
    otherBuyerTypeText: '',
    materialsOfInterest: ['Rice straw', 'Sugarcane bagasse'] as string[],
    purchasingCapacity: '',
    capacityUnit: 'tonnes' as 'tonnes' | 'kg',
    preferredContact: 'Email',
  });

  // Role-Specific: Logistics Partner
  const [logisticsData, setLogisticsData] = useState({
    businessOrOperatorName: '',
    serviceArea: '',
    vehicleTypes: ['Medium Commercial Vehicle (5–10 MT)'] as string[],
    loadCapacity: '',
    capacityUnit: 'tonnes' as 'tonnes' | 'kg',
    preferredContact: 'WhatsApp',
  });

  // Errors & feedback
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const clearError = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // Geolocation Trigger: Prompt browser geolocation ONLY on user click
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice({
        type: 'error',
        message: 'Geolocation is not supported by your browser. Please enter your location manually.',
      });
      return;
    }

    setGeoLoading(true);
    setGeoNotice(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setLocationData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
        }));

        // Attempt reverse geocoding via OpenStreetMap Nominatim with graceful fallback
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4500);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const detectedCity =
              addr.city ||
              addr.district ||
              addr.state_district ||
              addr.town ||
              addr.village ||
              addr.suburb ||
              '';
            const detectedState = addr.state || '';
            const detectedPostcode = addr.postcode || '';
            const detectedCountry = addr.country || 'India';

            setLocationData((prev) => ({
              ...prev,
              city: detectedCity || prev.city,
              state: detectedState || prev.state,
              postalCode: detectedPostcode || prev.postalCode,
              country: detectedCountry || prev.country,
              latitude: lat,
              longitude: lon,
            }));

            setGeoNotice({
              type: 'success',
              message: `Location detected (${detectedCity || 'Coordinates captured'}, ${detectedState || 'India'}). Please review and adjust if needed.`,
            });
            clearError('city');
            clearError('state');
            setGeoLoading(false);
            return;
          }
        } catch (err) {
          // Fallback if reverse geocoding network request times out or is offline
        }

        setGeoNotice({
          type: 'success',
          message: `Coordinates detected (${lat.toFixed(3)}°, ${lon.toFixed(3)}°). Please confirm your City and State below.`,
        });
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoNotice({
            type: 'error',
            message: 'Location access was denied. Please enter your location manually in the fields below.',
          });
        } else if (err.code === err.TIMEOUT) {
          setGeoNotice({
            type: 'error',
            message: 'Location request timed out. Please enter your location manually.',
          });
        } else {
          setGeoNotice({
            type: 'error',
            message: 'Unable to detect your position. Please enter your location manually.',
          });
        }
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    // Clear only role-specific errors while preserving common fields and errors
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith('farmer') || k.startsWith('buyer') || k.startsWith('logistics')) {
          delete next[k];
        }
      });
      return next;
    });
  };

  const handleToggleFarmerResidue = (type: string) => {
    setFarmerData((prev) => {
      const exists = prev.residueTypes.includes(type);
      const next = exists ? prev.residueTypes.filter((t) => t !== type) : [...prev.residueTypes, type];
      return { ...prev, residueTypes: next };
    });
    clearError('farmerResidues');
  };

  const handleToggleBuyerMaterial = (mat: string) => {
    setBuyerData((prev) => {
      const exists = prev.materialsOfInterest.includes(mat);
      const next = exists ? prev.materialsOfInterest.filter((m) => m !== mat) : [...prev.materialsOfInterest, mat];
      return { ...prev, materialsOfInterest: next };
    });
    clearError('buyerMaterials');
  };

  const handleToggleLogisticsVehicle = (veh: string) => {
    setLogisticsData((prev) => {
      const exists = prev.vehicleTypes.includes(veh);
      const next = exists ? prev.vehicleTypes.filter((v) => v !== veh) : [...prev.vehicleTypes, veh];
      return { ...prev, vehicleTypes: next };
    });
    clearError('logisticsVehicles');
  };

  // Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};

    // 1. First & Last Name validation (separate, trimmed, non-empty, Unicode-safe)
    if (!firstName.trim()) {
      errs.firstName = 'First name is required.';
    }
    if (!lastName.trim()) {
      errs.lastName = 'Last name is required.';
    }

    // 2. Email validation
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    // 3. Password validation
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm your password.';
    } else if (confirmPassword !== password) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    // 4. Location validation
    if (!locationData.country.trim()) {
      errs.country = 'Country is required.';
    }
    if (!locationData.state.trim()) {
      errs.state = 'State / Region is required.';
    }
    if (!locationData.city.trim()) {
      errs.city = 'City or District is required.';
    }

    // 5. Role-specific validation
    if (selectedRole === 'farmer') {
      if (farmerData.residueTypes.length === 0) {
        errs.farmerResidues = 'Please select at least one available crop residue.';
      }
      if (farmerData.residueTypes.includes('Other agricultural residues') && !farmerData.otherResidueText.trim()) {
        errs.farmerOtherResidue = 'Please describe your other residue material.';
      }
      if (!farmerData.availableQuantity.trim()) {
        errs.farmerQuantity = 'Approximate residue quantity is required.';
      } else if (isNaN(Number(farmerData.availableQuantity)) || Number(farmerData.availableQuantity) <= 0) {
        errs.farmerQuantity = 'Please enter a valid positive quantity.';
      }
    } else if (selectedRole === 'buyer') {
      if (!buyerData.companyName.trim()) {
        errs.buyerCompany = 'Company or business name is required.';
      }
      if (buyerData.materialsOfInterest.length === 0) {
        errs.buyerMaterials = 'Select at least one agricultural material of interest.';
      }
      if (!buyerData.purchasingCapacity.trim()) {
        errs.buyerCapacity = 'Approximate purchasing capacity is required.';
      } else if (isNaN(Number(buyerData.purchasingCapacity)) || Number(buyerData.purchasingCapacity) <= 0) {
        errs.buyerCapacity = 'Please enter a valid positive capacity.';
      }
    } else if (selectedRole === 'logistics') {
      if (!logisticsData.businessOrOperatorName.trim()) {
        errs.logisticsName = 'Fleet operator or company name is required.';
      }
      if (!logisticsData.serviceArea.trim()) {
        errs.logisticsArea = 'Service coverage area or districts is required.';
      }
      if (logisticsData.vehicleTypes.length === 0) {
        errs.logisticsVehicles = 'Select at least one available vehicle type.';
      }
      if (!logisticsData.loadCapacity.trim()) {
        errs.logisticsCapacity = 'Vehicle load capacity is required.';
      } else if (isNaN(Number(logisticsData.loadCapacity)) || Number(logisticsData.loadCapacity) <= 0) {
        errs.logisticsCapacity = 'Please enter a valid positive load capacity.';
      }
    }

    // 6. Terms
    if (!agreedToTerms) {
      errs.terms = 'You must agree to the Terms of Service and Privacy Policy.';
    }

    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstKey);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});

    // Construct persistent user profile
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    const organizationName =
      selectedRole === 'farmer'
        ? farmerData.farmName.trim() || `${trimmedFirst}'s Farm Collective`
        : selectedRole === 'buyer'
        ? buyerData.companyName.trim()
        : logisticsData.businessOrOperatorName.trim();

    const newProfile: Omit<UserProfile, 'id'> = {
      firstName: trimmedFirst,
      lastName: trimmedLast,
      email: email.trim(),
      role: selectedRole,
      phoneNumber: phoneNumber.trim() || undefined,
      organizationName,
      location: {
        country: locationData.country.trim(),
        state: locationData.state.trim(),
        city: locationData.city.trim(),
        postalCode: locationData.postalCode.trim() || undefined,
        address: locationData.address.trim() || undefined,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      },
      farmerDetails:
        selectedRole === 'farmer'
          ? {
              farmName: farmerData.farmName.trim() || undefined,
              residueTypes: farmerData.residueTypes,
              availableQuantity: farmerData.availableQuantity,
              quantityUnit: farmerData.quantityUnit,
              preferredContact: farmerData.preferredContact,
            }
          : undefined,
      buyerDetails:
        selectedRole === 'buyer'
          ? {
              companyName: buyerData.companyName.trim(),
              buyerType: buyerData.buyerType,
              materialsOfInterest: buyerData.materialsOfInterest,
              purchasingCapacity: buyerData.purchasingCapacity,
              capacityUnit: buyerData.capacityUnit,
              preferredContact: buyerData.preferredContact,
            }
          : undefined,
      logisticsDetails:
        selectedRole === 'logistics'
          ? {
              operatorName: logisticsData.businessOrOperatorName.trim(),
              vehicleTypes: logisticsData.vehicleTypes,
              loadCapacity: logisticsData.loadCapacity,
              capacityUnit: logisticsData.capacityUnit,
              serviceArea: logisticsData.serviceArea.trim(),
              preferredContact: logisticsData.preferredContact,
            }
          : undefined,
    };

    // Save profile to app state and localStorage
    registerProfile(newProfile);

    // Navigate to role-specific dashboard
    onNavigate(`/dashboard/${selectedRole}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col justify-between text-[#1D1160]">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E2EBE5] py-4 px-4 sm:px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="cursor-pointer focus-visible:outline-2 focus-visible:outline-[#17483C] rounded-[4px]"
            aria-label="ReRoute Home"
          >
            <ReRouteLogo variant="full" />
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#17483C] hover:text-[#317787] transition-colors cursor-pointer py-1.5 px-2.5 rounded-[4px] hover:bg-[#F4F7F5]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Registration Form */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 my-6 sm:my-8">
        <div className="bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs p-6 sm:p-8 space-y-6">
          
          {/* Clean Concise Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17483C] font-heading">
              Create your ReRoute account
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1.5 leading-relaxed">
              Join the circular agricultural exchange to trade crop residue, reduce burning, and source biomass.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            
            {/* 1. PUBLIC ROLE SELECTION (Strictly 3 Public Roles) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17483C] font-heading">
                Participant Role <span className="text-[#33006F]">*</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Farmer */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('farmer')}
                  className={`p-4 rounded-[6px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedRole === 'farmer'
                      ? 'border-[#17483C] bg-[#F4F7F5] ring-2 ring-[#17483C]/10 shadow-xs'
                      : 'border-[#E2EBE5] bg-white hover:border-[#8FBC8B]'
                  }`}
                  aria-pressed={selectedRole === 'farmer'}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-[6px] ${selectedRole === 'farmer' ? 'bg-[#17483C] text-white' : 'bg-[#E6EEF2] text-[#17483C]'}`}>
                      <Tractor className="w-4 h-4" />
                    </div>
                    {selectedRole === 'farmer' && (
                      <span className="text-[10px] font-bold uppercase text-[#088A1A] bg-[#8FBC8B]/20 px-1.5 py-0.5 rounded-[4px]">
                        Selected
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#17483C] font-heading">
                      Farmer / Generator
                    </h3>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                      List farm crop straw, bagasse, and dry biomass.
                    </p>
                  </div>
                </button>

                {/* Buyer */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('buyer')}
                  className={`p-4 rounded-[6px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedRole === 'buyer'
                      ? 'border-[#1D1160] bg-[#F4F7F5] ring-2 ring-[#1D1160]/10 shadow-xs'
                      : 'border-[#E2EBE5] bg-white hover:border-[#317787]'
                  }`}
                  aria-pressed={selectedRole === 'buyer'}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-[6px] ${selectedRole === 'buyer' ? 'bg-[#1D1160] text-white' : 'bg-[#E6EEF2] text-[#1D1160]'}`}>
                      <Factory className="w-4 h-4" />
                    </div>
                    {selectedRole === 'buyer' && (
                      <span className="text-[10px] font-bold uppercase text-[#1D1160] bg-[#33006F]/10 px-1.5 py-0.5 rounded-[4px]">
                        Selected
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#1D1160] font-heading">
                      Buyer
                    </h3>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                      Source biomass for energy, pulp, and composting.
                    </p>
                  </div>
                </button>

                {/* Logistics */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('logistics')}
                  className={`p-4 rounded-[6px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedRole === 'logistics'
                      ? 'border-[#317787] bg-[#F4F7F5] ring-2 ring-[#317787]/10 shadow-xs'
                      : 'border-[#E2EBE5] bg-white hover:border-[#1D1160]'
                  }`}
                  aria-pressed={selectedRole === 'logistics'}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-[6px] ${selectedRole === 'logistics' ? 'bg-[#317787] text-white' : 'bg-[#E6EEF2] text-[#317787]'}`}>
                      <Truck className="w-4 h-4" />
                    </div>
                    {selectedRole === 'logistics' && (
                      <span className="text-[10px] font-bold uppercase text-[#317787] bg-[#317787]/10 px-1.5 py-0.5 rounded-[4px]">
                        Selected
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#317787] font-heading">
                      Logistics Partner
                    </h3>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                      Provide farm pickup and fleet hauling services.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. PERSONAL NAME & LOGIN CREDENTIALS */}
            <div className="pt-4 border-t border-[#E2EBE5] space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#17483C] font-heading">
                Account Details
              </h2>

              {/* First Name & Last Name (Side-by-side desktop, stacked mobile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  id="firstName"
                  required
                  error={errors.firstName}
                >
                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      clearError('firstName');
                    }}
                    placeholder="e.g. Priya"
                    aria-invalid={!!errors.firstName}
                    className={`w-full px-3 py-2 rounded-[6px] border text-sm text-[#1D1160] transition-colors focus:outline-none focus:ring-2 focus:ring-[#17483C]/20 ${
                      errors.firstName ? 'border-[#C5221F] bg-[#FFF8F8]' : 'border-[#D5DFD9] bg-white'
                    }`}
                  />
                </FormField>

                <FormField
                  label="Last Name"
                  id="lastName"
                  required
                  error={errors.lastName}
                >
                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      clearError('lastName');
                    }}
                    placeholder="e.g. Sharma"
                    aria-invalid={!!errors.lastName}
                    className={`w-full px-3 py-2 rounded-[6px] border text-sm text-[#1D1160] transition-colors focus:outline-none focus:ring-2 focus:ring-[#17483C]/20 ${
                      errors.lastName ? 'border-[#C5221F] bg-[#FFF8F8]' : 'border-[#D5DFD9] bg-white'
                    }`}
                  />
                </FormField>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Email Address"
                  id="email"
                  required
                  error={errors.email}
                >
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError('email');
                    }}
                    placeholder="name@example.com"
                    aria-invalid={!!errors.email}
                    className={`w-full px-3 py-2 rounded-[6px] border text-sm text-[#1D1160] transition-colors focus:outline-none focus:ring-2 focus:ring-[#17483C]/20 ${
                      errors.email ? 'border-[#C5221F] bg-[#FFF8F8]' : 'border-[#D5DFD9] bg-white'
                    }`}
                  />
                </FormField>

                <FormField
                  label="Phone Number"
                  id="phoneNumber"
                  optional
                  helperText="10-digit mobile number for dispatch alerts"
                >
                  <input
                    id="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                  />
                </FormField>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Password"
                  id="password"
                  required
                  helperText="Minimum 8 characters"
                  error={errors.password}
                >
                  <PasswordInput
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError('password');
                    }}
                    placeholder="Create a password"
                    hasError={!!errors.password}
                  />
                </FormField>

                <FormField
                  label="Confirm Password"
                  id="confirmPassword"
                  required
                  error={errors.confirmPassword}
                >
                  <PasswordInput
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearError('confirmPassword');
                    }}
                    placeholder="Re-enter password"
                    hasError={!!errors.confirmPassword}
                  />
                </FormField>
              </div>
            </div>

            {/* 3. LOCATION SPECIFICATION (Geolocation + Manual Entry) */}
            <div className="pt-4 border-t border-[#E2EBE5] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#17483C] font-heading">
                    Location & Regional Hub
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Used to connect you with nearby agricultural residues, buyers, and transport fleets to minimize logistics costs.
                  </p>
                </div>

                {/* Option A: "Use My Current Location" button */}
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={geoLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold text-[#17483C] bg-[#8FBC8B]/20 hover:bg-[#8FBC8B]/30 border border-[#8FBC8B]/50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {geoLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#17483C]" />
                  ) : (
                    <Locate className="w-3.5 h-3.5 text-[#17483C]" />
                  )}
                  <span>{geoLoading ? 'Detecting Location...' : 'Use My Current Location'}</span>
                </button>
              </div>

              {/* Inline Geolocation Feedback */}
              {geoNotice && (
                <div
                  className={`p-3 rounded-[6px] text-xs flex items-start justify-between gap-2 border ${
                    geoNotice.type === 'success'
                      ? 'bg-[#8FBC8B]/15 border-[#8FBC8B] text-[#17483C]'
                      : 'bg-[#FFF8F8] border-[#E2B0B0] text-[#C5221F]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {geoNotice.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#088A1A] shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-[#C5221F] shrink-0 mt-0.5" />
                    )}
                    <p className="leading-snug">{geoNotice.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGeoNotice(null)}
                    className="text-neutral-400 hover:text-neutral-600 p-0.5"
                    aria-label="Dismiss notice"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Option B: Manual Location Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Country */}
                <FormField label="Country" id="country" required error={errors.country}>
                  <input
                    id="country"
                    type="text"
                    value={locationData.country}
                    onChange={(e) => {
                      setLocationData({ ...locationData, country: e.target.value });
                      clearError('country');
                    }}
                    placeholder="e.g. India"
                    className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                  />
                </FormField>

                {/* State / Region */}
                <FormField label="State / Region" id="state" required error={errors.state}>
                  <select
                    id="state"
                    value={locationData.state}
                    onChange={(e) => {
                      setLocationData({ ...locationData, state: e.target.value });
                      clearError('state');
                    }}
                    className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                  >
                    {COMMON_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </FormField>

                {/* City / District */}
                <FormField label="City / District" id="city" required error={errors.city}>
                  <input
                    id="city"
                    type="text"
                    value={locationData.city}
                    onChange={(e) => {
                      setLocationData({ ...locationData, city: e.target.value });
                      clearError('city');
                    }}
                    placeholder="e.g. Sangrur or Kolhapur"
                    className={`w-full px-3 py-2 rounded-[6px] border text-sm text-[#1D1160] ${
                      errors.city ? 'border-[#C5221F] bg-[#FFF8F8]' : 'border-[#D5DFD9] bg-white'
                    }`}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Postal Code */}
                <FormField
                  label="Postal / PIN Code"
                  id="postalCode"
                  optional
                  helperText="Helps pinpoint local hauling radii"
                >
                  <input
                    id="postalCode"
                    type="text"
                    value={locationData.postalCode}
                    onChange={(e) => setLocationData({ ...locationData, postalCode: e.target.value })}
                    placeholder="e.g. 148028"
                    className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                  />
                </FormField>

                {/* Street / Pickup Address */}
                <FormField
                  label="Street or Facility Address"
                  id="address"
                  optional
                  helperText="Primary gate or staging area"
                >
                  <input
                    id="address"
                    type="text"
                    value={locationData.address}
                    onChange={(e) => setLocationData({ ...locationData, address: e.target.value })}
                    placeholder="e.g. Sunam Tehsil, Staging Area 2"
                    className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                  />
                </FormField>
              </div>
            </div>

            {/* 4. DYNAMIC ROLE-SPECIFIC FIELDS */}
            <div className="pt-4 border-t border-[#E2EBE5] space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#17483C] font-heading">
                {selectedRole === 'farmer' && 'Farmer & Residue Details'}
                {selectedRole === 'buyer' && 'Buyer & Procurement Specifications'}
                {selectedRole === 'logistics' && 'Transport Fleet & Service Details'}
              </h2>

              {/* FARMER SPECIFIC */}
              {selectedRole === 'farmer' && (
                <div className="space-y-4">
                  <FormField
                    label="Farm or Business Name"
                    id="farmName"
                    optional
                    helperText="Optional for individual smallholders"
                  >
                    <input
                      id="farmName"
                      type="text"
                      value={farmerData.farmName}
                      onChange={(e) => setFarmerData({ ...farmerData, farmName: e.target.value })}
                      placeholder="e.g. Green Acres Farm or Kisan Collective"
                      className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                    />
                  </FormField>

                  {/* Residue Types */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#17483C]">
                      Available Agricultural Residues <span className="text-[#33006F]">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        'Rice straw',
                        'Rice husk',
                        'Sugarcane bagasse',
                        'Groundnut shells',
                        'Cotton stalks',
                        'Other agricultural residues',
                      ].map((item) => {
                        const checked = farmerData.residueTypes.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => handleToggleFarmerResidue(item)}
                            className={`p-2.5 rounded-[6px] border text-left text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                              checked
                                ? 'bg-[#17483C] text-white border-[#17483C]'
                                : 'bg-white text-[#334155] border-[#D5DFD9] hover:bg-[#F4F7F5]'
                            }`}
                          >
                            <span>{item}</span>
                            {checked && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                    {errors.farmerResidues && (
                      <p className="text-[11px] text-[#C5221F] font-medium">{errors.farmerResidues}</p>
                    )}

                    {farmerData.residueTypes.includes('Other agricultural residues') && (
                      <div className="mt-2 p-3 bg-[#F4F7F5] rounded-[6px] border border-[#E2EBE5]">
                        <FormField
                          label="Describe Other Residue Material"
                          id="otherResidueText"
                          required
                          error={errors.farmerOtherResidue}
                        >
                          <input
                            id="otherResidueText"
                            type="text"
                            value={farmerData.otherResidueText}
                            onChange={(e) => {
                              setFarmerData({ ...farmerData, otherResidueText: e.target.value });
                              clearError('farmerOtherResidue');
                            }}
                            placeholder="e.g. Mustard stalks, soybean straw, coconut coir"
                            className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                          />
                        </FormField>
                      </div>
                    )}
                  </div>

                  {/* Quantity & Unit */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <FormField
                        label="Approximate Available Residue Quantity"
                        id="farmerQuantity"
                        required
                        error={errors.farmerQuantity}
                      >
                        <input
                          id="farmerQuantity"
                          type="number"
                          min="1"
                          value={farmerData.availableQuantity}
                          onChange={(e) => {
                            setFarmerData({ ...farmerData, availableQuantity: e.target.value });
                            clearError('farmerQuantity');
                          }}
                          placeholder="e.g. 50"
                          className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                        />
                      </FormField>
                    </div>

                    <FormField label="Unit" id="quantityUnit" required>
                      <select
                        id="quantityUnit"
                        value={farmerData.quantityUnit}
                        onChange={(e) => setFarmerData({ ...farmerData, quantityUnit: e.target.value as 'tonnes' | 'kg' })}
                        className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                      >
                        <option value="tonnes">tonnes (MT)</option>
                        <option value="kg">kilograms (kg)</option>
                      </select>
                    </FormField>
                  </div>
                </div>
              )}

              {/* BUYER SPECIFIC */}
              {selectedRole === 'buyer' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Company or Business Name"
                      id="buyerCompany"
                      required
                      error={errors.buyerCompany}
                    >
                      <input
                        id="buyerCompany"
                        type="text"
                        value={buyerData.companyName}
                        onChange={(e) => {
                          setBuyerData({ ...buyerData, companyName: e.target.value });
                          clearError('buyerCompany');
                        }}
                        placeholder="e.g. BioPower Clean Fuels Ltd"
                        className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                      />
                    </FormField>

                    <FormField label="Buyer Category" id="buyerType" required>
                      <select
                        id="buyerType"
                        value={buyerData.buyerType}
                        onChange={(e) => setBuyerData({ ...buyerData, buyerType: e.target.value })}
                        className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                      >
                        <option value="Biomass pellet & briquette manufacturer">Biomass Pellet & Briquette Manufacturer</option>
                        <option value="Agro-paper & pulp mill">Agro-Paper & Pulp Mill</option>
                        <option value="Industrial boiler & cogeneration">Industrial Boiler & Cogeneration</option>
                        <option value="Bio-fertilizer & compost producer">Bio-Fertilizer & Compost Producer</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormField>
                  </div>

                  {/* Materials of Interest */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#17483C]">
                      Target Biomass Materials of Interest <span className="text-[#33006F]">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        'Rice straw',
                        'Rice husk',
                        'Sugarcane bagasse',
                        'Groundnut shells',
                        'Cotton stalks',
                        'Other residues',
                      ].map((item) => {
                        const checked = buyerData.materialsOfInterest.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => handleToggleBuyerMaterial(item)}
                            className={`p-2.5 rounded-[6px] border text-left text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                              checked
                                ? 'bg-[#1D1160] text-white border-[#1D1160]'
                                : 'bg-white text-[#334155] border-[#D5DFD9] hover:bg-[#F4F7F5]'
                            }`}
                          >
                            <span>{item}</span>
                            {checked && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                    {errors.buyerMaterials && (
                      <p className="text-[11px] text-[#C5221F] font-medium">{errors.buyerMaterials}</p>
                    )}
                  </div>

                  {/* Purchasing Capacity */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <FormField
                        label="Approximate Monthly Purchasing Capacity"
                        id="buyerCapacity"
                        required
                        error={errors.buyerCapacity}
                      >
                        <input
                          id="buyerCapacity"
                          type="number"
                          min="1"
                          value={buyerData.purchasingCapacity}
                          onChange={(e) => {
                            setBuyerData({ ...buyerData, purchasingCapacity: e.target.value });
                            clearError('buyerCapacity');
                          }}
                          placeholder="e.g. 500"
                          className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                        />
                      </FormField>
                    </div>

                    <FormField label="Unit" id="buyerCapacityUnit" required>
                      <select
                        id="buyerCapacityUnit"
                        value={buyerData.capacityUnit}
                        onChange={(e) => setBuyerData({ ...buyerData, capacityUnit: e.target.value as 'tonnes' | 'kg' })}
                        className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                      >
                        <option value="tonnes">tonnes / month</option>
                        <option value="kg">kg / month</option>
                      </select>
                    </FormField>
                  </div>
                </div>
              )}

              {/* LOGISTICS SPECIFIC */}
              {selectedRole === 'logistics' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Logistics Business or Fleet Operator Name"
                      id="logisticsName"
                      required
                      error={errors.logisticsName}
                    >
                      <input
                        id="logisticsName"
                        type="text"
                        value={logisticsData.businessOrOperatorName}
                        onChange={(e) => {
                          setLogisticsData({ ...logisticsData, businessOrOperatorName: e.target.value });
                          clearError('logisticsName');
                        }}
                        placeholder="e.g. Kisan Rural Freight Carrier"
                        className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                      />
                    </FormField>

                    <FormField
                      label="Service Coverage Area / Radius"
                      id="logisticsArea"
                      required
                      helperText="Districts or corridors served"
                      error={errors.logisticsArea}
                    >
                      <input
                        id="logisticsArea"
                        type="text"
                        value={logisticsData.serviceArea}
                        onChange={(e) => {
                          setLogisticsData({ ...logisticsData, serviceArea: e.target.value });
                          clearError('logisticsArea');
                        }}
                        placeholder="e.g. Sangrur, Patiala, Ludhiana & Bathinda"
                        className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                      />
                    </FormField>
                  </div>

                  {/* Vehicle Types */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#17483C]">
                      Available Transport Vehicle Fleet <span className="text-[#33006F]">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Medium Commercial Vehicle (5–10 MT)',
                        'Heavy Multi-Axle Truck (15–25 MT)',
                        'High-Cage Tarp Trailer (Bulky Straw)',
                        'Tractor Trolley / Tipper (Local Yard Haul)',
                      ].map((item) => {
                        const checked = logisticsData.vehicleTypes.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => handleToggleLogisticsVehicle(item)}
                            className={`p-2.5 rounded-[6px] border text-left text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                              checked
                                ? 'bg-[#317787] text-white border-[#317787]'
                                : 'bg-white text-[#334155] border-[#D5DFD9] hover:bg-[#F4F7F5]'
                            }`}
                          >
                            <span>{item}</span>
                            {checked && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                    {errors.logisticsVehicles && (
                      <p className="text-[11px] text-[#C5221F] font-medium">{errors.logisticsVehicles}</p>
                    )}
                  </div>

                  {/* Load Capacity */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <FormField
                        label="Combined Fleet Hauling Capacity"
                        id="logisticsCapacity"
                        required
                        error={errors.logisticsCapacity}
                      >
                        <input
                          id="logisticsCapacity"
                          type="number"
                          min="1"
                          value={logisticsData.loadCapacity}
                          onChange={(e) => {
                            setLogisticsData({ ...logisticsData, loadCapacity: e.target.value });
                            clearError('logisticsCapacity');
                          }}
                          placeholder="e.g. 45"
                          className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                        />
                      </FormField>
                    </div>

                    <FormField label="Capacity Unit" id="logisticsCapacityUnit" required>
                      <select
                        id="logisticsCapacityUnit"
                        value={logisticsData.capacityUnit}
                        onChange={(e) => setLogisticsData({ ...logisticsData, capacityUnit: e.target.value as 'tonnes' | 'kg' })}
                        className="w-full px-3 py-2 rounded-[6px] border border-[#D5DFD9] bg-white text-sm text-[#1D1160]"
                      >
                        <option value="tonnes">tonnes payload</option>
                        <option value="kg">kg payload</option>
                      </select>
                    </FormField>
                  </div>
                </div>
              )}
            </div>

            {/* 5. TERMS & CONDITIONS */}
            <div className="pt-4 border-t border-[#E2EBE5] space-y-2">
              <label className="flex items-start gap-2.5 text-xs text-[#334155] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    clearError('terms');
                  }}
                  className="w-4 h-4 mt-0.5 rounded-[4px] border-[#D5DFD9] text-[#17483C] focus:ring-[#17483C] cursor-pointer"
                />
                <span>
                  I agree to the ReRoute{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTermsModalOpen(true);
                    }}
                    className="font-bold text-[#17483C] hover:text-[#317787] underline underline-offset-2"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrivacyModalOpen(true);
                    }}
                    className="font-bold text-[#17483C] hover:text-[#317787] underline underline-offset-2"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="text-[11px] text-[#C5221F] font-medium">{errors.terms}</p>
              )}
            </div>

            {/* 6. PRIMARY CREATE ACCOUNT BUTTON */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center"
              >
                Create Account as {selectedRole === 'farmer' ? 'Farmer / Generator' : selectedRole === 'buyer' ? 'Industrial Buyer' : 'Logistics Partner'}
              </Button>
            </div>

          </form>

          {/* Switch to Sign In */}
          <div className="pt-4 border-t border-[#E2EBE5] text-center text-xs text-[#64748B]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/signin')}
              className="font-bold text-[#17483C] hover:text-[#317787] underline underline-offset-2 cursor-pointer"
            >
              Sign In
            </button>
          </div>

        </div>
      </main>

      {/* Mini Footer */}
      <footer className="text-center py-4 px-4 text-xs text-[#64748B] border-t border-[#E2EBE5] bg-white">
        <p>ReRoute · Waste to Worth · Team Syndicates</p>
      </footer>

      {/* Terms of Service Modal */}
      <Modal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        title="ReRoute Terms of Service"
        subtitle="Platform Participation Guidelines"
      >
        <div className="space-y-3 text-xs text-[#334155] leading-relaxed">
          <p>
            Welcome to <strong>ReRoute — Waste to Worth</strong>. By participating in this agricultural residue exchange platform, participants agree to:
          </p>
          <ul className="list-disc pl-4 space-y-1.5 text-neutral-600">
            <li>Provide honest, accurate disclosures of crop residue species, moisture condition, and staged farm locations.</li>
            <li>Submit legitimate, transparent price bids for intended circular industrial conversion.</li>
            <li>Honor coordinated pickup schedules to facilitate safe, clean rural transport and eliminate post-harvest open burning.</li>
            <li>Adhere to fair trading, digital escrow weighbridge verification, and responsible biomass handling standards.</li>
          </ul>
        </div>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        title="ReRoute Privacy Policy"
        subtitle="Agricultural Data Protection"
      >
        <div className="space-y-3 text-xs text-[#334155] leading-relaxed">
          <p>
            ReRoute respects the privacy of farmers, industrial procurement teams, and logistics fleets.
          </p>
          <ul className="list-disc pl-4 space-y-1.5 text-neutral-600">
            <li>Pickup geo-coordinates are shared strictly with certified carriers and bidding buyers upon deal acceptance.</li>
            <li>Contact channels are utilized solely for transaction dispatch alerts, reverse bid notifications, and logistics coordination.</li>
            <li>No personal identification data is monetized or transferred to unrelated marketing entities.</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default SignUpPage;
