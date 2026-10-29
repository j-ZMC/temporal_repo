# Personalization

By Regina, adapted into the app. Everything is saved on the device only (localStorage keys `pz` and `pz-boot`). With the default values nothing is applied and the app looks unchanged.

| File | What it does |
|---|---|
| `src/lib/personalization.ts` | Preferences, color presets, contrast checks, `compute()` (CSS variables) and applying them to `<html>`. `cleanPrefs()` validates what comes back from storage |
| `src/lib/personalization.test.ts` | Tests (`npm test`), including "every preset passes contrast" |
| `src/components/personalization-panel.tsx` | The "Personalize" panel: Colors, Text, Cursor, Icons & controls, Information, Experience |
| `src/app/globals.css` | Last block: rules that only act when `<html>` has `data-pz*` or `.focus-strong` |
| `src/app/layout.tsx` | The before-paint script also restores `pz-boot` (only CSS variables and `data-pz*` attributes) |
| `src/components/site-nav.tsx` | "Personalize" replaces the old "Reading" panel; nav labels and icons carry `data-pz-label` / `data-pz-icon` |

## Amount of information
Mark content hidden in the reduced view with `data-detail="extra"`. My plan already marks its hints this way. `data-detail="full"` (shown only in a full view) is supported in CSS, but the panel offers only Reduced and Comfortable until a screen marks content as full.

## Colors
The roles (background, text, cards, borders, accent, soft areas) override the shadcn tokens (`--background`, `--primary`, ...) inline on `<html>`. The old Reading options live here now: OpenDyslexic and size in Text, Reduce motion in Experience, and Calm as a color preset.
