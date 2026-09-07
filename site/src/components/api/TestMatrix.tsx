import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import {ChevronDown, ChevronRight, Search} from 'lucide-react';
import {cn} from '@site/src/lib/utils';
import apiRoutes from '@site/src/data/api-routes.json';

export type MatrixRow = {
  id: string;
  /**
   * NHA's marking, as the builder normalised it: Mandatory, Optional,
   * Conditional, Unmarked, or Portal check for a case this portal added. Kept
   * open, because the sheets decide what appears here and a union that falls
   * behind them hides rows.
   */
  type: string;
  /** NHA's own wording when the marking is conditional. Empty otherwise. */
  condition?: string;
  functionality: string;
  expected: string;
  /**
   * A call named by a case this portal wrote, rather than by a sheet. Carries
   * no method where the source states none.
   */
  api?: {method?: string | null; path: string; to?: string | null} | null;
  /** The calls NHA's sheet names for this case, as absolute URLs. */
  apis?: string[];
  webhook?: {method?: string | null; path: string} | null;
  detail?: string;
};

export type MatrixGroup = {
  id: string;
  label: string;
  rows: MatrixRow[];
};

export type Matrix = {
  module: string;
  title: string;
  groups: MatrixGroup[];
};

type RouteEntry = {
  key: string;
  hosts: string[];
  kind: 'operation' | 'callback';
  operationId: string;
  method: string;
  path: string;
  summary: string;
  route: string;
  callbacks: {
    method: string;
    path: string;
    summary: string;
    route: string;
    relation: string;
  }[];
};

const ALL = 'All types';

/** Certification weight first, this portal's own suggestions last. */
const TYPE_ORDER = [
  'Mandatory',
  'Conditional',
  'Optional',
  'Unmarked',
  'Portal check',
];

const PORTAL_TYPE = 'Portal check';

const TYPE_NOTE: Record<string, string> = {
  Mandatory: 'NHA certifies against this case.',
  Conditional: 'NHA certifies against this case under the condition it states.',
  Optional: 'NHA lists this case and does not require it.',
  Unmarked: 'NHA left the marking blank on its sheet.',
  [PORTAL_TYPE]:
    'This portal suggests this check. NHA does not certify against it.',
};

function typeClass(type: string) {
  return `matrix__type--${type.toLowerCase().replace(/\s+/g, '-')}`;
}

// ---------------------------------------------------------------------------
// Joining a case to the pages for the calls it names.
//
// A sheet names a call as a URL and this site publishes it at a route, and the
// two are matched on the segments that identify an operation rather than on
// the whole URL. scripts/lib/api-join.mjs holds the same reduction, and
// build-api-reference.mjs writes api-routes.json with it, so this is the third
// reader of one rule rather than a fourth spelling of it.

const NOISE = new Set([
  '',
  'api',
  'apis',
  'abha',
  'gateway',
  'hiecm',
  'v1',
  'v1.5',
  'v2',
  'v3',
  'v3.1',
  'v0.5',
]);

function joinKey(url: string) {
  const path = String(url)
    .replace(/^https?:\/\/[^/]+/, '')
    .replace(/\/v3enrollment\//, '/v3/enrollment/')
    .split('?')[0]
    .split('#')[0];
  return path
    .split('/')
    .map((part) => part.toLowerCase())
    .filter((part) => !NOISE.has(part))
    .join('/');
}

function hostOf(url: string) {
  const match = /^https?:\/\/([^/]+)/.exec(String(url));
  return match ? match[1].toLowerCase() : '';
}

const byKey = new Map<string, RouteEntry[]>();
for (const entry of apiRoutes as RouteEntry[]) {
  const found = byKey.get(entry.key);
  if (found) {
    found.push(entry);
  } else {
    byKey.set(entry.key, [entry]);
  }
}

/**
 * The published call a sheet's URL names, or nothing.
 *
 * The host narrows it where the path alone is ambiguous: `phr/app/enrollment/
 * encrypt` is an operation in both the M1 and the P1 specification, and only
 * the host the sheet names tells them apart. Where the host matches nothing,
 * the path is still taken, because a sheet naming a sandbox host for a call
 * published against production is a difference in environment, not in call.
 */
function resolve(url: string): RouteEntry | undefined {
  const found = byKey.get(joinKey(url));
  if (!found?.length) return undefined;
  const host = hostOf(url);
  return found.find((entry) => entry.hosts.includes(host)) ?? found[0];
}

/**
 * The readable part of a call. Most entries are endpoint URLs, whose path
 * identifies the call. The HFR sheets point at Swagger anchors instead, where
 * the path is always /swagger-ui.html and the operation sits in the fragment,
 * so the fragment wins there.
 */
function shortPath(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hash) {
      const tail = parsed.hash.split('/').filter(Boolean).pop();
      if (tail) return decodeURIComponent(tail);
    }
    return parsed.pathname;
  } catch {
    return url;
  }
}

