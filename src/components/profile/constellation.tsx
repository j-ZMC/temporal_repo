// One star per item (profile question or plan step), joined into a constellation. Lit stars use star gold,
// the color reserved for achievements; the rest stay as quiet outlines.
const HEIGHTS = [58, 30, 46, 18, 38, 22, 50, 30];
const LEFT = 16;
const SPAN = 296;

export function Constellation({ lit, label }: { lit: boolean[]; label: string }) {
  const gap = lit.length > 1 ? SPAN / (lit.length - 1) : 0;
  const points = lit.map((_, i) => [LEFT + i * gap, HEIGHTS[i % HEIGHTS.length]] as const);
  const path = points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  // Keep stars from touching when a long plan packs them close together.
  const r = Math.min(6, Math.max(3, gap / 3));

  return (
    <svg viewBox="0 0 328 76" role="img" aria-label={label} className="h-auto w-full max-w-xs">
      <path d={path} fill="none" stroke="var(--border)" strokeWidth="1.5" strokeLinejoin="round" />
      {points.map(([x, y], i) =>
        lit[i] ? (
          <circle key={i} cx={x} cy={y} r={r} fill="var(--star)" />
        ) : (
          <circle key={i} cx={x} cy={y} r={r * 0.66} fill="var(--background)" stroke="var(--muted-foreground)" strokeWidth="1.5" />
        ),
      )}
    </svg>
  );
}
