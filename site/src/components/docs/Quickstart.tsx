import React, {useEffect, useState} from 'react';
import CodeBlock from '@theme/CodeBlock';
import {Check, Eye, EyeOff, Info, Loader2, Lock} from 'lucide-react';
import {Button} from '@site/src/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@site/src/components/ui/tooltip';
import {
  consentManagerFor,
  perRequestHeaders,
  readToken,
  subscribeToken,
  writeToken,
} from '@site/src/components/api/session';
import {encryptValue, paddingFromAlgorithm, type Padding} from '@site/src/components/api/rsa';
import {field, mobileIsWellFormed, otpIsWellFormed} from './quickstart-values';

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

const AADHAAR_NOTE =
  "What you type is encrypted in this browser with NHA's public key and posted only " +
  'to NHA\'s sandbox host. This site has no server of its own and stores nothing you ' +
  'type. Use a sandbox test identity, not a real person\'s Aadhaar number. NHA does ' +
  'not publish a test Aadhaar number, so bring one issued to you for sandbox use.';

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

/**
 * NHA's sandbox edge accepts browser requests only from origins it has
 * allowlisted, and answers everything else with a 403 and no body. That is a
 * different failure from a token that lacks a role, which comes back as JSON,
 * so it gets its own explanation rather than the generic 403 text.
 */
function originBlocked(exchange: Exchange): boolean {
  return exchange.status === 403 && !(exchange.response ?? '').trim();
}

const ORIGIN_BLOCKED =
  'The ABDM sandbox only accepts browser requests from origins NHA has allowlisted, and this site is not one yet: it answered 403 with no body before the request reached the API. The request itself is fine. Copy it from the exchange below and run it from a terminal, or run this portal locally on localhost:3000, which the sandbox allows.';

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

/** The steps in the order they run. The stepper and the log both read this. */
const STEPS: {key: Step; n: number; title: string}[] = [
  {key: 'session', n: 1, title: 'Create a gateway session'},
  {key: 'encrypt', n: 2, title: 'Encrypt the Aadhaar number'},
  {key: 'otp', n: 3, title: 'Request and enter the OTP'},
  {key: 'enrol', n: 4, title: 'Create the ABHA'},
];

/**
 * All four steps, always, above the one card that is open.
 *
 * Showing them is not about progress. It is the claim the page is making: the
 * whole use case is four calls, and a reader should be able to see that before
 * they start rather than discover it a card at a time. Every step is reachable
 * at any point, so the fields of a step you have not reached yet are still
 * yours to read and fill. Running one out of order is what the toast refuses,
 * not opening it.
 */
