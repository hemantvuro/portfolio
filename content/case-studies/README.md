# Case Studies — Content Source of Truth

This folder holds the **written content and preserved context** for each case study on the
portfolio. One Markdown file per project. The website pages (`work/*.html`) are built _from_
these files — edit content here first, then reflect it in the HTML.

> For the overall site plan, build decisions, and home-page structure, see the root
> [`PORTFOLIO-PLAN.md`](../../PORTFOLIO-PLAN.md).

---

## Index

| Slug | Project | Company | Status | Page | Content file | Visuals folder |
|------|---------|---------|--------|------|--------------|----------------|
| `messaging-vision` | Messaging Component Builder 2.0 | Salesforce (Service Cloud) | 🔒 Confidential | `work/messaging-vision.html` | `messaging-vision.md` (26 slides + prototype walkthrough) | `assets/case-studies/messaging-vision/` ✅ 26 slides · `…/prototype/` ✅ 12 screens |
| `customer360` | Customer360 | ServiceNow (CSM Customer Ops) | 🌐 Showable | `work/customer360.html` | `customer360.md` (full, 23 slides) | `assets/case-studies/customer360/` ✅ 23 images |
| `patient360` | Patient360 | Self-initiated (reframed from a design challenge) | 🌐 Public | `work/patient360.html` | `patient360.md` (full, 13 discovery slides + 15 final screens + notes) | `assets/case-studies/patient360/` ✅ 13 slides · `…/final/` ✅ 15 screens |

_Max 5 case studies planned. Add a new row + file + visuals folder when a project is introduced._

**Status legend**
- 🌐 **Public** — fictional or self-initiated; safe to show in full.
- 🔒 **Confidential** — real client work; screens redacted, specifics (named customers,
  exact metrics) held for a live walkthrough / shared on request.

---

## Shared narrative structure

Every case study follows the same simple spine (kept snippet-length — this is a sampler,
not the full interview deck):

**Context → Constraint → Decision → Trade-off → Outcome**

And is framed through the **three skill lenses** the portfolio is built around:

- **Facilitation** — workshops, stakeholder alignment, leadership buy-in, co-design.
- **Vision** — north-star concepts, future-looking product direction.
- **Release / Rigor** — research, testing, heuristics, shipped work, measurable impact.

Not every project uses every lens equally; each file notes which lenses it leads with.

---

## Per-file template

Each case-study file uses this skeleton:

```md
# <Project name>

- Slug / page / company / role / timeline
- Status (Public / Confidential) + what is public vs redacted
- Leading skill lenses

## One-liner
## Context
## Constraint
## Decision
## Trade-off
## Outcome
## Skill lenses (Facilitation / Vision / Release)
## Source material   ← raw notes preserved verbatim (deck slides, research, etc.)
## Confidentiality notes
## Open items
```

The **Source material** section is the important one for preserving context: keep the raw,
unpolished facts (deck slide contents, metrics, quotes) there so nothing is lost, even if the
public-facing copy is trimmed or redacted.

---

## Image / visuals convention

Visuals are preserved so the website versions can be **re-created** from a source of truth.

- **Location:** each case study stores its source visuals under
  **`assets/case-studies/<slug>/`** (e.g. `assets/case-studies/messaging-vision/`).
- **Filenames:** ordered + descriptive, so the sequence and subject are obvious at a glance —
  e.g. `slide-01-title.png`, `slide-12-metrics-success-hesitation.png`, `flow-permissions.png`.
- **Embedding:** the MD file embeds each image **inline, next to its content**, using a relative
  path from the MD file's location: `../../assets/case-studies/<slug>/<file>`.
- **Captions:** every embedded image has a short caption describing what the visual shows, so it
  can be rebuilt on the site even without opening the original file.
- **Confidential projects:** redact/blur any real product screenshots before publishing to the
  live site (the source copies here can stay un-redacted for internal reference).
- **Quality:** deck screen-captures are fine for preserving context, but prefer clean
  PNG/SVG exports from Figma when building the final website visuals.

**Status:**
- `messaging-vision/` — ✅ 26 deck slides captured and embedded.
- `customer360/` — ⏳ pending source visuals.
- `patient360/` — ⏳ pending source visuals.
