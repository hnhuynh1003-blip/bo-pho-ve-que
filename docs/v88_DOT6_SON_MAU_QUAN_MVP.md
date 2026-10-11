# Bỏ Phố Về Quê v88 — Đợt 6: Sơn Màu Quán, hồ sơ triển khai
**Trạng thái:** phê duyệt định hướng từ người dùng, triển khai MVP trên nhánh thử nghiệm `feat/v88-phone-os-core`, PR #1 Draft, KHÔNG merge `main`.

## Kiểm kê từ game thật
- `js/game.js` vẫn có `gameState.shopStage=0..8` (B1..B9), 3 ID nghề **`boba`, `noodle`, `streetfood`**, hệ tiền `coins`, `sp`, nội thất `decorations`, vị trí `decorV88`, lưu hồ sơ bằng `saveGameToStorage(false)`.
- `js/phone-os-v88.js` có app Xây Quán 4 tab `stage/layout/inventory/shop`. MVP thêm **tab thứ 5 `paint`** vào app này; không tạo app mới.
- `js/v88-shop-scenes.js` có 27 record sạch nhưng 0 art sẵn sàng; ZIP Trà Sữa 9 ảnh là **concept raster phẳng**, không có mask sơn tách mái/tường/biển/tường. Không thể sửa riêng từng vùng ảnh PNG/WebP phẳng bằng CSS mà đảm bảo thẩm mỹ.
- B7/B8/B9 được duyệt hình khối; **B9 mái xanh than/xanh đen** phải luôn giữ cho tới khi chủ dự án chấp thuận skin B9 khác. Không sơn/crop/tái tạo các ảnh cũ tự động.

## UI & chức năng MVP
- Xây Quán → **🎨 Sơn Màu**, thay đổi **preset** và **màu từng vùng đã mở**.
- Các preset có tên ổn định: `original`, `milk_cream`, `rustic_wood` (B1), `countryside_green`, `red_tile` (B3), `warm_evening` (B5), `garden_premium` (B7), `flagship_navy` (B9). Mỗi preset có màu an toàn, không chọn hex tùy ý.
- Vùng B1–B2: `canopy` (dù/mái bạt), `sign` (biển). B3–B4: `roof`, `wall`, `sign`. B5–B8: thêm `wood`, `light`. B9: giữ `roof` xanh than theo bản đã duyệt, còn lại cho tùy biến.
- Preview minh họa bằng CSS/HTML **độc lập với shell**, thể hiện thay đổi khi bấm; **chưa phải recolor ảnh công trình trong khu bán hàng**. Vùng chưa mở bị khóa, không sửa trên save.
- Kết quả chọn lưu theo hồ sơ riêng, nút **Khôi phục** xóa riêng trường appearance; không chạm nội thất, Xu/SP, nghề nghiệp hay hợp đồng thi công.
- MVP miễn phí: chưa có giá sơn, nhiệm vụ hoặc skin giao dịch vì chưa cân bằng; không phát sinh tài sản, tiền thưởng hoặc lỗ hổng mua lại để nhận thưởng.
- Mỗi bậc khác hình khối nên mức unlock màu theo bậc; preset chỉ áp màu tại vùng đang hiện hữu. B1 xe đẩy không tự có mái ngói/tường gỗ như B5.

## Save an toàn
```js
gameState.shopAppearanceV88 = {
  schema: 1,
  presetId: "milk_cream",
  overrides: { sign: "tea_rose" }
}
```
- **Không tạo trường** ở save cũ chỉ vì mở tab, preview hoặc xem màu.
- Mọi preset/vùng/mã màu đi qua whitelist; schema lạ/malformed được bỏ qua khi đọc, **không phá save**.
- `saveGameToStorage(false)` phải trả `true`; nếu lỗi, **rollback** trạng thái appearance; không báo thành công giả.
- Nhấn `Khôi phục` xóa trường `shopAppearanceV88`; ghi save và rollback nếu lỗi.
- Không tính lại / nhân đôi bonus sở hữu decor, Xu, SP hoặc chỉ số khách. Không sửa `gameState.currentCareer`.
- Nếu bậc thấp hơn bậc mở preset (save cũ hoặc reset), hiển thị an toàn mặc định, không cấp preset khóa.

## Phần riêng sau này (chưa code)
- Clean-pass, kiểm duyệt và xuất shell sạch cùng **mask vùng** cho từng nghề/bậc.
- Sau khi được duyệt, `shopAppearanceV88` mới có thể điều khiển layer/mask của mái/tường/gỗ/biển trên ảnh sản xuất; không áp `filter:hue-rotate` lên toàn bộ cảnh.
- Theme lễ hội / màu mua bằng Xu sau khi có hồ sơ cân bằng và kiểm thử tài chính. Không sử dụng `decorV88` cho màu, vì màu **không chiếm slot S1–S24**.

## Ma trận UAT
1. B1 mở tab Sơn Màu, 3 preset cơ bản; mái/tường/gỗ/đèn bị khóa theo bậc.
2. B3/B5/B7/B9 mở đúng vùng & preset; ở B9 mái bắt buộc xanh than.
3. Đổi preset / từng màu / khôi phục, số Xu/SP, hợp đồng, số decor và bonus không đổi.
4. Reload 3 nghề, 3 profile riêng, trạng thái chọn màu độc lập.
5. Save v87 không có `shopAppearanceV88`: mở/đóng tab không ghi field.
6. Save malformed không thể render HTML/JS hoặc áp CSS tùy ý.
7. Lỗi lưu: trạng thái màu rollback; người dùng nhận thông báo.
8. Chromium 320/375/390/430 px và WebKit mobile: nút đủ chạm, không tràn ngang.
9. Đảm bảo Phone đang bán dừng/tiếp tục khách đúng luật hiện tại.

**Giới hạn nghiệm thu:** kiểm thử tự động chứng minh UI, save và preview; chỉ test ảnh quán thực khi có đủ clean shell + mask được duyệt.