import { Collider } from './collider';

export interface Player {
  active: boolean;
  bot: boolean;
  colliders: Collider[];
  frozen: boolean;
  health: number;
  height: number;
  id: number | string;
  items: unknown;
  level: number;
  mouseAngleDegrees: number;
  powerups: unknown;
  skin: number;
  speed: number;
  username: string;
  width: number;
  x: number;
  xp: number;
  y: number;
}
