# Implementation Plan: Profile

Source: [SPEC-profile.md](../SPEC-profile.md) (approved). Tasks: [todo.md](todo.md).

## Overview

An 8-question onboarding at `/profile`, one question per screen, all optional, saved on the device. A pure function `toAdaptations()` turns the answers into ready-to-use settings that My plan, Jobs and Interview read. A summary screen shows the answers and, in plain words, how Constela will adapt.

## Architecture Decisions

- **Questions are data, not JSX.** One `QUESTIONS` array in `src/lib/profile.ts` drives the flow, the summary and the tests, so adding or rewording a question is one edit.
- **One contract for teammates.** Other modules call `loadProfile()` + `toAdaptations()` and never read raw answers. This is the only interface Zahid, Juan, Evy and Regina need.
- **`localStorage` only, versioned.** Key `profile`, shape `{ version: 1, answers }`. An unknown version or broken JSON is treated as "no profile", never a crash.
- **Read storage on the client after mount.** The profile page is a client component; it starts empty and loads saved answers in an effect-free way (lazy read on first interaction or `useSyncExternalStore`) to avoid hydration mismatches. Follow `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`.
- **Save on every answer.** A reload in the middle of the form resumes where the person left off.
- **Vitest for the pure logic only.** `toAdaptations()` and `describeAdaptations()` are the real logic; the UI is checked by hand in the browser. Only `vitest` is added (node environment), no DOM testing libraries.
- **shadcn components for inputs.** Add `radio-group` and `checkbox` from the existing shadcn registry so inputs stay accessible and match the theme.

## Task List

### Phase 1: Foundation
- [x] Task 1: Set up Vitest
- [x] Task 2: Profile model, storage and adaptations (with tests)

### Checkpoint: Foundation
- [x] `npm test`, lint, types and build pass
- [ ] Teammates can read the `toAdaptations()` contract

### Phase 2: Core flow
- [x] Task 3: Welcome and question screens
- [ ] Task 4: Summary screen with edit and "how Constela will adapt"
- [ ] Task 5: Hand-off to My plan

### Checkpoint: Complete
- [ ] Every success criterion in the spec is met
- [ ] Checked at 375 px and desktop, keyboard only, and with all four Reading settings on
- [ ] Review with the team before merging

## Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Hydration mismatch from reading `localStorage` during render | Med | Read only on the client after mount, as the Next 16 guide says; test with a saved profile and a hard reload |
| The answer shape changes after teammates start using it | Med | Freeze `Profile` and `Adaptations` types in Task 2; any change bumps `version` and is announced to the team |
| Copy is too long or too clinical | Med | Keep each question under 12 words; run `/impeccable critique` on the flow before the checkpoint |
| Base UI radio/checkbox APIs differ from older shadcn examples | Low | Use the components the shadcn CLI generates and read their source before wiring |
| Kairos changes the questions (open question 1) | Low | Questions are data; rewording is a one-line change |

## Parallel Work

- After Task 2 lands, Regina can wire the Reading panel suggestions and the rest of the team can read `toAdaptations()` in their modules.
- Tasks 3 to 5 are sequential (same files).

## Open Questions

- Kairos feedback on the 8 questions and on the support-level wording (Q8).
- Demo user: independent only, or also people with a caregiver.
