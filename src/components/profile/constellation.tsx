// One star per item (profile question or plan step), joined into a constellation. Lit stars use star gold,
// the color reserved for achievements; the rest stay as quiet outlines.
const HEIGHTS = [58, 30, 46, 18, 38, 22, 50, 30];
const LEFT = 16;
const SPAN = 296;

const WIDTH = 328;
const HEIGHT = 76;

// names + onSelect turn each star into a button (My plan); without them it is a picture (Profile).
export function Constellation({
  lit,
  label,
  names,
  onSelect,
}: {
  lit: boolean[];
  label: string;
  names?: string[];
  onSelect?: (index: number) => void;
}) {
  const gap = lit.length > 1 ? SPAN / (lit.length - 1) : 0;
  const points = lit.map((_, i) => [LEFT + i * gap, HEIGHTS[i % HEIGHTS.length]] as const);
  const path = points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  // Keep stars from touching when a long plan packs them close together.
  const r = Math.min(6, Math.max(3, gap / 3));

  const picture = (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role={onSelect ? undefined : "img"}
      aria-label={onSelect ? undefined : label}
      aria-hidden={onSelect ? true : undefined}
      className="h-auto w-full max-w-xs"
    >
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
  if (!onSelect) return picture;

  return (
    <div role="group" aria-label={label} className="relative w-full max-w-xs">
      {picture}
      {points.map(([x, y], i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${names?.[i] ?? `Step ${i + 1}`}, ${lit[i] ? "done" : "not done"}`}
          // shortcut: targets are 44 px while stars are at least 44 px apart (up to about 8 steps); longer plans get smaller targets, but every step stays reachable from the lists below.
          style={{ left: `${(x / WIDTH) * 100}%`, top: `${(y / HEIGHT) * 100}%`, width: gap ? `min(44px, ${(gap / WIDTH) * 100}%)` : "44px" }}
          className="absolute aspect-square min-w-6 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none hover:bg-primary/10 hover:ring-2 hover:ring-primary/30 focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      ))}
    </div>
  );
}
