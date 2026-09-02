// Round-trips both paddings through Node's private-key decryption, so the
// browser encryption is proven to produce what an ABDM server would decrypt.
// The OAEP-SHA-1 path is additionally proven live against the sandbox: an
// encrypted mobile number was accepted by the login OTP endpoint, which only
// succeeds if the server decrypted it. This test is the offline regression net.
//
// Run: node --test site/src/components/api/rsa.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {readFileSync} from 'node:fs';
import esbuild from 'esbuild';

// Compile the TypeScript module to JS with esbuild (a repo dependency) and
// import it, so the test runs the real source rather than a regex approximation.
const ts = readFileSync(new URL('./rsa.ts', import.meta.url), 'utf8');
const {code} = await esbuild.transform(ts, {loader: 'ts', format: 'esm'});
const mod = await import(`data:text/javascript,${encodeURIComponent(code)}`);

const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {modulusLength: 2048});
const spkiDer = publicKey.export({type: 'spki', format: 'der'});
const pubB64 = Buffer.from(spkiDer).toString('base64');

test('OAEP SHA-1 round-trips through private decryption', async () => {
  const enc = await mod.encryptValue(pubB64, 'oaep-sha1', '9876543210');
  const plain = crypto.privateDecrypt(
    {key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha1'},
    Buffer.from(enc, 'base64'),
  );
  assert.equal(plain.toString(), '9876543210');
});

test('PKCS#1 v1.5 round-trips through private decryption', async () => {
  const enc = await mod.encryptValue(pubB64, 'pkcs1v15', 'test-aadhaar-123');
  const plain = crypto.privateDecrypt(
    {key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING},
    Buffer.from(enc, 'base64'),
  );
  assert.equal(plain.toString(), 'test-aadhaar-123');
});

test('PEM armour is accepted as well as bare base64 DER', async () => {
  const pem = publicKey.export({type: 'spki', format: 'pem'});
  const enc = await mod.encryptValue(pem, 'oaep-sha1', 'abc');
  const plain = crypto.privateDecrypt(
    {key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha1'},
    Buffer.from(enc, 'base64'),
  );
  assert.equal(plain.toString(), 'abc');
});

test('the algorithm string maps to the right padding', () => {
  assert.equal(mod.paddingFromAlgorithm('RSA/ECB/OAEPWithSHA-1AndMGF1Padding'), 'oaep-sha1');
  assert.equal(mod.paddingFromAlgorithm('RSA/ECB/PKCS1Padding'), 'pkcs1v15');
  assert.equal(mod.paddingFromAlgorithm(undefined), 'oaep-sha1');
});
