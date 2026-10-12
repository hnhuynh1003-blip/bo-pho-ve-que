# Bỏ Phố Về Quê v88 — UI-Q2: Quầy Liền Mạch / Một Quán, Một Màn Chơi
**Ngày:** 12/10/2026
**Trạng thái:** Đặc tả triển khai đã được chủ dự án đồng ý về định hướng; **CHỈ VIẾT THIẾT KẾ**, chưa sửa code/hình trong commit tài liệu này.
**Nguồn đối chiếu:** nhánh `feat/v88-phone-os-core`, head tại lúc khảo sát `e2cddf029801badeba721294042291bd1216415b`; `index.html`, `js/v88-unified-shop.js`, `css/v88-unified-shop.css`, `js/v88-cooking-station.js` và bridge `js/game.js`. Không tự merge `main`.

## 1. Mục tiêu gameplay và trải nghiệm

Thay vì **một ảnh quán + một hộp nghỉ ca lớn che ảnh + một thẻ Bếp Có Hồn nhảy lên/xuống**, tạo một **khung chơi liền mạch** gồm cảnh/quầy hiện vật lý, làn NPC đối thoại, mặt bàn cùng chất liệu với công trình, khu thao tác thật trong lớp bàn. Cả ba trạng thái **nghỉ/chờ**, **khách đang đặt**, **luyện tập hoặc đang nấu** dùng **cùng geometry**, cùng scroll position; chỉ chuyển lớp nội dung, highlight, hành động nhỏ. Không làm ra một panel bếp mới và không sao chép dashboard / layout của game nấu ăn cụ thể.

### Vấn đề hiện có đã kiểm chứng trong source
- `#customer-booth-card` bị chuyển vào `#v88-live-frame` bằng `frame.append(customer)`; CSS hiện đặt hộp full chiều ngang ở đáy ảnh (`position:absolute; left/right:8px`) làm che thân xe/quầy. Nút `#btn-toggle-shop` nằm trong hộp này.
- `#v88-live-frame`: mặc định `aspect-ratio:4/3`; khi `.us21-serving` đổi `16/8` (có cả quy tắc `16/9` cũ). Đây là **reflow hình học** khi nhận/thoát đơn; `object-fit:cover` còn crop ảnh biển tên/cửa hàng.
- `#cs20-station[data-state="idle"]` bị `display:none`; khi có đơn/luyện tập xuất hiện cả vùng bếp => tài liệu kéo dãn, dễ nhảy scroll; `w.setInterval(update,750)` & `refresh(...,550)` chạy state polling song song, có thể tạo churn DOM.
- Quầy B1 có 6 ảnh dù QA; mục sơn đã chuyển qua **Xây Quán → Sơn Màu**, decor qua **Xây Quán → Bố trí**. Duy trì, không cho swatch/marker xuất hiện trên quầy bán.
- Bridge hiện có `snapshot/choose/complete/deliver/adjustPrice/reset`, phân nghề `boba/noodle/streetfood`; chế độ `practiceDish` clone trạng thái tạm **không trả thưởng/giảm kho**. Các điểm đó phải tiếp tục đúng.
- Thư mục ảnh `assets/images/v88/qa` hiện chỉ có mẫu Trà Sữa B1 Draft5, CHƯA được duyệt production. Không tự nhân nó cho nghề khác hay giả bậc cao.

## 2. Hình dạng và phân lớp mỹ thuật

