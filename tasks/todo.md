# Tasks: Profile

Plan: [plan.md](plan.md) · Spec: [SPEC-profile.md](../SPEC-profile.md)

## Phase 1: Foundation

## Task 1: Set up Vitest

**Description:** Add Vitest as the test runner so pure logic can be tested from the command line.

**Acceptance criteria:**
- [x] `vitest` is a dev dependency and `npm test` runs `vitest run`
- [x] A minimal `vitest.config.mts` resolves the `@/` import alias
- [x] `npm test` exits cleanly (no tests yet is fine with `--passWithNoTests`)

**Verification:**
- [x] Tests pass: `npm test`
- [x] Build succeeds: `npm run build`

**Dependencies:** None

**Files likely touched:**
- `package.json`
- `vitest.config.mts`

**Estimated scope:** XS

## Task 2: Profile model, storage and adaptations

**Description:** Define the 8 questions as data, the `Profile` and `Adaptations` types, `loadProfile()` / `saveProfile()` on `localStorage`, `toAdaptations()` and `describeAdaptations()` (the plain-language lines for the summary), all following the spec's adaptation table.

**Acceptance criteria:**
- [x] Every row of the spec's "How the app adapts" table is implemented and covered by a test
- [x] An empty profile returns the defaults (3 steps, normal text, no filters)
- [x] Broken JSON or an unknown `version` in storage returns "no profile" without throwing

**Verification:**
- [x] Tests pass: `npm test`
- [x] Types pass: `npx tsc --noEmit`

**Dependencies:** Task 1

**Files likely touched:**
- `src/lib/profile.ts`
- `src/lib/profile.test.ts`

**Estimated scope:** S

## Checkpoint: Foundation
- [x] `npm test`, `npm run lint`, `npx tsc --noEmit` and `npm run build` pass
- [ ] Share the `toAdaptations()` contract with the team

## Phase 2: Core flow

## Task 3: Welcome and question screens

**Description:** Replace the `/profile` placeholder with the flow: a welcome screen (why we ask, "About 3 minutes", Start / Skip for now) and one screen per question with Back, Skip and Next, star progress plus "3 of 8" text, single and multi-select inputs. Each answer is saved immediately.

**Acceptance criteria:**
- [x] All 8 questions can be answered, skipped or revisited with Back
- [x] Reloading mid-form resumes on the same question with answers kept
- [x] Tap targets are at least 44 px; fully usable with keyboard only

**Verification:**
- [x] Types and lint pass
- [x] Manual check: complete the flow at 375 px and desktop; reload halfway; keyboard only

**Dependencies:** Task 2

**Files likely touched:**
- `src/app/profile/page.tsx`
- `src/components/profile/question-step.tsx`
- `src/components/ui/radio-group.tsx` (shadcn)
- `src/components/ui/checkbox.tsx` (shadcn)

**Estimated scope:** M

## Task 4: Summary screen

**Description:** After the last question (or Skip), show every answer in plain words with Edit, plus 2 to 4 lines from `describeAdaptations()`. If long texts feel really hard, suggest turning on the dyslexia-friendly font and larger text from the Reading panel.

**Acceptance criteria:**
- [x] Each answer has an Edit action that jumps to its question and returns to the summary
- [x] Skipped questions read "Skipped" with an option to answer
- [x] The adaptation lines match `describeAdaptations()` for the saved profile

**Verification:**
- [x] Tests pass: `npm test`
- [x] Manual check: edit two answers and confirm the adaptation lines update

**Dependencies:** Task 3

**Files likely touched:**
- `src/components/profile/profile-summary.tsx`
- `src/app/profile/page.tsx`

**Estimated scope:** S

## Task 5: Hand-off to My plan

**Description:** "Save and continue" goes to `/plan`, and the My plan placeholder reads `toAdaptations()` to show one line such as "We'll show you 1 step at a time", proving the contract works end to end. Home's "Get started" goes to `/plan` when a profile already exists.

**Acceptance criteria:**
- [x] Finishing the profile lands on `/plan` with the adaptation line visible
- [x] With no saved profile, `/plan` shows the defaults and a link to set up the profile
- [x] No hydration warnings in the console

**Verification:**
- [x] Build succeeds: `npm run build`
- [x] Manual check: finish the profile, reload `/plan`, clear storage and reload again

**Dependencies:** Task 4

**Files likely touched:**
- `src/app/plan/page.tsx`
- `src/app/page.tsx`

**Estimated scope:** S

## Checkpoint: Complete
- [x] All success criteria in SPEC-profile.md are met
- [x] Checked at 375 px and desktop, keyboard only, and with all four Reading settings on
- [ ] `/impeccable critique` run on the flow and material issues fixed
- [ ] Review with the team
