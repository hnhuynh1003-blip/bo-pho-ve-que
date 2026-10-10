# Bỏ Phố Về Quê — v87.8.0.1 · Cân Bằng Nông Trại & Huy Chương Nhà Nông

**Nền:** v87.8.0 · **Ngày:** 10/10/2026 · **Trạng thái:** Đã sửa code và kiểm thử thành phần, **chờ nghiệm thu trên game thật và thiết bị của người chơi**.

## Phạm vi đã được người chơi duyệt

1. Chặn thu hoạch liên tục trong cùng một ngày game, cả thao tác tay lẫn Trợ Lý Vườn.
2. Thêm bảng chọn đủ sáu giống ở mỗi thửa đất. Không tự ép trồng Lúa Mì khi trong kho còn Lúa Mì.
3. Tự gieo lại ghi nhớ `lastSeed` riêng của từng thửa; khi hết hạn mức ngày, trợ lý dừng gieo cho tới ngày mới, tránh đốt hạt oan.
4. Thêm Huy Chương Nhà Nông, trao tự động theo thành tựu, không cần mua/trang bị và không cộng dồn các huy chương.
5. Chặn tự cho ăn lặp và thu sản phẩm vật nuôi vô hạn theo ngày.

## Cân bằng đã triển khai

| Huy chương | Điều kiện nhận | Thu hoạch tối đa mỗi thửa mỗi ngày |
|---|---|---:|
| Chưa có | Mặc định | 1 lần |
| 🥉 Đồng | Tổng 30 lượt thu hoạch và đã từng thu hoạch 3 giống khác nhau | 2 lần (+1) |
| 🥈 Bạc | Tổng 150 lượt thu hoạch và đã từng thu hoạch 5 giống khác nhau | 3 lần (+2) |

Các mốc này đếm **lượt thu hoạch**, không đếm số lượng nông sản, không tự tạo nguyên liệu. Người chơi vẫn phải tiêu hao hạt (trừ khi kích hoạt tỷ lệ giữ hạt của vật phẩm sẵn có), chờ cây chín, mới thu được sản phẩm.

Một ô Chuồng được **cho ăn/chăm nguồn thức ăn tối đa 1 lần/ngày** và **thu sản phẩm tối đa 1 lần/ngày**, kể cả Auto. Các tác động phát triển nhanh, tăng sản lượng, chăm sóc/tình cảm đã có tiếp tục hoạt động theo luật cũ.

## Tương tác

- Vườn → Chạm thửa trống → **Chọn giống** (6 ô, nêu lượng hạt và level mở khóa) → chạm `Gieo`.
- Tấm **Huy Chương Nhà Nông** cạnh phần trợ lý hiển thị hạn mức, tổng lượt đã thu và tiến độ Đồng/Bạc.
- Từng thửa hiển thị số lượt thu trong ngày. Khi đã đủ hạn mức, cây có thể để sẵn nhưng nút nhận thu hoạch bị vô hiệu hóa cho tới ngày sau.
- Trợ lý tự gieo sử dụng đúng giống người chơi chọn cuối cùng **cho thửa đó**, không ưu tiên hạt tồn kho nhiều nhất; dừng gieo khi hết lượt thu trong ngày.
- Chuồng hiện `Đã thu hôm nay` thay nút thu sản phẩm nếu đã nhận một lượt, không cho thêm thức ăn trong cùng ngày.

## Bảo vệ save cũ

- **Không đổi mã vật phẩm**, nghề, NPC, năng suất gốc, Xu, SP, công thức, cấu trúc Kho, tiến độ xây quán, lãi vay hoặc luồng đóng ca / qua ngày.
- Chỉ **bổ sung** `farmAchievements: {totalHarvests,cropVarieties,medalTier}`, `farmPlots[].harvestDay`, `farmPlots[].harvestCount`, `animals[].lastFedDay`, `animals[].lastCollectDay`.
- Save cũ thiếu các trường này được khởi tạo không làm mất cây/vật nuôi đang có. Thành tựu lịch sử **không thể suy ra từ dữ liệu save cũ**, nên bộ đếm Huy Chương bắt đầu từ 0 kể từ lần cập nhật này; không cấp bù huy chương không có chứng cứ.
- Nếu một vật nuôi cũ đang có trạng thái `autoFed`, lần đầu nâng cấp xem như đã cho ăn trong ngày để tránh trừ thức ăn lặp ngay lập tức.
- Giới hạn được đọc theo `gameState.day`, không theo thời gian máy thật. Đóng/mở game, chuyển tab hoặc khôi phục từ save không làm mới lượt.
- Thành tựu trong bản này gắn với **lượt khởi nghiệp hiện tại**. Việc bảo toàn huy chương khi phá sản/đổi nghề sẽ được thiết kế riêng ở hệ thống di sản, không tự mở rộng ngoài phạm vi đã duyệt.

