import React from 'react';

interface ReRouteLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'markOnly';
  isLight?: boolean;
}

/**
 * ReRoute Official Logo Component
 * - Circular route / directional arrows representing material circulation
 * - Leaf at the center representing agricultural reuse
 * - Wordmark: "ReRoute"
 * - Tagline: "Waste to Worth."
 * - Primary colors: Forest Green (#17483C) and Sage Green (#8FBC8B), with Teal (#317787)
 */
export const ReRouteLogo: React.FC<ReRouteLogoProps> = ({
  className = '',
  variant = 'full',
  isLight = false,
}) => {
  const forestColor = isLight ? '#E6EEF2' : '#17483C';
  const sageColor = '#8FBC8B';
  const tealColor = '#317787';
  const wordmarkColor = isLight ? '#FFFFFF' : '#17483C';
  const taglineColor = isLight ? '#8FBC8B' : '#317787';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Circulation + Leaf Mark */}
      <svg
        width="38"
        height="38"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Outer Circular Route with directional gaps */}
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke={forestColor}
          strokeWidth="2.5"
          strokeDasharray="24 8"
          strokeLinecap="round"
          opacity="0.25"
        />
        {/* Top-Right Arrow Curve */}
        <path
          d="M12 24C12 17.3726 17.3726 12 24 12C28.2 12 31.9 14.16 34.1 17.5"
          stroke={forestColor}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M32 12L35 18L29 19"
          stroke={forestColor}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom-Left Arrow Curve */}
        <path
          d="M36 24C36 30.6274 30.6274 36 24 36C19.8 36 16.1 33.84 13.9 30.5"
          stroke={sageColor}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M16 36L13 30L19 29"
          stroke={sageColor}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Agricultural Leaf */}
        <path
          d="M24 16C24 16 30 19.5 30 25.5C30 29.5 27 32 24 32C21 32 18 29.5 18 25.5C18 19.5 24 16 24 16Z"
          fill={forestColor}
        />
        <path
          d="M24 19V29"
          stroke={sageColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M24 23L27 21"
          stroke={tealColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M24 26L21 24"
          stroke={sageColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Wordmark and Tagline */}
      {variant !== 'markOnly' && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline">
            <span
              className="text-xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-heading)', color: wordmarkColor }}
            >
              Re<span style={{ color: sageColor }}>Route</span>
            </span>
          </div>
          {variant === 'full' && (
            <span
              className="text-[10px] font-semibold tracking-wider uppercase mt-0.5"
              style={{ fontFamily: 'var(--font-body)', color: taglineColor }}
            >
              Waste to Worth.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ReRouteLogo;
