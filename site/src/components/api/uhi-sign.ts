// Signs a UHI request in the browser, the way the UHI Gateway verifies one.
//
// The recipe is the Gateway's own (NHA-ABDM/UHI, src/gateway/Discovery,
// security/Crypt.java, sandbox branch) and the Header Generation Utility's:
//   digest   = base64(BLAKE2b-512(body))
//   signing  = "(created): C (expires): E digest: BLAKE-512=" + digest
//   signed   = Ed25519 over the text base64(BLAKE2b-512(signing))
//   header   = JSON {keyId, algorithm, created, expires, headers, signature},
//              expires ten seconds after created
//
// The private key is only ever an argument: nothing here stores it.
import {blake2b} from '@noble/hashes/blake2.js';
import {ed25519} from '@noble/curves/ed25519.js';

const utf8 = (text: string) => new TextEncoder().encode(text);

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(text: string): Uint8Array {
  const binary = atob(text.replace(/\s+/g, ''));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

const blake512 = (text: string) => toBase64(blake2b(utf8(text), {dkLen: 64}));

/** base64 of BLAKE2b-512 over the exact body, as the Digest carries it. */
export const bodyDigest = (body: string): string => blake512(body);

/** The string the Gateway hashes and verifies against, spaces and all. */
export const signingString = (created: number, expires: number, body: string): string =>
  `(created): ${created} (expires): ${expires} digest: BLAKE-512=${bodyDigest(body)}`;

// The bytes before the seed in an Ed25519 PKCS#8 key: the version (0 or 1),
// the Ed25519 algorithm identifier, and the octet string that wraps the seed.
const PKCS8_PREFIX = [0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20];
const PKCS8_V2_PREFIX = [0x02, 0x01, 0x01, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20];

/**
 * The 32 byte Ed25519 seed from any of the forms NHA's tools produce: base64
 * PKCS#8 (the Header Generation Utility and the Gateway), a 64 byte libsodium
 * secret key (the Utility's Node version), or the bare seed.
 */
export function ed25519Seed(privateKey: string): Uint8Array {
  let bytes: Uint8Array;
  try {
    bytes = fromBase64(privateKey.trim());
  } catch {
    throw new Error('That is not a base64 Ed25519 private key.');
  }
  if (bytes.length === 32) return bytes;
  if (bytes.length === 64) return bytes.slice(0, 32);
  if (bytes[0] === 0x30) {
    for (const prefix of [PKCS8_PREFIX, PKCS8_V2_PREFIX]) {
      const at = bytes.findIndex((_, i) => prefix.every((b, j) => bytes[i + j] === b));
      if (at >= 0 && at + prefix.length + 32 <= bytes.length) {
        return bytes.slice(at + prefix.length, at + prefix.length + 32);
      }
    }
  }
  throw new Error('That is not an Ed25519 private key: paste the base64 PKCS#8 key the Header Generation Utility gave you.');
}

/** The Authorization header for this exact body, signed now. */
export function uhiAuthorization({
  body,
  subscriberId,
  keyId,
  privateKey,
  now = Date.now(),
}: {
  body: string;
  subscriberId: string;
  keyId: string;
  privateKey: string;
  now?: number;
}): string {
  const created = Math.floor(now / 1000);
  const expires = created + 10;
  const signed = blake512(signingString(created, expires, body));
  const signature = toBase64(ed25519.sign(utf8(signed), ed25519Seed(privateKey)));
  return JSON.stringify({
    keyId: `${subscriberId}|${keyId}|ed25519`,
    algorithm: 'ed25519',
    created: String(created),
    expires: String(expires),
    headers: '(created) (expires) digest',
    signature,
  });
}
