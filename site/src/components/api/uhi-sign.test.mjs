// UHI request signing, as the Try It panel does it in the browser, checked
// against Node's own crypto (OpenSSL's BLAKE2b-512 and Ed25519), which shares
// no code with the @noble libraries the panel uses.
//
// The recipe is the UHI Gateway's (NHA-ABDM/UHI, src/gateway/Discovery, the
// sandbox branch) and the Header Generation Utility's:
//   digest   = base64(BLAKE2b-512(body))
//   signing  = "(created): C (expires): E digest: BLAKE-512=" + digest
//   signed   = Ed25519(base64(BLAKE2b-512(signing)))
//   header   = JSON {keyId, algorithm, created, expires, headers, signature}
//
// Run: node --test site/src/components/api/uhi-sign.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash, generateKeyPairSync, createPublicKey, verify} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import esbuild from 'esbuild';

const bundled = await esbuild.build({
  entryPoints: [fileURLToPath(new URL('./uhi-sign.ts', import.meta.url))],
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  write: false,
  logLevel: 'error',
});
const {uhiAuthorization, signingString, bodyDigest, ed25519Seed} = await import(
  `data:text/javascript,${encodeURIComponent(bundled.outputFiles[0].text)}`
);

const b64blake = (text) => createHash('blake2b512').update(Buffer.from(text, 'utf8')).digest('base64');
const {publicKey, privateKey} = generateKeyPairSync('ed25519');
const pkcs8 = privateKey.export({type: 'pkcs8', format: 'der'}).toString('base64');
const body = '{"context":{"domain":"nic2004:85112","action":"search"},"message":{"intent":{}}}';
const now = Date.UTC(2026, 8, 29, 10, 0, 0);

test('the digest is BLAKE2b-512 of the exact body bytes, in base64', () => {
  assert.equal(bodyDigest(body), b64blake(body));
  assert.equal(bodyDigest('{"name":"Ā"}'), b64blake('{"name":"Ā"}'));
});

test('the signing string joins created, expires and digest with spaces, as the Gateway builds it', () => {
  assert.equal(signingString(100, 110, body), `(created): 100 (expires): 110 digest: BLAKE-512=${b64blake(body)}`);
});

test('a PKCS#8 key signs a header the Gateway recipe verifies', () => {
  const header = JSON.parse(uhiAuthorization({body, subscriberId: 'eua-test', keyId: 'k1', privateKey: pkcs8, now}));
  assert.equal(header.keyId, 'eua-test|k1|ed25519');
  assert.equal(header.algorithm, 'ed25519');
  assert.equal(header.headers, '(created) (expires) digest');
  assert.equal(header.created, String(now / 1000));
  assert.equal(Number(header.expires), Number(header.created) + 10);
  const signed = b64blake(`(created): ${header.created} (expires): ${header.expires} digest: BLAKE-512=${b64blake(body)}`);
  assert.equal(verify(null, Buffer.from(signed, 'utf8'), publicKey, Buffer.from(header.signature, 'base64')), true);
});

test('a changed body no longer verifies', () => {
  const header = JSON.parse(uhiAuthorization({body, subscriberId: 's', keyId: 'k', privateKey: pkcs8, now}));
  const signed = b64blake(`(created): ${header.created} (expires): ${header.expires} digest: BLAKE-512=${b64blake(body + ' ')}`);
  assert.equal(verify(null, Buffer.from(signed, 'utf8'), publicKey, Buffer.from(header.signature, 'base64')), false);
});

test('the key forms NHA publishes all sign alike: PKCS#8, a libsodium secret key, a bare seed', () => {
  const seed = Buffer.from(ed25519Seed(pkcs8));
  const raw = publicKey.export({type: 'spki', format: 'der'}).subarray(-32);
  const sodium = Buffer.concat([seed, raw]).toString('base64');
  const sign = (key) => JSON.parse(uhiAuthorization({body, subscriberId: 's', keyId: 'k', privateKey: key, now})).signature;
  assert.equal(sign(sodium), sign(pkcs8));
  assert.equal(sign(seed.toString('base64')), sign(pkcs8));
});

test('the key pair in the Gateway\'s Crypt.java parses to its own public key', () => {
  // A PKCS#8 v2 key carrying its public key, and the X.509 public key beside it.
  const prkey = 'MFECAQEwBQYDK2VwBCIEIGRr3EPF4DCJ8FBKHP5jpO0mbtnyXAFC7WL4LYusZHCygSEAQCWv0rw/WPtm3xLcXChk0/Px8yNK9l2AcyoQWXbHsD8=';
  const pubkey = 'MCowBQYDK2VwAyEAQCWv0rw/WPtm3xLcXChk0/Px8yNK9l2AcyoQWXbHsD8=';
  const header = JSON.parse(uhiAuthorization({body, subscriberId: 'eua-nha', keyId: 'pk23777', privateKey: prkey, now}));
  const key = createPublicKey({key: Buffer.from(pubkey, 'base64'), format: 'der', type: 'spki'});
  const signed = b64blake(`(created): ${header.created} (expires): ${header.expires} digest: BLAKE-512=${b64blake(body)}`);
  assert.equal(verify(null, Buffer.from(signed, 'utf8'), key, Buffer.from(header.signature, 'base64')), true);
});

test('a value that is not an Ed25519 private key is refused with a reason', () => {
  assert.throws(() => ed25519Seed('not a key'), /private key/);
  assert.throws(() => ed25519Seed(Buffer.alloc(40).toString('base64')), /private key/);
});
