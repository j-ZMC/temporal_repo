"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QUESTIONS, toggleOption } from "@/lib/profile";
import { cn } from "@/lib/utils";

type Question = (typeof QUESTIONS)[number];

const optionRow =
  "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border bg-card px-4 py-3 text-base has-data-checked:border-primary has-data-checked:bg-secondary";

export function QuestionStep({
  index,
  value,
  onChange,
  onBack,
  onSkip,
  onNext,
}: {
  index: number;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
}) {
  const question: Question = QUESTIONS[index];
  const total = QUESTIONS.length;
  const heading = useRef<HTMLHeadingElement>(null);

  // Move focus to the new question so keyboard and screen reader users start in the right place.
  useEffect(() => heading.current?.focus(), [index]);

  const selected = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <section aria-labelledby="question-heading" className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div aria-hidden className="flex gap-1.5">
          {QUESTIONS.map((q, i) => (
            <Star
              key={q.id}
              className={cn("size-4", i < index ? "fill-star text-star" : i === index ? "text-primary" : "text-border")}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {index + 1} of {total}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1 id="question-heading" ref={heading} tabIndex={-1} className="text-2xl font-semibold text-balance outline-none">
          {question.text}
        </h1>
        <p className="text-sm text-muted-foreground">
          {question.kind === "multi" ? "Choose any that apply. " : ""}You can skip this.
        </p>
      </div>

      {question.kind === "single" ? (
        <RadioGroup aria-labelledby="question-heading" value={value ?? null} onValueChange={(v) => onChange(v as string)}>
          {question.options.map((o) => (
            <label key={o.value} className={optionRow}>
              <RadioGroupItem value={o.value} />
              {o.label}
            </label>
          ))}
        </RadioGroup>
      ) : (
        <div role="group" aria-labelledby="question-heading" className="grid gap-2">
          {question.options.map((o) => (
            <label key={o.value} className={optionRow}>
              <Checkbox
                checked={selected.includes(o.value)}
                onCheckedChange={() => onChange(toggleOption(selected, o.value))}
              />
              {o.label}
            </label>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="lg" onClick={onBack}>
          Back
        </Button>
        <div className="flex-1" />
        <Button variant="outline" size="lg" onClick={onSkip}>
          Skip
        </Button>
        <Button size="lg" onClick={onNext} disabled={selected.length === 0}>
          {index === total - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </section>
  );
}
