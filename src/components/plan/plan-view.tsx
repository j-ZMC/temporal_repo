"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Constellation } from "@/components/profile/constellation";
import { AllDone, CurrentStep, Duration, NextStep, Pause } from "@/components/plan/step-card";
import { completeStep, loadPlan, removeStep, savePlan, syncWithProfile, visibleSteps, type Plan } from "@/lib/plan";
import { loadProfile, toAdaptations } from "@/lib/profile";
import { useHydrated } from "@/lib/use-hydrated";

// Plan and profile live in localStorage, so render only after hydration (same as the Profile flow).
export function PlanView() {
  return useHydrated() ? <View /> : null;
}

function View() {
  const [profile] = useState(loadProfile);
  const [plan, setPlan] = useState<Plan>(() => syncWithProfile(loadPlan(), profile !== null));
  const [announcement, setAnnouncement] = useState("");
  const [paused, setPaused] = useState(false);
  const [breakdownNote, setBreakdownNote] = useState(false);
  const adaptations = toAdaptations(profile ?? {});

  function update(next: Plan) {
    setPlan(next);
    savePlan(next);
  }

  const shown = visibleSteps(plan, adaptations);
  const [current, ...upNext] = shown;
  // importantFirst: only the current step stays on screen; everything else waits behind a count.
  const next = adaptations.importantFirst ? [] : upNext;
  const later = plan.steps.filter((s) => !s.done && s !== current && !next.includes(s));
  const done = plan.steps.filter((s) => s.done).length;

  function finish(id: string) {
    const updated = completeStep(plan, id, new Date());
    update(updated);
    setBreakdownNote(false);
    const upcoming = visibleSteps(updated, adaptations)[0];
    setAnnouncement(upcoming ? `Step done. Next: ${upcoming.title}` : "Step done. You finished every step.");
    setPaused(adaptations.gentlePacing && upcoming !== undefined);
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">Today</h1>
        <Constellation lit={plan.steps.map((s) => s.done)} label={`${done} of ${plan.steps.length} steps done`} />
        <p className="text-muted-foreground">
          {done} of {plan.steps.length} steps done
        </p>
        {!profile && (
          <p className="text-sm text-muted-foreground">
            These are the standard settings.{" "}
            <Link href="/profile" className="font-medium text-foreground underline underline-offset-4">
              Set up your profile
            </Link>{" "}
            to fit the plan to you.
          </p>
        )}
      </header>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {paused ? (
        <Pause onContinue={() => setPaused(false)} />
      ) : current ? (
        <div className="flex flex-col gap-3">
          <CurrentStep
            key={current.id}
            step={current}
            focus={announcement !== ""}
            breakdownFirst={adaptations.offerBreakdownFirst}
            prominentTime={adaptations.showDurations}
            onDone={() => finish(current.id)}
            onBreakdown={() => setBreakdownNote(true)}
          />
          {breakdownNote && (
            // shortcut: placeholder until the break-down dialog lands (My plan Task 5).
            <p role="status" className="text-sm text-muted-foreground">
              Breaking steps down with AI is coming in the next update.
            </p>
          )}
        </div>
      ) : (
        <AllDone focus={announcement !== ""} />
      )}

      {!paused && next.length > 0 && (
        <section aria-labelledby="up-next" className="flex flex-col gap-3">
          <h2 id="up-next" className="text-sm font-semibold text-muted-foreground">
            Up next
          </h2>
          <ul className="flex flex-col gap-2">
            {next.map((s) => (
              <NextStep key={s.id} step={s} />
            ))}
          </ul>
        </section>
      )}

      {later.length > 0 && (
        <details className="rounded-xl border bg-card">
          <summary className="cursor-pointer p-4 font-medium">
            {adaptations.importantFirst
              ? `${later.length} more ${later.length === 1 ? "step" : "steps"}, out of the way for now`
              : `See what's next (${later.length})`}
          </summary>
          <ul className="flex flex-col divide-y border-t">
            {later.map((s) => (
              <li key={s.id} className="flex items-center gap-3 p-4">
                <span className="flex-1">{s.title}</span>
                <Duration minutes={s.minutes} />
                <Button
                  variant="ghost"
                  className="h-11 px-4"
                  onClick={() => update(removeStep(plan, s.id))}
                  aria-label={`Remove: ${s.title}`}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