Quy ước camera môi trường: **góc 3/4, cùng vị trí camera B1–B9**, công trình/sân là lớp sau; **bàn thao tác là lớp tiền cảnh** nhưng vẫn là UI tương tác DOM/SVG (không bake nút/chữ/topping vào artwork công trình). Từ trên xuống:
1. `sceneBackdrop`: phong cảnh, xe/quán, decor người chơi đã mua, S1 tên quán, NPC/nhân viên.
2. `npcLane`: vùng NPC đi đến/cửa hàng và **bong bóng thoại ngắn đặt trên rìa/bên cạnh NPC**, không che S1, thân quầy hoặc vật trang trí trả phí; chữ dài có nút xem **Phiếu đơn** đầy đủ ở phần bàn.
3. `serviceRail`: thanh điều khiển tối giản **NẰM NGOÀI ẢNH**. Trạng thái chấm nhỏ + `Mở Quán` hoặc `Qua Ngày` theo luật game + nút `Luyện tập` lúc nghỉ. Không có thẻ khách hàng bo tròn khổng lồ.
4. `counterSurface`: một mặt bàn/viền quầy đồng nhất với công trình, nơi `#cs20-visual` vẽ ly/thố/vỉ xiên và `#cs20-groups/#cs20-shelf` thao tác. Bề mặt luôn có geometry kể cả đang nghỉ ca: lúc nghỉ hiển thị đồ nghề chuẩn bị (hình yên tĩnh) + hai CTA, không để vùng trắng/trống.
5. `counterActions`: thao tác quan trọng trong tầm ngón tay (nút Làm lại/Hoàn thiện, khi chưa nấu: Mở quán/Luyện tập). Áp dụng `env(safe-area-inset-bottom)`.

**Nguyên tắc thị giác:** "một sân khấu, một mặt bàn" chứ không phải "3 tấm card"; dùng màu gỗ mộc, men sứ, vải dù xanh/kem, ánh sáng mềm; tránh chồng khung neon/viền kiểu dashboard. Không dùng screenshot tham chiếu của một trò chơi thương mại làm mẫu asset.

## 3. Wireframe cho điện thoại đứng

### 3A. Geometry chung — GIỮ NGUYÊN bất kể trạng thái
```text
┌────────────────────────────────┐
│ Header mảnh: avatar · ngày · Xu│  sticky game header, bảo toàn ID
├────────────────────────────────┤
│ 6 tab nhỏ: Quán · Vườn · ...    │
├────────────────────────────────┤
│         CẢNH QUÁN 3/4           │  camera/canvas chiều cao khóa
│   Cây · Xe/quán · S1 · decor    │  NPC ở lane riêng, không che quán
│         [NPC: 💬 ...]           │
├────────────────────────────────┤
│ ● Trạng thái  [CTA theo ca]     │  service rail ngoài ảnh
├────────  VIỀN MẶT QUẦY ────────┤
│       MÓN / DỤNG CỤ 2D          │  trong quầy, không một thẻ khác
│         rót / nấu / nướng       │
│  [phiếu đơn rút gọn / hint]     │
├────────────────────────────────┤
│ Loại nguyên liệu → khay ngang  │  scroll trong khay, không scroll cả page
├────────────────────────────────┤
│ [Làm lại] [Hoàn thiện / Luyện] │  vùng ngón cái, safe-area
└────────────────────────────────┘
```

**Geometry cố định** nghĩa là không gọi `scrollIntoView()` khi có khách/luyện, không đổi `aspect-ratio` từ `4:3` sang `16:9` theo trạng thái và không thêm/bớt element top-level. Có thể làm hiệu ứng **focus camera bằng transform trên layer hình** (chỉ visual, không ảnh hưởng layout), nhưng phải tắt nếu reduced motion.

### 3B. Kích thước mục tiêu sơ bộ, cần đo trên browser thật
Dùng viewport height động `100dvh` và safe area; không khóa tuyệt đối theo px cho mọi máy.
| Khu | Rộng 390×844, tham chiếu | Nhỏ 320×568 |
| --- | ---: | --- |
| Header + 6 tabs đã có | khoảng 124–140 px | giữ bản compact 112–128px |
| Cảnh/quầy (scene layer) | 205–235 px | 140–165 px |
| Service rail | 42–48 px | 40–44 px |
| Counter/visual | 160–190 px | 115–145 px |
| Phiếu đơn/feedback | 42–58 px | chỉ 1 dòng gợi ý + mở full |
| Tray nhóm/ingredient | 88–108 px | 70–88 px, vuốt ngang |
| Primary CTA | 54–60 px + safe area | 48–54 px + safe area |

