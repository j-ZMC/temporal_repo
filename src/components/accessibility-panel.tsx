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

// Cada opción es una clase en <html>; layout.tsx la aplica antes de pintar para evitar parpadeos.
const options = [
  { key: "dyslexic", label: "Fuente para dislexia", hint: "Usa OpenDyslexic en toda la app" },
  { key: "text-large", label: "Letra más grande", hint: "Aumenta el tamaño del texto" },
  { key: "calm", label: "Modo calma", hint: "Colores más suaves y menos contraste visual" },
  { key: "reduce-motion", label: "Reducir animaciones", hint: "Quita movimientos y transiciones" },
] as const;

type Key = (typeof options)[number]["key"];
type Prefs = Partial<Record<Key, boolean>>;

const PREFS_KEY = "a11y";

export function AccessibilityPanel() {
  const [prefs, setPrefs] = useState<Prefs>({});

  // Al abrir, lee lo que el script de layout.tsx ya aplicó en <html>.
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
      // Sin localStorage (modo privado) la opción sigue funcionando en esta visita.
    }
  }

  return (
    <Dialog onOpenChange={syncFromHtml}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Settings2 aria-hidden />
        Lectura
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajustes de lectura</DialogTitle>
          <DialogDescription>Elige lo que te haga sentir más cómodo. Se guarda en este dispositivo.</DialogDescription>
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
