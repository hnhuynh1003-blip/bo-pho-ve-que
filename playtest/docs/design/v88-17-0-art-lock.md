# v88.17.0 — Cute Premium Art Lock (DRAFT, awaiting visual approval)

**Scope:** design/audit only. Branch created from `fix/v88-16-13-5-interest-settlement`; no production image, JS/CSS, gameplay, save data, or current shop tier definitions have been changed.

## Source audit
- Source inspected: local v88.16.13.4 asset tree, `js/game.js`, `js/v88-cooking-station.js`, `js/v88-food-art.js`, `js/v88-shop-scenes.js`, yard QA references and Phone OS icons.
- Inventory: **92 item IDs**: boba 28 (3 containers, 9 tea/milk, 15 toppings, 1 syrup), noodle 32 (3 bowls, 10 broths, 19 toppings), streetfood 32 (3 containers, 19 skewers, 10 sauces).
- Kitchen mapping audit categories: 58 IDs with raster candidate, 16 SVG fallback, 18 CSS/emoji/non-direct mappings. These do **not** mean 58 approved images / 34 images to generate.
- Source yard references under `assets/images/v88/qa` are concepts/QA, **not approved production shells**. The 27 career×tier registrations are not the same thing as 27 approved completed art assets.

## Concrete asset problems
1. `109_sauce-tamarind_3b10d51b5c.webp`: visibly corrupted/pixelated; `045_sauce-tamarind_f5fa2f7f94.webp` is a clean candidate in the older art mapping. Check actual UI uses before changing/removing anything.
2. `036_skewer-beef_45ff36497f.webp`: visibly contains an extraneous piece at bottom. `098_skewer-beef_613e29801f.webp` is a better-looking **candidate**, subject to approval; same item ID `skewer_beef`.
3. `ntop_shrimp`: a shrimp asset `084_ntop-shrimp_04ea544abc.webp` exists, but the cooking display uses shape/fallback in some paths. Check mapping, **do not automatically redraw**.
4. Legacy missing filename `108_sauce-sweet-chili_e934851eee.webp` is referenced; a different asset `044_sauce-sweet-chili_738b66b9fd.webp` exists. Investigate paths before repair.

## Art direction — proposed, not final-approved
Shared universe: 2D detailed chibi / cute premium; warm brown soft outlines, soft shadows and highlights; cream/wood/light greenery; rounded phone-like icon treatment. Never let the three careers look like different games.

| Career | Palette tokens | Materials |
|---|---|---|
| `boba` | #FFF3DF cream, #E7A5AC rose, #CFA479 tea milk, #86AA8A sage, #594033 ink | clear cups, milk-wood, topping jars |
| `noodle` | #FFF0D7 cream, #BF5940 terracotta, #D96C47 paprika, #E6AD5B amber, #563A30 ink | clay bowls, soup kettles, warm wooden benches |
| `streetfood` | #F7ECD3 cream, #9F6740 wood, #C77642 copper, #EDBC65 lantern, #5C8965 leaf, #3F4E3D charcoal | bamboo trays, grilled skewers, charcoal stove |

Art spec: source 512×512, approved runtime WebP alpha at 160/256 as appropriate, item occupancy 72–84%, same 3/4 perspective and warm rim/grounding shadow; **no baked-in prices/name labels**. UI components separate from painted objects; touch targets ≥44px; mobile ingredient rail max 2 rows. Avoid stark white cards or verbose kitchen instructions. Reserve prices/profit management for Phone Menu, but show actual customer order and final settled price in kitchen.

**Yard alignment:** no large shop-name text over yard illustration; boba high-tier roof must not revert to old red-roof reference. Plan modular scene base + tier décor/equipment/lighting; do not regenerate 27 full yards to change the kitchen theme.

## Six representative review IDs (2 per career)
| ID | Name | Baseline | Proposed action |
|---|---|---|---|
| `topping_boba` | Trân châu | 065 WebP | Keep/polish for 56px UI |
| `topping_cheese_foam` | Milk Foam | 069 WebP | Keep/polish tone/highlights |
| `broth_kimchi` | Cốt kim chi | 014 WebP | Need distinguish broth from completed noodle dish |
| `ntop_shrimp` | Tôm sú | 084 WebP exists | Fix art mapping before remaking |
| `skewer_beef` | Bò viên | 036 WebP damaged | Try cleaner 098 / redraw only if needed |
| `sauce_tamarind` | Sốt me | 109 damaged, 045 clean | Prefer clean 045 after runtime mapping audit |

All 6 images are **source references**, not newly produced game sprites. Broad UI concept previews are **for visual direction only** (illustrative prices, text, mascot and character faces must not modify game state/data).

## Rollout and approval gates
- **v88.17.0:** audit + 3 career moodboards + six reference decisions + visual style proposal; await user approval. **Current branch.**
- **v88.17.1:** ONE shared skin/UI layer + boba (28 IDs); verify mobile/laptop gameplay, menus, settlement, saves.
- **v88.17.2:** reuse same shared UI, noodle (32 IDs), keep broth/topping/timing functionality.
- **v88.17.3:** streetfood (32 IDs), keep both grill sides/sauces/delivery.
- **v88.17.4:** all 92 mappings, 3 careers×tiers 1/4/9 visual captures, full tier 1–9 state checks, mobile 320–430px, desktop, Chromium/WebKit, legacy saves and economy; no missing refs.

**Deferred:** tuning Good/Perfect probabilities and difficulty until all art, shops and nine tiers are complete; meantime the timing mechanism must stay usable. Do not add duplicate settlement/ratings, repaint unapproved scene shells, change the career, edit original item/NPC IDs, or merge this documentation PR to main without review.

**Visual approval requested next:** tone of three careers, common kitchen layout, six item resolutions; then create production assets and code in separate reviewed stages.
