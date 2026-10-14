# Cập nhật v87.7.2 lên GitHub Pages

**Đừng tạo repo mới, đừng tải lại 276 hình cũ.**

Giải nén ZIP: nhận được một thư mục ngoài cùng `Bo_Pho_Ve_Que_v87.7.2_CAP_NHAT/`.

Chỉ tải **các tệp nằm bên trong**, tránh tạo nhầm `css/css` hoặc `js/js`.

1. Mở repo `bo-pho-ve-que` → thư mục `css` → Upload files, chọn **3 tệp** trong `CAP_NHAT/css/`:
   - `v877-warehouse-mika.css`
   - `v8771-onboarding.css`
   - `v8772-thitran-os.css`
2. Mở repo → thư mục `js` → Upload files, chọn **4 tệp** trong `CAP_NHAT/js/`:
   - `v877-warehouse-mika.js`
   - `v8771-onboarding.js`
   - `v8772-releases.js`
   - `v8772-thitran-os.js`
3. Mở trang gốc repo (cạnh README) → Upload files, chọn **`index.html`** trong `CAP_NHAT/` để ghi đè.
4. Commit message đề xuất: `Nang cap Thi Tran OS 2.0 va Mika mobile v87.7.2`.
5. Chờ **GitHub Pages deployment xanh ở lượt mới nhất**. Lượt cũ Cancelled không đồng nghĩa mã CSS lỗi.
6. Mở game và nhấn **Ctrl+Shift+R** trên laptop. Trên mobile, tải lại hoặc mở tab ẩn danh để so sánh.
7. Dùng hồ sơ phụ để kiểm tra Home/Cài đặt trước; không nhấn Chơi mới lên hồ sơ chính.

Nếu mới thêm riêng một nhóm `css` hay `js`, trang vẫn có thể chạy theo logic cũ; phải tải **cả 3 nhóm css + js + index**.

## Quay lại khi cần

Repo → Commits → chọn commit ổn định trước đó → Revert nếu cần. Không xóa localStorage/saves chỉ vì gặp lỗi giao diện.
