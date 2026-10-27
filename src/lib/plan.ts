// My plan: the starter path, how steps are stored, and which steps to show now. See SPEC-plan.md.
// Components render and call these; teammates add steps from their modules with addStepToPlan().
import type { Adaptations } from "@/lib/profile";

export const STEP_ICONS = ["user", "briefcase", "bookmark", "building", "message", "calendar", "list"] as const;
export type StepIcon = (typeof STEP_ICONS)[number];

// Self-reported check-in. It stays on the device; the AI only ever gets gentleTone(energy).
export const ENERGY_LEVELS = ["low", "stressed", "okay", "good"] as const;
export type Energy = (typeof ENERGY_LEVELS)[number];

export function gentleTone(energy?: Energy): boolean {
  return energy === "low" || energy === "stressed";
}

export type PlanStep = {
  id: string;
  title: string;
  minutes: number;
  icon: StepIcon;
  href?: string;
  done: boolean;
  doneAt?: string;
  source: "starter" | "user" | "ai";
};

export type Plan = { version: 1; steps: PlanStep[]; energy?: { level: Energy; date: string } };

export type NewStep = { title: string; minutes: number; icon?: StepIcon; href?: string };

export const STARTER_STEPS: readonly Omit<PlanStep, "done" | "source">[] = [
  { id: "starter-profile", title: "Finish your profile", minutes: 3, icon: "user", href: "/profile" },
  { id: "starter-jobs", title: "Look at 3 jobs picked for you", minutes: 10, icon: "briefcase", href: "/jobs" },
  { id: "starter-save", title: "Save one job you like", minutes: 2, icon: "bookmark", href: "/jobs" },
  { id: "starter-company", title: "Read “Get to know the company” for that job", minutes: 5, icon: "building", href: "/jobs" },
  { id: "starter-practice", title: "Practice one interview question", minutes: 5, icon: "message", href: "/interview" },
  { id: "starter-expect", title: "Read “What to expect” for an interview", minutes: 5, icon: "calendar", href: "/interview" },
];

const PROFILE_STEP = "starter-profile";
const SHORT_STEP = 5;
const MAX_MINUTES = 60;
const MAX_TITLE = 80;

export function starterPlan(): Plan {
  return { version: 1, steps: STARTER_STEPS.map((s) => ({ ...s, done: false, source: "starter" })) };
}

// The profile step reflects reality: done once a profile exists.
export function syncWithProfile(plan: Plan, hasProfile: boolean): Plan {
  if (!hasProfile) return plan;
  return {
    ...plan,
    steps: plan.steps.map((s) => (s.id === PROFILE_STEP && !s.done ? { ...s, done: true } : s)),
  };
}

export function visibleSteps(plan: Plan, a: Adaptations, energy?: Energy): PlanStep[] {
  const todo = plan.steps.filter((s) => !s.done);
  if (energy === "low") {
    const short = todo.find((s) => s.minutes <= SHORT_STEP) ?? todo[0];
    return short ? [short] : [];
  }
  if (energy === "stressed") {
    // The easiest win first: the shortest step, earliest in the path on a tie.
    const easiest = todo.reduce<PlanStep | undefined>((best, s) => (!best || s.minutes < best.minutes ? s : best), undefined);
    return easiest ? [easiest] : [];
  }
  return todo.slice(0, a.stepsAtOnce);
}

export function completeStep(plan: Plan, id: string, now: Date): Plan {
  return {
    ...plan,
    steps: plan.steps.map((s) => (s.id === id ? { ...s, done: true, doneAt: now.toISOString() } : s)),
  };
}

export function addSteps(plan: Plan, steps: NewStep[], source: PlanStep["source"], afterId?: string): Plan {
  const created: PlanStep[] = steps.map((s) => ({
    id: crypto.randomUUID(),
    title: s.title.trim().slice(0, MAX_TITLE),
    minutes: Math.min(MAX_MINUTES, Math.max(1, Math.round(s.minutes))),
    icon: s.icon ?? "list",
    ...(s.href ? { href: s.href } : {}),
    done: false,
    source,
  }));
  const at = afterId ? plan.steps.findIndex((s) => s.id === afterId) + 1 : plan.steps.length;
  const index = at > 0 ? at : plan.steps.length;
  return { ...plan, steps: [...plan.steps.slice(0, index), ...created, ...plan.steps.slice(index)] };
}

export function removeStep(plan: Plan, id: string): Plan {
  return { ...plan, steps: plan.steps.filter((s) => s.id !== id) };
}

const STORAGE_KEY = "plan";

// Storage can be edited by hand: keep only well-formed steps, and only same-site links.
function validStep(raw: unknown): raw is PlanStep {
  if (typeof raw !== "object" || raw === null) return false;
  const s = raw as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.title === "string" &&
    s.title.trim().length > 0 &&
    s.title.length <= MAX_TITLE &&
    Number.isInteger(s.minutes) &&
    (s.minutes as number) >= 1 &&
    (s.minutes as number) <= MAX_MINUTES &&
    (STEP_ICONS as readonly unknown[]).includes(s.icon) &&
    (s.href === undefined || (typeof s.href === "string" && s.href.startsWith("/") && !s.href.startsWith("//"))) &&
    typeof s.done === "boolean" &&
    (s.doneAt === undefined || typeof s.doneAt === "string") &&
    (s.source === "starter" || s.source === "user" || s.source === "ai")
  );
}

function validEnergy(raw: unknown): raw is Plan["energy"] {
  if (typeof raw !== "object" || raw === null) return false;
  const e = raw as Record<string, unknown>;
  return (ENERGY_LEVELS as readonly unknown[]).includes(e.level) && typeof e.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.date);
}

export function loadPlan(): Plan {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return starterPlan();
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !Array.isArray(data.steps)) return starterPlan();
    const plan: Plan = { version: 1, steps: data.steps.filter(validStep) };
    if (validEnergy(data.energy)) plan.energy = data.energy;
    return plan;
  } catch {
    return starterPlan();
  }
}

export function savePlan(plan: Plan): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch {
    // Private mode or blocked storage: the plan keeps working in memory for this visit.
  }
}

// For teammates: add a step from another module, e.g. Jobs adding "Read the job at Acme".
export function addStepToPlan(step: NewStep): void {
  savePlan(addSteps(loadPlan(), [step], "user"));
}
