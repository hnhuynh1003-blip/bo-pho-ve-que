# Bỏ Phố Về Quê v88 — Khôi phục hình Trà Sữa B1–B9 (Đợt 5A)

**Nguồn thực tế:** tệp người dùng gửi `DUDU_STUDIO_TRA_SUA_9_BAC_KIEM_DUYET_V1(1).zip` (11/10/2026), chứa **9 WebP riêng**, `BAO_CAO_QA_9_BAC_TRA_SUA_V1.md`, `TRANG_THAI_27_SHELLS.csv` và bảng so sánh 9 bậc.

**Đã làm:** giải nén và kiểm tra file thật, xem 9 hình bằng mắt, lập bảng ánh xạ và bộ review offline. `js/v88-shop-scenes.js` đã có 9 concept reference qua `getConcept()`, **không** ghi đè registry production hoặc save. Chưa có GitHub upload ảnh binary qua connector hiện tại, nên `inRepository:false`; tất cả các scene production vẫn `artwork:null` và `approved:false`. Không lén dùng preview làm shell game.

## 1. Bảng ánh xạ chính xác

| v88 ID | File trong ZIP gốc | Kích thước | Đánh giá QA gốc | Phạm vi dùng ngay | Việc cần làm trước game |
|---|---|---|---|---|---|
| `boba-b1` | `TRA_SUA_B01_PREVIEW.webp` | 1448×1086 | Mẫu đúng hướng | Xem concept B1 | Dọn bảng rời/chậu/đèn nếu trùng đồ mua; đo 6 anchor |
| `boba-b2` | `TRA_SUA_B02_PREVIEW.webp` | 1448×1086 | Cần tinh chỉnh | Xem concept B2 | Giảm độ xa hoa mái/đèn; làm nổi bật quầy cố định |
| `boba-b3` | `TRA_SUA_B03_PREVIEW.webp` | 1448×1086 | Cần tinh chỉnh | Xem concept B3 | Hoàn thiện vách/tủ và phân cấp rõ hơn B2/B4 |
| `boba-b4` | `TRA_SUA_B04_PREVIEW.webp` | 1536×1024 | Mốc so sánh | Xem concept B4 | Làm sạch đồ mua riêng, giữ nhà gỗ 1 gian |
| `boba-b5` | `TRA_SUA_B05_PREVIEW.webp` | 1536×1024 | Mốc so sánh | Xem concept B5 | Giữ nhà ngang 1 tầng/mái ngói đỏ; tách props |
| `boba-b6` | `TRA_SUA_B06_PREVIEW.webp` | 1448×1086 | Cần sửa hình khối | Xem concept lịch sử | **Sửa tầng 2 quá hoàn chỉnh thành gác lửng một phần** |
| `boba-b7` | `TRA_SUA_B07_PREVIEW.webp` | 1536×1024 | Mốc so sánh | Xem concept B7 | Kiểm tra đúng 1 nhà chính hai tầng, S17 cầu thang, S20 dầm |
| `boba-b8` | `TRA_SUA_B08_PREVIEW.webp` | 1536×1024 | Đã duyệt concept | Xem concept B8 | Tách đồ mua, giữ 3 khối sân U; đo 22 anchor |
| `boba-b9` | `TRA_SUA_B09_PREVIEW.webp` | 1448×1086 | Đã duyệt concept **ở đợt QA cũ** | Chỉ tham khảo lịch sử | **Không được thay B9 mới**: bản ZIP mái ngói đỏ, bản B9 chốt sau là mái xanh than + quảng trường nước |

Tất cả 9 file là **preview concept**, không phải ảnh nền chính thức. Dùng ngay = dùng để **xem/đối chiếu**, không phải được triển khai vào cảnh chơi.

## 2. Trạng thái kỹ thuật không được đánh đồng
- **9/9:** concept tìm thấy và xác minh ảnh đọc được, không cần tạo lại.
- **0/9:** shell production đã sạch, neo đủ, qua mobile QA và người dùng duyệt.
- **0/27:** bộ shell sạch cho toàn bộ ba nghề trong repo (tại thời điểm kiểm tra).
- **9 reference boba:** ánh xạ có trong `BPVQShopScenesV88.conceptReferences()` và `getConcept('boba',1..9)`.
- **27 production records** của `BPVQShopScenesV88.get()` không đổi, `isReady:false`.
- **Chưa có** concept hình cho Mì Cay/Xiên Que trong ZIP này; không tự bịa nguồn.
- **Chưa upload WebP binary** lên nhánh GitHub do phiên công cụ chỉ hỗ trợ cập nhật file text. Bộ ZIP review có đủ 9 WebP và cây thư mục `assets/images/v88/concepts/` để người dùng đồng bộ bằng GitHub Desktop.

## 3. Ưu tiên sạch hóa (clean-pass)
1. **B1:** làm thử một bản shell sạch trên bản sao, giữ xe hai bánh, dù kem và quầy thiết bị bắt buộc; bỏ menu bảng rời, chậu hoa mua riêng và đèn premium nếu là vật phẩm decor. Giữ lại cây và cỏ thuộc bối cảnh cố định. Sáu slot: S1, S5, S6, S8, S11, S14; chỉ đo tọa độ trên shell đã sạch.
2. **B6:** chỉnh gác lửng một phần, khác hẳn B7; không dùng bản hai tầng cũ như đã đạt.
3. **B2–B5 và B7–B8:** rà vật phẩm baked, thêm/chỉnh shell theo tiêu chí từng bậc, xử lý crop mobile.
4. **B9:** giữ bản concept cũ để đối chiếu lịch sử, tìm lại **mẫu B9 được duyệt muộn hơn**, mái xanh than và sân nước. Không tự recolor và gọi là bản chốt.
5. Khi có shell sạch và người dùng duyệt: xuất `assets/images/v88/shops/boba-bN.webp`, đo toàn bộ anchors hợp lệ và cập nhật `approved:true` theo từng ảnh, chạy browser QA/screenshot.

## 4. Phương án đồng bộ
- Nhóm **preview chỉ để kiểm duyệt**: `assets/images/v88/concepts/boba-b1-concept.webp` → `boba-b9-concept.webp`.
- Nhóm **game production** chưa tạo: `assets/images/v88/shops/boba-b1.webp` → `boba-b9.webp`.
- Không dùng preview ở đường dẫn shell game, không bật `approved` giả.
- Bảng mapping đi kèm ZIP review: `manifest.json`, `BANG_ANH_XA_9_BAC.csv`, `index.html`.
- Không sửa `js/game.js`, `gameState.decorations`, `decorV88` hay thiết kế B7/B8/B9 đã chốt.

**Kết luận:** 9 ảnh Trà Sữa đã có sẵn từ trước. Đợt 5A khôi phục, phân loại và đăng ký metadata, không tự tạo ảnh mới hoặc tự nhận 9 shell đã hoàn thành.
