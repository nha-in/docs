import React, {useCallback, useEffect, useRef, useState} from 'react';

const KEY = 'abdm.sidebarWidth';
const MIN = 200;
const MAX = 480;
const STEP = 16;

function apply(width: number) {
  document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
}

/**
 * The line down the sidebar's right edge. It sits quiet until the pointer is
 * near it, then takes a drag and resizes the tree. The width is remembered, so
 * a reader who widens it for a deep path keeps it on the next page.
 *
 * Keyboard reachable: focus it and use the arrow keys, Home for the default.
 */
export default function SidebarResizer(): React.ReactNode {
  const [dragging, setDragging] = useState(false);
  const width = useRef(0);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(KEY));
    if (stored >= MIN && stored <= MAX) {
      width.current = stored;
      apply(stored);
    }
  }, []);

  const set = useCallback((next: number) => {
    const clamped = Math.min(MAX, Math.max(MIN, Math.round(next)));
    width.current = clamped;
    apply(clamped);
    window.localStorage.setItem(KEY, String(clamped));
  }, []);

  useEffect(() => {
    if (!dragging) {
      return undefined;
    }
    const move = (event: PointerEvent) => set(event.clientX);
    const stop = () => setDragging(false);
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', stop);
    // A drag over the article would otherwise select its text.
    document.body.classList.add('is-resizing-sidebar');
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', stop);
      document.body.classList.remove('is-resizing-sidebar');
    };
  }, [dragging, set]);

  const current = () =>
    width.current ||
    document.querySelector('.theme-doc-sidebar-container')?.getBoundingClientRect()
      .width ||
    256;

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize the sidebar"
      tabIndex={0}
      className={dragging ? 'sidebar-resizer sidebar-resizer--active' : 'sidebar-resizer'}
      onPointerDown={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDoubleClick={() => set(256)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          set(current() - STEP);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          set(current() + STEP);
        } else if (event.key === 'Home') {
          event.preventDefault();
          set(256);
        }
      }}>
      <span className="sidebar-resizer__grip" aria-hidden="true" />
    </div>
  );
}
