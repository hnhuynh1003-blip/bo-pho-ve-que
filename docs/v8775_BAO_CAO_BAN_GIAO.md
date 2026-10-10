# BỎ PHỐ VỀ QUÊ — v87.7.5 · THỊ TRẤN OS REBORN

**Trạng thái:** bản triển khai để người chơi **kiểm thử**, chưa nghiệm thu trên GitHub Pages/máy Android/iOS thực tế.  
**Nền:** v87.7.4 Header Cute Premium; giữ 6 tab Main Game và tài nguyên cũ.

## I. Đã triển khai thực tế

1. **Thông báo ngay Home:** hai tin chưa đọc gần nhất (hoặc tin gần đây), tự thu gọn; nút xem tất cả, mở inbox hiện có. Kéo xuống từ vùng giới thiệu phía trên để mở toàn bộ. Đồng bộ `gameState.notifications` với Header và số chưa đọc; mở inbox không tự đánh dấu toàn bộ đã đọc. Thêm Cài đặt → Thông báo (chỉ bật/tắt hiển thị trên Home; không xóa sự kiện).
2. **Tái tổ chức 12 biểu tượng:** từ 9 app Home hiện tại, gỡ icon Phát Triển, thêm Nhân Vật, Xây Quán, Nhân Sự, Nhật Ký. Dock: Ship, Soppi, Nhật Ký. Home: 9 app còn lại. Sổ Hiệu Ứng vẫn là màn phụ. Xóa dấu chuyển trang giả; thêm app sau này hiển thị tiếp trong khu cuộn.
3. **Nhân Vật:** ba thẻ Chibi/Kỹ Năng/Hành Trình. Chibi Nam và Nữ có ảnh gốc, đổi miễn phí và lưu `gameState.playerChibi`. Có registry để bổ sung Chibi khi **đã có tài nguyên và cơ chế mở khóa**; chưa cấp nhân vật chưa được thiết kế. Kỹ Năng dùng panel/hàm SP cũ. Hành Trình dẫn đến quản lý hồ sơ và quy trình đổi nghề gốc, cảnh báo nguy cơ reset.
4. **Xây Quán:** nhận 9 bậc quán gốc, giá trọn gói không tăng so với bản cũ. Thăng bậc qua **thuê đội thợ**: xác nhận tiền trước, thi công **1 ngày cho bậc 2–3, 2 ngày cho bậc 4–6, 3 ngày cho bậc 7–9**, ngày trong game. Chỉ khánh thành khi người chơi chủ động `Qua Ngày` đủ ngày; lúc đó tăng bậc, +1 SP, cấp quyền lợi qua hàm gốc và thông báo một lần. Một công trình mỗi lần. Chưa có hủy hay hoàn tiền sau khi ký. Nhân viên quán không bị chiếm chỗ. Thẻ Trang Trí của Phát Triển cũ chuyển vào Xây Quán.
5. **Nhân Sự:** gom thẻ nhân viên hiện có vào app độc lập, dùng nguyên staff/staffHR/hàm hiện tại.
6. **Nhật Ký Khởi Nghiệp:** tổng hợp tiến độ **đọc-only** có thật từ ca Quán, lịch gặp NPC, dấu ấn hoạt động thị trấn, lễ hội, Vườn/Chuồng, Xây Quán, Mika. Liên kết tới đúng khu vực/app. Không tự nhận hoặc cấp lại thưởng. Các nhiệm vụ tương tác gốc chưa được chuyển/xóa (cần nghiệm thu từng loại trước khi loại bảng trùng).
7. **App cũ:** nhãn/đường dẫn giúp phân biệt chức năng Ship/Soppi/Cư Dân/Tiện Ích/Game/Đấu Giá/Ví; tăng vùng bấm cho một số thao tác mobile. Sửa duyệt ngược khi xóa đồng thời nhiều đơn Ship/Soppi, tránh bỏ qua đơn liên tiếp. Chính sách lãi vay **giữ nguyên để không tự thay đổi nợ save cũ**; có cảnh báo rõ trong app.
8. **Mika/Chrome:** sửa bài hướng dẫn từ app Phát Triển cũ sang Xây Quán/Nhân Vật. Ẩn 2 menu Tăng Bậc và Đổi Nghề trên Header; có thể vào Xây Quán bằng huy hiệu Bậc và vào Hành Trình để đổi nghề.

## II. Dữ liệu và tương thích

- Không đổi format ID hồ sơ, NPC, vật phẩm và nghề.
- Save cũ nhận `shopConstruction:null` làm mặc định. Không tự khởi động xây dựng hoặc tự trừ Xu khi mở save.
- Khi xây mới, save thêm `shopConstruction:{targetStage,startedDay,finishDay,cost}`; xóa sau khi khánh thành; nếu phá sản theo luồng cũ, hủy trạng thái dự án. Không cộng thưởng trong lúc tải save.
- Giữ cơ chế `switchPhoneApp('progress')` bằng adapter chuyển tới Nhân Vật; hàm giao dịch/SP gốc vẫn duy trì.
- Khách và Ship tạm dừng khi điện thoại mở theo cơ chế hiện có. Chưa thay điều kiện ghi nợ, tiền đặt cọc đấu giá hay vòng đời giao Soppi.

