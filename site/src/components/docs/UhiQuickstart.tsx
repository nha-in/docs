import React, {useEffect, useState} from 'react';
import CodeBlock from '@theme/CodeBlock';
import Details from '@theme/Details';
import {Button} from '@site/src/components/ui/button';
import {StepCard, Stepper, type StepDef} from './QuickstartStepper';
import {curlCommand, localDate, searchBody, signedHeaders, whatIsWrong} from './uhi-quickstart-values';

/**
 * The UHI quickstart: a PM-JAY HEM GPS search, built here and sent by you.
 *
 * It makes no network call, and cannot. A UHI request is signed with the
 * integrator's own Ed25519 private key, which a web page must never ask for,
 * and the answer arrives later on the integrator's own consumer_uri, never in
 * this browser. So the page builds the exact body, reads the two header values
 * out of what the Header Generation Utility prints, and hands back the curl.
 *
 * Nothing touches window or crypto at render: the UUID and the clock are read
 * in an effect, so the server render and the first client render agree.
 */

type Step = 'ids' | 'sign' | 'send' | 'see';

const STEPS: StepDef<Step>[] = [
  {key: 'ids', n: 1, title: 'Enter your IDs'},
  {key: 'sign', n: 2, title: 'Sign it'},
  {key: 'send', n: 3, title: 'Send it'},
  {key: 'see', n: 4, title: 'See the hospitals'},
];

const UTILITY = 'https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility';

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
  ['401 on step 3', 'Header signed over a different body, a reused or expired signature, or the wrong keyId'],
  ['403 on step 3', 'Public key not registered, or registration not yet active'],
  ['ACK but no callback', 'consumer_uri not publicly reachable over HTTPS, or your endpoint did not return 200'],
  ['Callback arrives but is not matched', 'Your code looked up the wrong transaction_id'],
  ['Empty providers[]', 'No empanelled hospital inside the radius. Widen it under Change location in step 1'],
];

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
  const [active, setActive] = useState<Step>('ids');
  const [subscriberId, setSubscriberId] = useState('');
  const [consumerUri, setConsumerUri] = useState('');
  const [latitude, setLatitude] = useState('17.3787973');
  const [longitude, setLongitude] = useState('78.4368433');
  const [radiusKm, setRadiusKm] = useState('13.0');
  const [uuid, setUuid] = useState('');
  const [now, setNow] = useState<Date | null>(null);
  const [printed, setPrinted] = useState('');
  const [sent, setSent] = useState(false);

  // Client only, after the first render, so nothing here differs from the
  // server render.
  useEffect(() => {
    setUuid(newUuid());
    setNow(new Date());
  }, []);

  const inputs = {subscriberId, consumerUri, latitude, longitude, radiusKm};
  const problem = whatIsWrong(inputs);
  const body =
    !problem && uuid && now
      ? searchBody({...inputs, uuid, timestamp: now.toISOString(), today: localDate(now)})
      : '';
  const {authorization, digest} = signedHeaders(printed);
  const signed = Boolean(body && authorization);
  const curl = curlCommand(body || '<THE_BODY_FROM_STEP_2>', authorization, digest);

  const done: Record<Step, boolean> = {ids: Boolean(body), sign: signed, send: sent, see: false};

  return (
    <div className="quickstart quickstart--fit">
      <div className="quickstart__card">
        <Stepper
          steps={STEPS}
          label="The four steps of a first UHI search"
          active={active}
          done={done}
          onSelect={setActive}
        />

        <div className="quickstart__panes">
          <StepCard
            step="ids"
            active={active}
            title="Enter your IDs"
            lede="Type the two values your sandbox registration gave you.">
            <div className="quickstart__form">
              <div className="quickstart__fields">
                <Field label="Subscriber ID" value={subscriberId} onValue={setSubscriberId} />
                <Field
                  label="consumer_uri"
                  hint="Your public HTTPS callback base URL."
                  placeholder="https://"
                  inputMode="url"
                  value={consumerUri}
                  onValue={setConsumerUri}
                />
              </div>
              <Details summary={<summary>Change location</summary>}>
                <div className="quickstart__fields">
                  <Field label="Latitude" inputMode="decimal" value={latitude} onValue={setLatitude} />
                  <Field label="Longitude" inputMode="decimal" value={longitude} onValue={setLongitude} />
                  <Field label="Radius, km" inputMode="decimal" value={radiusKm} onValue={setRadiusKm} />
                </div>
              </Details>
              <div className="quickstart__go">
                <Button type="button" disabled={!body} onClick={() => setActive('sign')}>
                  Continue
                </Button>
                {problem && (subscriberId || consumerUri) ? (
                  <span className="quickstart__hint">{problem}</span>
                ) : null}
              </div>
            </div>
          </StepCard>

          <StepCard
            step="sign"
            active={active}
            title="Sign it"
            lede="Copy this body, sign it on your own machine, and paste what the utility prints.">
            {body ? (
              <>
                <div className="quickstart__panel">
                  <p className="quickstart__panel-label">The exact body, one line</p>
                  <CodeBlock language="json">{body}</CodeBlock>
                </div>
                <p className="quickstart__hint">
                  Sign it with the{' '}
                  <a href={UTILITY} target="_blank" rel="noreferrer">
                    Header Generation Utility
                  </a>
                  , using your subscriber ID and public key ID. Your private key never leaves your machine.
                </p>
                <div className="quickstart__form">
                  <div className="quickstart__fields">
                    <label className="quickstart__field">
                      <span className="quickstart__label">What the utility printed</span>
                      <textarea
                        className="quickstart__input"
                        // The shared input height is one line; this box takes a few.
                        style={{height: 'auto'}}
                        rows={4}
                        autoComplete="off"
                        spellCheck={false}
                        value={printed}
                        onChange={(event) => setPrinted(event.target.value)}
                      />
                    </label>
                  </div>
                  <div className="quickstart__go">
                    <Button type="button" disabled={!signed} onClick={() => setActive('send')}>
                      Continue
                    </Button>
                    {signed && !digest ? (
                      <span className="quickstart__hint">
                        No Digest found. Paste the Digest line too, or fill it in the curl.
                      </span>
                    ) : null}
                  </div>
                </div>
              </>
            ) : (
              <p className="quickstart__held">Enter your IDs in step 1 first.</p>
            )}
          </StepCard>

          <StepCard step="send" active={active} title="Send it" lede="Run this in a terminal.">
            <div className="quickstart__panel">
              <CodeBlock language="bash">{curl}</CodeBlock>
            </div>
            <p className="quickstart__held">You get 200 and ACK straight away.</p>
            <div className="quickstart__go">
              <Button
                type="button"
                disabled={!signed}
                onClick={() => {
                  setSent(true);
                  setActive('see');
                }}>
                I got the ACK
              </Button>
            </div>
          </StepCard>

          <StepCard
            step="see"
            active={active}
            title="See the hospitals"
            lede="Within seconds your callback receives on_search, with the hospitals in message.catalog.providers[].">
            <p className="quickstart__held">
              Check <code>context.transaction_id</code> is <code>{uuid || 'your id'}</code>.
            </p>
            <div className="quickstart__panel">
              <p className="quickstart__panel-label">One hospital, as it arrives. Sandbox data differs</p>
              <CodeBlock language="json">{SAMPLE_PROVIDER}</CodeBlock>
            </div>
            <Details summary={<summary>If it does not work</summary>}>
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
            </Details>
          </StepCard>
        </div>
      </div>
    </div>
  );
}
