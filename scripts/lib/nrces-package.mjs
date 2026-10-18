// The pinned NRCeS FHIR implementation guide package, ndhm.in, read straight
// from the .tgz that catalogue/openapi/nrces/PINNED names. The hash is checked
// before anything is read, so a package that drifted from the pin never feeds
// the site. No tar dependency: a .tgz is gzip around ustar, and ustar is a
// 512 byte header per file followed by the file padded to 512.

import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {join} from 'node:path';

/** Every regular file in a ustar archive, keyed by its path. */
export function readTar(buf) {
  const files = new Map();
  let at = 0;
  while (at + 512 <= buf.length) {
    const header = buf.subarray(at, at + 512);
    if (header.every((byte) => byte === 0)) break;
    const field = (start, length) => {
      const raw = header.subarray(start, start + length);
      const end = raw.indexOf(0);
      return raw.subarray(0, end === -1 ? length : end).toString('utf8');
    };
    const name = field(0, 100);
    const prefix = field(345, 155);
    const size = parseInt(field(124, 12).trim() || '0', 8);
    const type = field(156, 1);
    const start = at + 512;
    if (type === '0' || type === '') {
      files.set(prefix ? `${prefix}/${name}` : name, Buffer.from(buf.subarray(start, start + size)));
    }
    at = start + Math.ceil(size / 512) * 512;
  }
  return files;
}

/** The pinned package's version and files, after checking its sha256. */
export function loadPinnedPackage(root) {
  const pinned = Object.fromEntries(
    readFileSync(join(root, 'catalogue/openapi/nrces/PINNED'), 'utf8')
      .split('\n')
      .map((line) => line.match(/^([a-z0-9]+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.trim()]),
  );
  const tgz = readFileSync(join(root, pinned.file));
  const hash = createHash('sha256').update(tgz).digest('hex');
  if (hash !== pinned.sha256) {
    throw new Error(`nrces package hash mismatch: ${pinned.file} is ${hash}, PINNED says ${pinned.sha256}`);
  }
  return {version: pinned.version, files: readTar(gunzipSync(tgz))};
}
