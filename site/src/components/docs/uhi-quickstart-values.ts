/**
 * The pure half of the UHI quickstart: the search body, the curl around it,
 * and the check on the callback. No network, no window, so it runs under
 * node:test as well as in the page. Run:
 * node --test site/src/components/docs/uhi-quickstart-values.test.mjs
 */

export const SANDBOX_SEARCH = 'https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/search';

export type SearchInputs = {
  subscriberId: string;
  consumerUri: string;
  latitude: string;
  longitude: string;
  radiusKm: string;
  /** One UUID, used as both message_id and transaction_id, as the guide's sample does. */
  uuid: string;
  /** ISO 8601 UTC, the context timestamp. */
  timestamp: string;
  /** YYYY-MM-DD, the day the time window covers. */
  today: string;
};

/** Local calendar date as YYYY-MM-DD. */
export function localDate(now: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** What is wrong with the inputs, in the order a reader fills them, or ''. */
export function whatIsWrong(inputs: Omit<SearchInputs, 'uuid' | 'timestamp' | 'today'>): string {
  if (!inputs.subscriberId.trim()) return 'Enter the subscriber ID your sandbox registration gave you.';
  if (!/^https:\/\/\S+$/.test(inputs.consumerUri.trim()))
    return 'consumer_uri is your public HTTPS callback base URL, starting https://.';
  const lat = Number(inputs.latitude);
  const lon = Number(inputs.longitude);
  if (!inputs.latitude.trim() || !Number.isFinite(lat) || lat < -90 || lat > 90)
    return 'Latitude is a number from -90 to 90.';
  if (!inputs.longitude.trim() || !Number.isFinite(lon) || lon < -180 || lon > 180)
    return 'Longitude is a number from -180 to 180.';
  const radius = Number(inputs.radiusKm);
  if (!inputs.radiusKm.trim() || !Number.isFinite(radius) || radius <= 0)
    return 'The radius is a number of kilometres above 0.';
  return '';
}

/**
 * The PM-JAY HEM GPS search from the guide's quick start, field for field and
 * in the same order, as one line of JSON. One line because this exact string
 * is what gets signed and sent: a pretty printed copy picks up a trailing
 * newline or a reindent on the way, and the digest no longer matches.
 */
export function searchBody(i: SearchInputs): string {
  return JSON.stringify({
    context: {
      domain: 'nic2004:85112',
      country: 'IND',
      city: 'std:011',
      action: 'search',
      core_version: '0.7.1',
      consumer_id: i.subscriberId.trim(),
      consumer_uri: i.consumerUri.trim(),
      message_id: i.uuid,
      transaction_id: i.uuid,
      timestamp: i.timestamp,
    },
    message: {
      intent: {
        fulfillment: {
          type: 'PMJAYHEM',
          start: {time: {timestamp: `${i.today}T00:00:00`}},
          end: {time: {timestamp: `${i.today}T23:59:59`}},
        },
        item: {descriptor: {code: 'PMJAY', name: 'PMJAY', flag: false}},
        location: {
          gps: `${i.latitude.trim()},${i.longitude.trim()}`,
          radius: {type: 'CONSTANT', value: i.radiusKm.trim(), unit: 'km'},
        },
      },
    },
  });
}

/** A value pasted with its header name in front, as a terminal prints it, loses the name. */
export function headerValue(pasted: string, name: string): string {
  const value = pasted.trim();
  const prefix = `${name.toLowerCase()}:`;
  return value.toLowerCase().startsWith(prefix) ? value.slice(prefix.length).trim() : value;
}

/** The Digest header value, with the BLAKE-512= prefix whether or not it was pasted. */
export function digestValue(pasted: string): string {
  const value = headerValue(pasted, 'Digest');
  if (!value) return '';
  return /^BLAKE-512=/i.test(value) ? value : `BLAKE-512=${value}`;
}

/** Single quoted for a POSIX shell, so the body and headers reach curl byte for byte. */
export function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/** The curl for step 4. The body is inline so nothing can add a newline to it. */
export function curlCommand(body: string, authorization: string, digest: string): string {
  const auth = headerValue(authorization, 'Authorization') || '<AUTHORIZATION_FROM_THE_HEADER_GENERATION_UTILITY>';
  const dig = digestValue(digest) || 'BLAKE-512=<DIGEST_FROM_THE_HEADER_GENERATION_UTILITY>';
  return [
    `curl -X POST ${SANDBOX_SEARCH} \\`,
    `  -H 'Content-Type: application/json' \\`,
    `  -H ${shellQuote(`Authorization: ${auth}`)} \\`,
    `  -H ${shellQuote(`Digest: ${dig}`)} \\`,
    `  --data-binary ${shellQuote(body)}`,
  ].join('\n');
}

/**
 * The transaction_id in what the reader pasted: a whole on_search body, or
 * the bare id. '' when a body was pasted that carries none.
 */
export function pastedTransactionId(pasted: string): string {
  const text = pasted.trim();
  if (!text.startsWith('{')) return text;
  try {
    const id = JSON.parse(text)?.context?.transaction_id;
    return typeof id === 'string' ? id.trim() : '';
  } catch {
    return '';
  }
}