type Call = {
  method?: string | null;
  path: string;
  route?: string | null;
  title?: string;
};

/**
 * The calls a case makes and the callbacks it receives, as two lists.
 *
 * Which is which is not in the sheet. A sheet lists a use case's calls in one
 * column and mixes them freely: M2's linking cases name `/link/carecontext`,
 * which you call, beside `/consent/request/hip/on-notify`, which you receive.
 * The specification is what knows, because one sits under `paths` and the
 * other under `webhooks`, so the split is made on what resolving the URL
 * finds rather than on the shape of the path.
 *
 * The callbacks column has a second source. A case that names only the call it
 * makes still shows what that call answers with, wherever the specification
 * pairs them with x-abdm-triggered-by or x-abdm-answered-by. Nothing is
 * inferred beyond those two: a call with no stated pairing contributes no
 * callback.
 */
function callsOf(row: MatrixRow): {endpoints: Call[]; callbacks: Call[]} {
  const endpoints: Call[] = [];
  const callbacks: Call[] = [];
  const seen = new Set<string>();

  const add = (list: Call[], call: Call) => {
    const id = `${call.route ?? ''}|${call.path}`;
    if (seen.has(id)) return;
    seen.add(id);
    list.push(call);
  };

  for (const url of row.apis ?? []) {
    const entry = resolve(url);
    if (!entry) {
      // NHA names a call this portal does not publish. Every one of these is
      // an M4 call on the HPR or HFR hosts, which have no specification here
      // because M4 is phase 2. Showing the path unlinked says so without
      // pretending there is a page behind it.
      add(endpoints, {path: shortPath(url), title: url});
      continue;
    }
    add(entry.kind === 'callback' ? callbacks : endpoints, {
      method: entry.method,
      path: entry.path,
      route: entry.route,
      title: entry.summary,
    });
    for (const hook of entry.callbacks) {
      add(callbacks, {
        method: hook.method,
        path: hook.path,
        route: hook.route,
        title: hook.summary,
      });
    }
  }

  // A case this portal wrote names its call directly rather than as a URL.
  if (row.api) {
    add(endpoints, {
      method: row.api.method,
      path: row.api.path,
      route: row.api.to,
    });
  }
  if (row.webhook) {
    add(callbacks, {method: row.webhook.method, path: row.webhook.path});
  }
  return {endpoints, callbacks};
}

