"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Constellation } from "@/components/profile/constellation";
import { AddStep } from "@/components/plan/add-step";
import { BreakdownDialog } from "@/components/plan/breakdown-dialog";
import { CheckInReply, EnergyCheckIn } from "@/components/plan/energy-check-in";
import { AllDone, CurrentStep, Duration, NextStep, Pause } from "@/components/plan/step-card";
import {
  addSteps,
  checkInDue,
  completeStep,
  gentleTone,
  loadPlan,
  removeStep,
  resetCheckIn,
  savePlan,
  setEnergy,
  syncWithProfile,
  todayEnergy,
  visibleSteps,
  type Energy,
  type NewStep,
  type Plan,
  type PlanStep,
} from "@/lib/plan";
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
  const [newTask, setNewTask] = useState("");
  // stepId: break down an existing step (it is replaced); otherwise the typed task is broken down.
  const [request, setRequest] = useState<{ id: string; task: string; stepId?: string } | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const adaptations = toAdaptations(profile ?? {});
  const now = new Date();
  const energy = todayEnergy(plan, now);
  const flags = { explicitSteps: adaptations.explicitSteps, summaryMode: adaptations.summaryMode, gentleTone: gentleTone(energy) };

  function update(next: Plan) {
    setPlan(next);
    savePlan(next);
  }

  const shown = visibleSteps(plan, adaptations, energy);
  const [current, ...upNext] = shown;
  // importantFirst: only the current step stays on screen; everything else waits behind a count.
  const next = adaptations.importantFirst ? [] : upNext;
  const later = plan.steps.filter((s) => !s.done && s !== current && !next.includes(s));
  const done = plan.steps.filter((s) => s.done).length;

  function finish(id: string) {
    const updated = completeStep(plan, id, new Date());
    update(updated);
    const upcoming = visibleSteps(updated, adaptations, energy)[0];
    setAnnouncement(upcoming ? `Step done. Next: ${upcoming.title}` : "Step done. You finished every step.");
    setPaused(adaptations.gentlePacing && upcoming !== undefined);
  }

  function checkIn(level: Energy | null) {
    update(setEnergy(plan, level, new Date()));
    // The reply takes focus, so the step card must not grab it too.
    setAnnouncement("");
    setCheckedIn(true);
  }

  function addFromDialog(steps: NewStep[], source: PlanStep["source"]) {
    const parent = plan.steps.find((s) => s.id === request?.stepId);
    if (parent) {
      // The small steps take the big step's place and keep its icon and link.
      const inherited = steps.map((s) => ({ ...s, icon: parent.icon, href: parent.href }));
      update(removeStep(addSteps(plan, inherited, source, parent.id), parent.id));
    } else {
      update(addSteps(plan, steps, source));
      setNewTask("");
    }
    setRequest(null);
    setAnnouncement(`Added ${steps.length} ${steps.length === 1 ? "step" : "steps"}.`);
  }

  function addOne(title: string) {
    update(addSteps(plan, [{ title, minutes: 5 }], "user"));
    setNewTask("");
    setAnnouncement(`Added: ${title}`);
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
        {energy && <CheckInReply level={energy} focus={checkedIn} onChange={() => update(resetCheckIn(plan))} />}
      </header>

      {checkInDue(plan, now) && <EnergyCheckIn onChoose={checkIn} />}

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {paused ? (
        <Pause onContinue={() => setPaused(false)} />
      ) : current ? (
        <CurrentStep
            key={current.id}
            step={current}
            focus={announcement !== ""}
            breakdownFirst={adaptations.offerBreakdownFirst}
            prominentTime={adaptations.showDurations}
            onDone={() => finish(current.id)}
            onBreakdown={() => setRequest({ id: crypto.randomUUID(), task: current.title, stepId: current.id })}
          />
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

      <AddStep
        value={newTask}
        onChange={setNewTask}
        onAdd={addOne}
        onBreakdown={(task) => setRequest({ id: crypto.randomUUID(), task })}
      />

      {request && (
        <BreakdownDialog
          key={request.id}
          task={request.task}
          flags={flags}
          onAdd={addFromDialog}
          onClose={() => setRequest(null)}
        />
      )}
    </div>
  );
}
