import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Flag,
  Music,
  Pause,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { GameBoard } from './components/GameBoard';
import {
  ConfirmQuitModal,
  GameOverModal,
  PauseModal,
} from './components/GameModals';
import { LeaderboardModal } from './components/LeaderboardModal';
import { PastelBackdrop } from './components/PastelBackdrop';
import { TitleScreen } from './components/TitleScreen';
import {
  BackgroundTheme,
  BaseAnimalColor,
  Coord,
  DIFFICULTY_CONFIG,
  Difficulty,
  FloatingScore,
  GENDER_LABELS,
  GRID_COLS,
  GameState,
  GridMatrix,
  PlayerProfile,
  THEME_META,
  getEffectivePushIntervalMs,
  pickRandomTheme,
} from './types/game';
import { soundEngine } from './utils/audio';
import {
  applyGravity,
  clearTilesAt,
  createInitialGrid,
  findChainMatchesFromMoved,
  getLandingRow,
  hasReachedDangerLine,
  isNearDangerLine,
  placeAndCheckImpact,
  pushBottomRow,
  randomBaseColor,
} from './utils/gameLogic';
import {
  LeaderboardStore,
  clearLeaderboardForDifficulty,
  loadLeaderboard,
  loadPlayerProfile,
  recordLeaderboardScore,
  savePlayerProfile,
  validatePlayerName,
} from './utils/storage';

