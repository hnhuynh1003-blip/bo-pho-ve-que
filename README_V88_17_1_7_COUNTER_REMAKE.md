# BPVQ v88.17.1.7 — FULL COUNTER REMAKE / PLAYTEST

## Thiết kế được duyệt
Bỏ bố cục quầy pha chế trà sữa cũ. Lấy 2 ảnh mẫu AI mà người chơi gửi làm chuẩn: hậu cảnh quầy; bảng đơn hàng; thành phẩm; hộc topping; bình trà và ly. Không tạo một "cảnh quán" thứ hai phía trên sân; sân riêng để trang trí/NPC, vào quầy để chế biến.

## Thực hiện
- **Giao diện quầy mới độc lập:** `js/v88-17-1-7-counter-remake.js` tạo `#cp177-workshop` **ngoài** `#cs20-station`. CSS `v88-17-1-7-counter-remake.css` định nghĩa lưới mới và **ẩn layout quầy cũ** riêng cho nghề `boba`. Khi đổi nghề khác, mã chuyển nguyên nút về đúng vị trí cũ. Không sao chép nút/cơ chế.
- **Cơ chế giữ nguyên:** di chuyển DOM thật gồm order, progress, ly, ingredient rail, size, sugar/ice, actions, nút trở về sân. Event listeners và ID vẫn là các node gốc, nên không tạo bridge giá/tiền/kho/đơn mới.
- **Nhấn ảnh là chọn:** item hiện tại vốn là `button`; CSS bỏ khung card nền trắng/chồng, biến khay topping AI và nhãn ngay dưới thành một hit target duy nhất (không wrapper mới).
- **Bình trà AI là nút rót thật:** nút `#cp177-pour-object` chuyển click sang nút rót native bị ẩn (không thêm thao tác tính lượng mới). Chạm lần 2 dừng; rót thêm lúc cho phép cũng chạm bình. Canh nhịp/dập nắp vẫn do native code chấm.
- **Ly đang làm:** tiếp tục nhận màu cốt trà, lượng trà/đá và các topping từ trạng thái native. Cải thiện SVG thành các dạng khác nhau cho trân châu, pudding vuông vàng, thạch, nha đam, foam, v.v. **Thành phẩm clone đúng SVG đang pha sau khi nắp hoàn tất**; không dùng ly AI khác món để đánh lừa.
- **Ảnh AI thực sự:** hậu cảnh `boba_backbar.webp`, bảng đơn crop `order_header.webp`, khung kết quả `finished_preview.webp`, máy rót `tea_dispenser.webp`, các ảnh khay topping đã ánh xạ đúng mã trong v88.17.1.6, cùng các cup mẫu chỉ dùng khi chưa có món (chưa chốt). Không vẽ toàn bộ 28 item mới.
- **Sân quán:** giữ v88.17.1.6, nút vào bếp khi chưa có đơn / đang luyện tập, chỉ quay về sân khi người chơi bấm.

## Kiểm thử đã chạy
- Node: syntax check JS và các bài hồi quy cooking station, settlement, kitchen rules, Menu day 2, day quotas/debt/interest, yard/kitchen, boba mapping.
- Chromium **fixture cô lập**, dựng DOM thực/tên lớp thực + asset thực: 320/390/760px không tràn ngang; tổng chiều cao quầy test khoảng 736/747/586px. Không thể suy ra full game runtime cũng pass vì môi trường browser chặn điều hướng trực tiếp.
- Chromium fixture tương tác: bấm đúng nút item cũ sau khi chuyển DOM (giữ cùng object), bấm ảnh bình rót kích hoạt native `cs20-primary` đúng 1 lần, hộc đường/đá chuyển khỏi stage, layout cũ ẩn. PASS.

## Cần test trên laptop trước nghiệm thu
1. Sao lưu save cũ; giải nén game, chạy qua local server hoặc Cloudflare Pages (để asset load ổn định).
2. Vào quầy trà sữa bậc 1 khi nghỉ ca và khi bán, thử luyện tập không tốn nguyên liệu.
3. Chạm trực tiếp khay topping, cốt trà và size, chạm bình trà rót → dừng rót → canh nhịp → dập nắp → giao đơn.
4. Đảm bảo topping trong ly và khung thành phẩm thống nhất cả loại lẫn lượng; thử rót thêm, mở phiếu đơn, thoát sân.
5. Mở giả lập 320, 390, 430px, thử laptop ngang; thử cả nghề mì cay/xiên để đảm bảo DOM được trả về khi đổi nghề.
6. Kiểm tra Safari/WebKit/touch, nạp save cũ, cổng kiểm thử 9 bậc trước khi đánh dấu hoàn thành.

**Trạng thái:** bản PLAYTEST, không merge `main`, chưa đảm bảo Safari và toàn bộ gameplay thực tế.