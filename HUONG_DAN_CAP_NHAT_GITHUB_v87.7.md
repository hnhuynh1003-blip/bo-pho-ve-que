# HƯỚNG DẪN CẬP NHẬT GITHUB — v87.7

Không cần tạo repository mới hay đăng lại 276 ảnh. Bộ vá chỉ gồm 3 tệp game:

- `css/v877-warehouse-mika.css` (tệp mới)
- `js/v877-warehouse-mika.js` (tệp mới)
- `index.html` (thay thế tệp cũ)

**Nên cập nhật theo thứ tự này để trang không lỗi khi đang upload:**

1. Giải nén ZIP `PATCH` và mở thư mục `css` trong thư mục vừa giải nén.
2. Trên GitHub, vào kho `bo-pho-ve-que` → `css` → **Add file → Upload files** → kéo `v877-warehouse-mika.css` → Commit.
3. Vào kho → `js` → **Add file → Upload files** → kéo `v877-warehouse-mika.js` → Commit.
4. Về trang gốc repository (nơi có `index.html`) → **Add file → Upload files** → tải `index.html` **từ bản vá** để ghi đè bản cũ → Commit.
5. Chờ GitHub Pages cập nhật, tải lại trang game; nên thử tab ẩn danh hoặc làm mới trang nếu vẫn thấy bản cũ.

Commit message gợi ý: `Nang cap Kho va Mika 2.0 v87.7`.

**Quan trọng:** Nếu bạn đã chỉnh trực tiếp `index.html` trên GitHub sau bản vá v87.6.1b, nên tải bản đó về để đối chiếu trước khi thay thế. Không xóa save trình duyệt. Giữ bản sao save khi thử cập nhật.

## Rollback

Nếu lỗi nghiêm trọng, trong GitHub chọn bản commit ngay trước khi cập nhật v87.7, khôi phục `index.html` và xóa hoặc không dùng `v877-warehouse-mika.js` / CSS mới. Không cần xóa tài khoản hoặc save.
