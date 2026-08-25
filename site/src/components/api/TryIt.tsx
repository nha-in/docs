import React, {useEffect, useMemo, useState} from 'react';
import CodeBlock from '@theme/CodeBlock';
import {ChevronRight, Loader2, Send, X} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@site/src/components/ui/collapsible';
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from '@site/src/components/ui/dialog';
import type {Field, Operation} from './ApiEndpoint';
import {CopyButton} from './ApiEndpoint';
import type {BodyNode} from './body';
import {compose, leaves, seed, toTree} from './body';
import {curlFrom} from './curl';
import {
  consentManagerFor,
  findToken,
  GENERATED_HEADERS,
  perRequestHeaders,
  readToken,
  subscribeToken,
  writeToken,
} from './session';

/** Refresh REQUEST-ID/TIMESTAMP in a header map, leaving everything else as typed. */
function withFreshGenerated(current: Record<string, string>): Record<string, string> {
  const generated = perRequestHeaders();
  const next = {...current};
  for (const name of Object.keys(next)) {
    if (name in generated) next[name] = generated[name];
  }
  return next;
}

type Result =
  | {state: 'idle'}
  | {state: 'sending'}
  | {state: 'done'; status: number; statusText: string; body: string; ms: number}
  | {state: 'failed'; message: string};

