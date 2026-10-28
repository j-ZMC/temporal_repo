# Implementation Plan: My plan

Source: [SPEC-plan.md](../../SPEC-plan.md) (approved: Groq as provider, energy check-in kept). Tasks: [todo.md](todo.md).
The Profile plan stays in [tasks/plan.md](../plan.md) until the team reviews it.

## Overview

A daily, "important first" plan at `/plan`: one current step (or up to 3, from the profile), each a visual card with icon, verb-first action and duration. Done steps light up stars in a constellation. "Break it down for me" calls Groq through a server route and returns 3 to 6 small steps the person reviews before adding. An energy check-in, built last, can shrink the day to one small step.

## Architecture Decisions

- **Pure plan logic in `src/lib/plan.ts`.** Starter path, storage (key `plan`, versioned, validated like the profile), `visibleSteps`, `completeStep`, `addSteps`, `removeStep`, `addStepToPlan`. Components only render and call these.
- **AI logic separate from the route.** `src/lib/breakdown.ts` holds the Zod schemas, the prompt and `breakdown(task, flags, model)`. The route handler only validates the request, picks the model and maps errors. This lets tests pass the AI SDK's `MockLanguageModelV4` (from `ai/test`) without any real API call.
- **Groq via `@ai-sdk/groq`, model from env.** `GROQ_API_KEY` and `GROQ_MODEL` in `.env.local`. The model id is configurable because Groq retires models often; Task 4 picks a default that supports structured output, checked against Groq's docs.
- **Structured output with `generateText` + `Output.object()`** (AI SDK 7), then a second Zod parse of the result, with a 15 s timeout through `AbortSignal.timeout`.
- **Typed error responses.** The route returns `{ error: "invalid_input" | "not_configured" | "timeout" | "failed" }` with a matching status, so the UI shows one calm fallback without parsing strings.
- **Constellation generalized.** The Profile's 8-point constellation becomes one that lays out N points, so My plan reuses the same visual language.
- **No reordering in this iteration.** The app keeps "most important first" (spec open question 4, defaulted); the person can remove steps.
- **Reuse existing pieces:** `useHydrated()`, `toAdaptations()`, shadcn `Dialog`, `Button`, `Textarea`, the 44 px `h-11` action size.

## Task List

### Phase 1: The plan without AI
- [x] Task 1: Plan model, storage, starter path and pure functions (with tests)
- [x] Task 2: My plan screen: current step, next steps, done, constellation, "See what's next"
- [x] Task 3: Profile adaptations on My plan

### Checkpoint A: Usable plan without AI
- [x] Tests, lint, types and build pass
- [x] Starter path works end to end at 375 px and desktop, keyboard only, Reading settings on

### Phase 2: "Break it down for me"
- [x] Task 4: Breakdown logic and `/api/breakdown` route with Groq (with mock-model tests)
- [x] Task 5: Break-down review dialog and "Add a step", with the manual fallback

### Checkpoint B: AI flow
- [x] Route tests pass with the mock model, including "no profile fields sent"
- [x] With a real Groq key: a break-down returns valid steps in under 10 s
- [x] With no key: the calm fallback shows and manual steps still work

### Phase 3: Energy
- [x] Task 6: Check-in (four self-reported states)

### Checkpoint: Complete
- [ ] Every success criterion in SPEC-plan.md is met
- [ ] `/impeccable critique` on `/plan`, material issues fixed
- [ ] Review with the team

## Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| No Groq key yet, so the real AI can't be tested | High | Mock-model tests cover the logic; the fallback path is built and tested; Luis creates a free key at console.groq.com before Checkpoint B |
| The chosen Groq model doesn't support structured output or gets retired | Med | Model id from `GROQ_MODEL`; check Groq's structured-output model list in Task 4; parse the output with Zod either way |
| The AI returns steps that are vague, too long or childish | Med | Easy Read rules in one prompt; schema caps (3 to 6 steps, at most 10 minutes, 80 characters); the person reviews and edits before adding |
| Sensitive profile data reaching the provider | High | Only `task`, `explicitSteps` and `summaryMode` are accepted by the request schema; a route test asserts the prompt contains nothing else |
| Free-tier rate limits during the demo | Med | Typed `failed` error with the manual fallback; keep the demo to a few break-downs |
| Hydration mismatch from `localStorage` | Low | Same `useHydrated()` gate as the Profile |

## Parallel Work

- After Task 1, teammates can call `addStepToPlan()` from Jobs and Interview.
- Task 4 (server) does not depend on Tasks 2 and 3 (UI), so it could be built in parallel; Task 5 needs both 2 and 4.

## Open Questions

- Kairos feedback on the starter path copy.
- Groq default model, decided in Task 4 from Groq's current docs.
