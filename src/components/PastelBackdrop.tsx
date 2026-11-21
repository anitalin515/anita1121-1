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
    </div>
  );
};
