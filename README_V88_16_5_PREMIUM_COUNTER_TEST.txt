BỎ PHỐ VỀ QUÊ — v88.16.5 / QUẦY LIỀN KHỐI, CUTE PREMIUM

Mở index.html hoặc chạy HTTP như bản trước. Giữ hồ sơ/save cũ.

- Kéo hàng trạng thái/mở quán sát thanh tên quán, khoảng 2px ở bố cục đầu trang; sân và quầy vẫn nối nhau trong cùng khối.
- Thông báo nằm cạnh món đang pha, bỏ dải trống riêng trên nút. Điều hướng nguyên liệu cùng hàng chọn nhóm, bỏ hàng phân trang riêng.
- Kệ nguyên liệu một hàng cuộn ngang bằng vuốt, bàn phím hoặc hai mũi tên. Cốt trà riêng, topping và siro chung kệ. Giữ đủ 9 cốt/15 topping/1 siro cũ, không thêm/xóa item ID; không dùng ô rỗng để lấp kệ. Cấp cay8mức nằm gọn2hàng trong cùng chiều cao kệ.
- Quầy thấp hơn khoảng150px so với16.4. Bỏ viền thẻ lồng nhau: khu pha, giá, kệ, nút là một mặt gỗ liền. Màu nâu gỗ nhạt, kem ngà và xanh lá dịu ăn theo dù/cảnh sân.
- Giữ ảnh NPC và nguyên liệu, prop bình/khay đã có. Thêm dòng rót nhẹ, phản hồi chọn topping và nhún dập nắp bằng nút/SVG hiện có. Không chạy hoạt ảnh liên tục; chế độ giảm chuyển động bỏ nhún/scroll smooth.
- Cơ chế rót/canh kim/dập nắp/tip16.4 giữ nguyên. js/game.js không sửa. Giữ size, đường/đá, giá, tồn kho, unlock, nghề, NPC, ca/ngày và schema save.

QA Chromium: 320/390/430px +desktop,3nghề; sát header nhưng không che nội dung; mọi nguyên liệu còn trên kệ; cuộn/chọn/bớt siro gọi native bridge và không tự trừ kho/cộng tiền. 40lượt đổi khách/chờ giữ chiều cao/DOM/SVG; luyện tập cả3nghề; regression native giao đơn/tip Perfect và Phone/Mika. GitHub CI Chromium/WebKit chạy thêm toàn bộ regression cũ.
PR Draft, chưa merge main; chưa QA Android/iPhone thật. Ảnh quán B1 vẫn QA, không thay trạng thái nghiệm thu shell.
