# Bỏ Phố Về Quê v87.7.1 — Cốt truyện mở đầu, Mika & tab Kho

**Nền:** v87.7 FULL (đã bao gồm các bản vá ảnh v87.6.1 và Cay Ngọt v87.6.1b).  
**Trạng thái:** Đã xây dựng và kiểm tra tĩnh; chưa xác nhận kiểm thử thao tác hoàn chỉnh trên điện thoại/Chrome thực.

## Nội dung thực hiện

1. **Tạo hồ sơ:** Giữ ô tên nhân vật và chibi Nam/Nữ. Ẩn phần nhập tên và đại diện quán khỏi bước này; vẫn dùng các thành phần gốc phía sau để duy trì tương thích hàm tạo tài khoản.
2. **Chương 0:** Ba cảnh ngắn “Tạm biệt phố thị → Chuyến xe về quê → Gặp Mika”; dùng ảnh nhân vật và Mika hiện có, không tạo ảnh mới. Có thể bỏ qua và xem lại trong Mika.
3. **Chọn nghề:** Giữ 3 nghề gốc; Mika giới thiệu từng nghề; chuyển đặt tên quán và chọn hình đại diện xuống **sau** lựa chọn nghề. Chỉ khóa nghề sau khi xác nhận như bản cũ.
4. **Hướng dẫn ngày đầu:** Khi một lượt chơi mới được xác nhận, Mika hỏi “có cần hướng dẫn không” với 3 phương án. Có 12 bước từ quầy chế biến, mở quán, giao món, điện thoại, Kho, Vườn, Chuồng, Làng, nhiệm vụ NPC, nâng bậc, kỹ năng, Soppi. Bước nào có trạng thái quan sát được sẽ tự hoàn thành khi game xác nhận; bước xem quầy do người chơi bấm “Đã xem”. Có “Chỉ vị trí”, “Bỏ qua”, “Tạm dừng” và “Tiếp tục” trong Mika.
5. **Tab lọc Kho:** Chỉ thay cách trình bày của 5 nút lọc **bên trong Kho** thành viên bo tròn tông kem; **không sửa 6 tab điều hướng Quán/Vườn/Chuồng/Làng/Kho/Đánh giá**.
6. **Save:** Bổ sung nhóm `gameState.v8771Onboarding` và `gameState.v8771Guide` vào cùng save theo hồ sơ hiện có; không thay ID, khóa save, cấu trúc kho hay quy tắc kinh tế. Save đã bắt đầu **không bị ép xem lại mở đầu**. Save đang ở màn chọn nghề và được tạo từ v87.7.1 có thể tiếp tục chương 0.

## Tệp cần cập nhật GitHub

- `index.html` (thêm tham chiếu CSS/JS và biểu tượng lọc Kho).
- `css/v8771-onboarding.css` (chỉ CSS onboarding & 5 nút Kho).
- `js/v8771-onboarding.js` (truyện và trợ lý theo tiến trình).

`js/game.js`, `js/v877-warehouse-mika.js`, tất cả ảnh, công thức và dữ liệu gameplay gốc **không đổi byte**.

## Kiểm thử / điều kiện nghiệm thu

- [ ] Tạo nhân vật mới: tên/chibi vẫn lưu, không hỏi tên quán ở màn tài khoản.
- [ ] Cảnh 1/2/3 hiện đúng; nhấn tiếp và bỏ qua hoạt động; có hình nhân vật và Mika.
- [ ] Chọn Trà Sữa/Mì Cay/Xiên Que, tên quán, đại diện. Tất cả lưu đúng sau khi F5 → Tiếp tục.
- [ ] Mika hỏi hướng dẫn **một lần** sau khi xác nhận ngày đầu; 3 lựa chọn lưu đúng.
- [ ] “Có”: xem quầy, mở quán thật, giao đơn thật; mục tiêu chỉ tự hoàn thành sau khi trạng thái game thay đổi.
- [ ] Điều hướng Kho/Vườn/Chuồng/Làng/Điện thoại/Nâng bậc hoạt động không tiêu Xu.
- [ ] Mika ở góc dưới hiện khi đang chơi; có thể mở lại và xem lại truyện.
- [ ] Kho có 5 nút bo tròn, không chồng/giãn vô lý trên Android và PC; thanh tab trên giữ nguyên.
- [ ] Save cũ từ v87.7 vẫn tiếp tục vào game không bị xem Chương 0.
- [ ] Tiền, kho, công thức, nhân viên, NPC, phá sản không thay đổi do bản vá.
- [ ] Không nhận 2 lần Xu, vật phẩm hay phần thưởng khi F5 hoặc bỏ qua hướng dẫn.

## Giới hạn và cảnh báo

Mika v87.7.1 là trợ lý theo quy tắc, không kết nối API AI. Ảnh trong Chương 0 sử dụng chân dung có sẵn kết hợp bối cảnh CSS/emoji, **chưa có hoạt cảnh nhân vật thật sự kéo vali**. Trang chạy thử toàn game bằng trình duyệt tự động trong môi trường dựng bản bị chặn với `ERR_BLOCKED_BY_ADMINISTRATOR`; do đó cần kiểm tra trên Chrome/Android của bạn trước khi coi bản này hoàn toàn ổn định.

Nếu repository GitHub có cập nhật khác ngoài gói v87.7 trong lúc dựng, nên so sánh `index.html` trước khi ghi đè. Khi cập nhật và F5, hãy kiểm tra vẫn truy cập được save cũ.
