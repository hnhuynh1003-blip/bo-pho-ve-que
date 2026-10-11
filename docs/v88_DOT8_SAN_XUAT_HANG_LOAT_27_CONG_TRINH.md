# v88 — Đợt 8: Quy trình xử lý hàng loạt 27 công trình (ĐÃ DUYỆT HƯỚNG)

**Trạng thái:** Đã tạo tool kiểm kê tự động và bộ QA offline 27 công trình; **chưa sản xuất 27 ảnh clean shell**, PR #1 Draft, `main` giữ v87.8.0.1.

## 1. Cơ sở và kiểm kê
- **3 nghề**: `boba` (Trà Sữa), `noodle` (Mì Cay), `streetfood` (Xiên Que).
- **9 bậc/nghề** = **27 tổ hợp scene**, không phải 27 bậc riêng của một quán.
- Bộ `DUDU_STUDIO_TRA_SUA_9_BAC_KIEM_DUYET_V1(1).zip` người dùng gửi có **9 WebP concept Trà Sữa**. **18 scene nghề khác chưa có nguồn trong bộ này.**
- Trà Sữa B1 đã có **clean-pass kỹ thuật bản nháp 3**, mặt nạ dù thử nghiệm, bảng tên S1 và 6 điểm neo nháp. **Chưa duyệt hình cuối**, chưa có ảnh và mask production.
- B6 concept cũ mô tả hai tầng quá hoàn chỉnh: **phải chỉnh gác lửng một phần**.
- B7: **một nhà chính hai tầng và cầu thang ngoài**; S17 không chắn đường, S20 ở dầm.
- B8: **ba công trình ôm sân chữ U**, vẫn nhỏ hơn flagship B9.
- B9 ảnh mái ngói đỏ trong ZIP là **bản lịch sử**; bản thiết kế đã duyệt mới có **mái xanh than/xanh đen, hai cánh cân xứng, sân nước**. Không dùng ảnh cũ thay thế.

## 2. Quy trình mới theo lô — không duyệt từng chi tiết
| Giai đoạn | Danh sách | Công việc chung | Cổng nghiệm thu |
|---|---|---|---|
| Mẫu chuẩn | Trà Sữa B1 | Dọn vật thể phải mua, chốt shell, mặt nạ dù/biển, S1 động, 6 anchor | Duyệt **một bộ mẫu** + QA mobile |
| Batch A | B1–B3 × 3 nghề (9 scene) | Cùng cơ cấu xe/quầy/tiệm gỗ nhưng mô hình và dụng cụ mỗi nghề riêng | Duyệt **một bảng tổng 9 ảnh**, báo các ngoại lệ |
| Batch B | B4–B6 × 3 nghề (9 scene) | Giữ phân cấp nhà gia đình, B5 mái ngói đỏ một tầng, B6 gác lửng | Duyệt **một bảng tổng 9 ảnh**, test slot và màu |
| Batch C | B7–B9 × 3 nghề (9 scene) | Neo kiến trúc cao bậc theo ảnh duyệt, không tái thiết kế B9 | Duyệt **một bảng tổng 9 ảnh**, giữ các khóa thiết kế |

Các mục vượt mẫu như B6 sai hình khối, B9 sai thiết kế và decor vẫn dính shell không được tự động "chữa" bằng tô màu; phải vào danh sách **ngoại lệ** và dừng duyệt riêng scene đó. Việc duyệt theo lô **không đồng nghĩa tự phát hành tất cả**.

## 3. Công cụ batch đã thêm vào repo
`scripts/v88-batch-art.mjs`:
- Đọc nguồn WebP từ thư mục ZIP đã giải nén; tìm theo ID nghề/bậc và **không tự chọn khi trùng tên**.
- Xuất `qa_manifest.json` (27 record, hash SHA256, kích thước header WebP, tình trạng), `qa_board.csv`, `index.html` offline; sao chép WebP **nguyên byte** dưới tên `concepts/{career}-bN-concept.webp`.
- Đánh dấu **CONCEPT-ONLY**, không tự tạo mới ảnh nghề còn thiếu, không tạo `assets/images/v88/shops/`, không tự bật `approved:true`, không sửa `js/game.js` hoặc save.
- Phân lô A=B1–B3, B=B4–B6, C=B7–B9.
- Không dùng tên file/định dạng/ảnh cũ làm bằng chứng art đã duyệt. Kiểm tra WebP hiện chỉ là **header**, chưa chứng minh không có lỗi rendering/mỹ thuật.

Lệnh mẫu sau khi giải nén ZIP:
```bash
node scripts/v88-batch-art.mjs \
  --source-dir "./thu_muc_chua_anh_concept" \
  --out-dir "./artifacts/v88-batch"
```
Mở `artifacts/v88-batch/index.html` bằng trình duyệt để kiểm tra 27 record và ảnh thực có sẵn.

**Bộ offline đã đóng gói trong cuộc hội thoại**: `BPVQ_V88_KIEM_DUYET_THEO_LO_27_CONG_TRINH.zip`. Gồm 9 ảnh Trà Sữa không sửa, manifest đầy đủ 27 record, HTML gallery và **B1 draft 3 riêng**, không trộn vào thư mục `shops`.

## 4. Kiểm thử và điều kiện bảo toàn
- `tests/test_art_batch_v88.mjs`: tạo data thử bằng WebP thực có trong repo, kiểm tra 27 record, ID duy nhất, batch A/B/C, SHA, copy nguyên byte, 6→24 slot, cảnh báo B9, chặn khi trùng input; không sinh ảnh game giả.
- Các regression hiện có: 3 nghề độc lập, save v87 mô phỏng, B1→B9 Xu/SP, 24 slot, Sơn Màu, bảng tên S1, Phone ca bán, 45 bố cục Chromium, WebKit.
- Tách rõ `concept`, `clean-pass draft`, `approved shell`, `shipped scene`; chỉ nâng trạng thái khi đã có hình final + mask đã duyệt + đủ neo và test nhìn bằng mắt.
- **Không cấp Xu/SP, không thêm slot, không tự tặng decor, không đổi nghề, không thêm app trùng lặp và không bypass save migration.**
- Không đưa 27 ảnh chung vào mã game khi số còn thiếu hoặc chưa có mask chuẩn.

## 5. Việc còn lại (không nhận là đã hoàn thành)
1. Retouch nghệ thuật thật trên clean-pass B1 (cột gỗ, mép nền sân), duyệt hình trên một cảnh đơn. Các lần thử ImageGen trước trả infographic không phải ảnh chỉnh đúng nguồn; không sử dụng các hình đó.
2. Đo neo chính thức trên B1 final, khóa vùng `canopy/sign`, kiểm tra ảnh dọc 320/390/430 và WebKit.
3. Dựng/tìm ảnh Mì Cay và Xiên Que **theo nghề riêng**, không sao chép hình Trà Sữa và thay tên.
4. Xử lý từng nhóm 9 ảnh theo mẫu chuẩn, xuất contact sheet và CSV kiểm duyệt; giải quyết ngoại lệ trước khi coi lô được duyệt.
5. Chỉ commit binary game-ready khi đủ ảnh/duyệt. PR #1 luôn Draft cho tới khi người dùng yêu cầu phát hành.

**Ghi chú tiến độ:** **9/27 concept tìm thấy; 18/27 thiếu nguồn; 0/27 đã duyệt shell production** tại thời điểm lập tài liệu.
