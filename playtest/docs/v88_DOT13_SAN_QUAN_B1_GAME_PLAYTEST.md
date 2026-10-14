# Bỏ Phố Về Quê v88.12.1 — Sân Quán B1 hiển thị trong game (QA, CHƯA DUYỆT ART)

## Mục đích
Bản `BPVQ_v88_GAME_TEST_DRAFT` trước chỉ đóng gói lại game v88 cũ, **không hiển thị B1 Draft5 trên tab Quán**; người dùng xác nhận lỗi kỳ vọng bằng ảnh chụp. Đã sửa bằng một tính năng thấy trực tiếp khi chơi, không yêu cầu tìm vào app điện thoại.

## Thay đổi thực tế
- `index.html`: có thẻ **Sân Quán B1**, mở sẵn ngay **bên dưới khung khách hàng** tại `#tab-shop`, phía trước hội thi. Hiển thị `ĐANG THỬ` và thông báo QA. Title `v88.12.1` để phân biệt bản cũ.
- `js/v88-live-scene-qa.js`: sáu nút Sơn Màu xem ảnh thật, biển tên DOM lấy từ `gameState.shopName`, lớp marker 5 ô decor + S1, nút dẫn tới Xây Quán → Bố trí, thu gọn. Có guard theo nghề; **không tự đổi nghề**, Mì Cay/Xiên Que không dùng hình Trà Sữa để giả cảnh của mình.
- `css/v88-live-scene-qa.css`: bố cục 4:3 responsive, không đè lên khung Mở Quán; màu sắc và phím rõ trên mobile.
- `assets/images/v88/qa/boba-b1-*.webp`: **6 ảnh B1 Draft 5 độc lập**, mỗi ảnh 1200×900; hình thực từ ZIP QA, **không cắt infographic**. Đặt trong thư mục `qa`, tuyệt đối không ở `shops`.
- `tests/test_v88_live_scene_qa.mjs`: kiểm tra thẻ ở tab Quán, 6 file WebP thật, 6 màu, biển tên, 5 marker + S1, guard nghề, **không mutate gameState**, và `isReady:false` của art registry.

## Thử nghiệm
- Local: cú pháp JS và unit test Node PASS.
- Chromium headless: thành phần tương tác tại 320, 375, 390, 430 và 1365 px, không tràn ngang, tên quán không thực thi HTML. Thử luồng game trong trang thật bằng mô phỏng localStorage của trình duyệt (môi trường cấm HTTP/file navigation); xác nhận ảnh tải 1200×900 và thẻ xuất hiện dưới khung khách trên màn 390px.
- GitHub CI: workflow `.github/workflows/phone-os-v88.yml` chạy lại test mới cùng các bài cũ. Không tuyên bố kiểm thử iOS/Android thật.

## Dữ liệu và giới hạn
- Xem 6 màu dùng một khóa QA `sessionStorage: BPVQ_V88_B1_SCENE_QA_COLOR_ONLY_v1`; không đổi coins, SP, nguyên liệu, nhân viên, ca, `gameState.decorations`, `decorV88`, hay save cũ.
- S1 + các marker là **tọa độ dự thảo** trên ảnh QA; người dùng vẫn mua/đặt đồ qua logic thật của Kho Nội Thất, **không biến icon marker thành sprite production**.
- `BPVQShopScenesV88` giữ 27/27 scene đang khóa; `approved:false`; 0/27 ảnh production. B1 Draft 5 chưa qua clean-pass final.
- Bản ZIP chơi thử phân phối: `BPVQ_v88_12_1_SAN_QUAN_B1_GAME_TEST.zip` đã lưu vào Thư viện cùng Project; kiểm tra ZIP CRC và 382 file PASS. SHA256: `fb4f3e3c720e7880acc866ce19b13e3f03e79834d049dd07aa4fb7fac9b27cce`.
- PR #1 vẫn Draft, không merge `main`.

## Lần làm tiếp
Tập trung sửa rõ rệt phần chơi theo từng lô (ví dụ ngoại cảnh B2/B3, mua decor thật/sprite, NPC), không đóng gói lại bản cũ rồi gọi là bản mới. Khi hình B1 final được người dùng duyệt mỹ thuật, mới đề xuất chuyển từ `qa` sang `shops` sau test art gate và migration.
