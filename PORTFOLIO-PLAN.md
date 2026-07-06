# UX Portfolio Sampler - Plan & Process

## Context: what we are building

A **simple, light, fast** online UX portfolio to **share with recruiters** while applying for roles
outside India (UAE, Europe, Australia). It is a **sampler**, not a full case-study deck: enough to
earn a callback in a 2-3 minute skim, with the detailed walkthrough saved for the live interview.

**Goal:** credibility + intrigue, not completeness. Keep it minimal, readable, and quick to load.

### Projects featured
1. **Customer360** (ServiceNow) - full end-to-end product, framed through three skill lenses:
   Facilitation (workshops), Vision (north star designs), Release (shipped work). *Confidential.*
2. **Patient360** - self-initiated, fictional-but-complete flavor of Customer360. *Public.*
3. **Messaging Component Builder Vision** (Salesforce) - north-star vision for a current product:
   usability issues -> user testing + heuristics -> stakeholder alignment + leadership buy-in ->
   workshops -> vision concepts -> AI-led final concept. *Confidential.*

---

## Decisions locked

- **Build:** static, hand-coded site (HTML/CSS + minimal JS). No frameworks, no build step.
- **Host:** GitHub Pages (served from repo root).
- **Style:** light, minimal, editorial, whitespace-heavy. Near-black **ink** base + one tasteful deep accent.
  One clean sans-serif. Minimal, tasteful motion only.
- **Direction:** enterprise, metrics-led (substance over sparkle).
- **Resume:** downloadable PDF link (no separate About page; short About blurb on home).
- **Contact:** kept minimal - email + LinkedIn.
- **Confidential work:** Patient360 is public. Customer360 and Messaging Vision are built with
  placeholder/redacted content + a graceful "deep dive available in interview / on request" note.

---

## Reference websites (online inspiration)

Primary references (the two the site is modeled on):
- **Lindi Wheaton** - https://www.lindiwheaton.com/ (home layout + case-study detail structure)
- **Paul Shellooe** - https://paulshellooe.com/ (sectioned home, narrative case studies)

Other portfolios reviewed (enterprise, metrics-led group):
- **Tiago Oliveira** - https://oltiago.design/
- **Muhammad Saad** - https://saadtariq.com/ (hand-coded, like our approach)
- **Lais Welter** - https://laisdesign.com/ (cross-border + graceful NDA handling)

---

## Home page structure (top to bottom)

1. **Hero (first fold):** bold one-line headline + short supporting sentence + **View Resume** CTA.
2. **Social links:** LinkedIn + email.
3. **About Me:** short blurb (who I am, what I do, location + open-to markets).
4. **Strengths:** 3-4 cards - Facilitation, Vision, Release/Delivery, Enterprise UX.
5. **Process:** numbered steps (01-05: Understand -> Frame -> Explore -> Validate -> Ship).
6. **Work Experience:** list/timeline (role, company, dates, one-liner).
7. **Selected Work:** tiles (bento on desktop, stacked on mobile).
8. **Footer:** resume PDF, email, LinkedIn, location line.

**Work tile anatomy:** image, title, subtitle (company/context), one-line info, tags, "View details" CTA.

---

## Case-study detail page (Lindi Wheaton-style, modular)

Reusable, stackable sections; each project uses the ones that fit:

1. **Hero** - title + theme tags + role + timeline (+ headline outcomes where available)
2. **Pillars (01-04)** - core angles (Customer360 = Facilitation / Vision / Release)
3. **Problem** - 2-3 callouts describing the stakes
4. **Approach / goals** - 3 blocks
5. **Context** - short paragraphs + core problems list
6. **Process (01-05)** - how the work was done
7. **Before / after** - two-column comparison
8. **Outcomes / impact** - tiles, quantified where possible
9. **Screen concepts** - image gallery + captions (redacted for confidential projects)
10. **Closing** - summary columns + "deep dive on request" note
11. **CTA footer**

---

## Proposed file structure

```
index.html                       # home
work/customer360.html            # case study (confidential - redacted)
work/patient360.html             # case study (public)
work/messaging-vision.html       # case study (confidential - redacted)
css/styles.css                   # shared styles (type, layout, accent, responsive)
js/main.js                       # tiny JS (mobile nav / subtle reveals)
assets/images/                   # thumbnails + case-study images (placeholder for now)
assets/resume.pdf                # resume download (placeholder until provided)
assets/favicon, assets/og-image  # branding + link-preview image
```

---

## Process / build order

1. **Scaffold** - repo file structure for GitHub Pages.
2. **Styles** - light theme, type scale, ink + accent, responsive, subtle hover states.
3. **Shared layout** - nav + footer + favicon + Open Graph/meta tags (clean link previews when shared).
4. **Home page** - hero, social, about, strengths, process, experience, work tiles.
5. **Case-study template** - the modular Lindi-style layout.
6. **Three case studies** - Customer360, Patient360, Messaging Vision (placeholder/redacted content).
7. **Content pass** - real copy, Figma exports, resume PDF, contact links.
8. **Gating decision** - decide how to protect the two confidential case studies before going live.

---

## Deferred / open items

- **Gating mechanism** for confidential case studies (client-side password vs unlisted URLs vs
  Netlify/Cloudflare password vs share-on-request) - *pinned; decided before launch.*
- **Real content** - copy, images, resume PDF, LinkedIn/email values, and metrics to be supplied.
- **Accent color** - exact deep accent hex to be finalized during styling.
