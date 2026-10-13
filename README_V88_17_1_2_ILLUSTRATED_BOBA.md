# Bỏ Phố Về Quê v88.17.1.2 — Illustrated Boba Kitchen (PLAYTEST)

**Trạng thái:** bản thử đại tu quầy trà sữa, chưa nghiệm thu hoặc merge. Tiếp nối `v88.17.1` ban đầu (chỉ CSS màu sắc, không đạt mức Cute Premium mong muốn).

## Thực sự đã đổi

1. `assets/images/v88/cute-premium/boba-backbar.svg` (SVG tự vẽ phân lớp): kệ trà, bình nguyên liệu, máy pha chibi, cửa sổ, cây, đèn và nhân vật pha chế. Đây là ảnh riêng, **không dùng nguyên một ảnh concept làm nền đè nút**.
2. `index.html`: thêm một lớp minh họa `cp171-backbar` `aria-hidden`, chỉ hiện tại bếp nghề `boba` theo CSS. Nội dung người dùng tương tác vẫn dùng các phần tử native cũ với ID không đổi.
3. `css/v88-17-cute-premium-boba.css`: thiết kế lại bố cục thành góc bếp có phiếu khách được ghim lên tường, bàn pha chế chủ đạo, ly pha có đĩa kê, phiếu đơn nhỏ, kệ topping gỗ 2 tầng thay các khung trắng, bộ nút bấm nổi. Chiều cao bản thử mobile khoảng **642 CSS px** ở 320/390/430px, không tràn ngang trong fixture HTML độc lập.
4. `js/v88-cooking-station.js`: đổi nguồn **hồng trà bị nhiễu hình** từ `057_tea-black_8c43c9fdf1.webp` sang SVG minh họa sạch `tea-black-clean.svg` cùng ID `tea_black`; thêm sticker mèo lên hình SVG ly trà khi người chơi chế biến (giữ nguyên các thuộc tính SVG `data-*` theo gameplay).
5. `tests/test_v881712_illustrated_counter.mjs`: kiểm tra cô lập nghề, 11 ID hiện hữu, tài nguyên, đúng kiểu hiển thị Good/Perfect, không nhân đôi settlement.

## KHÔNG thay đổi

- Save key/profile, nghề của người chơi, công thức 28 món/ID, giá, quote đơn, topping thêm, Xu, Kho, NPC/nhân viên, hạn ngạch khách, nhân viên, kiểm tra doanh thu/chi phí, ngày/đóng ca.
- Không đổi logic minigame, tốc độ/vùng Good/Perfect, mốc 9 bậc quán, sân, Phone OS.
- Mì cay và xiên nướng **chưa thay đổi**; thuộc v88.17.2 và .3.
- Chưa thay toàn bộ 28 ảnh trà sữa hay hoàn thành chuẩn art asset sản xuất.

## Kiểm thử

- `node --check js/v88-cooking-station.js` PASS.
- Test tĩnh mới, cùng các bộ day/quota/interest, Menu, đơn và minigame, native settlement đều PASS cục bộ.
- HTML/CSS mock fixture Playwright headless `page.set_content`: 320/390/430px, không tràn ngang, cao 642px. **Chưa phải kiểm thử game hoàn chỉnh.**
- Hệ thống đang chặn Chromium truy cập localhost bằng `ERR_BLOCKED_BY_ADMINISTRATOR`; WebKit/iOS và game đầy đủ chưa xác nhận. Cần người chơi test laptop và sau đó mobile.

## Cách thử

1. Giữ bản gốc và sao lưu file save. Giải nén ZIP này ra **thư mục khác hoàn toàn**, không chép đè bản đang chơi.
2. Mở `index.html`, hoặc `python -m http.server 8769` trong thư mục game rồi vào `http://localhost:8769` nếu file:// gặp giới hạn trình duyệt.
3. Chọn nghề trà sữa và mở quầy. Xem ảnh bếp/khay/phiếu đơn, chọn ly, trà, topping, đường/đá, rót trà, dập nắp, giao món. Kiểm tra không mất Xu/tồn kho trước khi giao.
4. Kiểm tra chuyển tab, reload save, các nghề mì cay/xiên nướng vẫn bình thường. Xem giao diện ở bậc 1, 4, 9 nếu có profile test, ghi nhận mọi lỗi che nút hoặc ảnh.

**Nghiệm thu cần:** người chơi đồng ý về chất lượng hình ảnh đủ Cute Premium, kiểm chứng bán thành công trên laptop, sau đó kiểm thêm điện thoại. Không merge nhánh gốc trước khi hoàn tất.