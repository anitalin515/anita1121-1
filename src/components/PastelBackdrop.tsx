import React from 'react';
import { BackgroundTheme } from '../types/game';

interface PastelBackdropProps {
  theme: BackgroundTheme;
}

export const PastelBackdrop: React.FC<PastelBackdropProps> = ({ theme }) => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-500"
      aria-hidden="true"
    >
      {theme === 'garden' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(165deg, #FFF5F8 0%, #FDF8FA 48%, #F1FAF4 100%)',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-75"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Soft meadow hills */}
            <path
              d="M0 780 Q320 710 660 770 T1200 740 L1200 900 L0 900 Z"
              fill="#E2F4E8"
            />
            <path
              d="M0 830 Q450 770 860 820 T1200 800 L1200 900 L0 900 Z"
              fill="#D4EEDD"
            />
            {/* Top-left sakura branch */}
            <path
              d="M-20 120 Q120 140 230 90"
              stroke="#E6C6CF"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            {[
              { x: 75, y: 128, r: 18, c: '#FCD5E1' },
              { x: 148, y: 112, r: 22, c: '#FADCE6' },
              { x: 215, y: 92, r: 15, c: '#FDE6EE' },
              { x: 1020, y: 140, r: 20, c: '#FCD5E1' },
              { x: 1085, y: 175, r: 16, c: '#FADCE6' },
              { x: 140, y: 790, r: 14, c: '#FFE4ED' },
              { x: 960, y: 785, r: 16, c: '#FFF2C6' },
            ].map((flower, i) => (
              <g key={i} transform={`translate(${flower.x}, ${flower.y})`}>
                <circle cx="0" cy={-flower.r * 0.55} r={flower.r * 0.45} fill={flower.c} />
                <circle cx={flower.r * 0.52} cy={-flower.r * 0.15} r={flower.r * 0.45} fill={flower.c} />
                <circle cx={flower.r * 0.34} cy={flower.r * 0.45} r={flower.r * 0.45} fill={flower.c} />
                <circle cx={-flower.r * 0.34} cy={flower.r * 0.45} r={flower.r * 0.45} fill={flower.c} />
                <circle cx={-flower.r * 0.52} cy={-flower.r * 0.15} r={flower.r * 0.45} fill={flower.c} />
                <circle cx="0" cy="0" r={flower.r * 0.25} fill="#FFE28A" />
              </g>
            ))}
          </svg>
        </div>
      )}

      {theme === 'zoo' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(170deg, #FFFBF0 0%, #FDF6E4 55%, #EFF7E6 100%)',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-75"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Pastel festival bunting */}
            <path
              d="M0 75 Q300 135 600 75 T1200 75"
              fill="none"
              stroke="#DFCBB0"
              strokeWidth="3"
            />
            {[110, 210, 310, 890, 990, 1090].map((x, idx) => (
              <polygon
                key={idx}
                points={`${x - 18},88 ${x + 18},88 ${x},126`}
                fill={['#FAD7E0', '#FDE9B2', '#CFE9F8', '#D3F1DF'][idx % 4]}
              />
            ))}
            {/* Gentle tree canopies */}
            <circle cx="110" cy="790" r="130" fill="#E3F0D5" />
            <circle cx="220" cy="830" r="95" fill="#DAEBC9" />
            <circle cx="1090" cy="795" r="135" fill="#E3F0D5" />
            <circle cx="980" cy="840" r="90" fill="#DAEBC9" />
            {/* Wooden fence silhouette */}
            <g fill="#EFE2CE">
              <rect x="40" y="810" width="18" height="90" rx="6" />
              <rect x="95" y="810" width="18" height="90" rx="6" />
              <rect x="1085" y="810" width="18" height="90" rx="6" />
              <rect x="1140" y="810" width="18" height="90" rx="6" />
              <rect x="20" y="838" width="120" height="12" rx="4" />
              <rect x="1060" y="838" width="120" height="12" rx="4" />
            </g>
          </svg>
        </div>
      )}

      {theme === 'french' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(175deg, #FCF8F3 0%, #FAF2EA 55%, #F7EAE4 100%)',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-70"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Delicate polka dot wallpaper */}
            <pattern id="frenchDots" width="48" height="48" patternUnits="userSpaceOnUse">
              <circle cx="24" cy="24" r="2.2" fill="#E6D5CC" />
            </pattern>
            <rect width="1200" height="900" fill="url(#frenchDots)" opacity="0.6" />
            {/* Parisian cafe scalloped top */}
            <g fill="#F3DDD6">
              {Array.from({ length: 15 }).map((_, i) => (
                <circle key={i} cx={i * 85 + 20} cy="0" r="46" />
              ))}
            </g>
            {/* Soft Eiffel Tower silhouette on right */}
            <g stroke="#DEC5BA" strokeWidth="4" fill="none" opacity="0.65">
              <path d="M1040 310 L1020 560 L965 780 M1040 310 L1060 560 L1115 780" />
              <path d="M1012 520 L1068 520 M995 630 L1085 630" />
              <path d="M1006 780 Q1040 725 1074 780" />
              <line x1="1040" y1="270" x2="1040" y2="310" />
            </g>
            {/* Soft croissant/macaron motif left bottom */}
            <ellipse cx="140" cy="790" rx="52" ry="18" fill="#F2D7DC" />
            <ellipse cx="140" cy="782" rx="54" ry="8" fill="#FFF9F6" />
            <ellipse cx="140" cy="772" rx="52" ry="16" fill="#F6DFE3" />
          </svg>
        </div>
      )}

      {theme === 'beach' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #ECF9FA 0%, #E3F6F5 48%, #FBF3E4 100%)',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-80"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Soft sea & gentle foam */}
            <path
              d="M0 610 Q280 570 580 610 T1200 590 L1200 900 L0 900 Z"
              fill="#D2EFF2"
            />
            <path
              d="M0 680 Q320 645 640 685 T1200 665 L1200 900 L0 900 Z"
              fill="#FFFFFF"
              opacity="0.65"
            />
            {/* Warm sand shore */}
            <path
              d="M0 710 Q340 675 680 715 T1200 695 L1200 900 L0 900 Z"
              fill="#FAECD6"
            />
            {/* Sun halo */}
            <circle cx="150" cy="140" r="68" fill="#FFF3C4" opacity="0.7" />
            {/* Cute pastel starfish */}
            <polygon
              points="180,790 190,812 214,815 196,831 200,855 180,843 160,855 164,831 146,815 170,812"
              fill="#F9C7C7"
            />
            {/* Seashell */}
            <path
              d="M1010 830 Q1040 785 1070 830 Q1040 842 1010 830 Z"
              fill="#F7D9D9"
            />
          </svg>
        </div>
      )}

      {theme === 'sky' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #E2F1FF 0%, #EEF7FF 55%, #F8FCFF 100%)',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Soft sun glow */}
            <circle cx="1030" cy="140" r="78" fill="#FFF6CC" opacity="0.8" />
            {/* Fluffy clouds */}
            <g className="animate-float-slow" fill="#FFFFFF" opacity="0.9">
              <circle cx="140" cy="180" r="46" />
              <circle cx="195" cy="165" r="56" />
              <circle cx="255" cy="182" r="42" />
              <rect x="135" y="180" width="125" height="46" rx="22" />
            </g>
            <g className="animate-float-slow" fill="#FFFFFF" opacity="0.85">
              <circle cx="940" cy="340" r="40" />
              <circle cx="990" cy="325" r="50" />
              <circle cx="1045" cy="342" r="38" />
              <rect x="935" y="340" width="115" height="40" rx="20" />
            </g>
            <g fill="#FFFFFF" opacity="0.75">
              <circle cx="190" cy="740" r="55" />
              <circle cx="265" cy="720" r="72" />
              <circle cx="345" cy="745" r="52" />
              <circle cx="980" cy="760" r="65" />
              <circle cx="1060" cy="735" r="80" />
            </g>
          </svg>
        </div>
      )}

      {theme === 'leisurely' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(165deg, #F5F1FD 0%, #F9F6FE 50%, #FFF7F2 100%)',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-75"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Soft lavender sprigs */}
            <g stroke="#C6B5EA" strokeWidth="3.5" fill="none">
              <path d="M120 880 Q135 760 155 660" />
              <path d="M165 880 Q180 780 198 690" />
            </g>
            {[
              [155, 670],
              [145, 695],
              [162, 705],
              [142, 725],
              [198, 700],
              [188, 725],
              [204, 735],
            ].map(([cx, cy], idx) => (
              <ellipse
                key={idx}
                cx={cx}
                cy={cy}
                rx="7"
                ry="11"
                fill="#D7C7F7"
              />
            ))}
            {/* Cozy teacup right corner */}
            <path
              d="M990 770 L1090 770 Q1086 832 1040 832 Q994 832 990 770 Z"
              fill="#EADFF9"
            />
            <ellipse cx="1040" cy="838" rx="64" ry="10" fill="#E1D3F5" />
            <path
              d="M1088 782 Q1112 782 1110 802 Q1108 816 1084 816"
              fill="none"
              stroke="#D6C4F0"
              strokeWidth="6"
            />
            <path
              d="M1022 745 Q1016 725 1026 708 M1052 745 Q1046 725 1056 708"
              fill="none"
              stroke="#DDD1F2"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {theme === 'relaxing' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(170deg, #EEF8F1 0%, #F5FBF7 52%, #FBF9F0 100%)',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-75"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Soft sunlit bokeh */}
            <circle cx="180" cy="210" r="90" fill="#DDF2E4" opacity="0.65" />
            <circle cx="1040" cy="240" r="110" fill="#E3F4EA" opacity="0.6" />
            <circle cx="960" cy="720" r="85" fill="#F8F1D5" opacity="0.6" />
            {/* Botanical leaves */}
            <g fill="#CDEAD7">
              <ellipse cx="110" cy="780" rx="28" ry="62" transform="rotate(-25 110 780)" />
              <ellipse cx="165" cy="805" rx="22" ry="52" transform="rotate(15 165 805)" />
              <ellipse cx="1090" cy="790" rx="28" ry="62" transform="rotate(24 1090 790)" />
              <ellipse cx="1035" cy="815" rx="22" ry="50" transform="rotate(-14 1035 815)" />
            </g>
          </svg>
        </div>
      )}

      {theme === 'bakery' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(170deg, #FFF5F7 0%, #FFF9F3 52%, #FCEEF2 100%)',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-80"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Pastel striped awning */}
            {Array.from({ length: 16 }).map((_, i) => (
              <rect
                key={i}
                x={i * 75}
                y="0"
                width="75"
                height="48"
                fill={i % 2 === 0 ? '#FADBE3' : '#FFF8F3'}
              />
            ))}
            {/* Soft cupcake left bottom */}
            <path d="M100 790 L180 790 L166 845 L114 845 Z" fill="#F4D7C8" />
            <path
              d="M94 790 Q98 748 140 748 Q182 748 186 790 Z"
              fill="#FAD2DF"
            />
            <circle cx="140" cy="744" r="10" fill="#F59BB2" />
            {/* Donut / pastry right */}
            <circle cx="1040" cy="790" r="48" fill="#F7E0C8" />
            <circle cx="1040" cy="790" r="42" fill="#FDE2EB" />
            <circle cx="1040" cy="790" r="17" fill="#FCEEF2" />
            {/* Sugar sprinkles */}
            <circle cx="1020" cy="768" r="3" fill="#FFF0A8" />
            <circle cx="1062" cy="772" r="3" fill="#BFE7FA" />
            <circle cx="1055" cy="812" r="3" fill="#C7F0DB" />
          </svg>
        </div>
      )}

      {theme === 'forest' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(175deg, #EEF6F0 0%, #F4F9F3 52%, #E8F2E8 100%)',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-80"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Misty distant hills */}
            <path
              d="M0 730 Q300 660 620 720 T1200 700 L1200 900 L0 900 Z"
              fill="#DCECDD"
            />
            {/* Pine tree silhouettes */}
            <g fill="#CDE2CF">
              <polygon points="110,610 55,780 165,780" />
              <polygon points="190,650 140,800 240,800" />
              <polygon points="1030,620 975,790 1085,790" />
              <polygon points="1110,660 1060,810 1160,810" />
            </g>
            {/* Cute pastel mushrooms */}
            <rect x="130" y="810" width="16" height="28" rx="6" fill="#FBF5EB" />
            <path d="M110 815 Q138 775 166 815 Z" fill="#F6C8CF" />
            <circle cx="130" cy="802" r="4" fill="#FFF9F7" />
            <circle cx="146" cy="806" r="3" fill="#FFF9F7" />
            {/* Firefly soft glow */}
            <circle cx="240" cy="260" r="14" fill="#FFF6C9" opacity="0.7" />
            <circle cx="960" cy="290" r="18" fill="#FFF6C9" opacity="0.65" />
          </svg>
        </div>
      )}

      {theme === 'starlight' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #EFEBFB 0%, #F5F2FD 54%, #FBEFF6 100%)',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-85"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Soft crescent moon */}
            <circle cx="160" cy="150" r="48" fill="#FFF2B8" />
            <circle cx="180" cy="140" r="42" fill="#EFEBFB" />
            {/* Pastel stars */}
            {[
              [260, 110, 10],
              [990, 140, 12],
              [1080, 220, 8],
              [120, 320, 9],
              [1030, 680, 11],
              [180, 740, 10],
            ].map(([x, y, r], i) => (
              <polygon
                key={i}
                points={`${x},${y - r} ${x + r * 0.3},${y - r * 0.3} ${x + r},${y} ${x + r * 0.3},${y + r * 0.3} ${x},${y + r} ${x - r * 0.3},${y + r * 0.3} ${x - r},${y} ${x - r * 0.3},${y - r * 0.3}`}
                fill="#FFE9A3"
              />
            ))}
            {/* Dreamy pastel clouds */}
            <g fill="#FFFFFF" opacity="0.8">
              <circle cx="140" cy="820" r="60" />
              <circle cx="220" cy="805" r="76" />
              <circle cx="305" cy="825" r="58" />
              <circle cx="980" cy="815" r="64" />
              <circle cx="1065" cy="800" r="78" />
            </g>
          </svg>
        </div>
      )}

      {theme === 'japanese' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #FDF6F2 0%, #FCF8F4 55%, #F8EEEB 100%)',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-80"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Gentle Mt. Fuji silhouette */}
            <polygon
              points="760,900 950,620 1050,620 1240,900"
              fill="#DCE9F5"
            />
            <polygon
              points="915,672 950,620 1050,620 1085,672 1045,658 1005,676 960,658"
              fill="#FFFFFF"
            />
            {/* Soft sun circle */}
            <circle cx="1010" cy="210" r="66" fill="#FAD7D7" opacity="0.7" />
            {/* Sakura petals */}
            <g fill="#FAD0DC">
              <ellipse cx="140" cy="170" rx="12" ry="7" transform="rotate(28 140 170)" />
              <ellipse cx="210" cy="230" rx="10" ry="6" transform="rotate(-18 210 230)" />
              <ellipse cx="165" cy="760" rx="12" ry="7" transform="rotate(35 165 760)" />
              <ellipse cx="240" cy="810" rx="11" ry="6" transform="rotate(-24 240 810)" />
            </g>
          </svg>
        </div>
      )}

      {theme === 'autumn' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(175deg, #FFF7EE 0%, #FDF4EA 55%, #FBECE0 100%)',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-80"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Warm sunbeams */}
            <circle cx="150" cy="140" r="88" fill="#FFE7C2" opacity="0.6" />
            {/* Soft pastel hills */}
            <path
              d="M0 780 Q360 720 720 770 T1200 750 L1200 900 L0 900 Z"
              fill="#F7DEC8"
            />
            {/* Floating autumn leaves */}
            {[
              { x: 130, y: 260, rot: -20, c: '#F5B89E' },
              { x: 1050, y: 210, rot: 25, c: '#F8CA9D' },
              { x: 190, y: 740, rot: 15, c: '#F3B49E' },
              { x: 1010, y: 760, rot: -30, c: '#F8D49E' },
            ].map((leaf, i) => (
              <g
                key={i}
                transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rot})`}
                fill={leaf.c}
              >
                <ellipse cx="0" cy="0" rx="18" ry="11" />
                <ellipse cx="-8" cy="-10" rx="11" ry="7" transform="rotate(-35 -8 -10)" />
                <ellipse cx="8" cy="-10" rx="11" ry="7" transform="rotate(35 8 -10)" />
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
};
