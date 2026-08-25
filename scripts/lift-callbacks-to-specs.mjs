// One time lift: writes the callbacks documented in prose into the
// specifications as OpenAPI 3.1 `webhooks`, which is where CONVENTIONS.md says
// ABDM callbacks belong.
//
// Sources are named per entry. Nothing here has been run against the sandbox,
// so every operation carries that in its description rather than implying the
// shape is confirmed.
import {readFileSync, writeFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const UNVERIFIED =
  'Transcribed from NHA\'s milestone document. Not run against the ABDM sandbox, so the payload is unconfirmed.';

const CALLBACKS = {
  'hiecm-m3.yaml': [
    {
      path: '/api/v3/hiu/consent/request/on-init',
      id: 'm3_on_consent_request_init',
      summary: 'The consent request was accepted, with its request id',
      description:
        'Carries the consent request and the request id. Store the request id: it is how a later notification is tied back to the request you made.',
    },
    {
      path: '/api/v3/hiu/consent/request/notify',
      id: 'm3_on_consent_request_notify_hiu',
      summary: "The patient's decision, sent to the requester",
      description:
        'On a grant, carries every consent artefact id created against the request, with the request id. On a denial, carries the denial.',
    },
    {
      path: '/api/v3/consent/request/hip/notify',
      id: 'm3_on_consent_request_notify_hip',
      summary: "The patient's decision, sent to the record holder",
      description:
        'The same decision sent to the system that holds the records, with all care context references.',
    },
    {
      path: '/api/v3/hiu/consent/on-fetch',
      id: 'm3_on_consent_fetch',
      summary: 'The consent artefact detail, fetched by artefact id',
      description: 'The artefact itself, in answer to a fetch by artefact id.',
    },
    {
      path: '/api/v3/hiu/health-information/on-request',
      id: 'm3_on_health_information_request',
      summary: 'Acknowledgement of a health information request',
      description:
        'Carries the transaction id, the request id and the current status. This is an acknowledgement, not the records. The records arrive at the data push URL you supplied.',
    },
  ],
  'hiecm-m2.yaml': [
    {
      path: '/v0.5/care-contexts/discover',
      id: 'm2_on_discovery_request',
      summary: 'A discovery request for a patient you may hold records for',
      description:
        'Inbound to every HIP. Answer with care context metadata only: NHA states that a discovery response carries no clinical or sensitive data. A rejected answer is reported as ABDM-1109.',
    },
    {
      path: '/v0.5/links/link/init',
      id: 'm2_on_link_init',
      summary: 'A request to start linking a care context',
      description:
        'Inbound to the HIP. A duplicate arrives as ABDM-1104, and a rejected answer as ABDM-1110.',
    },
    {
      path: '/v0.5/links/link/confirm',
      id: 'm2_on_link_confirm',
      summary: 'Confirmation of a link, carrying the token the patient approved',
      description:
        'Inbound to the HIP. A duplicate arrives as ABDM-1105, and a rejected answer as ABDM-1111.',
    },
    {
      path: '/v0.5/health-information/hip/request',
      id: 'm2_on_health_information_request',
      summary: 'A request for the records a consent covers',
      description:
        'Inbound to the HIP, carrying the consent id, the date range, the data push URL and the encryption parameters. NHA states 20 minutes from this request to the data push.',
    },
    {
      path: '/v0.5/consents/hiu/notify',
      id: 'm2_on_consent_notify_hiu',
      summary: 'A consent notification to an HIU bridge',
      description: 'Inbound to the HIU bridge, at the bridge URL you registered.',
    },
  ],
};

const quote = (value) => JSON.stringify(String(value));

for (const [file, hooks] of Object.entries(CALLBACKS)) {
  const path = join(root, 'catalogue', 'openapi', file);
  let text = readFileSync(path, 'utf8');
  if (/\nwebhooks:\s*\n\s+\S/.test(text)) {
    console.log(`${file}: webhooks already populated, left alone`);
    continue;
  }

  const lines = [
    "# Callbacks NHA makes to your bridge. Transcribed from NHA's milestone",
    '# document; none has been observed against the sandbox.',
    'webhooks:',
  ];
  for (const hook of hooks) {
    lines.push(`  ${hook.path}:`);
    lines.push('    post:');
    lines.push(`      operationId: ${hook.id}`);
    lines.push(`      summary: ${quote(hook.summary)}`);
    lines.push('      description: |');
    lines.push(`        ${hook.description}`);
    lines.push('');
    lines.push(`        ${UNVERIFIED}`);
    lines.push('      responses:');
    lines.push("        '202':");
    lines.push(
      `          description: ${quote(
        'Your bridge accepted the callback. NHA validates the body you send back, so a 202 carrying the wrong body is still a failure.',
      )}`,
    );
  }

  // The specs ship `webhooks: {}` as a placeholder; replace it in place so the
  // key keeps its position in the file.
  text = text.replace(/^webhooks: \{\}$/m, lines.join('\n'));
  writeFileSync(path, text);
  console.log(`${file}: wrote ${hooks.length} webhook(s)`);
}
