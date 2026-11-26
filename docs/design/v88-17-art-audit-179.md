# BPVQ — Art Studio / Issue #15 — audit 1.9
Status: PENDING_USER_ART_APPROVAL
Base: feat/v88-17-1-9-cup-handoff @ 793704021bc4be7827390656a0c3d0f9eae25d0f
Scope: documentation and visual review only. No production changes.

## Boba: 28 IDs
Read docs/design/v88-17-0-art-lock.md and v88-17-0-item-worklist.json; cross-check js/v88-cooking-station.js (renderContainers, INGREDIENT_ART, CP176_AI_TOPPING_ART, renderShelf), js/v88-food-art.js, js/v88-17-1-7-counter-remake.js, index.html and 1.9 stylesheet references. Verified all 24 directly referenced image/SVG files via GitHub at base SHA. This is a static reference audit, not a full browser runtime test. All proposals require owner approval.

Paths relative to assets/images/. WebP alpha means header declares alpha, not proof of clean transparent pixels. CP = v88/cute-premium/.
| ID | Active shelf art / source | Size | Proposed action |
|---|---|---|---|
| cup_m | native CSS cup stack / SVG preparation | n/a | KEEP_NATIVE |
| cup_l | native CSS cup stack / SVG preparation | n/a | KEEP_NATIVE |
| cup_xl | native CSS cup stack / SVG preparation | n/a | KEEP_NATIVE |
| milk_fresh | dispenser shell + fill color; no direct item image | n/a | KEEP_NATIVE, review milk representation |
| tea_black | CP/tea-black-clean.svg | 160×160 | KEEP_PENDING |
| tea_green | 058_tea-green_c593521943.webp | 160×160 alpha | KEEP_PENDING |
| tea_oolong | 059_tea-oolong_76378ca6ec.webp | 160×160 alpha | KEEP_PENDING |
| tea_jasmine | 060_tea-jasmine_6eb0f1a20e.webp | 160×160 alpha | KEEP_PENDING |
| tea_honey | 062_tea-honey_c540b7e03e.webp | 160×160 alpha | KEEP_PENDING |
| tea_strawberry | 063_tea-strawberry_e9002fe325.webp | 160×160 alpha | KEEP_PENDING |
| tea_taro | 064_tea-taro_f92cdc8eba.webp | 160×160 alpha | KEEP_PENDING |
| tea_matcha | v8761_tea_matcha.svg | 160×160 | KEEP_PENDING |
| topping_boba | CP/topping_boba-ai-tray.webp | 148×89 alpha | KEEP_PENDING; newer than 065 |
| topping_white_boba | CP/topping_white_boba-ai-tray.webp | 156×89 alpha | KEEP_PENDING |
| topping_peach | CP/topping_peach-ai-tray.webp | 145×89 alpha | KEEP_PENDING |
| topping_jelly | CP/topping_jelly-ai-tray.webp | 147×89 alpha | KEEP_PENDING |
| topping_pudding | CP/topping_pudding-ai-tray.webp | 153×87 alpha | KEEP_PENDING |
| topping_crystal | CP/topping_crystal-ai-tray.webp | 159×89 alpha | KEEP_PENDING |
| topping_grass_jelly | CP/topping_grass_jelly-ai-tray.webp | 150×88 alpha | KEEP_PENDING |
| topping_aloe | CP/topping_aloe-ai-tray.webp | 147×88 alpha | KEEP_PENDING |
| topping_cheese_foam | 069_topping-cheese-foam_0190b7ff02.webp | 160×160 alpha | REDRAW_CANDIDATE_A, old card background |
| topping_lychee | 070_topping-lychee_b30470ed21.webp | 160×160 alpha | REVIEW_LEGACY |
| topping_cookie | 071_topping-cookie_9b347a4826.webp | 160×160 alpha | REVIEW_LEGACY |
| topping_redbean | 074_topping-redbean_416456d0bc.webp | 160×160 alpha | REVIEW_LEGACY |
| topping_mochi | 076_topping-mochi_5c7b9aa32e.webp | 160×160 alpha | REVIEW_LEGACY |
| topping_brown_boba | v8761_topping_brown_boba.svg | 160×160 | REVIEW_FALLBACK |
| topping_salted_cream | v8761_topping_salted_cream.svg | 160×160 | REVIEW_FALLBACK |
| syrup_rainbow | v8761_syrup_rainbow.svg | 160×160 | REVIEW_FALLBACK |

