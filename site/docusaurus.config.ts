import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {ScalarOptions} from '@scalar/docusaurus';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Tailwind v4 runs as a PostCSS plugin; Docusaurus exposes the PostCSS chain
// through this hook, so no separate build step is needed.
function tailwindPlugin() {
  return {
    name: 'tailwind-plugin',
    configurePostCss(postcssOptions: {plugins: unknown[]}) {
      postcssOptions.plugins = [require('@tailwindcss/postcss')];
      return postcssOptions;
    },
  };
}

// One interactive reference per specification file. Every instance is
// self-hosted: the bundle is vendored, and Scalar's cloud services stay off.
const references = [
  {id: 'hiecm-gateway', label: 'Gateway session', spec: 'hiecm-gateway.yaml'},
  {id: 'hiecm-m1', label: 'M1 ABHA identity', spec: 'hiecm-m1.yaml'},
  {id: 'hiecm-m2', label: 'M2 Linking and sharing', spec: 'hiecm-m2.yaml'},
  {id: 'hiecm-m3', label: 'M3 Consent and fetching', spec: 'hiecm-m3.yaml'},
  {id: 'hiecm-m4', label: 'M4 HPR and HFR', spec: 'hiecm-m4.yaml'},
];

const scalarPlugins = references.map(
  (reference) =>
    [
      '@scalar/docusaurus',
      {
        id: reference.id,
        label: reference.label,
        route: `/reference/${reference.id}`,
        showNavLink: false,
        // Serve the reference bundle from our own origin, not jsdelivr.
        // Vendored by scripts/sync-specs.mjs from @scalar/api-reference.
        cdn: '/vendor/scalar/standalone.js',
        configuration: {
          url: `/specs/${reference.spec}`,
          // Self-hosted: no Scalar cloud services. "Try it" requests go
          // directly from the browser, so target APIs must allow CORS, or
          // proxyUrl must point to a proxy in our own infrastructure
          // (Scalar's proxy server is open source and self-hostable).
          proxyUrl: '',
          telemetry: false,
          // Links to client.scalar.com, a hosted service.
          hideClientButton: true,
          agent: {
            disabled: true,
          },
          showDeveloperTools: 'never',
        },
      } as ScalarOptions,
    ],
);

const catalogueVersion = readFileSync(
  join(__dirname, '../catalogue/VERSION'),
  'utf8',
).trim();

const config: Config = {
  title: 'ABDM Developer Portal',
  tagline: 'One catalogue of ABDM, readable by humans and machines',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://abdm-docs.example.com',
  baseUrl: '/',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
          breadcrumbs: false,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [tailwindPlugin, ...scalarPlugins],

  themes: [
    // Open source local search, indexed at build time. No third party service.
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 10,
      },
    ],
    '@docusaurus/theme-mermaid',
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: false,
      },
    },
    navbar: {
      title: 'ABDM Developer Portal',
      logo: {
        alt: '',
        src: 'img/logo.svg',
      },
      hideOnScroll: false,
      items: [
        {
          href: 'https://sandbox.abdm.gov.in',
          label: 'ABDM sandbox',
          position: 'right',
        },
        {
          href: 'https://github.com/eka-care/abdm-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Overview',
          items: [
            {label: 'What ABDM is', to: '/docs/overview'},
            {label: 'Get started', to: '/docs/overview/get-started'},
            {label: 'Glossary', to: '/docs/overview/glossary'},
          ],
        },
        {
          title: 'API references',
          items: [
            {label: 'Choose your gateway', to: '/docs/api'},
            {label: 'M1 ABHA identity', to: '/reference/hiecm-m1'},
            {label: 'M2 Linking and sharing', to: '/reference/hiecm-m2'},
            {label: 'M3 Consent and fetching', to: '/reference/hiecm-m3'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: "What's new", to: '/docs/whats-new'},
            {label: 'Support', to: '/docs/support'},
            {label: 'ABDM sandbox', href: 'https://sandbox.abdm.gov.in'},
            {label: 'NHA dev forum', href: 'https://devforum.abdm.gov.in'},
          ],
        },
      ],
      // The catalogue version is in the footer so a reader can tell an agent
      // which version of the documentation they are looking at.
      copyright: `Catalogue ${catalogueVersion} · Copyright © ${new Date().getFullYear()} National Health Authority (NHA). MIT licensed.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'java', 'python'],
    },
  } satisfies Preset.ThemeConfig,

  markdown: {
    mermaid: true,
    // .md files are CommonMark, .mdx files are MDX. Content pages are written
    // from NHA documents and contain raw angle brackets and URLs that MDX
    // would try to parse as JSX. A page that wants components uses .mdx.
    format: 'detect',
  },

};

export default config;
