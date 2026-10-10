# Báo cáo vá ảnh nguyên liệu — Bỏ Phố Về Quê v87.6.1

## Phạm vi hoàn thành

- Đối chiếu danh mục 91 mục vật phẩm/vật dụng thuộc ba nghề Trà Sữa, Mì Cay, Xiên Que (kể cả `skewer_corn` xuất hiện trong UI).
- Vá **47 khóa ánh xạ hình ảnh** bằng lớp JavaScript bổ sung, sau các override art v70 và v73 của bản gốc.
- Tách đúng **8 nhóm hình trùng sai món**: 4 ở Mì Cay và 4 ở Xiên Que.
- **P0**: thay ánh xạ ảnh hỏng Cá Viên và Thanh Cua Xiên sang WebP cùng món giải mã tốt; thay Trà Đen và Trà Ô Long bị nhiễu bằng SVG độc lập.
- **P1**: dùng lại nguồn ảnh đúng món có sẵn (Mala, Thảo Mộc, Chả Cá, Gà Xiên, Trứng Cút, Mực Xiên...), và loại mảnh rời ở 5 hình cũ bằng tệp mới có tên `v8761_clean_*`.
- **P2**: bổ sung 15 SVG minh họa riêng cho nguyên liệu mở rộng đã có trong danh mục vật phẩm, và một số hình đặc thù thiếu/sai. Đây là hình vector minh họa ban đầu; phong cách chưa thay thế được artwork anime chibi vẽ tay cao cấp.
- Thêm cơ chế thử lại **một lần** khi URL ảnh trong `assets/images/` tải lỗi; không xóa bộ nhớ đệm hay thay đổi save.

## Danh sách nhóm sửa sai

| Nghề | Nhóm cùng ảnh ở v87.6.0 | Hướng xử lý trong v87.6.1 |
|---|---|---|
| Mì Cay | Mala / Bò Sa Tế | Mala: ảnh riêng v65; Bò Sa Tế: ảnh v73 |
| Mì Cay | Collagen / Xương Hầm | Collagen: ảnh riêng v65; Xương Hầm: v73 |
| Mì Cay | Cốt Nấm / Thảo Mộc | Cốt Nấm: v73; Thảo Mộc: v65 |
| Mì Cay | Chả Cá / Xúc Xích | Chả Cá: v65; Xúc Xích: v73 |
| Xiên Que | Hồ Lô / Xúc Xích | Hồ Lô: SVG độc lập; Xúc Xích: v30 |
| Xiên Que | Bò Viên / Gà Xiên / Trứng Cút | Ba nguồn v30 độc lập |
| Xiên Que | Bò Nấm / Đậu Bắp Cuộn | Giữ Bò Nấm; thêm SVG riêng Đậu Bắp Cuộn |
| Xiên Que | Nấm Nướng / Mực Xiên | Nấm Nướng và Mực Xiên dùng hai ảnh v30 riêng |

## Tính bất biến và kiểm chứng

- `js/game.js`: **giữ nguyên từng byte** với ZIP v87.6.0. Toàn bộ CSS cũ, `chuyen-save.html`, `asset-manifest.json` cũ và 276 tệp ảnh gốc vẫn còn trong bản đầy đủ.
- Không thay đổi tên/ID nguyên liệu, nghề, công thức, tồn kho, cấp độ, lương, Xu, nhiệm vụ, NPC, luật sang ngày hoặc khóa localStorage.
- Tất cả tệp SVG mới parse XML hợp lệ; 5 WebP vệ sinh mảnh thừa giải mã thành công.
- Mọi đường dẫn 47 ID cập nhật đều tồn tại; 8 nhóm sai không còn trùng đường dẫn.
- JavaScript game gốc và JavaScript bản vá đều vượt kiểm tra cú pháp Node.
- Kiểm thử cô lập trong Chromium: 9/9 ảnh SVG mẫu mở được (naturalWidth=160), 47 ánh xạ art được gán thành công.

## Giới hạn đã biết — cần kiểm thử ngoài môi trường này

1. Không kiểm thử trực tiếp toàn bộ trang game trên Chromium ở môi trường tạo tệp: truy cập localhost bị chặn `ERR_BLOCKED_BY_ADMINISTRATOR`.
2. Những tệp WebP lỗi ở kho ảnh gốc ngoài luồng hiển thị nguyên liệu ưu tiên vẫn có thể còn trong ZIP, vì bản vá không xóa hoặc ghi đè tài nguyên lịch sử. Không dùng những tệp ấy làm ảnh nguyên liệu hiện hành.
3. 15 SVG món mở rộng được ánh xạ theo ID nhưng **không bổ sung nút/điều kiện mở khóa** vào mảng điều khiển giao diện cũ. Việc đưa tất cả mục ấy ra quầy, nếu cần, là phát triển giao diện/gameplay ngoài phạm vi bản vá này.
4. Một số SVG mới mang tính minh họa dự phòng vector (có emoji hệ thống); mức độ đồng nhất với art anime chibi chi tiết cần người chơi duyệt khi xem thực tế.
5. Chưa chứng minh hoạt động tốt trên Chrome Android/Safari iOS và chưa chạy bộ gameplay hồi quy đầy đủ.

## Kiểm thử sau khi cập nhật GitHub

- [ ] Mở quầy Xiên Que: Cá Viên, Gà Xiên, Bò Viên, Trứng Cút, Mực Xiên, Nấm Nướng, Thanh Cua hiển thị riêng và không mẻ.
- [ ] Mở quầy Mì Cay: tám món của bốn cặp được hiển thị đúng hình, không cùng ảnh.
- [ ] Mở quầy Trà Sữa: Trà Đen/Ô Long không nhiễu; Bánh Quy Nghiền/Thạch Vải đúng minh họa.
- [ ] Kiểm tra điện thoại: ảnh không bị 404, tải lại không cần làm lại nhiều lần; tính năng khác vẫn bấm được.
- [ ] Thử công thức/đặt hàng/nhân viên; Xu và tồn kho không khác v87.6.0.
- [ ] Lưu game, tải lại trang và xác nhận hồ sơ không bị đổi.

**Chưa đăng GitHub thay bạn.** Nếu test không ổn, có thể khôi phục `index.html` trước đó (hoặc bỏ dòng nạp `js/v8761-art-fixes.js`) để trả về ánh xạ ảnh cũ.
