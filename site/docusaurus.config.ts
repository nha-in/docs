import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {ScalarOptions} from '@scalar/docusaurus';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'ABDM Developer Portal',
  tagline: 'One catalogue of the HIE-CM gateway, readable by humans and machines',
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
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@scalar/docusaurus',
      {
        id: 'hiecm',
        label: 'HIE-CM API',
        route: '/reference/hiecm',
        showNavLink: false,
        // Serve the reference bundle from our own origin, not jsdelivr.
        // Vendored by scripts/sync-specs.mjs from @scalar/api-reference.
        cdn: '/vendor/scalar/standalone.js',
        configuration: {
          url: '/specs/hiecm-v3.yaml',
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
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'ABDM Developer Portal',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/reference/hiecm',
          label: 'HIE-CM API',
          position: 'left',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting started',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'API reference',
          items: [
            {
              label: 'HIE-CM (ABDM V3)',
              to: '/reference/hiecm',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} National Health Authority (NHA). MIT licensed.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
