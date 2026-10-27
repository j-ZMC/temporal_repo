import Link from "next/link";
import { Settings2, Star } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { QUESTIONS, type Answers, describeAdaptations, toAdaptations } from "@/lib/profile";

export function ProfileSummary({ answers, onEdit }: { answers: Answers; onEdit: (index: number) => void }) {
  const adaptations = toAdaptations(answers);

  return (
    <section aria-labelledby="summary-heading" className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 id="summary-heading" className="text-3xl font-bold">
          Your profile
        </h1>
        <p className="text-muted-foreground">Saved on this device only. You can change it anytime.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border bg-card p-5">
        <h2 className="font-semibold">Here&apos;s how Constela will adapt</h2>
        <ul className="flex flex-col gap-2">
          {describeAdaptations(adaptations).map((line) => (
            <li key={line} className="flex gap-2">
              <Star className="mt-1 size-4 shrink-0 fill-star text-star" aria-hidden />
              {line}
            </li>
          ))}
        </ul>
        {adaptations.suggestReadingAids && (
          <p className="flex gap-2 rounded-lg bg-secondary p-3 text-sm">
            <Settings2 className="mt-0.5 size-4 shrink-0" aria-hidden />
            Tip: open Reading at the top to turn on the dyslexia-friendly font and larger text.
          </p>
        )}
      </div>

      <dl className="flex flex-col divide-y rounded-xl border bg-card">
        {QUESTIONS.map((q, i) => {
          const value = answers[q.id];
          const chosen = Array.isArray(value) ? value : value ? [value] : [];
          const labels = q.options.filter((o) => (chosen as string[]).includes(o.value)).map((o) => o.label);
          return (
            <div key={q.id} className="flex items-start justify-between gap-4 p-4">
              <div className="flex flex-col gap-1">
                <dt className="text-sm text-muted-foreground">{q.text}</dt>
                <dd className={labels.length ? "font-medium" : "text-muted-foreground italic"}>
                  {labels.length ? labels.join(", ") : "Skipped"}
                </dd>
              </div>
              <Button variant="outline" size="sm" onClick={() => onEdit(i)} aria-label={`${labels.length ? "Edit" : "Answer"}: ${q.text}`}>
                {labels.length ? "Edit" : "Answer"}
              </Button>
            </div>
          );
        })}
      </dl>

      <Link href="/plan" className={buttonVariants({ size: "lg", className: "w-fit" })}>
        Save and continue
      </Link>
    </section>
  );
}
