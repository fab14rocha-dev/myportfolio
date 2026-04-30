# MRL New Website

## What It Is
A redesigned business website for Martina Rocha Luz — professional calligrapher and engraver based in Leeds, UK. The goal is to attract luxury brand clients and replace her current WordPress site with something more refined and bespoke.

## The Business
- **Services:** Live Engraving, Live Calligraphy, Corporate Events (wedding dropped — not offered anymore)
- **Clients:** Luxury brands (Vacheron Constantin, Dior, Maison Francis Kurkdjian, Ted Baker, Harvey Nichols, Patrón, Carmex, Channel 4, Devonshire Hotels)
- **Press:** Save The Date, Yorkshire Guide
- **Tagline:** "Crafting Refined Beauty One Letter at a Time"
- **Pricing:** From £90/hour (engraving), 2-hour minimum

## Design Direction
- **Feel:** Luxury, minimalist, elegant — less is more
- **Audience:** High-end brands, event planners, brides
- **Tone:** Professional but warm, personal
- **Reference:** Current site screenshots in `1. Reference files/current-website-notes.md`
- Colour palette, fonts, and detailed design TBD — will be discussed during the build

## Pages to Build
1. **Home** — hero, intro, Trusted By logos, testimonials, As Seen In
2. **Services** — Engraving, Calligraphy, Live Events (separate sub-pages)
3. **Portfolio** — image grid
4. **Blog** — static blog posts (no CMS, just HTML files)
5. **Contact** — enquiry form
6. **About** — Martina's story

## Stack
- Vanilla HTML, CSS, JavaScript
- No frameworks, no CMS, no paid services
- Static site — no backend needed (contact form will use a free service TBD)

## File Structure
- index.html — home page
- css/style.css — styles
- js/main.js — main logic
- assets/ — images, icons, fonts
- 1. Reference files/ — notes, screenshots, briefs

## Project Bible
- `6. Docs/Bible_MRL.html` — full project reference (design decisions, pages, palette, references, content notes)

## Current Status
- Homepage (`1. HTML/index.html`) is well advanced — Studio McGee direction
- Page order: Hero → Services → Trusted By ticker → Case Studies → CTA strip → Portfolio → Testimonials → Blog → Press → Footer CTA → Footer
- Portfolio: 31 images across Engraving, Calligraphy, Corporate categories. 9 shown on homepage, all shown when filtering. GLightbox for click-to-expand.
- Testimonials: carousel with 2 active (Fiona/Vacheron, Ashley/Ted Baker) + 3 archived wedding ones (hidden, class `t-slide-archived`)
- Brand logos: SVGs in `2. Images/1. Brands images/svg/` for most brands
- Sub-pages not yet started: Services, Portfolio, Blog, Contact, About
- Contact form solution not yet decided
- Some portfolio images still hotlinked from martinarochaluz.com — need local copies before go-live

## Design Direction (current)
- Reference: studio-mcgee.com and mcgeeandco.com
- Palette: warm neutrals only — no teal, no gold
  - `--bg: #F9F7F4` / `--bg2: #F2EFE9` / `--border: #E6E0D8`
  - `--ink: #1E1C1A` / `--mid: #6B6663` / `--dim: #AAA49C`
- Full-width hero image (100vh)
- Minimal copy — short headlines, 1–2 lines per section
- Images do the visual work

## Animation Plan
- Use GSAP + ScrollTrigger, matching the style of the XPerience project
- Reference: `2. Projects/12. XPerience/3. Scripts/main.js` for patterns
- Don't add animations until Fabricio asks

## Key Notes
- This is a real site that will go live — quality matters
- Blog posts will be hardcoded HTML for now
- Portfolio is image-heavy — keep mobile performance in mind
- Keep accessibility in mind: good contrast, readable fonts
