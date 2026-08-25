/**
 * Navigation model for the portal.
 *
 * Routing follows the reference portal: /docs/<platform>/<version>/<section>.
 * The platform is chosen from a picker at the top of the sidebar, not from the
 * tab strip, so a reader who has chosen a gateway keeps that choice while
 * moving through its guides.
 */

export type Tab = {
  id: 'overview' | 'api' | 'whats-new' | 'support';
  label: string;
  to: string;
  /** Route prefix that marks this tab active. */
  match: string;
};

export type Version = {
  label: string;
  /** Route for a version that exists here. Absent when it is not published. */
  to?: string;
  /** Why a reader cannot open it, shown in the picker. */
  note?: string;
};

export type Platform = {
  /** Short name, shown in the picker and in the breadcrumb. */
  id: string;
  label: string;
  /** One line under the label in the picker. */
  description: string;
  /** Version segment currently published for this platform. */
  version: string;
  /** Every version the picker offers, published or not. */
  versions: Version[];
  /** Where the API references tab sends the reader for this gateway. */
  apiTo: string;
  /** Where the picker sends the reader. */
  to: string;
  /** Route prefix that marks this platform current. */
  match: string;
};

export const platforms: Platform[] = [
  {
    id: 'hie-cm',
    label: 'HIE-CM',
    description: 'Health Information Exchange and Consent Manager',
    version: 'V3',
    versions: [
      {label: 'V3', to: '/docs/abdm/v3'},
      {label: 'V2', note: 'Not published here. NHA has retired it for new integrations.'},
    ],
    apiTo: '/docs/abdm/v3/api',
    to: '/docs/abdm/v3',
    match: '/docs/abdm',
  },
  {
    id: 'uhi',
    label: 'UHI',
    description: 'Unified Health Interface',
    version: 'V1',
    versions: [{label: 'V1', to: '/docs/uhi/v1'}],
    apiTo: '/docs/uhi/v1/api',
    to: '/docs/uhi/v1',
    match: '/docs/uhi',
  },
  {
    id: 'nhcx',
    label: 'NHCX',
    description: 'National Health Claims Exchange',
    version: 'V1',
    versions: [{label: 'V1', to: '/docs/nhcx/v1'}],
    apiTo: '/docs/nhcx/v1/api',
    to: '/docs/nhcx/v1',
    match: '/docs/nhcx',
  },
];

export type TabId = 'overview' | 'api' | 'whats-new' | 'support';

export const tabs: Tab[] = [
  {id: 'overview', label: 'Overview', to: '/docs/abdm/v3', match: '/docs/'},
  {id: 'api', label: 'API references', to: '/docs/abdm/v3/api', match: '/api'},
  {id: 'whats-new', label: "What's new", to: '/docs/whats-new', match: '/docs/whats-new'},
  {id: 'support', label: 'Support', to: '/docs/support', match: '/docs/support'},
];

/** The href for a tab, keeping the gateway the reader already chose. */
export function tabHref(tab: Tab, pathname: string): string {
  const platform = activePlatform(pathname);
  if (!platform) {
    return tab.to;
  }
  if (tab.id === 'overview') {
    return platform.to;
  }
  if (tab.id === 'api') {
    return `${platform.to}/api`;
  }
  return tab.to;
}

/** Interactive OpenAPI references, rendered by Scalar on their own routes. */
export const referenceLinks = [
  {label: 'Gateway session', to: '/reference/hiecm-gateway'},
  {label: 'M1 ABHA identity', to: '/reference/hiecm-m1'},
  {label: 'M2 Linking and sharing', to: '/reference/hiecm-m2'},
  {label: 'M3 Consent and fetching', to: '/reference/hiecm-m3'},
  {label: 'M4 HPR and HFR', to: '/reference/hiecm-m4'},
];

export function activePlatform(pathname: string): Platform | undefined {
  return platforms.find((platform) => pathname.startsWith(platform.match));
}

/**
 * Which tab a route belongs to. The two short tabs own their own prefixes.
 * Everything else under a gateway is either its API section or its overview.
 */
export function activeTab(pathname: string): Tab | undefined {
  const short = tabs.find(
    (tab) =>
      (tab.id === 'whats-new' || tab.id === 'support') &&
      pathname.startsWith(tab.match),
  );
  if (short) {
    return short;
  }
  const platform = activePlatform(pathname);
  if (platform) {
    return pathname.startsWith(`${platform.to}/api`)
      ? tabs.find((tab) => tab.id === 'api')
      : tabs.find((tab) => tab.id === 'overview');
  }
  return undefined;
}

/** The version the reader is on, or the platform's current one. */
export function activeVersion(platform: Platform, pathname: string): Version {
  return (
    platform.versions.find((v) => v.to && pathname.startsWith(v.to)) ??
    platform.versions.find((v) => v.label === platform.version) ??
    platform.versions[0]
  );
}
