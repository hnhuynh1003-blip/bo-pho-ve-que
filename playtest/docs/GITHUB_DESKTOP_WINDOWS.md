# HƯỚNG DẪN CẬP NHẬT BẰNG GITHUB DESKTOP — WINDOWS 11

## Bước 0 — sao lưu save game

Mở game đang chơi trong trình duyệt → dùng mục Lưu/Dữ liệu để xuất mã save ra chỗ an toàn. Trong GitHub Desktop, trước khi cập nhật, nên Commit phiên bản đang chạy với ghi chú `Backup trước v87.7.4`. Không xóa data trình duyệt.

## Bước 1 — lấy repository về máy (làm một lần)

1. Mở GitHub Desktop → `File` → `Clone repository…`.
2. Chọn thẻ `URL`, dán `https://github.com/hnhuynh1003-blip/bo-pho-ve-que` (hoặc chọn repository đó trong danh sách GitHub.com nếu đã đăng nhập).
3. Chọn đường dẫn local dễ tìm, ví dụ `D:\GameProjects\bo-pho-ve-que`, và bấm `Clone`.
4. Nếu đã clone từ trước, không clone lần nữa: chọn `File → Add local repository…` và trỏ tới thư mục đã có `.git`.

## Bước 2 — kiểm tra cơ sở v87.7.3

Ở thư mục repository, mở `index.html`, kiểm tra có liên kết `css/v8773-anime-signature.css` và `js/v8773-anime-signature.js`. Nếu không thấy, đừng chép patch; dùng bản FULL hoặc xác nhận bản hiện tại trước khi thay để tránh ghi đè bản mới hơn.

## Bước 3 — chép bản vá

1. Giải nén `Bo_Pho_Ve_Que_v87.7.4_PATCH.zip` ra thư mục riêng.
2. Mở thư mục **bên trong** `Bo_Pho_Ve_Que_v87.7.4_PATCH`.
3. Chọn `index.html`, `css`, `js`, `docs`; **chép các mục này vào ngay thư mục GỐC repo**, nơi đang có `index.html` và `.git`.
4. Nếu Windows hỏi Merge folders/Replace files, chọn gộp thư mục và thay các file trùng tên. **Không chép nguyên thư mục `Bo_Pho_Ve_Que_v87.7.4_PATCH` vào repo**; không tạo `css/css`, `js/js`.
5. Kiểm tra tối thiểu có `css/v8774-header-notification.css`, `js/v8774-header-notification.js`, `js/game.js`, `js/v8771-onboarding.js` và `index.html`.

## Bước 4 — Commit rồi Push

1. Trở lại GitHub Desktop, chọn đúng repository và branch `main`.
2. Tab `Changes` phải cho thấy các tệp mới/sửa ở trên; kiểm tra không có cả thư mục lồng sai.
3. Ô Summary nhập `v87.7.4 - Header Cute Premium va thong bao`.
4. Bấm `Commit to main`, sau đó `Push origin` (nếu có chữ `Publish branch` hoặc khác, cần kiểm tra branch và remote trước).
5. Đợi GitHub Pages triển khai rồi tải lại game bằng Ctrl+F5 trên laptop / reload trên điện thoại.

## Nếu đã có bản khác trên GitHub

Không ghi đè khi không rõ version. Bản FULL kèm mọi asset chỉ dùng cho repo muốn khôi phục nguyên trạng local v87.7.4, **có thể ghi đè thay đổi khác trên main**. Hỏi/đối chiếu trước.

## Test 5 phút sau Push

- Kiểm tra Header và sáu tab đều đứng yên khi cuộn; phần nấu không bị che thêm.
- Chạm 🔔 → thấy tin mới, chạm một tin → chỉ tin đó đã đọc.
- Mở điện thoại → 🔔 → lọc thời tiết/sự kiện, Đọc tất cả.
- Menu ⋯: Qua Ngày, Quản lý, Tăng Bậc, Tài khoản, Cài đặt/Lưu, Đổi nghề/Phá sản.
- Thử đóng ca, qua ngày, mở lại; kiểm tra Xu, Kho và dữ liệu còn đúng sau reload.
- Kiểm tra Mika hướng dẫn nâng bậc và 3 nghề (ưu tiên thử bằng bản save sao lưu / hồ sơ test).

## Rollback nếu có lỗi

Trong GitHub Desktop: `History` → chọn commit `v87.7.4` → `Revert This Commit` → `Push origin`. Không xóa thủ công file save hay dữ liệu web.

**Khác biệt:** GitHub Desktop lo Commit/Push và đồng bộ Git. ChatGPT không thể tự chép vào laptop hoặc tự nhấn Push trong ứng dụng GitHub Desktop của bạn trong cuộc trò chuyện này.
