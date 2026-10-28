---
target: My plan (/plan)
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Users\\luis0\\Projects\\na-ai-challenge\\src\\app\\plan\\page.tsx"
target_fingerprint: "sha256:c32e58147d456283b5fe9dea3a5dd15b5caa83ce5957b8b32b392161008b7e87"
target_path: "C:\\Users\\luis0\\Projects\\na-ai-challenge\\src\\app\\plan\\page.tsx"
timestamp: 2026-10-28T07-20-26Z
slug: src-app-plan-page-tsx
---
Method: dual-agent (A: design review · B: detector + browser overlay)

## Design Health Score: 25/40 (Acceptable)
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 3 | Focused Undo/headings land under the 53px sticky header |
| 2 | Match real world | 2 | AI breaks "Finish your profile" into résumé tasks the app doesn't have |
| 3 | User control | 3 | Pause has only "Keep going"; Done on profile step contradicts the profile nudge |
| 4 | Consistency | 2 | Primary button swaps between steps; Up next vs See what's next rules differ |
| 5 | Error prevention | 2 | Done primary before opening a linked step; star dialog Done skips order |
| 6 | Recognition | 3 | See what's next summary lost its disclosure arrow |
| 7 | Flexibility | 2 | Enter submits "Add as one step" while Break it down is primary; durations not editable |
| 8 | Minimalism | 3 | First-timer header stacks five items before the task |
| 9 | Error recovery | 3 | Error footer has no Cancel |
| 10 | Help | 2 | Star hint shows with nothing to undo; check-in effect unexplained |

## Design specificity
Mostly specific (one weighted card, constellation, peach for achievements only, no-timer Undo); generic edges in the break-down dialog, Pause and end state. Detector: CLI 0 findings; browser 1 straggler ("tomorrow." alone) in Done for today at ~500px, clean at 375px and inside the step dialog.

## Priority issues
- [P0] Break it down dialog overflows the viewport and can't scroll (818px in 630px; mobile -15 to 827px). Fix: max-h 100dvh-2rem, scrolling step list, fixed header/footer. → adapt
- [P1] Focus targets hidden under sticky header. Fix: scroll-padding-top on html. → harden
- [P1] AI breakdown lacks app context; Done on self-completing steps. Fix: hide Break it down / Done on starter-profile (Open Profile only); give the AI in-app context. → clarify
- [P2] Action order shifts between steps; Done primary before Open. Fix: fixed order Open X → Done → Break it down. → layout
- [P2] Weak close: end state repeats constellation, counts old days, false "tomorrow" promise; Pause has no stop. Fix: today's steps only, honest copy, "Stop for today". → delight

## Persona red flags
Jordan: blank load, five header items, two profile links. Sam: focus under header, clipped dialog, star labels lack position. Casey: shifting buttons, Undo out of view. Low-energy user: no "stop for today", AI makes more work, end copy promises a plan that never comes.

## Minor
Peach star ~1.6:1 on mint; later rows lack icons; text-only loading; manual mode can remove the only box; Pause not persisted; slashed zero reads "10" as "19"; no dark --star.

## Questions
1. Should linked steps only count as done after visiting the module? 2. Should the constellation appear large only at the lit moment and end of day? 3. Should "Stop for today" count as a finished day?
