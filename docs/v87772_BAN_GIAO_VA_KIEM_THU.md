# Bỏ Phố Về Quê — v87.7.7.2 · Phone Home Weather & Wallpaper Hotfix

## Phạm vi đã duyệt

1. **Wallpaper Home**: Sửa lớp nền cũ dùng pseudo-element `z-index:-1` có thể bị nền Home che; hiển thị wallpaper qua phần tử riêng ở lớp z-index 0, giữ nội dung ở lớp 1. Hỗ trợ đủ 6 nền (Làng chiều, Đêm dịu, Nông trại, Phố chợ, Lễ hội, Gradient), theo cài đặt đã lưu của từng hồ sơ; nếu ảnh thiếu thì dùng gradient dự phòng.
2. **Dock**: Ép Ship, Soppi và Nhật Ký có cùng khung, chiều cao, vị trí ảnh và nhãn. Không thay icon nghệ thuật hoặc đụng vào điều hướng cũ.
3. **Dự báo hôm nay**: Bổ sung thẻ nền trắng kem bo góc trang trí nhẹ ngay dưới tiêu đề “Hằng ngày”, đọc `gameState.dailyWorldEvent` của **đúng ngày hiện tại**, chọn một câu thơ ngắn có sẵn tương ứng với loại thời tiết. Không in % hay viết các chỉ số gameplay vào thẻ. Trên trang Quản lý thẻ sẽ tự ẩn.

**Không thay đổi:** save, tiền, nghề, XP/SP, nguyên liệu, công thức, bản đồ, thông báo, luật thời tiết, cơ chế qua ngày, admin, số trang OS.

## Nội dung kỹ thuật

- `index.html`: nạp thêm CSS/JS v87.7.7.2 cuối chuỗi CSS/JS và cập nhật title.
- `css/v87772-phone-weather-wallpaper.css`: wallpaper layer, dock thống nhất và thẻ thời tiết.
- `js/v87772-phone-weather-wallpaper.js`: dùng cài đặt VillageOS và weather ID hiện hữu; chỉ viết DOM, không ghi gameState. Không ghi thêm storage key.
- `assets/images/phone/wallpapers/*.webp`: sáu hình nền sẵn có được kèm lại trong PATCH để phòng thiếu asset sau lần tải trước.

## Bảng thông tin thời tiết

| Mã game gốc | Nội dung card |
| --- | --- |
| `sunny_day` | Nắng đẹp ☀️ |
| `hot_day` | Nắng nóng 🌞 |
| `light_rain` | Mưa nhẹ 🌦️ |
| `heavy_rain` | Mưa lớn 🌧️ |
| `storm_day` | Mưa giông ⛈️ |
| `cold_day` | Trở lạnh 🍃 |
| `cloudy_day` | Nhiều mây ☁️ |
| Chưa có dữ liệu hợp lệ | “Đang chờ dự báo” — không đoán thời tiết |

Các câu thơ là **câu viết mới cho game**, không phải trích dẫn tục ngữ cổ cần ghi nguồn. Mỗi thời tiết có ba lựa chọn được quyết định theo số ngày trong game, tránh đổi câu ngẫu nhiên mỗi lần mở điện thoại.

## Kiểm thử đã thực hiện

| Ca | Kết quả |
| --- | --- |
| Cú pháp JavaScript (`node --check`) | Đạt |
| Màn Home rộng 320 / 375 / 390 / 430 CSS px (fixture Chromium) | Đạt |
| Ship, Soppi, Nhật Ký có cùng top/height/icon-top | Đạt |
| Không phát sinh tràn ngang màn Home trong fixture | Đạt |
| Tải wallpaper Làng chiều từ dữ liệu ảnh và đổi Lễ hội | Đạt trong fixture với ảnh nhúng |
| Ngày 5 Mưa nhẹ → Ngày 6 Mưa giông | Đạt |
| Vuốt/chuyển sang Quản lý thì card thời tiết ẩn | Đạt |
| Vẫn giữ dữ liệu gameplay và không cấp thưởng | Đạt trong rà soát mã vì chỉ làm giao diện |
| Kiểm thử end-to-end game thật trên GitHub Pages hoặc máy người chơi | **Chưa thực hiện; cần nghiệm thu** |

**Giới hạn:** Mô hình Chromium là fixture UI dùng CSS, DOM và logic thực; hình ảnh được nhúng ở fixture để vượt hạn chế mở đường dẫn địa phương của môi trường. Chưa xác nhận môi trường GitHub của bạn có đủ các asset hay không, nên trong PATCH đã kèm lại tất cả wallpaper.

## Cập nhật với GitHub Desktop

1. **Đảm bảo repo đang là v87.7.7.1** rồi lưu/xuất save phòng trường hợp cần quay lui.
2. Giải nén ZIP PATCH ra thư mục riêng.
3. Mở GitHub Desktop → Repository → Show in Explorer.
4. Mở thư mục phiên bản ở trong ZIP và **chép các mục bên trong** (`index.html`, `css`, `js`, `assets`, `docs`) vào **gốc repo**. Khi Windows hỏi, chọn gộp và ghi đè file trùng. Không chép chính thư mục phiên bản vào repo; tránh `css/css`, `assets/assets`.
5. Kiểm tra Changes rồi Commit `v87.7.7.2 - Wallpaper Dock Weather`, sau đó Push origin.
6. Mở game trên trình duyệt, tải mới trang; vào Điện thoại → Cài đặt → Giao diện đổi 2–3 nền, trở về Home và kiểm tra có ảnh; ở Home xem khung “Dự báo hôm nay”; kiểm tra ba icon dock thẳng hàng.

## Nghiệm thu cần người chơi xác nhận

- [ ] Hình nền chọn trong Cài đặt thực sự hiện ở Home trên điện thoại.
- [ ] Thoát game, mở lại vẫn giữ hình nền đã chọn.
- [ ] Ship, Soppi, Nhật Ký ngang bằng nhau.
- [ ] Thẻ dự báo đẹp, không quá cao và không che app trong máy người chơi.
- [ ] Qua Ngày làm thẻ đổi theo thời tiết mới, không thay đổi gameplay.
- [ ] Không có lỗi JavaScript, không mất save.

Mức độ phát hành: **Đã đóng gói, chờ nghiệm thu trên điện thoại thật**.
