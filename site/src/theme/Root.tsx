import React from 'react';
import LandingCurtain from '@site/src/components/landing/LandingCurtain';
import PullHome from '@site/src/components/landing/PullHome';
import ScrolledFlag from '@site/src/components/chrome/ScrolledFlag';

/**
 * Wraps every page and never unmounts, which is what both of these need: the
 * curtain performs the route change it survives, and the pull back listens on
 * the references page, which knows nothing about the landing page.
 */
export default function Root({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <>
      <ScrolledFlag />
      <LandingCurtain />
      <PullHome />
      {children}
    </>
  );
}
