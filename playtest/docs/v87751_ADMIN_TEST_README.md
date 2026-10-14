# Bỏ Phố Về Quê — Admin Test Mode v87.7.5.1

**Nền:** v87.7.5 Thị Trấn OS Reborn. **Loại bản:** thử nghiệm nhà phát triển, không phải khóa bảo mật máy chủ.

## Sử dụng

1. Đang chơi trong một hồ sơ thường đã bắt đầu nghề. Vào **Điện thoại → Cài đặt → Về Game**.
2. Nhập mã `VEQUE-ADMIN-2026` và chọn **Kích hoạt Phòng Thử Nghiệm**.
3. Game lưu hồ sơ thường, tạo **hồ sơ TEST độc lập** (tiền tố `test_`), sao chép toàn bộ tiến trình hiện tại rồi tự chuyển vào TEST.
4. Mở điện thoại → Home → biểu tượng **🧪 Thử nghiệm**. Kiểm tra các chức năng cần thiết.
5. Bấm **↩ Quay về hồ sơ chính**, hoặc **⟲ Khôi phục TEST lúc mới sao chép**. Hồ sơ TEST có thể mở lại từ màn Tài Khoản; nếu đã đóng trình duyệt, nhập lại mã trong Về Game để hiển thị app Test.

## Công cụ và quy tắc

| Công cụ | Phạm vi test | Điều không thực hiện |
|---|---|---|
| Level 1–100 | Đặt cấp để thử khóa nội dung | Không tự cấp SP hay phần thưởng lên cấp |
| SP 0–999 | Đặt SP để thử cây kỹ năng | Không tự nâng các nút kỹ năng |
| Xu 0–5.000.000 | Đặt vốn test | Không chuyển Xu sang save gốc |
| Bậc 1–9 | Mô phỏng bậc quán để thử các hệ thống | Không trả phí thuê thợ, không cấp +1 SP, không tạo phần thưởng xây dựng |
| Đánh giá 5 sao | Mô phỏng đủ sao | Không tạo đánh giá khách hàng |
| 30 đơn/3 nghề | Đạt điều kiện số đơn để mở kỹ năng nghề | Không thực hiện giao món và không tạo doanh thu |
| Công thức/nguyên liệu | Bỏ chặn điều kiện trong công thức/mua nguyên liệu của nghề, kể cả mảnh và NPC | Không tạo nội dung/công thức chưa có mã nguồn |
| Cấp 99 vật phẩm | Ít nhất 99 cho tất cả item hiện có trong từ điển | Không cấp item chưa được xây dựng |
| Map Làng | Bỏ điều kiện cấp/bậc để vào vùng đang tồn tại | Không tự hoàn thành tuyến cốt truyện NPC hay nhiệm vụ |
| Vườn/Chuồng | Mở tất cả ô đất và vật nuôi hiện có | Không tự nhận thưởng thu hoạch |
| Nghề | Chuyển thử Trà Sữa, Mì Cay, Xiên Que | Không chuyển nghề hồ sơ chính; đơn TEST đang làm bị hủy |
| Ngày | Mở xác nhận Qua Ngày nguyên bản | Không cộng ngày bỏ qua chi phí, biến cố, thi công |

## Bảo vệ save

- Khi tạo sandbox, **phải lưu được save nguồn thì mới cho sao chép**.
- Sandbox có `adminTest:true` trong registry và `adminSandbox.id` khớp mã hồ sơ `test_` trong dữ liệu. Các hàm test chỉ sửa khi **cả hai điều kiện cùng đúng**.
- Hồ sơ thường không mang những dấu đó, nên lệnh test bị từ chối.
- Bản sao ban đầu được lưu riêng để khôi phục TEST. Bản TEST có thể tiếp tục từ màn Tài Khoản như hồ sơ khác.
- Xóa hồ sơ TEST qua danh sách tài khoản sẽ xóa cả bản sao gốc dùng để reset.
- Chưa có cơ chế bảo vệ quyền admin phía máy chủ: mã nằm trong mã JavaScript có thể đọc được trên GitHub Pages. **Không dùng mã này để bảo vệ tiền, điểm, bảng xếp hạng có máy chủ hoặc dữ liệu nhạy cảm.**
- Đừng nhập mã xuất từ hồ sơ TEST vào hồ sơ chơi chính nếu muốn giữ cuộc chơi bình thường.

## Kiểm thử đã làm

- `node --check` cho file `js/game.js` và `js/v87751-admin-test.js`.
- Chromium mô phỏng với markup game và toàn bộ scripts, dùng bộ nhớ giả lập độc lập: tạo nhân vật, nhập sai/đúng mã, tạo sandbox, Lv.100, Xu test, inventory, mở công thức, map, đất, vật nuôi, reset, trở về nguồn, kiểm tra nguồn không đổi và chặn lệnh ở nguồn. **Đạt**, không có lỗi JavaScript từ luồng thử nghiệm.
- **Chưa nghiệm thu:** mobile thật, toàn bộ cốt truyện NPC, mọi nghề theo một phiên chơi hoàn chỉnh, GitHub Pages đã deploy và lưu trên trình duyệt thật.

## Cài qua GitHub Desktop

Đã có repo **v87.7.5** trong máy: dùng ZIP **PATCH**. Giải nén ra ngoài rồi mở thư mục phiên bản, chép các mục `index.html`, `css/`, `js/`, `docs/` vào **gốc thư mục repo**; cho phép gộp thư mục và thay file trùng. Tránh `css/css` hoặc `js/js`.

Trước khi chép: mở GitHub Desktop và Fetch/Pull mới nhất. Sau khi chép: xem tab Changes → Commit `v87.7.5.1 - Admin Test Sandbox` → Push origin nếu muốn dùng trên GitHub Pages.

**Khuyến nghị:** Nếu bản public cho nhiều người chơi, nên giữ Admin Test Mode ở nhánh riêng `dev-admin` thay vì đưa thẳng lên `main`. PIN ở front-end chỉ có giá trị thuận tiện.

## Vấn đề chờ phát triển

- Chibi mới hiện vẫn phải được thiết kế và lập trình trước; hai Chibi Nam/Nữ cũ đã có sẵn.
- Tuyến NPC có thể phụ thuộc cờ truyện độc lập với điều kiện Lv/bậc, chưa có nút bật toàn bộ cốt truyện NPC (tránh phát thưởng trùng khi mở cờ truyện tùy tiện).
- Vận Mệnh, di sản, phá sản thông minh, công thức và bản đồ mới trong roadmap **chưa được tạo** sẽ được thêm vào công cụ test khi phát triển thật.
