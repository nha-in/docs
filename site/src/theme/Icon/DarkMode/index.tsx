import React from 'react';
import {Moon} from 'lucide-react';

/** See Icon/LightMode for why these three are swizzled. */
export default function IconDarkMode(
  props: React.ComponentProps<'svg'>,
): React.ReactNode {
  return <Moon strokeWidth={1.5} {...props} />;
}
