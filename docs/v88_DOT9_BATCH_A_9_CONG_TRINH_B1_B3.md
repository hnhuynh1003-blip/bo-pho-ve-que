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