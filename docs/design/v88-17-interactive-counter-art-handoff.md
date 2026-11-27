# Interactive counter Art Studio handoff — RC2
Coordinator: https://github.com/hnhuynh1003-blip/bo-pho-ve-que/issues/15#issuecomment-7210762888
Exact base 560614a7090b18cdf8364fa2b322ba0951b3bd5f; branch work/v88-17-art-interactive-counter. Owner approved layout direction only. No publication, runtime edits, or individual asset approval inferred.

## Evidence and audit
Fetched complete baseline tree (624 entries, not truncated); inspected relevant references in index.html, js/v88-cooking-station.js, js/v88-17-1-7-counter-remake.js, css/v88-17-1-9-premium-counter.css. [Contact sheet of 12 actual files](v88-17-interactive-counter-art-review.html) includes path, SHA, dimensions, header alpha and simulated 58/68/110px slots (90px width illustrative).
- Cup stacks: native CSS size controls, M/L empty reference sprites 73×121 / 80×131; no named XL empty sprite. Keep native dynamic SVG cup and state; do not substitute static finished cup.
- Tea dispenser 121×194 alpha and common jar 362×384 alpha; reuse, align spout and cup center. Milk pitcher 93×123 alpha is not foam.
- Board/platform 484×124 alpha; decorative ends consume space; proposed center anchor, no layout edit.
- Existing backbar 850×361 opaque includes painted cap machine, dispenser, board, ingredients and text. Overlap with separate native controls is a composition risk, not proof of observed screenshot failure. Prefer neutral background with independent props; UI owns placement. Order header 294×82 has baked text; dynamic requested order distinct from applied cup.
- Eight preexisting independent trays plus approved Milk Foam B; black boba blob ddbd14e072b5c8e785926cec402255d9b2044a5e and B blob 0deb8a7eb44d52a35081522f5f2d472f73ce67d8 unchanged on RC2. Keep legacy 069, no lychee/cookie remap.
- No named standalone cap-machine, ice/sugar bins, or syrup bottle in baseline tree. Existing native sugar/ice meters and in-cup ice shape; rainbow syrup SVG ingredient reference. Cream B already exists. Defer additional sprites until UI confirms need; no mass generation.
- Native cap-start/cap-hit action and data-lid already exist; opacity .65 even before isShaken (flag to UI/Engine for applied-state contract, no edit).
- Noodle/streetfood: assets/images/v88/qa/noodle-b1-reused.webp and streetfood-b1-reused.webp present; provenance explicitly says draft starter courtyard only, productionShellApproval false. Not evidence of route root cause or approved shell; inventory only, no redraw.

## New candidate: cap machine A — PENDING_USER_ART_APPROVAL
Original BPVQ-style generated standalone sprite, not crop or copy of external reference. Source RGBA 1191×1320; alpha threshold 16, crop (137,62,1088,1261). No text/price.
| Export | Dimensions | Bytes | Git blob SHA |
|---|---|---|---|
| Local master PNG | 512×512 | 202184 | aff95a83fd4de3e9753ee91b60888ca7c35fab05 |
| Local WebP 256 | 205×256 | 13048 | 75db235e49669735ec4cc9230d9479590d57d6c4 |
| Local WebP 160 | 129×160 | 6610 | fb6a45f1340396509b26415aeb35b1a856c58770 |
| [Repo review-only WebP](art-review/cap_machine_A_review.webp) | 129×160 | 5092 | d71b0d93295c9587d04f01c40d26fa27db149e8d |
Local master/160/256 decoded with Pillow, alpha extrema 0–255; visible bbox master (78,32,433,480), 160 (4,4,125,156), 256 (4,4,201,252). Review copy re-encoded quality 50; not the local runtime export. Review SHA256 f0c736a3d9de3060b6cc59f430f1339ec58d0141adc749ec0f30c8c2cbcb3416. Local QA sheet inspected on light/dark backgrounds at 58/64/68/110/160px. Machine readable, smaller lever detail less clear; no obvious large edge fragment. Proposed anchors: bottom center for ground, holder center for cup, lever as visual cue only; native hit target >=44px and stage/animation controlled by UI/Engine. No new item ID.
## Gate
Static asset evidence only, no real full game screenshot or browser interaction test executed by Art. Contact sheet not browser-rendered; geometry is illustrative, not measured. UI #14 and QA #16 own native screenshot, responsive fit, hit targets, applied-state verification. Master/160/256 local files not committed; repo review copy is intentionally separate. Workflow sync-v88-playtest.yml push trigger only feat/v88-17-1-9-cup-handoff; no dispatch, no merge, no publish. Coordinator alone integrates approved changes; release NO-GO.
