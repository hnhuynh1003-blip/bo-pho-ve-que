# Bỏ Phố Về Quê — v88.16.13.1 — Bản vá thử F-07A/B

**Nguồn:** ZIP v88.16.13 đã lưu trong Thư viện, không phải Work v88.16.14.
**Phạm vi:** chỉ sửa hiển thị thanh canh nhịp; không thay luật chấm điểm, giá, kho, tiền, nhiệm vụ, NPC, data/save, ca/ngày, hoặc điều chỉnh balance.

## Những thay đổi

1. `css/v88-timing-meter-visibility.css`: tải SAU CSS quầy để đưa các mảng Good (28–72%) và Perfect (44–56%) về đúng trạng thái hiển thị khi có `.cs29-cap-meter`. Nền gỗ và trang trí khác giữ nguyên khi chưa canh.
2. `js/v88-cooking-station.js`: đánh dấu `.cs29-timing-active` trên trạm trong các giai đoạn canh nhịp, dùng lại hàng chữ `#cs20-craft` đang tồn tại để hiển thị `Xanh: đạt · Vàng giữa: Perfect`. Thêm mô tả aria của thanh canh.
3. `index.html`: tải stylesheet vá cuối cùng; cập nhật tên bản thử.
4. `tests/test_visible_timing_zones_v88.mjs`: kiểm tra DOM/CSS, bảo đảm cả vùng mục tiêu và nhãn ngắn không bị xóa nhầm.

## Kiểm tra đã chạy

PASS `node --check js/v88-cooking-station.js`.
PASS 8 bộ test: `test_visible_timing_zones`, `test_kitchen_rules`, `test_counter_settlement`, `test_cooking_station`, `test_ingredient_playground`, `test_unified_shop`, `verify_phone_os`, `test_v88_live_scene_qa`.

**Chưa nghiệm thu:** toàn bộ game trên Chromium/WebKit ở 320/390/430/desktop và iOS/Android thật. Thử chạy Chromium headless trong môi trường tạo bản vá bị timeout; không được xem là PASS. Đặc biệt cần người dùng thử nhìn vùng vàng / xanh thật trên ba quầy và phản hồi vị trí kim.

## Sử dụng

Giải nén ZIP đầy đủ và chạy `index.html`. Nếu tài nguyên không tải khi mở trực tiếp, dùng `python -m http.server 8000` trong thư mục rồi mở `http://localhost:8000`.
Sao lưu save thật trước khi thử, ưu tiên tài khoản thử nghiệm; bản vá không đổi schema nhưng vẫn là bản thử.

## Cổng bước tiếp theo

F-07C/D/E: thử trực tiếp các thao tác Perfect/Good/Bad/timeout, giao/đánh giá/tiền/kho/save/nhân viên trên ba nghề và kích thước mobile; chốt thông số menu (M-01) rồi mới lập trình M-02…M-09.
Không upload/chỉnh nhánh `feat/v88-phone-os-core` để tránh ghi đè Work v88.16.14. Không merge hoặc phát hành site.
