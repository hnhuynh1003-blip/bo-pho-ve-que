# Bỏ Phố Về Quê v88 — Lô A: B1–B3 của 3 nghề (9 cảnh)

**Tình trạng:** Chốt hướng sản xuất theo lô, có **9 hồ sơ scene**, có bảng minh họa lô A và công cụ duyệt offline. **Chưa có 9 ảnh clean shell**, không merge PR #1, không đổi main.

## 1. Nguồn ảnh thực đã tìm thấy
- Gói `DUDU_STUDIO_TRA_SUA_9_BAC_KIEM_DUYET_V1(1).zip` cung cấp `TRA_SUA_B01_PREVIEW.webp`, `TRA_SUA_B02_PREVIEW.webp`, `TRA_SUA_B03_PREVIEW.webp` (3 ảnh concept độc lập cho lô A).
- **Mì Cay và Xiên Que chưa có ảnh shell độc lập** trong ZIP cũ. Ảnh minh họa 3×3 `a_large_colorful_infographic_style_concept_sheet.png` được tạo riêng để đối chiếu **hình khối và bản sắc nghề**, không phải 6 file game-ready.
- Gói kiểm duyệt ở cuộc hội thoại `BPVQ_V88_LO_A_B1_B3_3_NGHE_CONCEPT_QA.zip` gồm 3 WebP gốc không đổi byte, 6 crop bản minh họa chỉ tham khảo, `manifest_lo_a.json`, `XEM_LO_A_B1_B3.html`.
- **0/9 clean shell được phê duyệt**. Trà Sữa B1 clean-pass số 3 là bản nháp có thể tái sử dụng sau retouch nhưng chưa đạt xuất bản.

## 2. Thiết kế bắt buộc cho từng hàng (B1 / B2 / B3)
| Bậc | Kiến trúc chung | Nội dung từng nghề | Slot mở | Vùng Sơn Màu |
|---|---|---|---|---|
| **B1** | Xe gỗ **hai bánh**, mái dù/vải; **không dựng nhà** | Trà Sữa: bình trà, ly, topping; Mì Cay: nồi nước cốt, bếp nhỏ, khay topping; Xiên Que: vỉ nướng có chắn, xiên, khay nước chấm | 6: S1,S5,S6,S8,S11,S14 | Dù và biển |
| **B2** | **Quầy cố định có mái, không bánh xe**. Lối khách chờ nhỏ, không thành nhà hàng hai tầng | Cùng nghề, nâng diện tích chế biến thay vì thêm decor dính vào ảnh | 9: thêm S2,S7,S9 | Dù và biển |
| **B3** | Tiệm gỗ nhỏ **một tầng có vách, mái rõ**, mặt tiền khác B2 | Cùng nghề, thiết bị chuyên môn nhiều hơn trên phần diện tích đúng bậc | 11: thêm S3,S15 | Mái nhà, tường, biển |

**Ngoại lệ đã phát hiện:** `TRA_SUA_B02_PREVIEW.webp` vẫn là xe có bánh — **không** dùng như B2 production; phải chuyển thành quầy cố định. B3 concept và mọi ảnh infographic có nhiều decor, cần tách đồ mua riêng.

## 3. Cơ chế mới đã đưa lên nhánh v88
- `docs/v88_BATCH_A_9_SCENES_SPEC.json`: đặc tả máy đọc được của 9 scene, mỗi scene có nghề, bậc, hình khối, thiết bị bắt buộc, ID slot, vùng sơn, ảnh nguồn, danh sách chốt chất lượng và trạng thái phát hành.
- `tests/test_art_batch_a_v88.mjs`: đối chiếu trực tiếp với `BPVQShopScenesV88.stageSlots()` và `BPVQShopPaintV88.regions()` của v88; test 3 nghề × 3 bậc, 9 ID độc lập, 6/9/11 slot, các vùng màu đúng bậc, B2 cố định, cấm tự đánh dấu `approved`.
- `.github/workflows/phone-os-v88.yml`: chạy test lô A cùng bộ chống lỗi hồi quy có sẵn.
- **Không** sửa `js/game.js`, hệ Xu/SP/nhân sự, `decorations`, `decorV88`, `shopAppearanceV88`, `shopConstruction`, tên quán S1 hoặc renderer đã duyệt.

## 4. Quy trình áp dụng cho cả ba nghề
1. **Bản kỹ thuật:** chuẩn 4:3, tối thiểu 1200×900; góc nhìn 3/4, ánh sáng ban ngày, bố cục xe/quầy/tiệm theo từng bậc.
2. **Tạo/tìm ảnh game riêng** đúng từng nghề. Tuyệt đối không cắt ảnh infographic/đổi tên biển của một nghề để thay cho nghề khác.
3. **Clean-pass theo lô:** giữ thiết bị nghề bắt buộc, loại bỏ NPC và vật phẩm chỉ xuất hiện khi người chơi mua; bảng tên lấy từ save qua S1.
4. **Mask Sơn Màu:** chỉ trên dù/biển ở B1–B2; chỉ mái/tường/biển ở B3, không nhuộm cây/sân/đồ ăn hoặc khóa màu B9.
5. **Neo vị trí:** đo tọa độ sau clean-pass, theo ID slot thực; kiểm thử không tràn, không che vùng bếp/khách.
6. **Kiểm duyệt một lần trên bảng 9 ảnh:** nếu một ảnh thiếu/chưa đạt, chỉ hoãn riêng scene; không phát hành giả bằng ảnh placeholder.
7. **Chỉ sau khi duyệt** mới có thể xuất WebP `assets/images/v88/shops/{career}-b{tier}.webp`, mask hoàn thiện, `approved:true`, test sản phẩm trên Android/iPhone thật và save lịch sử.

