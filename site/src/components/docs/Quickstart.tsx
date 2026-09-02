import React, {useEffect, useState} from 'react';
import CodeBlock from '@theme/CodeBlock';
import {Check, Loader2, Lock} from 'lucide-react';
import {Button} from '@site/src/components/ui/button';
import {
  consentManagerFor,
  perRequestHeaders,
  readToken,
  subscribeToken,
  writeToken,
} from '@site/src/components/api/session';

/**
 * The four calls that create an ABHA, run live from the reader's browser.
 *
 * Same approach as the Try It console: fetch straight to NHA's host with no
 * proxy in between, and hold the access token through session.ts so a token
 * minted here is the token every endpoint page picks up.
 *
 * The gateway and the ABHA service sit on different hosts. `dev.abdm.gov.in`
 * serves the session call and answers 503 for the enrolment and certificate
 * paths, which are served from the M1 server in
 * catalogue/openapi/hiecm/v3/hiecm-m1.yaml. That server answers 401 for the
 * paths below and 404 for the alternatives, which is how the two were picked.
 */
const GATEWAY = 'https://dev.abdm.gov.in/api/hiecm/gateway/v3';
const ABHA = 'https://abhasbx.abdm.gov.in/abha/api';

type Step = 'session' | 'encrypt' | 'otp' | 'enrol';

/** One real request and whatever really came back. Never a stand in. */
type Exchange = {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  status?: number;
  statusText?: string;
  response?: string;
  error?: string;
  ms?: number;
};

const REDACTED = '********';

function pretty(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

/** Send it, and record what happened either way. */
async function call(
  method: string,
  url: string,
  headers: Record<string, string>,
  body?: unknown,
): Promise<{exchange: Exchange; json: Record<string, unknown> | null; text: string}> {
  const payload = body === undefined ? undefined : JSON.stringify(body);
  const started = Date.now();
  const exchange: Exchange = {method, url, headers, body: payload};
  try {
    const response = await fetch(url, {method, headers, body: payload});
    const text = await response.text();
    exchange.status = response.status;
    exchange.statusText = response.statusText;
    exchange.response = pretty(text);
    exchange.ms = Date.now() - started;
    let json: Record<string, unknown> | null = null;
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') json = parsed as Record<string, unknown>;
    } catch {
      // Not JSON. The body is shown as it arrived.
    }
    return {exchange, json, text};
  } catch (error) {
    exchange.error =
      error instanceof Error ? error.message : 'The request did not complete.';
    exchange.ms = Date.now() - started;
    return {exchange, json: null, text: ''};
  }
}

const toBytes = (base64: string) =>
  Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));

const toBase64 = (buffer: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)));

/**
 * RSA encrypt one value against NHA's published certificate, in this browser.
 *
 * WebCrypto offers RSA-OAEP only, and NHA's specification does not record which
 * padding or digest the service expects, so the digest is a control on the page
 * rather than a constant here.
 */
async function encryptValue(pem: string, value: string, hash: string): Promise<string> {
  const spki = pem.replace(/-----[^-]*-----/g, '').replace(/\s+/g, '');
  const key = await crypto.subtle.importKey(
    'spki',
    toBytes(spki),
    {name: 'RSA-OAEP', hash},
    false,
    ['encrypt'],
  );
  const cipher = await crypto.subtle.encrypt(
    {name: 'RSA-OAEP'},
    key,
    new TextEncoder().encode(value),
  );
  return toBase64(cipher);
}

/** Read a field back under any of the spellings the specification records. */
function field(json: Record<string, unknown> | null, names: string[]): string {
  if (!json) return '';
  for (const name of names) {
    const value = json[name];
    if (typeof value === 'string' && value) return value;
  }
  return '';
}

function Panel({exchange}: {exchange: Exchange}) {
  const headerLines = Object.entries(exchange.headers)
    // The token really is sent. It is masked here so a shared screen does not
    // hand a live credential to the room.
    .map(([name, value]) =>
      name === 'Authorization' ? `${name}: Bearer ${REDACTED}` : `${name}: ${value}`,
    )
    .join('\n');
  return (
    <div className="quickstart__panels">
      <div className="quickstart__panel">
        <p className="quickstart__panel-label">Request sent</p>
        <CodeBlock language="http">
          {`${exchange.method} ${exchange.url}\n${headerLines}${
            exchange.body ? `\n\n${pretty(exchange.body)}` : ''
          }`}
        </CodeBlock>
      </div>
      <div className="quickstart__panel">
        <p className="quickstart__panel-label">
          Response received
          {typeof exchange.status === 'number' ? (
            <span
              className={`quickstart__code quickstart__code--${
                exchange.status < 400 ? 'ok' : 'bad'
              }`}>
              {exchange.status} {exchange.statusText}
            </span>
          ) : null}
          {exchange.ms ? <span className="quickstart__ms">{exchange.ms} ms</span> : null}
        </p>
        {exchange.error ? (
          <p className="quickstart__failed">
            {exchange.error}. Nothing reached the server, so there is no response body
            to show. Check the host is reachable from this network and try again.
          </p>
        ) : (
          <CodeBlock language="json">{exchange.response || '(empty body)'}</CodeBlock>
        )}
      </div>
    </div>
  );
}

