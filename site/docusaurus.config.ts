import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {join, relative, sep} from 'node:path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {ScalarOptions} from '@scalar/docusaurus';
import apiTree from './src/data/api-sidebar.json';
import {sandboxLinks} from './src/data/sandboxLinks';

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

// Static assets (specs, the vendored Scalar bundle) are addressed with
// absolute paths, so they must carry the base path when the site is
// served under one, e.g. GitHub Pages at /abdm-docs/.
const siteBase = process.env.DOCUSAURUS_BASE_URL ?? '/';

// One interactive reference per specification file, discovered from the
// catalogue tree: dropping a YAML under catalogue/openapi/<platform>/<version>
// publishes its Scalar reference at /reference/<filename-stem>. Every instance
// is self-hosted: the bundle is vendored, and Scalar's cloud services stay off.
function listSpecFiles(dir: string): string[] {
  return readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    if (entry.isDirectory()) {
      // journeys/ holds step lists and errors/ holds NHA's per-module error
      // code lists. Neither is an OpenAPI document, so neither gets a reference.
      return entry.name.startsWith('.') || entry.name === 'journeys' || entry.name === 'errors'
        ? []
        : listSpecFiles(join(dir, entry.name));
    }
    return /\.(yaml|json)$/.test(entry.name) ? [entry.name] : [];
  });
}
const references = listSpecFiles(join(__dirname, '../catalogue/openapi')).map((file) => {
  const id = file.replace(/\.(yaml|json)$/, '');
  return {id, label: id, spec: file};
});

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
        cdn: `${siteBase}vendor/scalar/standalone.js`,
        configuration: {
          url: `${siteBase}specs/${reference.spec}`,
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

// @scalar/docusaurus loads its bundle from `injectHtmlTags`, which Docusaurus
// applies to every page of the site. Nine specifications means nine plugin
// instances, so every page carried nine identical tags, including the landing
// page and Support, which render no reference at all. The browser deduplicates
// the request, so the cost is one 1.1 MB gzipped bundle rather than nine, but
// it was still paid on 400 pages that cannot use it.
//
// The upstream plugin takes no per-route option and its `cdn` fallback is
// jsdelivr, which self-hosting rules out, so the tags cannot be suppressed at
// source. They are removed from the built HTML instead, and one is put back
// where the body tag opens, on the reference pages that need it.
function scalarOnReferencePagesOnly() {
  const bundle = `${siteBase}vendor/scalar/standalone.js`;
  const tagPattern = new RegExp(
    `<script[^>]*\\bsrc=["']?${bundle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?[^>]*>\\s*</script>`,
    'g',
  );
  // The routes that actually mount a Scalar reference, taken from the same
  // list that registers the plugins. Matching on the path instead would also
  // catch docs/<gateway>/<version>/reference/, which is hand written pages
  // about authentication and error codes and mounts no reference at all.
  const scalarRoutes = new Set(references.map((reference) => `reference/${reference.id}`));
  return {
    name: 'scalar-on-reference-pages-only',
    async postBuild({outDir}: {outDir: string}) {
      let kept = 0;
      let stripped = 0;
      for (const entry of readdirSync(outDir, {
        recursive: true,
        withFileTypes: true,
      })) {
        if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
        // parentPath is Node 20.12 and later; path is the older spelling of
        // the same thing, and the bundled types only know one of them.
        const dirent = entry as {parentPath?: string; path?: string};
        const file = join(dirent.parentPath ?? dirent.path ?? outDir, entry.name);
        const html = readFileSync(file, 'utf8');
        tagPattern.lastIndex = 0;
        if (!tagPattern.test(html)) continue;
        tagPattern.lastIndex = 0;
        const withoutBundle = html.replace(tagPattern, '');
        const route = relative(outDir, file)
          .split(sep)
          .join('/')
          .replace(/\/?index\.html$/, '');
        if (scalarRoutes.has(route)) {
          writeFileSync(
            file,
            withoutBundle.replace(
              /<body[^>]*>/,
              (open) => `${open}<script src="${bundle}"></script>`,
            ),
          );
          kept += 1;
        } else {
          writeFileSync(file, withoutBundle);
          stripped += 1;
        }
      }
      console.log(
        `[scalar] bundle kept on ${kept} reference page(s), removed from ${stripped} other page(s)`,
      );
    },
  };
}

// ---------------------------------------------------------------------------
// Sidebar shaping. Sidebars are autogenerated from the docs tree (sidebars.ts);
// the two rules the tree cannot express live here: a version root's folders
// that belong to another tab are dropped from the overview, and a module's
// endpoints folder renders as its use-case groups from api-sidebar.json rather
// than a flat alphabetical list.

// The folders a version root does not render in its overview sidebar, because
// another tab owns them and composes a sidebar of its own: api/, reference/
// and troubleshooting/ belong to API references, resources/ to Developer
// resources, and a gateway's own whats-new/ and support/ to those tabs. This is not the same list as the API references tab's own three,
// which isApiRoute in src/config/navigation.ts holds, so the two are kept
// apart. Every entry here has to have a sidebar in sidebars.ts to show.
const OTHER_TABS = ['api', 'reference', 'troubleshooting', 'resources', 'whats-new', 'support'];

function firstDocId(item: any): string | undefined {
  if (item.type === 'doc') return item.id;
  if (item.type === 'category') {
    if (item.link?.type === 'doc') return item.link.id;
    for (const child of item.items ?? []) {
      const id = firstDocId(child);
      if (id) return id;
    }
  }
  return undefined;
}

/** The use-case groups build-api-reference.mjs recorded for one module. */
function useCaseGroups(moduleDir: string): any[] {
  const module = (apiTree as any[]).find((entry) => entry.moduleDir === moduleDir);
  // A module with no journeys has one group, marked flat: its operations are
  // listed under the module itself, where a module with journeys lists those.
  return (module?.groups ?? []).flatMap((group: any) =>
    group.flat
      ? group.items
      : group.children
      ? {
          type: 'category',
          label: group.label,
          collapsed: true,
          items: group.children.map((child: any) => ({
            type: 'category',
            label: child.label,
            collapsed: true,
            items: child.items,
          })),
        }
      : {type: 'category', label: group.label, collapsed: true, items: group.items},
  );
}

/**
 * Swap every generated endpoints folder for one APIs category holding the
 * module's use-case groups.
 *
 * The groups used to be spread into the module, which made them siblings of
 * User journey and Errors, so a module read as one long list with no way to
 * tell a guide page from an endpoint group. Every module now has the same
 * three rungs: User journey, APIs, Errors.
 */
function spliceEndpoints(items: any[]): any[] {
  const out = items.flatMap((item: any) => {
    if (item.type !== 'category') return [item];
    const id = firstDocId(item);
    if (item.label === 'Endpoints' && id && id.includes('/endpoints/')) {
      const moduleDir = id.slice(0, id.indexOf('/endpoints/'));
      // The use cases sit directly under the module. They used to sit inside
      // a category called APIs, which put a click between the module and its
      // operations and read as a second "APIs" beneath the one above it.
      // Errors stays their sibling, so a reader after failures does not open
      // the operations to find it.
      return useCaseGroups(moduleDir);
    }
    return [{...item, items: spliceEndpoints(item.items ?? [])}];
  });
  // A module's own APIs page keeps its place, set by its front matter, but
  // not its name: "APIs" read as a category header and reads as nothing at
  // all sitting among use cases. It holds the rules that hold across every
  // endpoint of the module, so it is named for that.
  return out;
}

/**
 * Modules whose specification says `x-portal.section: use-cases` (Scan and
 * Pay today) sit under one Use cases group, at the place of the first of
 * them, so the API tab separates milestones from use cases the way the Docs
 * tab does. Everything else keeps its order.
 */
function groupUseCases(items: any[]): any[] {
  const isUseCase = (item: any) =>
    item.type === 'category' && item.customProps?.section === 'use-cases';
  const useCases = items.filter(isUseCase);
  if (useCases.length === 0) return items;
  const group = {
    type: 'category',
    label: 'Use cases',
    className: 'sidebar-icon sidebar-icon--briefcase',
    collapsed: true,
    items: useCases,
  };
  const out: any[] = [];
  let placed = false;
  for (const item of items) {
    if (!isUseCase(item)) out.push(item);
    else if (!placed) { out.push(group); placed = true; }
  }
  return out;
}

async function sidebarItemsGenerator({defaultSidebarItemsGenerator, ...args}: any) {
  const items = await defaultSidebarItemsGenerator(args);
  const dirName: string = args.item.dirName;
  if (/^[^/]+\/[^/]+$/.test(dirName)) {
    // A version root is the overview sidebar; the folders another tab owns
    // render there instead.
    const own = items.filter((item: any) => {
      const id = firstDocId(item);
      return !(
        id &&
        OTHER_TABS.some((folder) => id.startsWith(`${dirName}/${folder}/`))
      );
    });
    // A folder whose _category_.json sets customProps.unwrap groups pages on
    // disk only: its sections take its place at the top level, so the URLs
    // keep the folder while the sidebar loses a layer. NHCX's roles/ uses it
    // to show Building for provider and Building for payer directly.
    // NHCX shows Go live inside its Reference section (site/sidebars.ts), so
    // the version root leaves it out.
    const placed = dirName.startsWith('nhcx/')
      ? own.filter((item: any) => !(firstDocId(item) ?? '').startsWith(`${dirName}/go-live/`))
      : own;
    return placed.flatMap((item: any) =>
      item.type === 'category' && item.customProps?.unwrap ? item.items : [item],
    );
  }
  // The index is the section header's own link (see site/sidebars.ts), so
  // listing it again beneath itself is the extra click this removes.
  const withoutIndex = () =>
    items.filter((item: any) => !(item.type === 'doc' && item.id === `${dirName}/index`));
  if (dirName.endsWith('/api')) {
    return groupUseCases(spliceEndpoints(withoutIndex()));
  }
  if (dirName.endsWith('/troubleshooting') || dirName.endsWith('/go-live')) {
    return withoutIndex();
  }
  // NHCX's reference folder feeds three tabs. In the Docs sidebar it lists
  // only what is neither FHIR reference nor error codes: those two tabs own
  // theirs (see SPLIT_REFERENCE in site/sidebars.ts).
  if (/^nhcx\/[^/]+\/reference$/.test(dirName)) {
    return items.filter((item: any) => {
      const id = firstDocId(item) ?? '';
      return !id.includes('/reference/fhir/') && !/\/reference\/(error-codes|error-code-guide|pmjay-error-codes)$/.test(id);
    });
  }
  return items;
}

const catalogueVersion = readFileSync(
  join(__dirname, '../catalogue/VERSION'),
  'utf8',
).trim();

/**
 * The repository this copy of the portal is published from. Actions sets
 * GITHUB_REPOSITORY on whichever fork is building, so a fork's install
 * commands and GitHub link name that fork without anyone editing a constant.
 * MARKETPLACE_REPO overrides it where the plugin is served from elsewhere.
 * Keep the same chain in scripts/build-skills.mjs.
 */
const pluginRepo =
  process.env.MARKETPLACE_REPO ?? process.env.GITHUB_REPOSITORY ?? 'nha-in/docs';

/** What `claude plugin install <plugin>@<marketplace>` has to name. Read from
    the manifest rather than repeated, so renaming the shelf cannot leave a
    published command pointing at one that does not exist. */
const marketplaceName = JSON.parse(
  readFileSync(join(__dirname, '..', '.claude-plugin', 'marketplace.json'), 'utf8'),
).name as string;

const config: Config = {
  title: 'ABDM Developer Portal',
  tagline: 'One catalogue of ABDM, readable by humans and machines',
  // The State Emblem of India, as abdm.gov.in and the sandbox show it in
  // their own tabs: the Lion Capital with the motto beneath, padded into a
  // square. One SVG for both themes, since a browser cannot choose between a
  // light and a dark icon the way the page chrome does, so the file carries
  // its own prefers-color-scheme rule.
  favicon: 'img/favicon.svg',

  // Safari does not take an SVG favicon, so a raster of the same emblem is
  // offered alongside it. `alternate icon` is only reached by a browser that
  // could not use the SVG, so Chrome, Firefox and Edge still get the vector
  // and its light and dark variants.
  // The support agent is a standalone custom element, loaded like any
  // third-party embed would load it. Nothing in the site imports it, which is
  // what keeps it usable on pages that are not this site.
  // Reference pages carry the Scalar bundle only on a full load; this
  // reloads them when a client side link lands on one.
  clientModules: [require.resolve('./src/clientModules/reference-reload.ts')],
  scripts: [
    {src: `${siteBase}agent/abdm-support-agent.js`, defer: true},
  ],

  headTags: [
    // The soft keyboard resizes the page rather than sliding it out from under
    // the chrome.
    //
    // The default is `resizes-visual`: opening a keyboard shrinks the visual
    // viewport and leaves the layout viewport alone, so a `position: sticky`
    // element stays pinned to a top that is now scrolled out of sight. The top
    // bar is sticky (Infima's navbar--fixed-top), and the search panel is
    // positioned against it, so tapping search on a phone opened a panel and
    // the keyboard took the bar and the panel off screen together: the reader
    // typed into a field they could no longer see.
    //
    // `resizes-content` makes the keyboard shrink the layout viewport instead,
    // which is what keeps sticky chrome where the reader can see it. Declared
    // here rather than in the theme's own tag because Docusaurus emits that one
    // through Helmet and head tags are written after it, so this is the one the
    // browser reads last.
    {
      tagName: 'meta',
      attributes: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, interactive-widget=resizes-content',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate icon',
        type: 'image/png',
        href: `${process.env.DOCUSAURUS_BASE_URL ?? '/'}img/favicon.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        href: `${process.env.DOCUSAURUS_BASE_URL ?? '/'}img/apple-touch-icon.png`,
      },
    },
  ],

  future: {
    v4: true,
  },

  // The portal's published address. A deployment elsewhere, such as the
  // github.io Pages build, overrides both through the environment.
  url: process.env.DOCUSAURUS_URL ?? 'https://docs.abdm.gov.in',
  baseUrl: process.env.DOCUSAURUS_BASE_URL ?? '/',

  onBrokenLinks: 'throw',

  customFields: {
    // The repository this copy of the portal is published from, which is the
    // one its install commands and its GitHub link have to name. Derived, not
    // written down: GITHUB_REPOSITORY is set by Actions on whichever fork is
    // building, so a fork publishes its own commands without being edited.
    // MARKETPLACE_REPO overrides it where the plugin is served from elsewhere.
    pluginRepo,
    marketplaceName,
    // The Docs MCP server's public address. Null until it has one: the install
    // panel on the MCP page renders locked, and every button on it goes live
    // the moment this resolves. Nothing else has to change.
    // The Docs MCP server the portal publishes beside itself.
    mcpUrl: process.env.MCP_URL ?? 'https://docs.abdm.gov.in/mcp',
    // The chat backend's origin. Null keeps the Ask AI panel a labeled mock,
    // so Pages and preview builds never ship a dead composer.
    chatUrl: process.env.CHAT_URL ?? null,
    // The repository the plugin marketplace is served from, which is what the
    // install commands on Build with AI name. The portal is NHA's, so the
    // default is NHA's repository; a deployment serving the plugin from
    // somewhere else sets MARKETPLACE_REPO, and scripts/build-skills.mjs reads
    // the same variable so the page and agent-setup/prompt.md agree.
    marketplaceRepo: process.env.MARKETPLACE_REPO ?? 'nha-in/docs',
  },

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
          sidebarItemsGenerator,
          routeBasePath: '/docs',
          // README.md files are contributor notes for the folder they sit in,
          // shown by GitHub and never rendered as pages. The first entries are
          // Docusaurus's own defaults, which setting `exclude` would drop.
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            '**/README.md',
          ],
          // The tree runs four levels deep under Registries, so the path a
          // reader is on is worth showing.
          breadcrumbs: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    tailwindPlugin,
    ...scalarPlugins,
    scalarOnReferencePagesOnly,
    [
      // A reader who types /docs, or follows a link written before the
      // gateway segment existed, lands on the HIE-CM introduction rather
      // than a 404.
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {from: '/docs', to: '/docs/hiecm/v3'},
          // Old flat and building-blocks URLs from before the folder
          // restructure. The `from` paths are the URLs as they were published,
          // under the platform's old name (abdm); the blanket abdm-to-hiecm
          // alias in createRedirects only covers pages that still exist at the
          // same path, so moved pages need these explicit entries.
          {from: '/docs/abdm/v3/building-blocks/registries', to: '/docs/hiecm/v3/registries/'},
          {from: '/docs/abdm/v3/building-blocks/registries/abha', to: '/docs/hiecm/v3/registries/abha'},
          {from: '/docs/abdm/v3/building-blocks/registries/nhpr', to: '/docs/hiecm/v3/registries/nhpr/'},
          {from: '/docs/abdm/v3/building-blocks/registries/nhpr/hpr', to: '/docs/hiecm/v3/registries/nhpr/hpr'},
          {from: '/docs/abdm/v3/building-blocks/registries/nhpr/hfr', to: '/docs/hiecm/v3/registries/nhpr/hfr'},
          {from: '/docs/abdm/v3/building-blocks/gateway', to: '/docs/hiecm/v3/concepts/gateway'},
          {from: '/docs/abdm/v3/building-blocks/hie-cm', to: '/docs/hiecm/v3/concepts/gateway'},
          {from: '/docs/abdm/v3/concepts/hie-cm', to: '/docs/hiecm/v3/concepts/gateway'},
          {from: '/docs/overview', to: '/docs/hiecm/v3'},
          {from: '/docs/api', to: '/docs/hiecm/v3/milestones'},
          {from: '/docs/abdm/v3/architecture', to: '/docs/hiecm/v3/concepts/how-it-fits'},
          {from: '/docs/hiecm/v3/getting-started/architecture', to: '/docs/hiecm/v3/concepts/how-it-fits'},
          {from: '/docs/hiecm/v3/getting-started/mcp', to: '/docs/hiecm/v3/getting-started/build-with-ai'},
          {from: '/docs/abdm/v3/sandbox', to: '/docs/hiecm/v3/getting-started/sandbox'},
          {from: '/docs/abdm/v3/what-you-can-build', to: '/docs/hiecm/v3/milestones'},
          {from: '/docs/hiecm/v3/getting-started/what-you-can-build', to: '/docs/hiecm/v3/milestones'},
          {from: '/docs/hiecm/v3/milestones/scan-and-register', to: '/docs/hiecm/v3/use-cases/scan-and-register'},
          // The subscription module joined P3 on 23 September 2026.
          {from: '/docs/hiecm/v3/api/subscription/endpoints/subscription-subscription-hiu/06-subscription-post-subscription-requests-v3-hiu-care-conte-96bc45', to: '/docs/hiecm/v3/api/p3/endpoints/p3-subscription-hiu/06-p3-post-subscription-requests-v3-hiu-care-context-on-notify'},
          {from: '/docs/hiecm/v3/api/subscription/endpoints/subscription-subscription-hiu/04-subscription-post-subscription-requests-v3-hiu-on-notify', to: '/docs/hiecm/v3/api/p3/endpoints/p3-subscription-hiu/04-p3-post-subscription-requests-v3-hiu-on-notify'},
          {from: '/docs/hiecm/v3/api/subscription/endpoints/subscription-subscription-hiu/01-subscription-post-subscription-requests-v3-init', to: '/docs/hiecm/v3/api/p3/endpoints/p3-subscription-hiu/01-p3-post-subscription-requests-v3-init'},
          {from: '/docs/hiecm/v3/api/subscription/endpoints/subscription-subscription-hiu/02-subscription-post-v3-hiu-hiecm-subscription-requests-on-init', to: '/docs/hiecm/v3/api/p3/endpoints/p3-subscription-hiu/02-p3-post-v3-hiu-hiecm-subscription-requests-on-init'},
          {from: '/docs/hiecm/v3/api/subscription/endpoints/subscription-subscription-hiu/05-subscription-post-v3-hiu-subscription-notify', to: '/docs/hiecm/v3/api/p3/endpoints/p3-subscription-hiu/05-p3-post-v3-hiu-subscription-notify'},
          {from: '/docs/hiecm/v3/api/subscription/endpoints/subscription-subscription-hiu/03-subscription-post-v3-hiu-subscription-requests-hiu-notify', to: '/docs/hiecm/v3/api/p3/endpoints/p3-subscription-hiu/03-p3-post-v3-hiu-subscription-requests-hiu-notify'},
          {from: '/reference/hiecm-subscription', to: '/reference/hiecm-p3'},
          // Gateway calls NHA's sandbox observations of 23 September 2026 moved out of the gateway, or left out.
          {from: '/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-sessions/03-gateway-get-gateway-v3-certs', to: '/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-sessions/01-gateway-post-gateway-v3-sessions'},
          {from: '/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-gateway/07-gateway-get-gateway-v3-govt-programs', to: '/docs/hiecm/v3/api/p2/endpoints/p2-abdm-user-initiated-linking-phr/09-p2-get-gateway-v3-govt-programs'},
          {from: '/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-gateway/08-gateway-get-gateway-v3-health-lockers', to: '/docs/hiecm/v3/api/p4/endpoints/p4-locker/05-p4-get-gateway-v3-health-lockers'},
          {from: '/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-gateway/05-gateway-get-gateway-v3-providers', to: '/docs/hiecm/v3/api/p2/endpoints/p2-abdm-user-initiated-linking-phr/01-p2-get-gateway-v3-providers'},
          {from: '/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-gateway/06-gateway-get-gateway-v3-providers-provider-id', to: '/docs/hiecm/v3/api/p2/endpoints/p2-abdm-user-initiated-linking-phr/02-p2-get-gateway-v3-providers-provider-id'},
          {from: '/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-sessions/02-gateway-get-gateway-v3-well-known-openid-configuration', to: '/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-sessions/01-gateway-post-gateway-v3-sessions'},
          {from: '/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-gateway/04-gateway-put-gateway-v3-bridge-service', to: '/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-gateway/01-gateway-get-gateway-v3-bridge-services'},
          {from: '/docs/hiecm/v3/api/p2/endpoints/p2-abdm-user-initiated-linking-phr/01-gateway-get-gateway-v3-providers', to: '/docs/hiecm/v3/api/p2/endpoints/p2-abdm-user-initiated-linking-phr/01-p2-get-gateway-v3-providers'},
          {from: '/docs/hiecm/v3/api/p2/endpoints/p2-abdm-user-initiated-linking-phr/02-gateway-get-gateway-v3-providers-provider-id', to: '/docs/hiecm/v3/api/p2/endpoints/p2-abdm-user-initiated-linking-phr/02-p2-get-gateway-v3-providers-provider-id'},
          // The PHR applications concept page merged into the participant page, 23 September 2026.
          {from: '/docs/hiecm/v3/concepts/phr', to: '/docs/hiecm/v3/concepts/participants/phr'},
          {from: '/docs/hiecm/v3/api/m2/endpoints/m2-abdm-patient-share-hip/01-m2-post-v3-hip-patient-share', to: '/docs/hiecm/v3/api/scan-and-register/endpoints/scan-and-register-abdm-patient-share-hip/01-scan-and-register-post-v3-hip-patient-share'},
          {from: '/docs/hiecm/v3/api/m2/endpoints/m2-abdm-patient-share-hip/02-m2-post-patient-share-v3-on-share', to: '/docs/hiecm/v3/api/scan-and-register/endpoints/scan-and-register-abdm-patient-share-hip/02-scan-and-register-post-patient-share-v3-on-share'},
          // The endpoint pages NHA's API review of 15 September 2026 links to, at
          // the slugs the pages had then.
          {from: '/docs/hiecm/v3/api/m2/endpoints/m2-link-care-context-notify', to: '/docs/hiecm/v3/api/m2/endpoints/m2-abdm-hip-initiated-linking-hip/02-m2-post-hip-v3-link-context-notify'},
          {from: '/docs/hiecm/v3/api/m2/endpoints/m2-on-discover-care-contexts', to: '/docs/hiecm/v3/api/m2/endpoints/m2-abdm-user-initiated-linking-hip/01-m2-post-user-initiated-linking-v3-patient-care-context-on-8c9340'},
          {from: '/docs/hiecm/v3/api/m2/endpoints/m2-receive-link-confirm', to: '/docs/hiecm/v3/api/m2/endpoints/m2-abdm-user-initiated-linking-hip/03-m2-post-user-initiated-linking-v3-link-care-context-on-confirm'},
          {from: '/docs/hiecm/v3/api/m2/endpoints/m2-consent-hip-on-notify', to: '/docs/hiecm/v3/api/m2/endpoints/m2-consent-management-data-flow-hip/01-m2-post-consent-v3-request-hip-on-notify'},
          {from: '/docs/hiecm/v3/api/m2/endpoints/m2-hip-health-information-on-request', to: '/docs/hiecm/v3/api/m2/endpoints/m2-consent-management-data-flow-hip/02-m2-post-data-flow-v3-health-information-hip-on-request'},
          {from: '/docs/hiecm/v3/api/m2/endpoints/m2-on-discovery-request', to: '/docs/hiecm/v3/api/m2/endpoints/m2-callbacks/05-m2-post-v3-hip-patient-care-context-discover'},
          {from: '/docs/hiecm/v3/api/m3/endpoints/m3-consent-request-init', to: '/docs/hiecm/v3/api/m3/endpoints/m3-consent-management-data-flow-hiu/01-m3-post-consent-v3-request-init'},
          {from: '/docs/hiecm/v3/api/m3/endpoints/m3-consent-hiu-on-notify', to: '/docs/hiecm/v3/api/m3/endpoints/m3-consent-management-data-flow-hiu/03-m3-post-consent-v3-request-hiu-on-notify'},
          {from: '/docs/hiecm/v3/api/m3/endpoints/m3-hiu-health-information-request', to: '/docs/hiecm/v3/api/m3/endpoints/m3-consent-management-data-flow-hiu/05-m3-post-data-flow-v3-health-information-request'},
          {from: '/docs/abdm/v3/glossary', to: '/docs/hiecm/v3/getting-started/glossary'},
          {from: '/docs/abdm/v3/phr', to: '/docs/hiecm/v3/concepts/participants/phr'},
          {from: '/docs/abdm/v3/registries/hpr', to: '/docs/hiecm/v3/registries/nhpr/hpr'},
          {from: '/docs/abdm/v3/registries/hfr', to: '/docs/hiecm/v3/registries/nhpr/hfr'},
          {from: '/docs/uhi/v1/onboarding', to: '/docs/uhi/v1/getting-started/onboarding'},
          {from: '/docs/uhi/v1/glossary', to: '/docs/uhi/v1/getting-started/glossary'},
          {from: '/docs/uhi/v1/network-and-protocol', to: '/docs/uhi/v1/concepts/network-and-protocol'},
          {from: '/docs/nhcx/v1/glossary', to: '/docs/nhcx/v1/getting-started/glossary'},
          // The NHCX landing page is the claim journey; its old address still works.
          {from: '/docs/nhcx/v1/concepts/how-claims-move-on-nhcx', to: '/docs/nhcx/v1'},
          // The PMJAY scheme rules page was merged: the plain rules into PMJAY on
          // NHCX, the codes and fields into PMJAY use cases.
          {from: '/docs/nhcx/v1/concepts/pmjay-scheme-rules', to: '/docs/nhcx/v1/concepts/pmjay-on-nhcx'},
          // Payer flexibility was removed; its readers land on the use cases.
          {from: '/docs/nhcx/v1/concepts/payer-flexibility', to: '/docs/nhcx/v1/concepts/nhcx-use-cases'},
          // Eleven NHCX endpoint pages were renamed so every slug is derived
          // from the operation's path, as the other pages are. The old slugs
          // came from the Bruno request names.
          {from: '/docs/nhcx/v1/api/session/endpoints/session-session-token', to: '/docs/nhcx/v1/api/session/endpoints/session-api-hiecm-gateway-v3-sessions'},
          {from: '/docs/nhcx/v1/api/biometric/endpoints/biometric-auth-init', to: '/docs/nhcx/v1/api/biometric/endpoints/biometric-hcx-abha-biometric-auth-init'},
          {from: '/docs/nhcx/v1/api/biometric/endpoints/biometric-auth-verify', to: '/docs/nhcx/v1/api/biometric/endpoints/biometric-hcx-abha-biometric-auth-verify'},
          {from: '/docs/nhcx/v1/api/biometric/endpoints/biometric-auth-refresh-token', to: '/docs/nhcx/v1/api/biometric/endpoints/biometric-hcx-abha-biometric-auth-refresh-token'},
          {from: '/docs/nhcx/v1/api/biometric/endpoints/biometric-faceauth-init', to: '/docs/nhcx/v1/api/biometric/endpoints/biometric-pmjay-sbxhcx-abdmproxy-abha-biometric-faceauth-init'},
          {from: '/docs/nhcx/v1/api/biometric/endpoints/biometric-faceauth-capture-pid', to: '/docs/nhcx/v1/api/biometric/endpoints/biometric-pmjay-sbxhcx-abdmproxy-abha-biometric-capture-pid'},
          {from: '/docs/nhcx/v1/api/biometric/endpoints/biometric-faceauth-v2-auth-verify', to: '/docs/nhcx/v1/api/biometric/endpoints/biometric-pmjay-sbxhcx-abdmproxy-abha-biometric-v2-auth-verify'},
          {from: '/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-adjudicator-role', to: '/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-pmjay-sbxhcx-nhcxpayerservice-v1-get-user-role'},
          {from: '/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-adjudicator-process', to: '/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-pmjay-hcx-nhcxpayerservice-wrapper-process-case'},
          {from: '/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-dummy-payer-process-request', to: '/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-process-request'},
          {from: '/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-dummy-payer-paymentnotice-init', to: '/docs/nhcx/v1/api/adjudicator/endpoints/adjudicator-paymentnotice-init'},
          // The milestones page moved out of Get started into its own section,
          // and each module's user journey moved with it.
          {from: '/docs/hiecm/v3/getting-started/milestones', to: '/docs/hiecm/v3/milestones'},
          // Every callback now sits on the call it belongs to. The API index
          // is where the ones no specification ties to a call are listed, so
          // it is the only page that still answers "show me all of them".
          {from: '/docs/hiecm/v3/reference/callbacks', to: '/docs/hiecm/v3/api/'},
          {from: '/docs/hiecm/v3/roles', to: '/docs/hiecm/v3'},
          {from: '/docs/hiecm/v3/roles/ims', to: '/docs/hiecm/v3'},
          {from: '/docs/hiecm/v3/roles/phr', to: '/docs/hiecm/v3/milestones/p1'},
          {from: '/docs/hiecm/v3/api/m1/user-journey', to: '/docs/hiecm/v3/milestones/m1'},
          {from: '/docs/hiecm/v3/milestones/m1-journey', to: '/docs/hiecm/v3/milestones/m1'},
          {from: '/docs/hiecm/v3/milestones/m2-journey', to: '/docs/hiecm/v3/milestones/m2'},
          {from: '/docs/hiecm/v3/milestones/m3-journey', to: '/docs/hiecm/v3/milestones/m3'},
          {from: '/docs/hiecm/v3/milestones/m4-journey', to: '/docs/hiecm/v3/milestones/m4'},
          {from: '/docs/hiecm/v3/api/m2/user-journey', to: '/docs/hiecm/v3/milestones/m2'},
          {from: '/docs/hiecm/v3/api/m3/user-journey', to: '/docs/hiecm/v3/milestones/m3'},
          {from: '/docs/hiecm/v3/api/m4/user-journey', to: '/docs/hiecm/v3/milestones/m4'},
        ],
        createRedirects(to: string) {
          const aliases: string[] = [];
          // The HIE-CM platform folder was renamed from abdm; every page
          // answers at its old URL too.
          const hiecm = to.match(/^\/docs\/hiecm\/(.+)$/);
          if (hiecm) {
            aliases.push(`/docs/abdm/${hiecm[1]}`);
          }
          // Every UHI service page moved down into concepts/.
          const service = to.match(/^\/docs\/uhi\/v1\/concepts\/services\/(.+)$/);
          if (service) {
            aliases.push(`/docs/uhi/v1/services/${service[1]}`);
          }
          return aliases.length > 0 ? aliases : undefined;
        },
      },
    ],
  ],

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
    // Diagrams take the site's type and sizes here, and its colours from
    // mdx.css, where the tokens already switch with the theme. Flowchart
    // labels are SVG text rather than HTML, so the page's font size and line
    // height cannot make a label outgrow the box Mermaid measured for it.
    mermaid: {
      theme: {light: 'base', dark: 'base'},
      options: {
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        fontSize: 14,
        sequence: {
          wrap: true,
          wrapPadding: 10,
          width: 250,
          height: 44,
          actorMargin: 36,
          boxMargin: 12,
          messageMargin: 36,
          noteMargin: 12,
          actorFontSize: 14,
          actorFontWeight: 600,
          messageFontSize: 13,
          noteFontSize: 12,
          mirrorActors: false,
          useMaxWidth: true,
        },
        flowchart: {htmlLabels: false, curve: 'basis', padding: 16, nodeSpacing: 40, rankSpacing: 44, useMaxWidth: true},
        themeVariables: {sequenceNumberColor: '#ffffff', fontSize: '14px'},
      },
    },
    image: 'img/social-card.jpg',
    /**
     * What a link to this site unfurls into, beyond the four tags Docusaurus
     * emits on its own.
     *
     * It already writes og:title, og:description, og:url, og:locale, og:image
     * and twitter:card, which is enough for a preview to work and not enough
     * for it to work everywhere. The gaps are the ones that make a card appear
     * on one platform and not the next:
     *
     * `og:type` is required by the Open Graph protocol, and a document without
     * it is not a valid Open Graph document. Parsers differ on what to do
     * about that: some infer a page, some fall back to a bare link.
     *
     * The image dimensions are what let a card be laid out before the image
     * has been fetched. A scraper that will not block on a download has to
     * decide between a large card and a small one with nothing to go on, and
     * the ones that guess, guess small. They are stated rather than measured,
     * so they have to match static/img/social-card.jpg, which is 1200x630, the
     * size every platform asks for.
     *
     * None of this is a change of behaviour on this site. It is the same card,
     * described completely enough that a reader of the tags does not have to
     * guess at the rest.
     */
    metadata: [
      {property: 'og:type', content: 'website'},
      {property: 'og:site_name', content: 'ABDM Developer Portal'},
      {property: 'og:image:width', content: '1200'},
      {property: 'og:image:height', content: '630'},
      {property: 'og:image:type', content: 'image/jpeg'},
      {
        property: 'og:image:alt',
        content: 'ABDM Developer Portal, the National Health Authority',
      },
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        // The sidebar folds away sideways, which the API pages need: their
        // request panel wants the width more than the tree does.
        hideable: true,
        autoCollapseCategories: false,
      },
    },
    navbar: {
      title: 'ABDM Developer Portal',
      logo: {
        alt: '',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      hideOnScroll: false,
      items: [
        {
          href: sandboxLinks.home,
          label: 'ABDM sandbox',
          position: 'right',
        },
        {
          href: `https://github.com/${pluginRepo}`,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    // NHA's own footer, transcribed from the ABDM sandbox documentation site:
    // the contact block, the registry links, the policies. The previous footer
    // repeated this site's own navigation, which the gateway sidebars already
    // carry, and named HIE-CM's modules as though they were the whole portal.
    footer: {
      style: 'light',
      links: [
        {
          title: 'Contact',
          items: [
            {
              label:
                'National Health Authority, 9th Floor, Tower-I, Jeevan Bharati Building, Connaught Place, New Delhi 110 001',
              href: 'https://abdm.gov.in/',
            },
            {label: 'abdm@nha.gov.in', href: 'mailto:abdm@nha.gov.in'},
            {label: 'Toll free 1800-11-4477', href: 'tel:18001144477'},
          ],
        },
        {
          title: 'Important links',
          items: [
            {label: 'Ministry of Health & Family Welfare', href: 'https://www.mohfw.gov.in/'},
            {label: 'Ayushman Bharat Health Account (ABHA)', href: 'https://abha.abdm.gov.in/'},
            {label: 'Healthcare Professionals Registry (HPR)', href: 'https://nhpr.abdm.gov.in/'},
            {label: 'Health Facility Registry (HFR)', href: 'https://facility.abdm.gov.in/'},
            {label: 'Grievance portal', href: 'https://grievance.abdm.gov.in/'},
          ],
        },
        {
          title: 'Policies',
          items: [
            {label: 'Terms and conditions', href: 'https://abdm.gov.in/terms-condition'},
            {label: 'Website policies', href: 'https://abdm.gov.in/website-policy'},
            {
              label: 'Health Data Management Policy',
              href: 'https://abdm.gov.in/strapicms/uploads/health_management_policy_bac9429a79.pdf',
            },
            {
              label: 'Data privacy policy',
              href: 'https://abdm.gov.in/strapicms/uploads/privacypolicy_178041845b.pdf',
            },
          ],
        },
      ],
      // The catalogue version stays: it is how a reader tells an agent which
      // version of the documentation they are looking at.
      copyright: `This website belongs to the National Health Authority, Ministry of Health and Family Welfare, Government of India · Catalogue ${catalogueVersion}`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json', 'yaml', 'java', 'python', 'markup-templating', 'php', 'go', 'csharp', 'ruby'],
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
