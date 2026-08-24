/**
 * The four tabs of the portal, in the order a developer meets them.
 * Source: the docs-ux specification (Overview, API references, What's new,
 * Support). The tab strip and the mobile menu both read this list, so a tab is
 * added in one place.
 */
export type Tab = {
  label: string;
  to: string;
  /** Route prefix that marks this tab active. */
  match: string;
  /** Sidebar id declared in sidebars.ts, used by the mobile menu. */
  sidebarId: string;
};

export const tabs: Tab[] = [
  {label: 'Overview', to: '/docs/overview', match: '/docs/overview', sidebarId: 'overviewSidebar'},
  {label: 'API references', to: '/docs/api', match: '/docs/api', sidebarId: 'apiSidebar'},
  {label: "What's new", to: '/docs/whats-new', match: '/docs/whats-new', sidebarId: 'whatsNewSidebar'},
  {label: 'Support', to: '/docs/support', match: '/docs/support', sidebarId: 'supportSidebar'},
];

/** Interactive OpenAPI references, rendered by Scalar on their own routes. */
export const referenceLinks = [
  {label: 'Gateway session', to: '/reference/hiecm-gateway'},
  {label: 'M1 ABHA identity', to: '/reference/hiecm-m1'},
  {label: 'M2 Linking and sharing', to: '/reference/hiecm-m2'},
  {label: 'M3 Consent and fetching', to: '/reference/hiecm-m3'},
  {label: 'M4 HPR and HFR', to: '/reference/hiecm-m4'},
];

export function activeTab(pathname: string): Tab | undefined {
  return tabs.find((tab) => pathname.startsWith(tab.match));
}
