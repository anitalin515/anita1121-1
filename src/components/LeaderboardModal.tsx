import React, { useState } from 'react';
import { Trash2, Trophy, X } from 'lucide-react';
import {
  DIFFICULTY_CONFIG,
  Difficulty,
  GENDER_LABELS,
} from '../types/game';
import { LeaderboardStore } from '../utils/storage';

interface LeaderboardModalProps {
  isOpen: boolean;
  initialDifficulty: Difficulty;
  store: LeaderboardStore;
  onClose: () => void;
  onClearDifficulty: (difficulty: Difficulty) => void;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard'];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  initialDifficulty,
  store,
  onClose,
  onClearDifficulty,
}) => {
  const [selectedDiff, setSelectedDiff] =
    useState<Difficulty>(initialDifficulty);
  const [confirmClear, setConfirmClear] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedDiff(initialDifficulty);
      setConfirmClear(false);
    }
  }, [isOpen, initialDifficulty]);

  if (!isOpen) return null;

  const entries = store[selectedDiff];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-title"
    >
      <div className="w-full max-w-md rounded-3xl bg-[#FFFDFB] border border-black/10 shadow-xl p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#D98A3C]" />
            <h2
              id="leaderboard-title"
              className="font-display text-xl font-bold text-[#3F3438]"
            >
              單機高分排行榜
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉排行榜"
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#6E5B62] hover:bg-black/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty Segmented Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/5 mb-4">
          {DIFFICULTIES.map((diff) => {
            const active = selectedDiff === diff;
            return (
              <button
                key={diff}
                type="button"
                onClick={() => {
                  setSelectedDiff(diff);
                  setConfirmClear(false);
                }}
                className={`min-h-[40px] rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-white text-[#3F3438] shadow-sm'
                    : 'text-[#736268] hover:text-[#3F3438]'
                }`}
              >
                {DIFFICULTY_CONFIG[diff].label}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-[#7B6B71] mb-3">
          {DIFFICULTY_CONFIG[selectedDiff].desc} · 僅保留分數最高前 5 名
        </p>

        {/* Entries List */}
        {entries.length === 0 ? (
          <div className="py-10 text-center rounded-2xl bg-black/[0.025] border border-black/5">
            <p className="text-sm font-semibold text-[#6E5B62]">
              此難度目前尚無紀錄
            </p>
            <p className="text-xs text-[#948389] mt-1">
              完成一局遊戲後將自動登錄前 5 名高分
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/6 border border-black/8 rounded-2xl bg-white overflow-hidden">
            {entries.map((entry, idx) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3 px-3.5 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-score text-sm font-bold shrink-0 ${
                      idx === 0
                        ? 'bg-[#FFE8A3] text-[#785912]'
                        : idx === 1
                        ? 'bg-[#EAECEE] text-[#4B5563]'
                        : idx === 2
                        ? 'bg-[#F8DEC9] text-[#7D4A24]'
                        : 'bg-black/5 text-[#6E5B62]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#3F3438] truncate">
                      {entry.name}
                    </p>
                    <p className="text-xs text-[#806F75] whitespace-nowrap">
                      {GENDER_LABELS[entry.gender]} · 最高 {entry.maxCombo} 連擊
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-score text-base font-bold text-[#3F3438]">
                    {entry.score.toLocaleString()} 分
                  </p>
                  <p className="text-[11px] text-[#948389]">
                    {new Date(entry.createdAt).toLocaleDateString('zh-TW')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-4 flex items-center justify-between gap-2">
          {entries.length > 0 ? (
            confirmClear ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClearDifficulty(selectedDiff);
                    setConfirmClear(false);
                  }}
                  className="min-h-[40px] px-3 rounded-xl bg-[#D9436D] text-white text-xs font-bold cursor-pointer"
                >
                  確定清除
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="min-h-[40px] px-3 rounded-xl bg-black/5 text-[#5E4D53] text-xs font-semibold cursor-pointer"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="min-h-[40px] px-3 rounded-xl text-xs font-semibold text-[#8C7A80] hover:text-[#C93B5B] flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>清除此榜</span>
              </button>
            )
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 rounded-xl bg-[#433339] text-white text-sm font-bold cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
