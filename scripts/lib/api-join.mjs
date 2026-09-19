// Joining a call NHA names in a certification sheet to the operation this
// portal publishes for it.
//
// The two write the same call differently. A sheet writes a whole URL,
// `https://dev.abdm.gov.in/hiecm/api/v3/consent/request/hip/on-notify`. A
// specification writes a server plus a path, `https://dev.abdm.gov.in/api`
// plus `/hiecm/consent/v3/request/hip/on-notify`. Same call, different
// segment order, and comparing the strings finds barely half of them.
//
// What identifies an operation is the segments that are not routing. Drop
// `api`, `abha`, `gateway`, `hiecm` and every version segment from both sides
// and what is left matches. The host is kept beside the key rather than inside
// it, because two specifications can publish the same path on different hosts
// and only the host tells them apart.

/** Segments that route rather than identify. */
const NOISE = new Set([
  '', 'api', 'apis', 'abha', 'gateway', 'hiecm',
  'v1', 'v1.5', 'v2', 'v3', 'v0.5',
]);

// One typo in NHA's own sheet, corrected here rather than worked around
// silently. The M1 sheet writes `/abha/api/v3enrollment/auth/byAbdm` with the
// slash missing. It is the only call in five sheets that fails to join for a
// reason other than "M4 has no specification here".
const TYPOS = [[/\/v3enrollment\//, '/v3/enrollment/']];

/** A URL or a path reduced to the segments that identify the operation. */
export function joinKey(url) {
  let path = String(url)
    .replace(/^https?:\/\/[^/]+/, '')
    .split('?')[0]
    .split('#')[0];
  for (const [wrong, right] of TYPOS) path = path.replace(wrong, right);
  return path
    .split('/')
    .map((part) => part.toLowerCase())
    .filter((part) => !NOISE.has(part))
    .join('/');
}

/** The host a sheet names, lowercased. Empty for a path with no host. */
export function hostOf(url) {
  const match = /^https?:\/\/([^/]+)/.exec(String(url));
  return match ? match[1].toLowerCase() : '';
}
