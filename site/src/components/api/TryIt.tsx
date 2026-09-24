import React, {useEffect, useMemo, useRef, useState} from 'react';
import CodeBlock from '@theme/CodeBlock';
import {ChevronRight, Info, Loader2, Send, X} from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@site/src/components/ui/tooltip';
import type {Field, Operation} from './ApiEndpoint';
import {AskAiButton, CopyButton, fenced} from './ApiEndpoint';
import {redact} from './redact';
import type {BodyNode} from './body';
import {compose, leaves, seed, toTree} from './body';
import {curlFrom} from './curl';
import type {Padding} from './rsa';
import {encryptValue, paddingFromAlgorithm} from './rsa';
import {
  consentManagerFor,
  findToken,
  GENERATED_HEADERS,
  perRequestHeaders,
  readCarried,
  readToken,
  subscribeCarried,
  subscribeToken,
  writeCarried,
  writeToken,
} from './session';
import {carriedValues, fillFrom} from './carry';

// The V3 public certificate lives at this path under the M1 server. It is the
// key that encrypts the identifiers in an M1 request body, and its response
// names its own algorithm. Only M1 request bodies carry encrypted fields, so
// this is the only certificate the console fetches.
const CERT_PATH = '/v3/profile/public/certificate';

/**
 * Sandbox or production, read from the description the specification gives the
 * server rather than guessed from its hostname. Both are on abdm.gov.in and
 * one of them creates real accounts against real people, so a server whose
 * description does not say which it is returns null and gets no label. A wrong
 * label here is worse than none.
 */
function environmentOf(description: string): 'Production' | 'Sandbox' | null {
  if (/\bprod/i.test(description)) return 'Production';
  if (/sandbox|sbx|\bdev\b/i.test(description)) return 'Sandbox';
  return null;
}

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
  open = true,
  children,
}: {
  title: string;
  /** Omitted rather than 0 when there is nothing behind the count to report. */
  count?: number;
  /** Set false for a band that holds nothing to type. It still opens on a
      click; it just does not spend a screen of the console saying so. */
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Collapsible defaultOpen={open} className="api-console__section">
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
 * A field's explanation, one hover or one tab stop away rather than a
 * paragraph under every input. The prose was most of the console's scroll and
 * almost none of its work. The words are not lost: the tooltip carries them
 * for a pointer or a keyboard, and the hidden copy beside it is what the
 * input's `aria-describedby` points at, so a screen reader still reads the
 * description with the field rather than only on hover.
 */
function Hint({id, text}: {id: string; text: string}) {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="api-console__why"
              aria-label={`About this field: ${text}`}>
              <Info className="size-3.5" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="api-console__tip">{text}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span id={id} className="api-console__sr-only">
        {text}
      </span>
    </>
  );
}

