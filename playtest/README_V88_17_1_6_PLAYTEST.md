# Bỏ Phố Về Quê v88.17.1.6 — Thiết kế lại bố cục quầy trà sữa theo không gian

**Trạng thái:** Bản thử nghiệm, chưa nghiệm thu thực tế trên laptop/máy điện thoại; chưa merge vào main.

## Lý do
Ảnh AI Batch 1.4 đẹp nhưng các lớp CSS cũ v88-compact/cafe/cute ép quầy thành hai cột nhỏ. Ở bản v88.17.1.5 người chơi thấy chữ rơi thành hàng dọc, máy trà bé, khay nguyên liệu chỉ vài chục pixel. Khi hủy đơn, hệ thống còn tự chuyển ra sân quán.

## Bố cục mới
- **Sân quán**: giữ ảnh sân, tỉ lệ dọc 4:3 trên điện thoại; nút **Vào quầy pha chế** hiện sau khi bắt đầu hồ sơ, ngay cả lúc chưa mở quán hay không có khách.
- **Vào quầy**: full-width phiếu đơn và giá, có thể mở chi tiết *nằm trong* vùng giao diện.
- **Khu pha chế**: khu ly tương tác riêng, rộng và cao ~420–550px; AI `tea_dispenser.webp`, `milk_pitcher.webp`, `cup_platform.webp` được đặt có vai trò rõ ràng. Các sprite này chỉ là đạo cụ; ly đang chế biến, canh nhịp, trạng thái thực của game vẫn do native cooking code điều khiển.
- **Nguyên liệu**: khay 2 hàng, 2 cột ở 320–390px, 3 cột từ 420px và 4 cột trên viewport rộng; thêm item bằng **cuộn ngang**; item 138px cao, ảnh ~84px, nhãn ~12px. Không nhét 5 item mỗi hàng như bản trước.
- **Ly trống AI thật**: nút chọn size M/L/XL dùng ảnh ly trong suốt theo tỷ lệ kích cỡ (XL hiện dùng chung silhouette với L cho đến khi duyệt art riêng).
- **Topping AI thật**: 8 sprite cắt tách từ sheet AI Batch 1.4, gắn đúng ID hiện có: `topping_boba`, `topping_white_boba`, `topping_peach`, `topping_jelly`, `topping_pudding`, `topping_crystal`, `topping_grass_jelly`, `topping_aloe`. Các topping khác dùng nguyên ảnh đang có để không bị lẫn món. `topping_jelly` (thạch chung) và `topping_grass_jelly` (thạch đen) là ứng viên minh họa, cần kiểm duyệt sắc thái cuối.
- **Nút thao tác**: tối thiểu 58px cao, đọc được, không đè lên nguyên liệu.
- **Hủy đơn / giao xong / thất bại / thoát luyện tập**: ở lại quầy; chỉ nút **Trở về sân quán** mới thoát về sân.
- **Khi chưa có khách**: vẫn vào quầy được, thấy khu chuẩn bị và nút **Tập chế biến**, không có khách giả và không tự tạo tiền.

## Ràng buộc giữ nguyên
- Không thay ID vật phẩm/NPC/nghề.
- Không đổi công thức, giá, Xu, kho, hạch toán, nhân viên, save, lịch khách hoặc kết quả chế biến.
- Không dùng nút giả AI để trả tiền hoặc giao món.
- Chưa chuyển giao diện mì cay, xiên nướng sang bố cục mới; cần bản riêng và kiểm thử 9 bậc.
- Không đưa ảnh toàn cảnh quán thứ hai vào khu bếp. Không thêm tên quán lớn lên sân.

## Kiểm thử hiện tại
- 12 nhóm test Node: PASS (nhưng không thay cho chạy game thật).
- Playwright mô phỏng DOM thật của `v88-unified-shop.js`: vào bếp không cần có khách, hủy đơn không tự thoát, thoát luyện tập vẫn ở bếp: PASS.
- Chromium fixture HTML/CSS + asset thật: 320, 360, 390, 430, 760px không tràn ngang, mở sổ đơn cũng không tràn; 390px ảnh mô phỏng hiển thị item 2×2 đủ lớn. Đây KHÔNG PHẢI screenshot gameplay thực tế.
- Chưa kiểm được toàn bộ game trên Safari/WebKit, các trường hợp save cũ, tương tác cảm ứng thực hoặc quy trình bán hàng end-to-end trong browser tại môi trường hiện tại.

## Test trên laptop
1. Giải nén ZIP và mở `index.html` qua máy chủ local hoặc Cloudflare Pages; lưu dự phòng save trước.
2. Vào quầy khi chưa mở quán, thử luyện tập; sau đó mở quán và chế biến đơn bình thường.
3. Thử nhấn topping AI, cuộn sang trang, đổi nhóm, đổi size, điều chỉnh đường/đá, canh nhịp và giao món.
4. Đơn kết thúc/hủy vẫn ở quầy; chỉ nhấn **Trở về sân quán** mới rời bếp.
5. Kiểm tra ở cửa sổ thu hẹp 390px và trên laptop; phản ánh khu vực bị tràn, nút không bấm được hoặc món hiển thị sai.