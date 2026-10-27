"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProfileSummary } from "@/components/profile/profile-summary";
import { QuestionStep } from "@/components/profile/question-step";
import { QUESTIONS, type Answers, loadProfile, loadStep, saveProfile, saveStep } from "@/lib/profile";
import { useHydrated } from "@/lib/use-hydrated";

// Saved answers live in localStorage, which the server can't see. Render the flow only after
// hydration so its lazy state reads storage without a server/client mismatch.
export function ProfileFlow() {
  return useHydrated() ? <Flow /> : null;
}

function Flow() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(() => loadProfile() ?? {});
  const [step, setStep] = useState(loadStep);
  const [editing, setEditing] = useState(false);

  function go(next: number) {
    setStep(next);
    saveStep(next);
  }

  function setAnswer(id: string, value: string | string[] | undefined) {
    const next = { ...answers, [id]: value } as Answers;
    if (value === undefined) delete next[id as keyof Answers];
    setAnswers(next);
    saveProfile(next);
  }

  if (step === -1) {
    return (
      <section className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-balance">Let&apos;s get to know you</h1>
        <p className="text-lg text-muted-foreground">
          A few quick questions help Constela fit the way you work best. It takes about 3 minutes, and you can skip
          any question or change your answers anytime.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={() => go(0)}>
            Start
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/plan")}>
            Skip for now
          </Button>
        </div>
      </section>
    );
  }

  if (step >= QUESTIONS.length) {
    return (
      <ProfileSummary
        answers={answers}
        onEdit={(i) => {
          setEditing(true);
          go(i);
        }}
      />
    );
  }

  // While editing from the summary, every exit goes straight back to it.
  const after = (next: number) => {
    if (editing) {
      setEditing(false);
      go(QUESTIONS.length);
    } else go(next);
  };

  const q = QUESTIONS[step];
  return (
    <QuestionStep
      key={q.id}
      index={step}
      value={answers[q.id]}
      onChange={(v) => setAnswer(q.id, v)}
      onBack={() => after(step - 1)}
      onSkip={() => {
        setAnswer(q.id, undefined);
        after(step + 1);
      }}
      onNext={() => after(step + 1)}
    />
  );
}
