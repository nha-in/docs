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

export type Field = {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  enum?: (string | number)[];
  format?: string;
  example?: unknown;
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
  security: {name: string; type: string; scheme?: string; description: string}[];
  headers: Field[];
  pathParams: Field[];
  queryParams: Field[];
  body: Field[];
  requestExample?: unknown;
  responses: {status: string; description: string; example?: unknown}[];
  curl: string;
  tag: string;
  tagDescription: string;
};

function FieldRow({field}: {field: Field}) {
  return (
    <div className="api-field">
      <div className="api-field__head">
        <code className="api-field__name">{field.name}</code>
        <span className="api-field__type">{field.type}</span>
        {field.required ? (
          <span className="api-field__required">required</span>
        ) : null}
      </div>
      {field.description ? (
        <p className="api-field__description">{field.description}</p>
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
        {lede ? <p className="api-page__lede">{lede}</p> : null}

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

        {rest ? <p className="api-page__body">{rest}</p> : null}

        {operation.security.length ? (
          <Section title="Authorizations">
            {operation.security.map((scheme) => (
              <FieldRow
                key={scheme.name}
                field={{
                  name: 'Authorization',
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
                  <p className="api-field__description">{response.description}</p>
                ) : null}
              </div>
            ))}
          </Section>
        ) : null}
      </div>

      <aside className="api-page__aside">
        <div className="api-panel">
          <div className="api-panel__head">
            <span className="api-panel__label">{operation.summary}</span>
            <span className="api-panel__lang">cURL</span>
            <CopyButton value={operation.curl} />
          </div>
          <CodeBlock language="bash">{operation.curl}</CodeBlock>
        </div>
        <ResponsePanel responses={operation.responses} />
      </aside>
    </div>
  );
}
