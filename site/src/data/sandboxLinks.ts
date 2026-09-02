// Every sandbox-app deep link on the site lives here and nowhere else.
// The sandbox integration, when it lands, changes these values in one
// place. Until then only `register` points at a real page on
// sandbox.abdm.gov.in; every other entry lands behind the sandbox's login
// and resolves to the sandbox root, same as `home`, because that screen
// cannot be linked to directly pre-login. Do not inline sandbox URLs in
// pages, and do not label a link with a destination it does not reach.
const BASE = 'https://sandbox.abdm.gov.in';

export const sandboxLinks = {
  // The generic "go to the sandbox" link used by chrome elements (the top
  // bar's sandbox mark and overflow menu) that are not pointing at any one
  // action, just the sandbox site itself.
  home: BASE,
  register: `${BASE}/sandbox/v3/sandbox-registration`, // ABDM sandbox request form
  // TODO(sandbox-integration): point at the credentials view in the logged-in
  // integrator dashboard once a durable path is confirmed (client id and
  // secret, issued post-approval, only appear after login). Until then,
  // callers must label this action honestly (for example "Open the
  // sandbox"), not as a link to the credentials screen itself.
  credentials: `${BASE}/`,
  // TODO(sandbox-integration): point at the bridge callback URL registration
  // screen in the logged-in integrator dashboard once a durable path is
  // confirmed. Until then, callers must label this action honestly (for
  // example "Open the sandbox"), not as a link to that screen itself.
  callbackUrl: `${BASE}/`,
} as const;

export type SandboxActionName = keyof typeof sandboxLinks;
