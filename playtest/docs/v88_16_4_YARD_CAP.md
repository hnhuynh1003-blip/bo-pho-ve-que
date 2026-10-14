# v88.16.4 — Khách trong sân và canh nhịp dập nắp

Người dùng duyệt bố cục sân, dùng lại NPC và tip Perfect 10% tối đa 8 Xu ngày 12/10/2026.

| Phần | Trước | Sau |
| --- | --- | --- |
| Đơn | Phiếu 100px cả nghỉ ca | Một bong bóng trong sân; ẩn khi không có khách |
| Khách | Avatar nhỏ ở phiếu | Hình cũ đi vào cạnh sân 650ms, giữ ID |
| Công cụ | Ẩn nút nổi trong Quán | Điện thoại/Mika 44px tại góc sân, mở hệ thống cũ |
| Hoàn thiện ly | Lắc3lần | Kim 1,8s/chiều; Good32–68, Perfect44–56 |
| Tip biểu diễn | Chưa có | 10% giá bán làm tròn, trần8; thanh toán gốc chỉ trả khi accepted+exact |

Không thêm NPC/công thức/item ID. Dùng VILLAGE_NPC_ART và chibi generic cũ làm mẫu ngoại hình. Khách quầy và NPC làng có ID riêng: không chuyển quan hệ/nhiệm vụ/quyền mở khóa. Không tạo ảnh mới.

Bridge giữ clock và award trong closure, gắn khách/món/chữ ký size/cốt/đường/đá/khẩu phần/giá. Vị trí kim được bridge tính, không nhận tham số điểm UI. Thành công đặt cờ isShaken cũ để validator/công thức hoạt động. Luyện tập có clock riêng, không chạm tiền/kho/save. Kim ngừng khi phonePauseActive/ẩn trang; chỉ có RAF lúc thao tác.

serveDishToCustomer tiêu thụ award một lần sau validator. Chỉ Perfect đúng khách/món và accepted+exact cộng tip; Good/Miss/từ chối/biến tấu không có thưởng thêm. Giá/món đổi và cleanWorkbenchDish hủy phiên; chữ ký bảo vệ chỉnh sửa legacy. Mất khách/hết kiên nhẫn/reload không giữ award. deliver giữ lastServed và kiểm tra kho/trạng thái. Thưởng không nhân bonus, ghi vào dailyStats.tipsRev cũ.

Không migration save, không đổi nghề/giá mặc định/claim/ngày/ca/kho. Tip là mở rộng kinh tế được duyệt. PR Draft, không merge main.

Kiểm thử: test_yard_cap_v88 (4 viewport, tái dùng hình, vị trí, app, Miss/Good/Perfect/trần8, so thanh toán đối chứng không Perfect, giao hai lần, đổi món/khách, reset legacy, từ chối, pause); test_compact_counter_v88 (6 layout/career + luyện tập); test_steady_counter_v88 (40 lượt, <=1px, giữ DOM, zero SVG redraw chờ, luyện tập3nghề). Regression gốc và CI Chromium/WebKit. Chưa QA Android/iPhone thật.