## III. Đã kiểm tra

- `node --check`: game.js, v8775-os-reborn.js, v8771-onboarding.js (đạt).
- Chromium với HTML **fixture cách ly** ở 320, 375, 390, 430px: có đúng 12 app Home/Dock và không trùng icon, mở các app mới và cũ, các thẻ Kỹ năng/Trang trí hoạt động, đổi Chibi và cập nhật một tin đã đọc không ném lỗi JS (đạt).
- Node thử nghiệm logic thi công: xác nhận trừ giá một lần, không tăng bậc trước khi xong, không lặp +1 SP khi kiểm tra ngày lại (đạt).
- Mã HTML/CSS/JS và đường dẫn ảnh nhân vật đã đối chiếu tệp có trong thư mục dự án (đạt).

### Chưa kiểm chứng

- Toàn bộ giao diện trực quan trong trình duyệt thật với đầy đủ hệ thống game trên máy thật (môi trường kiểm thử ở đây chặn mở URL file/localhost). Chưa chứng minh không chồng thẻ ở từng máy.
- Nhiều giờ chơi ở tất cả nghề, save cũ lâu năm, từng loại quest NPC/lễ hội/nhân sự, mất điện/thoát tab trong quá trình thi công.
- Chức năng đổi nghề lâu dài, bảo toàn di sản, nhiều hồ sơ khác nghề. **Nút gốc vẫn reset phần lớn tiến trình.**

## IV. Hạng mục giữ lại để không thất lạc

| Hạng mục | Trạng thái | Lý do |
|---|---|---|
| Đổi nghề có quyết toán và giữ di sản, cứu quán | CHƯA TRIỂN KHAI | Cần hồ sơ cân bằng/phá sản riêng |
| Chibi mới ngoài Nam/Nữ và điều kiện mở khóa | CHƯA TRIỂN KHAI | Chưa có artwork/điều kiện nhân vật được duyệt |
| Nhận/hoàn thành mọi nhiệm vụ ngay Nhật Ký, bỏ bảng nhiệm vụ trùng ở tất cả map | MỘT PHẦN | Hiện chỉ tổng hợp dữ liệu; cần rà soát từng NPC/lễ hội để không mất nút nhận thưởng |
| Thay chính sách lãi vay hiện tại (phí 15%, lãi 5% và cộng dồn nợ) | CHỜ CHỐT | Không tự sửa công nợ của người chơi |
| Trang chuyển màn Home thực sự, tìm kiếm app, ghim dock | CHƯA TRIỂN KHAI | Lưới 9 + dock 3 đủ cho lần này; mở rộng cần quyết định UX |
| Trang bị/hiệu ứng và tài chính UI hoàn toàn mới | MỘT PHẦN | Chỉnh hướng dẫn và vùng bấm, chưa viết lại lõi hoặc toàn bộ layout |
| Kiểm thử hồi quy thật trên GitHub Pages Android/iOS | CHỜ NGƯỜI CHƠI | Chỉ có thử nghiệm mô phỏng riêng |

## V. Kịch bản nghiệm thu trên game thật

1. Sao lưu save đang chơi, mở game, nhập hồ sơ cũ và xem chỉ số tiền, SP, Kho, nghề, nhân viên trước/sau.
2. Mở Điện thoại: thấy **thẻ Thông báo ngay Home** mà không mở Cài đặt; bấm tin mới và kiểm tra đồng bộ chuông ngoài Main.
3. Kiểm tra **9 icon Home + 3 icon dock**; từng app mở đúng, phím Home/Quay lại hoạt động.
4. Nhân Vật → Chibi: Nam → Nữ → Nam; kiểm tra ngoài Làng và sau reload; nghề, SP, Xu không đổi.
5. Nhân Vật → Kỹ Năng: cộng SP, kiểm tra chỉ trừ một lần, không mất khi tải lại.
6. Xây Quán: đủ điều kiện, thuê thợ, trừ tiền một lần; chưa lên bậc cho tới khi qua đủ ngày; tăng bậc/+1 SP đúng một lần; reload giữa thời gian xây.
7. Nhân Sự: có thể tuyển, trả lương, theo dõi morale, xem lại sau reload.
8. Nhật Ký: thống kê thay đổi khi làm đơn, gặp NPC, hoàn thành một lễ hội; không tự nhân thưởng.
9. Ship/Soppi: thử nhiều đơn cùng hết hạn/cùng giao; không sót đơn, không nhân đôi tồn kho.
10. Kiểm tra hai thanh fixed ở màn hình hẹp và cảnh chế biến thật, không chặn thao tác.
11. Thử Cài Đặt → Thông báo; tắt thẻ Home nhưng giữ thông báo Main/inbox.
12. GitHub Pages hard reload; game không báo lỗi JS ở màn hình Home, Quán, Vườn, Chuồng, Kho.
