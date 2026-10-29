import React from 'react';
import { ReRouteLogo } from '../../assets/icons/ReRouteLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#17483C] text-white border-t border-[#12382F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Purpose Column */}
          <div className="md:col-span-2 space-y-4">
            <ReRouteLogo variant="full" isLight={true} />
            <p className="text-sm text-[#E6EEF2]/90 max-w-md leading-relaxed font-normal">
              ReRoute connects agricultural waste generators with businesses that can turn leftover crop materials into valuable resources through structured exchange, transparent offers, and circular logistics.
            </p>
            <div className="pt-1 text-xs text-[#8FBC8B]">
              <span>Team: Syndicates</span>
              <span className="mx-2 text-[#8FBC8B]/40">·</span>
              <span>Waste to Worth</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#EDD17E] mb-3.5 font-heading">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#E6EEF2]/85">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#marketplace" className="hover:text-white transition-colors">
                  Marketplace Preview
                </a>
              </li>
              <li>
                <a href="#impact" className="hover:text-white transition-colors">
                  Circular Impact Score
                </a>
              </li>
            </ul>
          </div>

          {/* Planned Participant Portals */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#EDD17E] mb-3.5 font-heading">
              Participant Roles
            </h4>
            <ul className="space-y-2 text-sm text-[#E6EEF2]/85">
              <li>
                <span className="text-[#8FBC8B] font-medium">Farmer / Generator</span>
                <span className="block text-[11px] text-[#E6EEF2]/60">List crop straw & stalks</span>
              </li>
              <li className="pt-1">
                <span className="text-[#8FBC8B] font-medium">Industrial Buyer</span>
                <span className="block text-[11px] text-[#E6EEF2]/60">Procure biomass & husks</span>
              </li>
              <li className="pt-1">
                <span className="text-[#8FBC8B] font-medium">Logistics Partner</span>
                <span className="block text-[11px] text-[#E6EEF2]/60">Coordinate rural hauling</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal / Editorial Note */}
        <div className="mt-10 pt-6 border-t border-[#12382F] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E6EEF2]/70">
          <p>
            ReRoute is an AI-powered agricultural waste exchange platform supporting sustainable circular resource recovery.
          </p>
          <p className="shrink-0">
            © {new Date().getFullYear()} ReRoute · Waste to Worth
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
