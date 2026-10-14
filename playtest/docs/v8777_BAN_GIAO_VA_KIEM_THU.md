# v87.7.7 — Phone UI Premium | Bỏ Phố Về Quê

**Nền bắt buộc của PATCH: v87.7.6**. Bản FULL chứa toàn bộ mã nguồn và tài nguyên game hiện có.

## Đã thực hiện

- 16 ảnh icon hệ Thị Trấn OS theo cùng phong cách anime casual Cute Premium: 13 icon ứng dụng chính đang hiện, các icon tương thích Phát Triển cũ, Sổ Hiệu Ứng ẩn và Admin TEST. Tất cả gắn theo `app.id`, không lệ thuộc vị trí dock/trang.
- Tạo 6 hình nền điện thoại được tối ưu WebP: **Làng chiều, Đêm dịu, Nông trại, Phố chợ, Lễ hội, Gradient**. Các nền phong cảnh được biên tập từ hình nền thế giới game đã có; nền Gradient là nền tối giản bổ sung.
- `Cài đặt → Giao diện`: 6 thumbnail, chọn hình nền; chọn **Vuốt ngang (mặc định)** hoặc Cuộn dọc; bật/tắt hiệu ứng nền nhẹ; đặt lại giao diện điện thoại. Giữ mục chữ lớn và theme sáng/đêm từ bản trước.
- Giữ nguyên Thị Trấn OS swipe v87.7.6, dock Ship/Soppi/Nhật Ký, app Thông Báo với các bộ lọc, chuông ngoài Main Game. Không thêm tờ thông báo lớn.
- Giữ dữ liệu `VillageOS.getSettings()/setSetting()` theo hồ sơ trong localStorage; wallpaper cũ `hill` và `river` tự hiển thị bằng nền tương đương. Không thay dữ liệu kinh tế và save gameplay.
- Hình chuông ứng dụng không chứa số thông báo cố định. Badge vẫn dùng bộ đếm thực của game.

## File thay đổi (PATCH)

- `index.html` — nạp CSS/JS v87.7.7 sau v87.7.6.
- `js/v8772-thitran-os.js` — lựa chọn sáu wallpaper và tùy chỉnh giao diện trong Cài đặt.
- `js/v8777-phone-premium.js` — gắn icon theo app ID, hỗ trợ app Admin xuất hiện sau.
- `css/v8777-phone-premium.css` — thiết kế icon, hình nền, dock, trình chọn nền và layout.
- `assets/images/phone/icons/*.webp` — 16 ảnh icon.
- `assets/images/phone/wallpapers/*.webp` — 6 nền.

## Kiểm tra đã chạy

- Node `--check` toàn bộ file JS: đạt.
- Kiểm tra đường dẫn CSS/JS, đủ 16 icon và sáu wallpaper: đạt.
- Dùng chính JS/CSS của bản cập nhật trong mô hình Chromium ở 320 / 375 / 390 / 430px: icon Home/dock, 2 trang ngang, 6 wallpaper, đổi nền, đổi layout, reset và app Thông Báo: đạt.
- Bật thêm icon Admin sau khởi tạo: icon mới được cập nhật tự động, không lỗi JS.

**Giới hạn kiểm thử:** Chính sách trình duyệt trong môi trường thử chặn điều hướng trực tiếp đến file/localhost, nên chưa chạy end-to-end toàn bộ game, save và gameplay trên trang thật. Cần nghiệm thu trên GitHub Pages, Android và iPhone thực tế.

## Bảo toàn dữ liệu

Không sửa `game.js`, Xu, SP, cấp, nghề, công thức, cơ chế nâng quán, nhiệm vụ, thông báo, kho hoặc Admin TEST. Chỉ lưu lựa chọn hình nền, kiểu Home và hiệu ứng thuộc **Cài đặt thiết bị theo hồ sơ**, không ghi đè hồ sơ game. Chuyển sang thiết bị khác có thể cần chọn nền lại nếu chỉ nhập mã save gameplay.

## Cập nhật bằng GitHub Desktop

1. **Backup/export save** trước khi cập nhật.
2. GitHub Desktop: **Fetch origin → Pull origin** nếu có phiên bản mới, kiểm tra repo là v87.7.6.
3. Giải nén PATCH ra thư mục riêng; mở **thư mục con v87.7.7_PATCH** ở trong ZIP.
4. Copy `index.html`, `js/`, `css/`, `assets/`, `docs/` vào **gốc repo** đang có `index.html`. Khi được hỏi, chọn merge và ghi đè file trùng. Không tạo thư mục `js/js`, `css/css` hay `assets/assets`.
5. GitHub Desktop -> Changes, Commit `v87.7.7 - Phone UI Premium`, Push origin.
6. Mở GitHub Pages; tải mới trang nếu trình duyệt còn cache.

## Checklist nghiệm thu máy thật

- [ ] Icon Cư Dân, Game, Ví/Vay, Đấu Giá, Nhân Vật, Xây Quán, Nhân Sự, Nhật Ký, chuông, Cài đặt đồng bộ; icon Admin TEST cũng đúng.
- [ ] Home vẫn vuốt ngang 2 trang; dock Ship/Soppi/Nhật Ký không bị mất.
- [ ] Không xuất hiện panel thông báo lớn trên Home.
- [ ] `Cài đặt → Giao diện` có đủ 6 ảnh nền và nhìn rõ ảnh xem trước.
- [ ] Chọn nền, đóng/mở điện thoại rồi reload trang vẫn giữ đúng lựa chọn.
- [ ] Chế độ Cuộn dọc tùy chọn và quay về Vuốt ngang hoạt động.
- [ ] Bật/tắt hiệu ứng nhẹ không che app; Đặt lại về Làng chiều + Vuốt ngang.
- [ ] Khi bật mã Admin TEST, icon Admin không bị mất hoặc bị đẩy đè lên dock.
- [ ] Ba nghề và save game đang chơi vẫn bình thường.