function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => loadPlayerProfile());
  const [theme, setTheme] = useState<BackgroundTheme>(() => pickRandomTheme());
  const [nameError, setNameError] = useState<string | null>(null);

  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [grid, setGrid] = useState<GridMatrix>(() =>
    createInitialGrid(profile.difficulty)
  );
  const [activeColumn, setActiveColumn] = useState<number>(Math.floor(GRID_COLS / 2));
  const [currentOrb, setCurrentOrb] = useState<BaseAnimalColor>(() => randomBaseColor());
  const [nextOrb, setNextOrb] = useState<BaseAnimalColor>(() => randomBaseColor());

  const [score, setScore] = useState<number>(0);
  const [clearedCount, setClearedCount] = useState<number>(0);
  const [comboCount, setComboCount] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [isResolving, setIsResolving] = useState<boolean>(false);

  const [clearingKeys, setClearingKeys] = useState<Set<string>>(() => new Set());
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  const baseIntervalMs = DIFFICULTY_CONFIG[profile.difficulty].intervalMs;
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [countdownMs, setCountdownMs] = useState<number>(baseIntervalMs);

  const [leaderboard, setLeaderboard] = useState<LeaderboardStore>(() =>
    loadLeaderboard()
  );
  const [leaderboardOpen, setLeaderboardOpen] = useState<boolean>(false);
  const [leaderboardDiff, setLeaderboardDiff] = useState<Difficulty>(
    profile.difficulty
  );
  const [lastRank, setLastRank] = useState<number | null>(null);
  const [confirmQuitOpen, setConfirmQuitOpen] = useState<boolean>(false);

  const sessionTokenRef = useRef<number>(0);
  const gridRef = useRef<GridMatrix>(grid);
  gridRef.current = grid;

  const scoreRef = useRef<number>(score);
  scoreRef.current = score;
  const maxComboRef = useRef<number>(maxCombo);
  maxComboRef.current = maxCombo;
  const clearedCountRef = useRef<number>(clearedCount);
  clearedCountRef.current = clearedCount;
  const elapsedMsRef = useRef<number>(elapsedMs);
  elapsedMsRef.current = elapsedMs;
  const countdownRef = useRef<number>(countdownMs);
  countdownRef.current = countdownMs;

  // Sync audio preferences
  useEffect(() => {
    soundEngine.setBgmEnabled(profile.bgmEnabled);
    soundEngine.setSfxEnabled(profile.sfxEnabled);
    if (gameState === 'PLAYING' && !confirmQuitOpen && profile.bgmEnabled) {
      soundEngine.startBgm();
    } else {
      soundEngine.stopBgm();
    }
  }, [profile.bgmEnabled, profile.sfxEnabled, gameState, confirmQuitOpen]);

  useEffect(() => {
    return () => {
      soundEngine.stopBgm();
    };
  }, []);

  const updateProfile = useCallback((patch: Partial<PlayerProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      savePlayerProfile(next);
      return next;
    });
    if (patch.name !== undefined) {
      setNameError(null);
    }
  }, []);

  const addFloatingScore = useCallback(
    (coords: Coord[], points: number, combo: number, isWild = false) => {
      if (coords.length === 0) return;
      const avgRow =
        coords.reduce((sum, c) => sum + c.row, 0) / coords.length;
      const avgCol =
        coords.reduce((sum, c) => sum + c.col, 0) / coords.length;
      const id = `fs-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      setFloatingScores((prev) => [
        ...prev,
        { id, row: avgRow, col: avgCol, points, combo, isWild },
      ]);

      window.setTimeout(() => {
        setFloatingScores((prev) => prev.filter((item) => item.id !== id));
      }, 900);
    },
    []
  );

  const finishGame = useCallback(
    (finalScore: number, finalMaxCombo: number, finalCleared: number, shouldSave = true) => {
      sessionTokenRef.current += 1;
      soundEngine.stopBgm();
      soundEngine.playGameOver();
      setIsResolving(false);
      setClearingKeys(new Set());
      setConfirmQuitOpen(false);

      if (shouldSave && finalScore > 0) {
        const result = recordLeaderboardScore({
          name: profile.name.trim(),
          gender: profile.gender,
          difficulty: profile.difficulty,
          score: finalScore,
          maxCombo: finalMaxCombo,
          clearedCount: finalCleared,
        });
        setLeaderboard(result.store);
        setLastRank(result.rank);
      } else {
        setLastRank(null);
      }

      setGameState('GAME_OVER');
    },
    [profile.difficulty, profile.gender, profile.name]
  );

  const startNewSession = useCallback(() => {
    const check = validatePlayerName(profile.name);
    if (!check.valid) {
      setNameError(check.error);
      return;
    }

    if (check.trimmed !== profile.name) {
      updateProfile({ name: check.trimmed });
    }

    setTheme((prev) => pickRandomTheme(prev));

    soundEngine.unlock();
    sessionTokenRef.current += 1;

    const freshGrid = createInitialGrid(profile.difficulty);
    setGrid(freshGrid);
    setActiveColumn(Math.floor(GRID_COLS / 2));
    setCurrentOrb(randomBaseColor());
    setNextOrb(randomBaseColor());
    setScore(0);
    setClearedCount(0);
    setComboCount(0);
    setMaxCombo(0);
    setIsResolving(false);
    setClearingKeys(new Set());
    setFloatingScores([]);
    setLastRank(null);
    setConfirmQuitOpen(false);
    const initialInterval = DIFFICULTY_CONFIG[profile.difficulty].intervalMs;
    elapsedMsRef.current = 0;
    setElapsedMs(0);
    countdownRef.current = initialInterval;
    setCountdownMs(initialInterval);
    setGameState('PLAYING');
  }, [profile.difficulty, profile.name, updateProfile]);

  const dropInColumn = useCallback(
    async (targetCol: number) => {
      if (gameState !== 'PLAYING' || isResolving || confirmQuitOpen) return;
      if (targetCol < 0 || targetCol >= GRID_COLS) return;

      const currentGrid = gridRef.current;
      const dropRow = getLandingRow(currentGrid, targetCol);
      if (dropRow < 0) return;

      setActiveColumn(targetCol);
      soundEngine.unlock();
      soundEngine.playDrop();
      setIsResolving(true);
      const token = sessionTokenRef.current;

      const { gridWithOrb, clearedCoords, isWildHit } = placeAndCheckImpact(
        currentGrid,
        dropRow,
        targetCol,
        currentOrb
      );

      setGrid(gridWithOrb);

    let runningScore = score;
    let runningCleared = clearedCount;
    let runningMaxCombo = maxCombo;

    if (clearedCoords.length === 0) {
      // No match: orb settles at dropRow
      soundEngine.playLand();
      setComboCount(0);

      // Prepare next orb
      setCurrentOrb(nextOrb);
      setNextOrb(randomBaseColor());

      await waitMs(140);
      if (sessionTokenRef.current !== token) return;

      if (hasReachedDangerLine(gridWithOrb)) {
        finishGame(runningScore, runningMaxCombo, runningCleared, true);
        return;
      }

      setIsResolving(false);
      return;
    }

    // Impact elimination + Chain Combo gravity loop
    let workingGrid = gridWithOrb;
    let waveCombo = 1;
    let toClear = clearedCoords;
    let wildFlag = isWildHit;

    while (toClear.length > 0) {
      if (sessionTokenRef.current !== token) return;

      const waveBasePts = toClear.length * 10;
      const chainBonus = waveCombo >= 2 ? 50 : 0;
      const wavePoints = waveBasePts + chainBonus;

      runningScore += wavePoints;
      runningCleared += toClear.length;
      runningMaxCombo = Math.max(runningMaxCombo, waveCombo);

      setScore(runningScore);
      setClearedCount(runningCleared);
      setComboCount(waveCombo);
      setMaxCombo(runningMaxCombo);

      soundEngine.playMatch(waveCombo, wildFlag);
      addFloatingScore(toClear, wavePoints, waveCombo, wildFlag);
      setClearingKeys(new Set(toClear.map((c) => `${c.row},${c.col}`)));

      await waitMs(230);
      if (sessionTokenRef.current !== token) return;

      const clearedGrid = clearTilesAt(workingGrid, toClear);
      setClearingKeys(new Set());

      const { nextGrid, movedCoords } = applyGravity(clearedGrid);
      workingGrid = nextGrid;
      setGrid(workingGrid);

      if (movedCoords.length === 0) {
        break;
      }

      await waitMs(185);
      if (sessionTokenRef.current !== token) return;

      const chainMatches = findChainMatchesFromMoved(workingGrid, movedCoords);
      if (chainMatches.length === 0) {
        break;
      }

      waveCombo += 1;
      toClear = chainMatches;
      wildFlag = false;
    }

    if (sessionTokenRef.current !== token) return;

    setCurrentOrb(nextOrb);
    setNextOrb(randomBaseColor());

    if (hasReachedDangerLine(workingGrid)) {
      finishGame(runningScore, runningMaxCombo, runningCleared, true);
      return;
    }

      setIsResolving(false);
    },
    [
      addFloatingScore,
      clearedCount,
      confirmQuitOpen,
      currentOrb,
      finishGame,
      gameState,
      isResolving,
      maxCombo,
      nextOrb,
      score,
    ]
  );

  const handleSelectColumn = useCallback(
    (col: number) => {
      void dropInColumn(col);
    },
    [dropInColumn]
  );

  const handleMoveColumn = useCallback(
    (delta: number) => {
      if (gameState !== 'PLAYING' || isResolving || confirmQuitOpen) return;
      const target = Math.max(0, Math.min(GRID_COLS - 1, activeColumn + delta));
      if (target !== activeColumn) {
        soundEngine.unlock();
        soundEngine.playMove();
        setActiveColumn(target);
      }
    },
    [activeColumn, confirmQuitOpen, gameState, isResolving]
  );

  const handleConfirmDrop = useCallback(() => {
    void dropInColumn(activeColumn);
  }, [activeColumn, dropInColumn]);

  // Bottom Row Push-Up Interval Timer (accelerates every 30s survived)
  useEffect(() => {
    if (gameState !== 'PLAYING' || isResolving || confirmQuitOpen) return;

    const tickMs = 100;

    const timer = window.setInterval(() => {
      const nextElapsed = elapsedMsRef.current + tickMs;
      elapsedMsRef.current = nextElapsed;
      setElapsedMs(nextElapsed);

      const effectiveInterval = getEffectivePushIntervalMs(
        profile.difficulty,
        nextElapsed
      );
      const nextRemaining = Math.min(
        effectiveInterval,
        countdownRef.current - tickMs
      );

      if (nextRemaining > 0) {
        countdownRef.current = nextRemaining;
        setCountdownMs(nextRemaining);
        return;
      }

      // Reset countdown using current speed tier and push bottom row
      countdownRef.current = effectiveInterval;
      setCountdownMs(effectiveInterval);

      const { nextGrid, overflowed } = pushBottomRow(
        gridRef.current,
        profile.difficulty
      );
      setGrid(nextGrid);
      soundEngine.playRowPush();

      if (overflowed) {
        const tokenAtOverflow = sessionTokenRef.current;
        window.setTimeout(() => {
          if (sessionTokenRef.current === tokenAtOverflow) {
            finishGame(
              scoreRef.current,
              maxComboRef.current,
              clearedCountRef.current,
              true
            );
          }
        }, 80);
      }
    }, tickMs);

    return () => window.clearInterval(timer);
  }, [confirmQuitOpen, finishGame, gameState, isResolving, profile.difficulty]);

  // Keyboard Controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (leaderboardOpen) {
        if (e.key === 'Escape') setLeaderboardOpen(false);
        return;
      }

      if (gameState === 'PLAYING') {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          handleMoveColumn(-1);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          handleMoveColumn(1);
        } else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') {
          e.preventDefault();
          handleConfirmDrop();
        } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          setGameState('PAUSED');
        }
      } else if (gameState === 'PAUSED') {
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          setGameState('PLAYING');
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState, handleConfirmDrop, handleMoveColumn, leaderboardOpen]);

  const activeTheme = THEME_META[theme];
  const effectiveIntervalMs = getEffectivePushIntervalMs(
    profile.difficulty,
    elapsedMs
  );
  const progressPct = Math.max(
    0,
    Math.min(100, (countdownMs / effectiveIntervalMs) * 100)
  );
  const survivedSec = Math.floor(elapsedMs / 1000);
  const nearDanger = isNearDangerLine(grid);
  const currentTop5 = leaderboard[profile.difficulty];

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden">
      <PastelBackdrop theme={theme} />

      {gameState === 'TITLE_MENU' ? (
        <TitleScreen
          profile={profile}
          theme={theme}
          nameError={nameError}
          onUpdateProfile={updateProfile}
          onStartGame={startNewSession}
          onOpenLeaderboard={(diff) => {
            setLeaderboardDiff(diff);
            setLeaderboardOpen(true);
          }}
        />
      ) : (
        <main className="relative z-10 min-h-[100dvh] w-full flex flex-col justify-between px-3 py-2.5 sm:px-6 sm:py-4">
          {/* Compact Top Perimeter HUD (<= 15% mobile height, clean unboxed metadata) */}
          <header className="mx-auto w-full max-w-5xl flex items-center justify-between gap-2 pb-2">
            {/* Left: Player & Score */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-[#6E5B62] truncate">
                  <span className="font-bold text-[#3F3438] truncate">
                    {profile.name}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="whitespace-nowrap">
                    {GENDER_LABELS[profile.gender]}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="whitespace-nowrap">
                    {DIFFICULTY_CONFIG[profile.difficulty].label}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-score text-xl sm:text-2xl font-bold text-[#3F3438]">
                    {score.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[#736268]">分</span>
                </div>
              </div>
            </div>

            {/* Center: Push-Up Countdown Bar */}
            <div className="hidden sm:flex flex-col items-center w-48">
              <div className="w-full flex items-center justify-between text-[11px] font-semibold text-[#6E5B62] mb-1">
                <span>
                  推升倒數（{(effectiveIntervalMs / 1000).toFixed(1)}s）
                </span>
                <span className="font-score">
                  {(countdownMs / 1000).toFixed(1)}s
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-100"
                  style={{
                    width: `${progressPct}%`,
                    backgroundColor:
                      progressPct < 25 ? '#E0526D' : activeTheme.accent,
                  }}
                />
              </div>
            </div>

            {/* Right: Audio, Pause & Quit */}
            <div className="flex items-center gap-1.5 shrink-0">

              <button
                type="button"
                onClick={() => updateProfile({ bgmEnabled: !profile.bgmEnabled })}
                aria-label={profile.bgmEnabled ? '關閉音樂' : '開啟音樂'}
                className={`min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center cursor-pointer ${
                  profile.bgmEnabled
                    ? 'bg-white/85 border-black/10 text-[#433339]'
                    : 'bg-white/50 border-black/8 text-[#9E8E93]'
                }`}
              >
                <Music className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => updateProfile({ sfxEnabled: !profile.sfxEnabled })}
                aria-label={profile.sfxEnabled ? '關閉音效' : '開啟音效'}
                className={`min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center cursor-pointer ${
                  profile.sfxEnabled
                    ? 'bg-white/85 border-black/10 text-[#433339]'
                    : 'bg-white/50 border-black/8 text-[#9E8E93]'
                }`}
              >
                {profile.sfxEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setGameState('PAUSED')}
                aria-label="暫停遊戲"
                className="min-w-[44px] min-h-[44px] px-3 rounded-xl bg-white/90 hover:bg-white border border-black/10 text-[#3F3438] font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                <span className="hidden sm:inline">暫停</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmQuitOpen(true)}
                aria-label="放棄遊戲"
                className="min-w-[44px] min-h-[44px] px-3 rounded-xl bg-[#FFF0F3] hover:bg-[#FFE3E9] border border-[#F4C4CF] text-[#C93B5B] font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                <span className="hidden sm:inline">放棄</span>
              </button>
            </div>
          </header>

          {/* Mobile Compact Push-Up Bar */}
          <div className="sm:hidden w-full max-w-[430px] mx-auto mb-1.5 flex items-center gap-2 px-1">
            <span className="text-[11px] font-semibold text-[#6E5B62] whitespace-nowrap">
              推升 {(countdownMs / 1000).toFixed(1)}s /{' '}
              {(effectiveIntervalMs / 1000).toFixed(1)}s
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-100"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor:
                    progressPct < 25 ? '#E0526D' : activeTheme.accent,
                }}
              />
            </div>
          </div>

          {/* Main Play Area + Desktop Side Companion */}
          <div className="mx-auto w-full max-w-5xl flex-1 flex items-center justify-center gap-8">
            <div className="w-full lg:w-auto lg:min-w-[410px] flex justify-center">
              <GameBoard
                grid={grid}
                activeColumn={activeColumn}
                currentOrb={currentOrb}
                nextOrb={nextOrb}
                clearingKeys={clearingKeys}
                floatingScores={floatingScores}
                isResolving={isResolving}
                nearDanger={nearDanger}
                theme={theme}
                comboCount={comboCount}
                onSelectColumn={handleSelectColumn}
                onMoveColumn={handleMoveColumn}
                onConfirmDrop={handleConfirmDrop}
              />
            </div>

            {/* Desktop Side Companion Panel (Prevents empty void on 1440px viewports) */}
            <aside className="hidden lg:flex flex-col w-80 gap-4 shrink-0">
              {/* Session Metrics */}
              <div
                className="rounded-3xl border border-black/10 p-5 shadow-sm backdrop-blur-sm space-y-3"
                style={{ backgroundColor: activeTheme.surfaceBg }}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#6E5B62]">
                  <span>戰績統計</span>
                  <span className="font-score">
                    生存 {survivedSec}s · {(effectiveIntervalMs / 1000).toFixed(1)}s/排
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-2xl bg-white/80 p-3 border border-black/6">
                    <p className="text-xs text-[#7B6B71]">已消除圓球</p>
                    <p className="font-score text-xl font-bold text-[#3F3438] mt-0.5">
                      {clearedCount}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-3 border border-black/6">
                    <p className="text-xs text-[#7B6B71]">最高連擊</p>
                    <p className="font-score text-xl font-bold text-[#3F3438] mt-0.5">
                      {maxCombo}
                    </p>
                  </div>
                </div>
                <div className="pt-1 text-xs text-[#7B6B71]">
                  目前隨機背景：<span className="font-semibold text-[#4A3A40]">{activeTheme.label}</span>
                </div>
              </div>

              {/* Current Difficulty Top 5 Preview */}
              <div
                className="rounded-3xl border border-black/10 p-5 shadow-sm backdrop-blur-sm"
                style={{ backgroundColor: activeTheme.surfaceBg }}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-[#D98A3C]" />
                    <span className="text-xs font-bold text-[#4A3A40]">
                      {DIFFICULTY_CONFIG[profile.difficulty].label}榜前 5 名
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLeaderboardDiff(profile.difficulty);
                      setLeaderboardOpen(true);
                    }}
                    className="text-xs font-semibold text-[#6E5B62] hover:text-[#3F3438] underline cursor-pointer"
                  >
                    全部榜單
                  </button>
                </div>

                {currentTop5.length === 0 ? (
                  <p className="text-xs text-[#8C7A80] py-3">
                    尚無紀錄，快來寫下第一筆高分！
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {currentTop5.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs py-1 border-b border-black/6 last:border-b-0"
                      >
                        <span className="truncate font-semibold text-[#4A3A40]">
                          {idx + 1}. {item.name}
                        </span>
                        <span className="font-score font-bold text-[#3F3438] shrink-0 ml-2">
                          {item.score.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>

          <p className="hidden sm:block text-center text-[11px] text-[#7E6D73] pt-1">
            點選欄位直接下降 · ←/→ 移動 · Space 降落 · Esc 暫停
          </p>
        </main>
      )}

      {/* Modals */}
      <PauseModal
        isOpen={gameState === 'PAUSED' && !confirmQuitOpen}
        theme={theme}
        onResume={() => setGameState('PLAYING')}
        onRestart={startNewSession}
        onRequestQuit={() => setConfirmQuitOpen(true)}
      />

      <ConfirmQuitModal
        isOpen={confirmQuitOpen}
        score={score}
        onCancel={() => setConfirmQuitOpen(false)}
        onQuitAndSave={() => finishGame(score, maxCombo, clearedCount, true)}
        onQuitDirect={() => {
          sessionTokenRef.current += 1;
          soundEngine.stopBgm();
          setConfirmQuitOpen(false);
          setIsResolving(false);
          setGameState('TITLE_MENU');
        }}
      />

      <GameOverModal
        isOpen={gameState === 'GAME_OVER'}
        playerName={profile.name}
        difficulty={profile.difficulty}
        score={score}
        maxCombo={maxCombo}
        clearedCount={clearedCount}
        rank={lastRank}
        theme={theme}
        onPlayAgain={startNewSession}
        onOpenLeaderboard={() => {
          setLeaderboardDiff(profile.difficulty);
          setLeaderboardOpen(true);
        }}
        onBackToTitle={() => {
          sessionTokenRef.current += 1;
          setGameState('TITLE_MENU');
        }}
      />

      <LeaderboardModal
        isOpen={leaderboardOpen}
        initialDifficulty={leaderboardDiff}
        store={leaderboard}
        onClose={() => setLeaderboardOpen(false)}
        onClearDifficulty={(diff) => {
          const updated = clearLeaderboardForDifficulty(diff);
          setLeaderboard(updated);
        }}
      />
    </div>
  );
}
