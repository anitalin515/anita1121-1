import React from 'react';
import {
  Music,
  Play,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  ANIMAL_META,
  BackgroundTheme,
  DIFFICULTY_CONFIG,
  Difficulty,
  GENDER_LABELS,
  Gender,
  PlayerProfile,
  THEME_META,
} from '../types/game';
import { AnimalTileSvg } from './AnimalTileSvg';

interface TitleScreenProps {
  profile: PlayerProfile;
  nameError: string | null;
  onUpdateProfile: (patch: Partial<PlayerProfile>) => void;
  onStartGame: () => void;
  onOpenLeaderboard: (difficulty: Difficulty) => void;
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

const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard'];
const GENDERS: Gender[] = ['male', 'female', 'other'];

export const TitleScreen: React.FC<TitleScreenProps> = ({
  profile,
  nameError,
  onUpdateProfile,
  onStartGame,
  onOpenLeaderboard,
}) => {
  const activeTheme = THEME_META[profile.theme];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame();
  };

  return (
    <div className="relative z-10 min-h-[100dvh] w-full flex flex-col justify-center px-4 py-5 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Showcase / Game Identity (Visible prominently on desktop, compact header on mobile) */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Bespoke SVG Title Lockup */}
          <div className="mb-3 inline-flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0">
              <AnimalTileSvg color="pink" />
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 -ml-3">
              <AnimalTileSvg color="wild" />
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 -ml-3">
              <AnimalTileSvg color="mint" />
            </div>
          </div>

          <h1
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#433339] leading-tight"
            style={{ textWrap: 'balance' }}
          >
            萌寵圓球消消樂
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6E5B62] max-w-md leading-relaxed">
            對準可愛動物圓球落點，撞擊同色群組或萬能彩虹羊立即消除，觸發遞補連鎖賺取高分！
          </p>

          {/* Animal Roster & Rules Preview */}
          <div
            className="mt-5 w-full rounded-3xl border border-black/8 p-4 sm:p-5 shadow-sm backdrop-blur-sm"
            style={{ backgroundColor: activeTheme.surfaceBg }}
          >
            <div className="grid grid-cols-6 gap-2 items-center justify-items-center mb-3">
              {(['pink', 'yellow', 'blue', 'mint', 'lavender', 'wild'] as const).map(
                (c) => (
                  <div key={c} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 sm:w-11 sm:h-11">
                      <AnimalTileSvg color={c} />
                    </div>
                    <span className="text-[11px] font-medium text-[#6B5A60] whitespace-nowrap">
                      {c === 'wild' ? '萬能羊' : ANIMAL_META[c].label}
                    </span>
                  </div>
                )
              )}
            </div>
            <div className="border-t border-black/8 pt-3 text-xs sm:text-sm text-[#615056] space-y-1 text-left">
              <p>· 須 3 顆以上同色相連（含斜線）才消除，每顆 10 分、連鎖加 50 分</p>
              <p>· 彩虹萬能羊碰觸降落圓球可由任意色消除，並消除盤面所有相同顏色</p>
              <p>· 下方定時推升新排，任一欄觸及頂端警示線即結束</p>
            </div>
          </div>

