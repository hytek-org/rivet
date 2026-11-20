


interface LogoProps {
  size?: number;
  className?: string;
}

const INK = "var(--text-primary, #17191D)";
const SURFACE = "var(--bg-surface, #F5F5F3)";
const BLUE = "var(--rivet-blue, #4776A8)";

/**
 * RIVET — Original geometric brand symbol.
 * Transparent background, theme-aware foreground.
 */
export function RivetMark({
  size = 32,
  className = "",
}: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* Main geometric R */}
      <path
        d="
          M4 5
          H26.1
          C34.5 5 40 10.2 40 18.1
          C40 23.2 37.2 26.9 32.3 28.8
          L42 42
          H30
          L22.2 31.6
          H15.3
          L7.7 42
          H2.5
          L13.7 26.2
          H25.2
          C28.5 26.2 30.2 24.5 30.2 21.6
          V20.1
          C30.2 17.2 28.5 15.4 25.2 15.4
          H14.6
          L4 5
          Z
        "
        fill={INK}
      />

      {/* Blue structural connection */}
      <path
        d="
          M3 42
          L14.1 27.2
          C15.8 24.9 18.5 24.4 20.6 26.3
          L22 27.6
          L11 42
          H3
          Z
        "
        fill={BLUE}
      />

      {/* Connection point */}
      <circle cx="18.1" cy="25.8" r="4.6" fill={BLUE} />

      {/* Precision negative-space cutout */}
      <circle cx="18.1" cy="25.8" r="2.2" fill={SURFACE} />
    </svg>
  );
}

/**
 * RIVET application icon.
 * Brand colors remain consistent regardless of interface theme.
 */
export function RivetAppIcon({
  size = 48,
  className = "",
}: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      role="img"
      aria-label="RIVET application icon"
    >
      {/* Graphite app background */}
      <rect
        x="1.5"
        y="1.5"
        width="45"
        height="45"
        rx="11"
        fill="#17191D"
      />

      <g transform="translate(5.1 5.1) scale(0.7875)">
        {/* Main R */}
        <path
          d="
            M4 5
            H26.1
            C34.5 5 40 10.2 40 18.1
            C40 23.2 37.2 26.9 32.3 28.8
            L42 42
            H30
            L22.2 31.6
            H15.3
            L7.7 42
            H2.5
            L13.7 26.2
            H25.2
            C28.5 26.2 30.2 24.5 30.2 21.6
            V20.1
            C30.2 17.2 28.5 15.4 25.2 15.4
            H14.6
            L4 5
            Z
          "
          fill="#F5F5F3"
        />

        {/* Blue connection */}
        <path
          d="
            M3 42
            L14.1 27.2
            C15.8 24.9 18.5 24.4 20.6 26.3
            L22 27.6
            L11 42
            H3
            Z
          "
          fill="#4776A8"
        />

        <circle cx="18.1" cy="25.8" r="4.6" fill="#4776A8" />
        <circle cx="18.1" cy="25.8" r="2.2" fill="#17191D" />
      </g>
    </svg>
  );
}

/**
 * Complete RIVET wordmark.
 */
interface RivetWordmarkProps extends LogoProps {
  showLabel?: boolean;
}

export function RivetLogo({
  size = 30,
  className = "",
  showLabel = false,
}: RivetWordmarkProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <RivetMark size={size} />

      <span className="text-[15px] font-bold tracking-[0.16em] text-[var(--text-primary)]">
        RIVET
      </span>

      {showLabel && (
        <span className="hidden sm:inline-flex items-center rounded border border-[var(--border-color)] bg-[var(--bg-surface-raised)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
          HTTP WORKSPACE
        </span>
      )}
    </div>
  );
}
