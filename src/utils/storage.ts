import {
  Difficulty,
  LeaderboardEntry,
  PlayerProfile,
} from '../types/game';

const PROFILE_STORAGE_KEY = 'animal_pastel_puzzle_profile_v1';
const LEADERBOARD_STORAGE_KEY = 'animal_pastel_puzzle_leaderboard_v1';

const DEFAULT_PROFILE: PlayerProfile = {
  name: '',
  gender: 'female',
  difficulty: 'normal',
  bgmEnabled: true,
  sfxEnabled: true,
};

// Allow Chinese (CJK Unified Ideographs), English letters, and numbers (1-12 chars)
const VALID_NAME_REGEX = /^[\u4e00-\u9fff\u3400-\u4dbfa-zA-Z0-9]{1,12}$/;

export function validatePlayerName(rawName: string): {
  valid: boolean;
  trimmed: string;
  error: string | null;
} {
  const trimmed = rawName.trim();
  if (!trimmed) {
    return { valid: false, trimmed, error: '請輸入玩家姓名後再開始遊戲' };
  }
  if (trimmed.length > 12) {
    return {
      valid: false,
      trimmed,
      error: '姓名長度請維持在 12 個字元以內',
    };
  }
  if (!VALID_NAME_REGEX.test(trimmed)) {
    return {
      valid: false,
      trimmed,
      error: '姓名僅限輸入中文、英文或數字（不含空白或符號）',
    };
  }
  return { valid: true, trimmed, error: null };
}

export function loadPlayerProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
    return {
      name: typeof parsed.name === 'string' ? parsed.name : DEFAULT_PROFILE.name,
      gender: parsed.gender || DEFAULT_PROFILE.gender,
      difficulty: parsed.difficulty || DEFAULT_PROFILE.difficulty,
      bgmEnabled:
        typeof parsed.bgmEnabled === 'boolean'
          ? parsed.bgmEnabled
          : DEFAULT_PROFILE.bgmEnabled,
      sfxEnabled:
        typeof parsed.sfxEnabled === 'boolean'
          ? parsed.sfxEnabled
          : DEFAULT_PROFILE.sfxEnabled,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function savePlayerProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage quota errors
  }
}

export type LeaderboardStore = Record<Difficulty, LeaderboardEntry[]>;

const EMPTY_LEADERBOARD: LeaderboardStore = {
  easy: [],
  normal: [],
  hard: [],
};

export function loadLeaderboard(): LeaderboardStore {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return { ...EMPTY_LEADERBOARD };
    const parsed = JSON.parse(raw) as Partial<LeaderboardStore>;
    return {
      easy: Array.isArray(parsed.easy) ? parsed.easy.slice(0, 5) : [],
      normal: Array.isArray(parsed.normal) ? parsed.normal.slice(0, 5) : [],
      hard: Array.isArray(parsed.hard) ? parsed.hard.slice(0, 5) : [],
    };
  } catch {
    return { ...EMPTY_LEADERBOARD };
  }
}

export function recordLeaderboardScore(
  entry: Omit<LeaderboardEntry, 'id' | 'createdAt'>
): {
  store: LeaderboardStore;
  rank: number | null; // 1-5 if made top 5, else null
  savedEntry: LeaderboardEntry;
} {
  const store = loadLeaderboard();
  const savedEntry: LeaderboardEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  const list = [...store[entry.difficulty], savedEntry].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.maxCombo !== a.maxCombo) return b.maxCombo - a.maxCombo;
    return a.createdAt.localeCompare(b.createdAt);
  });

  const top5 = list.slice(0, 5);
  const rankIndex = top5.findIndex((item) => item.id === savedEntry.id);

  const updated: LeaderboardStore = {
    ...store,
    [entry.difficulty]: top5,
  };

  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }

  return {
    store: updated,
    rank: rankIndex >= 0 ? rankIndex + 1 : null,
    savedEntry,
  };
}

export function clearLeaderboardForDifficulty(
  difficulty: Difficulty
): LeaderboardStore {
  const store = loadLeaderboard();
  const updated: LeaderboardStore = {
    ...store,
    [difficulty]: [],
  };
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
  return updated;
}
