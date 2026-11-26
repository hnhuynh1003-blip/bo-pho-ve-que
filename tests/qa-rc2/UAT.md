# RC2 real-device UAT (pending; synthetic only)

Target: 560614a7090b18cdf8364fa2b322ba0951b3bd5f. Use an approved isolated HTTPS or secure localhost origin serving exact RC2 source and helper-generated playtest; do not use public production or deploy. Verify SHA/build label, browser/OS/device, viewport, date and tester. Use fresh disposable browser profiles and synthetic v87/v88 save codes only. Admin/QA-002 excluded; no real player data. Close stale/uncooperative old tabs. Capture before/after synthetic namespace snapshots, screenshots or video and result per case (PASS / FAIL / BLOCKED, reason). No credential or private data in evidence.

| ID | Action | Expected | Result |
|---|---|---|---|
| D01 | Android Chrome and iPhone Safari: open generated playtest, confirm isSecureContext and navigator.locks | Supported engines acquire exactly one writer; unsupported fails closed | PENDING |
| D02 | Laptop Chromium and Safari/WebKit (if available), repeat D01 | Same contract | PENDING |
| D03 | Two importer tabs, simultaneous distinct names then same name | Both distinct profiles reachable; duplicate refused; retry works | PENDING |
| D04 | Game owns lock then importer/game second tab; reverse after release | Busy tab cannot mutate storage; retry succeeds; no stale overwrite | PENDING |
| D05 | Switch to another tab/app, screen lock/unlock while game owns writer; verify document.visibilityState actually hidden | Lock remains held, competing tab denied; autosave safe; visible return works | PENDING |
| D06 | Navigate away then browser Back/Forward; record actual pageshow.persisted | If BFCache true, old writer retired, reload/reacquire safely; if not observed mark BLOCKED | PENDING |
| D07 | Reload/close game, retry importer; reopen saved profile | Lock released, no stale writes, same coins/stock/progress | PENDING |
| D08 | Synthetic v87 and v88 import, reject malformed/duplicate, verify exact production sentinel keys before/after | Imported profile opens in playtest; no production mutation | PENDING |
| D09 | Three careers live: visible entry, size/topping, pour/stop/topup or cook/fry, timing, cap/take/send; double tap send | Correct native IDs, stock/Xu/XP/review once; no double settlement | PENDING |
| D10 | Three careers practice: tap actual group including Chon xien, choose ingredients, complete and send | Trusted input not intercepted, no change to coins/stock/XP/review | PENDING |
| D11 | Milk Foam B shelf on phone and desktop; tap item | Correct B image, >=44x44 hit, native portion +1, visible cup feedback, no overlap; auxiliary chip hidden on mobile, visible desktop | PENDING |
| D12 | Check boundary 599/600 and 800/801 where feasible | Record actual CSS; owner to resolve stated 599 vs effective 800; no unapproved change | PENDING |
| D13 | Cancel/timeout/close shift and reopen, save/reload | No duplicate settlement, safe recovery | PENDING |
| D14 | Legacy compact height on noodle/streetfood | Record B-05 against <=520 contract; no waiver by QA | PENDING |

Gate: do not close QA-001 P0 / QA-002 or publish; coordinator and owner must review native evidence, B-05 and remaining device checks. A test without actual hidden/BFCache state is BLOCKED, not PASS.
