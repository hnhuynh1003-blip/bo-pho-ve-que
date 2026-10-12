BỎ PHỐ VỀ QUÊ — v88.16.2 QUẦY GỌN & TAB ĐÁY / BẢN THỬ

Nền: v88.16.1, nhánh feat/v88-phone-os-core (6e6037c).

ĐÃ CHỈNH
- Thanh thông tin trên cao 54px; giữ tên quán, ngày, Xu, sao, cấp và bậc.
- Sáu tab khu vực cố định dưới cùng, có khoảng đệm cuối trang và vùng an toàn.
- Một phiếu đơn trên khu pha chế: tên khách, yêu cầu, thời gian, độ khó và ví.
- Nút Mở/Đóng Quán và Tập chế biến nằm ở một hàng riêng phía trên cảnh quán.
- Size ly/thố/khay chuyển lên cạnh món đang pha; giữ đầy đủ lựa chọn và điều kiện khóa.
- Cốt trà chỉ chọn tại khay nguyên liệu; đường/đá ở cạnh ly.
- Topping cao 62px; giữ tên, kho, số phần và phân trang. Nhóm ít món chỉ dùng một hàng.
- Nút pha/giao cao 38px, không che khay nguyên liệu, phân trang hay tab đáy.

BẢO TOÀN
Không đổi ID vật phẩm/NPC, nghề hồ sơ, cấu trúc save, giá, kho hoặc cơ chế giao đơn.
js/game.js chỉ chỉnh cách tính khoảng trống cho tab đáy; không đổi luật gameplay.
Luyện tập vẫn tách khỏi kho/Xu/save. Giao món vẫn do cơ chế gốc xử lý một lần.
Ảnh quán cũ giữ nguyên; B1 vẫn là ảnh QA, không tự duyệt mỹ thuật B1–B9.
Nhánh main chưa merge. Đây là bản để kiểm tra giao diện.

KIỂM TRA
Chromium: 320/390/430px và desktop 1366px; đủ ba nghề.
Kiểm tra tab đáy khi cuộn/đổi khu vực, một phiếu đơn, chọn size, khay nguyên liệu,
phân trang, nút pha không đè khay/tab và luyện tập không trừ kho/Xu.
Regression gốc: topping thêm/bớt, vốn theo số phần, trừ kho đúng số lượng,
giao đơn hai lần bị chặn; 5 kích thước 320/360/375/390/430px.
Chưa kiểm tra trên điện thoại Android/iPhone thật trong phiên này.

CÁCH TEST
1. Giải nén toàn bộ thư mục phiên bản, giữ index.html cùng css/, js/, assets/.
2. Mở bằng máy chủ tĩnh hoặc dùng môi trường bạn đang test game.
3. Để tiếp tục save cũ, giữ cùng trình duyệt và địa chỉ web đang dùng; sao lưu save trước.
   Nếu đổi địa chỉ hoặc trình duyệt thì save cục bộ sẽ không tự xuất hiện.
4. Thử mở quán, chọn size cạnh ly, chọn cốt trà/topping và giao một đơn.
5. Cuộn trang rồi đổi Quán/Vườn/Chuồng/Làng/Kho/Đánh giá: tab phải giữ ở đáy.
6. Khi nghỉ ca, thử Tập chế biến và kiểm tra Xu/kho không thay đổi.
