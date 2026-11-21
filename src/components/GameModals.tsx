import React from 'react';
import { Flag, Home, Play, RotateCcw, Trophy } from 'lucide-react';
import {
  BackgroundTheme,
  DIFFICULTY_CONFIG,
  Difficulty,
  THEME_META,
} from '../types/game';

interface PauseModalProps {
  isOpen: boolean;
  theme: BackgroundTheme;
  onResume: () => void;
  onRestart: () => void;
  onRequestQuit: () => void;
  onChangeTheme: (theme: BackgroundTheme) => void;
}

const THEMES: BackgroundTheme[] = [
  'garden',
  'zoo',
  'french',
  'beach',
  'sky',
  'leisurely',
  'relaxing',
];

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  theme,
  onResume,
  onRestart,
  onRequestQuit,
  onChangeTheme,
}) => {
  if (!isOpen) return null;
  const themeMeta = THEME_META[theme];

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-[#FFFDFB] border border-black/10 shadow-xl p-6 space-y-4">
        <div className="text-center">
          <h2
            id="pause-title"
            className="font-display text-2xl font-bold text-[#3F3438]"
          >
            遊戲暫停中
          </h2>
          <p className="text-xs text-[#736268] mt-1">
            目前倒數計時已暫時凍結，隨時可繼續挑戰
          </p>
        </div>

        {/* Quick Background Theme Switch */}
        <div>
          <span className="block text-xs font-bold text-[#5E4D53] mb-2">
            切換淺淡背景風格
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {THEMES.map((t) => {
              const meta = THEME_META[t];
              const selected = theme === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onChangeTheme(t)}
                  className={`min-h-[40px] px-1.5 py-1 rounded-xl border flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer ${
                    selected
                      ? 'bg-white border-black/30 ring-2 ring-black/10'
                      : 'bg-black/[0.025] border-black/8'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: meta.swatch }}
                  />
                  <span className="truncate">{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={onResume}
            className="w-full min-h-[48px] rounded-2xl text-white font-display font-bold text-base flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: themeMeta.accent }}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>繼續遊戲</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full min-h-[44px] rounded-2xl bg-black/5 hover:bg-black/8 text-[#3F3438] font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新開始</span>
          </button>

          <button
            type="button"
            onClick={onRequestQuit}
            className="w-full min-h-[44px] rounded-2xl bg-[#FFF0F3] hover:bg-[#FFE3E9] text-[#C93B5B] font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Flag className="w-4 h-4" />
            <span>放棄本局</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ConfirmQuitModalProps {
  isOpen: boolean;
  score: number;
  onCancel: () => void;
  onQuitAndSave: () => void;
  onQuitDirect: () => void;
}

export const ConfirmQuitModal: React.FC<ConfirmQuitModalProps> = ({
  isOpen,
  score,
  onCancel,
  onQuitAndSave,
  onQuitDirect,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quit-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-[#FFFDFB] border border-black/10 shadow-xl p-6 space-y-4 text-center">
        <h2
          id="quit-title"
          className="font-display text-xl font-bold text-[#3F3438]"
        >
          確定要放棄這局遊戲嗎？
        </h2>
        <p className="text-sm text-[#6E5B62]">
          目前得分為{' '}
          <span className="font-score font-bold text-[#3F3438]">
            {score.toLocaleString()}
          </span>{' '}
          分，您可以選擇結算成績並紀錄至排行榜，或直接返回設定畫面。
        </p>

        <div className="space-y-2 pt-1">
          {score > 0 && (
            <button
              type="button"
              onClick={onQuitAndSave}
              className="w-full min-h-[46px] rounded-2xl bg-[#433339] text-white font-bold text-sm cursor-pointer"
            >
              結束並結算成績
            </button>
          )}
          <button
            type="button"
            onClick={onQuitDirect}
            className="w-full min-h-[44px] rounded-2xl bg-[#FFF0F3] text-[#C93B5B] font-bold text-sm cursor-pointer"
          >
            直接放棄返回首頁
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full min-h-[44px] rounded-2xl bg-black/5 text-[#5E4D53] font-semibold text-sm cursor-pointer"
          >
            繼續遊玩
          </button>
        </div>
      </div>
    </div>
  );
};

interface GameOverModalProps {
  isOpen: boolean;
  playerName: string;
  difficulty: Difficulty;
  score: number;
  maxCombo: number;
  clearedCount: number;
  rank: number | null;
  theme: BackgroundTheme;
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
  onBackToTitle: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  playerName,
  difficulty,
  score,
  maxCombo,
  clearedCount,
  rank,
  theme,
  onPlayAgain,
  onOpenLeaderboard,
  onBackToTitle,
}) => {
  if (!isOpen) return null;
  const themeMeta = THEME_META[theme];

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-[#FFFDFB] border border-black/10 shadow-xl p-6 space-y-4 text-center">
        <div>
          <h2
            id="gameover-title"
            className="font-display text-2xl font-black text-[#3F3438]"
          >
            本局遊戲結束
          </h2>
          <p className="text-xs text-[#736268] mt-1">
            {playerName} · {DIFFICULTY_CONFIG[difficulty].label}模式
          </p>
        </div>

        {rank !== null && (
          <div className="rounded-2xl bg-[#FFF7DF] border border-[#F0D68A] px-3 py-2 text-sm font-bold text-[#8A6112]">
            恭喜登上「{DIFFICULTY_CONFIG[difficulty].label}」排行榜第 {rank} 名！
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 py-3 px-2 rounded-2xl bg-black/[0.03] border border-black/6">
          <div>
            <p className="text-[11px] text-[#7B6B71]">總得分</p>
            <p className="font-score text-lg font-bold text-[#3F3438]">
              {score.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#7B6B71]">消除圓球</p>
            <p className="font-score text-lg font-bold text-[#3F3438]">
              {clearedCount}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#7B6B71]">最高連擊</p>
            <p className="font-score text-lg font-bold text-[#3F3438]">
              {maxCombo}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full min-h-[48px] rounded-2xl text-white font-display font-bold text-base flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: themeMeta.accent }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>再玩一局</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="min-h-[44px] rounded-2xl bg-black/5 hover:bg-black/8 text-[#3F3438] font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#D98A3C]" />
              <span>排行榜</span>
            </button>
            <button
              type="button"
              onClick={onBackToTitle}
              className="min-h-[44px] rounded-2xl bg-black/5 hover:bg-black/8 text-[#3F3438] font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>返回設定</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
