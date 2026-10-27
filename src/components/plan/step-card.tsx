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
export function CurrentStep({ step, focus, onDone }: { step: PlanStep; focus: boolean; onDone: () => void }) {
  const Icon = ICONS[step.icon];
  const heading = useRef<HTMLHeadingElement>(null);
  // After Done, the button is gone; land keyboard and screen-reader users on the new step.
  useEffect(() => {
    if (focus) heading.current?.focus();
  }, [focus]);
  return (
    <article aria-labelledby={`step-${step.id}`} className="flex flex-col gap-5 rounded-xl border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-primary">
          <Icon className="size-6" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <h2 id={`step-${step.id}`} ref={heading} tabIndex={-1} className="text-xl font-semibold text-balance outline-none">
            {step.title}
          </h2>
          <Duration minutes={step.minutes} />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button className={action} onClick={onDone}>
          Done
        </Button>
        {step.href && (
          <Link href={step.href} className={buttonVariants({ variant: "outline", className: action })}>
            Open
          </Link>
        )}
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

export function NextStep({ step }: { step: PlanStep }) {
  const Icon = ICONS[step.icon];
  return (
    <li className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
      <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
      <span className="flex-1">{step.title}</span>
      <Duration minutes={step.minutes} />
    </li>
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
