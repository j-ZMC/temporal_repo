"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Each option is a class on <html>; layout.tsx applies it before first paint to avoid a flash.
const options = [
  { key: "dyslexic", label: "Dyslexia-friendly font", hint: "Use OpenDyslexic across the app" },
  { key: "text-large", label: "Larger text", hint: "Increase the text size" },
  { key: "calm", label: "Calm mode", hint: "Softer colors and less visual contrast" },
  { key: "reduce-motion", label: "Reduce motion", hint: "Remove movement and transitions" },
] as const;

type Key = (typeof options)[number]["key"];
type Prefs = Partial<Record<Key, boolean>>;

const PREFS_KEY = "a11y";

export function AccessibilityPanel() {
  const [prefs, setPrefs] = useState<Prefs>({});

  // On open, read what the layout.tsx script already applied to <html>.
  function syncFromHtml(open: boolean) {
    if (!open) return;
    const html = document.documentElement.classList;
    setPrefs(Object.fromEntries(options.map(({ key }) => [key, html.contains(key)])));
  }

  function toggle(key: Key, on: boolean) {
    const next = { ...prefs, [key]: on };
    setPrefs(next);
    document.documentElement.classList.toggle(key, on);
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    } catch {
      // Without localStorage (private mode) the option still works for this visit.
    }
  }

  return (
    <Dialog onOpenChange={syncFromHtml}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Settings2 aria-hidden />
        Reading
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reading settings</DialogTitle>
          <DialogDescription>Choose what feels most comfortable. Saved on this device.</DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-4">
          {options.map(({ key, label, hint }) => (
            <li key={key} className="flex items-center justify-between gap-4">
              <Label htmlFor={key} className="flex flex-col items-start gap-0.5">
                <span>{label}</span>
                <span className="text-sm font-normal text-muted-foreground">{hint}</span>
              </Label>
              <Switch id={key} aria-label={label} checked={!!prefs[key]} onCheckedChange={(on) => toggle(key, on)} />
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
