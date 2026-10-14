# Bỏ Phố Về Quê — v88.16.13.3 (bản chơi thử hoàn thiện Đợt 2)

**Ngày:** 13/10/2026  
**Nền:** v88.16.13.2 Menu/giá, bao gồm bản vá Good/Perfect v88.16.13.1.  
**Tình trạng:** đã sửa mã và đóng gói một bản thử độc lập; không ghi đè Work v88.16.14, không đẩy lên GitHub/main.

## Thay đổi đã triển khai

| Mã | Tính năng | Đường dữ liệu |
| --- | --- | --- |
| UI-01 | Ẩn `Vốn` và `Lãi dự kiến` khỏi trạm chế biến; chuyển vốn chuẩn và lãi tham khảo đến Menu Quán | `v88MenuGetView` và Phone Menu; không phát sinh kinh tế trong UI |
| UI-02 | Dùng khu giá/lãi cũ thành phiếu khách: tên món, ly/thố/khay, nền chính, topping/xiên, đường/đá/cấp cay, giá chốt và nút mở toàn bộ chi tiết | `BPVQCookingBridge.snapshot().customer.order`, sao chép từ đơn gốc, **không lấy từ món người chơi đang nấu** |
| UI-03 | Bong bóng NPC chỉ dùng lời thoại ngắn sẵn có (nếu đủ ngắn) hoặc câu chào ngắn đúng nghề; chi tiết đơn chuyển xuống phiếu | Không thay đổi đơn/khẩu vị/đánh giá NPC |
| UI-04 | Chuyển chỉ dẫn thao tác cơ bản vào nút `?`, cạnh nút `ⓘ` mở Menu. Ẩn các thông báo thao tác chung ở trạng thái chọn món; giữ cảnh báo quan trọng | Không thay đổi minigame, độ khó hay engine |
| M-06 | Phone Menu hiển thị từng **giá phụ thu topping/xiên theo phần**, giá vốn tham khảo và các thành phần đã gồm trong công thức; cho chỉnh phụ thu trong giới hạn | `menuV88.active.extras` / `menuV88.pending.extras`; tương thích với save .13.2 |
| M-07 | Đơn mới chốt giá phụ thu riêng tại thời điểm khách đặt, phần đã gồm không tính thêm. Đơn/nhân viên dùng báo giá cố định | `order.quotedTotal`, `order.quotedExtras`, `menuVersion`, settlement native như cũ |

**Quy tắc giá:** phụ thu chỉ đánh vào số lượng **vượt thành phần có sẵn của recipe**. Giá phụ thu mới áp dụng **ngay trước ca đầu tiên**; sau khi đã mở quán, thay đổi chỉ áp dụng từ ngày kế tiếp. Đơn đã chốt giá không bị đổi qua sửa Menu, chuyển ngày hoặc tải lại. Món tự chọn không có công thức vẫn dùng cách định giá theo vốn của v88.16.13.2; chưa tái thiết kế giá cho ship. Giá của topping trong thực đơn không dùng để tính trùng phần đã có.

## Bảo toàn save

- Giữ `V88_MENU_SCHEMA=2`, bổ sung trường tùy chọn `extras` vào dữ liệu Menu. Save v88.16.13.2 chưa có trường này được khởi tạo bằng phụ thu mặc định, **không đặt lại giá món, tiền, kho, nghề hay pending Menu**.
- Không đổi mã vật phẩm, công thức, đánh giá, phần thưởng, NPC và hệ thống ca/ngày.
- Giá/định lượng mỗi đơn được snapshot. Thao tác báo giá nhiều lần không tính phụ thu hai lần; lưu lỗi rollback phần chỉnh phụ thu.
- Luồng thưởng, tính tiền, trừ kho, nhân viên tiếp tục qua settlement của game gốc; UI chỉ hiển thị.

## Kiểm thử đã chạy

- `node --check`: 25/25 tệp JS không lỗi cú pháp.
- PASS `tests/test_menu_dot2_v88.mjs`: giá món, giá topping/xiên cho ba nghề, thay đổi chờ ngày sau, phần mặc định không tính trùng, giữ giá khi reload/migration, rollback khi lưu lỗi.
- PASS `tests/test_counter_settlement_v88.mjs`: 12 trường hợp gồm nhận/từ chối, giao một lần, kho/Xu/review/XP và khôi phục mẻ.
- PASS `tests/verify_phone_os_v88.mjs`, `test_cooking_station_v88.mjs`, `test_kitchen_rules_v88.mjs`, `test_visible_timing_zones_v88.mjs`, `test_unified_shop_v88.mjs`, `test_ingredient_playground_v88.mjs`.
- Chromium **fixture tách biệt**: phiếu đơn và Phone Menu hiển thị, thao tác xem chi tiết và lưu phụ thu hoạt động ở kích thước 320, 390, 430 px, không có tràn ngang.
- **Chưa nghiệm thu trên game đầy đủ trong browser:** điều hướng URL game bị môi trường chặn (ERR_BLOCKED_BY_ADMINISTRATOR). Một số test browser Node không chạy do thiếu package Playwright. Chưa thử thực tế trên laptop/iOS/Android. Không tuyên bố đã nghiệm thu hệ thống end-to-end bằng thiết bị thật.

## Cách chơi thử

1. Giải nén ZIP đầy đủ rồi mở `index.html` bằng trình duyệt trên laptop. Nên sao lưu save, ưu tiên hồ sơ test.
2. Tạo / mở quán trà sữa; đọc lời chào NPC ở thẻ trên, nhìn phiếu đơn ngay dưới khu chế biến, bấm vào phiếu để xem đầy đủ yêu cầu. Bấm `?` để xem cách pha; bấm `ⓘ` vào Phone Menu.
3. Trong **Điện thoại → Menu Quán**, mở mục **Giá topping / xiên thêm**; kiểm tra danh mục, chỉnh giá 1 topping, bấm Lưu. Xem giá đã gồm của công thức và vốn/lãi tham khảo.
4. Khách gọi thêm 2–3 phần topping (cần NPC tạo được đơn này); đảm bảo công thức có sẵn 1 phần thì chỉ phần dư bị tính phụ thu; phiếu và tiền tính đúng.
5. Mở ca, đổi giá topping; giá đang hiệu lực không đổi. Đóng ca và qua ngày, giá mới mới cập nhật; đơn đã nhận trước đó giữ giá cũ.
6. Kiểm tra thêm nghề mì và xiên trên hồ sơ riêng, giao món Good/Bad/Perfect; thử nhân viên và save/load. Nếu bảng bị che hoặc câu lời thoại không hợp, báo lại ảnh chụp tại thời điểm đó.

## Giới hạn phạm vi

- Chưa làm đợt 3 (hữu hạn số khách / sổ chi phí), chưa thiết kế hình thành phẩm khi giao NPC (PK-01..05), không thay minigame hay cân bằng độ khó.
- **Chưa bật/tắt bán riêng mỗi topping**: các topping vẫn phụ thuộc điều kiện mở khóa hiện hữu. Trong bản này chỉ bổ sung **giá phụ thu từng phần**, tránh đưa vào trạng thái cấm chọn/không cho NPC gọi khi chưa có quy tắc kinh tế thống nhất.
