import React, {useEffect, useMemo, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import data from '@site/src/data/api/nhcx-errors.json';

/**
 * Every NHCX error code in one searchable table: the gateway's NHCX- codes,
 * the PMJAY payer's PAYR- codes and the ERR-PYR- code met only live. The rows
 * come from the Catalogue's error atoms through scripts/build-api-reference.mjs,
 * which writes src/data/api/nhcx-errors.json on every start and build.
 */

type Row = {
  code: string;
  meaning: string;
  plain: string;
  message: string;
  sheets: string[];
  paths: string[];
};

const rows = data as Row[];

/** The workbook sheet a code comes from, as the reader thinks of it. */
const AREA: Record<string, string> = {
  'Preauth Error Codes': 'Preauthorisation',
  'Claim Error Codes': 'Claim',
  'Coverage Error Codes': 'Coverage eligibility',
  'Insurance Plan Error': 'Insurance plan',
  'Bridge Error': 'Bundle structure',
  'NHCX Error Codes': 'Gateway',
  'Payer Error Codes': 'Standard payer sheet',
};
const LIVE = 'Observed live';

const areasOf = (row: Row) => (row.sheets.length ? row.sheets.map((s) => AREA[s] ?? s) : [LIVE]);

const FILTERS = [
  'All',
  'Preauthorisation',
  'Claim',
  'Coverage eligibility',
  'Insurance plan',
  'Bundle structure',
  'Gateway',
  'Standard payer sheet',
  LIVE,
];

/** Who sent a code, from its prefix. */
function space(code: string): 'gateway' | 'payer' | 'live' {
  if (code.startsWith('NHCX-')) return 'gateway';
  if (code.startsWith('PAYR-')) return 'payer';
  return 'live';
}

export default function ErrorCodeExplorer(): React.JSX.Element {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  // A link such as `?code=PAYR-1238` from another page opens on that code.
  const {search} = useLocation();
  useEffect(() => {
    const code = new URLSearchParams(search).get('code');
    if (code) {
      setQuery(code);
      setFilter('All');
    }
  }, [search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {All: rows.length};
    for (const row of rows) for (const a of areasOf(row)) c[a] = (c[a] ?? 0) + 1;
    return c;
  }, []);

  const shown = useMemo(() => {
    const exact = rows.some((r) => r.code.toLowerCase() === q);
    return rows.filter((row) => {
      if (filter !== 'All' && !areasOf(row).includes(filter)) return false;
      if (!q) return true;
      if (exact) return row.code.toLowerCase() === q;
      return [row.code, row.meaning, row.plain, row.message, ...row.paths].some((f) =>
        f.toLowerCase().includes(q),
      );
    });
  }, [filter, q]);

  return (
    <div className="err-explorer">
      <div className="wf-explorer__controls">
        <input
          className="wf-explorer__search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by code, message or path"
          aria-label="Search error codes"
        />
        <div className="wf-explorer__tabs" role="tablist" aria-label="Error areas">
          {FILTERS.filter((f) => counts[f]).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={`wf-explorer__tab${filter === f ? ' wf-explorer__tab--active' : ''}`}
              onClick={() => setFilter(f)}>
              {f} <span className="wf-explorer__count">{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="err-explorer__count">
        {shown.length} of {rows.length} codes
      </p>
      <div className="err-explorer__scroll">
        <table className="err-explorer__table">
          <thead>
            <tr>
              <th>Code</th>
              <th>What it means</th>
              <th>Message as sent</th>
              <th>Area</th>
              <th>Arrives on</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <tr key={row.code} id={row.code.toLowerCase()}>
                <td>
                  <span className={`err-code err-code--${space(row.code)}`}>{row.code}</span>
                </td>
                <td>
                  <strong>{row.meaning}</strong>
                  {row.plain && <span className="err-explorer__plain">{row.plain}</span>}
                </td>
                <td className="err-explorer__message">{row.message}</td>
                <td>
                  {areasOf(row).map((a) => (
                    <span key={a} className="wf-explorer__tag err-explorer__area">
                      {a}
                    </span>
                  ))}
                </td>
                <td className="err-explorer__paths">
                  {row.paths.map((p) => (
                    <code key={p}>{p}</code>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="wf-explorer__empty">No match.</p>}
      </div>
    </div>
  );
}