## Kiểm thử thành phần thực hiện

| Test | Kết quả |
|---|---|
| `node --check` với game.js | Đạt |
| Picker 6 giống trên màn hình 320, 375, 390, 430 CSS px, không tràn ngang | Đạt |
| Chọn Dâu Tây khi Lúa Mì tồn kho nhiều | Đạt |
| Thu hoạch lần 1 nhận sản phẩm; thu tay lần 2 cùng ngày không nhân đôi | Đạt |
| Thu Auto lần 2 khi hết lượt không nhân đôi | Đạt |
| Auto không gieo thêm khi hết lượt (tránh tiêu hao hạt oan) | Đạt |
| JSON serialize/restore không làm mới lượt; qua ngày mới được thu lại | Đạt |
| Auto gieo lại giống riêng của thửa đã chọn | Đạt |
| Đồng mở đúng 30/3; Bạc đúng 150/5; tối đa 3 lần/thửa/ngày | Đạt |
| Auto cho ăn một lần, không trừ thức ăn tiếp sau khi Auto thu | Đạt |
| Auto thu sản phẩm một lần/ngày, không nhận trùng | Đạt |
| Cho ăn thủ công không thể lách giới hạn Auto | Đạt |
| JSON serialize/restore giữ mốc ăn và thu; sang ngày mới cho ăn lại | Đạt |
| Kiểm thử full với tất cả tính năng, tài khoản thật, GitHub Pages, Android/iOS | **Chưa thực hiện** |

**Ghi chú:** Kiểm thử thực hiện trong Chromium fixture sử dụng chính `js/game.js` và CSS mới, với trạng thái game giả lập. Không tuyên bố đã kiểm thử trọn game trên GitHub Pages hoặc điện thoại người chơi.

## Danh mục công việc

| Mã | Trạng thái |
|---|---|
| FARM-01 — Giới hạn thu hoạch ngày | Viết mã, kiểm thử thành phần đạt |
| FARM-02 — Bảng chọn 6 giống | Viết mã, kiểm thử thành phần đạt |
| FARM-03 — Gieo lại theo giống đã chọn và dừng khi đủ lượt | Viết mã, kiểm thử thành phần đạt |
| FARM-04 — Huy chương Đồng/Bạc và tiến độ | Viết mã, kiểm thử thành phần đạt |
| BARN-01 — Auto ăn một lần/ngày | Viết mã, kiểm thử thành phần đạt |
| BARN-02 — Thu sản phẩm tối đa một lần/ngày | Viết mã, kiểm thử thành phần đạt |
| SAVE-01 — Di trú save cũ và giữ lượt qua reload | Viết mã, kiểm thử thành phần đạt |
| TEST-01 — Nghiệm thu trên GitHub Pages và điện thoại | Chờ người chơi |

## GitHub Desktop

1. **Yêu cầu:** repo đang ở **v87.8.0**; sao lưu hoặc xuất dữ liệu save trước khi đổi.
2. Giải nén bản PATCH ra ngoài repo; mở thư mục `Bo_Pho_Ve_Que_v87.8.0.1_PATCH_GitHub_Desktop`.
3. Chép **nội dung bên trong** (index.html, js/, css/, docs/) vào thư mục gốc repo, cho phép gộp/thay các file trùng; không để thành `js/js`.
4. GitHub Desktop → Changes → Commit `v87.8.0.1 - Farm Balance and Farmer Medals` → Push origin.
5. Kiểm tra: Vườn chọn giống khác Lúa Mì; nhận một lượt thu; thử Auto và qua ngày; Chuồng bật Auto và kiểm tra kho thức ăn; thử save/reload; tiến độ huy chương trong Vườn.
6. Nếu repo chưa ở v87.8.0, dùng FULL ở nhánh kiểm thử hoặc đối chiếu trước khi ghi đè.

## Tiếp theo (chưa triển khai)

- v87.8.1: định mức nguyên liệu thô → sơ chế → dùng ở Quầy Bán; cần chốt phí, sản lượng, công suất, mở khóa trước khi code.
- v87.8.2–3: nâng cấp Vườn/Chuồng sâu hơn và cân bằng kinh tế; huy chương chuồng riêng vẫn chỉ là ý tưởng.
