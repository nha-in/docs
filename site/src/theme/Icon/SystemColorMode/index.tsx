import React from 'react';
import {Laptop} from 'lucide-react';

/**
 * A laptop, not the theme's half-filled circle. System mode means "whatever
 * this machine is set to", and a machine is the thing that says that; a
 * bisected sun reads as a third colour scheme rather than as deference to
 * the device.
 *
 * See Icon/LightMode for why these three are swizzled.
 */
export default function IconSystemColorMode(
  props: React.ComponentProps<'svg'>,
): React.ReactNode {
  return <Laptop strokeWidth={1.5} {...props} />;
}
