import React, { useRef } from 'react';
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ANIMAL_META,
  BaseAnimalColor,
  FloatingScore,
  GRID_COLS,
  GRID_ROWS,
  GridMatrix,
  THEME_META,
  BackgroundTheme,
} from '../types/game';
import { getLandingRow, previewMatchKeys } from '../utils/gameLogic';
import { AnimalTileSvg } from './AnimalTileSvg';

interface GameBoardProps {
  grid: GridMatrix;
  activeColumn: number;
  currentOrb: BaseAnimalColor;
  nextOrb: BaseAnimalColor;
  clearingKeys: Set<string>;
  floatingScores: FloatingScore[];
  isResolving: boolean;
  nearDanger: boolean;
  theme: BackgroundTheme;
  comboCount: number;
  onSelectColumn: (col: number) => void;
  onMoveColumn: (delta: number) => void;
  onConfirmDrop: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  activeColumn,
  currentOrb,
  nextOrb,
  clearingKeys,
  floatingScores,
  isResolving,
  nearDanger,
  theme,
  comboCount,
  onSelectColumn,
  onMoveColumn,
  onConfirmDrop,
}) => {
  const touchStartXRef = useRef<number | null>(null);
  const themeMeta = THEME_META[theme];
  const landingRow = getLandingRow(grid, activeColumn);
  const matchPreview = isResolving
    ? new Set<string>()
    : previewMatchKeys(grid, activeColumn, currentOrb);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(dx) > 36) {
      onMoveColumn(dx > 0 ? 1 : -1);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[430px] mx-auto select-none">
      {/* Top Launcher Area: Active Orb + Next Preview */}
      <div className="w-full flex items-center justify-between gap-2 mb-1.5 px-1">
        <div className="text-xs font-semibold text-[#5E4D53]">
          對準第 <span className="font-score font-bold">{activeColumn + 1}</span> 欄
          <span className="mx-1.5 opacity-40">·</span>
          <span>{ANIMAL_META[currentOrb].name}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {comboCount >= 2 && (
            <span className="text-xs font-bold text-[#D95D7E] mr-1">
              {comboCount} 連鎖!
            </span>
          )}
          <span className="text-xs text-[#736268]">下一個</span>
          <div className="w-7 h-7">
            <AnimalTileSvg color={nextOrb} />
          </div>
        </div>
      </div>

      {/* Column Launcher Track */}
      <div className="w-full grid grid-cols-7 gap-1 px-2 py-1 rounded-t-2xl bg-white/75 border border-b-0 border-black/10">
        {Array.from({ length: GRID_COLS }).map((_, col) => {
          const isActive = col === activeColumn;
          return (
            <button
              key={col}
              type="button"
              onClick={() => onSelectColumn(col)}
              aria-label={`對準第 ${col + 1} 欄`}
              className={`h-11 sm:h-12 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                isActive ? 'bg-black/5' : 'hover:bg-black/3'
              }`}
            >
              {isActive && !isResolving ? (
                <div className="w-9 h-9 sm:w-10 sm:h-10 animate-tile-settle">
                  <AnimalTileSvg color={currentOrb} />
                </div>
              ) : (
                <span className="w-2 h-2 rounded-full bg-black/10" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main 7x10 Playfield Grid */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-[7/10] max-h-[60dvh] rounded-b-2xl border border-black/12 shadow-sm overflow-hidden p-2"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.84)' }}
      >
        {/* Top Danger Line (Row 0 bottom edge) */}
        <div
          className={`absolute left-2 right-2 z-20 pointer-events-none flex items-center justify-end pr-1.5 ${
            nearDanger ? 'animate-danger-soft' : 'opacity-70'
          }`}
          style={{ top: '10%' }}
        >
          <div className="w-full border-t-2 border-dashed border-[#E0526D]" />
          <span className="ml-1.5 text-[10px] font-bold text-[#D13F5C] bg-white/90 px-1 rounded whitespace-nowrap -mt-2.5">
            警示線
          </span>
        </div>

        {/* Danger Zone Row 0 Soft Tint */}
        <div
          className="absolute left-0 right-0 top-0 pointer-events-none bg-[#FFE6EB]/45"
          style={{ height: '10%' }}
        />

        {/* Active Column Highlight & Ghost Landing Spot */}
        <div className="relative w-full h-full grid grid-cols-7 grid-rows-10 gap-1">
          {Array.from({ length: GRID_ROWS }).map((_, r) =>
            Array.from({ length: GRID_COLS }).map((__, c) => {
              const tile = grid[r][c];
              const key = `${r},${c}`;
              const isClearing = clearingKeys.has(key);
              const isMatchTarget = matchPreview.has(key);
              const isActiveCol = c === activeColumn;
              const isGhostLanding =
                !isResolving && isActiveCol && r === landingRow && !tile;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectColumn(c)}
                  aria-label={`第 ${r + 1} 列 第 ${c + 1} 欄`}
                  className={`relative w-full h-full rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                    isActiveCol ? 'bg-black/[0.035]' : ''
                  }`}
                >
                  {/* Ghost Landing Indicator */}
                  {isGhostLanding && (
                    <div className="w-[82%] h-[82%] rounded-full border-2 border-dashed border-black/25 bg-white/50 flex items-center justify-center opacity-70">
                      <div className="w-[75%] h-[75%] opacity-45">
                        <AnimalTileSvg color={currentOrb} />
                      </div>
                    </div>
                  )}

                  {/* Active Tile */}
                  {tile && (
                    <div
                      className={`w-[92%] h-[92%] relative flex items-center justify-center ${
                        isClearing
                          ? 'animate-pop-clear'
                          : tile.justSettled
                          ? 'animate-tile-settle'
                          : ''
                      }`}
                    >
                      <AnimalTileSvg
                        color={tile.color}
                        isMatchedPreview={isMatchTarget}
                      />
                      {isMatchTarget && !isClearing && (
                        <span
                          className="absolute inset-0 rounded-full ring-2 ring-[#E85D82] pointer-events-none"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  )}
                </button>
              );
            })
          )}

          {/* Floating Score Popups */}
          {floatingScores.map((item) => (
            <div
              key={item.id}
              className="absolute z-30 pointer-events-none animate-score-float font-display font-black text-sm sm:text-base whitespace-nowrap drop-shadow-sm"
              style={{
                left: `${((item.col + 0.5) / GRID_COLS) * 100}%`,
                top: `${((item.row + 0.35) / GRID_ROWS) * 100}%`,
                color: item.combo >= 2 ? '#D9436D' : '#433339',
              }}
            >
              {item.combo >= 2
                ? `連鎖 +${item.points}!`
                : item.isWild
                ? `彩虹 +${item.points}!`
                : `+${item.points}`}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Thumb Controls (Touch >= 44px) */}
      <div className="w-full grid grid-cols-12 gap-2 mt-2.5">
        <button
          type="button"
          onClick={() => onMoveColumn(-1)}
          disabled={isResolving || activeColumn <= 0}
          aria-label="向左移動一欄"
          className="col-span-3 min-h-[48px] rounded-2xl bg-white/90 hover:bg-white active:scale-[0.97] disabled:opacity-40 border border-black/10 flex items-center justify-center text-[#433339] shadow-sm transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={onConfirmDrop}
          disabled={isResolving || landingRow < 0}
          className="col-span-6 min-h-[48px] rounded-2xl text-white font-display font-bold text-base sm:text-lg shadow-sm active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          style={{ backgroundColor: themeMeta.accent }}
        >
          <ArrowDown className="w-5 h-5" />
          <span>確認下降</span>
        </button>

        <button
          type="button"
          onClick={() => onMoveColumn(1)}
          disabled={isResolving || activeColumn >= GRID_COLS - 1}
          aria-label="向右移動一欄"
          className="col-span-3 min-h-[48px] rounded-2xl bg-white/90 hover:bg-white active:scale-[0.97] disabled:opacity-40 border border-black/10 flex items-center justify-center text-[#433339] shadow-sm transition-all cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
