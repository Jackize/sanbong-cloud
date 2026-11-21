# sanbong-cloud — delivery report

**Brief:** Self-authored under explicit creative delegation ("bạn quyết định hết").

## Grammar
**Live surface.** Other seven lost: no scrub assets for filmic/worldflight; demo-is-the-argument beats poster/gallery/split/cutlist for this SaaS.

## Signature move
**Scroll Clock** — peak act `--sc-p` advances an evening clock; bookings from a real data array land in operable slot markup; conflict at 20:00 auto-resolves.

## Fingerprint gate
Registry was empty. Row appended. Sequence `pin → flow → pin → pan → flow → pin` at **~12.5vh** (clears the 13.6–13.8 filmic band).

## Journey / feeling / peak
Empty night → status relief → night-rush awe (peak) → sports appetite → ops confidence → form resolve.  
Peak tell-a-friend: "It's the site where scrolling the page books the night for you."

## Score
| Beat | Device |
|---|---|
| Unease | pin |
| Relief | flow + reveal |
| Peak | pin + Scroll Clock |
| Range | pan |
| Substance | flow + count |
| Close | pin (form input) |

## Generated assets
None (no `KIE_AI_API_KEY`). Brand logo + live UI surface only.

## Verified
- Desktop shoot: no dead scroll, contrast OK — `lab/shots/sheet.png`
- Mobile 390×844: no dead scroll — `lab/mobile/sheet.png`
- Reduced motion: no dead scroll — `lab/reduced/sheet.png`
- Pan overflow at 1440px: +1184px
- Scroll Clock mid-rush: bookings + conflict chip visible

## Not verified
Real iPhone decoder / touch scroll. Headless only.

## Local URL
http://127.0.0.1:4500/ (while serve is running)

## Shipped to
Project root `index.html` + `scrollcraft.css/js` + `styles.css` + `script.js` (contact API preserved).

---

## Revision 2 (2026-11-21): layered hero

Skill: scroll-craft 0.3.1 (identical to upstream `nateherkai/scroll-craft@75d81f7`).

- New act 0 `#hero`: pinned layered scene (plate, haze, copy, ball, grass, floor). Bespoke CSS driven by the engine's `--sc-p`; engine untouched. Cutouts reveal only after every hero image decodes.
- Sequence now `pin(hero/parallax) → pin → flow → pin → pan → flow → pin`, ~14.4vh desktop (outside the 13.6–13.8 band). Two pinned acts touch, but the visitor sees two different devices: a layered camera push, then a still board.
- Root `index.html` is now the source of truth; the build folder's `index.html/page.*` are the rev-1 snapshot.
- Removed visible em dashes (title, toasts). Brand link goes to `#hero`. Old `h1` on the board is now `h2`.
- `docker-compose.yml`: mounts `./assets` so the hero images reach nginx.

Generated: 4 images with Cursor's image tool (desktop plate regenerated once to clear floodlights out of the copy area). Keyed and graded locally.

Verified (headless Chromium, `shoot.mjs`): desktop 1440×900, mobile 390×844, reduced motion. No dead scroll, all cues ≥4.5:1. Frames inspected: opening, mid push, silence, beat 2, fade, handoff to the board.

Sports rail (rev 2b): each venue card is now a full-bleed dusk photo of that sport's court with its equipment (6 generated images, `assets/sports/`, sources in `hero-src/sports/`), a hand-drawn line icon from an inline SVG sprite, copy in the empty sky, spec row at the foot. Fixed card height, centred rail, alternating counter-drift on `--sc-p` instead of the old dimming. Verified desktop + mobile frames, no dead scroll, contrast clear.

Not verified: a real iPhone, touch scroll, slow networks. The contact sheet was skipped because ffmpeg is the stripped build. Generated sources are 1280px wide and upscaled to 2400px; fine behind grain, but soft on 4K screens.