/** A line of standing advice, with the rest of it behind the mark beside it. */
function Note({id, short, full}: {id: string; short: string; full: string}) {
  return (
    <p className="api-console__note">
      {short}
      <Hint id={id} text={full} />
    </p>
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
  placeholder,
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
  /** Example ghost text. An example belongs in the placeholder, never in
      the value: a prefilled box is something the reader has to erase. */
  placeholder?: string;
}) {
  const leaf = field.name.split('.').pop() ?? field.name;
  const hintId = field.description ? `${id}-hint` : undefined;
  const ghost = placeholder ?? `enter ${leaf}`;
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
        {field.description && hintId ? (
          <Hint id={hintId} text={field.description} />
        ) : null}
      </label>
      <input
        id={id}
        className="api-console__input"
        type={masked ? 'password' : 'text'}
        autoComplete="off"
        spellCheck={false}
        readOnly={readOnly}
        placeholder={ghost}
        value={value}
        aria-describedby={hintId}
        onChange={(event) => onChange(event.target.value)}
      />
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
  // Inputs start empty. The spec's examples appear as placeholder ghost
  // text instead, so nothing has to be erased before typing. The two
  // exceptions are filled by their own effects: the generated pair
  // (REQUEST-ID/TIMESTAMP) and the server-derived X-CM-ID.
  const [headers, setHeaders] = useState<Record<string, string>>(() =>
    Object.fromEntries(operation.headers.map((header) => [header.name, ''])),
  );
  const [pathValues, setPathValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(operation.pathParams.map((p) => [p.name, ''])),
  );
  const [queryValues, setQueryValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(operation.queryParams.map((q) => [q.name, ''])),
  );
  // A value the schema fixes is filled in and locked: the reader only types
  // what varies per request.
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (operation.body ?? [])
        .filter((field) => field.fixed !== undefined)
        .map((field) => [field.name, [field.fixed].flat().join(', ')]),
    ),
  );
  const [expanded, setExpanded] = useState(false);
  const ghosts = useMemo(
    () => seed(operation.body, operation.requestExample),
    [operation],
  );
  const [raw, setRaw] = useState('');
  const [mode, setMode] = useState<'fields' | 'raw'>(() =>
    leaves(operation.body).length ? 'fields' : 'raw',
  );
  const [rawError, setRawError] = useState('');
  const [tab, setTab] = useState<string>(() => operation.responses[0]?.status ?? 'live');
  const [result, setResult] = useState<Result>({state: 'idle'});

  // Encryption. The console encrypts the marked fields in the browser before
  // sending, so the reader types a raw mobile number or OTP rather than a
  // ciphertext. The key comes from the server (which also states its algorithm)
  // or is pasted; a reader who already holds ciphertext turns encryption off.
  const hasEncrypted = useMemo(
    () => leaves(operation.body).some((field) => field.encrypted),
    [operation],
  );
  const [keySource, setKeySource] = useState<'server' | 'paste'>('server');
  const [pastedKey, setPastedKey] = useState('');
  const [pastePadding, setPastePadding] = useState<Padding>('oaep-sha1');
  const [serverKey, setServerKey] = useState<{key: string; padding: Padding} | null>(null);
  const [keyState, setKeyState] = useState<'idle' | 'fetching' | 'ready' | 'error'>('idle');
  const [keyError, setKeyError] = useState('');
  const [sendAsTyped, setSendAsTyped] = useState(false);

  // A fetched key belongs to the server it came from. Change server, drop it.
  useEffect(() => {
    setServerKey(null);
    setKeyState('idle');
    setKeyError('');
  }, [server]);

  /** The key and padding to encrypt with now, or null when none is ready. */
  function activeKey(): {key: string; padding: Padding} | null {
    if (keySource === 'paste') {
      return pastedKey.trim() ? {key: pastedKey, padding: pastePadding} : null;
    }
    return serverKey;
  }

  async function fetchKey() {
    setKeyState('fetching');
    setKeyError('');
    try {
      const requestHeaders: Record<string, string> = {
        ...perRequestHeaders(),
        'X-CM-ID': consentManagerFor(server),
        Accept: 'application/json',
      };
      if (token) requestHeaders.Authorization = `Bearer ${token}`;
      const response = await fetch(`${server}${CERT_PATH}`, {headers: requestHeaders});
      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          response.status === 401
            ? 'the certificate call needs a token; run the gateway session first'
            : response.status === 403 && !text.trim()
              ? 'the sandbox only accepts browser requests from origins NHA has allowlisted, and this site is not one yet; paste the key instead, or run the portal locally on localhost:3000'
              : `the certificate call returned ${response.status}`,
        );
      }
      const data = await response.json();
      if (!data.publicKey) throw new Error('the response carried no publicKey');
      setServerKey({key: data.publicKey, padding: paddingFromAlgorithm(data.encryptionAlgorithm)});
      setKeyState('ready');
    } catch (error) {
      setKeyState('error');
      setKeyError(error instanceof Error ? error.message : 'the certificate call failed');
    }
  }

  // Another panel, or another page in this tab, may set the token first.
  useEffect(() => subscribeToken(setToken), []);

  // Where focus lands when the console opens.
  //
  // The dialog's focus scope otherwise sends it to the first tabbable thing
  // inside, which is the environment chip, and that chip's tooltip opens on
  // focus. At phone widths the header wraps, so the tooltip is drawn straight
  // over the Send button and the close X and the reader can neither submit nor
  // close. Claiming focus for the frame here settles it: a child's effect runs
  // before its parent's, so the focus scope finds focus already inside the
  // dialog and leaves it where it is.
  const frame = useRef<HTMLFormElement>(null);
  useEffect(() => {
    frame.current?.focus();
  }, []);

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

  // A value an earlier step returned fills the field whose example names it:
  // the txnId an OTP request hands the verify call, the X-token a login hands
  // the profile calls. That step may have run on another page in this tab.
  // Only empty fields are filled, so nothing the reader typed is replaced.
  useEffect(() => {
    const headerExamples = Object.fromEntries(operation.headers.map((h) => [h.name, h.example]));
    const fill = (current: Record<string, string>, examples: Record<string, unknown>, carried: Record<string, string>) => {
      let next = current;
      for (const [name, example] of Object.entries(examples)) {
        if (current[name]) continue;
        const value = fillFrom(example, carried);
        if (value !== undefined) next = {...next, [name]: value};
      }
      return next;
    };
    const apply = (carried: Record<string, string>) => {
      setValues((current) => fill(current, ghosts, carried));
      setHeaders((current) => fill(current, headerExamples, carried));
    };
    apply(readCarried());
    return subscribeCarried(apply);
  }, [ghosts, operation.headers]);

  // The operation's own security array is the only source of truth for
  // whether a bearer token belongs on this request. A token can be sitting
  // in the session store from an earlier panel; that does not make this
  // operation authorized.
  const hasAuth = operation.security.length > 0;
  // The header the token travels in. An http bearer scheme puts it in
  // Authorization; an apiKey scheme names its own header, as NHCX's
  // `bearer_auth` does, and sending Authorization there is ignored.
  const scheme = operation.security[0];
  const authHeader =
    scheme?.type === 'apiKey' && scheme.in === 'header' && scheme.headerName
      ? scheme.headerName
      : 'Authorization';
  const authValue = (held: string): string =>
    authHeader === 'Authorization'
      ? `Bearer ${held}`
      : /^Bearer\s/i.test(held)
        ? held
        : `${scheme?.prefix ?? ''}${held}`;
  const environment = environmentOf(
    operation.servers.find((entry) => entry.url === server)?.description ?? '',
  );
  // Every header here is filled in for the reader, so the band is opened only
  // when one of them is theirs to type.
  const headersAreAutomatic =
    operation.headers.length > 0 &&
    operation.headers.every(
      (field) => GENERATED_HEADERS.has(field.name) || field.name === 'X-CM-ID',
    );
  const hasBody = operation.method !== 'GET' && operation.method !== 'HEAD';
  const fieldRows = useMemo(() => toTree(operation.body), [operation.body]);
  const canUseFields = leaves(operation.body).length > 0;
  const tree = fieldRows;
  // NHA's own collection has nothing decomposed for this operation and no
  // example either: there is no schema here to badge a count against or to
  // fake up, just an empty box.
  const bodyUnknown = hasBody && !canUseFields && operation.requestExample === undefined;
  const bodyHint =
    "NHA's collection records no body shape for this operation. Paste a body if you have one, and check the response against the specification.";
  const rawErrorId = `try-${operation.id}-body-error`;
  const bodyHintId = `try-${operation.id}-body-hint`;

  /** The preview body. Encrypted fields show a marker, not the raw value or a
      one-shot ciphertext, so the reader sees that encryption happens on send. */
  function bodyText(): string {
    if (!hasBody) return '';
    if (mode === 'raw') return raw;
    const shown = {...values};
    if (hasEncrypted && !sendAsTyped) {
      for (const field of leaves(operation.body)) {
        if (field.encrypted && values[field.name]) {
          shown[field.name] = `<ENCRYPTED ${field.name.split('.').pop()}>`;
        }
      }
    }
    const composed = compose(operation.body, shown);
    return Object.keys(composed).length ? JSON.stringify(composed) : '';
  }

  /** The body that actually goes out: the marked fields encrypted for real. */
  async function outgoingBody(): Promise<string> {
    if (!hasBody) return '';
    if (mode === 'raw') return raw;
    const effective = {...values};
    if (hasEncrypted && !sendAsTyped) {
      const key = activeKey();
      for (const field of leaves(operation.body)) {
        if (field.encrypted && values[field.name]) {
          if (!key) {
            throw new Error(
              'Fetch or paste a public key to encrypt the marked fields, or turn encryption off if the values are already encrypted.',
            );
          }
          effective[field.name] = await encryptValue(key.key, key.padding, values[field.name]);
        }
      }
    }
    const composed = compose(operation.body, effective);
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
    if (hasAuth && token) sent[authHeader] = authValue(token);
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
    const isEncrypted = Boolean(node.field.encrypted) && !sendAsTyped;
    return (
      <Row
        key={node.field.name}
        id={`try-${operation.id}-body-${node.field.name}`}
        field={{...node.field, name: node.leaf}}
        value={values[node.field.name] ?? ''}
        readOnly={node.field.fixed !== undefined}
        badge={isEncrypted ? 'encrypted on send' : node.field.fixed !== undefined ? 'fixed' : undefined}
        placeholder={
          isEncrypted ? `enter ${node.leaf} raw, it is encrypted on send` : ghosts[node.field.name]
        }
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
      if (hasAuth && token) sent[authHeader] = authValue(token);
      const payload = await outgoingBody();
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
      // And whatever it hands the next step: a txnId, an X-token.
      try {
        writeCarried(carriedValues(JSON.parse(text)));
      } catch {
        // Not JSON, so nothing to carry.
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
      ref={frame}
      tabIndex={-1}
      className={`api-console__frame${expanded ? ' api-console__frame--expanded' : ''}`}
      onSubmit={send}
      aria-busy={result.state === 'sending'}>
      <header className="api-console__head">
        <span className={`api-chip api-chip--${operation.method.toLowerCase()}`}>
          {operation.method}
        </span>
        <DialogTitle className="api-console__title">{operation.title || operation.summary}</DialogTitle>

        <code className="api-console__url">
          {environment ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    tabIndex={0}
                    className={`api-console__env api-console__env--${environment.toLowerCase()}`}>
                    {environment}
                  </span>
                </TooltipTrigger>
                {/* Below the chip, not above it. This one sits in the URL bar,
                    which wraps under the button row on a phone, so a tooltip
                    on the default side lands on top of Send and the close X. */}
                <TooltipContent side="bottom" className="api-console__tip">
                  {environment === 'Production'
                    ? 'The live ABDM environment. A call sent from here acts on real accounts and real records.'
                    : 'The ABDM sandbox. Test credentials, test identities, nothing that touches a real person.'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
          <select
            className="api-console__server"
            aria-label="Server"
            value={server}
            onChange={(event) => setServer(event.target.value)}>
            {/* Grouped rather than prefixed: an <optgroup> label shows in the
                open list and not in the closed control, so the dropdown says
                which ABDM each host is without repeating the chip beside it.
                A host whose description does not say goes in ungrouped. */}
            {(['Sandbox', 'Production', ''] as const).map((group) => {
              const entries = operation.servers.filter(
                (entry) => (environmentOf(entry.description) ?? '') === group,
              );
              if (!entries.length) return null;
              const options = entries.map((entry) => (
                <option key={entry.url} value={entry.url}>
                  {entry.url}
                </option>
              ));
              return group ? (
                <optgroup key={group} label={group}>
                  {options}
                </optgroup>
              ) : (
                <React.Fragment key="ungrouped">{options}</React.Fragment>
              );
            })}
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

      {/* The first paragraph of the description, with the inline markup the
          endpoint page renders: code spans and bold runs. NHA's M1 ledes use
          both, and a backticks-only renderer left "**parent's**" as typed. */}
      <DialogDescription className="api-console__lede">
        {inline(operation.description.split('\n\n')[0] || operation.summary)}
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
                  name: authHeader,
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
            <Group
              title="Headers"
              count={operation.headers.length}
              open={!headersAreAutomatic}>
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
                  placeholder={
                    field.example !== undefined ? String(field.example) : undefined
                  }
                  onChange={(next) =>
                    setHeaders((current) => ({...current, [field.name]: next}))
                  }
                />
              ))}
            </Group>
          ) : null}

          {hasEncrypted ? (
            <Group title="Encryption" count={undefined}>
              <Note
                id={`try-${operation.id}-enc-note`}
                short="Type the raw value."
                full="The marked fields are RSA encrypted in your browser before the request is sent. Nothing sensitive leaves this page except the ciphertext."
              />
              <div className="api-console__enc-source" role="radiogroup" aria-label="Public key">
                <label>
                  <input
                    type="radio"
                    name={`enc-${operation.id}`}
                    checked={keySource === 'server'}
                    onChange={() => setKeySource('server')}
                  />
                  Fetch the key from this server
                </label>
                <label>
                  <input
                    type="radio"
                    name={`enc-${operation.id}`}
                    checked={keySource === 'paste'}
                    onChange={() => setKeySource('paste')}
                  />
                  Paste a public key
                </label>
              </div>

              {keySource === 'server' ? (
                <div className="api-console__enc-row">
                  <button
                    type="button"
                    className="api-console__enc-fetch"
                    onClick={fetchKey}
                    disabled={keyState === 'fetching'}>
                    {keyState === 'fetching' ? 'Fetching...' : serverKey ? 'Refetch key' : 'Fetch key'}
                  </button>
                  <span className="api-console__enc-status">
                    {keyState === 'ready' && serverKey
                      ? `Ready, ${serverKey.padding === 'oaep-sha1' ? 'OAEP SHA-1' : 'PKCS#1 v1.5'}`
                      : keyState === 'error'
                        ? keyError
                        : 'Needs a token; run the gateway session first.'}
                  </span>
                </div>
              ) : (
                <>
                  <textarea
                    className="api-console__input api-console__textarea"
                    rows={4}
                    spellCheck={false}
                    value={pastedKey}
                    placeholder="PEM or base64 DER public key"
                    onChange={(event) => setPastedKey(event.target.value)}
                  />
                  <div className="api-console__enc-source" role="radiogroup" aria-label="Padding">
                    <label>
                      <input
                        type="radio"
                        name={`pad-${operation.id}`}
                        checked={pastePadding === 'oaep-sha1'}
                        onChange={() => setPastePadding('oaep-sha1')}
                      />
                      OAEP SHA-1 (V3)
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`pad-${operation.id}`}
                        checked={pastePadding === 'pkcs1v15'}
                        onChange={() => setPastePadding('pkcs1v15')}
                      />
                      PKCS#1 v1.5 (older families)
                    </label>
                  </div>
                </>
              )}

              <label className="api-console__enc-typed">
                <input
                  type="checkbox"
                  checked={sendAsTyped}
                  onChange={(event) => setSendAsTyped(event.target.checked)}
                />
                My values are already encrypted, send as typed
              </label>
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
                    placeholder={
                      bodyUnknown
                        ? bodyHint
                        : operation.requestExample === undefined
                          ? undefined
                          : JSON.stringify(operation.requestExample, null, 2)
                    }
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

          <Note
            id={`try-${operation.id}-privacy-note`}
            short="Sent straight from this browser, with no proxy in between."
            full="The request goes straight from this browser to the server you picked. Nothing you type here is stored, apart from the access token, which is held for this browser session only."
          />
        </div>

        <div className="api-console__col api-console__col--right">
          <div className="api-panel api-console__panel">
            <div className="api-panel__head">
              <span className="api-panel__label">Request</span>
              <span className="api-panel__lang">cURL</span>
              <CopyButton value={curl} />
              {/* The assistant cannot be used on top of this modal console,
                  so asking closes the console first. Tokens are taken out:
                  the assistant needs the shape of the call, not the keys. */}
              <DialogClose asChild>
                <AskAiButton
                  label="Ask AI about this request"
                  title={`Request as typed: ${operation.title || operation.summary}`}
                  markdown={() =>
                    `**Endpoint:** \`${operation.method} ${operation.path}\`\n\n${fenced('bash', redact(curl))}`
                  }
                />
              </DialogClose>
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
              <button
                type="button"
                className="api-console__expand"
                aria-pressed={expanded}
                onClick={() => setExpanded((current) => !current)}>
                {expanded ? 'Collapse' : 'Expand'}
              </button>
              {copyable ? <CopyButton value={copyable} /> : null}
              {copyable || result.state === 'failed' ? (
                <DialogClose asChild>
                  <AskAiButton
                    label="Ask AI about this response"
                    title={
                      tab === 'live'
                        ? `Live response: ${operation.title || operation.summary}`
                        : `${tab} example: ${operation.title || operation.summary}`
                    }
                    markdown={() => {
                      const endpoint = `**Endpoint:** \`${operation.method} ${operation.path}\``;
                      if (tab === 'live' && result.state === 'failed') {
                        return `${endpoint}\n\n**The request did not complete:** ${redact(result.message)}`;
                      }
                      const status =
                        tab === 'live' && result.state === 'done'
                          ? `**Live response:** ${result.status} ${result.statusText}, in ${result.ms} ms`
                          : `**Documented response:** ${tab}${documented?.description ? `, ${documented.description}` : ''}`;
                      return `${endpoint}\n\n${status}\n\n${fenced('json', redact(copyable))}`;
                    }}
                  />
                </DialogClose>
              ) : null}
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
                      {result.status === 403 && !result.body.trim() ? (
                        // NHA's edge answers a 403 with no body when the browser's
                        // origin is not on its allowlist. A role problem comes back
                        // as JSON, so an empty 403 is this and not that.
                        <p className="api-console__meaning">
                          The ABDM sandbox only accepts browser requests from origins NHA
                          has allowlisted, and this site is not one yet: it answered 403
                          with no body before the request reached the API. The request
                          itself is fine. Copy the cURL above and run it from a terminal,
                          or run this portal locally on localhost:3000, which the sandbox
                          allows.
                        </p>
                      ) : matched ? (
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
