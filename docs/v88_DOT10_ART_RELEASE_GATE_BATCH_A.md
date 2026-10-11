# v88 — Lô A / Cổng xuất bản art độc lập (11/10/2026)

## Kết quả sản xuất hình
- Đã duyệt **hướng nghệ thuật, bản sắc nghề và hình khối** cho B1–B3 × 3 nghề. Chưa duyệt art cuối.
- Hai lượt sinh ảnh sau khi chốt vẫn xuất **bảng 3 × 3** thay vì **cảnh đơn độc lập**, kể cả lượt mô tả riêng **Mì Cay B1**. Không sử dụng các bảng này hoặc hình crop phóng lớn làm WebP gameplay: có banner UI, menu, ghế/đèn/chậu decor mua thêm baked, và độ phân giải mỗi ô không đủ.
- Nguồn vẫn chỉ có **ba ảnh Trà Sữa B1–B3** độc lập dạng concept và B1 clean-pass DRAFT 3 chưa được duyệt. **0/9 scene B1–B3 sẵn sàng**.
- Không lấy ảnh Trà Sữa rồi sửa biển thành Mì Cay/Xiên Que. Không ép game chạy ảnh thiếu asset hoặc ảnh minh họa.

## Công việc đã triển khai để sản xuất an toàn theo lô
- Tạo `scripts/v88-art-release-gate.mjs` để rà **27 scene** từ `js/v88-shop-scenes.js` và chặn cấu hình có dấu hiệu được đánh dấu duyệt mà không có đủ vật liệu.
- Mỗi cảnh muốn đề xuất xuất bản cần: ảnh `assets/images/v88/shops/{career}-b{tier}.webp` có mặt **thực sự** trong repo, header WebP hợp lệ và kích thước **>=1200×900, gần tỷ lệ 4:3**; `sourceKind:'standalone-clean-shell'`; bản ghi `artApproval` người duyệt dự án; đúng toàn bộ slot theo bậc (B1=6, B2=9, B3=11 … B9=24).
- Mỗi vùng **Sơn Màu** đã mở cần lớp riêng. `sign` là biển động `dynamic-overlay`; `canopy/roof/wall/wood/light` cần mask PNG trùng chiều ảnh, ví dụ `assets/images/v88/masks/boba-b1-canopy.png`. B9 mái xanh than khóa không yêu cầu mask mái thay đổi.
- Chặn `infographic-crop`, `concept-preview`, đường dẫn lạ, asset vắng mặt, thiếu duyệt art, thiếu mask, thừa/thiếu neo.
- Đây là **kiểm tra cấu trúc/metadata**, không xác nhận chất lượng hình bằng mắt, không đảm bảo ảnh WebP giải mã hoàn chỉnh hay proof rằng con người thật đã duyệt. Cần kiểm tra thủ công và browser real-load/đánh giá mỹ thuật sau.
- Test `tests/test_art_release_gate_v88.mjs` bao phủ **27 bản nháp hợp lệ vẫn khóa**, cấu hình art giả, ảnh thiếu, mask thiếu, không có duyệt, sai slot, path traversal; tích hợp vào workflow `.github/workflows/phone-os-v88.yml`.

## Cổng bắt buộc trước lần cập nhật art kế tiếp
1. Dùng công cụ có khả năng **tạo/chỉnh từng ảnh riêng thật**, không lặp lại infographic. Dừng ngay nếu ảnh trả không đúng một cảnh đơn.
2. Một cảnh B1 Mì Cay riêng: xe hai bánh + nồi nước cốt + khay topping; không đèn/ghế/hoa/chậu/menu trả tiền; không banner UI.
3. Tiếp theo tạo B1 Xiên Que (xe nướng, khay xiên/sốt); chốt cùng B1 Trà Sữa sạch.
4. B2 × 3 là **quầy cố định không bánh**; B3 × 3 là **tiệm gỗ một tầng**.
5. Lúc có đủ chín ảnh **đúng cấu trúc và đã retouch**, trình một bảng tổng duyệt mỹ thuật; gắn mask/anchor thực, test ở 320/375/390/430 và WebKit/iOS/Android khi có máy thật.
6. Không merge `main`, không sửa save, Xu, SP, slot hay thưởng decor nếu người dùng chưa chốt phát hành.

**Phân biệt rõ:** chốt **hướng thiết kế** lô A ≠ duyệt **chín ảnh production**. `BPVQShopScenesV88.diagnostics().ready` tiếp tục phải là **0**.
