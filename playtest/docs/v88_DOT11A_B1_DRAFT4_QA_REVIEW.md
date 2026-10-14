# Bỏ Phố Về Quê v88 — Đợt 11A: Rà soát Trà Sữa B1 Draft 4 (CHƯA DUYỆT)

**Ngày rà soát:** 11/10/2026. **Phạm vi đã duyệt:** đọc/so ảnh gốc, Draft 3, Draft 4, mask, 6 màu; đánh giá PASS/FAIL; khuyến nghị công việc còn lại, neo sơ bộ và S1. **Không retouch ảnh nguồn / không thay art, gameplay, save, tiền, SP, kho, nghề.**

**Nguồn kiểm định:** người dùng tải trực tiếp `BPVQ_V88_TRA_SUA_B1_CLEANPASS_DRAFT4_KIEM_DUYET(1).zip` (gói QA độc lập, KHÔNG commit binary trong PR); `README.txt`, `B1_DRAFT4_QA_MANIFEST.json`, ba ảnh 1200×900, hai mask 1200×900, ảnh đối chiếu và sáu biến thể màu. Dữ liệu mô tả và ảnh pixel thực đã đối chiếu. Không ghi đè source.

## 1. Kết quả tổng hợp

| Mã | Hạng mục | Kết quả | Nhận xét |
|---|---|---|---|
| QA-01 | Ảnh độc lập đúng tỷ lệ | PASS kỹ thuật | Source, Draft 3, Draft 4 đều PNG RGB 1200×900 (4:3). Không phải crop infographic. |
| QA-02 | Nhận diện Trà Sữa B1 | PASS thiết kế | Xe gỗ, dù kem/xanh, bình trà, ly và topping; một bánh lớn và bánh nhỏ nhìn thấy theo góc vẽ. |
| QA-03 | Giữ cấu trúc cũ | PASS trên ROI kiểm định | Source→Draft 4 không thay pixel ở mái lõi [420,180,745,263], bánh lớn [385,570,580,760], bình trà [405,350,505,480], mặt trước [540,512,787,663]. Không khẳng định toàn ảnh bất biến. |
| QA-04 | Retouch cột/đèn bên phải | FAIL mỹ thuật | Tại khoảng x=781–882,y=275–409: còn mảng dây lá và vết ghép gỗ/nền, mép cột bị chắp. |
| QA-05 | Retouch cột/đèn bên trái | FAIL mỹ thuật | Vết bóng cam/vệt sáng sau khi xóa đèn gần x=312–395,y=280–408; dọc mép cột còn đứt texture. |
| QA-06 | Tách decor trả tiền | BLOCKED quyết định | Menu, ghế rời đã biến mất; chậu hoa rời ngoài rìa phải gần x=1050–1185,y=570–702 vẫn còn. Cần xác định là scenery cố định hay decor mua riêng (nếu loại sau phải loại). |
| QA-07 | Mask canopy | FAIL production | Mask 1200×900, L trắng/đen 0/255, 24.012 px trắng (~2,22%), 49 thành phần liên thông; không có độ xám antialias. Viền vải lỗ/răng cưa, cần lớp mask final. |
| QA-08 | Sơn 6 trạng thái | PASS chức năng QA / FAIL sản xuất | Ảnh mặc định trùng byte với Draft 4; 5 màu còn lại có đổi màu. Mỗi màu đổi khoảng 4.713–4.925 px ở ngoài mask nhị phân; đa phần gần viền (hiệu ứng làm mịn), nhưng biến thể CREAM có 80 px đổi >2 đơn vị RGB cách mask trên 2 px, cụm x=805–826,y=294–309; cần vệ sinh mask/thuật toán tại mảng phải. |
| QA-09 | Mask xóa decor | REVIEW ONLY | 1200×900, L 0/255, 130.680 px trắng (~12,10%), 3 vùng liên thông lớn, là vùng chỉ dẫn retouch; **không dùng như runtime paint mask**. |
| QA-10 | Biển S1 | PROVISIONAL | Chưa có biển động trong ảnh nền; code S1 hiện có và chỉ render khi scene approved. Hộp tạm [492,323,706,368] chưa nghiệm thu chạm mobile. |
| QA-11 | 6 anchor | PROVISIONAL | Giữ bản nháp từ docs/v88_DOT7A_B1_MAT_NA_NHAP.json; cần đo lại trên bản clean shell cuối trước khi bật scene. |
| QA-12 | Cổng release | BLOCKED đúng thiết kế | Giữ `approved:false`, `artReview:'pending'`, `isReady:false`, 0/9 shell đạt chuẩn Lô A. |

## 2. Số liệu so sánh pixel (ảnh 1200 × 900)

