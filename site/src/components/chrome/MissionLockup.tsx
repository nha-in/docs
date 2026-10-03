import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * The NHA mark, the ABDM mark and the mission's name, as one lockup, shared by
 * the landing curtain and the docs top bar so it is the same size crossing
 * from one into the other.
 *
 * Plain images with CSS picking light or dark, not ThemedImage: the curtain is
 * mounted by the theme Root, outside the colour mode provider, and anything
 * that reads that context throws there during static rendering.
 */
export default function MissionLockup(): React.ReactNode {
  const nha = useBaseUrl('img/nha-logo.svg');
  const nhaDark = useBaseUrl('img/nha-logo-dark.svg');
  const abdm = useBaseUrl('img/logo.svg');
  const abdmDark = useBaseUrl('img/logo-dark.svg');
  return (
    <span className="mission-lockup">
      <img className="mission-lockup__mark mission-lockup__mark--light" src={nha} alt="National Health Authority" />
      <img className="mission-lockup__mark mission-lockup__mark--dark" src={nhaDark} alt="" />
      <img className="mission-lockup__mark mission-lockup__mark--light" src={abdm} alt="" />
      <img className="mission-lockup__mark mission-lockup__mark--dark" src={abdmDark} alt="" />
      <span className="mission-lockup__text">
        <span>Ayushman Bharat</span>
        <span>Digital Mission</span>
        <span className="mission-lockup__tagline">Building Digital Health Ecosystem</span>
      </span>
    </span>
  );
}
