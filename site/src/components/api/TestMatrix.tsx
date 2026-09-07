import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import {ChevronDown, ChevronRight, Search} from 'lucide-react';
import {cn} from '@site/src/lib/utils';

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
   * `method` is null where the source names a call and states no HTTP method
   * for it, which NHA's M2 document does for health-information/notify.
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

/**
 * The readable part of a call NHA names. Most entries are endpoint URLs, whose
 * path identifies the call. The HFR sheets point at Swagger anchors instead,
 * where the path is always /swagger-ui.html and the operation sits in the
 * fragment, so the fragment wins there.
 */
function shortPath(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hash) {
      const tail = parsed.hash.split('/').filter(Boolean).pop();
      if (tail) {
        return decodeURIComponent(tail);
      }
    }
    return parsed.pathname;
  } catch {
    return url;
  }
}

function matches(row: MatrixRow, query: string) {
  if (!query) {
    return true;
  }
  const haystack = [
    row.id,
    row.type,
    row.condition ?? '',
    row.functionality,
    row.expected,
    row.detail ?? '',
    row.api?.path ?? '',
    row.webhook?.path ?? '',
    ...(row.apis ?? []).map(shortPath),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function MethodChip({method}: {method?: string | null}) {
  if (!method) {
    return null;
  }
  return (
    <span className={`api-chip api-chip--${method.toLowerCase()}`}>
      {method}
    </span>
  );
}

function ApiCell({row}: {row: MatrixRow}) {
  if (row.api) {
    const label = (
      <>
        <MethodChip method={row.api.method} />
        <code>{row.api.path}</code>
      </>
    );
    return row.api.to ? (
      <Link to={row.api.to} className="matrix__api matrix__api--link card">
        {label}
      </Link>
    ) : (
      <span className="matrix__api">{label}</span>
    );
  }
  if (row.apis?.length) {
    return (
      <span className="matrix__apis">
        {row.apis.map((url) => (
          <code key={url} className="matrix__path" title={url}>
            {shortPath(url)}
          </code>
        ))}
      </span>
    );
  }
  return <span className="matrix__empty">&mdash;</span>;
}

/**
 * One module's use cases, the steps inside each, and the call every step makes.
 * A reader scanning for "which endpoint does this journey use" reads down the
 * REST API column; a reader building the journey reads the rows in order.
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
      for (const row of group.rows) {
        present.add(row.type);
      }
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
            placeholder="Search steps, endpoints, results"
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
          <span>ID</span>
          <span>Type</span>
          <span>What it does</span>
          <span>Expected result</span>
          <span>Endpoint</span>
          <span>Callback</span>
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
                setOpen((current) => ({
                  ...current,
                  [group.id]: !isOpen(group.id),
                }))
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
              ? group.rows.map((row) => (
                  <div key={row.id} className="matrix__row">
                    <code className="matrix__id">{row.id}</code>
                    <span
                      className={cn('matrix__type', typeClass(row.type))}
                      title={TYPE_NOTE[row.type]}>
                      {row.type}
                    </span>
                    <span className="matrix__what">
                      <span className="matrix__what-title">
                        {row.functionality}
                      </span>
                      <span className="matrix__what-group">{group.label}</span>
                    </span>
                    <span className="matrix__expected">
                      {row.expected}
                      {row.condition ? (
                        <span className="matrix__condition">
                          <span className="matrix__condition-label">
                            Applies when
                          </span>
                          {row.condition}
                        </span>
                      ) : null}
                      {row.detail ? (
                        <span className="matrix__detail">{row.detail}</span>
                      ) : null}
                    </span>
                    <ApiCell row={row} />
                    {row.webhook ? (
                      <span className="matrix__api">
                        <MethodChip method={row.webhook.method} />
                        <code>{row.webhook.path}</code>
                      </span>
                    ) : (
                      <span className="matrix__empty">&mdash;</span>
                    )}
                  </div>
                ))
              : null}
          </div>
        ))}
      </div>
    </div>
  );
}
