# Bỏ Phố Về Quê v88.17.1 — Quầy trà sữa Cute Premium (PLAYTEST)

**Tình trạng: thử nghiệm giao diện đầu tiên, CHƯA nghiệm thu v88.17.1 hoặc phát hành chính thức.** Đã được người chơi duyệt hướng art v88.17.0 ngày 2026-10-13. Giữ nguyên ID game/nhân vật/công thức/giá/tiền/kho/save. Không thêm hệ thống tính tiền hoặc hệ mini game mới.

## Thay đổi thuộc bản này

- `css/v88-17-cute-premium-boba.css`: lớp skin mới dành riêng cho quầy trà sữa dựa trên palette đã duyệt (kem sữa, hồng trà, nâu gỗ, xanh sage); gồm quầy gỗ nhiều lớp, phiếu nói chuyện của khách, mặt bàn món, chân ly, bình đường/đá, phiếu order, khay topping, bộ nút.
- `index.html`: load CSS mới sau các CSS v88.16.x, đổi tiêu đề bản playtest. Giữ toàn bộ DOM ID và sự kiện hiện hành.
- `tests/test_cute_premium_boba_v88.mjs`: kiểm tra selector khóa nghề, thứ tự CSS, DOM ID và hỗ trợ giảm chuyển động.
- Những hình của 28 mã trà sữa vẫn sử dụng nguồn hiện có và SVG fallback tương ứng; **chưa** công bố đã vẽ mới/hoàn tất thay thế 28 ảnh. Bước tiếp sau mới kiểm trực tiếp từng ảnh tại 56px và thay hàng placeholder theo kiểm kê đã duyệt.
- Bản cục bộ áp lại vá lãi vay đã có ở v88.16.13.5: chỉ cộng phần lãi chưa trả vào dư nợ, không cộng cả lãi đã trả (nhánh GitHub gốc đã có bản vá tương ứng).

## Những gì CHƯA thay đổi

- Quầy mì cay và xiên nướng giữ CSS cũ trong bản này; đến v88.17.2 / v88.17.3 mới dùng chung quy chuẩn hình ảnh.
- Sân quán 9 bậc, nhân viên, menu, giá topping, NPC, Phone OS, đóng ca, sang ngày và tài nguyên còn nguyên.
- Không điều chỉnh vùng Good/Perfect và tốc độ canh nhịp; cân bằng khó dễ để sau khi hoàn tất mỹ thuật 9 bậc như người chơi đã quyết định.
- Không tự thay thế các hình sốt me, bò viên, tôm sú thuộc hai nghề còn lại trong gói trà sữa.

## Đã kiểm tra

- Node: `tests/test_cute_premium_boba_v88.mjs`, `test_day_rules_v88.mjs`, `test_day_integration_v88.mjs`, `test_menu_dot2_v88.mjs`, `test_cooking_station_v88.mjs`, `test_counter_settlement_v88.mjs` — PASS.
- Chromium `set_content` với HTML mô phỏng đúng selectors/CSS: 320, 390, 430px, cao khối bếp 517px, không tràn ngang; đây **không phải kiểm thử gameplay trình duyệt hoàn chỉnh**.
- Chạy Chrome/Chromium vào localhost/file:// từ môi trường test hiện bị `ERR_BLOCKED_BY_ADMINISTRATOR`, nên KHÔNG được coi là đã nghiệm thu Playwright game thật/WebKit/iPhone.
- Tình trạng lỗi compact/WebKit còn trong PR #6 cần tiếp tục kiểm thử độc lập. Bản này chỉ giảm chiều cao quầy trà sữa trong mô phỏng, không khẳng định đã sửa tất cả nghề.

## Chơi thử trên laptop

1. Sao lưu save game hiện tại (xuất save từ game nếu có). Tránh chép đè thư mục game vào thư mục cũ.
2. Giải nén ZIP ra một thư mục hoàn toàn mới và mở `index.html` (hoặc phục vụ bằng web server tĩnh). Nếu thấy tính năng trình duyệt bị hạn chế khi dùng `file://`, chạy `python -m http.server 8766` trong thư mục giải nén và truy cập localhost:8766.
3. Tạo hồ sơ thử nghiệm nghề **trà sữa**, chuyển sang Quầy và làm một đơn có nhiều topping.
4. Kiểm tra phiếu khách, giá chốt, cuộn 2 hàng nguyên liệu, nắp Good/Perfect và nút hoàn tất/giao món; chuyển bậc 1/4/9 để kiểm hiệu ứng layout không đổi sai. So sánh với hình sân, điện thoại.
5. Nếu bị che chữ, nguyên liệu mất ảnh hoặc nút chạm khó, chụp màn hình kèm kích thước thiết bị và tình huống.

## Tiêu chí tiếp theo để hoàn tất v88.17.1

- Screenshot game runtime thật ở 320/390/430/desktop, trạng thái chờ khách, đang làm, đang timing và giao món.
- Audit 28 ID nghề trà sữa; làm sạch ảnh lỗi/placeholder trong khi giữ nguyên ID và chỉ sửa ánh xạ khi đã kiểm đường dẫn.
- Verify 3 bậc đại diện 1/4/9, Phone Menu, giá topping, lưu/tải, đóng ca/sang ngày, tiền và kho một lần duy nhất; chạy Chromium/WebKit.
- Sau khi đạt cổng này mới phê duyệt bắt đầu đồng bộ nghề mì cay.

**GitHub code branch:** `feat/v88-17-1-boba-cute-premium`. Đợt này tách riêng, không merge `main` hay nhánh Work tự động.