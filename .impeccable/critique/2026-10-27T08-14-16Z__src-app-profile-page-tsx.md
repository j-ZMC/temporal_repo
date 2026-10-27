---
target: Profile flow
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Users\\luis0\\Projects\\na-ai-challenge\\src\\app\\profile\\page.tsx"
target_fingerprint: "sha256:486be5ceb56a2ffcb4e461ccf1d587bbb7731705f3760bfcb427ca6bf7d56d68"
target_path: "C:\\Users\\luis0\\Projects\\na-ai-challenge\\src\\app\\profile\\page.tsx"
timestamp: 2026-10-27T08-14-16Z
slug: src-app-profile-page-tsx
---
Method: dual-agent (A: design review · B: detector + browser)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Stars turn gold for skipped questions; no saved confirmation after edit |
| 2 | Match System / Real World | 3 | Plain adult copy; "Save and continue" contradicts "Saved on this device" |
| 3 | User Control and Freedom | 2 | Skip in edit mode deletes the saved answer; Back can't cancel an edit |
| 4 | Consistency and Standards | 2 | Back/Skip/Next keep their labels in edit mode; exclusive option clears ticks silently |
| 5 | Error Prevention | 2 | Edit-mode data loss; Skip sits next to Next on mobile |
| 6 | Recognition Rather Than Recall | 3 | Summary question labels are muted and small |
| 7 | Flexibility and Efficiency | 2 | Edit one at a time only; acceptable for 8 steps |
| 8 | Aesthetic and Minimalist Design | 3 | Calm, but summary is ~2 screens with CTA at the bottom |
| 9 | Error Recovery | 2 | Disabled Next gives no reason |
| 10 | Help and Documentation | 2 | No question says why it's asked until the end |
| **Total** | | **24/40** | **Acceptable** |

## Design Specificity Verdict
Copy and IA are authored for this audience (needs not diagnoses, Kairos-derived options, plain-language adaptation summary). Visuals are ~40% stock shadcn wizard; the constellation shows only as an unjoined star row and never completes.
Deterministic scan: CLI 0 findings across profile route, profile components, nav and Reading panel. Browser overlay: 1 finding in all 3 states, cream-palette on body from the global --background token; brand-pinned, treated as a false positive for this flow.

## Priority Issues
- [P0] Skip in edit mode deletes a saved answer (profile-flow.tsx onSkip). Fix: Cancel/Save in edit mode with a draft committed only on Save.
- [P1] Tap targets 36px (spec 44px); Edit buttons 28px; faint focus ring only around the 16px control. Fix: h-11 buttons, row-level focus ring.
- [P1] No ending moment and gold misused (bullets, skipped stars). Fix: fill stars only when answered, neutral bullets, joined constellation on the summary, CTA "Go to my plan".
- [P2] Summary too long, CTA at bottom, adaptation cap hides confirmed filters, Reading tip is not actionable.
- [P2] Silent behaviours: exclusive option, disabled Next with no reason, missing "change this anytime".

## Persona Red Flags
- Jordan: doesn't know why each question matters; disabled Next looks broken; live nav invites leaving.
- Sam: progress precedes the focused heading; summary leaves focus on body; faint focus ring.
- Casey: 36px targets; with large text + dyslexic font, Next falls behind the bottom nav; edit state lost on reload.

## Minor Observations
- Header overflows at 900px with dyslexic font + larger text.
- font-heading ignores the dyslexic override (dialog title).
- Tab title never changes per step.
- Welcome has no visual preview of the 8 steps.

## Questions to Consider
- Should each answer show its effect immediately?
- Should the main nav be hidden during onboarding?
- Should "long texts" let the user try the reading aids right there?
