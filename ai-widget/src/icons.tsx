/**
 * The marks the panel uses, inlined from Lucide (ISC) rather than
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

export const Clock = () => (
  <svg {...base} width="14" height="14">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
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

export const Paperclip = () => (
  <svg {...base} width="16" height="16">
    <path d="M13.234 20.252 21 12.3" />
    <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486" />
  </svg>
);

export const Plus = () => (
  <svg {...base} width="16" height="16">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export const FileText = () => (
  <svg {...base} width="14" height="14">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

export const Upload = () => (
  <svg {...base} width="14" height="14">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m17 8-5-5-5 5" />
    <path d="M12 3v12" />
  </svg>
);

export const Search = () => (
  <svg {...base} width="14" height="14">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const Trash = () => (
  <svg {...base} width="14" height="14">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const ChevronLeft = () => (
  <svg {...base} width="14" height="14">
    <path d="m15 18-6-6 6-6" />
  </svg>
);