## 5. Công việc tiếp theo và giới hạn
- **Chưa có ảnh Mì Cay/Xiên Que độc lập B1–B3.** Bảng ảnh 3×3 chỉ giúp duyệt mẫu mặt tiền; các ô cắt ra vẫn dính nhãn và vật trang trí.
- **B1 Trà Sữa:** retouch mép gỗ, nền sân và sản xuất mask được duyệt.
- **B2 Trà Sữa:** sửa khác hình khối B1 thành quầy cố định, không dùng concept cũ nguyên dạng.
- **B3 Trà Sữa:** dọn decor baked, đo 11 anchor.
- Không kéo sang B4–B9 trước khi lô A qua cổng chất lượng. Thiết kế B7–B9 được giữ nguyên.
- Trạng thái repo: **3 concept độc lập trong gói ZIP ngoài repo, 6 crop của bảng hướng dẫn, 0/9 ảnh clean shell production**. Không suy đoán ảnh ở Library là art đã duyệt khi chưa kiểm tra ảnh thực.

**Đường phát hành:** PR #1 tiếp tục Draft, main không đổi. Duyệt cả lô, không duyệt từng chiếc đèn hay slot riêng lẻ.
## 6. Bản kiểm duyệt REV2 — 11/10/2026
- Từ lần dựng hình mới, hệ thống vẫn trả về **ảnh infographic 3×3**, không phải 9 shell cảnh riêng. Không dùng nguyên bảng hoặc các ảnh crop trong `assets/images/v88/shops/`.
- Gói kiểm duyệt ngoài repo: **`BPVQ_V88_LO_A_REV2_9_HINH_THAM_KHAO_QA.zip`**, gồm 3 WebP concept Trà Sữa **giữ nguyên byte**, 6 crop tham khảo Mì Cay/Xiên Que **có nhãn gốc** và bản B1 clean-pass draft3 **chưa duyệt**.
- `docs/v88_BATCH_A_REVIEW_REV2.json` ghi rõ nguồn 9 hình, trường `productionArt:null`, `approved:false`, cờ `measuredAnchorsReady:false`, `maskReady:false`. Những file crop có `sourceType:infographic-crop-reference`; **không được quảng bá là ảnh shell**.
- **Ngoại lệ phải sửa trước khi duyệt:** Trà Sữa B1 còn lỗi ghép cột/nền, Trà Sữa B2 concept có **bánh xe** trái quy chuẩn quầy cố định, Trà Sữa B3 còn decor baked; sáu hình nghề khác chưa được tạo dạng cảnh riêng và còn nhãn banner. B1 nghề khác trong bảng chỉ là hướng ngoại hình, không thay cho tài nguyên game.
- `tests/test_batch_a_review_rev2_v88.mjs` kiểm tra đủ 9 mã cảnh, có **3 ảnh concept gốc**, **6 infographic crop**, và **0 production shell**; QA chạy trong CI. Điều này không đồng nghĩa 9 hình đã hoàn thành.
- Cổng sản xuất thực sự: mỗi công trình có ảnh WebP độc lập, đúng bậc, không dính UI/decor mua thêm, mask sơn theo bậc và số neo 6/9/11 được đo trên ảnh đã sửa. Chỉ bật manifest công trình khi qua duyệt mỹ thuật và kiểm thử mobile/save.

**Trạng thái lô A sau REV2: 9 tham khảo, 0 ảnh nền sạch đạt chuẩn gameplay.** PR tiếp tục Draft và `main` vẫn là v87.8.0.1.

## 7. Xác nhận chủ dự án: CHỐT HƯỚNG THIẾT KẾ LÔ A — 11/10/2026
**Quyết định:** ĐÃ DUYỆT phương án kiến trúc và hướng sản xuất lô A gồm **3 nghề × B1–B3 = 9 cảnh**. Chốt quy trình kiểm duyệt theo lô thay vì kiểm duyệt từng món trang trí.

**Phạm vi đã duyệt:** B1 xe đẩy hai bánh, B2 quầy cố định không bánh xe, B3 tiệm gỗ một tầng; Trà Sữa dùng bình trà/topping, Mì Cay dùng bếp/nồi nước cốt, Xiên Que dùng vỉ nướng/khay xiên; bảo toàn bộ ID slot và vùng sơn đã thống nhất. Tái sử dụng ảnh Trà Sữa gốc làm tham chiếu, không vẽ lại toàn bộ kiến trúc đã thống nhất một cách vô ích.

**Không được hiểu là duyệt ảnh sản xuất:** 9 hình đối chiếu trong gói REV2 là **3 concept cũ + 6 crop từ infographic**. Chưa có 9 shell sạch độc lập. B1 draft chưa retouch mỹ thuật, B2 Trà Sữa gốc còn bánh xe, các cảnh nghề khác vẫn chưa có file chuẩn; do đó **số ảnh game-ready = 0/9**. Không tự cập nhật `approved:true`, không copy ảnh crop vào thư mục `shops`.

**Trình tự đã chốt:** (1) hoàn thiện clean-pass + mask/anchor mẫu B1; (2) sản xuất đủ 9 ảnh đơn lẻ đúng nghề, đúng bậc; (3) QA nghệ thuật và bố cục chung bằng một contact sheet; (4) đo anchor theo từng ảnh, xuất mask/asset tối ưu; (5) kiểm thử giao diện dọc, ca bán, save cũ rồi mới đề xuất nghiệm thu asset. **Không merge `main` nếu chưa có yêu cầu phát hành riêng.**

Máy đọc quyết định này ở trường `designDecision` trong `docs/v88_BATCH_A_9_SCENES_SPEC.json`; trường `scenes[].ready` vẫn là `false` cho cả 9 cảnh.
