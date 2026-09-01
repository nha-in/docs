// Every sandbox-app deep link on the site lives here and nowhere else.
// The sandbox integration, when it lands, changes these values in one
// place. Until then each entry points at the closest real page on
// sandbox.abdm.gov.in, so every link works today and gets more precise
// later. Do not inline sandbox URLs in pages.
const BASE = 'https://sandbox.abdm.gov.in';

export const sandboxLinks = {
  register: `${BASE}/sandbox/v3/sandbox-registration`, // ABDM sandbox request form
  // TODO(sandbox-integration): point at the credentials view in the logged-in
  // integrator dashboard once a durable path is confirmed (client id and
  // secret, issued post-approval, only appear after login).
  credentials: `${BASE}/`,
  // TODO(sandbox-integration): point at the bridge callback URL registration
  // screen in the logged-in integrator dashboard once a durable path is
  // confirmed.
  callbackUrl: `${BASE}/`,
  // TODO(sandbox-integration): point at the request and callback log view in
  // the logged-in integrator dashboard once a durable path is confirmed.
  requestLogs: `${BASE}/`,
  // TODO(sandbox-integration): point at the functional test case submission
  // screen in the logged-in integrator dashboard once a durable path is
  // confirmed.
  milestoneTests: `${BASE}/`,
} as const;

export type SandboxActionName = keyof typeof sandboxLinks;
