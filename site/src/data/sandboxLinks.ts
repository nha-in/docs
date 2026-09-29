// Every sandbox-app deep link on the site lives here and nowhere else.
// The sandbox integration, when it lands, changes these values in one
// place. Every entry resolves to sbxai.abdm.gov.in, the sandbox front
// door NHA names for registration, credentials and callback setup. Do not inline sandbox URLs in
// pages, and do not label a link with a destination it does not reach.
const BASE = 'https://sbxai.abdm.gov.in';

export const sandboxLinks = {
  // The generic "go to the sandbox" link used by chrome elements (the top
  // bar's sandbox mark and overflow menu) that are not pointing at any one
  // action, just the sandbox site itself.
  home: BASE,
  register: BASE, // registration starts on the sandbox home
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
