# 11. Personal Website

## What It Is
Fabricio's personal portfolio website showcasing all completed projects in one public location. Aimed at himself and friends he shares it with.

## Stack
- React + Vite
- GSAP (scroll animations, entrance effects, timelines)
- Framer Motion (page transitions, hover effects)
- Vanilla CSS (no UI frameworks)

## File Structure
- index.html — Vite entry point (root)
- src/main.jsx — React entry
- src/App.jsx — root component, routing/layout
- src/components/ — one file per section/component
- src/styles/ — CSS files per component
- src/data/ — project data (projects list, etc.)
- src/assets/ — images, icons used in React
- 2. Images/ — raw/exported images, screenshots
- 6. Docs/ — planning notes, references

## Sections (planned)
1. Hero — bold intro with animated entrance
2. Projects — grid of project cards with hover effects
3. About — short bio
4. Contact — links (GitHub, email, etc.)

## Rules
- No UI component libraries (Bootstrap, MUI, etc.) — custom CSS only
- Keep animations purposeful, not just decorative
- All data (project list, bio) lives in src/data/ so it's easy to update
- Free tools only
