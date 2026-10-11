# v88 — Đợt 7B: B1 clean-pass kỹ thuật bản nháp 3 (11/10/2026)

**Trạng thái:** CÓ bản ảnh trước/sau, preview 6 màu trên ảnh đã dọn, QA bằng pixel; **CHƯA DUYỆT ART, CHƯA NẠP GAME, CHƯA MERGE PR**.

## Tài nguyên gốc và bản thử
- Nguồn: `TRA_SUA_B01_PREVIEW.webp` người dùng cung cấp; ảnh làm việc `B1_SOURCE_UNMODIFIED.png`, 1200 × 900.
- Bản sạch nháp: `B1_CLEAN_BASE_DRAFT_3.png`, 1200 × 900, dựng dựa trên pixel từ nguồn bằng vá nền lân cận (seamlessClone) và inpaint giới hạn tại 7 vùng. **Không sử dụng ảnh infographic AI làm nền.**
- Bộ kiểm duyệt ở cuộc hội thoại: `BPVQ_V88_B1_CLEANPASS_KY_THUAT_DRAFT3.zip`, gồm ảnh gốc, ảnh nháp, JPG trước/sau, 6 biến thể màu dù, mặt nạ, 6 slot nháp, ảnh thu nhỏ 320/390/430, HTML offline và manifest.
- Mở `XEM_TRUOC_B1_SAU_LAM_SACH.html` từ ZIP để so sánh/đổi màu trên ảnh nháp. Các variant là PNG nguồn B1 thực, không phải mockup infographic.

## 7 khu vực đã thử xóa
| Region | Vật thể | Kết quả bước kỹ thuật |
|---|---|---|
| R1 | Đèn treo trái | Đã thử vá nền và cột, cần chỉnh tay mép gỗ |
| R2 | Đèn treo phải | Đã thử vá nền và cột, cần làm sạch phần sót/cạnh |
| R3 | Bảng menu đứng | Đã thay bằng texture cảnh sau, cần duyệt dải hàng rào |
| R4 | Hai ghế đẩu rời | Đã thay bằng mặt sân, cần duyệt bóng đổ và dấu nối |
| R5 | Chậu hoa trên quầy | Đã thay bằng bề mặt/quầy và vật dụng phục vụ, cần rà vật thể bị nhân bản |
| R6 | Chậu hoa + thùng gỗ rời trái | Đã vá lại hàng rào/nền, cần chỉnh tay chỗ chân xe |
| R7 | Chậu nhỏ phải | Đã thay vùng chậu sát quầy/hàng rào, cần rà tiếp mép |

Không tự nhận kết quả là xóa hoàn hảo: phần ghép nền bên phải và phần cột có thể còn dấu chắp, chỉ có thể quyết định khi xem ảnh đầy đủ.

## Kiểm định pixel bảo toàn hình gốc
So ảnh `B1_CLEAN_BASE_DRAFT_3.png` và `B1_SOURCE_UNMODIFIED.png`, 4 vùng quan trọng chưa đổi pixel (tỷ lệ pixel thay đổi = **0**):
- Vải dù chính `(401,177)-(783,282)`
- Bánh xe lớn `(382,577)-(565,745)`
- Bình nước trà `(399,352)-(508,487)`
- Mặt trước xe `(419,507)-(714,663)`

**Lưu ý:** bốn vùng chứng minh quy trình không đụng vào các crop đó, chứ không chứng minh toàn bộ ảnh không phát sinh lỗi ngoài crop.

## Sơn màu và slots
- Reuse mask xanh ô-liu từ `MASK_B1_CANOPY_FABRIC_DRAFT.png`. 6 trạng thái `ORIGINAL,CREAM,VANILLA,TEA_ROSE,SAGE,HONEY`: tương ứng gốc + 5 mã whitelist của `js/v88-shop-paint.js`.
- Chỉ dùng cách tô giới hạn vào mảng vải; không tự nhuộm toàn bộ cảnh, cây, quầy hoặc NPC.
- Slots B1: **S1, S5, S6, S8, S11, S14** đều là **tọa độ dự thảo** từ concept cũ, phải đo lại sau chốt clean-pass final.
- Biển tên `S1` sẽ cần một layer bảng gỗ riêng, chữ lấy từ `gameState.shopName`. Bản nháp KHÔNG bake tên quán hoặc nhận S1 đã hoàn thành.
- Chưa thử render vào gameplay v88 và chưa tạo 27 mask sơn vùng cho B2–B9.

## Bảo toàn và cổng duyệt
1. Bản cleaned draft chưa được tải binary lên GitHub bằng connector hiện có. Mọi file nhị phân chỉ nằm trong ZIP cuộc hội thoại.
2. `js/v88-shop-scenes.js` **không được** đổi `boba-b1` thành `approved:true` lúc này. `BPVQShopScenesV88.get('boba',1).isReady` vẫn `false`.
3. Trước game cần duyệt hình, sửa mép cột/gạch sân, kiểm tra hai bánh xe, xuất shell sạch; làm S1 dynamic + anchor final, chạy test mobile và save.
4. Không sửa `js/game.js`, Xu, SP, nội thất, nghề, bản B7–B9 đã duyệt. Giữ PR #1 Draft; `main` không đổi.

**Ưu tiên quyết định tiếp theo:** người dùng duyệt/chỉ lỗi ở ảnh trước–sau; sau đó retouch đúng các vùng chưa ổn rồi mới mở khóa shell B1.
