# Bỏ Phố Về Quê v87.7.7.1 — Vá nóng Thị Trấn OS

## Vấn đề từ ảnh người chơi
- Home điện thoại hiển thị khung icon rỗng và tên app mờ/mất; wallpaper không hiển thị.
- Dock ba app thiếu hình và phong cách không đồng đều.
- Chuông thông báo trên thanh trên cùng va chạm với nút đóng; đã có app Thông Báo riêng.
- Hình Mika chiếm nhiều diện tích ở góc phải.

## Nguyên nhân mã nguồn có thể kiểm chứng
- `v8777-phone-premium.css` đặt `font-size:0` và `color:transparent` lên icon, thay icon bằng `background-image` từ `assets/images/phone/icons/*.webp`. Nếu ảnh lỗi / chưa được tải đúng thư mục, nút còn khung nhưng mất biểu tượng.
- Nhiều tập CSS từ v87.7.3 đến v87.7.7 cùng khai báo kích thước `.phone-app-icon`, vùng nút và nhãn, có các bộ chọn `!important` ưu tiên khác nhau.
- Ảnh người chơi cho thấy khung icon trống và hình nền không tải; chỉ từ ảnh **không thể khẳng định** file đã bị thiếu trên GitHub. Các khả năng gồm đường dẫn, cache hoặc tải file chưa hoàn tất.

## Phạm vi cập nhật
- `index.html`: nạp một CSS và một JS vá nóng cuối cùng.
- `css/v87771-phone-repair.css`: kích thước khung/nội dung của hai trang Home và dock; giữ nhãn app nhìn rõ; thu nhỏ Mika; ẩn chuông trùng trong điện thoại, vẫn giữ chuông Header Main và app Thông Báo.
- `js/v87771-phone-repair.js`: hiển thị hình minh họa qua phần tử img, có emoji fallback khi file không tải; xử lý ảnh nền lỗi bằng màu gradient. Không thay đổi nguồn thông báo, dữ liệu nghề, SP, Xu, nhân viên, nợ hoặc save.
- `assets/images/phone/icons/*.webp` và `assets/images/phone/wallpapers/*.webp`: đóng gói lại tất cả để tránh thiếu ảnh nếu cập nhật lần trước bị sót.

## Cách cài qua GitHub Desktop
1. Đảm bảo repository đã cập nhật v87.7.7.
2. Sao lưu save game. Tải PATCH v87.7.7.1 và giải nén **ra ngoài** repository.
3. Mở GitHub Desktop > Repository > Show in Explorer.
4. Mở thư mục phiên bản bên trong ZIP; chép `index.html`, `css`, `js`, `assets`, `docs` vào **gốc** repository; chọn gộp thư mục / ghi đè file.
5. Kiểm tra **không** tạo `assets/assets`, `css/css`, `js/js`.
6. Commit: `v87.7.7.1 - Fix Phone OS Icons`, sau đó Push origin.
7. Tải mới game, thử mở điện thoại, vuốt hai trang, mở app Thông Báo, thử đổi wallpaper, mở Admin Test.

## Kiểm thử trong môi trường mô phỏng
- 320, 375, 390, 430px: 2 trang Home, dock 3 app, 6 wallpaper, thay bố cục, reset, mở Thông Báo, icon Admin động: đạt.
- Giả lập thiếu **toàn bộ ảnh phone icons và wallpaper**: biểu tượng emoji dự phòng và nhãn còn nhìn được; Home không trống: đạt.
- Trong mô phỏng, giữ được 1 biểu tượng chuông ở Main Game + app Thông Báo của điện thoại; nút đóng không bị chuông trong điện thoại chèn lên.
- Chưa nghiệm thu trên trang GitHub Pages đang chạy của người chơi hoặc điện thoại thật.

## Điều kiện nghiệm thu cuối cùng
- Có hình icon và nhãn dưới icon ở mọi trang; nếu thiếu ảnh, emoji dự phòng vẫn hiển thị.
- Dock đồng bộ và không che điều hướng; Mika không đè nút đóng.
- Vuốt ngang không làm mất app; số tin chưa đọc và trạng thái đọc giữ nguyên; không mất save.