Không hứa **toàn màn hình không cần cuộn** ở 320×568; cho cuộn nhẹ bên trong khu ingredient/chi tiết khi cần, nhưng **không auto-scroll vị trí root**, không để nút giao hàng hoặc phiếu đơn biến mất. Khi keyboard mở, bảo toàn content và safe-area.

## 4. Trạng thái và nội dung cố định vùng

| Trạng thái | Cảnh/quầy | Làn NPC + thoại | Rail | Bàn chế biến |
| --- | --- | --- | --- | --- |
| `closed` / nghỉ ca | Ảnh quán sạch, NPC có thể vắng | Không chiếm hộp lớn; hướng dẫn nhỏ ngoài ảnh | `Qua Ngày` theo luật hiện tại; `Luyện tập` nếu hợp lệ | Bộ đồ nghề bày sẵn nhưng không kích hoạt giao món |
| `preparing` (chưa mở) | Như trên | Không có thoại khách giả | `Mở Quán`, `Luyện tập` | Demo công đoạn dạng idle (không tính tiền/kho) |
| `open`, chờ khách | Quán sống với hiệu ứng nhẹ | NPC chưa đến: trạng thái "Đang chờ" nhỏ | Chấm xanh + hành động trạng thái hợp lệ | Chuẩn bị dụng cụ, chưa có đơn không được `deliver` |
| `order` | Cùng height/camera, NPC thật đến quầy | Bong bóng thoại 1–2 dòng + timer; xem chi tiết đơn trong bàn | Trạng thái đang phục vụ, không mở ca 2 lần | Nguyên liệu/chế biến bật; phiếu đơn cố định |
| `practice` | Cùng height/camera, không NPC giả | Nhãn luyện tách người chơi, không làm khách | `Thoát luyện` | Dùng `practiceDish`, không settlement/kho/Xu/SP |
| `timeout/cancel` | Không đổi geometry | NPC rời/quầy về chờ | Trạng thái về open | reset mini-session; không nhảy vị trí trang |

**Điểm quan trọng:** `closed` khác `preparing` — không được biến `Qua Ngày` thành `Mở Quán` khi game đã khóa ca. Nút sự kiện phải gọi hàm thật hiện có, không tự sửa `gameState.phase`.

## 5. NPC và hội thoại ở cảnh

- NPC avatar/character sprite độc lập lớp, xuất hiện gần phía trước quầy theo `anchor` riêng, không nhét toàn bộ `#customer-booth-card` thành banner lớn full width phủ lên ảnh. Giữ các ID `cust-*` (ví dụ `cust-avatar`, `cust-name`, `cust-order-quote`, `cust-patience-time`, `btn-toggle-shop`) trong DOM hoặc adapter tương thích để core tiếp tục render.
- Nhân vật đến → bước vào vị trí đứng → hiện bong bóng thoại → order ticket mở ở bàn. Bắt buộc người dùng luôn đọc được yêu cầu **đầy đủ**; lời thoại ngắn trong cảnh có thể rút gọn nhưng phiếu đơn không bị cắt mất nguyên liệu/topping hoặc ngân sách.
- NPC/thoại **không đè lên S1**, bánh xe hay mặt quầy. Ở 320 px đặt bubble gần góc sân hoặc lane ngoài mép cảnh nếu không đủ chỗ, không ép NPC phình.
- Thông báo phục vụ, tips và hội thi không overlay liên tục vào cảnh; thông báo chỉ tạm bật, timeout an toàn và respects reduced motion.

## 6. Bàn nấu gắn vào hình quán — không cần artwork B1–B9 ngay