/** One collapsible band in the left column. */
function Group({
  title,
  count,
  children,
}: {
  title: string;
  /** Omitted rather than 0 when there is nothing behind the count to report. */
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Collapsible defaultOpen className="api-console__section">
      <CollapsibleTrigger className="api-console__section-head">
        <ChevronRight className="api-console__caret size-3.5" aria-hidden="true" />
        {title}
        {typeof count === 'number' ? (
          <span className="api-console__count">{count}</span>
        ) : null}
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}

/**
 * One editable field.
 *
 * Declared at module scope rather than inside the console: a component
 * redefined on every render is a new type to React, which would remount the
 * input and take the cursor with it on every keystroke.
 */
function Row({
  id,
  field,
  badge,
  value,
  readOnly,
  masked,
  depth,
  onChange,
}: {
  id: string;
  field: Field;
  badge?: string;
  value: string;
  readOnly?: boolean;
  /** Set only by the caller that knows this is the Authorization token, not by
      guessing from the field's id: an ordinary header can end in "token" too. */
  masked?: boolean;
  /** How many groups this row sits inside. Set as an inline custom property
      because the row itself, not just its enclosing group, needs the step. */
  depth?: number;
  onChange: (next: string) => void;
}) {
  const leaf = field.name.split('.').pop() ?? field.name;
  const hintId = field.description ? `${id}-hint` : undefined;
  return (
    <div
      className="api-console__row"
      style={depth ? ({'--depth': depth} as React.CSSProperties) : undefined}>
      <label className="api-console__ident" htmlFor={id}>
        <code className="api-console__name">{field.name}</code>
        <span className="api-console__type">{field.type}</span>
        {field.required ? (
          <span className="api-console__required">Required</span>
        ) : null}
        {badge ? <span className="api-console__badge">{badge}</span> : null}
      </label>
      <input
        id={id}
        className="api-console__input"
        type={masked ? 'password' : 'text'}
        autoComplete="off"
        spellCheck={false}
        readOnly={readOnly}
        placeholder={`enter ${leaf}`}
        value={value}
        aria-describedby={hintId}
        onChange={(event) => onChange(event.target.value)}
      />
      {field.description ? (
        <p id={hintId} className="api-console__hint">
          {field.description}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Sends the request from the reader's own browser.
 *
 * There is no proxy in front of this. The request goes straight to NHA's host,
 * so it succeeds only where that host allows the browser origin. When it does
 * not, the failure is reported as what it is rather than dressed up as an API
 * error. Nothing typed here is stored or sent anywhere else.
 */
export default function TryIt({operation}: {operation: Operation}) {
  const [server, setServer] = useState(operation.servers[0]?.url ?? '');
  // The token is held for the browser session, so running the sessions call
  // once fills this in on every other endpoint's panel.
  const [token, setToken] = useState(readToken);
  const [headers, setHeaders] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      operation.headers.map((header) => [header.name, String(header.example ?? '')]),
    ),
  );
  const [pathValues, setPathValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(operation.pathParams.map((p) => [p.name, ''])),
  );
  const [queryValues, setQueryValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(operation.queryParams.map((q) => [q.name, ''])),
  );
  const [values, setValues] = useState(() =>
    seed(operation.body, operation.requestExample),
  );
  const [raw, setRaw] = useState(() =>
    operation.requestExample === undefined
      ? ''
      : JSON.stringify(operation.requestExample, null, 2),
  );
  const [mode, setMode] = useState<'fields' | 'raw'>(() =>
    leaves(operation.body).length ? 'fields' : 'raw',
  );
  const [rawError, setRawError] = useState('');
  const [tab, setTab] = useState<string>(() => operation.responses[0]?.status ?? 'live');
  const [result, setResult] = useState<Result>({state: 'idle'});

  // Another panel, or another page in this tab, may set the token first.
  useEffect(() => subscribeToken(setToken), []);

  // X-CM-ID is a property of the host, not something to type: keep it in step
  // with the server the reader picked.
  useEffect(() => {
    setHeaders((current) =>
      'X-CM-ID' in current
        ? {...current, 'X-CM-ID': consentManagerFor(server)}
        : current,
    );
  }, [server]);

  // The read-only boxes and the live cURL should never show the spec's
  // REQUEST-ID/TIMESTAMP example: generate real ones the moment the console
  // opens, not only once the reader presses Send.
  useEffect(() => {
    setHeaders((current) => withFreshGenerated(current));
  }, []);

  // The operation's own security array is the only source of truth for
  // whether a bearer token belongs on this request. A token can be sitting
  // in the session store from an earlier panel; that does not make this
  // operation authorized.
  const hasAuth = operation.security.length > 0;
  const hasBody = operation.method !== 'GET' && operation.method !== 'HEAD';
  const fieldRows = useMemo(() => toTree(operation.body), [operation.body]);
  const canUseFields = leaves(operation.body).length > 0;
  const tree = fieldRows;
  // NHA's own collection has nothing decomposed for this operation and no
  // example either: there is no schema here to badge a count against or to
  // fake up, just an empty box.
  const bodyUnknown = hasBody && !canUseFields && operation.requestExample === undefined;
  const bodyHint =
    "NHA's collection records no body shape for this operation. Paste a body if you have one, and treat the result as unverified.";
  const rawErrorId = `try-${operation.id}-body-error`;
  const bodyHintId = `try-${operation.id}-body-hint`;

  /** The body that will actually go out, whichever editor is in front. */
  function bodyText(): string {
    if (!hasBody) return '';
    if (mode === 'raw') return raw;
    const composed = compose(operation.body, values);
    return Object.keys(composed).length ? JSON.stringify(composed) : '';
  }

  /** Path braces filled, query string joined. An unfilled brace stays visible. */
  function requestUrl(): string {
    let path = operation.path;
    for (const param of operation.pathParams) {
      const typed = (pathValues[param.name] ?? '').trim();
      if (typed) path = path.replace(`{${param.name}}`, encodeURIComponent(typed));
    }
    const query = new URLSearchParams();
    for (const param of operation.queryParams) {
      const typed = (queryValues[param.name] ?? '').trim();
      if (typed) query.set(param.name, typed);
    }
    const search = query.toString();
    return `${server}${path}${search ? `?${search}` : ''}`;
  }

  /** Every header that will be sent, in the order cURL should print them. */
  function outgoingHeaders(): Record<string, string> {
    const sent: Record<string, string> = {};
    for (const [name, value] of Object.entries(headers)) if (value) sent[name] = value;
    if (hasAuth && token) sent.Authorization = `Bearer ${token}`;
    if (hasBody && bodyText()) sent['Content-Type'] = 'application/json';
    return sent;
  }

  // Every input here is state, so the command recomputes on the keystroke with
  // no effect and no debounce, and stays the request that would go out.
  const curl = useMemo(
    () =>
      curlFrom({
        method: operation.method,
        url: requestUrl(),
        headers: outgoingHeaders(),
        body: hasBody ? bodyText() : undefined,
      }),
    [server, pathValues, queryValues, headers, token, mode, values, raw],
  );

  /**
   * Hand the body from one editor to the other.
   *
   * Round tripping on every keystroke would reformat what the reader is halfway
   * through typing, so the two only meet at the moment of switching.
   */
  function switchTo(next: 'fields' | 'raw') {
    if (next === mode) return;
    if (next === 'raw') {
      const composed = compose(operation.body, values);
      // An empty composed object means nothing was typed, so the JSON view
      // shows nothing too: falling back to whatever raw held before would
      // resurrect a seeded example the fields never carried, and send it.
      setRaw(Object.keys(composed).length ? JSON.stringify(composed, null, 2) : '');
      setRawError('');
      setMode('raw');
      return;
    }
    try {
      setValues(seed(operation.body, JSON.parse(raw || '{}')));
      setRawError('');
      setMode('fields');
    } catch {
      // Refuse the switch rather than silently discarding what was typed.
      setRawError('That is not valid JSON, so the fields cannot be filled from it.');
    }
  }

  function renderNode(node: BodyNode, depth: number): React.ReactNode {
    if (node.children.length) {
      return (
        <div
          key={node.field.name}
          className="api-console__group"
          style={{'--depth': depth} as React.CSSProperties}>
          <div className="api-console__ident">
            <code className="api-console__name">{node.leaf}</code>
            <span className="api-console__type">{node.field.type}</span>
            {node.field.required ? (
              <span className="api-console__required">Required</span>
            ) : null}
            {node.field.type.endsWith('[]') ? (
              <span className="api-console__badge">One element</span>
            ) : null}
          </div>
          {node.children.map((child) => renderNode(child, depth + 1))}
        </div>
      );
    }
    return (
      <Row
        key={node.field.name}
        id={`try-${operation.id}-body-${node.field.name}`}
        field={{...node.field, name: node.leaf}}
        value={values[node.field.name] ?? ''}
        depth={depth}
        onChange={(next) =>
          setValues((current) => ({...current, [node.field.name]: next}))
        }
      />
    );
  }

  async function send(event: React.FormEvent) {
    event.preventDefault();
    setResult({state: 'sending'});
    const started = Date.now();
    try {
      // NHA rejects a reused REQUEST-ID and a drifted TIMESTAMP, so both are
      // generated again at the moment of sending rather than carried from
      // whatever the console showed while the reader was still typing.
      const outgoing = withFreshGenerated(headers);
      setHeaders(outgoing); // Show what actually went out.

      const sent: Record<string, string> = {};
      for (const [name, value] of Object.entries(outgoing)) {
        if (value) sent[name] = value;
      }
      if (hasAuth && token) sent.Authorization = `Bearer ${token}`;
      const payload = bodyText();
      if (hasBody && payload) sent['Content-Type'] = 'application/json';

      const response = await fetch(requestUrl(), {
        method: operation.method,
        headers: sent,
        body: hasBody && payload ? payload : undefined,
      });
      const text = await response.text();
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // Not JSON. Show what came back.
      }
      // A call that hands back a token saves the reader pasting it into the
      // next one.
      const returned = findToken(pretty);
      if (returned && returned !== token) {
        setToken(returned);
        writeToken(returned);
      }

      setResult({
        state: 'done',
        status: response.status,
        statusText: response.statusText,
        body: pretty,
        ms: Date.now() - started,
      });
      // Only now does the Live tab exist to switch to.
      setTab('live');
    } catch (error) {
      setResult({
        state: 'failed',
        message:
          error instanceof Error ? error.message : 'The request did not complete.',
      });
      setTab('live');
    }
  }

  const base = `try-${operation.id}-response`;
  const live = result.state === 'done' || result.state === 'failed';
  const matched =
    result.state === 'done'
      ? operation.responses.find((r) => r.status === String(result.status))?.status
      : undefined;
  const documented = operation.responses.find((r) => r.status === tab);
  const copyable =
    tab === 'live'
      ? result.state === 'done'
        ? result.body
        : ''
      : documented?.example !== undefined
        ? JSON.stringify(documented.example, null, 2)
        : '';

  function onTabKeys(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const ids = [...(live ? ['live'] : []), ...operation.responses.map((r) => r.status)];
    const index = ids.indexOf(tab);
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = ids[(index + step + ids.length) % ids.length];
    setTab(next);
    event.preventDefault();
    (event.currentTarget.querySelector(`#${base}-tab-${next}`) as HTMLElement)?.focus();
  }

  return (
    <form
      className="api-console__frame"
      onSubmit={send}
      aria-busy={result.state === 'sending'}>
      <header className="api-console__head">
        <span className={`api-chip api-chip--${operation.method.toLowerCase()}`}>
          {operation.method}
        </span>
        <DialogTitle className="api-console__title">{operation.summary}</DialogTitle>

        <code className="api-console__url">
          <select
            className="api-console__server"
            aria-label="Server"
            value={server}
            onChange={(event) => setServer(event.target.value)}>
            {operation.servers.map((entry) => (
              <option key={entry.url} value={entry.url}>
                {entry.url}
              </option>
            ))}
          </select>
          {operation.path
            .split('/')
            .filter(Boolean)
            .map((segment, index) => {
              const name = segment.slice(1, -1);
              const filled = segment.startsWith('{') ? pathValues[name] : '';
              return (
                // A path can repeat a literal segment (or, in principle, a
                // param name), so the segment text alone is not a stable key.
                <React.Fragment key={`${index}-${segment}`}>
                  <span className="api-console__url-sep">/</span>
                  <span
                    className={
                      segment.startsWith('{')
                        ? 'api-console__url-var'
                        : 'api-console__url-part'
                    }>
                    {filled || segment}
                  </span>
                </React.Fragment>
              );
            })}
        </code>

        <button
          type="submit"
          className="api-console__send"
          disabled={result.state === 'sending'}>
          {result.state === 'sending' ? (
            <Loader2 className="api-console__spinner size-4" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          Send
        </button>

        <DialogClose className="api-console__close" aria-label="Close">
          <X className="size-4" aria-hidden="true" />
        </DialogClose>
      </header>

      <DialogDescription className="api-console__lede">
        {operation.description.split('\n\n')[0] || operation.summary}
      </DialogDescription>

      <div className="api-console__body">
        <div className="api-console__col">
          {operation.pathParams.length ? (
            <Group title="Path parameters" count={operation.pathParams.length}>
              {operation.pathParams.map((field) => (
                <Row
                  key={field.name}
                  id={`try-${operation.id}-path-${field.name}`}
                  field={field}
                  value={pathValues[field.name] ?? ''}
                  onChange={(next) =>
                    setPathValues((current) => ({...current, [field.name]: next}))
                  }
                />
              ))}
            </Group>
          ) : null}

          {operation.queryParams.length ? (
            <Group title="Query parameters" count={operation.queryParams.length}>
              {operation.queryParams.map((field) => (
                <Row
                  key={field.name}
                  id={`try-${operation.id}-query-${field.name}`}
                  field={field}
                  value={queryValues[field.name] ?? ''}
                  onChange={(next) =>
                    setQueryValues((current) => ({...current, [field.name]: next}))
                  }
                />
              ))}
            </Group>
          ) : null}

          {hasAuth ? (
            <Group title="Authorization" count={operation.security.length}>
              <Row
                id={`try-${operation.id}-token`}
                field={{
                  name: 'Authorization',
                  type:
                    operation.security[0]?.scheme === 'bearer' ? 'bearer token' : 'token',
                  required: true,
                  description:
                    operation.security[0]?.description ??
                    'Paste the token from the sessions call.',
                }}
                masked
                badge={token ? 'held for this session' : undefined}
                value={token}
                onChange={(next) => {
                  setToken(next);
                  writeToken(next);
                }}
              />
            </Group>
          ) : null}

          {operation.headers.length ? (
            <Group title="Headers" count={operation.headers.length}>
              {operation.headers.map((field) => (
                <Row
                  key={field.name}
                  id={`try-${operation.id}-header-${field.name}`}
                  field={field}
                  badge={
                    GENERATED_HEADERS.has(field.name)
                      ? 'generated per request'
                      : field.name === 'X-CM-ID'
                        ? 'from the server'
                        : undefined
                  }
                  readOnly={GENERATED_HEADERS.has(field.name)}
                  value={headers[field.name] ?? ''}
                  onChange={(next) =>
                    setHeaders((current) => ({...current, [field.name]: next}))
                  }
                />
              ))}
            </Group>
          ) : null}

          {hasBody ? (
            <Group title="Body" count={bodyUnknown ? undefined : leaves(operation.body).length}>
              {canUseFields ? (
                <div className="api-console__toggle" role="group" aria-label="Body editor">
                  <button
                    type="button"
                    className={`api-console__toggle-button${mode === 'fields' ? ' api-console__toggle-button--active' : ''}`}
                    aria-pressed={mode === 'fields'}
                    onClick={() => switchTo('fields')}>
                    Fields
                  </button>
                  <button
                    type="button"
                    className={`api-console__toggle-button${mode === 'raw' ? ' api-console__toggle-button--active' : ''}`}
                    aria-pressed={mode === 'raw'}
                    onClick={() => switchTo('raw')}>
                    JSON
                  </button>
                </div>
              ) : null}

              {rawError ? (
                <p id={rawErrorId} className="api-console__error" role="alert">
                  {rawError}
                </p>
              ) : null}

              {mode === 'fields' ? (
                tree.map((node) => renderNode(node, 0))
              ) : (
                <label className="api-console__row api-console__row--wide">
                  <span className="api-console__ident">
                    <code className="api-console__name">Request body</code>
                    <span className="api-console__type">json</span>
                  </span>
                  <textarea
                    className="api-console__input api-console__textarea"
                    rows={Math.min(18, Math.max(6, raw.split('\n').length))}
                    spellCheck={false}
                    value={raw}
                    placeholder={bodyUnknown ? bodyHint : undefined}
                    aria-describedby={
                      [rawError ? rawErrorId : null, bodyUnknown ? bodyHintId : null]
                        .filter(Boolean)
                        .join(' ') || undefined
                    }
                    onChange={(event) => setRaw(event.target.value)}
                  />
                  {/* The placeholder vanishes once something is typed; this copy
                      of it stays reachable to a screen reader the whole time. */}
                  {bodyUnknown ? (
                    <span id={bodyHintId} className="api-console__sr-only">
                      {bodyHint}
                    </span>
                  ) : null}
                </label>
              )}
            </Group>
          ) : null}

          <p className="api-console__note">
            The request goes straight from this browser to the server you picked.
            There is no proxy in between. Nothing you type here is stored, apart
            from the access token, which is held for this browser session only.
          </p>
        </div>

        <div className="api-console__col api-console__col--right">
          <div className="api-panel api-console__panel">
            <div className="api-panel__head">
              <span className="api-panel__label">Request</span>
              <span className="api-panel__lang">cURL</span>
              <CopyButton value={curl} />
            </div>
            <div
              className="api-console__pane api-console__pane--curl"
              role="region"
              aria-label="cURL for the request as typed"
              tabIndex={0}>
              <CodeBlock language="bash">{curl}</CodeBlock>
            </div>
          </div>

          <div className="api-panel api-console__panel api-console__panel--grow">
            <div className="api-panel__head">
              <div
                className="api-panel__tabs"
                role="tablist"
                aria-label="Responses"
                onKeyDown={onTabKeys}>
                {live ? (
                  <button
                    type="button"
                    role="tab"
                    id={`${base}-tab-live`}
                    aria-controls={`${base}-pane`}
                    aria-selected={tab === 'live'}
                    tabIndex={tab === 'live' ? 0 : -1}
                    className={`api-panel__tab${tab === 'live' ? ' api-panel__tab--active' : ''}`}
                    onClick={() => setTab('live')}>
                    Live
                  </button>
                ) : null}
                {operation.responses.map((response) => (
                  <button
                    key={response.status}
                    type="button"
                    role="tab"
                    id={`${base}-tab-${response.status}`}
                    aria-controls={`${base}-pane`}
                    aria-selected={tab === response.status}
                    tabIndex={tab === response.status ? 0 : -1}
                    className={[
                      'api-panel__tab',
                      tab === response.status ? 'api-panel__tab--active' : '',
                      matched === response.status ? 'api-console__tab--match' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setTab(response.status)}>
                    {response.status}
                  </button>
                ))}
              </div>
              {copyable ? <CopyButton value={copyable} /> : null}
            </div>

            <div
              className="api-console__pane"
              id={`${base}-pane`}
              role="tabpanel"
              aria-labelledby={`${base}-tab-${tab}`}
              tabIndex={0}>
              {tab === 'live' ? (
                <>
                  {/* Mounted once, empty until there is something to say, and
                      updated in place after that: an element that only appears
                      once its text is already in it is easy for a screen
                      reader to miss entirely. */}
                  <p className="api-console__status" aria-live="polite">
                    {result.state === 'done' ? (
                      <>
                        <span
                          className={`api-console__code api-console__code--${result.status < 400 ? 'ok' : 'bad'}`}>
                          {result.status} {result.statusText}
                        </span>
                        <span className="api-console__timing">{result.ms} ms</span>
                      </>
                    ) : result.state === 'failed' ? (
                      <span className="api-console__code api-console__code--bad">
                        No response
                      </span>
                    ) : null}
                  </p>

                  {result.state === 'done' ? (
                    <>
                      {matched ? (
                        <p className="api-console__meaning">
                          {operation.responses.find((r) => r.status === matched)
                            ?.description}
                        </p>
                      ) : null}
                      <CodeBlock language="json">
                        {result.body || '(empty body)'}
                      </CodeBlock>
                    </>
                  ) : null}

                  {result.state === 'failed' ? (
                    <p className="api-console__failed">
                      {result.message}. A request that never reaches the server
                      usually means the browser blocked it: the ABDM hosts do not
                      send the cross origin headers a browser needs. Copy the cURL
                      above and run it from your terminal instead.
                    </p>
                  ) : null}
                </>
              ) : documented ? (
                documented.example !== undefined ? (
                  <>
                    <p className="api-console__meaning">{documented.description}</p>
                    <CodeBlock language="json">
                      {JSON.stringify(documented.example, null, 2)}
                    </CodeBlock>
                  </>
                ) : (
                  <p className="api-panel__empty">{documented.description}</p>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
