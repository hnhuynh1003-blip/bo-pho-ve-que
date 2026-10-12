# Bỏ Phố Về Quê v88 — UI-Q2.5 · Quầy Trà Cute Premium / bản mẫu tương tác

**Ngày chốt concept:** 12/10/2026
**Trạng thái:** Đã tạo **standalone offline HTML design prototype**, **KHÔNG tích hợp game** và **không thay đổi tiền/kho/save/main**. Figma Starter API hiện báo hết hạn mức; không tuyên bố đã sửa xong Figma hay triển khai game chính.

## 1. Dữ liệu và nguồn tham khảo

- Ảnh bố cục quầy nhiều bình có vòi, nguyên liệu xếp ô, ly ở giữa: **ảnh do chủ dự án cung cấp**; chỉ nghiên cứu giải pháp UX, **không dùng lại ảnh, thương hiệu, nhân vật hay bố cục pixel-exact** của trò khác.
- Dùng **ảnh sân quán B1 Draft5 QA** (`assets/images/v88/qa/boba-b1-original.webp`) trong **gói thử game cũ**, không production approved.
- Dùng hình topping/trà đã có trong bundle `BPVQ_v88_15_0_UNIFIED_PLAYTEST_GITHUB.zip`: `057_tea-black`, `058_tea-green`, `059_tea-oolong`, `065_topping-boba` … `076_topping-mochi` và chibi female. Không vẽ tài nguyên thay thế hoặc xóa SKU cũ.
- Danh mục topping gắn mã hiện hữu (`topping_boba/topping_jelly/topping_pudding/topping_mochi/topping_aloe/topping_cheese_foam/topping_grass_jelly/topping_white_boba/topping_redbean/topping_lychee/topping_cookie/topping_crystal/topping_brown_boba/topping_salted_cream/topping_peach`).
- Siro `syrup_rainbow` là **filter UI** của item gốc, không tạo hệ kho riêng.

## 2. Bản mẫu ngoài game đã kiểm thử (UI-ONLY)

Tên HTML: `BPVQ_UIQ2_5_QuayTra_CutePremium_TUONG_TAC.html` (~1,69 MB; offline, embed 22 ảnh thuộc dự án).

ZIP kèm ảnh QA + README: `BPVQ_UIQ2_5_CUTE_PREMIUM_STALL_DESIGN_PREVIEW.zip` (~2,38 MB), SHA-256 `901a5cfaa95c5a2fa9de715eca9b704eeaf2be6c4cc967808503d4206e403264`. HTML SHA-256 `a5716dedf97955a1b3eba4d6f9aab6554c8d3bb3cd6d408c72fb1c2c1612471e`. Tạo ra trong phiên thiết kế trò chuyện, không đưa bản này vào `main`.

Giao diện chứa:
- Cảnh quán thật B1 luôn giữ hình học; NPC chibi chỉ xuất hiện khi mode có khách, hội thoại nằm cạnh NPC không phải card trên xe; trạng thái + đơn hàng nằm **dưới cảnh trong quầy**.
- Trên mặt bàn có **ba vòi trà mini tương tác**, chọn trà đen/lục trà/ô long; lựa cốt trà bằng menu đầy đủ; màu nước trong ly thay đổi.
- Một **chiếc ly thật giữa quầy**: hạt topping rơi theo mỗi cú chạm, biểu diễn nhiều phần; nhấn trực tiếp vào ly để bớt một phần, hoặc `Hoàn tác`; hai ống Đường/Đá 30/70/100 và 0/50/100 theo enum game cũ.
- Khay 2 hàng: 390px 4×2, 320px 3×2, phân trang với tổng 15 topping mẫu trên 2 hoặc 3 trang; bấm item x2 thấy badge + hạt trong ly. Nút giao/nhận bài ở cuối màn, không bị che ở màn nhỏ.
- Chuyển mode `rest/order/practice` **không đổi scene/counter bounds**, không phát sinh card nhảy lên/xuống.
- Không có thao tác DB/coin/XP/inventory/save. Nút `Giao món thử` **chỉ hiện thông báo**, không giao đơn game thật.

