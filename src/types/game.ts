export type BaseAnimalColor = 'pink' | 'yellow' | 'blue' | 'mint' | 'lavender';
export type AnimalColor = BaseAnimalColor | 'wild';

export type Difficulty = 'easy' | 'normal' | 'hard';
export type Gender = 'male' | 'female' | 'other';

export type BackgroundTheme =
  | 'garden'
  | 'zoo'
  | 'french'
  | 'beach'
  | 'sky'
  | 'leisurely'
  | 'relaxing';

export type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface Tile {
  id: string;
  color: AnimalColor;
  justSettled?: boolean;
}

export type GridMatrix = (Tile | null)[][];

export interface Coord {
  row: number;
  col: number;
}

export interface FloatingScore {
  id: string;
  row: number;
  col: number;
  points: number;
  combo: number;
  isWild?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  gender: Gender;
  difficulty: Difficulty;
  score: number;
  maxCombo: number;
  clearedCount: number;
  createdAt: string;
}

export interface PlayerProfile {
  name: string;
  gender: Gender;
  difficulty: Difficulty;
  theme: BackgroundTheme;
  bgmEnabled: boolean;
  sfxEnabled: boolean;
}

export const GRID_COLS = 7;
export const GRID_ROWS = 10;
export const INITIAL_ROWS = 3;
export const DANGER_ROW = 0;

export const BASE_COLORS: BaseAnimalColor[] = [
  'pink',
  'yellow',
  'blue',
  'mint',
  'lavender',
];

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    label: string;
    intervalMs: number;
    intervalSec: number;
    stepDecreaseMs: number;
    minIntervalMs: number;
    wildChance: number;
    desc: string;
  }
> = {
  easy: {
    label: '簡單',
    intervalMs: 10000,
    intervalSec: 10,
    stepDecreaseMs: 1000,
    minIntervalMs: 4000,
    wildChance: 0.02,
    desc: '每 10 秒推升一排（每 30 秒加速）',
  },
  normal: {
    label: '正常',
    intervalMs: 5000,
    intervalSec: 5,
    stepDecreaseMs: 500,
    minIntervalMs: 2000,
    wildChance: 0.04,
    desc: '每 5 秒推升一排（每 30 秒加速）',
  },
  hard: {
    label: '困難',
    intervalMs: 3000,
    intervalSec: 3,
    stepDecreaseMs: 500,
    minIntervalMs: 1500,
    wildChance: 0.08,
    desc: '每 3 秒推升一排（每 30 秒加速）',
  },
};

export const SPEEDUP_INTERVAL_MS = 30000;

export function getEffectivePushIntervalMs(
  difficulty: Difficulty,
  elapsedMs: number
): number {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const tier = Math.floor(elapsedMs / SPEEDUP_INTERVAL_MS);
  return Math.max(
    cfg.minIntervalMs,
    cfg.intervalMs - tier * cfg.stepDecreaseMs
  );
}

export const ANIMAL_META: Record<
  AnimalColor,
  { name: string; label: string; bg: string; ring: string; ink: string }
> = {
  pink: {
    name: '草莓兔兔',
    label: '粉紅兔',
    bg: '#FFD7E2',
    ring: '#F29BB2',
    ink: '#6B4250',
  },
  yellow: {
    name: '奶油小雞',
    label: '鵝黃雞',
    bg: '#FFF0B8',
    ring: '#E8C458',
    ink: '#695632',
  },
  blue: {
    name: '天空海豹',
    label: '淺藍海豹',
    bg: '#CCE8FF',
    ring: '#7FBBE8',
    ink: '#3C5970',
  },
  mint: {
    name: '薄荷小蛙',
    label: '薄荷蛙',
    bg: '#CDF5E0',
    ring: '#74C99E',
    ink: '#385E4B',
  },
  lavender: {
    name: '芋香小貓',
    label: '粉紫貓',
    bg: '#E8DAFF',
    ring: '#B193E6',
    ink: '#54456E',
  },
  wild: {
    name: '萬能彩虹羊',
    label: '萬能彩虹',
    bg: '#FFF4F7',
    ring: '#F09BB8',
    ink: '#5E4B56',
  },
};

export const THEME_META: Record<
  BackgroundTheme,
  { label: string; swatch: string; accent: string; surfaceBg: string }
> = {
  garden: {
    label: '花園',
    swatch: '#FCE7EF',
    accent: '#D96B91',
    surfaceBg: 'rgba(255, 250, 252, 0.86)',
  },
  zoo: {
    label: '動物園',
    swatch: '#FEF3D6',
    accent: '#D98A3C',
    surfaceBg: 'rgba(255, 252, 245, 0.86)',
  },
  french: {
    label: '法式',
    swatch: '#F8EFE6',
    accent: '#B57B6E',
    surfaceBg: 'rgba(253, 250, 246, 0.88)',
  },
  beach: {
    label: '海灘',
    swatch: '#E3F6F5',
    accent: '#3B9EA8',
    surfaceBg: 'rgba(248, 253, 253, 0.86)',
  },
  sky: {
    label: '藍天白雲',
    swatch: '#E5F2FF',
    accent: '#4B8FD9',
    surfaceBg: 'rgba(248, 252, 255, 0.88)',
  },
  leisurely: {
    label: '悠閒',
    swatch: '#EFEAFC',
    accent: '#846BC9',
    surfaceBg: 'rgba(252, 250, 255, 0.88)',
  },
  relaxing: {
    label: '輕鬆',
    swatch: '#E8F5EC',
    accent: '#4F9E6E',
    surfaceBg: 'rgba(249, 253, 250, 0.88)',
  },
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: '男',
  female: '女',
  other: '不公開',
};
