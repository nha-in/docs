import React from 'react';
import LandingCurtain from '@site/src/components/landing/LandingCurtain';
import ScrolledFlag from '@site/src/components/chrome/ScrolledFlag';
import AskAiBridge from '@site/src/components/chrome/AskAiBridge';

/**
 * Wraps every page and never unmounts, which is what the curtain needs: it
 * performs the route change it survives.
 */
export default function Root({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <>
      <ScrolledFlag />
      <AskAiBridge />
      <LandingCurtain />
      {children}
    </>
  );
}
