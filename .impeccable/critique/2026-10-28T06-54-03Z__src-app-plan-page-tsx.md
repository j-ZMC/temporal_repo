---
target: My plan (/plan)
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\luis0\\Projects\\na-ai-challenge\\src\\app\\plan\\page.tsx"
target_fingerprint: "sha256:c32e58147d456283b5fe9dea3a5dd15b5caa83ce5957b8b32b392161008b7e87"
target_path: "C:\\Users\\luis0\\Projects\\na-ai-challenge\\src\\app\\plan\\page.tsx"
timestamp: 2026-10-28T06-54-03Z
slug: src-app-plan-page-tsx
---
Method: dual-agent (A: design review · B: detector + browser overlay)

## Design Health Score: 25/40 (Acceptable)
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 3 | Count repeats constellation; AI loading is one grey line |
| 2 | Match real world | 3 | "Open" doesn't say where it goes |
| 3 | User control | 2 | Remove deletes instantly, no undo; removed starter steps can't return |
| 4 | Consistency | 2 | "Open" link 14px borderless vs 16px outline siblings; icons differ between lists |
| 5 | Error prevention | 2 | Remove first in star dialog; Low/Stressed picks "Save one job" before "Look at 3 jobs" |
| 6 | Recognition | 3 | Nothing signals stars are tappable |
| 7 | Flexibility | 2 | No reorder, no minutes edit, manual steps fixed at 5 min |
| 8 | Minimalism | 2 | Five equal-weight cards compete; disabled Add-a-step button reads primary |
| 9 | Error recovery | 4 | Calm fallback, both paths, text kept |
| 10 | Help | 2 | No explanation of why one step shows or what Break it down does |

## Design specificity
Partly authored (constellation, check-in, consented AI), mostly stock shadcn cards. Detector: 0 findings CLI and browser (desktop + 375px); dialogs not scanned live.

## Priority issues
- [P1] Current step is not the dominant element; check-in card competes above it. Fix: give the current step the only weighted surface, make check-in a compact chip row, mute Up next / See what's next / Add a step. → layout, distill
- [P1] Remove has no undo (list + star dialog). Fix: inline "Removed. Undo", move Remove away from primary actions. → harden
- [P1] Energy picking breaks path order (Save one job before Look at jobs). Fix: keep order, pick first short step without unmet prerequisite, or offer to break down the next step. → harden
- [P2] Hidden/unlabeled affordances: stars not discoverable, bare "Open" links. Fix: "Open Jobs"/aria-label, one-line star hint, hover ring. → clarify
- [P2] Break-down review truncates text; Break it down primary even for 2-minute steps. Fix: auto-grow textareas, numbered steps, Done primary on short steps. → polish

## Persona red flags
Jordan: five blocks, unclear which matters; Open vs Done unclear. Sam: repeated "Open" links; list Remove not announced; blank pre-hydration main. Casey: header eats first screen; Pause lost on reload; close Remove targets. Low-energy job seeker: feelings question before any task, 5 options; flat Done; all-done nudges more work.

## Minor
Peach star 1.5:1 on mint; check-in outline buttons look disabled; manual "5 min" overclaims; OpenDyslexic may not be loading; "You've got this." cliché.

## Questions
1. If the promise is one clear step, why five cards? 2. Should a done star be deletable? 3. On Low energy, reshuffle or offer a smaller first piece of the same step?
