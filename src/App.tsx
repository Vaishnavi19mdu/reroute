/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LandingPage, SignInPage, SignUpPage, MarketplacePage } from './pages/public';
import {
  DashboardShell,
  FarmerDashboard,
  BuyerDashboard,
  LogisticsDashboard,
} from './pages/dashboard';
import { MarketplaceProvider, useMarketplace, UserRole } from './services/api';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const { activeRole, setActiveRole } = useMarketplace();

  // Browser back/forward navigation handler
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      if (path === '/dashboard/farmer') {
        setActiveRole('farmer');
        setActiveTab('overview');
      } else if (path === '/dashboard/buyer') {
        setActiveRole('buyer');
        setActiveTab('overview');
      } else if (path === '/dashboard/logistics') {
        setActiveRole('logistics');
        setActiveTab('overview');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveRole]);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated role change handler that keeps role state, tab, and URL synchronized
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setActiveTab('overview');
    window.history.pushState({}, '', `/dashboard/${role}`);
    setCurrentPath(`/dashboard/${role}`);
  };

  // Sync route on direct URL navigation without overriding user-initiated role switches
  useEffect(() => {
    if (currentPath === '/dashboard/farmer' && activeRole !== 'farmer') {
      setActiveRole('farmer');
      setActiveTab('overview');
    } else if (currentPath === '/dashboard/buyer' && activeRole !== 'buyer') {
      setActiveRole('buyer');
      setActiveTab('overview');
    } else if (currentPath === '/dashboard/logistics' && activeRole !== 'logistics') {
      setActiveRole('logistics');
      setActiveTab('overview');
    } else if (currentPath === '/dashboard') {
      // Sync URL to match active role
      window.history.replaceState({}, '', `/dashboard/${activeRole}`);
    }
  }, [currentPath]); // Only depend on currentPath so that role switches are never reverted

  // Route dispatching
  if (currentPath === '/signin') {
    return <SignInPage onNavigate={navigate} initialMode="signin" />;
  }

  if (currentPath === '/forgot-password') {
    return <SignInPage onNavigate={navigate} initialMode="forgot" />;
  }

  if (currentPath === '/signup') {
    return <SignUpPage onNavigate={navigate} />;
  }

  if (currentPath === '/marketplace') {
    return <MarketplacePage onNavigate={navigate} />;
  }

  // Dashboard routes
  if (currentPath.startsWith('/dashboard')) {
    const renderActiveDashboard = () => {
      if (activeRole === 'farmer') {
        return <FarmerDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
      }
      if (activeRole === 'buyer') {
        return <BuyerDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
      }
      return <LogisticsDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
    };

    return (
      <DashboardShell
        onNavigate={navigate}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRoleChange={handleRoleChange}
      >
        {renderActiveDashboard()}
      </DashboardShell>
    );
  }

  // Default to LandingPage for '/' or any sub-anchor
  return <LandingPage onNavigate={navigate} />;
}

export default function App() {
  return (
    <MarketplaceProvider>
      <AppContent />
    </MarketplaceProvider>
  );
}
