# Bỏ Phố Về Quê v88.17.1.8 — Kiểm tra bố cục quầy trà sữa

**Trạng thái:** PLAYTEST — chưa merge / chưa xác nhận chơi thật trên laptop hoặc Safari.

## Báo lỗi thực tế của người chơi (v88.17.1.7)

1. Chữ hướng dẫn đè lên ảnh ly; các vùng chữ cũ xuất hiện bên trong bếp minh họa.
2. Phiếu đơn bị nén cùng giá, text vỡ dòng; bộ chọn size M/L/XL lệch góc.
3. Topping quay về dạng bốn ô nhỏ trong một hàng, thiếu cảm giác khay gỗ dài của ảnh mẫu.
4. Khi quán chưa mở, bấm vào bếp có cảm giác phải bấm hai lần.
5. Xem thử tĩnh trước đây không đo trùng hình trong cửa sổ thật.

## Sửa bản 1.8

- **THAY THẾ** stylesheet `v88-17-1-7-counter-remake.css` bằng `v88-17-1-8-kitchen-qa.css`. Không xếp thêm stylesheet cũ để tự đè.
- Phiếu đơn đủ chiều ngang; tên, nguyên liệu và giá có khu vực riêng, nút ?/ⓘ vẫn bấm thật. Chỉ bung chi tiết đơn nếu người chơi yêu cầu.
- Di chuyển trực tiếp node `#cs27-containers` của bộ chọn size và node `.cs20-field` của thanh canh nhịp/tiến độ **ra khỏi** `figcaption` cũ, trước khi chuyển `.cs20-stage`. Ẩn `figcaption` cũ; không xóa node logic/ID.
- Khu pha chế riêng rộng 324px chiều cao; bình AI là vùng bấm rót thật, ly SVG thật nằm bên phải. Ẩn các nhãn hướng dẫn/ảnh nguyên liệu nhỏ dư thừa trên ly mobile.
- Thay bố cục một hàng topping cũ bằng **một hộc gỗ chung**, 2 hàng vật phẩm AI, 3 cột ở 360–430px, 2 cột ở 320px, 5 cột ở laptop. Trượt ngang trong hộc để xem các vật phẩm kế tiếp; chính `button.cs20-item` và hình khay là một vùng bấm duy nhất. Không làm thêm nút bọc ngoài.
- Điều hướng `Sân → Bếp` cuộn tới `#cp177-workshop` thật (không cuộn đến `#cs20-station` đã ẩn); cập nhật scene ngay khi nhấn để không phải nhấn lần 2. Luyện tập là lựa chọn tùy chọn, không phải bước bắt buộc để vào quầy.
- Preview thành phẩm vẫn dùng SVG từ ly thực khi món đã dập nắp, chỉ xuất hiện cho đơn/lượt tập đang diễn ra.
- Giữ nguyên nghề, NPC, ID vật phẩm, Menu, quoted price, kho, tiền, tip, đóng ca, ngày, save và cơ chế canh nhịp.

## Kiểm tra đã chạy

- 17 nhóm Node regression PASS, bao gồm day/interest, menu, tiền/kho, cooking, yard/kitchen, cấu trúc layout.
- Chromium **fixture độc lập** (không phải toàn bộ trò chơi) ở 320 / 360 / 390 / 430 / 760px: không tràn ngang; đo vùng đơn, bàn, kích thước khay, bộ size, thanh tiến độ và hàng nút không chồng nhau. Nút khay native/bình rót PASS, mở phiếu chi tiết trong giới hạn, đổi nghề boba → noodle → boba hoàn trả cùng các node DOM.
- Chromium **fixture single-entry**: nghỉ ca → nhấn Vào quầy 1 lần → chuyển bếp; nhấn Trở về sân → sân: PASS.
- **Chưa** kiểm thử được full game trên Chromium/WebKit tại localhost trong môi trường này (`ERR_BLOCKED_BY_ADMINISTRATOR`). Test mô phỏng không thay thế kiểm thử chơi thật, mất khách, timed gameplay, hay save cũ.

## Bước người chơi kiểm tra

1. Sao lưu save trước, giải nén ZIP và chạy game qua local server/Cloudflare Pages.
2. Khi chưa mở bán: bấm Vào quầy **một lần**, xem bếp; bấm Luyện tập là tùy chọn.
3. Mở bán, xem tên món + topping + giá không đè. M/L/XL ở góc phải của bàn.
4. Chạm trực tiếp vào từng hũ trong hộc 2 hàng, vuốt ngang xem món khác; bấm bình trà rót/dừng; kiểm tra thanh lượng rót và Perfect; dập nắp rồi giao.
5. Mở Chi tiết đơn, đóng lại; hủy đơn và thoát luyện tập phải giữ người chơi trong bếp.
6. Thử laptop và thu hẹp cửa sổ xuống 390px; mở game nghề mì cay, xiên nướng để kiểm tra DOM được trả nguyên khi đổi nghề.

**Không merge vào main** cho tới khi test thật đạt.