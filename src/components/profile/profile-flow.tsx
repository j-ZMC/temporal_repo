"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { QuestionStep } from "@/components/profile/question-step";
import { QUESTIONS, type Answers, loadProfile, loadStep, saveProfile, saveStep } from "@/lib/profile";

const subscribe = () => () => {};

// Saved answers live in localStorage, which the server can't see. Render the flow only after
// hydration so its lazy state reads storage without a server/client mismatch.
export function ProfileFlow() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  return hydrated ? <Flow /> : null;
}

function Flow() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(() => loadProfile() ?? {});
  const [step, setStep] = useState(loadStep);

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
    // shortcut: temporary end screen, replaced by the summary in Task 4.
    return (
      <section className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">You&apos;re all set</h1>
        <p className="text-lg text-muted-foreground">Your answers are saved on this device.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/plan" className={buttonVariants({ size: "lg" })}>
            Go to my plan
          </Link>
          <Button size="lg" variant="outline" onClick={() => go(0)}>
            Review answers
          </Button>
        </div>
      </section>
    );
  }

  const q = QUESTIONS[step];
  return (
    <QuestionStep
      key={q.id}
      index={step}
      value={answers[q.id]}
      onChange={(v) => setAnswer(q.id, v)}
      onBack={() => go(step - 1)}
      onSkip={() => {
        setAnswer(q.id, undefined);
        go(step + 1);
      }}
      onNext={() => go(step + 1)}
    />
  );
}
