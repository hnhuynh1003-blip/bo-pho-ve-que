# Bỏ Phố Về Quê v88 — Đợt 4: Xây Quán / Danh mục 27 bản vẽ

**Trạng thái:** đã commit lên nhánh `feat/v88-phone-os-core`, PR #1 Draft, **không** merge vào `main`.
**Nền:** `main` v87.8.0.1.

## 1. Tính năng mới đã được triển khai
- Trong ứng dụng điện thoại **Xây Quán → Mở rộng**, có thêm thẻ gấp/mở **🏡 Bản vẽ quán theo nghề**. Bốn tab ứng dụng cũ không bị thay thế.
- Có đủ **3 nghề × 9 bậc = 27 hồ sơ kiến trúc**. Mỗi hồ sơ gồm tên, hình dạng công trình, mái, sân/ngoại cảnh, điểm nhấn của nghề và lưu ý kiến trúc.
- Chọn bậc B1–B9 chỉ để **xem trước** (bậc chưa đạt có biểu tượng khóa); **không** mở khóa sớm, không trừ Xu, không cấp vật phẩm, không ghi `gameState`.
- Hai tuyến đang giữ riêng: (a) dữ liệu kiến trúc `BPVQArchitectureV88` chỉ đọc, (b) vị trí nội thất `BPVQDecorV88` + sở hữu `gameState.decorations`. Tất cả 24 slot được bảo toàn; không dựng ảnh/sprite placeholder thành tài nguyên phát hành.
- **B1:** xe đẩy hai bánh, dù kem, không có nhà; **B5:** nhà hàng làng quê mái ngói đỏ một tầng; **B6:** gác lửng một phần; **B7:** duy nhất một nhà chính hai tầng, cầu thang ngoài, S17 không chắn cầu thang, S20 nằm trên dầm; **B8:** ba khối nhà hình chữ U quanh sân mở; **B9:** giữ nguyên kiến trúc hai cánh đối xứng và mái xanh than/xanh đen đã duyệt. Riêng Trà Sữa ghi `TRÀ SỮA Đặc Sản`, hai nghề còn lại có biển nghề riêng nhưng cùng khối kiến trúc.
- Đây là **bản vẽ tham chiếu bằng văn bản tương tác**, chưa có ảnh công trình hoàn thiện và chưa định nghĩa tọa độ neo sprite của 27 shell. Không được báo cáo là đã hoàn thành 27 asset.

## 2. Kiểm thử mới
| Đối tượng | Kiểm thử | Kết quả |
|---|---|---|
| Điện thoại khi bán | `tests/test_phone_live_shift_v88.mjs`: mở quán, ngăn khách xuất hiện khi Phone đang mở, giữ khách hiện có, không giảm patience 1.75s khi Phone mở, tiếp tục giảm khi đóng Phone, không đổi Xu/điểm uy tín. | **PASS** |
| Hồ sơ kiến trúc | `tests/test_shop_architecture_v88.mjs`: 27 IDs không trùng, đủ 9 bậc/3 nghề, cấu trúc B1/B5/B6/B7/B8/B9, B9 biển hiệu nghề, không ghi save khi xem bản vẽ. | **PASS** |
| Bố cục mới | `tests/test_phone_visual_v88.mjs`: 5 viewport × 8 màn (thêm **B9 Blueprint**) = **40 ảnh chụp + đo bố cục**. | **40/40 PASS** |
| Safari engine | `tests/test_phone_webkit_v88.mjs`: WebKit trên Linux, giả lập mobile 375/390/430px, Home → Xây Quán → Layout → Kho → B9 → Home → đóng Phone. | **3/3 PASS** |
| Hồi quy cũ | QA 3 nghề, save v87 mô phỏng, nâng B1→B9, Xu/SP/bonus/24 slot, kiểm thử cú pháp và điều hướng. | **PASS** |

**Run đã xác minh:** [GitHub Actions #38139907649 — 3 jobs PASS](https://github.com/hnhuynh1003-blip/bo-pho-ve-que/actions/runs/38139907649) gồm `phone-os`, `browser-smoke`, `webkit-mobile`.

## 3. Chưa nghiệm thu và cần ưu tiên
1. **Mỹ thuật 27 công trình:** hình đầy đủ cho 3 nghề và 9 bậc cần bản asset và duyệt ngoại hình; không tự phát sinh để đè hình B9 đã chốt.
2. **Tọa độ neo thực** tương ứng sprite công trình B1–B9 từng nghề. Cần kiểm tra mốc S1/S2 hệ thống, S4 mái, S18 bàn, S20 dầm; bộ Quầy Đá nhóm S5–S7.
3. **Thử trực tiếp iPhone/iPad và Android**. WebKit Linux không tương đương đầy đủ iOS Safari trên thiết bị thật; kiểm tra safe area, touch, bàn phím ảo và tốc độ.
4. **Ảnh screenshot** cần xem bằng mắt người, không dùng chỉ số hình học để khẳng định thẩm mỹ đã đạt.
5. **Đường game thật Qua Ngày**, NPC, Ship/Soppi, nhân sự, âm thanh và lịch sử save xuất thực của người chơi vẫn cần UAT mở rộng.
6. Main Game One Screen Cooking 2.0 và cơ chế khách quen/đoàn khách nằm ở giai đoạn sau; chưa tự ý ghép vào cùng đợt.

## 4. Nguyên tắc bảo toàn
- `main` không thay đổi. Đợi người dùng duyệt mới merge.
- `js/game.js` không đổi; không ảnh hưởng `shopConstruction`, Xu, SP, kho nguyên liệu, thưởng trang trí và các hệ thống hiện tại.
- Bản vẽ kiến trúc chỉ là mô hình tham chiếu. Nó không thay thế ảnh đã được phê duyệt của B7/B8/B9.

**Kết luận:** Đợt 4 đã có mô hình dữ liệu và trình xem bản vẽ 27 công trình, đồng thời có thêm kiểm thử ca bán và WebKit. Tiếp theo nên trình duyệt hình mẫu/các anchor và chốt họa tiết trước khi đẩy sprite vào game.
