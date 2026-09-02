/**
 * Browser side RSA encryption for the try-it console.
 *
 * ABDM never takes a raw Aadhaar number, mobile number, OTP or password in a
 * request body. Each is RSA encrypted against NHA's public key first, then
 * base64 encoded. The padding is a property of the API family, not a single
 * ABDM scheme: the V3 flows this catalogue documents use RSA OAEP with SHA-1,
 * while the older healthid and NHPR families use PKCS#1 v1.5. The certificate
 * response states its own algorithm in `encryptionAlgorithm`, so a key fetched
 * from the server carries the method with it.
 *
 * This runs in the reader's browser. The plaintext never leaves it: only the
 * ciphertext goes on the wire, which is the whole point of encrypting it.
 */

export type Padding = 'oaep-sha1' | 'pkcs1v15';

/** Map NHA's `encryptionAlgorithm` string to the padding this module speaks. */
export function paddingFromAlgorithm(algorithm: string | undefined): Padding {
  if (!algorithm) return 'oaep-sha1';
  const a = algorithm.toUpperCase();
  if (a.includes('OAEP')) return 'oaep-sha1';
  if (a.includes('PKCS1')) return 'pkcs1v15';
  return 'oaep-sha1';
}

/**
 * Accept a public key as PEM (with or without armour) or as base64 DER, and
 * return the SubjectPublicKeyInfo DER bytes. NHA's certificate endpoint serves
 * base64 DER with no armour; a reader pasting a key may include the armour.
 */
export function derFromKey(input: string): Uint8Array {
  const stripped = input
    .replace(/-----BEGIN[^-]+-----/g, '')
    .replace(/-----END[^-]+-----/g, '')
    .replace(/\s+/g, '');
  const bin = atob(stripped);
  const der = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) der[i] = bin.charCodeAt(i);
  return der;
}

/** A standalone ArrayBuffer view of the bytes, which WebCrypto's typings want. */
function buf(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function base64(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function base64urlToBigInt(b64url: string): bigint {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  let n = 0n;
  for (let i = 0; i < bin.length; i += 1) n = (n << 8n) | BigInt(bin.charCodeAt(i));
  return n;
}

function bigIntToBytes(n: bigint, length: number): Uint8Array {
  const out = new Uint8Array(length);
  for (let i = length - 1; i >= 0; i -= 1) {
    out[i] = Number(n & 0xffn);
    n >>= 8n;
  }
  return out;
}

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  let b = base % mod;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % mod;
    e >>= 1n;
    b = (b * b) % mod;
  }
  return result;
}

/** OAEP with SHA-1 via WebCrypto, which the browser implements natively. */
async function encryptOaepSha1(der: Uint8Array, plaintext: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'spki',
    buf(der),
    {name: 'RSA-OAEP', hash: 'SHA-1'},
    false,
    ['encrypt'],
  );
  const cipher = await crypto.subtle.encrypt(
    {name: 'RSA-OAEP'},
    key,
    buf(new TextEncoder().encode(plaintext)),
  );
  return base64(new Uint8Array(cipher));
}

/**
 * PKCS#1 v1.5 EME. WebCrypto cannot encrypt with this padding, so it is done
 * by hand: read the modulus and exponent from the key, build the padded block
 * (0x00 0x02, then non-zero random padding, then 0x00, then the message), and
 * raise it to the public exponent. The random padding needs the browser's CSPRNG.
 */
async function encryptPkcs1v15(der: Uint8Array, plaintext: string): Promise<string> {
  const jwk = await crypto.subtle.exportKey(
    'jwk',
    await crypto.subtle.importKey(
      'spki',
      buf(der),
      {name: 'RSA-OAEP', hash: 'SHA-1'},
      true,
      ['encrypt'],
    ),
  );
  const n = base64urlToBigInt(jwk.n as string);
  const e = base64urlToBigInt(jwk.e as string);
  const k = Math.ceil(n.toString(16).length / 2);

  const message = new TextEncoder().encode(plaintext);
  if (message.length > k - 11) {
    throw new Error('value is too long for this key');
  }

  // 0x00 || 0x02 || PS || 0x00 || M, where PS is at least 8 non-zero bytes.
  const psLen = k - message.length - 3;
  const ps = new Uint8Array(psLen);
  crypto.getRandomValues(ps);
  for (let i = 0; i < psLen; i += 1) {
    while (ps[i] === 0) ps[i] = crypto.getRandomValues(new Uint8Array(1))[0];
  }
  const block = new Uint8Array(k);
  block[0] = 0x00;
  block[1] = 0x02;
  block.set(ps, 2);
  block[2 + psLen] = 0x00;
  block.set(message, 3 + psLen);

  let m = 0n;
  for (const b of block) m = (m << 8n) | BigInt(b);
  const c = modPow(m, e, n);
  return base64(bigIntToBytes(c, k));
}

/** Encrypt a raw value against a public key, returning base64 ciphertext. */
export async function encryptValue(
  key: string,
  padding: Padding,
  plaintext: string,
): Promise<string> {
  const der = derFromKey(key);
  return padding === 'pkcs1v15'
    ? encryptPkcs1v15(der, plaintext)
    : encryptOaepSha1(der, plaintext);
}
