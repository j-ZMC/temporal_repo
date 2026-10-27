# Spec: My plan

Status: draft, waiting for team review · Owner: Luis

## Objective

My plan is the heart of Constela and the module that answers the challenge's core ask: **AI that supports executive function**. It turns "get a job" into a few small, visual steps for today, with the most important one first, and lets the person break any big task into small steps with one button.

Kairos told us their users get distracted by unimportant tasks, and that visuals showing *exactly what to do* help a lot. The profile already tells us how much to show and how (see `toAdaptations()` in `src/lib/profile.ts`).

**User:** the same neurodivergent young adult as the Profile, with enough independence to use the app alone.

**Success looks like:** the person opens My plan, sees one clear next step (or up to 3), finishes it, watches a star light up, and can turn any overwhelming task into 5-minute steps in under 10 seconds.

### User stories

- As a user, I see only the steps for today, most important first; everything else is out of the way until I ask for it.
- As a user, each step tells me exactly what to do (a verb first), shows an icon, and says how long it takes.
- As a user, when I mark a step done, a star lights up and the next step appears. Nothing is ever "overdue" or red.
- As a user, I can press "Break it down for me" on any step, or on a task I type, and get 3 to 6 small steps I can review before they're added.
- As a user, if the AI fails or there's no connection, I get a calm message and can still write the steps myself.
- As a user, I start with a ready-made job-search path, so I never face an empty page.
- As a teammate, other modules can add a step to My plan (for example "Read the job at Acme" from Jobs) through one function.

## Assumptions

1. Same stack and storage approach as the Profile: client-only state in `localStorage`, rendered after hydration (`useHydrated()`), no accounts.
2. The AI call runs in a Next.js route handler (`src/app/api/breakdown/route.ts`) so the API key never reaches the browser.
3. AI output goes through `generateText` with `Output.object()` and a Zod schema (AI SDK 7), and is validated before use.
4. Only the task text and three non-sensitive flags (`explicitSteps`, `summaryMode`, `gentleTone`) are sent to the AI provider. Never the support level, sensory needs, the check-in feeling or any other profile answer.
5. The provider is not decided yet (see Open Questions). The route reads the provider from an env variable so switching is a config change.
6. The check-in (four self-reported states) is part of this spec but built last, so it can be cut if time runs out.
7. UI text in English, plain language (Easy Read): short sentences, one idea each, verb first in every step.

## The starter path

So the first visit is never empty, My plan starts with this path. Each step links to the module that does the work.

| # | Step (UI copy) | Minutes | Links to |
| --- | --- | --- | --- |
| 1 | Finish your profile | 3 | `/profile` (auto-done when a profile exists) |
| 2 | Look at 3 jobs picked for you | 10 | `/jobs` |
| 3 | Save one job you like | 2 | `/jobs` |
| 4 | Read "Get to know the company" for that job | 5 | `/jobs` |
| 5 | Practice one interview question | 5 | `/interview` |
| 6 | Read "What to expect" for an interview | 5 | `/interview` |

The person can add their own steps and remove starter steps. Copy may change after Kairos reviews it.

## How the profile changes My plan

| Adaptation (from `toAdaptations()`) | Effect in My plan |
| --- | --- |
| `stepsAtOnce: 1` | Show only the next step; the rest are hidden behind "See what's next" |
| `stepsAtOnce: 3` (default) | Show up to 3 steps; the rest behind "See what's next" |
| `importantFirst` | "See what's next" is collapsed by default and shows only a count |
| `offerBreakdownFirst` | "Break it down for me" is the primary button on each step |
| `showDurations` | Durations are shown prominently, with an optional visual timer on the current step |
| `explicitSteps` | Sent to the AI: steps must be numbered, concrete, and include one example |
| `summaryMode` | Sent to the AI: step titles stay under 8 words |
| `gentlePacing` | After a step is done: "Nice work. Take a break or keep going?" instead of jumping straight on |

