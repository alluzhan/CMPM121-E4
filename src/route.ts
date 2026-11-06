import { WIDTH } from "./actors.ts";

export type EnemyKind = "drone" | "dart" | "turret" | "lancer";
export type Layout = "line" | "vee" | "column" | "pincer";

export interface EnemyStats {
  hp: number;
  score: number;
  radius: number;
  dropChance: number;
  canShoot: boolean;
}

export const ENEMIES: Record<EnemyKind, EnemyStats> = {
  drone: { hp: 2, score: 100, radius: 13, dropChance: 0.015, canShoot: true },
  dart: { hp: 1, score: 150, radius: 12, dropChance: 0.015, canShoot: false },
  turret: { hp: 12, score: 400, radius: 19, dropChance: 0.3, canShoot: true },
  lancer: { hp: 4, score: 250, radius: 15, dropChance: 0.06, canShoot: true },
};

export interface Wave {
  kind: EnemyKind;
  count: number;
  at: number;
  formation: Layout;
  x?: number;
}

export interface Sector {
  name: string;
  subtitle: string;
  minTicks: number;
  waves: Wave[];
}

export const TICKS = 240;

export const BOSS_NAME = "The Warden";

export const SECTORS: Sector[] = [
  {
    name: "Outer Drift",
    subtitle: "Scouts ahead",
    minTicks: 1560,
    waves: [
      { kind: "drone", count: 4, at: 60, formation: "line" },
      { kind: "drone", count: 5, at: 360, formation: "vee", x: 168 },
      { kind: "drone", count: 5, at: 660, formation: "vee", x: 312 },
      { kind: "drone", count: 6, at: 960, formation: "line" },
      { kind: "drone", count: 4, at: 1200, formation: "column", x: 120 },
      { kind: "drone", count: 4, at: 1260, formation: "column", x: 360 },
    ],
  },
  {
    name: "Shatter Belt",
    subtitle: "Divers incoming",
    minTicks: 1800,
    waves: [
      { kind: "drone", count: 6, at: 60, formation: "vee" },
      { kind: "dart", count: 4, at: 300, formation: "line" },
      { kind: "dart", count: 5, at: 600, formation: "column", x: 144 },
      { kind: "dart", count: 5, at: 720, formation: "column", x: 336 },
      { kind: "drone", count: 7, at: 1020, formation: "line" },
      { kind: "dart", count: 5, at: 1140, formation: "vee" },
      { kind: "dart", count: 6, at: 1440, formation: "line" },
    ],
  },
  {
    name: "Gun Lanes",
    subtitle: "Turrets online",
    minTicks: 1920,
    waves: [
      { kind: "turret", count: 1, at: 60, formation: "line" },
      { kind: "drone", count: 6, at: 240, formation: "vee" },
      { kind: "turret", count: 2, at: 540, formation: "line" },
      { kind: "dart", count: 6, at: 840, formation: "column", x: 240 },
      { kind: "turret", count: 2, at: 1080, formation: "line" },
      { kind: "drone", count: 6, at: 1140, formation: "line" },
      { kind: "turret", count: 3, at: 1500, formation: "line" },
    ],
  },
  {
    name: "Lancer Gate",
    subtitle: "Crossfire",
    minTicks: 1920,
    waves: [
      { kind: "lancer", count: 4, at: 60, formation: "pincer" },
      { kind: "dart", count: 6, at: 360, formation: "vee" },
      { kind: "lancer", count: 6, at: 600, formation: "pincer" },
      { kind: "turret", count: 2, at: 780, formation: "line" },
      { kind: "lancer", count: 6, at: 1140, formation: "pincer" },
      { kind: "drone", count: 8, at: 1260, formation: "vee" },
      { kind: "dart", count: 8, at: 1560, formation: "line" },
    ],
  },
  {
    name: "Last Approach",
    subtitle: "Everything they have",
    minTicks: 2040,
    waves: [
      { kind: "turret", count: 3, at: 60, formation: "line" },
      { kind: "lancer", count: 6, at: 180, formation: "pincer" },
      { kind: "dart", count: 6, at: 540, formation: "column", x: 120 },
      { kind: "dart", count: 6, at: 540, formation: "column", x: 360 },
      { kind: "drone", count: 9, at: 900, formation: "vee" },
      { kind: "turret", count: 2, at: 1020, formation: "line" },
      { kind: "lancer", count: 8, at: 1320, formation: "pincer" },
      { kind: "dart", count: 8, at: 1560, formation: "vee" },
    ],
  },
];

export const ROUTE_NAMES: string[] = [
  ...SECTORS.map((sector) => sector.name),
  BOSS_NAME,
];

export interface Spawn {
  delay: number;
  x: number;
  y: number;
}

export function spawnSpot(wave: Wave, i: number): Spawn {
  const mid = (wave.count - 1) / 2;
  const centre = wave.x ?? WIDTH / 2;
  switch (wave.formation) {
    case "line":
      return { delay: 0, x: centre + (i - mid) * 64, y: -30 };
    case "vee":
      return {
        delay: Math.abs(i - mid) * 10,
        x: centre + (i - mid) * 44,
        y: -30,
      };
    case "column":
      return { delay: i * 24, x: centre, y: -30 };
    case "pincer":
      return {
        delay: Math.floor(i / 2) * 30,
        x: i % 2 === 0 ? -30 : WIDTH + 30,
        y: 70 + Math.floor(i / 2) * 50,
      };
  }
}
