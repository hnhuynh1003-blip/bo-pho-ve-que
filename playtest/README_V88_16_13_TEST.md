# Bỏ Phố Về Quê v88.16.13 — Đợt 0–1

Trạng thái: bản kiểm thử chức năng; chưa nghiệm thu trình duyệt, chưa cập nhật site/merge PR. Phạm vi Đợt 0–1 đã được người dùng duyệt. Không chuyển sang đợt Menu/Ngày/Cư dân.

## Đã có trong bản
- Mì: một lượt canh nhiệt; xiên: hai lượt tự lật, quét sốt/gắp/giao. Trà sữa giữ rót/dập nắp.
- Perfect/Good/Bad/timeout hoàn thành đều có thể giao; khách còn có thể từ chối trả tiền. Kết quả dừng, chỉ Làm lại mới bỏ mẻ.
- Good rộng 28–72%, Perfect 44–56%; mì làm nóng 2s, xiên 1,5s; hai vòng hết giờ chốt Bad. Vùng hiển thị khớp vùng chấm.
- Kho trừ lúc bắt đầu mẻ, giao không trừ thêm; làm lại tiêu hao mẻ mới. Nhân viên tính đúng lượng topping, không tranh đơn với mẻ thủ công.
- Mẻ lưu vào counterCraft version 1 cùng hồ sơ/ngày/nghề/khách/đơn/món/kết quả; save cũ không có mẻ vẫn giữ dữ liệu. Reload hợp lệ không trừ/cấp lại.
- Giao dịch kho/tiền/XP/review được lưu một lần, có rollback nếu lưu lỗi. Perfect thưởng 10%, tối đa 8 Xu khi được nhận; nhân viên không nhận thưởng thao tác của người chơi.
- Chọn lại thành phần cũ không reset; sau khi bắt đầu phải Làm lại để đổi. Giá legacy khóa theo mẻ, app Menu dành cho Đợt 2.
- Chất lượng ảnh hưởng sao; chưa quét sốt ghi thành lỗi nhận xét và không đạt Perfect. Đồng hồ khách dừng khi ẩn tab; bỏ đi hủy mẻ đã dùng và lưu trạng thái.

## Đã kiểm tra
PASS: test_kitchen_rules_v88.mjs (3 nghề × 4 kết quả, 9 tổ hợp hai mặt, đóng băng, pause/hidden, serialize).
PASS: test_counter_settlement_v88.mjs (native giao 12 kết quả, từ chối, kho nhiều phần, retry, reload, khác hồ sơ, thất bại lưu, nhân viên, thiếu sốt).
PASS: test_cooking_station_v88.mjs, test_ingredient_playground_v88.mjs, test_unified_shop_v88.mjs.
PASS: cú pháp game.js, v88-kitchen-play.js, v88-cooking-station.js.
Sửa kỳ vọng kiểm thử tip nhân viên: 120 × 15% + 5 = 23 Xu, tổng 143 Xu; không thay luật tip hiện có.

## Cổng nghiệm thu còn mở
Môi trường không có Chromium/WebKit. Playwright tải trình duyệt thất bại (file tải không phải ZIP hợp lệ). Chưa chạy được test_kitchen_browser_v88.mjs, kiểm thử bố cục 320/390/430px/desktop, WebKit và thiết bị thật. Không dùng các kiểm tra VM/static để tuyên bố giao diện hoặc iOS đã ổn.
Tiếp tục cùng Đợt 1: chạy browser và hồi quy quầy/rót/điện thoại trên mã cuối, sửa lỗi phát hiện rồi mới chốt site/GitHub. Workspace game hiện không có Git remote; chưa đồng bộ mã mới lên PR.

## Cách chơi thử
Giải nén toàn bộ ZIP, mở index.html. Nếu trình duyệt không tải đủ tài nguyên khi mở file trực tiếp, phục vụ thư mục bằng HTTP (ví dụ python3 -m http.server 8000), vào http://localhost:8000.
Sao lưu save trước khi thử. Dùng tài khoản test riêng; không thay nghề hồ sơ đang chơi. Ba quán cần test riêng, gồm Perfect/Good/hụt, bỏ sốt, Làm lại, thiếu kho và reload giữa mẻ. Lưu/game/account vẫn dùng hệ thống cũ.
