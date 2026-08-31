/**
 * The seven marks the panel uses, inlined from Lucide (ISC) rather than
 * pulled in as a dependency: an icon package in a script that embeds on other
 * people's pages is 1500 icons shipped to draw seven.
 */
const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round' as const,
  'stroke-linejoin': 'round' as const,
  'aria-hidden': 'true',
};

export const ArrowUp = () => (
  <svg {...base} width="16" height="16">
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </svg>
);

export const PenLine = () => (
  <svg {...base} width="14" height="14">
    <path d="M13 21h8" />
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
  </svg>
);

export const Sparkles = () => (
  <svg {...base} width="14" height="14">
    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
    <path d="M20 2v4" />
    <path d="M22 4h-4" />
    <circle cx="4" cy="20" r="2" />
  </svg>
);

export const Square = () => (
  <svg {...base} width="12" height="12">
    <rect width="18" height="18" x="3" y="3" rx="2" />
  </svg>
);

export const Check = () => (
  <svg {...base} width="14" height="14">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const Copy = () => (
  <svg {...base} width="14" height="14">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export const X = () => (
  <svg {...base} width="16" height="16">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
