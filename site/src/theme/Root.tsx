import React from 'react';
import ScrollBackHome from '@site/src/components/landing/ScrollBackHome';

/**
 * Wraps every page and never unmounts, which is what the scroll handoff needs:
 * the listener has to survive the route change it causes, and it has to be
 * mounted on the reference page even though nothing on that page knows about
 * the landing page.
 *
 * ScrollBackHome renders nothing and decides for itself whether the current
 * route is one it should listen on.
 */
export default function Root({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <>
      <ScrollBackHome />
      {children}
    </>
  );
}
