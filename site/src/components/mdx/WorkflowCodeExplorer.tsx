import React, {useEffect, useMemo, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import data from '@site/src/data/nhcx-workflows.json';

/**
 * The NHCX workflow codes, searchable, in four views: the codes a provider
 * authors, the codes a payer authors, every row of the Workflow Status Sheet,
 * and the lettered families the handbook leaves out. The data is the published
 * catalogue, held in src/data/nhcx-workflows.json.
 */

type Row = {code: string; stage: string; header: string};

const titleCase = (s: string) =>
  s
    .replace(/_+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[A-Za-z]+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());

const codes = data.codes.map((c) => ({
  code: String(c.code),
  constant: c.constant ?? '',
  authoredBy: c.authored_by,
  useCase: c.use_case ?? '',
  description: c.means ?? '',
}));
const provider = codes.filter((c) => c.authoredBy === 'provider');
const payer = codes.filter((c) => c.authoredBy === 'payer');
const published: Row[] = data.sheet.map((r: any) => ({
  stage: r.stage,
  code: String(r.code),
  header: r.status,
}));

// The sheet opens on preauthorisation: its rows first, in code order, then
// every other row in the order the sheet publishes them.
const isPreauth = (r: Row) => /pre ?auth|enhancement/i.test(r.stage);
const sheet: Row[] = [
  ...published
    .filter(isPreauth)
    .sort((a, b) => (a.code < b.code ? -1 : a.code > b.code ? 1 : 0)),
  ...published.filter((r) => !isPreauth(r)),
];

const names: Record<string, string> = {};
sheet.forEach((r) => {
  if (!(r.code in names)) names[r.code] = titleCase(r.stage);
});
codes.forEach((c) => {
  if (c.constant) names[c.code] = titleCase(c.constant);
});
const nameOf = (code: string) => names[code] ?? code;

const allCodes = new Set(
  [...sheet.map((r) => r.code), ...codes.map((c) => c.code)].map((c) => c.toLowerCase()),
);

const familyRows = (prefix: string) =>
  sheet.filter((r) => /^[A-Za-z]+/.exec(r.code)?.[0] === prefix);

const STATUS_KIND: Record<string, string> = {
  'request.initiated': 'initiated',
  'response.partial': 'partial',
  'response.complete': 'complete',
  'response.error': 'error',
};

function Status({value}: {value: string}) {
  const kind = STATUS_KIND[value];
  return (
    <span className={`wf-status${kind ? ` wf-status--${kind}` : ''}`}>
      {value}
    </span>
  );
}

const TABS = [
  {id: 'sheet', label: 'Full status sheet', count: sheet.length},
  {id: 'provider', label: 'Provider-authored', count: provider.length},
  {id: 'payer', label: 'Payer-authored', count: payer.length},
  {id: 'families', label: 'Lettered families', count: data.families.length},
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function WorkflowCodeExplorer(): React.JSX.Element {
  const [tab, setTab] = useState<TabId>('sheet');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  // A link such as `?code=15` from another page opens the sheet on that code.
  const {search} = useLocation();
  useEffect(() => {
    const code = new URLSearchParams(search).get('code');
    if (code) {
      setQuery(code);
      setTab('sheet');
    }
  }, [search]);

  const shown = useMemo(() => {
    // A query that is a code on its own matches that code exactly, so 15
    // does not also bring up 151 and R15.
    const exact = allCodes.has(q);
    const hit = (...fields: string[]) =>
      !q ||
      (exact
        ? fields[0].toLowerCase() === q
        : fields.some((f) => f.toLowerCase().includes(q)));
    return {
      provider: provider.filter((c) =>
        hit(c.code, c.constant, nameOf(c.code), c.description, c.useCase),
      ),
      payer: payer.filter((c) =>
        hit(c.code, c.constant, nameOf(c.code), c.description),
      ),
      sheet: sheet.filter((r) => hit(r.code, r.stage, r.header)),
      families: data.families
        .map((f) => ({
          ...f,
          rows: familyRows(f.prefix).filter((r) =>
            hit(r.code, r.stage, r.header, f.name, f.prefix),
          ),
        }))
        .filter((f) => f.rows.length > 0),
    };
  }, [q]);

  const empty = <p className="wf-explorer__empty">No match.</p>;

  return (
    <div className="wf-explorer">
      <div className="wf-explorer__controls">
        <input
          className="wf-explorer__search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by code, name or status"
          aria-label="Search workflow codes"
        />
        <div className="wf-explorer__tabs" role="tablist" aria-label="Code tables">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`wf-explorer__tab${tab === t.id ? ' wf-explorer__tab--active' : ''}`}
              onClick={() => setTab(t.id)}>
              {t.label} <span className="wf-explorer__count">{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === 'provider' && (
        <div className="wf-explorer__panel">
          <ul className="wf-explorer__list">
            {shown.provider.map((c) => (
              <li key={c.code}>
                <p className="wf-explorer__head">
                  <code>{c.code}</code>
                  <span className="wf-explorer__name">{nameOf(c.code)}</span>
                  {c.useCase && <span className="wf-explorer__tag">{c.useCase}</span>}
                </p>
                <p className="wf-explorer__desc">{c.description}</p>
              </li>
            ))}
          </ul>
          {shown.provider.length === 0 && empty}
        </div>
      )}

      {tab === 'payer' && (
        <div className="wf-explorer__panel">
          <ul className="wf-explorer__list">
            {shown.payer.map((c) => (
              <li key={c.code}>
                <p className="wf-explorer__head">
                  <code>{c.code}</code>
                  <span className="wf-explorer__name">{nameOf(c.code)}</span>
                </p>
                <p className="wf-explorer__desc">{c.description}</p>
              </li>
            ))}
          </ul>
          {shown.payer.length === 0 && empty}
        </div>
      )}

      {tab === 'sheet' && (
        <div className="wf-explorer__panel">
          <p className="wf-explorer__note">
            Spellings are as published, such as <code>Initimation</code>,{' '}
            <code>Reimburstment</code> and <code>protocal</code>, so that
            searching for what you saw in a payload finds the row.
          </p>
          <ul className="wf-explorer__list">
            {shown.sheet.map((r, i) => (
              <li key={`${r.code}-${r.header}-${i}`} className="wf-explorer__row">
                <code>{r.code}</code>
                <span className="wf-explorer__name">{titleCase(r.stage)}</span>
                <Status value={r.header} />
              </li>
            ))}
          </ul>
          {shown.sheet.length === 0 && empty}
        </div>
      )}

      {tab === 'families' && (
        <div className="wf-explorer__panel">
          <p className="wf-explorer__note">
            The handbook's table is a starter subset, not a closed list. These
            families appear only in the status sheet.
          </p>
          {shown.families.map((f) => (
            <section key={f.prefix} className="wf-explorer__family">
              <p className="wf-explorer__head">
                <span className="wf-explorer__name">{f.name}</span>
              </p>
              <p className="wf-explorer__desc">{f.covers}</p>
              <ul className="wf-explorer__list">
                {f.rows.map((r, i) => (
                  <li key={`${r.code}-${i}`} className="wf-explorer__row">
                    <code>{r.code}</code>
                    <span className="wf-explorer__name">{titleCase(r.stage)}</span>
                    <Status value={r.header} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {shown.families.length === 0 && empty}
        </div>
      )}
    </div>
  );
}
