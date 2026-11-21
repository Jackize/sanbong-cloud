# BRIEF — SanBong Cloud

**Self-authored under explicit creative delegation**  
User: "bạn quyết định hết" (2026-11-21). Existing brand assets: logo SVG, emerald/dark palette, Vietnamese copy, contact API. No photography or footage. No `KIE_AI_API_KEY` — build from operable UI + brand kit only.

---

## 1. Vibe (authored)

Night-ops, calm control, pitch under lights. References: a floodlit 5-a-side pitch at 21:00; a busy reservation desk that finally went quiet; the status bar of a well-built ops tool.

## 2. Scroll journey (authored)

1. Open on the booking board already live — empty evening, waiting for calls.
2. Scroll places the first bookings; the board becomes the argument.
3. Peak: the night rush fills hour by hour under the visitor's hand; a conflict auto-resolves.
4. Sideways: every sport the product covers, as labelled venues.
5. Substance: staff, revenue, brand — as panels that compute from sample data.
6. Close: a real first-run form. Cursor lands in the name field.

## 3. Energy curve (authored)

Quiet open → steady build → one sharp peak at the night rush → calm operational panels → quiet resolve at the form.

## 4. Feeling curve

| Act | Emotion | On-screen cause |
|---|---|---|
| 1 | Unease | Empty board, status "Đang chờ khách gọi…", clock stuck at 17:00 |
| 2 | Relief | First bookings land; status flips to system-owned |
| 3 | Awe (peak) | Scroll-clock advances; slots cascade in; conflict resolves to confirmed |
| 4 | Appetite | Lateral walk across sports venues |
| 5 | Confidence | Panels compute revenue and staff load from labelled demo data |
| 6 | Resolve | Real contact form as the only input that matters |

**Peak (tell-a-friend):** "It's the site where scrolling the page books the night for you."  
**Completed sentence:** It's the site where the wheel is the night clock on a real booking board.

## 5. Signature move (authored)

**Scroll Clock** — in the peak act, `--sc-p` advances an evening clock; each hour tick inserts a booking from a real data array into operable slot markup. At the rush hour, two requests collide and one resolves with a confirmed chip. Bespoke JS on the page; engine untouched.

## 6. Aesthetic range (authored)

Premium-minimal operational: dark canvas, one emerald accent, Be Vietnam Pro (Vietnamese), product chrome instead of marketing chrome. Not playful, not brutalist, not editorial.

## 7. Structure fork (authored)

**Distinct scenes via Live surface grammar** — not one unbroken worldflight. The product surface is the place; scroll changes its state, not a camera path. No generated footage.

## 8. Assets (authored / evidence)

- Have: `logo-icon.svg`, `logo.svg`, `og-image.jpg`, existing contact API, brand colours.
- Generate: none (no API key). World = photographic? No — **live UI surface** (software grammar). Honesty: demo scenario clearly labelled.

---

## Product answers (authored)

- **What / who:** SanBong Cloud — website + ops app for Vietnamese sports venue owners (football, pickleball, basketball, tennis, badminton).
- **Believe by end:** Your pitch can take bookings tonight without you answering the phone.
- **One action / one label:** Tư vấn miễn phí (used on chrome and form submit).
- **Art direction:** Live surface (product as the page). Other worlds rejected: no footage for continuous world; filmic one-shot needs scrub video; typographic poster weakens a demo pitch.

---

## Grammar decision

**Live surface.** Other seven lost because:
1. Filmic one-shot — no scrub assets; burden of proof not earned.
2. Chaptered editorial — not a manifesto.
3. Continuous world — requires worldflight video chain; no assets.
4. Typographic poster — demotes the product demo.
5. Gallery — secondary to "watch what it does."
6. Split stage — before/after is weaker than an operable board.
7. Rhythmic cutlist — wrong energy for B2B venue owners.

**Fingerprint gate:** registry empty — first build, nothing to clear.

## Score table

| Beat | Device | Why |
|---|---|---|
| Unease / empty night | `pin` | Surface holds; state is the story |
| Relief / system takes over | `flow` + `reveal` | Hard change of ground into the product claim as status idiom |
| Peak / night rush | `pin` + Scroll Clock (`--sc-p`) | Largest span; clock is the signature |
| Range / sports | `pan` | Lateral = options |
| Substance | `flow` + `count` + `in` | Real demo numbers only |
| Commitment | `pin` (form stage) | Close is an actual input, not a magnet CTA |

Checks: 4+ families (pin, flow/reveal, pan, count). No adjacent same family. Zero scrub. Peak span largest. Length shorter than filmic 13.6vh band (~9vh).

---

## Revision 2 (2026-11-21): layered hero

**Self-authored under explicit creative delegation.** User chose: keep the existing structure, add a dimensional photographic hero, generate imagery with Cursor's image tool, "bạn quyết định hết". Reason: scroll-craft 0.3.1 makes a layered hero a baseline for a marketing page.

**Hero scene:** a floodlit 7-a-side pitch at dusk, lens at turf level. Copy lives in the empty left sky.

| Plane | Asset | Motion over the pinned span (1.9vh) |
|---|---|---|
| Plate | `assets/hero/plate.webp` / `plate-m.webp` (clean, no ball) | scale 1 → 1.07 about the horizon |
| Haze | CSS band at the horizon | rises 3svh |
| Copy (h1, sub, CTA) | real markup | fades + recedes p 0.08–0.38 |
| Ball (subject) | `ball.webp`, true alpha (magenta key) | scale 1 → 1.22 from its contact point, drops 2svh |
| Grass (foreground) | `grass.webp`, solid below silhouette | rises 9svh, overtakes the ball's base |
| Beat 2 | "Tối nay, sân của bạn có kín lịch không?" | fades in p 0.42–0.64, stays crisp while the scene fades to canvas |

Contact anchor: horizon maths (a ~22cm ball from a ~15cm-high lens straddles the horizon at 68% of its height); grass always covers the base.

**Feeling curve, updated:** Pride (your pitch, lit, the promise) → Unease (empty board) → Relief → Awe (peak, unchanged) → Appetite → Confidence → Resolve. The hero is quieter than the peak by design.

**Authored silence:** p ≈ 0.38–0.42 in the hero, image only, between the promise and the question.

**Mobile:** separate portrait plate, copy above the subject, larger ball, taller grass band.

**Reduced motion:** hero collapses to one static viewport, no beat 2, all layers present.

Asset pipeline: `hero-src/` holds the generated originals and `process.py` (key, despill, grade, export WebP). Run with a Python that has Pillow + numpy.
