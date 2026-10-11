# v88 — Đợt 7C: Bảng tên S1 động và công cụ căn 6 slot B1 (bản kiểm duyệt)

**Trạng thái:** thành phần JS/CSS đã gắn vào nhánh thử nghiệm, trình xem offline đã tạo; **vẫn chưa mở khóa ảnh B1 trong game**, `main` và save không đổi.

## Mục tiêu
Tiếp tục từ B1 clean-pass kỹ thuật bản 3 và đợt 7A. Ảnh nền B1 1200×900 đã thử xóa 7 vùng decor, nhưng các mép cột, hàng rào và vùng chậu vẫn cần nghệ sĩ sửa thủ công. Một lượt chỉnh ảnh tự động tiếp theo vẫn trả về infographic, **không phải ảnh B1 chỉnh trực tiếp**, nên không coi là clean-pass bản 4 và tuyệt đối không thay ảnh gốc.

## Đã triển khai trong nhánh v88
1. **`js/v88-shop-sign.js`**: thành phần biển hiệu động, không ghi save; lấy tên quán từ `gameState.shopName` tại thời điểm hiển thị, giới hạn 32 ký tự, thay ký tự điều khiển, escape HTML và fallback theo nghề. Chỉ trả HTML khi caller cung cấp scene `isReady:true` và S1 có tọa độ x/y thuộc [0,1], layer hợp lệ.
2. **`js/phone-os-v88.js`**: Xây Quán → Mở rộng → Bản vẽ sử dụng component biển động nếu scene đã được registry xác nhận sẵn sàng; lọc marker S1 thông thường để **không hiển thị hai biển trùng**. Không hiển thị biển khi đang xem concept B1 chờ duyệt.
3. **`css/phone-os-v88.css`**: thêm bảng gỗ có tên động, kiểm soát độ rộng, ellipsis cho tên dài, khung đọc được trên màn nhỏ. Bỏ `aspect-ratio:3/4` cưỡng ép ở ảnh shell, trả ảnh về **tỷ lệ tự nhiên** để các anchor x/y bám đúng pixel thực, không trượt vì letterbox.
4. **`index.html`**: nạp một module S1 độc lập sau scene registry. Không sửa `js/game.js` và không dùng `decorV88` cho bảng tên.

## Trình xem kiểm duyệt offline
**Tên ZIP:** `BPVQ_V88_B1_S1_BANG_TEN_6_SLOT_KIEM_DUYET.zip` (gói tạo trong cuộc hội thoại, **không upload nhị phân lên repo**).
- Mở `XEM_TRUOC_B1_BANG_TEN_S1_6_SLOTS.html` trên Chrome/Edge.
- Đổi tên quán, thử **6 trạng thái vải dù** (gốc + 5 màu whitelist), thử **7 màu bảng tên**, xem trước/sau dọn.
- Kéo hoặc dùng phím mũi tên để tinh chỉnh marker **S1, S5, S6, S8, S11, S14** trên đúng B1 clean-pass bản 3. Bấm Xuất JSON để tạo bản vị trí nháp từ thông số trong trình duyệt.
- Không có kết nối save; JSON xuất có trạng thái `DRAFT_ONLY_NOT_GAME_READY`, không tự động đưa vào game.
- Có ảnh kiểm tra viewport 320/390/1000 px trong gói tải; đã kiểm tra hành vi HTML thông qua Chromium `set_content` tại 320/390/430/1000 px. Trình duyệt trong môi trường hiện tại chặn truy cập HTTP/file nội bộ trực tiếp, vì vậy kiểm thử thao tác DOM được thực hiện bằng nguồn HTML nhúng. Kiểm thử mobile thực phải thực hiện sau khi có shell sạch.

## Gate và giới hạn
- **Chưa có bản clean-pass final:** phiên chỉnh ảnh tự động tiếp tục tạo infographic thay vì sửa trực tiếp ảnh nguồn; bản có thể dùng để căn slot vẫn là draft 3.
- **S1 chưa được duyệt vật lý:** bản gỗ đang là HTML/CSS overlay ở vị trí dự thảo; cần chốt kích thước/điểm treo sau khi clean-pass.
- **Tọa độ B1 vẫn là nháp**, chưa sửa `docs/v88_DOT7A_B1_MAT_NA_NHAP.json` thành tọa độ chính thức.
- `BPVQShopScenesV88.get('boba',1).isReady===false` đến khi có approved clean-pass + đủ anchor trên ảnh + kiểm thử tương thích mask/scene.
- Không thay Xu, SP, nghề, thưởng decor, hợp đồng thi công, save lịch sử hay B7/B8/B9.

## Test
- `tests/test_shop_sign_v88.mjs` xác nhận name giới hạn 32 ký tự, chống HTML injection, input lạ, stage S1 khóa chưa mở, tọa độ hợp lệ, không tạo marker S1 trùng, asset ảnh giữ tỷ lệ thật.
- `tests/test_phone_browser_v88.mjs` tạo test DOM detached để xác nhận tên đặc biệt là **text**, không parse thành tag HTML; game với B1 draft không được tự mở sign như production.
- `.github/workflows/phone-os-v88.yml` chạy kiểm thử mới cùng 3 nghề, 9 bậc, sơn màu, save, Chromium và WebKit.

**Chỉ khi người dùng duyệt retouch hình & bảng tên S1:** xuất `assets/images/v88/shops/boba-b1.webp` thật cùng mask, đo lại 6 slot, test hiển thị chạm Android/iOS, mới xét bật ready.
