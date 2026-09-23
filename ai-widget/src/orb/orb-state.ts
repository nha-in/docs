/**
 * The orb's states and the arithmetic behind them, from the Plasma Orb
 * component (Apache-2.0, built on @paper-design/shaders). Trimmed to what the
 * orb itself uses: the panel has no voice input, so the audio helpers that
 * came with it are not here.
 */
import type {JSX} from 'preact';

export type OrbState =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'error'
  | 'disabled';

export interface OrbProps {
  state?: OrbState;
  size?: number;
  speed?: number;
  colorFrom?: string;
  colorTo?: string;
  /** Five stops for the mesh, in place of the pair spread from colorFrom and colorTo. */
  colors?: string[];
  /** How the mesh moves at rest, in place of the component's gentle default. */
  idleMotion?: {distortion: number; swirl: number};
  /** The mesh's zoom: lower shows more of the gradient inside the sphere. */
  meshScale?: number;
  /** False drops the glossy highlight and shade drawn over the sphere. */
  gloss?: boolean;
  /** 0..1 live amplitude; negative means none, and the orb animates itself. */
  levelRef?: {current: number};
  label?: string;
  className?: string;
}

export const ERROR_COLOR_FROM = '#fb7185';
export const ERROR_COLOR_TO = '#f43f5e';

export const hexToRgb = (hex: string): [number, number, number] => {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const stateEnergy = (state: OrbState, t: number): number => {
  switch (state) {
    case 'listening':
      return 0.4 + 0.32 * Math.abs(Math.sin(t * 8.5)) + 0.18 * Math.abs(Math.sin(t * 4.1 + 1.5));
    case 'speaking':
      return 0.3 + 0.24 * Math.abs(Math.sin(t * 6.2)) + 0.16 * Math.abs(Math.sin(t * 3 + 0.6));
    case 'thinking':
      return 0.24 + 0.2 * Math.abs(Math.sin(t * 2.4));
    case 'connecting':
      return 0.12 + 0.1 * Math.abs(Math.sin(t * 1.6));
    case 'error':
      return 0.2;
    default:
      return 0;
  }
};

export const approach = (current: number, target: number, rate: number, dt: number): number =>
  current + (target - current) * (1 - Math.exp(-rate * dt));

export const orbVars = ({
  size,
  speed,
  colorFrom,
  colorTo,
}: Pick<OrbProps, 'size' | 'speed' | 'colorFrom' | 'colorTo'>): JSX.CSSProperties => {
  const vars: Record<string, string> = {};
  if (size != null) vars['--orb-size'] = `${size}px`;
  if (speed != null) vars['--orb-speed'] = `${speed}`;
  if (colorFrom) vars['--orb-color-from'] = colorFrom;
  if (colorTo) vars['--orb-color-to'] = colorTo;
  return vars as JSX.CSSProperties;
};
