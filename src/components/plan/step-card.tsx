"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Clock,
  ListChecks,
  MessagesSquare,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { PlanStep, StepIcon } from "@/lib/plan";
import { cn } from "@/lib/utils";

const ICONS: Record<StepIcon, LucideIcon> = {
  user: UserRound,
  briefcase: BriefcaseBusiness,
  bookmark: Bookmark,
  building: Building2,
  message: MessagesSquare,
  calendar: CalendarDays,
  list: ListChecks,
};

const action = "h-11 px-5 text-base";

// The one thing to do now: icon, verb-first title, duration, and its actions.
export function CurrentStep({
  step,
  focus,
  breakdownFirst,
  prominentTime,
  onDone,
  onBreakdown,
}: {
  step: PlanStep;
  focus: boolean;
  breakdownFirst: boolean;
  prominentTime: boolean;
  onDone: () => void;
  onBreakdown: () => void;
}) {
  const Icon = ICONS[step.icon];
  const breakdown = (
    <Button variant={breakdownFirst ? "default" : "ghost"} className={action} onClick={onBreakdown}>
      Break it down for me
    </Button>
  );
  const heading = useRef<HTMLHeadingElement>(null);
  // After Done, the button is gone; land keyboard and screen-reader users on the new step.
  useEffect(() => {
    if (focus) heading.current?.focus();
  }, [focus]);
  return (
    // The one weighted surface on the page: everything else stays flat so this reads as "do this now".
    <article
      aria-labelledby={`step-${step.id}`}
      className="flex flex-col gap-5 rounded-2xl border border-primary/15 bg-card p-5 shadow-[0_10px_30px_-14px_rgb(36_59_83/0.35)] sm:p-7"
    >
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-primary">
          <Icon className="size-6" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <h2 id={`step-${step.id}`} ref={heading} tabIndex={-1} className="text-2xl font-semibold text-balance outline-none">
            {step.title}
          </h2>
          <Duration
            minutes={step.minutes}
            className={prominentTime ? "w-fit rounded-md bg-secondary px-2 py-1 text-base font-medium text-foreground" : undefined}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {breakdownFirst && breakdown}
        <Button variant={breakdownFirst ? "outline" : "default"} className={action} onClick={onDone}>
          Done
        </Button>
        {step.href && (
          <Link href={step.href} className={buttonVariants({ variant: "outline", className: action })}>
            Open
          </Link>
        )}
        {!breakdownFirst && breakdown}
      </div>
    </article>
  );
}

export function AllDone({ focus }: { focus: boolean }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focus) heading.current?.focus();
  }, [focus]);
  return (
    <section className="flex flex-col gap-2 rounded-xl border bg-card p-6">
      <h2 ref={heading} tabIndex={-1} className="text-xl font-semibold outline-none">
        You finished every step
      </h2>
      <p className="text-muted-foreground">Every star is lit. You can add a new step anytime.</p>
    </section>
  );
}

// gentlePacing: a pause after each step instead of jumping straight to the next one.
export function Pause({ onContinue }: { onContinue: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <section className="flex flex-col gap-4 rounded-xl border bg-card p-6">
      <div className="flex flex-col gap-2">
        <h2 ref={heading} tabIndex={-1} className="text-xl font-semibold outline-none">
          Nice work
        </h2>
        <p className="text-muted-foreground">Take a break if you need one. Your next step will be here.</p>
      </div>
      <Button className={`${action} w-fit`} onClick={onContinue}>
        Keep going
      </Button>
    </section>
  );
}

export function NextStep({ step }: { step: PlanStep }) {
  const Icon = ICONS[step.icon];
  return (
    <li className="flex items-center gap-3 border-b px-1 py-3 last:border-b-0">
      <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
      <span className="flex-1">{step.title}</span>
      <Duration minutes={step.minutes} />
    </li>
  );
}

// Shown after Remove until the next change, so a stray tap is never final. No timer: it waits for the person.
export function Removed({ title, onUndo }: { title: string; onUndo: () => void }) {
  const undo = useRef<HTMLButtonElement>(null);
  // The removed row is gone; keep keyboard and screen-reader users next to the way back.
  useEffect(() => undo.current?.focus(), [title]);
  return (
    <div role="status" className="flex flex-wrap items-center gap-x-3 rounded-lg bg-secondary px-4 py-1">
      <p className="flex-1">Removed: {title}</p>
      <Button ref={undo} variant="ghost" className="h-11 px-4 text-base" onClick={onUndo}>
        Undo
      </Button>
    </div>
  );
}

export function Duration({ minutes, className }: { minutes: number; className?: string }) {
  return (
    <span className={cn("flex items-center gap-1 text-sm whitespace-nowrap text-muted-foreground", className)}>
      <Clock className="size-3.5" aria-hidden />
      {minutes} min
    </span>
  );
}
