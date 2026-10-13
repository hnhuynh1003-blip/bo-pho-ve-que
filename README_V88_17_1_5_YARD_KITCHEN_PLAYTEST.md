# BPVQ v88.17.1.5 — Sân quán để chill / bếp riêng để chế biến

## Vì sao đổi?
Quầy trước bị lặp hai lần: **ảnh sân quán thật** và **cảnh backbar đầy đủ** ngay phía trên bếp. Người chơi phải xem cả hai trên màn hình đứng; chi tiết đơn hàng còn có nguy cơ tràn ngang.

## Trải nghiệm mới
- **Sân quán** là màn hình chính để xem phong cảnh, NPC, đồ trang trí. Chữ tên quán đè trực tiếp lên ảnh được ẩn.
- Khi khách đang đặt đơn, chạm nút **🧋 Vào quầy pha chế** hoặc vùng cảnh sân quán để mở **khu bếp riêng**.
- Trong bếp, **← Trở về sân quán** đưa người chơi về cảnh sân mà không dọn/khởi tạo lại món, không chạm save hoặc tiền.
- Khi khách hết đơn, trở về sân tự động. Người chơi vẫn phải hoàn thành đơn trong thời gian quy định: di chuyển giao diện **không tạm dừng thời gian chờ của khách**.
- Chế độ luyện tập có nút cũ và có thể quay về sân; tiến trình tập không bị thay đổi chỉ do chuyển màn hình.

## Các thay đổi
1. `js/v88-unified-shop.js`: UI scene/kitchen toggle, giữ nguyên bridge, không có ledger mới.
2. `index.html`: bỏ cảnh `cp171-backbar` + dải ba nhãn trang trí thừa; thêm CSS mới; chèn **hai đạo cụ AI trong suốt** vào khu pha chế làm vật trang trí (không là nút giả).
3. `css/v88-17-1-5-yard-kitchen.css`: tập trung bố cục bếp, hộc topping vẫn tương tác, chi tiết đơn mở trong chiều ngang hiện có, layout mobile/desktop.
4. `assets/images/v88/cute-premium/tea_dispenser.webp` và `cup_platform.webp`: trích từ Batch 1.4 đã QA alpha.
5. `tests/test_yard_kitchen_focus_v88.mjs`: contract bảo vệ chuyển chế độ và các ID gốc.

## Kiểm thử đã chạy
- 9 nhóm test Node: ngày/hạn ngạch, lãi, rollover, Menu, thanh toán thật, quầy bếp, giao diện unified, canh nhịp và nguyên liệu: **PASS**.
- Playwright Chromium **mô phỏng độc lập**: click sân vào bếp, click trở về, hết đơn quay sân, luyện tập vẫn giữ trạng thái: **PASS**. Không dùng game thật qua localhost vì môi trường chặn.
- CSS + cấu trúc HTML thực tế (được chuyển DOM như mã game): 320 / 360 / 390 / 430 / 760px không tràn ngang, kể cả mở phiếu chi tiết đơn. Đây là **kiểm thử bố cục**, không phải chạy toàn bộ ứng dụng.

## Chưa nghiệm thu
- Chưa test thao tác chế biến và giao món trực tiếp trên trình duyệt laptop/điện thoại của người chơi.
- Chưa test Safari/WebKit, full màn hình laptop khi đủ hệ thống HUD, stage 1–9.
- Không thay mới toàn bộ 28 ảnh trà sữa; chỉ tích hợp hai đạo cụ đã đạt alpha.
- Hai nghề mì cay/xiên nướng sử dụng nút chuyển chế độ chung nhưng giữ skin bếp cũ. Cần kiểm thử từng nghề khi đến gói nâng cấp.
- Giao diện screenshot có thể chứa dữ liệu đơn giả minh họa: KHÔNG coi là ảnh chụp gameplay thật.

**Tuyệt đối không gộp với main/Work nếu chưa nghiệm thu. Sao lưu save người chơi trước khi thử ZIP.**