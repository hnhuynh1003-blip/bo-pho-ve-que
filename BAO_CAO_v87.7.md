# BỎ PHỐ VỀ QUÊ — BẢN NÂNG CẤP v87.7

**Nền tảng:** bản v87.6.1 FULL + bản vá Cay Ngọt v87.6.1b.
**Phạm vi:** Kho thống nhất (5 thẻ) + Mika 2.0 hướng dẫn trong game, không thay đổi logic kinh doanh.

## Đã thực hiện

- Kho có 5 thẻ: Tất Cả, Chế Biến, Nông Sản, Vật Phẩm, Lưu Niệm.
- Thẻ Nông Sản gộp Hạt giống, Thu hoạch, Chăn nuôi. Không sửa nguồn inventory.
- Thẻ Vật Phẩm đọc trực tiếp `lotteryTickets`, `blindBagTokens`, `v8743RecipeFragments`, các món thường từ `inventory`, `utilityOwned`, `equippedGear`, `decorations`. Thẻ Tất Cả cũng hiển thị tài sản cùng kỷ vật đang có; Lưu Niệm giữ chức năng đấu giá cũ.
- Mảnh công thức hiển thị theo nghề hiện tại, chỉ hiện tên khi có đủ điều kiện hoặc đã sở hữu mảnh. Công thức nghề khác có tiến độ chỉ báo tổng số, không tiết lộ tên.
- Nút đến nơi sử dụng chỉ chuyển giao diện đến Góc Giải Trí, Soppi/Công Thức, Tiện Ích, hoặc Phát Triển; không tự sử dụng, không tiêu tiền.
- Hộp quà thường giữ hành vi `v8731OpenBox` gốc, có làm mới Kho sau khi mở.
- Mika tái sử dụng hình `assets/images/117_mika_6fcbe1c0ec.webp`, bổ sung cửa sổ thu gọn, 12 chủ đề hướng dẫn, tìm kiếm từ khóa, ba chế độ và tiến độ 5 bài nhập môn.
- Mika chỉ lưu các trạng thái hỗ trợ trong `gameState.mikaGuide`, khởi tạo an toàn khi thiếu; giữ khóa save và toàn bộ trạng thái game cũ.
- Không thay nút `🤖 Trợ lý` tự động trong Quán/Vườn/Chuồng; không thay các tương tác NPC Mika/Bé Bơ sẵn có.

## Danh sách tệp thay đổi

- `index.html`: 5 nút lọc + tham chiếu JS/CSS mới; **giữ bản vá Cay Ngọt v87.6.1b**.
- `css/v877-warehouse-mika.css`: CSS mới.
- `js/v877-warehouse-mika.js`: module giao diện/logic chỉ-đọc và Mika.

Không thay `js/game.js` hay hình ảnh, công thức, hệ thống nhân viên, phá sản và các chức năng kinh tế.

## Kiểm thử đã thực hiện trong môi trường tạo bản

- `node --check` cho JS mới và JS gốc: **đạt**.
- Kiểm tra cấu trúc HTML & đường dẫn JS/CSS/ảnh Mika: **đạt**.
- Test Node VM mô phỏng: Tất Cả, Nông Sản, Chế Biến, Vật Phẩm, đủ 12 chủ đề; dữ liệu Xu, tồn kho, vé, túi, mảnh không bị thay đổi trong thao tác xem: **đạt**.
- SHA-256: game.js, v8761-art-fixes.js, ảnh Mika và các asset từ bản v87.6.1 gốc được giữ nguyên: **đạt**.
- **Chưa** kiểm thử tương tác game đầy đủ bằng Chrome/Android thực tế. Trình duyệt tự động không trả kết quả đáng tin cậy trong môi trường chạy. Cần kiểm thử trực tiếp sau khi tải lên GitHub Pages.
- Không thể lấy bản `main` GitHub live trong môi trường này; phiên bản vá được ghép từ bản gốc cục bộ. Nếu bạn vừa sửa `index.html` trực tiếp trên GitHub, cần đối chiếu trước khi ghi đè.

## Những việc cần tự kiểm thử trên GitHub Pages

1. Mở Kho, cả 5 thẻ; kiểm tra hạt, sữa, trứng, nguyên liệu ba nghề.
2. Nhận vé/túi ở Làng; mở Kho, số lượng bằng Điện thoại → Góc Giải Trí.
3. Cào 1 vé/khui 1 túi, quay lại Kho; số lượng phải giảm đúng 1.
4. Săn 1 mảnh, mở Kho và Soppi → Công Thức; cấp 2 mảnh được học, không lộ nghề khác.
5. Mở hộp quà thường trong Kho; không tặng 2 lần.
6. Xem lưu niệm và mở Sàn Đấu Giá; không đổi giá trị tài sản.
7. Mở Mika, tìm "túi mù", "công thức", "nợ"; thử 3 chế độ, F5 rồi kiểm tra vẫn giữ chế độ.
8. Mở Quán và nút trợ lý auto cũ để kiểm tra không nhầm với Mika.
9. Kiểm tra Mika và Kho trên điện thoại; các cửa sổ cào vé / minigame không bị phủ.
10. Lưu game, tải lại, so sánh Xu, cấp, nguyên liệu, nhân viên, mảnh, danh vọng.

## Giới hạn đã biết

Trợ lý Mika v87.7 là hướng dẫn theo quy tắc trong game, **không phải AI tạo sinh** và không dùng API AI. Mika chỉ nêu hướng dẫn có dữ liệu, chưa tự tính nguyên liệu thiếu trong đơn hàng cụ thể hoặc thao tác giùm người chơi. Chế độ nhập môn có 5 chủ đề tuần tự được đánh dấu khi người chơi nhấn “Đã hiểu”.
