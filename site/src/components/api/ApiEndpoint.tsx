import React, {useEffect, useState} from 'react';
import CodeBlock from '@theme/CodeBlock';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import {
  Check,
  ChevronDown,
  CodeXml,
  Copy,
  PanelRightClose,
  Play,
  Sparkles,
} from 'lucide-react';
import {Tabs} from 'radix-ui';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@site/src/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@site/src/components/ui/dialog';
import TryIt from './TryIt';
import Markdown from './Markdown';
import {splitLede, isRestatement} from './lede';
import {sections} from './sections';

export type Field = {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  enum?: (string | number)[];
  format?: string;
  example?: unknown;
  /** True for identifiers ABDM takes RSA encrypted: the console encrypts the
      raw value in the browser before sending. Set by the reference generator. */
  encrypted?: boolean;
  /** The only value the schema allows: a one value enum, or an array that must
      carry exactly its listed values. Try it fills it in and locks it. */
  fixed?: string | number | (string | number)[];
};

export type Operation = {
  id: string;
  module: string;
  moduleId: string;
  kind: 'operation' | 'callback';
  method: string;
  path: string;
  server: string;
  servers: {url: string; description: string}[];
  summary: string;
  // The short name build-api-reference.mjs derives from the summary or the
  // path. `summary` stays NHA's sentence, which is documentation, not a name.
  title: string;
  description: string;
  security: {
    name: string;
    type: string;
    scheme?: string;
    in?: string;
    headerName?: string;
    description: string;
    /** The header's value as the specification writes it, e.g. "Bearer <access token>". */
    example?: string;
    /** What Try it puts in front of the held token for this scheme. */
    prefix?: string;
  }[];
  headers: Field[];
  /** NHCX: the fields of the JWE protected header of `payload`. Never HTTP
      headers, so never in the samples or sent by Try it. */
  protectedHeader?: Field[];
  /** The gateway the page belongs to: hiecm, nhcx. */
  gateway?: string;
  pathParams: Field[];
  queryParams: Field[];
  body: Field[];
  requestExample?: unknown;
  responses: {
    status: string;
    description: string;
    example?: unknown;
    /** True when `example` was built from the schema, not written in the spec. */
    synthesised?: boolean;
    /** The response body's fields, from its schema. */
    fields?: Field[];
    /** Where to read about this failure, when a page for it exists. */
    help?: {label: string; href: string};
  }[];
  curl: string;
  /** The same request in each language the page offers. */
  samples?: {id: string; label: string; language: string; code: string}[];
  tag?: string;
  tagDescription?: string;
};

function FieldRow({field, showExample}: {field: Field; showExample?: boolean}) {
  return (
    <div className="api-field">
      <div className="api-field__head">
        <code className="api-field__name">{field.name}</code>
        <span className="api-field__type">{field.type}</span>
        {field.required ? (
          <span className="api-field__required">Required</span>
        ) : null}
      </div>
      {field.description ? (
        <Markdown text={field.description} className="api-field__description" />
      ) : null}
      {field.enum?.length ? (
        <p className="api-field__enum">
          One of {field.enum.map((value) => (
            <code key={String(value)}>{String(value)}</code>
          ))}
        </p>
      ) : null}
      {showExample && field.example !== undefined && field.example !== '' ? (
        <p className="api-field__enum">
          Example <code>{String(field.example)}</code>
        </p>
      ) : null}
    </div>
  );
}

/** A titled part of a tab. Untitled where the tab's own name already says it. */
function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="api-section">
      {title ? (
        <Heading as="h2" className="api-section__title">
          {title}
        </Heading>
      ) : null}
      {children}
    </section>
  );
}

/**
 * The open tab, kept in the URL hash so a link can land on it: `#body` opens
 * Body. A hash naming something inside a panel opens that panel, so the
 * element is visible to scroll to. Selecting a tab replaces the hash rather
 * than pushing it, because a tab is a view of this page, not a step in the
 * reader's history.
 */
