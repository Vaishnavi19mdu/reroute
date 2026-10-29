import React from 'react';
import { ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { BuyerDashboard } from '../dashboard/BuyerDashboard';
import { Button } from '../../components/common/Button';

interface MarketplacePageProps {
  onNavigate: (path: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F5] text-[#1D1160]">
      {/* Top Navbar */}
      <Navbar currentPath="/marketplace" onNavigate={onNavigate} />

      {/* Hero subheader */}
      <div className="bg-[#17483C] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-[#12382F]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EDD17E] mb-1">
              <span>Public Agricultural Waste Exchange</span>
              <span aria-hidden="true" className="text-[#8FBC8B]">·</span>
              <span>Waste to Worth</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Agricultural Biomass & Residue Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-[#E6EEF2]/80 mt-1 max-w-2xl leading-relaxed">
              Explore post-harvest crop residues listed by regional agricultural producers. Submit transparent reverse bids for industrial bio-energy, paper pulp, and organic composting.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <Button
              variant="teal"
              size="sm"
              onClick={() => onNavigate('/dashboard/farmer')}
            >
              List Residue as Farmer
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('/')}
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Marketplace View */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <BuyerDashboard activeTab="marketplace" />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MarketplacePage;
