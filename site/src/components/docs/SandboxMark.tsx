import React from 'react';

/**
 * The sandbox: an open isometric tray with a code caret sitting in it, drawn
 * here rather than taken from an icon set because no set carries this shape.
 * The same mark the top bar uses, so a sandbox action anywhere on the site is
 * recognisable as the same destination.
 */
export default function SandboxMark(): React.ReactNode {
  return (
    <svg
      viewBox="1 1.8 22 16"
      width="18"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      {/* the open top, the two walls, then the caret on the floor */}
      <path d="M12 2.2 22.4 8.2 12 14.2 1.6 8.2Z" />
      <path d="M1.6 8.2v3.1L12 17.3l10.4-6V8.2" />
      <path d="M9.2 6.4 6.4 8.2l2.8 1.8M14.8 6.4l2.8 1.8-2.8 1.8M13.4 5.3l-2.8 6" />
    </svg>
  );
}
