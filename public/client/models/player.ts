import { Collider } from './collider';

export interface Player {
  active: boolean;
  bot: boolean;
  colliders: Collider[];
  frozen: boolean;
  health: number;
  height: number;
  id: number | string;
  items: {
    sword: 0 | 1;
    helm: 0 | 1;
    armor: 0 | 1;
  };
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
