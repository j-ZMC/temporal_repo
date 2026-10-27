# Spec: Profile

Status: draft, waiting for team review · Owner: Luis (with Regina for the adaptations)

## Objective

A short onboarding that learns what each person needs, so the rest of Constela adapts to them instead of the other way around. Kairos told us their users struggle with noise, textures, change, spontaneous plans, long texts, unclear instructions and dyslexia, and that they want to be treated as adults.

**User:** a neurodivergent young adult (ADHD, autism, dyslexia and others) looking for a job, with enough independence to use the app on their own.

**Success looks like:** in under 3 minutes the person answers a few questions, sees in plain words how the app will adapt, and every other module (My plan, Jobs, Interview) reads those answers.

### User stories

- As a user, I answer one question per screen, so I'm never overwhelmed.
- As a user, I can skip any question or the whole form, and the app still works with sensible defaults.
- As a user, I see a summary of my answers and what changes because of them, and I can edit it anytime.
- As a user, my answers stay on my device; nothing personal is sent to a server or an AI provider without me knowing.
- As a teammate, I read the profile from one function and get ready-to-use settings, not raw answers.

## Assumptions

1. Web app only (Next.js), responsive for phone and desktop. No accounts or database for the demo.
2. Answers are stored in `localStorage` on the device.
3. Questions ask about **needs, not diagnoses**. We never ask "do you have ADHD?".
4. The caregiver / high-support case is out of scope for the demo (pending confirmation with Kairos). We still ask about support level respectfully, but only to adjust tone and pacing.
5. All UI text is in English, written in plain language (Easy Read principles: short sentences, one idea each).

## The questions

Eight questions, all optional, one per screen. Each answer maps to concrete adaptations.

| # | Question (UI copy) | Type | Options |
|---|---|---|---|
| 1 | How do you like to read things? | single | Short summaries · Step by step · Listen out loud · Full text is fine |
| 2 | How do long texts feel? | single | Fine · Tiring · Really hard |
| 3 | When instructions aren't clear, what usually happens? | single | I ask · I guess · I get stuck |
| 4 | How do last-minute changes feel? | single | Fine · I need a heads-up · Very stressful |
| 5 | What bothers you in a workplace? | multi | Noise · Bright lights · Crowds · Some textures (uniforms, fabrics) · Strong smells · Nothing in particular |
| 6 | What makes it hard to get started? | multi | Too many options · Big tasks · Losing track of time · Getting distracted · Nothing in particular |
| 7 | Where would you like to work? | multi | Remote · Hybrid · On-site · Not sure yet |
| 8 | How much support would you like at work? | single | I'm fine on my own · Some check-ins · Regular support |

Copy rules: second person, no exclamation marks, no clinical words, every screen says "You can skip this" and "You can change this anytime".

## How the app adapts

The profile is turned into one `Adaptations` object that every module reads.

| Answer | Adaptation | Used by |
|---|---|---|
| Q1 Short summaries, or Q2 Tiring / Really hard | AI text in short summary mode; "Read more" to expand | Jobs, Interview, My plan |
| Q1 Listen out loud | Show a "Listen" button that uses the browser's speech (Web Speech API) | All |
| Q2 Really hard | Suggest turning on the dyslexia-friendly font and larger text (never forced) | Reading panel |
| Q3 I guess / I get stuck | AI always gives explicit numbered steps plus one example | My plan, Interview |
| Q4 Heads-up / Very stressful | Show "What to expect" before every event; flag jobs with changing schedules | Interview, Jobs |
| Q5 any sensory item | Filter or flag jobs and add matching questions to "Get to know the company" | Jobs |
| Q6 Too many options | My plan shows 1 step at a time instead of 3 | My plan |
| Q6 Big tasks | "Break it down for me" is offered first | My plan |
| Q6 Losing track of time | Each step shows a duration and an optional visual timer | My plan |
| Q6 Getting distracted | "Important first" view hides everything else | My plan |
| Q7 | Default job filters | Jobs |
| Q8 Some check-ins / Regular support | Gentler pacing and more check-in prompts | My plan |
| Skipped | Defaults: 3 steps, normal text, no filters | All |

## Interface

1. **Welcome:** one sentence on why we ask, "About 3 minutes", buttons "Start" and "Skip for now".
2. **Question screens:** the question, large tap targets (at least 44 px), "Back", "Skip", "Next". Progress shown as small stars lighting up, matching the constellation idea, plus "3 of 8" in text for screen readers.
3. **Summary:** every answer in plain words with "Edit", plus "Here's how Constela will adapt" (2 to 4 lines generated from `Adaptations`, no AI needed).
4. After saving, go to My plan.

No timers, no auto-advance, no animations beyond what "Reduce motion" allows. Fully keyboard and screen-reader usable.

## Tech Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui (base-nova), lucide-react. No new dependencies needed for this module except the test runner (see Testing).

## Commands

```
Dev:   npm run dev
Build: npm run build
Lint:  npm run lint
Types: npx tsc --noEmit
Test:  npm test            (after the test runner is approved)
```

## Project Structure

```
src/app/profile/page.tsx          → onboarding flow (client component)
src/components/profile/           → question screen, summary
src/lib/profile.ts                → Profile type, load/save, toAdaptations()
src/lib/profile.test.ts           → tests for toAdaptations()
```

## Code Style

Match the existing code: function components, Tailwind classes, shadcn components, short comments only for the why.

```ts
// src/lib/profile.ts
export type Profile = {
  reading?: "summary" | "steps" | "listen" | "full";
  longText?: "fine" | "tiring" | "hard";
  // ...one optional field per question
};

export function toAdaptations(p: Profile): Adaptations {
  return {
    summaryMode: p.reading === "summary" || p.longText === "tiring" || p.longText === "hard",
    stepsPerDay: p.startBlockers?.includes("too-many-options") ? 1 : 3,
    // ...
  };
}
```

## Testing Strategy

- `toAdaptations()` is the only real logic, so it gets unit tests: every answer maps to its adaptation, and an empty profile gives the defaults.
- Proposed runner: Vitest (one dev dependency). Needs team approval first.
- The flow is checked by hand in the browser at phone and desktop width, plus keyboard-only navigation.

## Boundaries

- **Always:** keep every question optional; store answers only on the device; follow plain-language copy rules; keep WCAG AA contrast; run lint and types before committing.
- **Ask first:** adding a dependency (including Vitest); sending any profile field to an AI provider; adding a question.
- **Never:** ask for a diagnosis; send the support-level answer (Q8) to an AI provider or any server; make a question required; use childish tone or illustrations.

## Success Criteria

- [ ] A person can finish all 8 questions in under 3 minutes, or skip at any point.
- [ ] Back, Skip and Edit work on every screen; answers survive a page reload.
- [ ] The summary shows the answers and how the app will adapt, in plain words.
- [ ] `toAdaptations()` is covered by tests for every option and for an empty profile.
- [ ] Works at 375 px and desktop width, with keyboard only, and with all four Reading settings on.
- [ ] No profile data leaves the device.

## Open Questions

1. Does Kairos agree with these 8 questions, especially the wording of Q8 (support level)?
2. Is our demo user someone with enough independence, or should we design for people with a caregiver too?
3. OK to add Vitest as the test runner?
4. Which AI provider do we use (see the team doc)? It only matters for the "Listen" and summary features in other modules, not for this one.
