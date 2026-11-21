import React from 'react';
import { ANIMAL_META, AnimalColor } from '../types/game';

interface AnimalTileSvgProps {
  color: AnimalColor;
  className?: string;
  isMatchedPreview?: boolean;
}

export const AnimalTileSvg: React.FC<AnimalTileSvgProps> = ({
  color,
  className = 'w-full h-full',
  isMatchedPreview = false,
}) => {
  const meta = ANIMAL_META[color];

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} transition-transform duration-150 ${
        isMatchedPreview ? 'scale-105' : ''
      }`}
      aria-label={meta.name}
      role="img"
    >
      <defs>
        <linearGradient id="wildRainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD6E4" />
          <stop offset="28%" stopColor="#FFF2B8" />
          <stop offset="56%" stopColor="#CFF5E2" />
          <stop offset="82%" stopColor="#CCE8FF" />
          <stop offset="100%" stopColor="#E9D8FF" />
        </linearGradient>
        <radialGradient id="softShine" cx="35%" cy="28%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {color === 'pink' && (
        <g>
          {/* Bunny Ears */}
          <ellipse
            cx="33"
            cy="21"
            rx="9"
            ry="17"
            transform="rotate(-10 33 21)"
            fill="#FFD7E2"
            stroke={meta.ink}
            strokeWidth="3"
          />
          <ellipse
            cx="33"
            cy="22"
            rx="4.5"
            ry="10"
            transform="rotate(-10 33 22)"
            fill="#FFB3C6"
          />
          <ellipse
            cx="67"
            cy="21"
            rx="9"
            ry="17"
            transform="rotate(10 67 21)"
            fill="#FFD7E2"
            stroke={meta.ink}
            strokeWidth="3"
          />
          <ellipse
            cx="67"
            cy="22"
            rx="4.5"
            ry="10"
            transform="rotate(10 67 22)"
            fill="#FFB3C6"
          />
          {/* Main Round Body */}
          <circle
            cx="50"
            cy="55"
            r="36"
            fill={meta.bg}
            stroke={meta.ink}
            strokeWidth="3.2"
          />
          <circle cx="50" cy="55" r="34" fill="url(#softShine)" />
          {/* Cheeks */}
          <ellipse cx="30" cy="60" rx="6" ry="3.8" fill="#FF9EB5" opacity="0.65" />
          <ellipse cx="70" cy="60" rx="6" ry="3.8" fill="#FF9EB5" opacity="0.65" />
          {/* Eyes */}
          <circle cx="37" cy="51" r="4.2" fill={meta.ink} />
          <circle cx="35.6" cy="49.5" r="1.4" fill="#FFFFFF" />
          <circle cx="63" cy="51" r="4.2" fill={meta.ink} />
          <circle cx="61.6" cy="49.5" r="1.4" fill="#FFFFFF" />
          {/* Nose & Mouth */}
          <ellipse cx="50" cy="57" rx="3.2" ry="2.2" fill="#F2859F" />
          <path
            d="M44 61.5 Q47 64.5 50 60.5 Q53 64.5 56 61.5"
            fill="none"
            stroke={meta.ink}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {color === 'yellow' && (
        <g>
          {/* Top Crest Tuft */}
          <path
            d="M45 19 Q48 9 53 16 Q58 9 57 20"
            fill="#FFF0B8"
            stroke={meta.ink}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Tiny Wings */}
          <ellipse
            cx="15"
            cy="58"
            rx="6"
            ry="10"
            transform="rotate(18 15 58)"
            fill="#FFE68C"
            stroke={meta.ink}
            strokeWidth="2.8"
          />
          <ellipse
            cx="85"
            cy="58"
            rx="6"
            ry="10"
            transform="rotate(-18 85 58)"
            fill="#FFE68C"
            stroke={meta.ink}
            strokeWidth="2.8"
          />
          {/* Main Round Body */}
          <circle
            cx="50"
            cy="54"
            r="36"
            fill={meta.bg}
            stroke={meta.ink}
            strokeWidth="3.2"
          />
          <circle cx="50" cy="54" r="34" fill="url(#softShine)" />
          {/* Cheeks */}
          <ellipse cx="29" cy="59" rx="6" ry="3.6" fill="#FFB288" opacity="0.65" />
          <ellipse cx="71" cy="59" rx="6" ry="3.6" fill="#FFB288" opacity="0.65" />
          {/* Eyes */}
          <circle cx="37" cy="50" r="4.2" fill={meta.ink} />
          <circle cx="35.6" cy="48.5" r="1.4" fill="#FFFFFF" />
          <circle cx="63" cy="50" r="4.2" fill={meta.ink} />
          <circle cx="61.6" cy="48.5" r="1.4" fill="#FFFFFF" />
          {/* Beak */}
          <path
            d="M44 56 Q50 53 56 56 L50 64 Z"
            fill="#FFA756"
            stroke={meta.ink}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </g>
      )}

      {color === 'blue' && (
        <g>
          {/* Main Round Body */}
          <circle
            cx="50"
            cy="53"
            r="37"
            fill={meta.bg}
            stroke={meta.ink}
            strokeWidth="3.2"
          />
          <circle cx="50" cy="53" r="35" fill="url(#softShine)" />
          {/* Seal Forehead Spots */}
          <circle cx="33" cy="36" r="2.2" fill="#94C9F2" />
          <circle cx="38" cy="32" r="1.6" fill="#94C9F2" />
          {/* Cream Muzzle */}
          <ellipse cx="50" cy="61" rx="15" ry="11" fill="#F4FAFF" />
          {/* Cheeks */}
          <ellipse cx="28" cy="58" rx="5.8" ry="3.5" fill="#F4A5BA" opacity="0.55" />
          <ellipse cx="72" cy="58" rx="5.8" ry="3.5" fill="#F4A5BA" opacity="0.55" />
          {/* Eyes */}
          <circle cx="36" cy="48" r="4.3" fill={meta.ink} />
          <circle cx="34.6" cy="46.5" r="1.5" fill="#FFFFFF" />
          <circle cx="64" cy="48" r="4.3" fill={meta.ink} />
          <circle cx="62.6" cy="46.5" r="1.5" fill="#FFFFFF" />
          {/* Nose & Mouth */}
          <ellipse cx="50" cy="56" rx="4.2" ry="2.8" fill={meta.ink} />
          <path
            d="M44 62 Q47 65 50 60 Q53 65 56 62"
            fill="none"
            stroke={meta.ink}
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          {/* Whiskers */}
          <path
            d="M27 56 L36 58 M26 62 L35 61 M73 56 L64 58 M74 62 L65 61"
            stroke={meta.ink}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
      )}

      {color === 'mint' && (
        <g>
          {/* Frog Eye Bumps */}
          <circle
            cx="34"
            cy="27"
            r="12"
            fill={meta.bg}
            stroke={meta.ink}
            strokeWidth="3.1"
          />
          <circle
            cx="66"
            cy="27"
            r="12"
            fill={meta.bg}
            stroke={meta.ink}
            strokeWidth="3.1"
          />
          {/* Main Round Face */}
          <circle
            cx="50"
            cy="55"
            r="35"
            fill={meta.bg}
            stroke={meta.ink}
            strokeWidth="3.2"
          />
          {/* Cover inner eye bump strokes */}
          <circle cx="34" cy="29" r="10.2" fill={meta.bg} />
          <circle cx="66" cy="29" r="10.2" fill={meta.bg} />
          <circle cx="50" cy="55" r="33" fill="url(#softShine)" />
          {/* Eyes inside bumps */}
          <circle cx="34" cy="28" r="6" fill="#FFFFFF" stroke={meta.ink} strokeWidth="2.2" />
          <circle cx="34" cy="28.5" r="3.2" fill={meta.ink} />
          <circle cx="32.8" cy="27.2" r="1.2" fill="#FFFFFF" />
          <circle cx="66" cy="28" r="6" fill="#FFFFFF" stroke={meta.ink} strokeWidth="2.2" />
          <circle cx="66" cy="28.5" r="3.2" fill={meta.ink} />
          <circle cx="64.8" cy="27.2" r="1.2" fill="#FFFFFF" />
          {/* Belly / Chin */}
          <ellipse cx="50" cy="69" rx="22" ry="14" fill="#E9FCF1" />
          {/* Cheeks */}
          <ellipse cx="29" cy="56" rx="6" ry="3.8" fill="#FFA8B8" opacity="0.65" />
          <ellipse cx="71" cy="56" rx="6" ry="3.8" fill="#FFA8B8" opacity="0.65" />
          {/* Big Happy Smile */}
          <path
            d="M38 56 Q50 65 62 56"
            fill="none"
            stroke={meta.ink}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </g>
      )}

      {color === 'lavender' && (
        <g>
          {/* Cat Ears */}
          <path
            d="M21 40 L24 15 L44 28 Z"
            fill={meta.bg}
            stroke={meta.ink}
            strokeWidth="3.1"
            strokeLinejoin="round"
          />
          <path d="M25 36 L27 20 L39 29 Z" fill="#F7C2E3" />
          <path
            d="M79 40 L76 15 L56 28 Z"
            fill={meta.bg}
            stroke={meta.ink}
            strokeWidth="3.1"
            strokeLinejoin="round"
          />
          <path d="M75 36 L73 20 L61 29 Z" fill="#F7C2E3" />
          {/* Main Round Body */}
          <circle
            cx="50"
            cy="55"
            r="35.5"
            fill={meta.bg}
            stroke={meta.ink}
            strokeWidth="3.2"
          />
          <circle cx="50" cy="55" r="33.5" fill="url(#softShine)" />
          {/* Forehead Stripes */}
          <path
            d="M50 22 L50 30 M44 24 L45 30 M56 24 L55 30"
            stroke="#B49AE0"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* Cheeks */}
          <ellipse cx="29" cy="60" rx="5.8" ry="3.5" fill="#F5A8CA" opacity="0.6" />
          <ellipse cx="71" cy="60" rx="5.8" ry="3.5" fill="#F5A8CA" opacity="0.6" />
          {/* Eyes */}
          <circle cx="37" cy="51" r="4.2" fill={meta.ink} />
          <circle cx="35.6" cy="49.5" r="1.4" fill="#FFFFFF" />
          <circle cx="63" cy="51" r="4.2" fill={meta.ink} />
          <circle cx="61.6" cy="49.5" r="1.4" fill="#FFFFFF" />
          {/* Nose & Mouth */}
          <polygon points="47,56 53,56 50,59.5" fill="#E88EB5" />
          <path
            d="M44 62 Q47 64.5 50 60.5 Q53 64.5 56 62"
            fill="none"
            stroke={meta.ink}
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          {/* Whiskers */}
          <path
            d="M19 54 L28 56 M18 61 L28 60 M81 54 L72 56 M82 61 L72 60"
            stroke={meta.ink}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
      )}

      {color === 'wild' && (
        <g>
          {/* Fluffy Rainbow Sheep Aura */}
          <circle
            cx="50"
            cy="52"
            r="38"
            fill="url(#wildRainbowGrad)"
            stroke={meta.ink}
            strokeWidth="3.2"
          />
          {/* Little Sheep Ears */}
          <ellipse
            cx="17"
            cy="50"
            rx="7.5"
            ry="5"
            transform="rotate(-22 17 50)"
            fill="#FFE6F0"
            stroke={meta.ink}
            strokeWidth="2.6"
          />
          <ellipse
            cx="83"
            cy="50"
            rx="7.5"
            ry="5"
            transform="rotate(22 83 50)"
            fill="#E3F2FF"
            stroke={meta.ink}
            strokeWidth="2.6"
          />
          {/* Fluffy Top Wool */}
          <path
            d="M30 33 Q35 22 44 27 Q50 18 57 27 Q66 22 70 33 Q64 40 50 39 Q36 40 30 33 Z"
            fill="#FFFFFF"
            stroke={meta.ink}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          {/* Warm Inner Face */}
          <ellipse cx="50" cy="58" rx="22" ry="18" fill="#FFFBF7" />
          {/* Golden Star Emblem */}
          <polygon
            points="50,24 52.3,29 57.5,29.5 53.6,33 54.7,38 50,35.4 45.3,38 46.4,33 42.5,29.5 47.7,29"
            fill="#FFD15C"
            stroke={meta.ink}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Eyes */}
          <circle cx="40" cy="56" r="3.7" fill={meta.ink} />
          <circle cx="38.8" cy="54.7" r="1.3" fill="#FFFFFF" />
          <circle cx="60" cy="56" r="3.7" fill={meta.ink} />
          <circle cx="58.8" cy="54.7" r="1.3" fill="#FFFFFF" />
          {/* Blush & Smile */}
          <ellipse cx="33" cy="61" rx="4.5" ry="2.6" fill="#FF9EB8" opacity="0.65" />
          <ellipse cx="67" cy="61" rx="4.5" ry="2.6" fill="#FF9EB8" opacity="0.65" />
          <path
            d="M46 62 Q50 66 54 62"
            fill="none"
            stroke={meta.ink}
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          {/* Twinkle Sparkles */}
          <path
            d="M22 25 L24 21 L26 25 L30 27 L26 29 L24 33 L22 29 L18 27 Z"
            fill="#FFCE54"
          />
          <path
            d="M78 72 L79.5 69 L81 72 L84 73.5 L81 75 L79.5 78 L78 75 L75 73.5 Z"
            fill="#9BD4FF"
          />
        </g>
      )}
    </svg>
  );
};
