# 11. Personal Website

## What It Is
Fabricio's personal portfolio website showcasing all projects. Live at https://portfolio.project100.dev

## Stack
- React + Vite
- GSAP (scroll animations, entrance effects)
- Framer Motion (hover effects)
- Vanilla CSS (no UI frameworks)
- Canvas API (procedural lightning bolts)

## Live URL
https://portfolio.project100.dev

## Deploy
`npm run deploy` — builds with Vite and pushes to the `gh-pages` branch via the `gh-pages` npm package.
GitHub repo: https://github.com/fab14rocha-dev/myportfolio
The `public/CNAME` file contains `portfolio.project100.dev` so the custom domain survives every deploy.

## Sections (all live)
1. Hero — "Hi, I'm Fabrício" + flip-word animation tied to lightning bolts, stats counter, scroll hint arrow
2. Projects — card grid with shatter/explosion animation on open, FactSheet detail overlay
3. Contact — "I'm looking for more problems to solve" CTA linking to project100.dev/#open-form

## Key Components
- `LightningBolts.jsx` — canvas-based procedural lightning using midpoint displacement. Exposes `fireAt(x, y)` via `forwardRef` to trigger targeted bolts + spark burst
- `Hero.jsx` — flip-word cycle fires lightning at the word on each change, with shake + glow effects
- `ProjectCard.jsx` — card with status pill and project number
- `FactSheet.jsx` — full detail overlay with always-visible visit button
- `MagneticButton.jsx` — magnetic hover effect on CTA buttons
- `ScrollProgress.jsx`, `CursorGlow.jsx`, `Grain.jsx` — ambient effects

## Data
All project data lives in `src/data/projects.js` — update there to add/change projects.

## Rules
- No UI component libraries — custom CSS only
- Animations should feel purposeful
- No em dashes in any copy