Durations are always visible in a quiet style; `showDurations` makes them prominent.

## Check-in (built last)

At the top of My plan: "How are you feeling today?" with four choices: Low energy · Stressed · Okay · Good. One tap, skippable, asked once per day. The person tells us; the app never guesses feelings from what they write.

| Check-in | Effect | Sent to the AI |
| --- | --- | --- |
| Low energy | Show 1 step, prefer steps of 5 minutes or less; "Small steps today. That still counts." | `gentleTone: true` |
| Stressed | Show 1 step, the shortest one first; "One thing at a time. You've got this." | `gentleTone: true` |
| Okay | Use the profile setting | `gentleTone: false` |
| Good | Use the profile setting | `gentleTone: false` |

The check-in itself never leaves the device. The AI only receives `gentleTone`, which asks for a calmer tone and smaller steps; it never receives the feeling, its history or the date.

## Interface

1. **Header:** "Today" plus the energy check-in when enabled.
2. **Current step card**, the one primary thing on the screen:
    - icon, action title (verb first), duration;
    - "Done" (primary), "Break it down for me", and "Open" when the step links to another module.
3. **Next steps** (only when `stepsAtOnce` is 3): up to 2 smaller cards below.
4. **Progress:** a constellation of the path's steps, done ones in star gold. The same visual language as the Profile.
5. **"See what's next (N)"**: a collapsed list of the remaining steps.
6. **"Add a step"**: a single text field and "Break it down for me" or "Add as one step".
7. **Break-down review:** a dialog showing the suggested steps, each editable or removable, then "Add these steps" or "Cancel". The AI never adds anything without confirmation.

No red, no "overdue", no streak counters, no timers that run on their own. Every target at least 44 px; keyboard and screen-reader usable; follows the four Reading settings.

## AI: "Break it down for me"

`POST /api/breakdown`

Request (validated with Zod; anything else returns 400):
```json
{ "task": "Prepare for my interview on Friday", "explicitSteps": true, "summaryMode": false, "gentleTone": false }
```
- `task`: 1 to 200 characters, trimmed.
- `gentleTone`: true after a Low energy or Stressed check-in; asks for a calmer tone and steps of 5 minutes or less.

Response:
```json
{ "steps": [{ "title": "Pick one outfit and lay it out", "minutes": 5 }] }
```
- 3 to 6 steps; `title` 1 to 80 characters; `minutes` an integer from 1 to 10.

Prompt rules (kept in one place, `src/lib/breakdown.ts`):
- Easy Read: one action per step, verb first, no jargon, no exclamation marks, adult tone.
- Concrete and physical where possible ("Open the job post", not "Research the company").
- No step longer than 10 minutes.

Errors: on timeout (15 s), provider error, rate limit or invalid output, the route returns a typed error and the UI shows "We couldn't break this down right now. Try again, or write the steps yourself." with both options. The task text the person typed is never lost.

## Data model

```ts
type PlanStep = {
  id: string;
  title: string;
  minutes: number;           // 1 to 60
  icon: StepIcon;            // a fixed set of lucide icon names
  href?: string;             // link to another module
  done: boolean;
  doneAt?: string;           // ISO date
  source: "starter" | "user" | "ai";
};

type Plan = { version: 1; steps: PlanStep[]; energy?: { level: "low" | "stressed" | "okay" | "good"; date: string } };
```

Stored in `localStorage` under `plan`, validated on load like the profile (unknown version or broken JSON means "start from the starter path").

Public functions other modules can use (`src/lib/plan.ts`):
- `loadPlan()`, `savePlan()`
- `addSteps(plan, steps)`, `completeStep(plan, id)`, `removeStep(plan, id)`
- `visibleSteps(plan, adaptations, energy)`: which steps to show now
- `addStepToPlan(step)`: for teammates, for example Jobs adding "Read the job at Acme"

