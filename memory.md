## What it is
Portfolio site showcasing all projects. React + Vite + GSAP + Framer Motion + Canvas API. Deployed at portfolio.project100.dev via GitHub Pages (`npm run deploy` — not Firebase).

## Key decisions
- LightningBolts.jsx uses midpoint displacement on a Canvas element and exposes `fireAt(x, y)` via `forwardRef` so Hero.jsx can trigger targeted bolts on each flip-word change — this is the centrepiece interaction, not a decoration
- No UI component libraries at all — every component is custom CSS by rule
- All project data is in `src/data/projects.js` — that is the only place to add or edit projects shown on the site
- For projects with no public link, use `link: null` + `preview: "queue"` flag — triggers a "See how it works" button in FactSheet that opens a custom modal instead of the burn/launch animation
- QueuePreview.jsx is the first custom preview modal — pattern can be reused for future projects that aren't publicly linkable

## Context not in files
- GitHub repo: https://github.com/fab14rocha-dev/myportfolio
- Custom domain `portfolio.project100.dev` is set via `public/CNAME` — must not be deleted or the domain breaks on every deploy

## Session log
- 2026-06-15: Memory file created. No active work noted.
- 2026-06-16: Large session. Full mobile responsive pass across all CSS files (Hero, Projects, Contact, FactSheet, ProjectDetail). MRL card updated: status Complete, link martinarochaluz.com, 30hrs, Free, Launched June 2026. Project 100 flipped to Complete (tool is done even if challenge continues), Calendly removed from tools. Engraving Queue added as card #7 (In Progress) with custom QueuePreview modal — no public link, "See how it works" opens split-view mockup of customer + staff pages. Hero stats now show 6 completed, 1 in progress, 93 to go.
- 2026-06-17: Folder renamed from "11. Personal Website" to "11. Portfolio" (previously blocked by VS Code locking the folder — retried successfully this session). CLAUDE.md title updated to match. Note: package.json `name` field still says `11--personal-website` — cosmetic only, doesn't affect the deploy script.
- 2026-07-02: Retheme to match Project 100's new landing page brand. Structure, layout, GSAP/Framer Motion animations, and the lightning bolt effect are unchanged — only colors and fonts swapped. New CSS vars in `src/index.css`: `--bg #1a1410`, `--bg-card #221b14`, `--accent #e08a3c`, `--text #f0e6d2`, `--text-muted #a99d88`, `--text-dim #8a7e6b`, borders now bone-tinted `rgba(240,230,210,…)`. Added `--accent-text: #1a1410` for dark text on accent-colored buttons (replaces old hardcoded `#020f05`/`#000`). Fonts: added Archivo (base) + JetBrains Mono (uppercase labels, buttons, stats) via Google Fonts in `index.html`, matching Project 100 exactly. Lightning bolt canvas recolored from green (`rgba(0,196,106,…)`) to amber (`rgba(224,138,60,…)`), bolt core color warmed from icy cyan (`#c8fff0`) to pale gold (`#fff2d9`). QueuePreview.css mockup-internal colors (the Engraving Queue app preview UI, not the portfolio's own theme) left untouched on purpose. Verified visually with a Playwright screenshot of hero + projects sections — no console errors, colors/fonts render correctly.
