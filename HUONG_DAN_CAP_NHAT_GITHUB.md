# Hướng dẫn cập nhật GitHub v87.6.1 (không tạo repository mới)

**Quan trọng:** Trên GitHub repository đang chơi được, chỉ tải nội dung của ZIP `Bo_Pho_Ve_Que_v87.6.1_CAP_NHAT_GITHUB.zip` lên **thư mục gốc**.

1. Giải nén ZIP bản vá trên laptop.
2. Vào repository `bo-pho-ve-que` → tab **Code** → **Add file** → **Upload files**.
3. Kéo **các tệp và thư mục nằm BÊN TRONG** thư mục giải nén vào vùng upload, không kéo chính folder bao ngoài và không tải nguyên ZIP.
4. Kiểm tra danh sách có `index.html`, `js/v8761-art-fixes.js`, `assets/images/v8761_...svg` và `assets/images/v8761_clean_...webp`. Đường dẫn mới **không được có thêm một thư mục tên bộ ZIP phía trước**.
5. Nếu GitHub đề nghị thay tệp cũ `index.html`, chọn ghi đè/cập nhật tệp cũ. Nếu không cho ghi đè qua Upload files, mở `index.html` trên GitHub, nhấn biểu tượng bút chì, thêm một dòng `<script src="js/v8761-art-fixes.js?v=87.6.1"></script>` ngay trước `</body>`; riêng JS và ảnh vẫn upload bình thường. Đừng tạo `index2.html`.
6. Tại Commit message nhập `Va anh nguyen lieu 3 quan v87.6.1`; chọn **Commit directly to main** → **Commit changes**.
7. Vào **Actions** hoặc **Settings → Pages** để xem triển khai. Sau khi thành công, mở lại cùng địa chỉ GitHub Pages của game, tải lại tab trên laptop/điện thoại.
8. Đối chiếu các món trong `BAO_CAO_BAN_VA_v87.6.1.md`. Đặc biệt kiểm tra Cá Viên, Thanh Cua Xiên, 8 nhóm trùng ảnh, Trà Đen, Trà Ô Long.

**Save:** Cùng tên miền GitHub Pages và không thay đổi khóa localStorage, nên không có bước di chuyển save mới. Dù vậy hãy sao lưu save trước khi cập nhật và không xóa dữ liệu trang.

**Quay về bản cũ:** khôi phục `index.html` của commit v87.6.0 bằng History/Restore; có thể để lại các tệp ảnh mới mà game cũ không dùng, không ảnh hưởng save.
