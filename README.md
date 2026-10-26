# Constela · by Astralis

**Find a job, one step at a time.**

Constela is an AI copilot that turns the job search into small, manageable steps for neurodivergent young adults, from building a profile to their first day at work. Every step is a star; together they form your constellation, your path to a job.

Built for the [North American AI Challenge](https://tech.asu.edu/na-ai-challenge) (ASU Enterprise Technology and the Spark Center for Innovation in Learning), with Kairos as our challenge partner.

## Why

The challenge asks for AI that supports **executive function**: planning, focus, task management and transitions. Job hunting is one of the heaviest executive-function tasks there is: many steps, deadlines, uncertainty, interview anxiety and a big routine change once you're hired.

## Modules

| Module | What it does | Route | Owner |
| --- | --- | --- | --- |
| Profile | A short onboarding about needs, not diagnoses | `/profile` | Luis |
| Personalization | The app adapts to the profile; Reading settings (dyslexia-friendly font, larger text, calm mode, reduced motion) | Reading panel | Regina |
| My plan | Up to 3 steps a day, an energy check-in and "Break it down for me" | `/plan` | Luis |
| Jobs for you | Openings filtered by profile and explained in plain language, plus course suggestions | `/jobs` | Zahid & Juan |
| Interview | Guided practice, "What to expect" and "Translate this" for recruiter messages | `/interview` | Evy |
| LinkedIn extension (optional) | A "less chaotic" mode with the same look and settings | — | Regina |

AI lives inside each feature with a clear purpose instead of a blank chatbot, so nobody has to figure out what to ask.

## Design principles

- Adapt by needs, not by diagnosis.
- Calm by default: warm cream background, night-blue text, star gold only for achievements, no alarm red.
- [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/) as the main font; OpenDyslexic as an option.
- WCAG AA contrast on every text color.
- Respect the system "reduce motion" setting.

## Tech stack

[Next.js 16](https://nextjs.org) · [shadcn/ui](https://ui.shadcn.com) · [AI SDK](https://ai-sdk.dev) · Tailwind CSS · TypeScript

## Getting started

```bash
npm install
cp .env.example .env.local   # then add your API key
npm run dev
```

Open http://localhost:3000.

## Team Astralis

Luis · Regina · Juan · Zahid · Evy
