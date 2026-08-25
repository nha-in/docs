import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
import apiTree from './src/data/api-sidebar.json';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

type GeneratedItem = {
  type: 'doc';
  id: string;
  label: string;
  className: string;
};

/**
 * The use case groups under a module, generated from the OpenAPI files by
 * scripts/build-api-reference.mjs. A use case is a category and its endpoints
 * are the items, each carrying the class that paints its method badge. Adding
 * an operation to a specification adds it here.
 */
function useCasesOf(moduleId: string) {
  const module = apiTree.find((entry) => entry.moduleId === moduleId);
  return (module?.groups ?? []).map((group) => ({
    type: 'category' as const,
    label: group.label,
    collapsed: true,
    items: group.items as GeneratedItem[],
  }));
}

/**
 * A module's API section: its conventions page at the top, then the sequence,
 * then one collapsible section per use case holding that journey's endpoints.
 */
function apiSection(moduleId: string, docId?: string) {
  return {
    type: 'category' as const,
    label: 'APIs',
    collapsed: true,
    ...(docId ? {link: {type: 'doc' as const, id: docId}} : {}),
    items: [
      ...(moduleId === 'm4' ? [] : [`abdm/v3/api/${moduleId}/sequence`]),
      ...useCasesOf(moduleId),
    ],
  };
}

const sidebars: SidebarsConfig = {
  // --------------------------------------------------------------- Overview
  overviewSidebar: [
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: [
        'abdm/v3/index',
        'abdm/v3/architecture',
        'abdm/v3/sandbox',
        'abdm/v3/milestones',
        'abdm/v3/what-you-can-build',
        'abdm/v3/glossary',
      ],
    },
    {
      type: 'category',
      label: 'Gateways',
      collapsed: false,
      items: [
        'abdm/v3/building-blocks/hie-cm',
        {
          type: 'category',
          label: 'UHI',
          link: {type: 'doc', id: 'uhi/v1/index'},
          collapsed: true,
          items: [
            'uhi/v1/network-and-protocol',
            'uhi/v1/onboarding',
            {
              type: 'category',
              label: 'Services',
              collapsed: true,
              items: [
                'uhi/v1/services/physical-consultation',
                'uhi/v1/services/pmjay-hem',
                'uhi/v1/services/blood-bank',
                'uhi/v1/services/ambulance-booking',
                'uhi/v1/services/jan-aushadhi-kendra',
                'uhi/v1/services/jan-aushadhi-medicine-search',
                'uhi/v1/services/amrit-pharmacy',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'NHCX',
          link: {type: 'doc', id: 'nhcx/v1/index'},
          collapsed: true,
          items: ['nhcx/v1/api'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Registries',
      link: {type: 'doc', id: 'abdm/v3/building-blocks/registries/index'},
      collapsed: false,
      items: [
        'abdm/v3/building-blocks/registries/abha',
        {
          type: 'category',
          label: 'NHPR',
          link: {
            type: 'doc',
            id: 'abdm/v3/building-blocks/registries/nhpr/index',
          },
          collapsed: true,
          items: [
            'abdm/v3/building-blocks/registries/nhpr/hpr',
            'abdm/v3/building-blocks/registries/nhpr/hfr',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Core concepts',
      collapsed: false,
      items: [
        'abdm/v3/concepts/hip-hiu',
        'abdm/v3/concepts/consent',
        'abdm/v3/concepts/linking',
        'abdm/v3/concepts/data-flow',
        'abdm/v3/concepts/fhir',
        'abdm/v3/building-blocks/gateway',
      ],
    },
    {
      type: 'category',
      label: 'PHR applications',
      collapsed: false,
      items: ['abdm/v3/phr/index'],
    },
  ],

  // --------------------------------------------------------- API references
  // One sidebar per gateway here, because the reader is inside one gateway's
  // contract and switches with the picker at the top rather than by scrolling
  // past two others. The Overview tab keeps Gateways as a branch.
  abdmApiSidebar: [
    {
      type: 'category',
      label: 'HIE-CM',
      link: {type: 'doc', id: 'abdm/v3/api/index'},
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Gateway session',
          collapsed: true,
          items: useCasesOf('gateway').flatMap((group) => group.items),
        },
        {
          type: 'category',
          label: 'M1 ABHA identity',
          link: {type: 'doc', id: 'abdm/v3/api/m1/index'},
          collapsed: true,
          items: [
            'abdm/v3/api/m1/user-journey',
            apiSection('m1', 'abdm/v3/api/m1/apis'),
            'abdm/v3/api/m1/errors',
          ],
        },
        {
          type: 'category',
          label: 'M2 Linking and sharing',
          link: {type: 'doc', id: 'abdm/v3/api/m2/index'},
          collapsed: true,
          items: [
            'abdm/v3/api/m2/user-journey',
            apiSection('m2'),
            'abdm/v3/api/m2/errors',
          ],
        },
        {
          type: 'category',
          label: 'M3 Consent and fetching',
          link: {type: 'doc', id: 'abdm/v3/api/m3/index'},
          collapsed: true,
          items: [
            'abdm/v3/api/m3/user-journey',
            apiSection('m3'),
            'abdm/v3/api/m3/errors',
          ],
        },
        {
          type: 'category',
          label: 'M4 HPR and HFR',
          link: {type: 'doc', id: 'abdm/v3/api/m4/index'},
          collapsed: true,
          items: [
            'abdm/v3/api/m4/user-journey',
            apiSection('m4'),
            'abdm/v3/api/m4/undocumented',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [
        'abdm/v3/reference/authentication',
        'abdm/v3/reference/callbacks',
        'abdm/v3/reference/error-codes',
        'abdm/v3/reference/data-dictionary',
      ],
    },
  ],

  uhiApiSidebar: [
    {
      type: 'category',
      label: 'UHI',
      link: {type: 'doc', id: 'uhi/v1/api'},
      collapsed: false,
      items: ['uhi/v1/network-and-protocol', 'uhi/v1/onboarding'],
    },
  ],

  nhcxApiSidebar: [
    {
      type: 'category',
      label: 'NHCX',
      link: {type: 'doc', id: 'nhcx/v1/api'},
      collapsed: false,
      items: ['nhcx/v1/index'],
    },
  ],

  whatsNewSidebar: [{type: 'autogenerated', dirName: 'whats-new'}],
  supportSidebar: [{type: 'autogenerated', dirName: 'support'}],
};

export default sidebars;
