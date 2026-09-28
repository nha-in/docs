import React, {useEffect, useState} from 'react';
import CodeBlock from '@theme/CodeBlock';
import {Check, CircleAlert, RefreshCw} from 'lucide-react';
import {Button} from '@site/src/components/ui/button';
import {StepCard, Stepper, type StepDef} from './QuickstartStepper';
import {
  curlCommand,
  localDate,
  pastedTransactionId,
  searchBody,
  whatIsWrong,
} from './uhi-quickstart-values';

/**
 * The UHI quickstart: a PM-JAY HEM GPS search, built here and sent by you.
 *
 * It makes no network call, and cannot. A UHI request is signed with the
 * integrator's own Ed25519 private key, which a web page must never ask for,
 * and the answer arrives later on the integrator's own consumer_uri, never in
 * this browser. So the page builds the exact body, takes the two header
 * values the Header Generation Utility returns for it, and hands back the curl.
 *
 * Nothing touches window or crypto at render: the UUID and the clock are read
 * in an effect, so the server render and the first client render agree.
 */

type Step = 'callback' | 'build' | 'sign' | 'send' | 'read';

const STEPS: StepDef<Step>[] = [
  {key: 'callback', n: 1, title: 'Stand up your callback'},
  {key: 'build', n: 2, title: 'Build the search'},
  {key: 'sign', n: 3, title: 'Sign it'},
  {key: 'send', n: 4, title: 'Send it'},
  {key: 'read', n: 5, title: 'Read the callback'},
];

const UTILITY = 'https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility';

const ACK = '{ "message": { "ack": { "status": "ACK" } }, "error": {} }';

const SAMPLE_PROVIDER = `{
  "id": "HOSP27G13867",
  "descriptor": { "name": "General Hospital Wardha", "code": "G" },
  "categories": [ { "descriptor": { "name": "Cardiology", "code": 100002 } } ],
  "fulfillments": [
    { "type": "Establishment Date", "start": { "time": { "timestamp": "1915" } } },
    { "type": "Empaneled Date", "start": { "time": { "timestamp": "2018-09-14 16:03:16.0" } } }
  ],
  "location": { "gps": "15.497097,80.048688", "district": { "name": "PRAKASAM" } },
  "contact": { "phone": "<MOBILE_NUMBER>", "tags": { "nodalOfficerNumber": "<MOBILE_NUMBER>" } }
}`;

const SYMPTOMS: [string, string][] = [
  ['401 on step 4', 'Header signed over a different body, a reused or expired signature, or the wrong keyId'],
  ['403 on step 4', 'Public key not registered, or registration not yet active'],
  ['ACK but no callback', 'consumer_uri not publicly reachable over HTTPS, or your endpoint did not return 200'],
  ['Callback arrives but is not matched', 'Your code looked up the wrong transaction_id'],
  ['Empty providers[]', 'No empanelled hospital inside the radius. Widen the radius in step 2'],
];

type Progress = {kind: 'idle' | 'ok' | 'error'; text: string};

function newUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // RFC 4122 version 4 from getRandomValues, for a browser without randomUUID.
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function Field({
  label,
  hint,
  value,
  onValue,
  placeholder,
  inputMode,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  value: string;
  onValue: (value: string) => void;
  placeholder?: string;
  inputMode?: 'decimal' | 'url';
}) {
  return (
    <label className="quickstart__field">
      <span className="quickstart__label">{label}</span>
      <input
        className="quickstart__input"
        type="text"
        inputMode={inputMode}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onValue(event.target.value)}
      />
      {hint ? <span className="quickstart__hint">{hint}</span> : null}
    </label>
  );
}

