# Tasks: My plan

Plan: [plan.md](plan.md) · Spec: [SPEC-plan.md](../../SPEC-plan.md)

## Phase 1: The plan without AI

## Task 1: Plan model, storage, starter path and pure functions

**Description:** Create `src/lib/plan.ts` with the `PlanStep` and `Plan` types, the 6-step starter path, `loadPlan()` / `savePlan()` (key `plan`, versioned, validated), and the pure functions `visibleSteps`, `completeStep`, `addSteps`, `removeStep` and `addStepToPlan`. The profile step completes itself when a profile exists.

**Acceptance criteria:**
- [x] With nothing saved, `loadPlan()` returns the starter path
- [x] `visibleSteps` returns 1 or 3 undone steps from `stepsAtOnce`, and 1 step of 5 minutes or less on low energy
- [x] Broken JSON, an unknown version or invalid steps in storage fall back safely without throwing

**Verification:**
- [x] Tests pass: `npm test`
- [x] Types pass: `npx tsc --noEmit`

**Dependencies:** None

**Files likely touched:**
- `src/lib/plan.ts`
- `src/lib/plan.test.ts`

**Estimated scope:** S

## Task 2: My plan screen

**Description:** Replace the `/plan` placeholder and the temporary profile note with the real screen: "Today" header, the current step card (icon, verb-first title, duration, Done, Open when linked), up to 2 next-step cards, a constellation of the path with done steps in star gold, and "See what's next (N)" collapsed. Generalize `Constellation` to N points and keep the Profile using it.

**Acceptance criteria:**
- [x] Marking a step done lights its star and shows the next step; it survives a reload
- [x] "Open" goes to the linked module; "See what's next" lists the remaining steps with Remove
- [x] All targets at least 44 px; keyboard and screen-reader usable; no red or "overdue" anywhere

**Verification:**
- [x] Tests, lint and types pass
- [x] Manual check: finish two starter steps at 375 px and desktop, reload, keyboard only

**Dependencies:** Task 1

**Files likely touched:**
- `src/app/plan/page.tsx`
- `src/components/plan/plan-view.tsx`
- `src/components/plan/step-card.tsx`
- `src/components/profile/constellation.tsx`
- `src/components/plan/profile-note.tsx` (removed)

**Estimated scope:** M

## Task 3: Profile adaptations on My plan

**Description:** Wire `toAdaptations()` into the screen: `stepsAtOnce`, `importantFirst` (collapsed list shows only a count), `offerBreakdownFirst` (the break-down button becomes primary; it opens a placeholder until Task 5), `showDurations` (prominent durations), and `gentlePacing` ("Nice work. Take a break or keep going?" after Done).

**Acceptance criteria:**
- [x] Each adaptation changes the screen as described in SPEC-plan.md
- [x] With no profile, the defaults apply and a link invites setting up the profile

**Verification:**
- [x] Manual check: try three different saved profiles and compare the screen

**Dependencies:** Task 2

**Files likely touched:**
- `src/components/plan/plan-view.tsx`
- `src/components/plan/step-card.tsx`

**Estimated scope:** S

## Checkpoint A: Usable plan without AI
- [x] `npm test`, `npm run lint`, `npx tsc --noEmit` and `npm run build` pass
- [x] Starter path works end to end at 375 px and desktop, keyboard only, with all four Reading settings on

## Phase 2: "Break it down for me"

## Task 4: Breakdown logic and `/api/breakdown` route

**Description:** Install `@ai-sdk/groq`. Create `src/lib/breakdown.ts` (request and response Zod schemas, the Easy Read prompt, `breakdown(task, flags, model)` using `generateText` with `Output.object()` and a 15 s timeout) and `src/app/api/breakdown/route.ts` (validates the body, reads `GROQ_API_KEY` and `GROQ_MODEL`, returns typed errors). Add both env variables to `.env.example`. Pick the default model from Groq's structured-output docs.

**Acceptance criteria:**
- [x] A valid request returns 3 to 6 steps of at most 10 minutes; anything else is rejected
- [x] Missing key returns `not_configured`; invalid input `invalid_input`; provider or schema failures `failed`; timeouts `timeout`
- [x] A test asserts the prompt contains only the task text and the two flags

**Verification:**
- [x] Tests pass with `MockLanguageModelV4`: `npm test`
- [x] Build succeeds: `npm run build`

**Dependencies:** None (can run in parallel with Tasks 2 and 3)

**Files likely touched:**
- `src/lib/breakdown.ts`
- `src/lib/breakdown.test.ts`
- `src/app/api/breakdown/route.ts`
- `.env.example`
- `package.json`

**Estimated scope:** M

## Task 5: Break-down review dialog and "Add a step"

**Description:** "Break it down for me" on a step, or on a task typed into "Add a step", calls the route and opens a dialog listing the suggested steps, each editable or removable, with "Add these steps" and "Cancel". "Add as one step" adds the typed task directly. Any error shows "We couldn't break this down right now. Try again, or write the steps yourself." with both options, keeping the typed text.

**Acceptance criteria:**
- [x] Nothing is added without "Add these steps"; edits in the dialog are what gets added
- [x] The fallback appears for every error type and manual adding always works
- [x] A loading state shows while waiting; the button can't be pressed twice

**Verification:**
- [x] Manual check: with a real key break a task down (no-key fallback and manual adding checked)

**Dependencies:** Tasks 2 and 4

**Files likely touched:**
- `src/components/plan/breakdown-dialog.tsx`
- `src/components/plan/add-step.tsx`
- `src/components/plan/plan-view.tsx`

**Estimated scope:** M

## Checkpoint B: AI flow
- [x] Route tests pass with the mock model, including "no profile fields sent"
- [x] With a real Groq key, a break-down returns valid steps in under 10 s
- [x] With no key, the calm fallback shows and manual steps still work

## Phase 3: Check-in

## Task 6: Check-in (Low energy, Stressed, Okay, Good)

**Description:** "How are you feeling today?" with Low energy, Stressed, Okay and Good at the top of My plan, asked once per day and skippable. Low energy shows one step of 5 minutes or less; Stressed shows the shortest step; both set gentleTone for the AI. Okay and Good use the profile setting. Stored in the plan for today's date.

**Acceptance criteria:**
- [x] Choosing Low changes the visible steps immediately; a new day asks again
- [x] Skipping hides the check-in for the day without changing anything

**Verification:**
- [x] Tests pass for the energy rules in `visibleSteps`
- [x] Manual check: Low, Okay, Good and skip

**Dependencies:** Task 3

**Files likely touched:**
- `src/components/plan/energy-check-in.tsx`
- `src/components/plan/plan-view.tsx`
- `src/lib/plan.ts`

**Estimated scope:** S

## Checkpoint: Complete
- [ ] Every success criterion in SPEC-plan.md is met
- [ ] `/impeccable critique` on `/plan`, material issues fixed
- [ ] Review with the team