## Tech Stack

Next.js 16 (App Router, route handlers), React 19, TypeScript, Tailwind CSS 4, shadcn/ui (base-nova), lucide-react, AI SDK 7 (`ai`, a provider package), Zod 4. Possibly one new provider package (see Open Questions).

## Commands

```
Dev:   npm run dev
Build: npm run build
Lint:  npm run lint
Types: npx tsc --noEmit
Test:  npm test
```

## Project Structure

```
src/app/plan/page.tsx               → My plan page
src/components/plan/                → step card, next steps, break-down dialog, add step, energy check-in
src/lib/plan.ts                     → Plan types, storage, pure plan functions, starter path
src/lib/plan.test.ts                → tests for the pure functions
src/lib/breakdown.ts                → request/response schemas and prompt for the AI
src/app/api/breakdown/route.ts      → route handler that calls the AI provider
src/app/api/breakdown/route.test.ts → route tests with the AI SDK's mock model (no real API calls)
```

## Code Style

Same as the Profile: data-first, pure functions in `src/lib`, components only render and call them.

```ts
// src/lib/plan.ts
export function visibleSteps(plan: Plan, a: Adaptations, energy?: Energy): PlanStep[] {
  const todo = plan.steps.filter((s) => !s.done);
  const limit = energy === "low" ? 1 : a.stepsAtOnce;
  return todo.slice(0, limit);
}
```

## Testing Strategy

- **Vitest, pure functions:** `visibleSteps` for every adaptation and energy level, `completeStep`, `addSteps`, `removeStep`, storage validation, the starter path, and the profile step auto-completing.
- **Vitest, route handler:** using the AI SDK's mock language model, so tests never call a real provider. Cover a valid response, invalid input (400), invalid model output, and a provider error.
- **Prompt:** a test that the prompt includes the Easy Read rules and never includes profile fields other than the two flags.
- **Manual, in the browser:** the full flow at 375 px and desktop, keyboard only, with all four Reading settings, with and without a profile, and with the AI key missing.

## Boundaries

- **Always:** validate the request and the AI response with Zod; keep the API key server-side; show a manual fallback when the AI fails; ask before adding AI steps; follow Easy Read copy rules; run tests, lint and types before committing.
- **Ask first:** adding the provider package; changing what is sent to the AI; adding a step to the starter path; anything that stores data on a server.
- **Never:** send the support level, sensory needs, the check-in feeling or other profile answers to the AI; infer feelings from what the person writes; show red, "overdue" or streak pressure; let the AI add steps without confirmation; commit an API key.

## Success Criteria

- [ ] A first-time visitor sees the starter path with one clear current step, never an empty page.
- [ ] `stepsAtOnce`, `importantFirst`, `offerBreakdownFirst`, `showDurations` and `gentlePacing` each change the screen as described in the table above.
- [ ] Marking a step done lights a star and shows the next step; the state survives a reload.
- [ ] "Break it down for me" returns 3 to 6 steps of 10 minutes or less in under 10 seconds with a working key, and the person reviews them before they are added.
- [ ] With no key, a timeout or a bad response, the person sees the calm fallback and can add steps manually; nothing they typed is lost.
- [ ] Only the task text and three flags leave the device (checked in the route test); the check-in feeling never does.
- [ ] Works at 375 px and desktop, keyboard only, and with all four Reading settings on.
- [ ] The check-in works as described for all four states, or is explicitly cut and noted here.

## Open Questions

1. **AI provider:** Groq (fast, generous free tier; recommended for the demo), Gemini, or Zahid's OpenAI key? This decides the one package to install.
2. Is the starter path right? Kairos might want different first steps.
3. ~~Keep the energy check-in?~~ Decided: kept, expanded to four self-reported states with a `gentleTone` flag for the AI.
4. ~~Reordering?~~ Defaulted for this iteration: the app keeps "most important first"; people can remove steps.