          {/* Desktop Audio & Quick Leaderboard Bar */}
          <div className="hidden lg:flex items-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => onOpenLeaderboard(profile.difficulty)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-white/85 hover:bg-white border border-black/10 text-sm font-semibold text-[#4A3A40] flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#D98A3C]" />
              <span>排行榜紀錄</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateProfile({ bgmEnabled: !profile.bgmEnabled })}
              aria-label={profile.bgmEnabled ? '關閉背景音樂' : '開啟背景音樂'}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                profile.bgmEnabled
                  ? 'bg-white/90 border-black/10 text-[#4A3A40]'
                  : 'bg-white/50 border-black/8 text-[#8C7A80]'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>{profile.bgmEnabled ? '音樂開' : '音樂關'}</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateProfile({ sfxEnabled: !profile.sfxEnabled })}
              aria-label={profile.sfxEnabled ? '關閉遊戲音效' : '開啟遊戲音效'}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                profile.sfxEnabled
                  ? 'bg-white/90 border-black/10 text-[#4A3A40]'
                  : 'bg-white/50 border-black/8 text-[#8C7A80]'
              }`}
            >
              {profile.sfxEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span>{profile.sfxEnabled ? '音效開' : '音效關'}</span>
            </button>
          </div>
        </div>

        {/* Right Setup Form Card */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 w-full rounded-3xl border border-black/10 p-5 sm:p-6 shadow-md backdrop-blur-md space-y-4"
          style={{ backgroundColor: activeTheme.surfaceBg }}
        >
          {/* Player Name & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-7">
              <label
                htmlFor="player-name"
                className="block text-sm font-bold text-[#4A3A40] mb-1.5"
              >
                玩家姓名
              </label>
              <input
                id="player-name"
                type="text"
                maxLength={12}
                value={profile.name}
                onChange={(e) => onUpdateProfile({ name: e.target.value })}
                placeholder="輸入中文、英文或數字"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-black/12 text-base text-[#3F3438] placeholder:text-[#A39398] focus:outline-none focus:ring-2 focus:ring-[#D96B91]/40"
              />
              {nameError && (
                <p className="mt-1 text-xs font-medium text-[#C93B5B]">
                  {nameError}
                </p>
              )}
            </div>

            <div className="sm:col-span-5">
              <span className="block text-sm font-bold text-[#4A3A40] mb-1.5">
                性別
              </span>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/5">
                {GENDERS.map((g) => {
                  const selected = profile.gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => onUpdateProfile({ gender: g })}
                      className={`min-h-[40px] rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        selected
                          ? 'bg-white text-[#3F3438] shadow-sm'
                          : 'text-[#736268] hover:text-[#3F3438]'
                      }`}
                    >
                      {GENDER_LABELS[g]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <span className="block text-sm font-bold text-[#4A3A40] mb-1.5">
              遊戲難易度
            </span>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((diff) => {
                const cfg = DIFFICULTY_CONFIG[diff];
                const selected = profile.difficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => onUpdateProfile({ difficulty: diff })}
                    className={`min-h-[54px] px-3 py-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-center ${
                      selected
                        ? 'bg-white border-[#433339]/30 shadow-sm ring-2 ring-black/8'
                        : 'bg-white/55 border-black/8 hover:bg-white/80'
                    }`}
                  >
                    <span className="text-sm font-bold text-[#3F3438] whitespace-nowrap">
                      {cfg.label}
                    </span>
                    <span className="text-xs text-[#736268] whitespace-nowrap">
                      {cfg.intervalSec} 秒一排
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7 Light Pastel Background Themes */}
          <div>
            <span className="block text-sm font-bold text-[#4A3A40] mb-1.5">
              淺淡風格背景
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {THEMES.map((t) => {
                const meta = THEME_META[t];
                const selected = profile.theme === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onUpdateProfile({ theme: t })}
                    className={`min-h-[46px] px-2 py-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      selected
                        ? 'bg-white border-[#433339]/35 shadow-sm ring-2 ring-black/10'
                        : 'bg-white/60 border-black/8 hover:bg-white/85'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: meta.swatch }}
                    />
                    <span className="text-xs font-semibold text-[#4A3A40] whitespace-nowrap">
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Start Action & Mobile Utility Row */}
          <div className="pt-1 space-y-2.5">
            <button
              type="submit"
              className="w-full min-h-[52px] px-6 py-3 rounded-2xl text-white font-display font-bold text-lg shadow-sm active:scale-[0.99] transition-transform flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: activeTheme.accent }}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>開始遊戲</span>
            </button>

            {/* Mobile-only Leaderboard & Audio Row */}
            <div className="grid grid-cols-3 gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => onOpenLeaderboard(profile.difficulty)}
                className="min-h-[44px] px-2.5 rounded-xl bg-white/80 border border-black/10 text-xs font-semibold text-[#4A3A40] flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-[#D98A3C]" />
                <span>排行榜</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateProfile({ bgmEnabled: !profile.bgmEnabled })
                }
                className="min-h-[44px] px-2.5 rounded-xl bg-white/80 border border-black/10 text-xs font-semibold text-[#4A3A40] flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Music className="w-4 h-4" />
                <span>{profile.bgmEnabled ? '音樂開' : '音樂關'}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateProfile({ sfxEnabled: !profile.sfxEnabled })
                }
                className="min-h-[44px] px-2.5 rounded-xl bg-white/80 border border-black/10 text-xs font-semibold text-[#4A3A40] flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                {profile.sfxEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
                <span>{profile.sfxEnabled ? '音效開' : '音效關'}</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-[#7E6D73] pt-0.5">
            操作提示：點選欄位對準後按「確認下降」，支援鍵盤 ← / → 移動 · Space 降落 · Esc 暫停
          </p>
        </form>
      </div>
    </div>
  );
};
