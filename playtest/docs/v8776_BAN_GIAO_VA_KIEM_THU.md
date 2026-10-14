# Bỏ Phố Về Quê — v87.7.6 · Thông báo & Home vuốt ngang

## Phạm vi đã triển khai (được duyệt)

- Main Game: vẫn chỉ có nút chuông trên Header; nút chuông mở bảng xem nhanh, `Xem tất cả` mở **app Thông Báo trong điện thoại**.
- Home Thị Trấn OS: **bỏ thẻ thông báo lớn** đặt xen giữa hình Mika và các icon. Thanh công cụ trên Home giữ **chuông** để mở thẳng app.
- Tạo app **🔔 Thông Báo** trong điện thoại, không sử dụng lớp modal tách rời nữa. Bộ lọc đồng nhất 4 cột: Tất cả / Thời tiết / Sự kiện / Khác.
- Từng tin đánh dấu riêng. Nút Đọc tất cả chỉ đánh dấu đã đọc, không xóa lịch sử. Dùng chính `gameState.notifications` và các hàm lưu hiện tại, không tạo dữ liệu thưởng/nhận lại.
- Home **vuốt ngang 2 trang** (Hằng ngày / Quản lý) bằng cuộn snap; chấm hiển thị trang và có thể bấm; trên laptop dùng phím trái/phải. Dock Ship / Soppi / Nhật Ký luôn ở dưới.
- Hỗ trợ thêm app về sau: khi lưới nhận biểu tượng mới (ví dụ Admin TEST), phân trang tự động mà không sửa đường dẫn app gốc.
- Phần Cài đặt không còn công tắc xem trước thông báo trên Home vì không còn thẻ này; vẫn giữ các tùy chọn lọc thông báo đã có.

## File thay đổi

1. `index.html`: khai báo CSS và JS v87.7.6 cuối cùng, sau v87.7.5.1.
2. `css/v8776-swipe-notifications.css`: giao diện app, tab cố định 40px, Home hai trang ngang, phản hồi 320–430px.
3. `js/v8776-swipe-notifications.js`: app, dữ liệu thông báo chung, bố trí trang, điều hướng cũ sang app.

Không thay `game.js`, không thay giá, nghề, Xu, SP, save, công thức, nhiệm vụ hay Admin Test.

## Kiểm thử đã thực hiện

- `node --check` đối với **toàn bộ** file JavaScript trong gói: đạt.
- Kiểm tra đường dẫn CSS/JS trong `index.html`: đạt, không thiếu file.
- Thử mã UI thật trong mô hình Chromium ở 320 / 390 / 430px: 2 trang; mở chuông => app (không mở modal độc lập); 4 tab; đọc từng tin và đọc tất cả: đạt.
- Thử quay Home, đổi trang bằng indicator/scrollLeft: đạt.

## Chưa nghiệm thu

- Không thể mở trang trò chơi đầy đủ trực tiếp bằng Chromium trong môi trường hiện tại (trình duyệt chặn các địa chỉ file:// và localhost), nên thử được **giao diện dùng mã thật** trong mô hình, chưa phải kiểm thử gameplay end-to-end trên GitHub Pages.
- Người chơi cần thử vuốt ngang trên Android/iPhone thật, trong khi đó app có nhiều nội dung dài vẫn cuộn dọc **trong chính app** là hành vi có chủ đích.
- Hệ thống Admin Test chỉ bật trong hồ sơ TEST sau khi nhập mã, cần kiểm tra icon có xuất hiện ở trang Quản lý.

## Cách cập nhật với GitHub Desktop

**Điều kiện:** repo đang chạy v87.7.5.1, chưa có thay đổi chưa Commit cần giữ.
1. Sao lưu/export save quan trọng trước khi nâng cấp.
2. Giải nén PATCH ra chỗ riêng.
3. Vào thư mục **bên trong** ZIP; sao chép `index.html`, `css/`, `js/`, `docs/` vào **thư mục gốc** repository (nơi có `index.html`), ghi đè file trùng.
4. GitHub Desktop -> Changes: xác nhận file đúng -> Commit `v87.7.6 - Swipe OS and notification app` -> Push origin.
5. Refresh GitHub Pages và kiểm thử chuông Header, chuông Home, các trang vuốt, các app cũ và mã Admin.

**Không** đưa cả thư mục bao ngoài ZIP vào thư mục gốc repo. **Không** tạo `css/css`, `js/js`.

## Tiêu chí nghiệm thu trên máy thật

- [ ] Main Game không bị che bởi thẻ thông báo.
- [ ] Mở điện thoại chỉ hiện thanh chuông nhỏ + icon app, không có khung thông báo lớn.
- [ ] Vuốt từ trang 1 qua trang 2 và trở lại mượt; chấm chỉ trang thay đúng.
- [ ] Từ Home bấm chuông, từ Header chọn Xem tất cả, từ app icon đều mở cùng Trung tâm thông báo trong điện thoại.
- [ ] Tab Tất cả/Thời tiết/Sự kiện/Khác đều vừa chiều rộng điện thoại, không vỡ hàng.
- [ ] Đọc một tin không tự đọc tất cả; reload dữ liệu vẫn còn trạng thái đúng.
- [ ] Quay Home, vào Cài đặt, Xây Quán, Nhân Vật, các app Ship/Soppi không hỏng.
- [ ] Admin Test vẫn tạo/đổi hồ sơ TEST an toàn.