function StepCard({
  index,
  title,
  lede,
  done,
  locked,
  lockedNote,
  children,
}: {
  index: number;
  title: string;
  lede: string;
  done: boolean;
  locked: boolean;
  lockedNote: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`quickstart__step${locked ? ' quickstart__step--locked' : ''}`}
      aria-labelledby={`quickstart-step-${index}`}>
      <div className="quickstart__step-head">
        <span className="quickstart__marker" aria-hidden="true">
          {done ? <Check className="size-4" /> : index}
        </span>
        <div>
          <h3 className="quickstart__step-title" id={`quickstart-step-${index}`}>
            {title}
          </h3>
          <p className="quickstart__step-lede">{lede}</p>
        </div>
      </div>
      {locked ? (
        <p className="quickstart__locked-note">{lockedNote}</p>
      ) : (
        <div className="quickstart__step-body">{children}</div>
      )}
    </section>
  );
}

export default function Quickstart() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [token, setToken] = useState(readToken);
  const [aadhaar, setAadhaar] = useState('');
  const [digest, setDigest] = useState('SHA-256');
  const [pem, setPem] = useState('');
  const [loginId, setLoginId] = useState('');
  const [txnId, setTxnId] = useState('');
  const [otp, setOtp] = useState('');
  const [mobile, setMobile] = useState('');
  const [busy, setBusy] = useState<Step | ''>('');
  const [status, setStatus] = useState('');
  const [log, setLog] = useState<Partial<Record<Step, Exchange>>>({});
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  // Another panel in this tab may mint or clear the token first.
  useEffect(() => subscribeToken(setToken), []);

  const record = (step: Step, exchange: Exchange) =>
    setLog((current) => ({...current, [step]: exchange}));

  /**
   * The headers NHA requires. REQUEST-ID and TIMESTAMP are generated fresh for
   * every request, because a reused id or a drifted timestamp is rejected.
   * X-CM-ID belongs to the gateway session call: the M1 operations do not list
   * it, so it is not invented onto them.
   */
  function headers(kind: 'gateway' | 'abha'): Record<string, string> {
    const generated = perRequestHeaders();
    return {
      'REQUEST-ID': generated['REQUEST-ID'],
      TIMESTAMP: generated.TIMESTAMP,
      'Content-Type': 'application/json',
      ...(kind === 'gateway'
        ? {'X-CM-ID': consentManagerFor(GATEWAY)}
        : {Authorization: `Bearer ${token}`}),
    };
  }

  async function runSession(event: React.FormEvent) {
    event.preventDefault();
    setBusy('session');
    setStatus('Creating a gateway session.');
    const sent = headers('gateway');
    const {exchange, json} = await call(
      'POST',
      `${GATEWAY}/sessions`,
      sent,
      {clientId, clientSecret, grantType: 'client_credentials'},
    );
    // The secret goes to NHA, not onto the screen.
    record('session', {
      ...exchange,
      body: JSON.stringify({clientId, clientSecret: REDACTED, grantType: 'client_credentials'}),
    });
    const minted = field(json, ['accessToken']);
    if (minted) {
      setToken(minted);
      writeToken(minted);
      setStatus('Step 1 succeeded. You have an access token.');
    } else {
      setStatus('Step 1 did not return an access token. The response is shown below.');
    }
    setBusy('');
  }

  async function runEncrypt(event: React.FormEvent) {
    event.preventDefault();
    setBusy('encrypt');
    setLoginId('');
    setStatus('Fetching the public certificate.');
    const {exchange, json, text} = await call(
      'GET',
      `${ABHA}/v3/profile/public/certificate`,
      headers('abha'),
    );
    record('encrypt', exchange);
    // The specification records `publicKey` in a JSON body. Some ABDM hosts
    // hand the PEM back as plain text, so both are accepted rather than one
    // being assumed.
    const key = field(json, ['publicKey']) || (text.includes('BEGIN PUBLIC KEY') ? text : '');
    setPem(key);
    if (!key) {
      setStatus('No certificate came back, so nothing was encrypted.');
      setBusy('');
      return;
    }
    try {
      setLoginId(await encryptValue(key, aadhaar.trim(), digest));
      setStatus('Step 2 succeeded. The number was encrypted in this browser.');
    } catch (error) {
      setStatus(
        `The browser could not encrypt with that certificate: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
    setBusy('');
  }

  async function runOtp(event: React.FormEvent) {
    event.preventDefault();
    setBusy('otp');
    setStatus('Requesting an OTP from Aadhaar.');
    const {exchange, json} = await call('POST', `${ABHA}/v3/enrollment/request/otp`, headers('abha'), {
      scope: ['abha-enrol'],
      loginHint: 'aadhaar',
      loginId,
      otpSystem: 'aadhaar',
    });
    record('otp', exchange);
    const returned = field(json, ['txnId']);
    if (returned) {
      setTxnId(returned);
      setStatus('Step 3 succeeded. An OTP was sent to the registered mobile.');
    } else {
      setStatus('Step 3 returned no transaction id. The response is shown below.');
    }
    setBusy('');
  }

  async function runEnrol(event: React.FormEvent) {
    event.preventDefault();
    setBusy('enrol');
    setStatus('Creating the ABHA.');
    let otpValue = '';
    try {
      // The OTP is encrypted against the same certificate, per the encryption
      // concept page's list of values that never travel raw.
      otpValue = await encryptValue(pem, otp.trim(), digest);
    } catch (error) {
      setStatus(
        `The OTP could not be encrypted: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
      setBusy('');
      return;
    }
    const {exchange, json} = await call(
      'POST',
      `${ABHA}/v3/enrollment/enrol/byAadhaar`,
      headers('abha'),
      {
        authData: {
          authMethods: ['otp'],
          otp: {txnId, otpValue, mobile: mobile.trim()},
        },
        consent: {code: 'abha-enrollment', version: '1.4'},
      },
    );
    record('enrol', exchange);
    setResult(json);
    setStatus(
      exchange.status === 200
        ? 'Step 4 finished. The response is shown below.'
        : 'Step 4 did not succeed. The response is shown below.',
    );
    setBusy('');
  }

  const abhaNumber = field(result, ['ABHANumber', 'abhaNumber', 'healthIdNumber']);
  const abhaAddress = field(result, [
    'preferredAbhaAddress',
    'abhaAddress',
    'phrAddress',
    'healthId',
  ]);

  return (
    <div className="quickstart">
      <p className="quickstart__status" role="status" aria-live="polite">
        {status}
      </p>

      <StepCard
        index={1}
        title="Create a gateway session"
        lede="Exchange your sandbox client id and secret for the access token every later call carries."
        done={Boolean(token)}
        locked={false}
        lockedNote="">
        <form className="quickstart__form" onSubmit={runSession}>
          <div className="quickstart__fields">
            <label className="quickstart__field">
              <span className="quickstart__label">clientId</span>
              <input
                className="quickstart__input"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={clientId}
                onChange={(event) => setClientId(event.target.value)}
              />
            </label>
            <label className="quickstart__field">
              <span className="quickstart__label">
                clientSecret <span className="quickstart__sensitive">sensitive</span>
              </span>
              <input
                className="quickstart__input"
                type="password"
                autoComplete="off"
                spellCheck={false}
                value={clientSecret}
                onChange={(event) => setClientSecret(event.target.value)}
              />
              <span className="quickstart__hint">
                Held in this page only while the tab is open. It is never written to
                storage and never put in a URL.
              </span>
            </label>
          </div>
          <Button type="submit" disabled={busy !== '' || !clientId || !clientSecret}>
            {busy === 'session' ? (
              <Loader2 className="quickstart__spin size-4" aria-hidden="true" />
            ) : null}
            Create session
          </Button>
        </form>
        {token ? (
          <p className="quickstart__held">
            An access token is held for this browser session. Every Try It console on
            this site will use it.
          </p>
        ) : null}
        {log.session ? <Panel exchange={log.session} /> : null}
      </StepCard>

      <StepCard
        index={2}
        title="Encrypt the Aadhaar number"
        lede="Fetch NHA's public certificate, then encrypt the number here in your browser. NHA never accepts a raw Aadhaar number."
        done={Boolean(loginId)}
        locked={!token}
        lockedNote="Create a session first. Fetching the certificate needs the access token.">
        <div className="quickstart__warning">
          <Lock className="size-4" aria-hidden="true" />
          <div>
            <strong>An Aadhaar number is a government identity number.</strong>
            <p>
              What you type is encrypted in this browser with NHA's public key and
              posted only to NHA's sandbox host. This site has no server of its own and
              stores nothing you type. Use a sandbox test identity, not a real person's
              Aadhaar number. NHA does not publish a test Aadhaar number, so bring one
              issued to you for sandbox use.
            </p>
          </div>
        </div>
        <form className="quickstart__form" onSubmit={runEncrypt}>
          <div className="quickstart__fields">
            <label className="quickstart__field">
              <span className="quickstart__label">
                Aadhaar number <span className="quickstart__sensitive">sensitive</span>
              </span>
              <input
                className="quickstart__input"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                value={aadhaar}
                onChange={(event) => setAadhaar(event.target.value)}
              />
              <span className="quickstart__hint">
                Masked as you type, kept in this page's memory only, cleared when you
                close the tab.
              </span>
            </label>
            <label className="quickstart__field">
              <span className="quickstart__label">OAEP digest</span>
              <select
                className="quickstart__input"
                value={digest}
                onChange={(event) => setDigest(event.target.value)}>
                <option value="SHA-256">SHA-256</option>
                <option value="SHA-1">SHA-1</option>
              </select>
              <span className="quickstart__hint">
                NHA's specification does not record which padding the service expects.
                This page uses RSA-OAEP, the only RSA encryption a browser offers. If the
                next call rejects the value, try the other digest.
              </span>
            </label>
          </div>
          <Button type="submit" disabled={busy !== '' || !aadhaar.trim()}>
            {busy === 'encrypt' ? (
              <Loader2 className="quickstart__spin size-4" aria-hidden="true" />
            ) : null}
            Fetch certificate and encrypt
          </Button>
        </form>
        {loginId ? (
          <div className="quickstart__panel">
            <p className="quickstart__panel-label">
              Encrypted here in your browser, ready to send as `loginId`
            </p>
            <CodeBlock language="text">{loginId}</CodeBlock>
          </div>
        ) : null}
        {log.encrypt ? <Panel exchange={log.encrypt} /> : null}
      </StepCard>

      <StepCard
        index={3}
        title="Request the OTP"
        lede="NHA sends a one time password to the mobile number registered against that Aadhaar, and hands you a transaction id."
        done={Boolean(txnId)}
        locked={!loginId}
        lockedNote="Encrypt the Aadhaar number first. This call takes the encrypted value, never the raw one.">
        <form className="quickstart__form" onSubmit={runOtp}>
          <Button type="submit" disabled={busy !== ''}>
            {busy === 'otp' ? (
              <Loader2 className="quickstart__spin size-4" aria-hidden="true" />
            ) : null}
            Request OTP
          </Button>
        </form>
        {txnId ? <p className="quickstart__held">Transaction id: {txnId}</p> : null}
        {log.otp ? <Panel exchange={log.otp} /> : null}
      </StepCard>

      <StepCard
        index={4}
        title="Create the ABHA"
        lede="Send the OTP with the transaction id. This call creates a real account on the sandbox, so send it once."
        done={Boolean(abhaNumber)}
        locked={!txnId}
        lockedNote="Request an OTP first. This call needs the transaction id that came back with it.">
        <form className="quickstart__form" onSubmit={runEnrol}>
          <div className="quickstart__fields">
            <label className="quickstart__field">
              <span className="quickstart__label">
                OTP <span className="quickstart__sensitive">sensitive</span>
              </span>
              <input
                className="quickstart__input"
                type="password"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
              />
              <span className="quickstart__hint">
                Encrypted with the same certificate before it is sent.
              </span>
            </label>
            <label className="quickstart__field">
              <span className="quickstart__label">Mobile number</span>
              <input
                className="quickstart__input"
                type="tel"
                inputMode="numeric"
                autoComplete="off"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
              />
              <span className="quickstart__hint">
                The number to attach to the new account. The specification requires it on
                this call and its example shows it unencrypted.
              </span>
            </label>
          </div>
          <Button type="submit" disabled={busy !== '' || !otp.trim() || !mobile.trim()}>
            {busy === 'enrol' ? (
              <Loader2 className="quickstart__spin size-4" aria-hidden="true" />
            ) : null}
            Create ABHA
          </Button>
        </form>
        {abhaNumber || abhaAddress ? (
          <dl className="quickstart__result">
            {abhaNumber ? (
              <div>
                <dt>ABHA number</dt>
                <dd>{abhaNumber}</dd>
              </div>
            ) : null}
            {abhaAddress ? (
              <div>
                <dt>ABHA address</dt>
                <dd>{abhaAddress}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
        {log.enrol && !abhaNumber && !abhaAddress && log.enrol.status === 200 ? (
          <p className="quickstart__held">
            The call succeeded. NHA's specification does not document the response body
            for this operation, so read the fields you need from the response below.
          </p>
        ) : null}
        {log.enrol ? <Panel exchange={log.enrol} /> : null}
      </StepCard>
    </div>
  );
}