function useTab(ids: string[]): [string, (id: string) => void] {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(' ');

  useEffect(() => {
    const fromHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash) return;
      if (ids.includes(hash)) {
        setActive(hash);
        document.querySelector('.api-tabs')?.scrollIntoView({block: 'start'});
        return;
      }
      const target = document.getElementById(hash);
      const panel = target?.closest<HTMLElement>('[data-api-tab]')?.dataset.apiTab;
      if (panel && ids.includes(panel)) {
        setActive(panel);
        requestAnimationFrame(() => target?.scrollIntoView());
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
    // `key` stands in for `ids`, which is a new array on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const select = (id: string) => {
    setActive(id);
    window.history.replaceState(window.history.state, '', `#${id}`);
  };
  return [ids.includes(active) ? active : ids[0], select];
}

export function CopyButton({value}: {value: string}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="api-copy"
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      onClick={() => {
        navigator.clipboard?.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }}>
      {copied ? (
        <Check className="size-3.5" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
    </button>
  );
}

/**
 * Opens Ask AI with one panel attached, so the reader can ask about this
 * request or this response rather than the whole page. chrome/AskAiBridge.tsx
 * hands `snippet` to the assistant. Exported for Try it's own panels.
 */
export function AskAiButton({
  label,
  title,
  markdown,
  onClick,
  ...rest
}: {
  label: string;
  title: string;
  /** Read when pressed, so it is the panel as it is then. */
  markdown: () => string;
} & Omit<React.ComponentProps<'button'>, 'title'>) {
  return (
    <button
      type="button"
      className="api-copy"
      aria-label={label}
      title={label}
      {...rest}
      onClick={(event) => {
        window.dispatchEvent(
          new CustomEvent('abdm:ask-ai', {
            detail: {snippet: {title, markdown: markdown()}},
          }),
        );
        // Try it passes its close handler through here (DialogClose asChild).
        onClick?.(event);
      }}>
      <Sparkles className="size-3.5" aria-hidden="true" />
    </button>
  );
}

/** A fenced block, with a fence longer than any backtick run inside it. */
export function fenced(language: string, code: string): string {
  const longest = Math.max(2, ...(code.match(/`+/g) ?? []).map((run) => run.length));
  const fence = '`'.repeat(longest + 1);
  return `${fence}${language}\n${code}\n${fence}`;
}

/**
 * The request, in the language the reader works in.
 *
 * An older build carried only `curl`, so a page rendered from a stale JSON
 * still gets its one tab rather than an empty panel.
 */
// Said once, beside the request, on every NHCX page (NHA review, #40).
const PLACEHOLDER_NOTE =
  'Participant codes, ABHA numbers, tokens and payloads in these examples are placeholders, never real credentials or patient data.';

const PANELS_KEY = 'abdm:api-panels';

/**
 * Whether a side panel is open, remembered in this browser across pages.
 * `initial` until the reader chooses, and whenever storage is blocked or
 * holds something unreadable. The panels start open; the examples column
 * starts folded, with its button a click away.
 */
function usePanelOpen(
  name: string,
  initial = true,
): [boolean, (open: boolean) => void] {
  const [open, setOpen] = useState(initial);
  const read = () => JSON.parse(window.localStorage.getItem(PANELS_KEY) ?? '{}');

  useEffect(() => {
    try {
      const saved = read()?.[name];
      if (typeof saved === 'boolean') setOpen(saved);
    } catch {
      // Keeps `initial`.
    }
  }, [name]);

  const change = (next: boolean) => {
    setOpen(next);
    try {
      window.localStorage.setItem(PANELS_KEY, JSON.stringify({...read(), [name]: next}));
    } catch {
      // Toggled for this page, not remembered.
    }
  };
  return [open, change];
}

/** A request or response panel beside the reference, which the reader can fold away. */
function SidePanel({
  open,
  setOpen,
  label,
  tools,
  children,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
  tools: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="api-panel">
      <div className="api-panel__head">
        <CollapsibleTrigger className="api-panel__toggle">
          <ChevronDown className="api-panel__chevron size-3.5" aria-hidden="true" />
          {label}
        </CollapsibleTrigger>
        {tools}
      </div>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}

function RequestPanel({operation}: {operation: Operation}) {
  const samples =
    operation.samples?.length
      ? operation.samples
      : [{id: 'curl', label: 'cURL', language: 'bash', code: operation.curl}];
  const [active, setActive] = useState(samples[0].id);
  const current = samples.find((sample) => sample.id === active) ?? samples[0];
  const [open, setOpen] = usePanelOpen('request');

  return (
    <SidePanel
      open={open}
      setOpen={setOpen}
      label="Request"
      tools={
        <>
          {/* Eight languages do not fit as tabs in a side panel, so they
              are a list. Picking one opens a folded panel to show it. */}
          <select
            className="api-panel__lang"
            value={current.id}
            onChange={(event) => {
              setActive(event.target.value);
              setOpen(true);
            }}
            aria-label="Language">
            {samples.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.label}
              </option>
            ))}
          </select>
          <CopyButton value={current.code} />
          <AskAiButton
            label="Ask AI about this request"
            title={`${current.label} request: ${operation.title || operation.summary}`}
            markdown={() =>
              `**Endpoint:** \`${operation.method} ${operation.path}\`\n\n${fenced(current.language, current.code)}`
            }
          />
        </>
      }>
      <CodeBlock language={current.language}>{current.code}</CodeBlock>
      {operation.gateway === 'nhcx' ? (
        <p className="api-panel__note">{PLACEHOLDER_NOTE}</p>
      ) : null}
    </SidePanel>
  );
}

function ResponsePanel({operation}: {operation: Operation}) {
  const {responses} = operation;
  const [active, setActive] = useState(0);
  const [open, setOpen] = usePanelOpen('response');
  const current = responses[active];
  if (!current) {
    return null;
  }
  return (
    <SidePanel
      open={open}
      setOpen={setOpen}
      label="Response"
      tools={
        <>
          <div className="api-panel__tabs" role="tablist" aria-label="Responses">
            {responses.map((response, index) => (
              <button
                key={response.status}
                type="button"
                role="tab"
                aria-selected={index === active}
                className={
                  index === active
                    ? 'api-panel__tab api-panel__tab--active'
                    : 'api-panel__tab'
                }
                onClick={() => {
                  setActive(index);
                  setOpen(true);
                }}>
                {response.status}
              </button>
            ))}
          </div>
          {current.example !== undefined ? (
            <CopyButton value={JSON.stringify(current.example, null, 2)} />
          ) : null}
          <AskAiButton
            label="Ask AI about this response"
            title={`${current.status} response: ${operation.title || operation.summary}`}
            markdown={() =>
              [
                `**Endpoint:** \`${operation.method} ${operation.path}\``,
                `**Response:** ${current.status}${current.description ? `, ${current.description}` : ''}`,
                current.example !== undefined
                  ? fenced('json', JSON.stringify(current.example, null, 2))
                  : '',
              ]
                .filter(Boolean)
                .join('\n\n')
            }
          />
        </>
      }>
      {current.example !== undefined ? (
        <>
          <CodeBlock language="json">
            {JSON.stringify(current.example, null, 2)}
          </CodeBlock>
          {/* Only an example built from the schema says so. One the
              specification wrote out is shown as it is, without a note that
              would call it a placeholder. */}
          {current.synthesised ? (
            <p className="api-panel__note">
              Generated from the response schema listed under Responses. The
              values are placeholders, not a captured response.
            </p>
          ) : null}
        </>
      ) : (
        <p className="api-panel__empty">{current.description}</p>
      )}
    </SidePanel>
  );
}

export default function ApiEndpoint({operation}: {operation: Operation}) {
  const heading = operation.title || operation.summary;
  const [opening, rest] = splitLede(operation.description);
  // A lede that only repeats the heading is noise between the title and the call.
  const lede = isRestatement(opening, heading) ? '' : opening;
  // Where NHA's description carries its own header and body tables, those
  // tables are the reference and the sections built from the schema stay
  // out, so nothing on the page is said twice. NHA's header table names the
  // Authorization header too, so it stands in for Authorizations as well.
  const text = operation.description ?? '';
  const nhaHeaders = /\*\*Headers\*\*/.test(text);
  const nhaBody = /\*\*Request body/i.test(text);
  // NHA's header and body tables go to their own tabs; the rest of the
  // description is the overview.
  const parts = sections(rest);

  const headerParts = [
    parts.headers ? (
      <Markdown key="nha" text={parts.headers} className="api-page__body" />
    ) : null,
    operation.security.length && !nhaHeaders ? (
      <Section key="auth" title="Authorizations">
        {operation.security.map((scheme) => (
          <FieldRow
            key={scheme.name}
            field={{
              // The header a scheme travels in is the scheme's own, not
              // always Authorization: an apiKey scheme names its header,
              // and labelling X-Token "Authorization" told the reader to
              // send the wrong one.
              name:
                scheme.type === 'apiKey' && scheme.headerName
                  ? scheme.headerName
                  : 'Authorization',
              type: scheme.scheme === 'bearer' ? 'bearer token' : scheme.type,
              required: true,
              description: scheme.description,
              example: scheme.example,
            }}
            showExample
          />
        ))}
      </Section>
    ) : null,
    operation.headers.length && !nhaHeaders ? (
      <Section key="headers" title="Headers">
        {operation.headers.map((field) => (
          <FieldRow key={field.name} field={field} />
        ))}
      </Section>
    ) : null,
    operation.protectedHeader?.length ? (
      <Section key="protected" title="Protected header">
        <p className="api-section__lede">
          These fields go in the JWE protected header of <code>payload</code>,
          not as HTTP headers.{' '}
          <Link to="/docs/nhcx/v1/getting-started/building-and-sending-a-jwe">
            Building and sending a JWE
          </Link>{' '}
          shows how to prepare and encrypt the payload, and{' '}
          <Link to="/docs/nhcx/v1/getting-started/receiving-a-callback">
            Receiving a callback
          </Link>{' '}
          how to decrypt one.
        </p>
        {operation.protectedHeader.map((field) => (
          <FieldRow key={field.name} field={field} showExample />
        ))}
      </Section>
    ) : null,
  ].filter(Boolean);

  const paramParts = [
    operation.pathParams.length ? (
      <Section key="path" title="Path parameters">
        {operation.pathParams.map((field) => (
          <FieldRow key={field.name} field={field} />
        ))}
      </Section>
    ) : null,
    operation.queryParams.length ? (
      <Section key="query" title="Query parameters">
        {operation.queryParams.map((field) => (
          <FieldRow key={field.name} field={field} />
        ))}
      </Section>
    ) : null,
  ].filter(Boolean);

  const bodyParts = [
    parts.body ? (
      <Markdown key="nha" text={parts.body} className="api-page__body" />
    ) : null,
    operation.body.length && !nhaBody ? (
      <Section key="schema">
        {operation.body.map((field) => (
          <FieldRow key={field.name} field={field} />
        ))}
      </Section>
    ) : null,
  ].filter(Boolean);

  const panels = [
    {
      id: 'overview',
      label: 'Overview',
      content: parts.overview ? (
        <Markdown text={parts.overview} className="api-page__body" />
      ) : null,
    },
    {id: 'headers', label: 'Headers', content: headerParts.length ? headerParts : null},
    {id: 'params', label: 'Params', content: paramParts.length ? paramParts : null},
    {id: 'body', label: 'Body', content: bodyParts.length ? bodyParts : null},
    {
      id: 'responses',
      label: 'Responses',
      content: operation.responses.length ? (
        <Section>
          {operation.responses.map((response) => (
            <div key={response.status} className="api-field">
              <div className="api-field__head">
                <code className="api-field__name">{response.status}</code>
              </div>
              {response.description ? (
                <Markdown
                  text={response.description}
                  className="api-field__description"
                />
              ) : null}
              {response.help ? (
                <p className="api-field__help">
                  <a href={response.help.href}>{response.help.label}</a>
                </p>
              ) : null}
              {response.fields?.length ? (
                <div className="api-response-fields">
                  {response.fields.map((field) => (
                    <FieldRow key={field.name} field={field} />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </Section>
      ) : null,
    },
  ].filter((panel) => panel.content);
  const [tab, setTab] = useTab(panels.map((panel) => panel.id));
  // The whole examples column, folded to a button the way the sidebar folds,
  // so the reference can take the width.
  const [examples, setExamples] = usePanelOpen('column', false);

  return (
    <div className={examples ? 'api-page' : 'api-page api-page--wide'}>
      <div className="api-page__main">
        {operation.tag ? (
          <p className="api-page__eyebrow">{operation.tag.replace(/-/g, ' ')}</p>
        ) : null}
        <Heading as="h1" className="api-page__title">
          {heading}
        </Heading>
        {lede ? <Markdown text={lede} className="api-page__lede" /> : null}

        <div className="api-bar">
          <span
            className={`api-chip api-chip--${operation.method.toLowerCase()}`}>
            {operation.method}
          </span>
          <code className="api-bar__path">{operation.path}</code>
          {/* A callback is an endpoint the integrator implements and NHA calls
              into, not one this site can call. A Try it console would be
              inviting the reader to send a request nobody is listening for. */}
          {operation.kind === 'callback' ? null : (
            <Dialog>
              <DialogTrigger className="api-try-trigger">
                <Play className="size-3.5" aria-hidden="true" />
                Try it
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="api-console block max-w-none gap-0 p-0 sm:max-w-none"
                // Ask AI in the console closes it and opens the assistant.
                // Handing focus back to the Try it button would pull it out
                // of the assistant the reader just opened.
                onCloseAutoFocus={(event) => {
                  if (document.querySelector('abdm-support-agent')?.hasAttribute('open')) {
                    event.preventDefault();
                  }
                }}>
                <TryIt operation={operation} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {panels.length ? (
          <Tabs.Root className="api-tabs" value={tab} onValueChange={setTab}>
            <Tabs.List className="api-tabs__list" aria-label="Reference">
              {panels.map((panel) => (
                <Tabs.Trigger
                  key={panel.id}
                  value={panel.id}
                  className="api-tabs__trigger">
                  {panel.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            {/* Every panel stays in the page and CSS hides the inactive ones,
                so local search, Copy for LLM and the page's .md still carry
                the whole reference. Radix sets no `hidden` on a force
                mounted panel, which is what keeps it out of the way here. */}
            {panels.map((panel) => (
              <Tabs.Content
                key={panel.id}
                value={panel.id}
                forceMount
                data-api-tab={panel.id}
                className="api-tabs__panel">
                {panel.content}
              </Tabs.Content>
            ))}
          </Tabs.Root>
        ) : null}
      </div>

      <aside className="api-page__aside" aria-label="Examples">
        {/* The column is named Examples: the request in each language and
            the response for each status. Folded, it is one button with that
            name; open, the name heads it and the fold control sits beside. */}
        {examples ? (
          <div className="api-aside__head">
            <span className="api-aside__title">
              <CodeXml className="size-4" aria-hidden="true" />
              Examples
            </span>
            <button
              type="button"
              className="sidebar-fold"
              aria-expanded
              aria-label="Hide examples"
              title="Hide examples"
              onClick={() => setExamples(false)}>
              <PanelRightClose className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="api-aside__open"
            aria-expanded={false}
            onClick={() => setExamples(true)}>
            <CodeXml className="size-4" aria-hidden="true" />
            Examples
          </button>
        )}
        <RequestPanel operation={operation} />
        <ResponsePanel operation={operation} />
      </aside>
    </div>
  );
}
