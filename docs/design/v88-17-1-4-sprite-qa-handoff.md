# Bỏ Phố Về Quê v88.17.1.4 — AI transparent sprites (QA HOLD)

Status: **ART REVIEW PACKAGE COMPLETE / GAME INTEGRATION NOT APPROVED**.

## Deliverable
A distinct user-facing ZIP named `BPVQ_v88_17_1_4_AI_SPRITES_QA.zip` was prepared in the ChatGPT conversation on 2026-10-13. This ZIP **is not in the repository**; retrieve it from the conversation or reattach it in the next chat. It contains:
- 26 separate PNG/WebP game-art sprites produced by extracting true alpha-connected components from one AI-generated transparent source sheet. All 26 WebP pass RGBA/alpha QA.
- 7 high-quality PNG counterparts.
- `manifest.json`, `preview.html` interactive illustration-only showcase, and a contact sheet.
- 390px portrait / 900px landscape screenshot previews of the independent showcase.

### Examples of standalone sprites
`boba_backbar.webp`, `cup_platform.webp`, `tea_dispenser.webp`, `cup_boba_deluxe.webp`, `cup_matcha.webp`, `cup_strawberry.webp`, `cup_empty_M.webp`, `cup_empty_L.webp`, `cup_empty_S.webp`, `milk_pitcher.webp`, `syrup_pink.webp`, `syrup_brown.webp`, `topping_drawer_mockup.webp`, `ticket_order.webp`, etc.

### Integration trial
A temporary local copy of v88.17.1.3 (not a released GitHub commit) was modified using **only**:
- `index.html`: point backbar image to `boba_backbar.webp`, add decorative `cup_platform.webp`, and load additive CSS.
- `js/v88-cooking-station.js`: replace the decorative boba tea-dispenser shell URL with `tea_dispenser.webp` (no pricing or serving logic change).
- `css/v88-17-1-4-art-assets.css`: boba-career-scoped decoration only.

The **current art integration does not pass visual QA**: a 390px isolated mock view showed horizontal document overflow (measured scrollWidth 556px > viewport 390px) when expanded order details were present, plus cramped station text. **Do not ship this draft game ZIP or merge any of these styling changes yet.**

### QA evidence
- Transparency: all 26 WebP have alpha channel including transparent and opaque pixels.
- Independent illustrative showcase: Chromium 390px and 900px measured scrollWidth == viewport width; 26 items render; two example controls switch cup image and show/hide topping illustration.
- Existing Node regression suites PASS for cooking station, native settlement, menu quotes, day/quota rules, interest capitalization and timing-zone contract (8 groups).
- **NOT DONE**: full browser gameplay, WebKit, real touch, three careers with old saves, 9-tier visual checks; a showcase is not the game.

### Safety / art policy
- Decorative AI sprites are NOT to replace the native real-time drink cup renderer or real order/settlement/timing controls.
- Buttons, fake timing meters, receipt and drawer UI drawn by AI have **baked-in text**: remain **concept-only**, not functional click targets.
- Preserve 3 career IDs, gameplay, prices, inventory, saves, stage rules and phone menu.
- Do not add a large shop name to yard artwork.
- Art must adapt to portrait and landscape layouts by separate placements, not a scaled 16:9 screenshot.

### Next implementation gate
First make the real boba cooking station fully usable at 320, 360, 390, 430px and laptop 16:9, specifically order detail layering, dynamic customer order, cup center, visible topping interaction and timing band. Only then install the 3 approved decorative references. Treat baked-in words in AI mockups as conceptual. Do not claim v88.17.1 done before visual and gameplay QA.

**Note:** This PR is a continuity ledger and review checkpoint; it does not contain binary artwork. Use the ZIP delivered in conversation as source of truth for the images.
