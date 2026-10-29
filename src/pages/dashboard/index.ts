export * from './DashboardShell';
export * from './FarmerDashboard';
export * from './BuyerDashboard';
export * from './LogisticsDashboard';
export * from './AIAdvisorView';

export const DASHBOARD_ROUTES = {
  farmer: '/dashboard/farmer',
  buyer: '/dashboard/buyer',
  logistics: '/dashboard/logistics',
  marketplace: '/marketplace',
} as const;
