# Bỏ Phố Về Quê v87.7.2 — Thị Trấn OS 2.0 & Mobile UX

## Phạm vi đã duyệt

- Mở điện thoại vào Home trước, không vào Ship tự động.
- 8 app cũ (Ship, Soppi, Cư dân, Phát triển, Tiện ích, Game, Ví/Vay, Đấu giá) + Cài đặt. Sổ Hiệu Ứng và chuông thông báo cũ vẫn giữ nguyên.
- Cài đặt: 5 hình nền có sẵn trong assets, âm thanh hiệu ứng, điều chỉnh âm lượng, giảm chuyển động, phóng to chữ trong OS, chế độ Mika, nút lưu và sao chép mã save.
- Cài đặt → Về Game: phiên bản, ghi công tạm thời và các cột mốc phát triển.
- Cấu trúc `VillageOS.registerApp({id,label,icon,onHome,unlocked,render})`, điều hướng Home/Back/Đóng tập trung. `js/v8772-releases.js` là danh mục lịch sử cập nhật.
- Mika: khung mini, hai nút Chỉ mình với/Bỏ qua ở cùng hàng; khoanh nút mục tiêu bằng viền/mũi tên, không bấm thay người chơi. Đã chỉnh bước giao món khoanh nút giao món.
- Mở Quán/Đóng Ca/Qua Ngày: giữ nút gọn và nâng kích thước vùng chạm trên điện thoại, giữ xác nhận đóng ca/sang ngày.
- Giữ nguyên 5 tab Kho cùng hàng, ô tên quán chỉ có placeholder, không tự điền.

## Những gì chưa được thay đổi

- `js/game.js`, `js/v8761-art-fixes.js`, công thức, số Xu, giá thị trường, logic ca, hệ thống nợ, NPC, save game chính, tài nguyên ảnh cũ.
- Không tạo ảnh AI mới; 5 hình nền sử dụng lại tranh Làng/Cánh Đồng/Đồi Sim/Phố Đèn/Bến sông có sẵn.
- Không có nhạc nền để điều chỉnh riêng: app Cài đặt chỉ điều khiển SFX thực tế.
- Không triển khai PWA, APK hoặc API AI.

## Quy tắc cấu hình và bảo toàn dữ liệu

- Cài đặt thiết bị (âm lượng, âm thanh, giảm chuyển động, cỡ chữ) dùng namespace `bpvq:v8772:device-settings` trong localStorage.
- Hình nền/Mika preference dùng namespace `bpvq:v8772:profile:<id>` trong localStorage, tách khỏi save game. Mika mode vẫn được chuyển tiếp sang hệ thống `gameState.mikaGuide` vốn đã tồn tại.
- Không đổi tên bất cứ khóa save game chính nào. Không xóa save.
- Khi không có cấu hình mới: mặc định hiệu ứng bật, 80% âm lượng, hình nền Làng, không giảm chuyển động.

## Kết quả kiểm tra

- Cú pháp JavaScript qua `node --check` cho 3 tệp JS thay đổi/mới: **Đạt**.
- 5 đường dẫn WebP hình nền: **Đều tồn tại** trong gói đầy đủ.
- SHA-256 của `js/game.js` và `js/v8761-art-fixes.js` so với v87.7.1: **Không đổi**.
- Thử mô-đun Thị Trấn OS trong Chromium với HTML mô phỏng ở độ rộng 320, 375, 390px: **Đạt** (Home có 9 app, Cài đặt, chọn wallpaper, About, quay Home, mở app Ship cũ, đăng ký app thứ 10, không tràn ngang, không lỗi page JavaScript trong mô phỏng).
- Không mở được toàn bộ game qua local HTTP trong môi trường này (`ERR_BLOCKED_BY_ADMINISTRATOR`). **Chưa xác nhận bằng Chrome/Android thực tế**, đặc biệt âm thanh Tone.js, các minigame, popup ngoài và tác động toàn bộ gameplay.

## Kiểm thử nghiệm thu trên GitHub Pages

1. Mở điện thoại → thấy Home với 9 icon (không vào Ship).
2. Ship/Soppi/Cư dân/Phát triển/Tiện ích/Game/Ví-Vay/Đấu giá → mỗi app mở đúng màn. Bấm Home; bấm Đóng.
3. Chuyển sang hình nền Cánh đồng, đóng/mở điện thoại → hình nền vẫn giữ. Đổi hồ sơ → cấu hình riêng nếu đã lưu.
4. Cài đặt → Âm thanh → tắt hiệu ứng, thử bấm nút; mở lại tiếng. Chỉnh âm lượng trên trình duyệt có Tone.js.
5. Cài đặt → Mika → đổi chế độ, mở lại bài học; nút Chỉ mình với/Bỏ qua cùng hàng và khoanh đúng vị trí.
6. Mở Quán, Đóng Ca và Qua Ngày trên điện thoại. Ngày phải tăng đúng 1, không bị mất đơn hay nhân tiền.
7. Cài đặt → Dữ liệu → sao chép mã save, so sánh dữ liệu trước/sau cập nhật.
8. Kho 5 tab vẫn một hàng, tên quán khi tạo hồ sơ là ô trống có gợi ý.
9. Mở game bằng hồ sơ cũ v87.7.1: vẫn còn tiền/kho/tiến trình.

## Giới hạn và việc theo dõi

- Chưa có hướng dẫn khởi động lại/nhập save ngay trong Cài đặt; sử dụng menu Lưu game gốc để nhập khi cần.
- Ảnh nền sẽ tự cắt theo kích thước điện thoại; không kéo giãn. Không có ảnh nghệ thuật mới.
- Các app mới cần **đăng ký** vào `VillageOS` và tạo màn hình/render tương ứng; nền tảng tự bổ sung icon và hỗ trợ Home/Back/Đóng.
- `Về Game` chỉ chứa mốc đã xác nhận; tên tác giả chính để dạng mô tả cho đến khi chủ dự án quyết định tên ghi công.
