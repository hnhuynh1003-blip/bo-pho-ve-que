# Bỏ Phố Về Quê v88 — Đợt 11B: Trà Sữa B1 Draft 5 (bản QA cục bộ, CHƯA DUYỆT)

**Ngày:** 11/10/2026. **Cơ sở:** Đợt 11A `docs/v88_DOT11A_B1_DRAFT4_QA_REVIEW.md`, hình gốc B1 1200×900 trong ZIP người dùng trực tiếp gửi.

## Quyết định chủ dự án
- **Chốt chậu hoa rời bên phải là vật trang trí mua riêng**: xóa khỏi clean shell, người chơi chỉ thấy khi đã mua và đặt từ Kho Nội Thất. Không xóa cây/hàng rào/cảnh quan tự nhiên.
- Giữ kiến trúc xe trà sữa B1 2 bánh, vải dù kem/xanh, bình trà, cốc, topping, mặt quầy, núi/cây/làng quê.
- Chưa duyệt mỹ thuật production, `BPVQShopScenesV88` giữ `approved:false` và `isReady:false`; **không** commit binary vào `assets/images/v88/shops/`.

## Kết quả ảnh Draft 5 tại gói kiểm duyệt ngoài repo
- `B1_DRAFT5_RETOUCH_CANDIDATE_CHUA_DUYET.png` 1200×900, SHA256 `c587d3587d7a5615126460f71809376f0fc3fb592e491466d7186acdf434b16d`.
- Ảnh được chỉnh trên **bản sao Draft 4**, dùng sao chép texture cục bộ từ **chính Draft 4** với vùng feather, không dùng ảnh infographic / scene AI thay thế; 3 vùng thay đổi: `R1` dư đèn trái, `R2` dư đèn phải, `POT` chậu hoa phải.
- Draft 4 → Draft 5: **29.958 pixel khác** trên 1.080.000 pixel (2,774%); vùng bao [293,294]–[1179,696]. Bốn vùng bảo toàn lõi mái, bánh lớn, bình trà và mặt trước quầy vẫn có **0 pixel thay đổi** so với Draft 4.
- Chậu hoa bên phải đã được loại khỏi bản nháp, thay bằng hàng rào/đất/hoa lá có sẵn bằng clone texture; **cần người duyệt nhìn kỹ sự lặp thanh dọc hàng rào** trước khi chốt.
- Hai cột đã được vá thử nhưng vẫn phải rà texture trùng, đường nối và vệt viền tại mức phóng 200–400%; không được tuyên bố clean-pass final.

## Sơn màu / mask
- `MASK_CANOPY_SOFT_DRAFT5_QA_CHUA_DUYET.png` 1200×900, grayscale 0–255 (163 mức xám), tạo từ mask nháp trước đó bằng lọc hạt nhỏ, phép đóng morphology 3×3 và Gaussian radius 0.8; **chỉ để QA**, không phải mask production.
- 6 biến thể Draft 5: ORIGINAL, CREAM, VANILLA, TEA_ROSE, SAGE, HONEY. Dùng màu từ chính các biến thể của Draft 4 và cắt theo mask QA; so với Draft 5 base, thay đổi tương ứng **27.246–27.333 pixel** mỗi màu, **0 pixel ngoài mask có alpha > 0**. Vùng chuyển tiếp mềm ở rìa mask vẫn cần duyệt bằng mắt để tránh nhuộm nếp viền/vật thể lạ.
- QA bên ngoài: trước/sau tổng quan, ba cặp crop LEFT/RIGHT/FLOWERPOT phóng 3×, 6 màu và `QA_MANIFEST_DRAFT5.json`.

## Ranh giới và backlog
| Nhánh | Trạng thái | Việc chờ |
|---|---|---|
| Chậu hoa trả phí bên phải | DRAFT 5 PROPOSED | Duyệt hàng rào được vá, xác nhận không còn chậu baked |
| Vết đèn/cột trái | DRAFT 5 PROPOSED | Rà texture cột, tán cây, bóng sáng dư |
| Vết đèn/cột phải | DRAFT 5 PROPOSED | Rà các lớp mái/dây lá/nhà nền, không lem vào đồ uống |
| Mask sơn | QA ONLY | Kiểm mask mềm, tô thử trên ảnh final |
| S1 và sáu anchor | CHƯA CHỐT | Giữ các điểm `S1,S5,S6,S8,S11,S14` dự thảo tại `docs/v88_DOT7A_B1_MAT_NA_NHAP.json`; đo lại trên asset được duyệt, test 320/375/390/430px |
| Art release | BLOCKED | Chỉ bật scene sau duyệt bằng mắt, WebP/mask riêng, asset thực, test mobile và save |

## Bảo toàn
- Gói ZIP PNG/JPG/manifest kiểm duyệt ở cuộc trò chuyện; **không** copy binary lên GitHub vì chưa được duyệt art.
- Không sửa `js/game.js`, `js/v88-shop-scenes.js`, giao diện gameplay, `gameState.decorations`, `decorV88`, `shopAppearanceV88`, `shopConstruction`, Xu/SP, nghề, nhân viên, ca/ngày, hoặc save v87.
- PR #1 vẫn Draft, `main` giữ nguyên, **0/9** clean shell Lô A được chấp thuận.