Mỗi nghề có skin **UI renderer tạm** mang sắc thái tương ứng (Trà Sữa: bàn gỗ/trà; Mì Cay: bếp đất men; Xiên Que: vỉ lửa), nhưng chức năng `cs20-visual/groups/shelf/primary` dùng lại game core. Tránh vẽ một ảnh xe khác và gắn giả vào B2–B9.
- **Trà Sữa / Dòng Hương Vị:** bề mặt bàn có ly/cốc thẳng hàng với cao độ mép dưới xe, vùng rót/topping/lắc tiếp xúc visual ly; không card chứa SVG nổi giữa màn.
- **Mì Cay / Nhịp Lửa:** cùng vị trí bàn, trông như mặt bếp nối vật lý với quầy; nồi, cảm biến nhiệt/hiệu ứng sôi, nguyên liệu dưới dạng tray ngang.
- **Xiên Que / Vũ Điệu Vỉ Lửa:** vùng vỉ ở đúng mặt bàn, nút trở/sốt/gắp rõ; tốc độ refresh đủ để không bỏ lỡ chín vàng.
- **Luyện tập:** dùng chính bàn đó với nhãn nhẹ. Khi xong chỉ báo "hoàn thành bài luyện", không gọi `bridge.deliver()`.
- UI renderer và gameplay bridge giữ tách biệt với `scene art registry` để sau này thay clean shell theo bậc không đụng các hàm nấu.

## 7. Hợp đồng kỹ thuật và tránh reflow/giật

- **Một root bền:** một `ShopPlaySurface`/shell duy nhất trong `#tab-shop`; phân vùng scene/NPC/rail/counter/ingredients/CTA. Thay trạng thái bằng `data-mode` + cập nhật lớp con, không `append` DOM lên xuống hoặc tạo thẻ lớn theo mỗi event.
- **Một nguồn state:** adapter lấy snapshot từ `BPVQCookingBridge` và `gameState`; cùng service adapter cho ca bán, tránh song song `setInterval(update,750)` + `refresh(550)` sinh update chồng nhau. Dùng event/state change cho thay đổi tức thì, đồng hồ khách được throttle tối đa 4 lần/s, progress visual tối đa rAF và **không rebuild ingredient list** mỗi frame.
- **Quy tắc geometry:** layout container dùng CSS Grid với track chiều cao đã dành sẵn; thay opacity/transform hoặc nội dung trong slot; không `display:none` vùng bếp làm parent collapse. `content-visibility` chỉ sử dụng khi không cắt focus/interaction. Đảm bảo không đổi scrollTop khi bắt đầu, kết thúc, timeout, luyện và thoát.
- **Render ảnh:** B1 QA đang 1200×900. Không crop mặt tiền/biển S1 chỉ để fit 16:9; có thể dùng `object-fit:contain` kết hợp dải mở rộng/illustrated margins và anchor mapping; giữ đúng source coordinates, không nhân vật đè artefact.
- **Pointer/touch:** nút chính `min-height:44px`, target gần ngón cái; scroll tray ngang có `touch-action:pan-x`, thao tác rót/nấu `pan-y` riêng/không bắt gesture khó; tất cả có lựa chọn tap, keyboard và aria.
- **FPS/CLS:** mục tiêu giữ 55–60fps trên máy test phổ thông khi idle, không lặp DOM redraw vô ích; `visualViewport` dùng cho keyboard/safe-area nếu cần, tránh cập nhật height mọi frame. Mục tiêu CLS trong chuỗi thao tác của phần play surface gần 0 (không suy diễn điểm Lighthouse = 0). Tránh blur/backdrop-filter trên nhiều lớp chạy animation; drop shadow nhẹ.
- **No state mutation from art/UI:** không đổi schema/save, `coins`, `inventory`, `SP`, `shopStage`, `decorV88`, preset assistant từ thao tác bố cục. Legacy settlement chỉ gọi một lần; practice không gọi settle. Không đánh dấu B1 Draft5 approved.
- **Không xóa các ID legacy** nếu gameplay đang dùng; nếu thay wrapper, giữ node DOM thật và không hiển thị 2 lần.

