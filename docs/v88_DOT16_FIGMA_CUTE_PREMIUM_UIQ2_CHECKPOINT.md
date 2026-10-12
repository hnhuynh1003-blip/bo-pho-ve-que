# UI-Q2 Cute Premium — Figma checkpoint (2026-10-12)

Figma editable design: https://www.figma.com/design/NHtsDX93qIk4hfdlD5IYHA

- Frame nghỉ ca: [390×844](https://www.figma.com/design/NHtsDX93qIk4hfdlD5IYHA?node-id=1-2) (id `1:2`).
- Frame có khách: [390×844](https://www.figma.com/design/NHtsDX93qIk4hfdlD5IYHA?node-id=1-82) (id `1:82`).
- Frame luyện tập: [390×844](https://www.figma.com/design/NHtsDX93qIk4hfdlD5IYHA?node-id=1-165) (id `1:165`).

3 frame được tạo bằng Figma editable nodes; đây là **bản concept UI đầu tiên**, chưa phải art final. Các hình xe/cây/nguyên liệu là vector placeholder trong Figma, không thay thế asset quán QA gốc và chưa được đưa vào game.

Hướng nghệ thuật: hòa trộn Phone OS v88 (kem ngà, vàng mật ong, xanh mát, bo mềm, icon cute, bóng đổ tinh tế) với quầy gỗ/men sứ, hình ảnh trực quan diorama trên mobile dọc.

Quy tắc: **giữ geometry quầy và mặt bàn giống hệt cho cả nghỉ ca/khách/luyện**, NPC hội thoại cạnh cảnh, thanh trạng thái ngoài ảnh, không thẻ lớn che xe, không có bếp riêng đột ngột bung ra. Tỉ lệ thiết kế 390×844, kiểm thử sau đó 320×568 / 360×640 / 375×812 / 430×932.

Nguồn CSS để tham khảo: `css/phone-os-v88.css`, tài liệu yêu cầu: `docs/v88_DOT15_UI_Q2_QUAY_LIEN_MACH_MOBILE_PORTRAIT_SPEC.md`.

**Kế tiếp**: polish Figma các thành phần mang cảm giác premium (vật liệu, typography, icon, layering), đối chiếu với artwork game thật, rồi mới triển khai CSS/JS và kiểm thử. Không merge main; công trình B1–B9 chưa được sản xuất.


## UI-Q2.1 · Thanh kéo Đường & Đá — đã cập nhật Figma (12/10/2026)

Figma cả ba frame 390×844 đã có **hai cột định lượng dọc cạnh ly**, tên và % hiển thị, chất liệu ống thủy tinh màu mật ong cho Đường, xanh băng cho Đá. Đây là **mock tĩnh, chỉnh sửa được trong Figma**; chưa phải thao tác drag thực trong HTML.

- **Đường:** snap 30% / 70% / 100% (đúng enum setBobaSugar).
- **Đá:** snap 0% / 50% / 100% (đúng enum setBobaIce).
- Trong gameplay sau này, cho cả kéo núm, chạm trực tiếp vào vạch và hỗ trợ keyboard/accessible input; mỗi bar là một target có hit-area ít nhất 44px dù phần ống hình ảnh rất mảnh.
- Bỏ 6 nút chọn mức trong `cs20-shelf`. Đường/Đá gắn luôn vào vùng pha chế, tránh mở thêm card làm thay đổi chiều cao layout; khay dưới chỉ dành cho topping, cốt trà, ly, siro.
- Định lượng topping và mô phỏng đá rơi vẫn cần xây tiếp. Chưa tăng độ chia bước tuyến tính 0–100% để tránh làm sai đơn NPC/validate/save hiện tại. Phần nghiệm thu **phải** kiểm tra state request, sử dụng touch một tay và không scroll jump.

