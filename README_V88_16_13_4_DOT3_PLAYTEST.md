# Bỏ Phố Về Quê v88.16.13.4 — Đợt 3, bản kiểm thử

Bản nền v88.16.13.3, tích hợp lịch khách và ship hữu hạn, lưu trạng thái đã phát, dự kiến nhu cầu theo giá, sổ tài chính cuối ngày, công nợ vận hành và màn Sổ Kinh Doanh trong điện thoại.

## Chức năng mới

- **9 bậc quán**: quầy 9 / 11 / 14 / 16 / 19 / 22 / 25 / 29 / 32; ship 2 / 2 / 3 / 4 / 4 / 5 / 6 / 7 / 8 cơ hội/ngày. Số lượt cố định theo bậc khi tạo lịch; tăng bậc giữa ngày không tăng quota cũ.
- Mỗi khách đã gọi ra quầy dùng một lượt. Khách xem giá rồi đi, bỏ đi do chờ, từ chối món hoặc mua đều không được phát lại lượt. Hết lượt vẫn có thể đi Làng, Vườn, Chuồng.
- Một đơn ship được sinh cũng dùng một slot. Pending hết hạn / đóng ca / đã giao vẫn không hoàn slot. Khoa dùng cùng kho đơn, không có luồng phát đơn thứ hai.
- `dailyVisitPlan` schema v1 với seed cố định, trạng thái từng slot, ngày, nghề, hồ sơ, menuVersion. Giá Menu/danh tiếng và hiệu ứng đã có điều chỉnh tỷ lệ khách đặt trong cùng trần. Không đổi lời NPC/cốt truyện.
- `dayLedger` schema v1: quyết toán vận hành (có lương), lãi, phần chưa trả. Nợ lương dùng dữ liệu cũ; nợ vận hành còn thiếu giữ riêng và có nút trả qua `Điện thoại → Sổ Kinh Doanh`. Không tạo thuế mới.
- Khách và ship pending đang hoạt động được snapshot để phục hồi. Đơn đang chuyển tới khách giữ cùng shipmentId sau reload; đánh dấu đã trả tiền một lần.
- Giữ nguyên công thức/topping, Menu active/pending và giá đã chốt ở đơn; không thay mỹ thuật, nghề hoặc NPC.

## Các bước thử trên laptop

1. Tạo **hồ sơ TEST** (hoặc sao lưu save chính). Mở `index.html`, dùng `Điện thoại → Sổ Kinh Doanh` để xem số slot ngày hiện tại.
2. Bán vài đơn hoặc để khách đi, kiểm tra số lượt còn giảm. Đóng/mở điện thoại, quay tab, tải lại: không được có thêm quota.
3. Chờ sinh đơn ship, thử đóng gói và đơn hết hạn; kiểm tra số lượt ship, cả khi bật Khoa tự giao.
4. Sửa giá Menu hôm nay, kiểm tra tỷ lệ cầu/quote; qua ngày mới kiểm tra Menu pending mới áp dụng và số slot được tạo đúng 1 lần.
5. Kiểm tra hết tiền trước khi qua ngày: trong Sổ Kinh Doanh phải có công nợ vận hành nếu chưa thanh toán đủ, nợ lương tiếp tục ở hệ thống nhân viên. Trả khoản nợ vận hành trong Sổ Kinh Doanh, reload bảo toàn số dư.
6. Kiểm tra bậc 1, 4, 9 trong cả ba nghề; dùng save TEST để tránh ảnh hưởng hồ sơ chơi chính.

## Kiểm tra đã chạy

- `node --check` 27 tệp JS: đạt.
- `node tests/test_day_rules_v88.mjs`: đạt 3 nghề × 9 bậc, slot hữu hạn, reset theo ngày, migration, nhu cầu giá, 225 trường hợp phân bổ phí.
- `node tests/test_day_integration_v88.mjs`: đạt migration, lưu quota, chuyển ngày, công nợ, rollback trả nợ, shipment payout một lần.
- Test nền menu/giá topping, settlement native 12 kết quả, mini-game, quy tắc nhịp, Phone OS: đạt.
- Thử **fixture** Sổ Kinh Doanh bằng Chromium ở 320/390/430px: đạt, không tràn ngang.
- Các bài Playwright Node cũ không khởi động vì thiếu package `playwright` trong môi trường; tải nguyên trang game bằng Chromium ở đây bị `ERR_BLOCKED_BY_ADMINISTRATOR`. **Chưa xác minh game end-to-end trên browser, mobile WebKit, laptop thật hoặc stress-save đầy đủ.**

## Giới hạn đã biết / cần xác minh

- Đơn ship đóng gói thủ công giữ cơ chế chi phí nguyên liệu legacy v88.16.13.3; không tự sửa luật kinh tế không có trong duyệt Đợt 3.
- Lãi vay tiếp tục cách hạch toán legacy: hệ thống có thể cộng lãi vào dư nợ ngay cả khi đã trừ Xu. Sổ mới chỉ tách công nợ vận hành và không nhân đôi khoản lãi vốn đã vốn hóa; cần nghiệm thu một phương án quy tắc lãi vay thống nhất trước khi đóng v88 chính thức.
- Migration save cũ giữa ngày chỉ ước tính lượt đã phát từ số đơn thành công; số khách đã từng walkout trong save cũ không có dữ liệu để biết chính xác.
- Nếu browser không ghi save được trong lúc giao ship, sẽ không xác nhận tiền mới; sau khi giải phóng bộ nhớ, cần tải lại để xử lý giao dịch đang chờ.
- Ship/khách còn cần thử thật khi ẩn tab, reload đúng thời điểm giao và trong lúc đóng ca.
- ART-01/DEC-01... và Phố/Gemini vẫn ở backlog v89. Bảng thành phẩm PK-01...PK-05 nằm đợt mỹ thuật riêng.

**Chưa merge main hoặc ghi đè nhánh Work `feat/v88-phone-os-core`.** Bản này là ZIP/source playtest cho Đợt 3, không phải bản phát hành v88 chính thức.
