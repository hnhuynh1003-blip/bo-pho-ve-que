# Bỏ Phố Về Quê — v88.16.13.2 — ĐỢT 2: MENU VÀ GIÁ BÁN

Ngày: 13/10/2026. **BẢN CHƠI THỬ, không ghi đè Work v88.16.14; không merge main/GitHub**.

## Nền bản thử

- Được tách từ `BPVQ_v88_16_13_1_TIMING_FIX_PLAYTEST.zip` đã được thử trên laptop, giữ CSS vùng Good/Perfect.
- Các luật tiền/kho/mẻ gốc v88.16.13.1 được giữ; Đợt 2 tập trung menu/quote, không mở khách hữu hạn, thuế, NPC, ảnh thành phẩm.

## Đã triển khai

1. **Phone OS → Menu Quán:** Món đang bán, món đã mở khóa, giá hôm nay, giá đề nghị và giá chờ ngày sau; chỉnh giá bước 5 Xu, bật/tắt bán. Chỉ có một nguồn menu trong `gameState.menuV88`, tái dùng recipe ID cũ.
2. **Giá cài trước khi mở lần đầu** có hiệu lực ngay; sau lần đầu mở quán mọi chỉnh sửa vào `pending`, chỉ kích hoạt lúc thực sự sang ngày (`confirmAdvanceToNextDay`), với dấu phiên bản để không lặp.
3. **Một báo giá chốt cho khách:** `quotedTotal`, `menuVersion`, `menuDay` chụp vào `customer.order` lúc tạo đơn, sau khi chọn phần topping. Quầy và nhân viên tự động đều dùng báo giá đó, không dùng ngân sách khách làm giá bán.
4. **Công thức / phụ thu:** Giá niêm yết bao gồm các phần trong recipe; chỉ phần topping/xiên vượt định lượng recipe mới phụ thu. Hóa đơn món tự chọn có giá tính theo định lượng/giá vốn chuẩn tại thời điểm gọi; không cập nhật theo giá nguyên liệu chợ trong ngày.
5. **UI quầy gọn:** Hai nút +/- ở quầy và trạm chế biến được thay bằng nút ⓘ mở Menu trong điện thoại. Thay đổi món/topping trên quầy không tự sửa báo giá khách đã nhận.
6. **Save tương thích:** `menuV88` khởi tạo khi mở save cũ, giữ nghề, Xu, kho, reviews, batch, nhiệm vụ và thưởng cũ. Món vừa mở khóa cần chủ quán cấu hình và bật bán; bảo vệ ít nhất một món hoạt động.
7. **Lưu thất bại:** Thay đổi Menu bị hoàn tác, không báo thành công giả.

## Giá mặc định tham khảo khi khởi tạo

- Trà sữa ly M/L/XL: 45/55/65 Xu cho món cơ bản.
- Mì cay thố M/L/XL: 65/80/95 Xu cho món cơ bản.
- Xiên cơ bản: 40 Xu; mẹt/hộp/công thức nhiều xiên được tính theo vốn.
- Giá đề xuất cho công thức có chi phí cao hơn: làm tròn lên bội số 5 của `max(giá nền, vốn chuẩn × 1,35)`; cho chỉnh 90%–180% mức đề xuất, không dưới vốn; từng bước 5 Xu.
- Phụ thu phần thêm: làm tròn lên bội số 5 của 140% giá vốn mỗi phần, chỉ với số phần vượt preset.
- Đường/đá/cấp cay tiêu chuẩn không thu thêm.

Các giá trên là tham số thử nghiệm; cần người chơi đánh giá cân bằng thực tế trước công bố.

## Giới hạn cố ý

- **Ship và đơn qua điện thoại:** giữ hợp đồng ship trước Đợt 2; chưa quy đổi phí ship sang menu (cần quyết định riêng). Nhân viên phục vụ tại quầy đã dùng quote mới.
- **Lượt khách hữu hạn, thuế/chi phí cuối ngày:** Đợt 3, chưa triển khai.
- **Khung thành phẩm giao cho NPC, 5 master bao bì:** PK-01→PK-05 thuộc đợt mỹ thuật/hiển thị riêng; chưa tạo ảnh.
- **Ảnh/trình duyệt vật lý:** Bản thử chạy kiểm thử logic/Chromium mô phỏng; cần người dùng kiểm tra trên laptop/máy thật trước khi nghiệm thu Đợt 2.

## Cách chơi thử

1. **Sao lưu save thật**, nên tạo tài khoản thử mới. Giải nén toàn bộ ZIP và mở `index.html` (giữ nguyên thư mục `js/css/assets`).
2. Tạo nhân vật, chọn nghề. Mở điện thoại → **Menu Quán**. Sửa giá một món đã mở và bấm **Lưu giá** trước khi mở quán: giá hôm nay phải đổi.
3. Mở quán: sửa giá lần nữa, xác nhận dòng **Chờ ngày sau**, còn báo giá khách vẫn giữ nguyên.
4. Chơi một đơn, chọn công thức chính xác; kiểm tra phiếu gọi món có "Giá đã chốt"; nếu khách gọi nhiều phần topping hơn recipe, chỉ phần thêm mới phụ thu.
5. Thử nhân viên và so sánh với giá đơn (không phải ngân sách NPC). Kiểm tra Xu/kho/review một lần, lưu và mở lại.
6. Đóng ca → Qua ngày: giá chờ chuyển thành giá hôm nay; mở lại không áp dụng giá lặp hoặc phát thưởng.
7. Thử cả trà sữa, mì cay và xiên trong **các hồ sơ thử riêng**, vì nghề đã khóa theo hồ sơ.

## Đã kiểm chứng trong môi trường xây dựng

- Node.js: `test_menu_dot2_v88.mjs`, `test_counter_settlement_v88.mjs` (12 tình huống giao ba nghề và chống trùng), `verify_phone_os_v88.mjs`, `test_kitchen_rules_v88.mjs`, `test_visible_timing_zones_v88.mjs`, `test_cooking_station_v88.mjs`, `test_unified_shop_v88.mjs`, `test_v88_live_scene_qa.mjs`, `test_ingredient_playground_v88.mjs` — đạt.
- Chromium đã tải đầy đủ các script bằng fixture nội bộ, thử tạo hồ sơ thật trong game và thay giá/nhận đơn; không thấy lỗi JS trong ca này. Giao diện Menu được render ở 320/390/430px, không có tràn ngang.
- **Chưa kiểm chứng:** browser full navigation do hạn chế môi trường, WebKit, iOS/Android vật lý và toàn bộ bài test end-to-end khách thực trên máy người dùng.

## Điểm nối dùng để bảo vệ dữ liệu

- `gameState.menuV88` chứa `{schema,career,version,day,firstOpenDone,active,pending}`.
- `window.BPVQMenuV88` chỉ hỗ trợ đọc/ghi menu và quote; UI không trực tiếp cộng Xu.
- Mã không push GitHub, không can thiệp nhánh `feat/v88-phone-os-core` vì Work đang ở v88.16.14 chưa đồng bộ.
