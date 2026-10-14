# Bỏ Phố Về Quê — Phone OS Core v88 / Đợt 1
**Nền:** v87.8.0.1 · commit `c175bebc93dbd155a451b9da84960ded3f127a81` · **Nhánh:** `feat/v88-phone-os-core`

## Thay đổi đã code (bản thử nghiệm; chưa phát hành)
1. Hợp nhất **9 script** Phone OS theo thứ tự tải cũ vào `js/phone-os-v88.js` và **9 stylesheet** vào `css/phone-os-v88.css`. Các file thành phần cũ vẫn ở repo để đối chiếu/khôi phục, nhưng **không còn được tải** vào trang.
2. `index.html` chỉ tải **một JS** và **một CSS** cho hệ điện thoại, không thêm một bản vá thứ mười. Game core và các module Mika/Kho, nông trại, source ledger vẫn như trước.
3. Một adapter chính cho `window.openSmartPhoneModal`, `window.closeSmartPhoneModal`, `window.switchPhoneApp`. Chuyển bốn wrapper mở điện thoại lịch sử sang hook `BPVQPhoneLifecycle` với sự kiện `open`; `home` và `setting` phục vụ weather/theme/wallpaper.
4. Đưa redirect `progress → character` vào router gốc. Không ghi đè `VillageOS.open` lần nữa.
5. Cập nhật nhãn phiên bản hiển thị để phân biệt bản Preview với main.

## Phạm vi giữ nguyên
- Danh sách và ID ứng dụng, Home hai trang, dock Ship/Soppi/Nhật Ký, icon, hình nền, thông báo, điều hướng cũ, Admin TEST.
- **Không chỉnh `js/game.js`**, không thay tiền, EXP/SP, đơn hàng, Shop Stage, `shopConstruction` 1–3 ngày, kho nguyên liệu, NPC hay keys localStorage. Nút mở/đóng vẫn gọi logic pause/resume gốc.
- **Chưa bổ sung** Kho Nội Thất 24 slot hoặc giao diện Xây Quán mới; đây là đợt ổn định nền trước khi tiếp tục đợt 2.

## Kiểm tra tự động
```sh
node --check js/game.js
node --check js/phone-os-v88.js
node tests/verify_phone_os_v88.mjs
```
Workflow `.github/workflows/phone-os-v88.yml` được thêm để kiểm tra nhánh/PR; xem kết quả Actions trước khi nghiệm thu.

## UAT bắt buộc trên trình duyệt thật
1. Mở/đóng Phone trong ca bán: khách và hẹn khách không chạy trùng hoặc mất hẹn.
2. Mở mọi app trên 2 trang; vuốt ngang, quay lại, dock; alias `switchPhoneApp('progress')`.
3. Thông báo: xem, lọc, đánh dấu một/all, chuông Header và Home đều mở cùng app.
4. Xây Quán: hợp đồng đang thi công không trừ Xu hai lần; không khánh thành khi chỉ reload save.
5. Thay wallpaper/Theme, bật chế độ chữ lớn, tắt hiệu ứng, lưu và reload.
6. Admin TEST không hiện trong hồ sơ bình thường; hồ sơ test độc lập.
7. Xem Kho, Soppi, Nhân Sự, NPC và Nhật Ký.
8. Khung 320/375/390/430px, Android/iOS; không che/chồng hoặc mất kéo cuộn.
9. So sánh save xuất trước/sau: coins, SP, inventory, decorations, profile, shopConstruction bất biến.

**Giới hạn:** Tập trung tái cấu trúc nguồn và vòng đời, chưa chứng minh đã kiểm thử gameplay end-to-end. Các observer được giữ lại ở bước tương thích ban đầu, cần giảm tiếp trên **cùng hệ lõi** sau khi kiểm thử UI, không tạo thêm lớp patch ngoài.