## 3. QA đã chạy

**Chromium Playwright bản mô phỏng:** 320×568, 360×640, 390×844, 430×932.
- No `pageerror`; no overflow ngang; tại 320×568 khu action nằm trong viewport (đã sửa bug đè xuống ban đầu).
- Số item tại trang đầu 390 = 8, tại 320 = 6.
- Hai lần chạm cùng topping → `×2` và 10 viên/hạt mô phỏng trong ly; đổi group, đổi page; ice slider 0% hoạt động.
- Các chế độ: mở quán→guest visible; nghỉ ca→guest hidden; luyện tập→status riêng; `scene.boundingBox` và `counter.boundingBox` invariant khi mode chuyển (cỡ 390).
- Zip `testzip()==None`.

Không thể tuyên bố **đã kiểm thử iOS Safari/Android trên máy thật**. Đây là demo UX, không phải thay đổi production.

## 4. Quy tắc triển khai sản phẩm sau khi duyệt hình thật

| Mã | Công việc | Tiền/kho/save | Gate |
| --- | --- | --- | --- |
| UIQ25-01 P0 | Port layout quầy sang `#tab-shop`, bảo toàn tất cả core DOM IDs/controls, loại status rời | Không thay save | 3 modes geometry stable, 5 viewport |
| UIQ25-02 P0 | Data-driven bình cốt trà, 2-row shelf, item thật từ `CAREER_WORKBENCH_KEYS`, filter Siro/Cốt/Toping/Ly | Kho vẫn dùng ID thật | Hết nguyên liệu/locked/quick restock |
| UIQ25-03 P0 | Topping `portions` 0–3/ID, visual layer, bớt/undo, không trừ khi thêm | Migrate `toppings[]` cũ → 1 phần/ID | Exact once `serveDishToCustomer`; tests |
| UIQ25-04 P0 | NPC yêu cầu nhiều/ít topping, luật thích/ghét và ngân sách; xử lý sai loại/lượng | `calculateDishCost`, `getDishRequirements`, `validatePlayerDishAgainstOrder` đồng bộ | Bảo toàn v87/v88 save |
| UIQ25-05 P0 | Điều chỉnh 2 thanh Đường/Đá **vào cùng vùng ly**; núm kéo/chạm có accessibility | Giữ enum cũ | Mobile 320, VoiceOver/TalkBack |
| UIQ25-06 P1 | Áp dụng workstation design cho Mì Cay và Xiên Que; tương ứng nồi/chảo/vỉ | Không rewrite engine kinh tế | 3 nghề UAT |
| ARTQ25-07 P1 | Audit sprites cũ và chỉ retouch/thiết kế lại **đúng các item art lệch phong cách**, một đợt | Giữ sprite ID mapping | Art QA riêng, không auto-approved |
| RELEASEQ25-08 P0 | ZIP toàn game để chủ dự án test, CI đủ 3 nghề | Main không đổi khi chưa duyệt | PR Draft & regression suite |

### Lưu ý rủi ro
- Asset B1 chỉ QA: không tự dùng cho career khác hoặc B2–B9.
- Các hình topping mới chỉ demo thao tác chạm, chưa có drag/drop thực hay định lượng thực theo kho.
- UI ban đầu dùng 2 hàng nhưng không được nhét 15 nguyên liệu vào một lần hiển thị khiến hit targets quá nhỏ.
- Đối với đơn khắt khe, thêm topping tự do có thể bị trừ sao/theo profile; cần hiển thị NPC preference rõ, tránh đánh giá luôn cao.
- Figma: file `https://www.figma.com/design/NHtsDX93qIk4hfdlD5IYHA` đang ở bản UI-Q2.4 **chưa hiện đủ hàng thứ hai** do Starter MCP call limit. Không được tuyên bố đã đồng bộ prototype này lên Figma.

**Chốt:** concept showroom từ ảnh tham khảo đã thành bản demo offline có tương tác, tách khỏi game. Trước khi port tới source chính cần duyệt UX playtest (đây là 1 lô, không bắt duyệt từng nút). `main` giữ nguyên.
