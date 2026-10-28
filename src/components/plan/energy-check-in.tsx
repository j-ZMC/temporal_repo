"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { Energy } from "@/lib/plan";

const action = "h-11 px-5 text-base";

const CHOICES: { level: Energy; label: string }[] = [
  { level: "low", label: "Low energy" },
  { level: "stressed", label: "Stressed" },
  { level: "okay", label: "Okay" },
  { level: "good", label: "Good" },
];

const REPLIES: Record<Energy, string> = {
  low: "Small steps today. That still counts.",
  stressed: "One thing at a time. You've got this.",
  okay: "Thanks for checking in.",
  good: "Thanks for checking in.",
};

// Self-reported, one tap, skippable. The app never guesses feelings from what people write.
export function EnergyCheckIn({ onChoose }: { onChoose: (level: Energy | null) => void }) {
  return (
    <section aria-labelledby="check-in" className="flex flex-col gap-3 rounded-xl border bg-card p-5">
      <h2 id="check-in" className="text-lg font-semibold">
        How are you feeling today?
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CHOICES.map((c) => (
          <Button key={c.level} variant="outline" className={action} onClick={() => onChoose(c.level)}>
            {c.label}
          </Button>
        ))}
      </div>
      <Button variant="ghost" className={`${action} w-fit`} onClick={() => onChoose(null)}>
        Skip for today
      </Button>
    </section>
  );
}

export function CheckInReply({ level, focus, onChange }: { level: Energy; focus: boolean; onChange: () => void }) {
  const reply = useRef<HTMLParagraphElement>(null);
  // The choice buttons are gone after a tap; land keyboard and screen-reader users on the reply.
  useEffect(() => {
    if (focus) reply.current?.focus();
  }, [focus]);
  return (
    <div className="flex flex-wrap items-center gap-x-3">
      <p ref={reply} tabIndex={-1} className="text-muted-foreground outline-none">
        {REPLIES[level]}
      </p>
      <Button variant="ghost" className="h-11 px-3" onClick={onChange} aria-label="Change how you feel today">
        Change
      </Button>
    </div>
  );
}
