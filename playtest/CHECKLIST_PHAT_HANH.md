# Kiểm thử v87.6.1 — bản vá ảnh 3 quán

## Bản vá v87.6.1

- [x] 8 nhóm ảnh trùng sai món được ánh xạ riêng.
- [x] 2 nguồn ảnh WebP hỏng đang hiện hành đã được bỏ khỏi luồng render nguyên liệu.
- [x] 2 ảnh trà bị nhiễu đã có ảnh SVG thay thế.
- [x] SVG bổ sung và WebP vệ sinh mảnh rời kiểm thử định dạng đạt.
- [x] Mã game gốc, save/schema và CSS gốc không thay đổi.
- [ ] Kiểm thử toàn bộ 3 quán trên laptop, Chrome Android và Safari iOS.

## Đã thực hiện tại đây

- [x] Giữ bản HTML nguồn nguyên vẹn để đối chiếu SHA-256.
- [x] Tách 304 lượt tham chiếu ảnh thành 276 tệp WebP/PNG không thay đổi byte.
- [x] Giữ thứ tự 11 stylesheet và thứ tự thực thi script gốc (không `async`/`defer`).
- [x] Đường dẫn tương đối phù hợp GitHub Pages trong subpath repository.
- [x] Kiểm tra cú pháp JavaScript bằng Node.js.
- [x] Kiểm tra tồn tại tệp, SHA-256 ảnh, hợp lệ ảnh qua Pillow và URL nội bộ.
- [x] Giữ nguyên hàm và khóa save cũ trong game.js.
- [x] Bổ sung `chuyen-save.html` nhập mã save vào hồ sơ mới (không thay đổi game.js).
- [x] Kiểm thử bộ chuyển save bằng Node: chấp nhận dữ liệu hợp lệ, từ chối nghề không hợp lệ. Chưa kiểm thử bằng trình duyệt.

## Chưa thể xác nhận trong môi trường tạo bản

- [ ] Chạy thực tế trong Chrome và Safari: môi trường duyệt tự động tại đây chặn truy cập trang local/localhost (`ERR_BLOCKED_BY_ADMINISTRATOR`).
- [ ] Kiểm thử tài khoản mới, lưu/tải và chuyển mã save bằng `chuyen-save.html` trên trình duyệt người dùng.
- [ ] Giao diện ở màn hình 1366×768, 1920×1080, Android dọc/ngang, iPhone Safari.
- [ ] Giao quầy bằng tay và tự động; nguyên liệu không âm, Xu và đánh giá chính xác.
- [ ] StaffOps: Lan phục vụ, Khoa giao, lương và chốt ngày đúng một lần.
- [ ] Thị trấn: 11 khu vực, từng NPC, nhiệm vụ, danh vọng và lễ hội.
- [ ] Kiểm tra hiệu năng với mạng chậm và ảnh lớn; so sánh kích thước dữ liệu tải thực.
- [ ] Kiểm tra âm thanh khi không có CDN Tone.js hoặc vendoring thư viện âm thanh cho offline.

## Checklist GitHub

1. Tạo repository mới. Quyết định trước việc mã và hình ảnh có thể công khai hay không.
2. Đưa **nội dung** thư mục này lên repository (root chứa `index.html`). Không upload backup save người chơi.
3. GitHub → Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
4. Mở liên kết do GitHub cung cấp và thử từng tab, ảnh, khách, đơn, khu vực.
5. Kiểm tra console và tab Network: không có 404; lưu và tải trên cùng hostname.
6. Trước khi đổi từ localhost/file cũ sang GitHub, thử **xuất mã → chuyen-save.html → tạo hồ sơ → kiểm tra** ở một hồ sơ thử. Save KHÔNG tự chuyển giữa các origin.

## Quản lý sự cố

- Dừng phát hành nếu mất save, ảnh lỗi, không nhận đơn, không giao hàng hoặc sang ngày sai.
- Giữ bản HTML gốc làm đường quay lại.
- Không tự ý nâng version schema hoặc đổi khóa localStorage trong đợt tách tài nguyên này.
