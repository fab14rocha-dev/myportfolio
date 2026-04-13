# 5. Job Hunt

## What It Is
A personal job search dashboard for Fabricio. Tracks applications, stores his professional profile, helps tailor resumes to job descriptions, and surfaces role ideas based on his background.

## About Fabricio
- Current role: Language Services Director at Publicis Production
- Background: Language Services (director level), Sales, Operations
- Works 100% remote — this is a hard requirement for any role he considers
- Analytical personality — prefers factual, data-driven work over vague sales dynamics
- Interests: technology, coding, numbers, operations, process improvement
- Open to: same industry (language/localization) OR adjacent industries where his skills transfer (e.g. Revenue Ops, Vendor Management, Localization PM at tech companies, Operations roles)
- Not sure exactly what he wants yet — the tool should help him explore options too

## What This Tool Does
1. **Application Tracker** — log jobs applied to: company, role, date, status, notes
2. **Profile** — store Fabricio's background, skills, and job criteria in one place
3. **Resume Tailorer** — paste a job description, get a tailored version of his resume
4. **Job Board Links** — quick links to pre-filtered searches (remote, relevant roles)
5. **Role Explorer** — map his skills to roles/industries he might not have considered

## Stack
- Vanilla JS, HTML, CSS
- No backend — all data stored in localStorage for now
- Single-page dashboard layout

## File Structure
- index.html — main dashboard
- css/style.css — styles
- js/main.js — main logic
- 1. Reference files/ — job descriptions, resume drafts, notes

## Writing Style Rules
- No bullet points in role descriptions (forms don't render them well)
- No em dashes or similar punctuation that reads as AI-generated
- Plain, direct language — written as Fabricio would say it, not corporate speak

## Role Descriptions (for application forms)

### Language Services Director, translate plus (Publicis Groupe) — May 2025 – Present

As Language Services Director, I oversee a £2m+ annual portfolio of localisation programmes, working exclusively with life sciences accounts across medical devices, pharma, and clinical research. My role centres on building and maintaining long-term client partnerships, driving contract renewals, and identifying opportunities to grow accounts through tailored multilingual solutions. I work closely with cross-functional teams across creative, production, and operations to ensure delivery is seamless, on time, and aligned with each client's global brand strategy. I also lead external and internal pitches and collaborate directly with C-suite stakeholders to position localisation as a strategic enabler across diverse markets.

## Rules
- Keep everything on one page — no routing, no multiple pages
- Data persists in localStorage (no server needed)
- Remote-only filter must always be on by default
- Plain language — no corporate jargon in the UI
- Free tools only