## 8. Thứ tự triển khai một lô đã duyệt, không chia vi duyệt

| Ticket | Đầu ra thật | Phụ thuộc | Tiêu chí tự QA |
| --- | --- | --- | --- |
| UI-Q2-01 P0 | Root play surface mới, 5 vùng đã khóa geometry và trạng thái | Bridge core, 6 tab/header | Mọi mode cùng top offset / scene height |
| UI-Q2-02 P0 | Rail Mở quán/Qua ngày/Luyện tập nằm dưới ảnh, bỏ banner che quầy | Core phase handler + train adapter | Các nút gọi đúng chức năng, lock ca đúng |
| UI-Q2-03 P0 | NPC đứng trong scene, bubble và ticket đầy đủ, không che xe/S1 | Native `cust-*` | Thoại/đếm thời gian đúng, không duplicate |
| UI-Q2-04 P0 | CounterSurface dùng 3 renderer chính, nhìn tiếp nối mặt tiền + có bộ đồ nghề idle | Cooking Station 2.0 | Rót/nấu/nướng/luyện/giao hoàn chỉnh trên điện thoại |
| UI-Q2-05 P0 | Đồng bộ state renderer, không reflow/scroll jump | UI-Q2-01..04 | Performance & transition tests |
| UI-Q2-06 P0 | QA game mobile portrait, save/economics/CI và ZIP | UI-Q2-01..05 | PASS 3 nghề/5 viewport; screenshots/videoclips giao đơn thật |
| ART-Q2-07 P1 | **Chỉ sau UI gameplay UAT** mới nghiên cứu clean shell B1–B9 / 3 nghề | UI-Q2-06 | Chưa tạo art/không chuyển QA thành production trong UI-Q2 |

## 9. Acceptance / exit gates

### Chính xác gameplay
- 3 nghề × nghỉ ca, mở ca, khách đến, đơn đúng/sai, giao, timeout, luyện/thoát luyện, qua ngày, chuyển nghề, hết hàng, manual save/reload, preset/trợ lý.
- Khi luyện: tiền/kho/SP/XP và save không đổi; khi bán thật: legacy settlement đúng **một lần**. Không ai nhận tiền khi double-tap giao.
- Các trạng thái "ca đã đóng" và "chưa mở ca" giữ khác nhau; không dùng overlay buộc mở ca lại.

### Chất lượng UX
- Test portrait **320×568 / 360×640 / 375×812 / 390×844 / 430×932**, tăng font OS, safe-area/notch, Android Chrome và iOS Safari thiết bị thật khi có thiết bị (nếu không có thì ghi rõ giới hạn).
- Đổi `preparing→open→order→idle→practice→idle`: **tọa độ đỉnh khung cảnh + bàn giữ ổn định**; không có scroll jump quá ~2 CSS px ở vùng top khi state đổi trên viewport thường, không che nút chính.
- Biển S1, decor, NPC và khu đồ nghề không chồng nhau; góc 320px đảm bảo xem full đơn qua một thao tác.
- Khi đang chờ khách bàn vẫn có visual chuẩn bị, không thẻ trống; thẻ Hội Thi/nhân viên không chen giữa quầy và bàn.
- Mobile giữ 1 ngón tay có thể làm món, touch feedback nhanh, không gây click xuyên/ngăn scroll ngoài ý muốn.
- Video/screenshot chứng minh **cùng một screen layout** qua 3 trạng thái và cả 3 nghề. CI Node/Chromium/WebKit xanh nhưng không thay cho UAT thiết bị vật lý.

## 10. Quyết định kế tiếp đã thống nhất
**Ưu tiên triển khai UI-Q2 (cơ chế và giao diện) → thử thực tế → chỉ sau đó mới tạo hình công trình theo bậc.** Không làm thêm card tên quán, không phô nút màu dù/decor trên ảnh, không mở thêm vòng duyệt nhỏ. Khi xong một lô đưa bản chơi thử mới và bảng lỗi/khắc phục, chưa tự merge main.