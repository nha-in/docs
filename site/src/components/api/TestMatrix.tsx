import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import {ChevronDown, ChevronRight, Search} from 'lucide-react';
import {cn} from '@site/src/lib/utils';

export type MatrixRow = {
  id: string;
  type: 'Mandatory' | 'Optional';
  functionality: string;
  expected: string;
  api?: {method: string; path: string; to?: string | null} | null;
  webhook?: {method: string; path: string} | null;
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

const FILTERS = ['All types', 'Mandatory', 'Optional'] as const;
type Filter = (typeof FILTERS)[number];

function matches(row: MatrixRow, query: string) {
  if (!query) {
    return true;
  }
  const haystack = [
    row.id,
    row.functionality,
    row.expected,
    row.detail ?? '',
    row.api?.path ?? '',
    row.webhook?.path ?? '',
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function ApiCell({row}: {row: MatrixRow}) {
  if (!row.api) {
    return <span className="matrix__empty">&mdash;</span>;
  }
  const label = (
    <>
      <span className={`api-chip api-chip--${row.api.method.toLowerCase()}`}>
        {row.api.method}
      </span>
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

/**
 * One module's use cases, the steps inside each, and the call every step makes.
 * A reader scanning for "which endpoint does this journey use" reads down the
 * REST API column; a reader building the journey reads the rows in order.
 */
export default function TestMatrix({matrix}: {matrix: Matrix}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All types');
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const groups = useMemo(
    () =>
      matrix.groups
        .map((group) => ({
          ...group,
          rows: group.rows.filter(
            (row) =>
              matches(row, query) &&
              (filter === 'All types' || row.type === filter),
          ),
        }))
        .filter((group) => group.rows.length > 0),
    [matrix.groups, query, filter],
  );

  const searching = query.length > 0 || filter !== 'All types';
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
          {FILTERS.map((entry) => (
            <button
              key={entry}
              type="button"
              className={cn(
                'matrix__filter',
                filter === entry && 'matrix__filter--active',
              )}
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
                      className={cn(
                        'matrix__type',
                        row.type === 'Mandatory' && 'matrix__type--mandatory',
                      )}>
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
                      {row.detail ? (
                        <span className="matrix__detail">{row.detail}</span>
                      ) : null}
                    </span>
                    <ApiCell row={row} />
                    {row.webhook ? (
                      <span className="matrix__api">
                        <span
                          className={`api-chip api-chip--${row.webhook.method.toLowerCase()}`}>
                          {row.webhook.method}
                        </span>
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
