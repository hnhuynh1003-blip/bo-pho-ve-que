# Bỏ Phố Về Quê v87.7.3 — Thị Trấn OS Anime Signature Edition

## Phạm vi đã thực hiện

- Nâng cấp **Home**: ảnh nền thị trấn (đổi ảnh mặc định do ảnh cũ bị lỗi hiển thị), Mika chibi, đồng hồ, bố cục 6 ứng dụng + 3 ứng dụng trong dock kính mờ.
- Dùng **9 icon minh họa** riêng, cắt từ mẫu concept hình ảnh đã chốt; các icon được đóng gói bên trong CSS để **không phải upload thêm file ảnh**.
- Cài đặt có hai chế độ **Sáng Ấm / Đêm Sao** (lưu lựa chọn theo hồ sơ); dùng nền giấy kem và bảng màu gỗ ấm, có Mika minh họa, giữ toàn bộ mục chỉnh âm, hình nền, hỗ trợ, dữ liệu, Về Game.
- Nút đóng và nút Home/Quay lại tăng tương phản; giao diện đáp ứng độ rộng 320–390px trong bộ thử.
- Bổ sung mốc v87.7.3 vào nhật ký phát triển, cập nhật phiên bản trong About.
- **Giữ nguyên `game.js`, các app gốc, Mika hướng dẫn, phần điều khiển ca và save**. Thao tác đăng ký app vẫn sử dụng `VillageOS.registerApp`.

## Kiểm thử thực hiện

1. `node --check` cho 2 tệp JS cập nhật: đạt.
2. Test Chromium mô phỏng màn hình 320 / 375 / 390px: JS không báo lỗi, không tràn ngang.
3. Có 9 icon; 6 app trong lưới chính và 3 app trong dock.
4. Điều hướng thử Home → Ship → Home, Cài đặt, 5 tùy chọn hình nền, chế độ Đêm Sao và Về Game: đạt trong bộ thử.
5. Thêm thử ứng dụng mới bằng `VillageOS.registerApp`: thành công.
6. Checksum `js/game.js` trùng tuyệt đối với v87.7.2.
7. Đóng gói patch có một thư mục ngoài cùng.

**Giới hạn:** Chromium môi trường này chặn việc mở trực tiếp game đầy đủ qua localhost. Kết quả là kiểm thử mô-đun trên một trang mô phỏng đúng các phần tử chính, **chưa xác nhận end-to-end trên GitHub Pages hay điện thoại thật**.

## Các tệp thay đổi

- `index.html` — gọi CSS/JS mới và cập nhật tiêu đề phiên bản.
- `css/v8773-anime-signature.css` — toàn bộ giao diện Anime Signature Edition, gồm sprite icon đã được nhúng.
- `js/v8773-anime-signature.js` — dựng Home, dock, Mika minh họa; trang trí Cài đặt; lưu nhật ký.
- `js/v8772-thitran-os.js` — sửa ảnh nền mặc định và phiên bản hiển thị trong Về Game.

## Nghiệm thu thực tế đề xuất

- Mở điện thoại có Home, bấm Ship và Soppi, bấm Quay lại / Home / Đóng.
- Vào Cài đặt → Giao diện, thử chọn cả 5 hình nền. Tắt/bật hiệu ứng âm thanh.
- Vào Về Game thấy v87.7.3.
- Kiểm tra không mất Xu, save, tiến trình Mika và các app cũ.
