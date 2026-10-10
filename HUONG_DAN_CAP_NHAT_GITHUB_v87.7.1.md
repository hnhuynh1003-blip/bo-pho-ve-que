# Cập nhật v87.7.1 lên GitHub bằng trình duyệt

Tải **ZIP bản vá**, giải nén; chỉ xuất hiện **một thư mục** `Bo_Pho_Ve_Que_v87.7.1_CAP_NHAT` ở ngoài cùng.

Đường dẫn bên trong thư mục là đường dẫn tương ứng trên GitHub. **Không kéo thư mục ngoài cùng vào repository**, vì sẽ khiến game tìm tệp sai đường dẫn.

1. GitHub → repo `bo-pho-ve-que` → vào thư mục `css` → Add file → Upload files → kéo **`v8771-onboarding.css`** → Commit.
2. Vào thư mục `js` → Upload files → kéo **`v8771-onboarding.js`** → Commit.
3. Quay lại gốc repository → Upload files → kéo **`index.html`** → cho phép thay thế `index.html` hiện tại → Commit.
4. Chờ Actions/Pages deploy xong, mở game và làm mới tab trình duyệt. Kiểm tra màn tạo tài khoản, tên nghề, 5 nút Kho và Mika.

**Lưu ý:** Các tài liệu `.md` chỉ để tham khảo, không cần tải lên GitHub để game chạy. Không cần tải lại 276 ảnh hoặc `game.js`.

### Kiểm tra quan trọng

- Với **hồ sơ đang chơi cũ**, nhấn Tiếp tục để vào thẳng game, **không** tự xuất hiện truyện mở đầu.
- Muốn thử cảnh mở đầu, tạo **một hồ sơ phụ mới**, không chọn “Chơi mới” trong hồ sơ chính (vì thao tác đó ghi đè lượt chơi của hồ sơ ấy).
- Để mở Mika sau khi vào game: tìm nút “Hỏi Mika” góc dưới, hoặc chế độ hướng dẫn sau khi tạo lượt mới. Bạn có thể chọn “📖 Xem lại câu chuyện rời phố” trong Mika.
- Nếu nút Mika, CSS hoặc cảnh mở đầu chưa hiện: thử tải lại, chờ GitHub Pages cập nhật, kiểm tra hai file CSS/JS đúng thư mục.