export default function UhiQuickstart() {
  const [active, setActive] = useState<Step>('callback');
  const [callbackReady, setCallbackReady] = useState(false);
  const [subscriberId, setSubscriberId] = useState('');
  const [consumerUri, setConsumerUri] = useState('');
  const [latitude, setLatitude] = useState('17.3787973');
  const [longitude, setLongitude] = useState('78.4368433');
  const [radiusKm, setRadiusKm] = useState('13.0');
  const [uuid, setUuid] = useState('');
  const [now, setNow] = useState<Date | null>(null);
  const [authorization, setAuthorization] = useState('');
  const [digest, setDigest] = useState('');
  const [sent, setSent] = useState(false);
  const [pasted, setPasted] = useState('');
  const [status, setStatus] = useState<Progress>({kind: 'idle', text: ''});

  function refresh() {
    setUuid(newUuid());
    setNow(new Date());
  }

  // Client only, after the first render, so nothing here differs from the
  // server render.
  useEffect(refresh, []);

  const inputs = {subscriberId, consumerUri, latitude, longitude, radiusKm};
  const problem = whatIsWrong(inputs);
  const body =
    !problem && uuid && now
      ? searchBody({...inputs, uuid, timestamp: now.toISOString(), today: localDate(now)})
      : '';
  const curl = curlCommand(body || '<THE_BODY_FROM_STEP_2>', authorization, digest);
  const signed = Boolean(authorization.trim());

  const received = pastedTransactionId(pasted);
  const matches = Boolean(received) && received === uuid;

  const done: Record<Step, boolean> = {
    callback: callbackReady,
    build: Boolean(body),
    sign: Boolean(body) && signed,
    send: sent,
    read: matches,
  };

  const callbackUrl = consumerUri.trim()
    ? `${consumerUri.trim().replace(/\/+$/, '')}/on_search`
    : '<your consumer_uri>/on_search';

  function newSearch() {
    // A new body invalidates the signature over the old one.
    refresh();
    setAuthorization('');
    setDigest('');
    setSent(false);
    setPasted('');
    setStatus({kind: 'idle', text: 'New message_id, transaction_id and timestamp. Sign the new body in step 3.'});
  }

  return (
    <div className="quickstart quickstart--fit">
      <div className="quickstart__status-row" role="status" aria-live="polite">
        {status.text ? (
          <p className={`quickstart__status quickstart__status--${status.kind}`}>
            <span className="quickstart__status-dot" aria-hidden="true" />
            <span>{status.text}</span>
          </p>
        ) : null}
      </div>

      <div className="quickstart__card">
        <Stepper
          steps={STEPS}
          label="The five steps of a first UHI search"
          active={active}
          done={done}
          onSelect={setActive}
        />

        <div className="quickstart__panes">
          <StepCard
            step="callback"
            active={active}
            title="Stand up your callback"
            lede="The hospitals never come back on your request. They arrive later as a POST to your callback, which must answer at once.">
            <div className="quickstart__panel">
              <p className="quickstart__panel-label">Expose this endpoint</p>
              <CodeBlock language="http">{`POST ${callbackUrl}`}</CodeBlock>
            </div>
            <div className="quickstart__panel">
              <p className="quickstart__panel-label">Reply 200 with this body, then store the request</p>
              <CodeBlock language="json">{ACK}</CodeBlock>
            </div>
            <div className="quickstart__form">
              <Button
                type="button"
                variant={callbackReady ? 'outline' : 'default'}
                onClick={() => {
                  setCallbackReady(true);
                  setActive('build');
                  setStatus({kind: 'ok', text: 'Step 1 done. Your callback answers with the ACK.'});
                }}>
                My callback is ready
              </Button>
            </div>
          </StepCard>

          <StepCard
            step="build"
            active={active}
            title="Build the search"
            lede="Your IDs and a location go in. Out comes the exact body to sign and send, with a fresh UUID and today's time window.">
            <div className="quickstart__form">
              <div className="quickstart__fields">
                <Field
                  label="Subscriber ID"
                  hint="From your sandbox registration. Sent as consumer_id."
                  value={subscriberId}
                  onValue={setSubscriberId}
                />
                <Field
                  label="consumer_uri"
                  hint="Your public HTTPS callback base URL."
                  placeholder="https://"
                  inputMode="url"
                  value={consumerUri}
                  onValue={setConsumerUri}
                />
              </div>
              <div className="quickstart__fields">
                <Field label="Latitude" inputMode="decimal" value={latitude} onValue={setLatitude} />
                <Field label="Longitude" inputMode="decimal" value={longitude} onValue={setLongitude} />
                <Field
                  label="Radius, km"
                  inputMode="decimal"
                  value={radiusKm}
                  onValue={setRadiusKm}
                />
              </div>
            </div>
            {body ? (
              <>
                <div className="quickstart__panel">
                  <p className="quickstart__panel-label">Exact body to sign and send, one line</p>
                  <CodeBlock language="json">{body}</CodeBlock>
                </div>
                <div className="quickstart__go">
                  <Button type="button" variant="outline" onClick={newSearch}>
                    <RefreshCw className="size-4" aria-hidden="true" />
                    New UUID and timestamp
                  </Button>
                  <Button type="button" onClick={() => setActive('sign')}>
                    Continue
                  </Button>
                </div>
                <p className="quickstart__hint">
                  message_id and transaction_id carry the same UUID, {uuid}. Keep it: the callback
                  in step 5 carries it back.
                </p>
              </>
            ) : (
              <p className="quickstart__held">{problem || 'Generating a UUID.'}</p>
            )}
          </StepCard>

          <StepCard
            step="sign"
            active={active}
            title="Sign it"
            lede={
              <>
                Run the{' '}
                <a href={UTILITY} target="_blank" rel="noreferrer">
                  Header Generation Utility
                </a>{' '}
                on your own machine, with your subscriber ID, your public key ID and the exact body
                from step 2. Paste the two values it returns.
              </>
            }>
            <p className="quickstart__held">
              Your private key stays with the utility. This page never asks for it.
            </p>
            <div className="quickstart__form">
              <div className="quickstart__fields">
                <Field
                  label="Authorization"
                  hint="The signature header value. A signature expires, so sign again for every send."
                  value={authorization}
                  onValue={setAuthorization}
                />
                <Field
                  label="Digest"
                  hint="The BLAKE-512 hash of the body, with or without the BLAKE-512= prefix."
                  value={digest}
                  onValue={setDigest}
                />
              </div>
              <div className="quickstart__go">
                <Button type="button" disabled={!body || !signed} onClick={() => setActive('send')}>
                  Continue
                </Button>
                {!body ? (
                  <span className="quickstart__hint">Build the search in step 2 first.</span>
                ) : !signed ? (
                  <span className="quickstart__hint">Paste the Authorization value.</span>
                ) : null}
              </div>
            </div>
          </StepCard>

          <StepCard
            step="send"
            active={active}
            title="Send it"
            lede="Run this from a terminal. The body is inline, byte for byte as you signed it, because reformatting it breaks the digest.">
            <div className="quickstart__panel">
              <p className="quickstart__panel-label">To the sandbox UHI Gateway</p>
              <CodeBlock language="bash">{curl}</CodeBlock>
            </div>
            <p className="quickstart__held">
              You receive 200 with <code>"ack": {'{'} "status": "ACK" {'}'}</code> straight away. That
              is only a receipt.
            </p>
            <div className="quickstart__form">
              <Button
                type="button"
                variant={sent ? 'outline' : 'default'}
                disabled={!body || !signed}
                onClick={() => {
                  setSent(true);
                  setActive('read');
                  setStatus({kind: 'ok', text: 'Step 4 done. Watch your callback for on_search.'});
                }}>
                I received the ACK
              </Button>
            </div>
          </StepCard>

          <StepCard
            step="read"
            active={active}
            title="Read the callback"
            lede="Within seconds the UHI Gateway posts on_search to your endpoint. Check its transaction_id, then read message.catalog.providers[].">
            <div className="quickstart__form">
              <div className="quickstart__fields">
                <Field
                  label="The on_search body your endpoint stored, or its transaction_id"
                  value={pasted}
                  onValue={setPasted}
                />
              </div>
              {pasted.trim() ? (
                matches ? (
                  <p className="quickstart__created-head">
                    <Check className="size-4" aria-hidden="true" />
                    transaction_id matches your search.
                  </p>
                ) : (
                  <p className="quickstart__held">
                    <CircleAlert className="size-4" aria-hidden="true" />{' '}
                    {received
                      ? `That is ${received}. Your search sent ${uuid || 'no id yet'}.`
                      : 'No context.transaction_id in what you pasted.'}
                  </p>
                )
              ) : null}
            </div>
            <div className="quickstart__panel">
              <p className="quickstart__panel-label">
                One provider record. The values are illustrative, and sandbox data differs
              </p>
              <CodeBlock language="json">{SAMPLE_PROVIDER}</CodeBlock>
            </div>
            <div className="quickstart__panel">
              <p className="quickstart__panel-label">If it does not work</p>
              <table>
                <thead>
                  <tr>
                    <th>Symptom</th>
                    <th>Likely cause</th>
                  </tr>
                </thead>
                <tbody>
                  {SYMPTOMS.map(([symptom, cause]) => (
                    <tr key={symptom}>
                      <td>{symptom}</td>
                      <td>{cause}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </StepCard>
        </div>
      </div>
    </div>
  );
}