## Shared props verified
- CP/tea_dispenser.webp 121×194 alpha; milk_pitcher.webp 93×123 alpha; cup_platform.webp 484×124 alpha.
- CP/cup_empty_M.webp 73×121 alpha; cup_matcha.webp 73×158 alpha; cup_strawberry.webp 70×151 alpha (preview fallbacks; not replacements for native finished cup).
- CP/boba_backbar.webp 850×361 opaque.
- v88/counter/tea-dispenser.webp 362×384 alpha; topping-tray.webp 384×384 alpha.

## Six representative visual reviews + one filename issue
See [contact sheet](v88-17-art-review-contact-sheet.html). Original pixels and 56px fit previews are embedded for review; one new unapproved Milk Foam A is included with 58/64px slot simulations. All WebP files listed below declare alpha.
- topping_boba: 065_topping-boba_50721c0e58.webp 160×160 vs CP/topping_boba-ai-tray.webp 148×89 already used. Retain existing tray pending approval.
- topping_cheese_foam: 069_topping-cheese-foam_0190b7ff02.webp 160×160. Old cream card behind bowl; priority polish candidate; A generated and embedded as WebP alpha 160×79, 3508 bytes, Git blob 371272a9ce5d702dc83789f6085d6034afbab514. No runtime replacement.
- broth_kimchi: 014_broth-kimchi_3479262574.webp 256×239. Stray fragment at upper edge; review broth depiction in noodle phase.
- ntop_shrimp: 084_ntop-shrimp_04ea544abc.webp 160×160 exists. No direct image mapping in food.images, shape style present. Propose shelf mapping after review, keep native in-dish shape. Old card background may need cleanup.
- skewer_beef: 036_skewer-beef_45ff36497f.webp 228×256 currently mapped; extra fragment at bottom. 098_skewer-beef_613e29801f.webp 160×160 is candidate, has card background. Do not replace yet.
- sauce_tamarind: 109_sauce-tamarind_3b10d51b5c.webp 160×160 corrupted. 045_sauce-tamarind_f5fa2f7f94.webp 256×228 already mapped in food.images; review edge artifacts and whether peanut-like garnish communicates tamarind. Not automatic approval.
- sauce_sweet_chili: 108_sauce-sweet-chili_e934851eee.webp returns 404 at base. 044_sauce-sweet-chili_738b66b9fd.webp 256×228 exists and is already mapped; review left edge. No duplicate mapping fix proposed.

## Gate and handoff
Proposed source 512×512 for new assets; runtime WebP alpha 160/256 as appropriate, preserve established tray aspect ratios when replacing. Cute Premium Vietnamese chibi, warm brown outlines, cream/wood/sage/rose, soft highlights, no baked-in label or price. Source master availability not verified. Inspect edges, transparency, readability at actual display scale, and coordinate hit targets with UI team (>=44px proposed, not measured). Do not alter layout, gameplay, save, IDs, clean shell or main. Noodle 32 and streetfood 32 remain deferred except sample audit. Only one necessary review candidate generated under latest coordinator instruction; no batch generation. No approvals recorded. Static audit does not establish all legacy references across entire repository or runtime behavior. No browser-render verification of contact sheet performed. CSS 1.9 declares 58/64px art slot heights and 81/88px item heights; actual bounding boxes/hit targets remain unmeasured. Candidate original generated RGBA 1774×887, alpha cleaned below 16, visible crop 1343×630; local exports 512×512, 256×124 and 160×79. Only 160×79 review copy embedded in GitHub contact sheet, other sizes local handoff. Candidate tray is wider and more orange than existing boba tray: owner must review consistency before approval.

## Decision summary (all pending owner approval)
- KEEP: 8 existing trays, 8 tea bases with direct references, 3 native cups, native milk representation (review), and existing working fallback art pending visual inspection.
- REDRAW: only topping_cheese_foam candidate A in this batch. Other legacy toppings remain pending, not automatic redraws.
- REMAP: ntop_shrimp and skewer_beef proposed for later career phases; sauce_tamarind and sweet chili already mapped to 045/044; no code edits.
- PENDING: all 28 boba IDs remain unapproved, 32 noodle and 32 streetfood deferred except six representative review IDs and sweet chili check.
