# CẬP NHẬT BỎ PHỐ VỀ QUÊ v87.7.5 QUA GITHUB DESKTOP

1. **Sao lưu save trước:** vào Điện thoại → Cài đặt → Dữ liệu (hoặc chức năng lưu game gốc), xuất mã save ra file/ghi chú. Đang có công trình? Hãy ghi lại Xu/bậc/ngày.
2. Mở **GitHub Desktop** → chọn repository `bo-pho-ve-que`, bấm `Fetch origin` → `Pull origin` nếu có bản mới. Kiểm tra branch `main`.
3. Bản **PATCH** dành riêng cho repo đang ở **v87.7.4**. Nếu repo không rõ nền hoặc thiếu tệp `assets/images/` thì so sánh trước; dùng **FULL** để khôi phục trọn v87.7.5, nhưng FULL có thể ghi đè chỉnh sửa riêng.
4. Giải nén ZIP ra chỗ riêng. Mở **thư mục có tên phiên bản** bên trong. Copy trực tiếp `index.html`, `css`, `js`, `docs` vào **thư mục gốc repository** (nơi có `index.html`, `assets/`, `.git/`), gộp thư mục và cho phép ghi đè file trùng.
5. Kiểm tra đúng: `js/v8775-os-reborn.js`, `css/v8775-os-reborn.css`, `js/game.js`, `js/v8771-onboarding.js`, `js/v8772-thitran-os.js` đều ở đúng thư mục. **KHÔNG tạo `js/js`, `css/css`, hay một thư mục version nằm lồng trong repository.**
6. Trong GitHub Desktop → tab **Changes**: kiểm tra file thay đổi. Summary: `v87.7.5 - Thi Tran OS Reborn`. Bấm `Commit to main`, rồi `Push origin`.
7. Chờ GitHub Pages cập nhật, mở game và tải mới (Ctrl+Shift+R hoặc tab ẩn danh). Chạy 12 bài test trong `v8775_BAO_CAO_BAN_GIAO.md`.

**Gỡ về bản cũ nếu lỗi:** Trong GitHub Desktop dùng History kiểm tra commit mới; trước khi Revert nhớ sao lưu save và tránh chỉnh sửa/chuyển nghề trong lúc nghi ngờ dữ liệu. Phục hồi mã file bằng Revert commit đúng phiên bản; không tự xóa dữ liệu LocalStorage.
