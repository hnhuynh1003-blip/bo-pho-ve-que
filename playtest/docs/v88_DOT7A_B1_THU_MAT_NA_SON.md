# Bỏ Phố Về Quê v88 — Đợt 7A: Mặt nạ sơn màu Trà Sữa B1 từ ảnh gốc (DRAFT)

**Trạng thái:** Đã thử tách màu vải dù, lập mặt nạ bảng tên động và 7 vùng decor cần dọn, tạo bộ QA offline. **CHƯA hoàn thành clean-pass**, **CHƯA tích hợp art sản xuất**, **CHƯA merge**.
**Nguồn:** ảnh `TRA_SUA_B01_PREVIEW.webp` (1200×900) đã được người dùng cung cấp trong `DUDU_STUDIO_TRA_SUA_9_BAC_KIEM_DUYET_V1(1).zip` và khôi phục ở Đợt 5A. Không thay thế bằng ảnh khung giao diện AI mới.

## Kết quả có thể kiểm chứng
- Trích xuất mặt nạ thử nghiệm từ chính ảnh gốc cho **các dải vải dù xanh ô-liu**. Những sọc kem, cảnh cây/làng, dụng cụ pha chế và thân xe giữ từ ảnh gốc. Ảnh sắc độ chỉ là thử nghiệm, cần kiểm tra biên (đặc biệt các nếp gấp và lớp vải sát thanh gỗ).
- Có **6 bản preview**: `original` (ảnh nguyên gốc), `cream`, `vanilla`, `tea_rose`, `sage`, `honey`. Năm mã sơn có thể chọn là đúng whitelist `REGIONS.canopy` của `js/v88-shop-paint.js` ở B1–B2.
- Có **đề xuất bảng tên S1 trống** tại pixel `[492,323,706,368]` trên ảnh 1200×900, hiển thị thử chữ theo tên người chơi; đây là giao diện sơ đồ, không phải tấm bảng thật đã vẽ hoàn thiện.
- Có mặt nạ `MASK_B1_PURCHASED_PROPS_DRAFT.png` đánh dấu **R1–R7** từ kiểm duyệt trước, gồm đèn treo, menu đứng, ghế rời và chậu hoa. **Đã xác nhận danh mục cần dọn nhưng chưa thực sự xóa chúng khỏi ảnh**.
- Giữ sáu vị trí bản nháp `S1,S5,S6,S8,S11,S14`. Tọa độ vẫn ở trạng thái tham khảo và phải đo lại sau clean-pass.
- Ảnh thử trên chiều rộng 320/390/430 px đã xuất ra trong ZIP để rà crop; các ảnh này không phải kết quả kiểm thử ca bán trên điện thoại thật.

## Tệp QA offline được tạo
- `BPVQ_V88_B1_MAT_NA_SON_MAU_QA_DRAFT.zip` — tải trong cuộc trò chuyện; giải nén mở **`XEM_TRUOC_B1_SON_MAU.html`** để nhấn màu và thử bảng tên.
- `B1_SOURCE_UNMODIFIED.png`: ảnh gốc giữ nguyên pixel.
- `B1_CANOPY_6_PRESETS_QA.jpg`: bảng so sánh sáu màu.
- `MASK_B1_CANOPY_FABRIC_DRAFT.png`: mặt nạ sơn từ màu vải nguồn, cần retouch.
- `MASK_B1_SIGN_PROPOSED_DRAFT.png`: ô bảng tên đề xuất, không tự thêm vào production.
- `MASK_B1_PURCHASED_PROPS_DRAFT.png`: bảy khu vực cần clean-pass, **không phải ảnh đã xóa đối tượng**.
- `B1_MASKS_AND_ANCHORS_QA_DRAFT.png`: ảnh overlay để duyệt.
- `B1_COLOR_MASK_REVIEW.json`: dữ liệu trạng thái của bộ QA.
- `CANOPY_*_REVIEW.png`: ảnh thử màu, vẫn còn decor baked.

## Vì sao chưa đưa vào game?
Ba lần thử với công cụ tạo ảnh vẫn trả về **infographic giao diện** chứ không có ảnh gốc một cảnh được chỉnh trực tiếp đúng mục tiêu; các hình đó **không được dùng làm shell**. Sau đó mặt nạ và biến thể màu được xử lý có kiểm soát bằng Python/OpenCV/Pillow trên chính ảnh nguồn. Việc tô lại màu có giữ shading trên vải nhưng bản gốc vẫn còn đèn treo, ghế, bảng menu và chậu hoa: bật shell lúc này sẽ vi phạm quy tắc trang trí mua riêng.

**Cổng tiếp theo:** clean-pass thật R1–R7 trên **một bản sao** B1; kiểm định ảnh sạch, tạo lớp sign không bake tên, retouch màu vải sát biên, đo lại 6 anchor trên bản final, duyệt art, xuất WebP và mask sản xuất riêng, rồi mới cập nhật `BPVQShopScenesV88` `approved:true`.

## Bảo toàn mã/game
- `main` vẫn v87.8.0.1; PR #1 vẫn Draft.
- Chưa có binary image hoặc mask sản xuất được đưa lên repo; chỉ commit **JSON QA draft** `docs/v88_DOT7A_B1_MAT_NA_NHAP.json` và bài kiểm thử `tests/test_b1_mask_draft_v88.mjs`.
- `js/game.js`, `gameState.decorations`, `decorV88`, `shopAppearanceV88`, Xu, SP và công trình B7–B9 vẫn nguyên.
- `BPVQShopScenesV88.get('boba',1).isReady` bắt buộc **false** cho đến khi có ảnh shell sạch được duyệt và đủ anchors.
