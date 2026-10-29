import React, { useState } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { ReRouteLogo } from '../../assets/icons/ReRouteLogo';
import { Button } from './Button';

interface NavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath = '/', onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (target: string, isHash = false) => {
    setMobileMenuOpen(false);
    if (isHash) {
      if (currentPath !== '/') {
        if (onNavigate) {
          onNavigate('/');
          setTimeout(() => {
            const el = document.querySelector(target);
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          window.location.href = `/${target}`;
        }
      } else {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      if (onNavigate) {
        onNavigate(target);
      } else {
        window.history.pushState({}, '', target);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F4F0E6]/92 backdrop-blur-md border-b border-[#C1AEA0]/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Brand Wordmark Zone */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-[#17483C] rounded-[4px] text-left cursor-pointer"
          aria-label="ReRoute Home"
        >
          <ReRouteLogo variant="full" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#17483C]">
          <button
            onClick={() => handleNav('#how-it-works', true)}
            className="hover:text-[#6F452C] transition-colors py-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNav('/marketplace')}
            className="hover:text-[#6F452C] transition-colors py-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Marketplace
          </button>
          <button
            onClick={() => handleNav('#impact', true)}
            className="hover:text-[#6F452C] transition-colors py-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Circular Impact
          </button>
          <button
            onClick={() => handleNav('/dashboard')}
            className="text-[#317787] font-semibold hover:text-[#17483C] transition-colors py-1 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboards</span>
          </button>
        </nav>

        {/* Desktop Auth Buttons (Top-Right) */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleNav('/signin')}
            className="rounded-[6px] border border-[#A38B78]/40 bg-white/80 hover:bg-white text-[#17483C] font-semibold shadow-xs"
          >
            Sign In
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleNav('/signup')}
            className="rounded-[6px] shadow-xs"
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-[6px] text-[#17483C] hover:bg-[#EAE4D6] focus-visible:outline-2 focus-visible:outline-[#17483C] cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#C1AEA0]/40 bg-[#F4F0E6] px-4 pt-4 pb-6 space-y-4 shadow-lg animate-in fade-in duration-150">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => handleNav('#how-it-works', true)}
              className="text-left px-3 py-2 text-base font-medium text-[#17483C] hover:bg-[#EAE4D6] rounded-[6px] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNav('/marketplace')}
              className="text-left px-3 py-2 text-base font-medium text-[#17483C] hover:bg-[#EAE4D6] rounded-[6px] transition-colors cursor-pointer"
            >
              Marketplace
            </button>
            <button
              onClick={() => handleNav('#impact', true)}
              className="text-left px-3 py-2 text-base font-medium text-[#17483C] hover:bg-[#EAE4D6] rounded-[6px] transition-colors cursor-pointer"
            >
              Circular Impact
            </button>
            <button
              onClick={() => handleNav('/dashboard')}
              className="text-left px-3 py-2 text-base font-semibold text-[#317787] hover:bg-[#EAE4D6] rounded-[6px] transition-colors cursor-pointer flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Role Dashboards</span>
            </button>
          </nav>

          <div className="pt-3 border-t border-[#C1AEA0]/40 flex flex-col sm:hidden gap-2.5">
            <Button
              variant="secondary"
              size="md"
              className="w-full justify-center rounded-[6px] border border-[#A38B78]/40 bg-white/80 hover:bg-white text-[#17483C]"
              onClick={() => handleNav('/signin')}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center rounded-[6px]"
              onClick={() => handleNav('/signup')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
