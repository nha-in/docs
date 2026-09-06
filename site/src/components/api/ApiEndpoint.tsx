import React, {useState} from 'react';
import CodeBlock from '@theme/CodeBlock';
import Heading from '@theme/Heading';
import {Check, Copy, Play} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@site/src/components/ui/dialog';
import TryIt from './TryIt';
import Markdown from './Markdown';

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
  description: string;
  security: {
    name: string;
    type: string;
    scheme?: string;
    in?: string;
    headerName?: string;
    description: string;
  }[];
  headers: Field[];
  pathParams: Field[];
  queryParams: Field[];
  body: Field[];
  requestExample?: unknown;
  responses: {
    status: string;
    description: string;
    example?: unknown;
    /** Where to read about this failure, when a page for it exists. */
    help?: {label: string; href: string};
  }[];
  curl: string;
  /** The same request in each language the page offers. */
  samples?: {id: string; label: string; language: string; code: string}[];
  /** The certification marking on this call, where a certification case names
      it. Absent on every call no case names, which is not the same as
      optional. Set by the reference generator from `x-abdm-requirement`. */
  requirement?: {
    level: string;
    cases: string[];
    conditions: string[];
    /** The module's testing page, where the cases below are written out. */
    href?: string;
  };
  tag: string;
  tagDescription: string;
};

/* The level alone tells a reader almost nothing: "Conditional" without the
   condition is a badge they cannot act on, and a level without its cases is a
   claim they cannot check. Both travel with it. */
function Requirement({
  requirement,
}: {
  requirement: NonNullable<Operation['requirement']>;
}) {
  const {level, cases, conditions, href} = requirement;
  const label = `Certification ${cases.length === 1 ? 'case' : 'cases'}`;
  return (
    <div className="api-requirement">
      <div className="api-requirement__head">
        <span
          className={`api-requirement__level api-requirement__level--${level}`}>
          {level.replace(/^./, (c) => c.toUpperCase())}
        </span>
        {conditions.length ? (
          <span className="api-requirement__note">{conditions.join('. ')}</span>
        ) : null}
      </div>
      {cases.length ? (
        <p className="api-requirement__cases">
          {href ? <a href={href}>{label}</a> : label}{' '}
          {cases.map((id, index) => (
            <React.Fragment key={id}>
              {index > 0 ? ', ' : null}
              <code>{id}</code>
            </React.Fragment>
          ))}
        </p>
      ) : null}
    </div>
  );
}

function FieldRow({field}: {field: Field}) {
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
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="api-section">
      <Heading as="h2" className="api-section__title">
        {title}
      </Heading>
      {children}
    </section>
  );
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
 * The request, in the language the reader works in.
 *
 * An older build carried only `curl`, so a page rendered from a stale JSON
 * still gets its one tab rather than an empty panel.
 */
function RequestPanel({operation}: {operation: Operation}) {
  const samples =
    operation.samples?.length
      ? operation.samples
      : [{id: 'curl', label: 'cURL', language: 'bash', code: operation.curl}];
  const [active, setActive] = useState(samples[0].id);
  const current = samples.find((sample) => sample.id === active) ?? samples[0];

  return (
    <div className="api-panel">
      <div className="api-panel__head">
        <span className="api-panel__label">{operation.summary}</span>
        <div className="api-panel__tabs" role="tablist" aria-label="Request">
          {samples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              role="tab"
              aria-selected={sample.id === current.id}
              className={
                sample.id === current.id
                  ? 'api-panel__tab api-panel__tab--active'
                  : 'api-panel__tab'
              }
              onClick={() => setActive(sample.id)}>
              {sample.label}
            </button>
          ))}
        </div>
        <CopyButton value={current.code} />
      </div>
      <CodeBlock language={current.language}>{current.code}</CodeBlock>
    </div>
  );
}

function ResponsePanel({responses}: {responses: Operation['responses']}) {
  const [active, setActive] = useState(0);
  const current = responses[active];
  if (!current) {
    return null;
  }
  return (
    <div className="api-panel">
      <div className="api-panel__head">
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
              onClick={() => setActive(index)}>
              {response.status}
            </button>
          ))}
        </div>
        {current.example !== undefined ? (
          <CopyButton value={JSON.stringify(current.example, null, 2)} />
        ) : null}
      </div>
      {current.example !== undefined ? (
        <CodeBlock language="json">
          {JSON.stringify(current.example, null, 2)}
        </CodeBlock>
      ) : (
        <p className="api-panel__empty">{current.description}</p>
      )}
    </div>
  );
}

export default function ApiEndpoint({operation}: {operation: Operation}) {
  const lede = operation.description.split('\n\n')[0];
  const rest = operation.description.split('\n\n').slice(1).join('\n\n');

  return (
    <div className="api-page">
      <div className="api-page__main">
        <p className="api-page__eyebrow">{operation.tag.replace(/-/g, ' ')}</p>
        <Heading as="h1" className="api-page__title">
          {operation.summary}
        </Heading>
        {lede ? <Markdown text={lede} className="api-page__lede" /> : null}

        {operation.requirement ? (
          <Requirement requirement={operation.requirement} />
        ) : null}

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
                className="api-console block max-w-none gap-0 p-0 sm:max-w-none">
                <TryIt operation={operation} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {rest ? <Markdown text={rest} className="api-page__body" /> : null}

        {operation.security.length ? (
          <Section title="Authorizations">
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
                }}
              />
            ))}
          </Section>
        ) : null}

        {operation.pathParams.length ? (
          <Section title="Path parameters">
            {operation.pathParams.map((field) => (
              <FieldRow key={field.name} field={field} />
            ))}
          </Section>
        ) : null}

        {operation.queryParams.length ? (
          <Section title="Query parameters">
            {operation.queryParams.map((field) => (
              <FieldRow key={field.name} field={field} />
            ))}
          </Section>
        ) : null}

        {operation.headers.length ? (
          <Section title="Headers">
            {operation.headers.map((field) => (
              <FieldRow key={field.name} field={field} />
            ))}
          </Section>
        ) : null}

        {operation.body.length ? (
          <Section title="Body">
            {operation.body.map((field) => (
              <FieldRow key={field.name} field={field} />
            ))}
          </Section>
        ) : null}

        {operation.responses.length ? (
          <Section title="Responses">
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
              </div>
            ))}
          </Section>
        ) : null}
      </div>

      <aside className="api-page__aside">
        <RequestPanel operation={operation} />
        <ResponsePanel responses={operation.responses} />
      </aside>
    </div>
  );
}
