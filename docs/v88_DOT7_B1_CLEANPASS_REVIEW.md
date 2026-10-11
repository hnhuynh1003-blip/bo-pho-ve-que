# v88 / Đợt 7 — Trà Sữa B1: kiểm duyệt clean-pass và 6 slot (BẢN NHÁP)
**Nguồn gốc:** ảnh `TRA_SUA_B01_PREVIEW.webp` từ ZIP người dùng `DUDU_STUDIO_TRA_SUA_9_BAC_KIEM_DUYET_V1(1).zip`, bản trích 1200×900. Đã xem trực quan nguồn và tạo bản chú giải ở gói QA offline.
**Trạng thái thực tế:** **CHƯA CÓ shell B1 sạch cuối**, **CHƯA có mask sơn sản xuất**, **CHƯA có anchor được duyệt**. Vẫn giữ `BPVQShopScenesV88.get('boba',1).isReady === false`.

## Kiểm kê từ ảnh B1 thật
- Kiến trúc phải giữ: xe gỗ đẩy (một bánh lớn nhìn rõ, bánh phụ nhỏ ở mép phải trong ảnh nguồn), bạt/dù sọc kem xanh, quầy gỗ, thiết bị pha trà; không thay bằng nhà xây.
- Đồ thiết yếu cần giữ: bình nước trà, cốc, hũ topping, các chai cốt/siro và dụng cụ phục vụ (vì là cơ cấu làm việc cơ bản, không thuộc hệ decor mua).
- Những chi tiết cần tách/làm sạch khỏi **bản sao** nếu trùng decor mua/tặng: hai đèn treo sáng, bảng menu viết tay đứng bên phải, hai ghế đẩu rời phía trước phải, chậu hoa trên mặt quầy và các chậu cảnh rời quanh xe. Cây cổ thụ, hoa và cảnh làng nằm trong background cố định có thể giữ khi không trùng catalog.
- Biển động S1: thêm vùng biển trống có điểm treo thật dưới thanh bạt, chữ tên quán lấy từ save người chơi; **không bake tên mặc định**.
- Giữ phong cách màu sắc anime chibi làng quê nhưng phải kiểm chứng 2 bánh xe đẩy nhìn hợp lý và không phá dáng gốc.

## Sáu điểm neo B1 — chỉ dùng cho bản vẽ đối chiếu
**CẢNH BÁO:** các tỷ lệ này đo ước lượng từ concept 1200×900 *chưa làm sạch*. **Cấm chuyển thẳng** sang `js/v88-shop-scenes.js` / `anchorsByStage` bản production vì clean-pass có thể đổi hình khối cục bộ và mặt bằng. Dữ liệu chuẩn hóa tham khảo:
| Slot | X | Y | Vị trí kỳ vọng |
|---|---:|---:|---|
| S1 | .505 | .373 | Bảng tên động dưới thanh bạt |
| S5 | .322 | .557 | Mé trái quầy, không che bình trà |
| S6 | .612 | .557 | Mé giữa/phải quầy, không che topping |
| S8 | .298 | .448 | Kệ nhỏ có thật gắn cột trái; cần xác nhận tồn tại sau clean-pass |
| S11 | .242 | .706 | Ngăn/kệ thấp bên trái xe, không chắn bánh |
| S14 | .172 | .836 | Sân trước trái, tránh lối đi |

**B1 không mở** S2/S3/S4/S7/S9/S10/S12/S13/S15–S24. Không thay bất kỳ ID decor, footprint stone_counter, thưởng sở hữu hay giá vật phẩm.

## Phân vùng sơn màu — chưa đủ điều kiện bật trên sprite
- `canopy`: mặt vải bạt/dù, giữ nếp gấp, bóng đổ, gân gỗ.
- `sign`: chỉ biển tên trống S1, chữ động sau khi vào game.
- `wood`: frame xe không mở chỉnh ở B1, giữ mặc định.
- **Không thể dùng hue-rotate trên toàn bộ WebP**: sẽ đổi màu cây, hoa, đồ uống và bối cảnh.
- Mask sản xuất cần alpha đúng biên vùng sau clean-pass; phải có bản gốc + mask .png hoặc svg đã đối chiếu.

## Kết quả đợt hiện tại
- Đã đối chiếu bản ZIP và dựng **overlay QA**, gắn vùng cần tách R1–R7 và đề xuất 6 anchor, có gói để tải ngoài GitHub.
- Việc thử tạo sạch ảnh bằng công cụ sinh ảnh **không trả về bản chỉnh trực tiếp đáng tin cậy trên ảnh B1**, nên không coi là shell sạch và không tích hợp hình không đúng yêu cầu.
- Do đó chưa có Binary WebP mới trong repo. Không đánh dấu `approved:true`; không sửa `main`.
- Gói review ngoài GitHub: `BPVQ_V88_B1_KIEM_DUYET_CLEANPASS_DRAFT.zip` (người dùng có thể tải từ cuộc hội thoại); gồm nguyên ảnh, JSON điểm neo, ảnh QA, crop mẫu mobile.

## Cổng cần đạt trước khi ghi công trình thật
1. Người dùng xem overlay R1–R7 và chốt những decor nào cần bỏ, giữ thiết bị cơ bản.
2. Clean-pass **trên chính ảnh B1 gốc** (không tạo UI/infographic), xuất 1 ảnh background sạch; giữ bố cục xe 2 bánh + dù.
3. Người dùng duyệt ảnh mới.
4. Đo lại S1,S5,S6,S8,S11,S14 trên ảnh cuối, bổ sung vùng che khuất + kích cỡ vật.
5. Xuất bản địa phương `assets/images/v88/shops/boba-b1.webp` và mask B1 `canopy/sign`; chỉ khi đủ file+approval+tests mới cập nhật `BPVQShopScenesV88`.
6. Test Chromium 320/375/390/430, WebKit và save v87→v88; mới cân nhắc B2.

**Bảo toàn:** Không thay game.js, Xu, SP, nhân viên, tiền mua decor, save hay B7–B9.