function matches(row: MatrixRow, query: string) {
  if (!query) return true;
  const {endpoints, callbacks} = callsOf(row);
  const haystack = [
    row.id,
    row.type,
    row.condition ?? '',
    row.functionality,
    row.expected,
    row.detail ?? '',
    ...[...endpoints, ...callbacks].map((call) => call.path),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function MethodChip({method}: {method?: string | null}) {
  if (!method) return null;
  return (
    <span className={`api-chip api-chip--${method.toLowerCase()}`}>{method}</span>
  );
}

/**
 * One column of calls. Linked where a page exists, plain where none does.
 *
 * The label is for the narrow layout. Under 1100px the four columns stack and
 * the header row is hidden, which left two lists of paths one above the other
 * with nothing saying which was the calls you make and which the callbacks you
 * receive. It is hidden again wherever the header row is doing that job.
 */
function CallList({calls, label}: {calls: Call[]; label: string}) {
  if (calls.length === 0) {
    return (
      <span className="matrix__calls">
        <span className="matrix__calls-label">{label}</span>
        <span className="matrix__empty">&mdash;</span>
      </span>
    );
  }
  return (
    <span className="matrix__calls">
      <span className="matrix__calls-label">{label}</span>
      {calls.map((call) => {
        const body = (
          <>
            <MethodChip method={call.method} />
            <code>{call.path}</code>
          </>
        );
        return call.route ? (
          <Link
            key={`${call.route}|${call.path}`}
            to={call.route}
            className="matrix__call matrix__call--link"
            title={call.title}>
            {body}
          </Link>
        ) : (
          <span
            key={`plain|${call.path}`}
            className="matrix__call"
            title={call.title}>
            {body}
          </span>
        );
      })}
    </span>
  );
}

/**
 * One module's certification cases, four columns wide.
 *
 * It was six, and two of them were failing to earn their width. The id sat in
 * a column of its own and the marking in another, both of them narrow and
 * both of them describing the same thing the use case column already named, so
 * a reader scanning for a case read across three columns to identify one row.
 * They are one cell now, which is also what makes room for the two that
 * matter: the calls a case exercises and the callbacks it receives, each
 * linked to the reference page for it.
 *
 * The filter buttons are the markings this matrix actually carries, so no case
 * can sit under a marking there is no way to filter for, and the tally says
 * how many of the module's cases the current filter leaves standing.
 */
export default function TestMatrix({matrix}: {matrix: Matrix}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>(ALL);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const filters = useMemo(() => {
    const present = new Set<string>();
    for (const group of matrix.groups) {
      for (const row of group.rows) present.add(row.type);
    }
    const rank = (type: string) => {
      const index = TYPE_ORDER.indexOf(type);
      return index < 0 ? TYPE_ORDER.length : index;
    };
    return [
      ALL,
      ...[...present].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b)),
    ];
  }, [matrix.groups]);

  const groups = useMemo(
    () =>
      matrix.groups
        .map((group) => ({
          ...group,
          rows: group.rows.filter(
            (row) => matches(row, query) && (filter === ALL || row.type === filter),
          ),
        }))
        .filter((group) => group.rows.length > 0),
    [matrix.groups, query, filter],
  );

  const total = matrix.groups.reduce((sum, group) => sum + group.rows.length, 0);
  const shown = groups.reduce((sum, group) => sum + group.rows.length, 0);

  const searching = query.length > 0 || filter !== ALL;
  const isOpen = (id: string) => open[id] ?? searching;

  return (
    <div className="matrix">
      <div className="matrix__controls">
        <div className="matrix__search">
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <input
            type="search"
            className="matrix__search-input"
            placeholder="Search cases, endpoints, results"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search this module"
          />
        </div>
        <div className="matrix__filters" role="group" aria-label="Filter by type">
          {filters.map((entry) => (
            <button
              key={entry}
              type="button"
              className={cn(
                'matrix__filter',
                filter === entry && 'matrix__filter--active',
              )}
              title={TYPE_NOTE[entry]}
              aria-pressed={filter === entry}
              onClick={() => setFilter(entry)}>
              {entry}
            </button>
          ))}
        </div>
      </div>

      <div className="matrix__panel">
        <div className="matrix__banner">
          <span className="matrix__module">{matrix.module}</span>
          <span className="matrix__title">{matrix.title}</span>
          <span className="matrix__tally">
            {shown === total ? `${total} cases` : `${shown} of ${total} cases`}
          </span>
        </div>

        <div className="matrix__head" role="row">
          <span>Use case</span>
          <span>Endpoints</span>
          <span>Callbacks</span>
          <span>Expected result</span>
        </div>

        {groups.length === 0 ? (
          <p className="matrix__none">Nothing matches that search.</p>
        ) : null}

        {groups.map((group) => (
          <div key={group.id} className="matrix__group">
            <button
              type="button"
              className="matrix__group-head"
              aria-expanded={isOpen(group.id)}
              onClick={() =>
                setOpen((current) => ({...current, [group.id]: !isOpen(group.id)}))
              }>
              {isOpen(group.id) ? (
                <ChevronDown className="size-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
              )}
              <span className="matrix__group-label">{group.label}</span>
              <span className="matrix__count">{group.rows.length}</span>
            </button>

            {isOpen(group.id)
              ? group.rows.map((row) => {
                  const {endpoints, callbacks} = callsOf(row);
                  return (
                    <div key={row.id + row.functionality} className="matrix__row">
                      <span className="matrix__case">
                        <span className="matrix__case-title">{row.functionality}</span>
                        <span className="matrix__case-meta">
                          <span
                            className={cn('matrix__type', typeClass(row.type))}
                            title={TYPE_NOTE[row.type]}>
                            {row.type}
                          </span>
                          <code className="matrix__id">{row.id}</code>
                        </span>
                        {row.condition ? (
                          <span className="matrix__condition">{row.condition}</span>
                        ) : null}
                      </span>
                      <CallList calls={endpoints} label="Endpoints" />
                      <CallList calls={callbacks} label="Callbacks" />
                      <span className="matrix__expected">
                        {row.expected}
                        {row.detail ? (
                          <span className="matrix__detail">{row.detail}</span>
                        ) : null}
                      </span>
                    </div>
                  );
                })
              : null}
          </div>
        ))}
      </div>
    </div>
  );
}
