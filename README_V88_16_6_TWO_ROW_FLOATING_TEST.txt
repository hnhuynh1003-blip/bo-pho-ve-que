BỎ PHỐ VỀ QUÊ — v88.16.6 / KỆ2HÀNG & NÚT NỔI CŨ

Theo chỉnh sửa ngày13/10/2026:
- Kệ nguyên liệu2hàng,5cột trong khung: tối đa10món cùng lúc. Cuộn ngang/vuốt/mũi tên để xem các cột tiếp theo. Nhóm có ít hơn10món giữ số món thật, không thêm đồ giả. Toàn catalog, stock, khóa truyện và số phần giữ nguyên.
- Khay160px cố định khi nghỉ/chờ/có khách, kích thước món78px cao, chiều rộng theo5cột. Cấp cay8mức được bố trí2hàng trong cùng vùng.
- Điện thoại/Mika dùng đúng nút nổi native cũ, vị trí và hình dạng như các tab khác. Bỏ hai nút phụ trong sân; giữ native onboarding visibility. Điện thoại vẫn dừng khách/canh kim, Mika mở hướng dẫn cũ.
- Giữ quầy gỗ liền/màu kem-xanh, thông báo cạnh món, khoảng cách header2px, đơn/NPC trong sân và các chuyển động nhẹ16.5. Không sửa js/game.js, tip/giá/kho/save/nghề/ca/ngày/ID cũ.

QA:320/390/430/1366px,3nghề; kệ2hàng và tối đa10món, touchtarget>=44px, scroll/chọn/bớt siro native, mọi cấp cay không clip.40lượt khách/chờ không nhảy/không dựng SVG; luyện tập3nghề giữ tiền/kho. Nút nổi có cùng vị trí ở Quán và Vườn, cố định khi cuộn; mở được app/hướng dẫn; regression tip/giao2lần và kho theo phần. CI toàn repo Chromium/WebKit.
PR Draft, chưa merge main; chưa QA Android/iPhone thật.
