// One star per profile question, joined into a constellation. Answered stars light up in star gold,
// the color reserved for achievements; the rest stay as quiet outlines.
const POINTS = [
  [16, 58],
  [58, 30],
  [100, 46],
  [142, 18],
  [186, 38],
  [228, 22],
  [270, 50],
  [312, 30],
] as const;

export function Constellation({ lit, label }: { lit: boolean[]; label: string }) {
  const path = POINTS.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <svg viewBox="0 0 328 76" role="img" aria-label={label} className="h-auto w-full max-w-xs">
      <path d={path} fill="none" stroke="var(--border)" strokeWidth="1.5" strokeLinejoin="round" />
      {POINTS.map(([x, y], i) =>
        lit[i] ? (
          <circle key={i} cx={x} cy={y} r="6" fill="var(--star)" />
        ) : (
          <circle key={i} cx={x} cy={y} r="4" fill="var(--background)" stroke="var(--muted-foreground)" strokeWidth="1.5" />
        ),
      )}
    </svg>
  );
}
