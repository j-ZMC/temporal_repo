"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const action = "h-11 px-5 text-base";

// The text lives in the parent so it survives a failed or cancelled break-down.
export function AddStep({
  value,
  onChange,
  onAdd,
  onBreakdown,
}: {
  value: string;
  onChange: (value: string) => void;
  onAdd: (title: string) => void;
  onBreakdown: (task: string) => void;
}) {
  const task = value.trim();
  return (
    <form
      className="flex flex-col gap-3 rounded-xl border bg-card p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (task) onAdd(task);
      }}
    >
      <Label htmlFor="new-step" className="text-base font-semibold">
        Add a step
      </Label>
      <Input
        id="new-step"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={200}
        placeholder="For example: Prepare for my interview"
        className="h-11 text-base md:text-base"
      />
      <div className="flex flex-wrap gap-3">
        <Button type="button" className={action} disabled={!task} onClick={() => onBreakdown(task)}>
          Break it down for me
        </Button>
        <Button type="submit" variant="outline" className={action} disabled={!task}>
          Add as one step
        </Button>
      </div>
    </form>
  );
}