function Stepper({
  active,
  done,
  onSelect,
}: {
  active: Step;
  done: Record<Step, boolean>;
  onSelect: (step: Step) => void;
}) {
  // The line runs between the first marker and the last, so it has three
  // segments for four steps. Finishing a step fills the segment that leads to
  // the next one, which is why a fourth finished step cannot add any more.
  const finished = STEPS.filter(({key}) => done[key]).length;
  const progress = Math.min(finished, STEPS.length - 1) / (STEPS.length - 1);
  return (
    <ol
      className="quickstart__stepper"
      aria-label="The four steps that create an ABHA"
      style={{'--quickstart-progress': progress} as React.CSSProperties}>
      {STEPS.map(({key, n, title}) => (
        <li key={key}>
          <button
            type="button"
            onClick={() => onSelect(key)}
            aria-current={key === active ? 'step' : undefined}
            className={`quickstart__stepper-step${
              key === active ? ' quickstart__stepper-step--active' : ''
            }${done[key] ? ' quickstart__stepper-step--done' : ''}`}>
            <span className="quickstart__marker" aria-hidden="true">
              {done[key] ? <Check className="size-4" /> : n}
            </span>
            <span className="quickstart__stepper-title">{title}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

/**
 * Everything that was sent and everything that came back, under the row rather
 * than inside the cards.
 *
 * A card is half the column wide and a request beside its response is not.
 * Kept in the card it either squeezed the two into 366px or, once the cards
 * were made one size, stretched all four to the height of whichever one had
 * run. Below the row each exchange gets the full width, and only the step that
 * ran adds any height.
 */
function ExchangeLog({
  log,
  loginId,
}: {
  log: Partial<Record<Step, Exchange>>;
  loginId: string;
}) {
  const ran = STEPS.filter((step) => log[step.key]);
  if (!ran.length) return null;
  return (
    <section className="quickstart__log" aria-label="What was sent and what came back">
      {ran.map(({key, n, title}) => (
        <div className="quickstart__log-entry" key={key}>
          <h3 className="quickstart__log-title">
            {n}. {title}
          </h3>
          <Panel exchange={log[key] as Exchange} />
          {key === 'encrypt' && loginId ? (
            <div className="quickstart__panel">
              <p className="quickstart__panel-label">
                Encrypted here in your browser, ready to send as `loginId`
              </p>
              <CodeBlock language="text">{loginId}</CodeBlock>
            </div>
          ) : null}
        </div>
      ))}
    </section>
  );
}

/**
 * One step's form, rendered only when it is the step the stepper has open.
 *
 * Returning null for the other three is what lets the card be the size of its
 * own content. Sized as four cards in a grid they all took the height of
 * whichever one had the most fields, which on the widest layout left 892px of
 * the 1529px runner empty.
 */
function StepCard({
  step,
  active,
  title,
  lede,
  children,
}: {
  step: Step;
  active: Step;
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  // Every pane renders, and the three that are not open are hidden rather than
  // dropped. They all sit in one grid cell, so the card is the height of the
  // tallest of them at whatever width it is being read at, and moving between
  // steps does not resize the card or shift the page under it. `visibility`
  // rather than `display`, because a hidden pane must keep its size, and it
  // takes the pane out of the tab order and the accessibility tree either way.
  return (
    <section
      className={`quickstart__pane${step === active ? '' : ' quickstart__pane--hidden'}`}
      aria-labelledby={`quickstart-step-${step}`}>
      <div className="quickstart__step-head">
        <h3 className="quickstart__step-title" id={`quickstart-step-${step}`}>
          {title}
        </h3>
        <p className="quickstart__step-lede">{lede}</p>
      </div>
      <div className="quickstart__step-body">{children}</div>
    </section>
  );
}


/**
 * A field whose value is masked, with the usual way to check what you typed.
 *
 * All three secrets here are things people get wrong silently: a pasted client
 * secret with a character missing, an Aadhaar number typed blind, a six digit
 * code read off a phone. The server's answer to each is a refusal that reads
 * like something else, so the reader has to be able to look at what they
 * entered. Nothing about the value changes when it is shown: it is still held
 * in this page's memory only, never written to storage and never put in a URL.
 *
 * `label` carries no element of its own, because the whole field is a label.
 * The toggle is a button inside it, so a click on the eye does not also focus
 * the input and move the caret.
 */
function SecretField({
  label,
  hint,
  value,
  onValue,
  name,
  inputMode,
  autoComplete = 'off',
  describedBy,
}: {
  label: string;
  hint: React.ReactNode;
  value: string;
  onValue: (value: string) => void;
  name?: string;
  inputMode?: 'numeric';
  autoComplete?: string;
  describedBy?: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <label className="quickstart__field">
      <span className="quickstart__label">
        {label} <span className="quickstart__sensitive">sensitive</span>
      </span>
      <span className="quickstart__secret">
        <input
          className="quickstart__input"
          type={shown ? 'text' : 'password'}
          name={name}
          inputMode={inputMode}
          autoComplete={autoComplete}
          spellCheck={false}
          aria-describedby={describedBy}
          value={value}
          onChange={(event) => onValue(event.target.value)}
        />
        <button
          type="button"
          className="quickstart__reveal"
          onClick={() => setShown((was) => !was)}
          aria-pressed={shown}
          // The label as written, not lowercased: "the otp" and "the aadhaar
          // number" are how that came out, and a screen reader reads both.
          aria-label={`${shown ? 'Hide' : 'Show'} ${label}`}
          title={shown ? 'Hide' : 'Show'}>
          {shown ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </span>
      <span className="quickstart__hint">{hint}</span>
    </label>
  );
}

/**
 * What the line above the card is saying, so it can be drawn as a status
 * rather than read as another paragraph of the page. A reader scanning for
 * "did that work" was finding a sentence in body text, indistinguishable from
 * the prose around it.
 */
type Progress = {kind: 'idle' | 'busy' | 'ok' | 'error'; text: string};

export default function Quickstart() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [token, setToken] = useState(readToken);
  const [aadhaar, setAadhaar] = useState('');
  // What the certificate declared, read from it rather than picked. It is not
  // a control any more: the V3 certificate states
  // RSA/ECB/OAEPWithSHA-1AndMGF1Padding, and the other two paddings this module
  // can produce are both refused by the V3 sandbox, so the choice only ever let
  // a reader break their own request. Held because runEnrol encrypts the OTP
  // with whatever the certificate asked for.
  const [padding, setPadding] = useState<Padding>('oaep-sha1');
  const [pem, setPem] = useState('');
  const [loginId, setLoginId] = useState('');
  const [txnId, setTxnId] = useState('');
  const [otp, setOtp] = useState('');
  const [mobile, setMobile] = useState('');
  const [busy, setBusy] = useState<Step | ''>('');
  const [status, setStatus] = useState<Progress>({kind: 'idle', text: ''});
  const [log, setLog] = useState<Partial<Record<Step, Exchange>>>({});
  const [toast, setToast] = useState<{text: string; at: number} | null>(null);
  const [active, setActive] = useState<Step>('session');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  // Another panel in this tab may mint or clear the token first.
  useEffect(() => subscribeToken(setToken), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  /**
   * Every field stays usable, so a step can be attempted before the step it
   * depends on has run. The prerequisite is still real, so the attempt is
   * refused here and the reason is said out loud, rather than sending a call
   * that cannot succeed and letting the reader read a server error for it.
   */
  const say = (kind: Progress['kind'], text: string) => setStatus({kind, text});

  function warn(text: string) {
    setToast({text, at: Date.now()});
  }

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

  async function runSession(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy('session');
    say('busy', 'Creating a gateway session.');
    const sent = headers('gateway');
    // Read from the form, not from state. A password manager fills a field by
    // setting its value directly, which never reaches React's onChange, so the
    // state can still be empty while the input on screen looks filled. The
    // request then goes out with an empty secret and comes back ABDM-9999,
    // which reads as a wrong secret rather than a missing one.
    //
    // Trimmed because a pasted credential carries a trailing newline more often
    // than not, and the gateway rejects that the same way it rejects a wrong
    // one. Every other field on this page is trimmed.
    const form = new FormData(event.currentTarget);
    const id = String(form.get('clientId') ?? clientId).trim();
    const secret = String(form.get('clientSecret') ?? clientSecret).trim();
    if (!id || !secret) {
      setBusy('');
      return warn(
        'The client id and secret both have to be filled in. If a password manager put one there, retype it: a value set that way does not always reach the page.',
      );
    }
    const {exchange, json} = await call(
      'POST',
      `${GATEWAY}/sessions`,
      sent,
      {clientId: id, clientSecret: secret, grantType: 'client_credentials'},
    );
    // The secret goes to NHA, not onto the screen.
    record('session', {
      ...exchange,
      body: JSON.stringify({
        clientId: id,
        clientSecret: `${REDACTED} (${secret.length} characters)`,
        grantType: 'client_credentials',
      }),
    });
    const minted = field(json, ['accessToken']);
    if (minted) {
      setToken(minted);
      writeToken(minted);
      setActive('encrypt');
      say('ok', 'Step 1 succeeded. You have an access token.');
    } else {
      say('error', originBlocked(exchange) ? ORIGIN_BLOCKED : 'Step 1 did not return an access token. The response is shown below.');
    }
    setBusy('');
  }

  async function runEncrypt(event: React.FormEvent) {
    event.preventDefault();
    if (!token)
      return warn('Create a session first. Fetching the certificate needs the access token.');
    setBusy('encrypt');
    setLoginId('');
    say('busy', 'Fetching the public certificate.');
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
      say(
        'error',
        originBlocked(exchange)
          ? ORIGIN_BLOCKED
          : 'No certificate came back, so nothing was encrypted.',
      );
      setBusy('');
      return;
    }
    // The certificate names its own algorithm. Follow it rather than guess.
    // The choice is held in a local because setPadding does not change
    // `padding` inside this call: encrypting with the state value would use the
    // padding from before the certificate was read, and the OTP, which runEnrol
    // encrypts with the state value later, would then use a different one.
    // A certificate that declares nothing leaves the reader's choice alone.
    const declared = field(json, ['encryptionAlgorithm']);
    const effective = declared ? paddingFromAlgorithm(declared) : padding;
    setPadding(effective);
    try {
      setLoginId(await encryptValue(key, effective, aadhaar.trim()));
      setActive('otp');
      say('ok', 'Step 2 succeeded. The number was encrypted in this browser.');
    } catch (error) {
      say(
        'error',
        `The browser could not encrypt with that certificate: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
    setBusy('');
  }

  async function runOtp(event: React.FormEvent) {
    event.preventDefault();
    if (!loginId)
      return warn(
        'Encrypt the Aadhaar number first. This call takes the encrypted value, never the raw one.',
      );
    setBusy('otp');
    say('busy', 'Requesting an OTP from Aadhaar.');
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
      // Deliberately not setActive('enrol'). The OTP has been sent, not read:
      // moving on here put the reader on step 4 before the message had
      // arrived, and the field they still had to fill was behind them.
      say('ok', 'An OTP was sent to the registered mobile. Type it in below, with the mobile number for the new account.');
    } else {
      say('error', originBlocked(exchange) ? ORIGIN_BLOCKED : 'Step 3 returned no transaction id. The response is shown below.');
    }
    setBusy('');
  }

  async function runEnrol(event: React.FormEvent) {
    event.preventDefault();
    if (!txnId)
      return warn(
        'Request an OTP first. This call needs the transaction id that came back with it.',
      );
    setBusy('enrol');
    say('busy', 'Creating the ABHA.');
    let otpValue = '';
    try {
      // The OTP is encrypted against the same certificate, per the encryption
      // concept page's list of values that never travel raw.
      otpValue = await encryptValue(pem, padding, otp.trim());
    } catch (error) {
      say(
        'error',
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
    const created = field(json, ['ABHANumber', 'abhaNumber', 'healthIdNumber']);
    if (created) {
      say('ok', `The ABHA was created. Number ${created}.`);
    } else if (exchange.status === 200) {
      say('ok', 'The call succeeded, but no ABHA number came back with it. The response is shown below.');
    } else {
      // The transaction dies on its first use and on a timer, and the reader
      // cannot tell those two apart from the code alone. Either way the way
      // out is the same, and saying it here is the difference between a dead
      // end and a retry.
      const code = field(json, ['code']);
      say(
        'error',
        code === 'ABDM-1017'
          ? 'That transaction is no longer valid: it has expired, or it was already used. Go back to step 3, request a new OTP, and enter the new code.'
          : originBlocked(exchange)
            ? ORIGIN_BLOCKED
            : 'The ABHA was not created. The response is shown below.',
      );
    }
    setBusy('');
  }

  const otpReady = otpIsWellFormed(otp);
  const mobileReady = mobileIsWellFormed(mobile);

  /** What is still missing, said plainly, so a disabled button is explained. */
  function whatIsMissing(): string {
    if (!txnId) return 'Request an OTP first.';
    if (!otp.trim() && !mobile.trim()) return 'Enter the OTP and the mobile number.';
    if (!otpReady) return 'The OTP is six digits.';
    if (!mobileReady) return 'A mobile number is ten digits, the first between 1 and 9.';
    return '';
  }

  function goToEnrol(event: React.FormEvent) {
    event.preventDefault();
    const missing = whatIsMissing();
    if (missing) return warn(missing);
    setActive('enrol');
    say('ok', 'Step 3 finished. Creating the ABHA is the last call.');
  }

  /**
   * Clear the identity and start again, keeping the session.
   *
   * A new ABHA needs a new Aadhaar number, so this goes back to step 2 rather
   * than step 3, and the access token from step 1 is left alone because it is
   * good for the whole tab.
   */
  function startAnother() {
    setAadhaar('');
    setLoginId('');
    setTxnId('');
    setOtp('');
    setMobile('');
    setResult(null);
    setLog((current) => ({session: current.session}));
    setActive('encrypt');
    say('idle', 'Ready for another ABHA. The access token from step 1 is still held.');
  }

  const abhaNumber = field(result, ['ABHANumber', 'abhaNumber', 'healthIdNumber']);
  const message = field(result, ['message']);
  const holder = [
    field(result, ['firstName']),
    field(result, ['middleName']),
    field(result, ['lastName']),
  ]
    .filter(Boolean)
    .join(' ');
  const abhaAddress = field(result, [
    'preferredAbhaAddress',
    'abhaAddress',
    'phrAddress',
    'healthId',
  ]);

  /** What the stepper shows a tick against: the step produced its value. */
  const done: Record<Step, boolean> = {
    session: Boolean(token),
    encrypt: Boolean(loginId),
    // Step 3 is finished when it has both halves: the transaction NHA opened,
    // and the code the reader read off their phone, which is now typed here.
    otp: Boolean(txnId) && otpReady && mobileReady,
    enrol: Boolean(abhaNumber),
  };

  return (
    <div className="quickstart">
      <div className="quickstart__status-row" role="status" aria-live="polite">
        {status.text ? (
          <p className={`quickstart__status quickstart__status--${status.kind}`}>
            {status.kind === 'busy' ? (
              <Loader2 className="quickstart__spin size-3.5" aria-hidden="true" />
            ) : (
              <span className="quickstart__status-dot" aria-hidden="true" />
            )}
            <span>{status.text}</span>
          </p>
        ) : null}
      </div>

      <div className="quickstart__card">
        <Stepper active={active} done={done} onSelect={setActive} />

        <div className="quickstart__panes">
          <StepCard
            step="session"
            active={active}
            title="Create a gateway session"
            lede="Exchange your sandbox client id and secret for the access token every later call carries.">
            <form className="quickstart__form" onSubmit={runSession}>
              <div className="quickstart__fields">
                <label className="quickstart__field">
                  <span className="quickstart__label">Client ID</span>
                  <input
                    className="quickstart__input"
                    type="text"
                    name="clientId"
                    autoComplete="off"
                    spellCheck={false}
                    value={clientId}
                    onChange={(event) => setClientId(event.target.value)}
                  />
                </label>
                <SecretField
                  label="Client secret"
                  name="clientSecret"
                  value={clientSecret}
                  onValue={setClientSecret}
                  hint="Held in this page only while the tab is open. It is never written to storage and never put in a URL."
                />
              </div>
              <Button type="submit" disabled={busy !== '' || !clientId.trim() || !clientSecret.trim()}>
                {busy === 'session' ? (
                  <Loader2 className="quickstart__spin size-4" aria-hidden="true" />
                ) : null}
                Create session
              </Button>
            </form>
            {token ? (
              <p className="quickstart__held">
                An access token is held in <code>sessionStorage</code> for this tab, so
                every Try It console on this site can use it without you pasting it again.
                Closing the tab ends it.
              </p>
            ) : null}
          </StepCard>

          <StepCard
            step="encrypt"
            active={active}
            title="Encrypt the Aadhaar number"
            lede="Fetch NHA's public certificate, then encrypt the number here in your browser. NHA never accepts a raw Aadhaar number.">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="quickstart__warning"
                    aria-label={`An Aadhaar number is a government identity number. ${AADHAAR_NOTE}`}>
                    <Lock className="size-4" aria-hidden="true" />
                    <span>
                      An Aadhaar number is a government identity number. Use a sandbox test
                      identity.
                    </span>
                    <Info className="quickstart__warning-mark size-3.5" aria-hidden="true" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="quickstart__tip" side="top">
                  {AADHAAR_NOTE}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span id="quickstart-aadhaar-note" className="quickstart__sr-only">
              {AADHAAR_NOTE}
            </span>
            <form className="quickstart__form" onSubmit={runEncrypt}>
              <div className="quickstart__fields">
                <SecretField
                  label="Aadhaar number"
                  inputMode="numeric"
                  describedBy="quickstart-aadhaar-note"
                  value={aadhaar}
                  onValue={setAadhaar}
                  hint="Masked as you type, kept in this page's memory only, cleared when you close the tab."
                />
              </div>
              <Button type="submit" disabled={busy !== '' || !aadhaar.trim()}>
                {busy === 'encrypt' ? (
                  <Loader2 className="quickstart__spin size-4" aria-hidden="true" />
                ) : null}
                Fetch certificate and encrypt
              </Button>
            </form>
          </StepCard>

          <StepCard
            step="otp"
            active={active}
            title="Request and enter the OTP"
            lede="NHA sends a one time password to the mobile number registered against that Aadhaar, and hands you a transaction id. Type the code back here, with the mobile number the new account should carry.">
            <form className="quickstart__form" onSubmit={runOtp}>
              <Button type="submit" variant={txnId ? 'outline' : 'default'} disabled={busy !== ''}>
                {busy === 'otp' ? (
                  <Loader2 className="quickstart__spin size-4" aria-hidden="true" />
                ) : null}
                {txnId ? 'Request a new OTP' : 'Request OTP'}
              </Button>
            </form>
            {txnId ? <p className="quickstart__held">Transaction id: {txnId}</p> : null}

            {/* The code and the mobile number are typed here rather than on
                step 4, because this is the step the reader is on while the
                message is arriving. Step 4 is then one button and its result.

                Its own form, so Enter submits it, so it carries the same
                spacing as the Request OTP form above it rather than crowding
                against that button, and so Continue is a deliberate act. The
                reader used to be carried to step 4 the moment the OTP was
                sent, which is before they could possibly have read it. */}
            <form className="quickstart__form" onSubmit={goToEnrol}>
              <div className="quickstart__fields">
                <SecretField
                  label="OTP"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onValue={setOtp}
                  hint="Six digits. Encrypted with the same certificate before it is sent."
                />
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
                    Ten digits, the first between 1 and 9. The number to attach to the new
                    account. The specification requires it on the next call and its example
                    shows it unencrypted.
                  </span>
                </label>
              </div>
              <div className="quickstart__go">
                <Button type="submit" disabled={!txnId || !otpReady || !mobileReady}>
                  Continue
                </Button>
                {whatIsMissing() ? (
                  <span className="quickstart__hint">{whatIsMissing()}</span>
                ) : null}
              </div>
            </form>
          </StepCard>

          <StepCard
            step="enrol"
            active={active}
            title="Create the ABHA"
            lede="Send the code from step 3 with its transaction id. This creates a real account on the sandbox, so send it once.">
            {abhaNumber ? (
              /* The account, not the proof that a call returned 200. NHA
                 nests it under ABHAProfile and writes the address as a list,
                 which is why this used to render nothing at all. */
              <div className="quickstart__created">
                <p className="quickstart__created-head">
                  <Check className="size-4" aria-hidden="true" />
                  {message || 'The ABHA was created.'}
                </p>
                <dl className="quickstart__result">
                  <div>
                    <dt>ABHA number</dt>
                    <dd>{abhaNumber}</dd>
                  </div>
                  {abhaAddress ? (
                    <div>
                      <dt>ABHA address</dt>
                      <dd>{abhaAddress}</dd>
                    </div>
                  ) : null}
                  {holder ? (
                    <div>
                      <dt>Name on the account</dt>
                      <dd>{holder}</dd>
                    </div>
                  ) : null}
                </dl>
                <Button type="button" variant="outline" onClick={startAnother}>
                  Create another ABHA
                </Button>
                <p className="quickstart__hint">
                  Starts again at step 2 with a new Aadhaar number. The access token from
                  step 1 is kept, so you do not sign in twice.
                </p>
              </div>
            ) : (
              <form className="quickstart__form" onSubmit={runEnrol}>
                <p className="quickstart__held">
                  {txnId
                    ? `Transaction ${txnId}, with the code and mobile number from step 3.`
                    : 'Request an OTP on step 3 first. This call needs the transaction id that comes back with it.'}
                </p>
                <Button
                  type="submit"
                  disabled={busy !== '' || !txnId || !otpReady || !mobileReady}>
                  {busy === 'enrol' ? (
                    <Loader2 className="quickstart__spin size-4" aria-hidden="true" />
                  ) : null}
                  Create ABHA
                </Button>
              </form>
            )}
            {log.enrol && !abhaNumber && log.enrol.status === 200 ? (
              <p className="quickstart__held">
                The call succeeded, but no ABHA number came back in the body. Read what
                did arrive in the response below.
              </p>
            ) : null}
          </StepCard>
        </div>
      </div>

      <ExchangeLog log={log} loginId={loginId} />

      {toast ? (
        <p className="quickstart__toast" role="alert">
          {toast.text}
        </p>
      ) : null}
    </div>
  );
}
