# Video Studio — 14. Video Studio

## What This Project Does
A personal Remotion-based video editing studio. All short-form video work goes here — one consistent workflow, reusable compositions, and a growing library of templates so every new video starts from a solid base instead of scratch.

## Who It's For
Fabricio only (personal use for now).

## Problem It Solves
Instead of rebuilding video edits separately each time, this project holds all compositions in one place with a repeatable workflow. Videos come out consistent in style, timing, and structure.

## Tech Stack
- Remotion v4 (video rendering via React)
- React + JSX (no TypeScript — keep it simple)
- Remotion best-practices skill installed (guides Claude on Remotion patterns)

## Folder Structure
Each video gets its own named folder across all three locations. Use the same name everywhere.

- `src/compositions/VideoName/` — composition JSX file(s) for that video
- `2. Renders/VideoName/` — exported MP4(s) for that video
- `3. Assets/VideoName/` — any images, audio, or fonts specific to that video

Top-level Remotion files (do not rename):
- `src/Root.jsx` — registers all compositions
- `src/index.jsx` — entry point

## Workflow
1. Describe the video to Claude
2. Claude creates a folder `src/compositions/VideoName/` with the composition file inside
3. Claude creates matching folders in `2. Renders/VideoName/` and `3. Assets/VideoName/`
4. Claude registers the composition in `src/Root.jsx`
5. Preview in Remotion Studio: `npm run studio`
6. When happy, render: `npm run render -- --composition=<CompositionId> --output="2. Renders/VideoName/video-name.mp4"`

## Naming Conventions
- Folder names: `PascalCase` matching the Composition ID (e.g. `Project100Ad`)
- Composition files: `PascalCase.jsx` inside their folder (e.g. `Project100Ad.jsx`)
- Composition IDs in Root.jsx: match the folder/file name exactly
- Rendered files: `kebab-case.mp4` inside the video's Renders folder

## Style Defaults (update as your brand evolves)
- Background: dark (update with your brand colors when ready)
- Font: system default for now
- Duration: set per video

## Commands
```bash
npm run studio        # open Remotion Studio preview in browser (localhost:3000)
npm run render -- --composition=<CompositionId> --output="2. Renders/VideoName/video-name.mp4"
```