- Source→Draft 3: 136.074 pixel khác (~12,599%), bbox [228,292]–[1071,785].
- Source→Draft 4: 140.780 pixel khác (~13,035%), bbox [228,275]–[1071,785].
- Draft 3→Draft 4: 10.356 pixel khác (~0,959%), bbox [781,275]–[882,409].
- Bốn ROI vật thể chính ở QA-03 có **0 pixel khác** so với source; đây là bằng chứng có phạm vi, không phải chứng nhận mỹ thuật.
- Ảnh màu: 5 màu thay đổi 28.715–28.937 pixel / biến thể; 24.012 px nằm trên mask trắng, còn khoảng 4,7–4,9 nghìn pixel nằm ngoài mask trắng ở mỗi màu. Phần lớn nằm trong viền lân cận; cần chuẩn hóa mask chống đổi màu nền.
- Đối với CREAM: 80 pixel màu khác >2 RGB nằm ngoài vùng giãn mask 2 px, tập trung [805,294]–[826,309] sát vùng retouch phải. Không khẳng định năm biến thể đều có y hệt 80 pixel.

## 3. Anchor tạm — KHÔNG ghi registry runtime

Dữ liệu dưới đây **giữ nguyên nguồn từ `docs/v88_DOT7A_B1_MAT_NA_NHAP.json`**, chiếu ra pixel theo 1200×900; chưa có xác nhận cuối bằng ảnh clean shell final.

| Slot | x | y | Pixel (làm tròn) | layer | Gợi ý đánh giá |
|---|---:|---:|---|---:|---|
| S1 biển hệ thống | .505 | .373 | 606,336 | 4 | Giữa dù và dụng cụ; hộp [492,323,706,368] chỉ là mô hình tham khảo. |
| S5 nhóm decor quầy | .322 | .557 | 386,501 | 3 | Mép trái quầy, cần kiểm tra vật thể mới không che khăn/bình. |
| S6 nhóm decor quầy | .612 | .557 | 734,501 | 3 | Bên phải quầy, tránh chặn cốc, chai nước cốt và topping. |
| S8 đèn treo | .298 | .448 | 358,403 | 4 | Bám cột trái nhưng phải xóa hết bóng đèn baked cũ. |
| S11 vị trí đất/cạnh trái | .242 | .706 | 290,635 | 3 | Cần kiểm tra giao giữa hàng rào và vật đặt khi thu nhỏ màn. |
| S14 cụm hoa | .172 | .836 | 206,752 | 3 | Nền đất ngoài trái, cách mép dưới để sprite không cắt chân. |

**Biển S1:** giữ logic tên từ `gameState.shopName`, tối đa 32 ký tự, escape HTML, `dynamic-overlay`; không dán chữ lên ảnh. Hộp [492,323,706,368] khi ảnh co rộng 390px còn khoảng 69,6×14,6px tương đương, trong khi CSS `.v88-arch-shop-sign` có `min-height:25px`; cần test hiển thị thật để ngăn che mái/thiết bị, điều chỉnh UI sau khi người dùng duyệt vị trí.

## 4. Backlog chốt Đợt 11B (cần người dùng duyệt trước khi chỉnh ảnh)

| ID | Mức | Công việc | Nghiệm thu |
|---|---|---|---|
| 11B-01 | P0 | Retouch lại bên trái và bên phải dưới viền dù; dọn vệt sáng cam, lá bất thường, texture gỗ chắp và đường ranh nền. | QA crop 200% không còn dấu vết đèn/vá; không sửa vải dù, bánh, bình trà, mặt quầy. |
| 11B-02 | P0 | Quyết định chậu hoa rời bên phải x=1050–1185 là scenery hay decor mua riêng; xóa nếu là decor trả tiền. | Không có vật phẩm phải mua đang baked; giữ cây/hàng rào thiên nhiên. |
| 11B-03 | P0 | Làm mask canopy final có viền antialias đồng bộ với ảnh retouch cuối và kiểm tra viền phải x=805–826. | Sơn không đổi nền trời/cây/cột dù, không đục lỗ ngoài ý muốn; test 5 màu. |
| 11B-04 | P1 | Căn biển hiệu S1 trên ảnh mới và thử tên ngắn/dài ở 320/375/390/430px; review có/không treo dây/biển gỗ. | Không che đỉnh bình trà/cốc; chỉ 1 S1; tương thích màn nhỏ. |
| 11B-05 | P1 | Đo lại sáu anchor từ ảnh cuối, thử từng decor được phép, lưu thông tin vị trí/layer. | Đủ 6/6; không đè quầy, kho, khách, ảnh khi resize; chưa đổi registry khi chưa duyệt. |
| 11B-06 | P1 | Trình before/after vùng vá 200%, năm preset + gốc, hai mock mobile và checklist cho chủ dự án. | Chủ dự án xác nhận art bằng mắt. Sau đó mới xem xét WebP, mask final, commit binary và release gate. |

## 5. Quyết định

**Đợt 11A hoàn thành công tác rà soát, không phải hoàn thành asset.** Trà Sữa B1: **NEEDS REVISION**, chưa đủ tiêu chuẩn ứng viên release; 0/9 scene clean shell của Lô A. Đợt 11B chỉ thực hiện khi chủ dự án duyệt phạm vi retouch và quyết định chậu hoa ở QA-06.

**Bảo toàn:** không đổi `main`; PR #1 vẫn Draft; giữ nguyên `gameState.decorations`, `decorV88`, `shopAppearanceV88`, `shopConstruction`, Xu, SP, nghề, nhân viên, ca và save v87; không tạo asset giả hoặc tự bật approved.
