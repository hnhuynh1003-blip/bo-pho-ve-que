# BỎ PHỐ VỀ QUÊ · v88 / ĐỢT 5 — HỒ SƠ HÌNH CÔNG TRÌNH VÀ HỢP ĐỒNG ANCHOR
**Trạng thái:** code khung nạp hình đã đưa lên PR #1 Draft; **chưa tạo ảnh, chưa có shell 27 công trình được duyệt**.
**Nền mã:** v87.8.0.1 + Phone OS Core + Kho Nội Thất v88; `main` giữ nguyên.

## 1. Kiểm kê tại thời điểm lập hồ sơ
- GitHub hiện có ~303 mục trong `assets/images/` (nguyên liệu, NPC, bối cảnh làng, mascot, phone...). **Chưa tìm thấy nhóm ảnh shell sạch, riêng bậc và nghề, theo tên định danh v88.**
- Đã có **bản vẽ nội dung** 27 trường hợp trong `BPVQArchitectureV88`; đây là dữ liệu mô tả, KHÔNG phải 27 PNG/WebP.
- File concept người dùng cung cấp riêng ở Project (chưa có dưới `assets/images/v88/shops/`): `DUDU_B7_shell_reference_v3.png`, `DUDU_B8_shell_reference_v3.png`, bản review vị trí S1–S22 và ảnh B9 gốc. Đây là **tham chiếu để đối chiếu**, không phải ảnh dựng sạch có neo hoàn chỉnh.
- `js/v88-shop-scenes.js` quản lý **27 record** nghệ × bậc. **Tất cả 27 record đang chờ duyệt**, có `artwork:null`, `anchors:{}`. Điều này là chủ đích để không tải ảnh hỏng và không tự nhận artwork đã hoàn thành.
- `js/phone-os-v88.js` ở **Xây Quán → Mở rộng → Bản vẽ** sử dụng resolver, chỉ hiện ảnh được duyệt và đo đầy đủ; nếu không, hiển thị thông báo chờ shell sạch. **Game bán hàng hiện hữu không bị thay bằng preview.**

## 2. Danh mục tạo ảnh: 27 shell sạch, không tạo tất cả một lúc
| Bậc | Hình khối bất biến | Trà Sữa | Mì Cay | Xiên Que | Đợt đề xuất |
|---|---|---|---|---|---|
| B1 | Xe hai bánh + dù kem, **không nhà** | Xe ly trà | Xe mì và nồi nước cốt | Xe xiên và vỉ nướng | Batch A |
| B2 | Quầy cố định có mái | Quầy trà | Quầy mì | Quầy xiên | Batch A |
| B3 | Tiệm gỗ mặt tiền | Tiệm trà nhỏ | Tiệm mì nhỏ | Tiệm nướng nhỏ | Batch A |
| B4 | Quán gia đình một gian | Một gian trà | Một gian mì | Một gian xiên | Batch B |
| B5 | Nhà hàng mái ngói đỏ một tầng có hiên | Hiên trà | Hiên mì | Hiên nướng | Batch B |
| B6 | Phố huyện, **gác lửng một phần** | Quầy trà phố | Mì phố | Xiên phố | Batch B |
| B7 | **Một** nhà chính hai tầng, thang ngoài, ban công | Tầng trệt pha trà | Tầng trệt nấu mì | Tầng trệt nướng xiên | Batch C, đối chiếu shell B7 |
| B8 | **Ba** nhà tạo sân U mở, nhỏ hơn B9 | Cánh trà, khu check-in | Cánh mì & lẩu | Cánh nướng và sốt | Batch C, đối chiếu shell B8 |
| B9 | **Flagship hai cánh cân xứng, mái xanh đen, quảng trường nước** | Biển TRÀ SỮA Đặc Sản | Biển MÌ CAY Đặc Sản | Biển XIÊN QUE Đặc Sản | Batch C, **không thiết kế lại hình mẫu đã duyệt** |

Làm theo một nghề/bậc mẫu trước, đối chiếu rồi mới xuất hàng loạt: tránh 27 hình không thống nhất góc máy.

## 3. Hợp đồng asset production
**Đường dẫn sau khi có hình duyệt:** `assets/images/v88/shops/{boba|noodle|streetfood}-b{1..9}.webp` (hoặc PNG).

**Yêu cầu mỹ thuật và kỹ thuật**
- Một shell sạch riêng cho từng tổ hợp nghề/bậc, cùng góc 3/4 và bố cục theo chiều dọc game; không cắt từ tranh nhiều ô.
- Hình nền có kiến trúc, mái, khung cột, sàn và chi tiết nền cố định; **không bake vào hình** bảng tên người chơi, NPC/nhân viên, decor từ catalog, giải thưởng sự kiện, bàn VIP hoặc đèn chỉ sở hữu khi mua.
- Chừa các khoảng nhìn rõ quầy làm việc, khu khách và đường đi; overlay nội thất không che khay nấu/phiếu đơn.
- Quầy Đá `stone_counter` là **một skin** gắn nhóm S5–S7, không phải ba món.
- Có bản mẫu nguyên chất + bản kiểm tra overlay đánh slot; bản overlay không phải tài nguyên background runtime.
- Không chuyển asset vào manifest trạng thái approved cho đến khi người dùng chốt mỹ thuật, ảnh được thêm vào repo và neo được đo trên chính ảnh đó.

**Hợp đồng anchor chuẩn hóa**
```js
// Ví dụ về định dạng dữ liệu (không phải tọa độ đã được chốt):
{
  id: 'boba-b1', career: 'boba', tier: 1,
  artwork: 'assets/images/v88/shops/boba-b1.webp',
  artReview: 'approved', approved: true,
  anchors: {
    S1: {x: 0.5, y: 0.2, layer: 2},
    // ... S5, S6, S8, S11, S14: phải đo đủ và nằm trong 0..1
  }
}
```
- Tọa độ x/y trong [0,1], theo **ảnh shell sạch**, 0 góc trái-trên, layer 0–20. Đây chỉ là ví dụ schema: **không dùng tọa độ ví dụ như tọa độ sản xuất**.
- Mỗi scene chỉ có anchor của các slot đã mở tại bậc đó; không có slot khóa sớm.
- B1 đủ 6; B2 đủ 9; B3 đủ 11; B4 đủ 14; B5 đủ 16; B6 đủ 18; B7 đủ 20; B8 đủ 22; B9 đủ 24 anchor, gồm S1/S2 khi đã mở (system).
- S17 B7 không chắn cầu thang, S20 B7 **trên dầm**, S21 B8 gần cánh trái VIP/check-in, S22 B8 **trên tường thật** của khối giữa.
- `BPVQShopScenesV88.validate()` chặn tài nguyên chưa duyệt, URL lạ, đường dẫn giả, bậc/ID không khớp, tọa độ thiếu/vượt khung và slot khóa.

## 4. Giữ nguyên gameplay/save
- Không thay `gameState.decorations` và không đổi buff sở hữu. `decorV88` vẫn chỉ là map bố trí của 14 món.
- Không đổi cách tính tiền, SP, nguyên liệu, hợp đồng 1–3 ngày hoặc 9 bậc.
- Không mở khóa ảnh/công trình khi chỉ chọn bậc xem trước.
- Mọi công việc tạo shell, ghi neo và xuất ảnh vào repo chỉ thực hiện sau khi được người dùng duyệt danh sách/bộ mẫu.

## 5. Kiểm thử
| Mã | Kiểm tra | Kết quả yêu cầu |
|---|---|---|
| ART-01 | Registry 3×9, ID duy nhất | 27 record |
| ART-02 | Không có ảnh sản xuất | 0 ảnh “approved”, không request URL lỗi |
| ART-03 | Duyệt ảnh mẫu có đủ anchor hợp lệ | Được chấp nhận qua validate |
| ART-04 | Thiếu anchor, tọa độ sai, ảnh ngoài repo | Bị từ chối |
| ART-05 | B1–B9 slot mở theo ma trận | 6,9,11,14,16,18,20,22,24 |
| ART-06 | Chọn B9 ở save B1 | Chỉ xem, không thay save, không mở khóa, không trừ Xu |
| ART-07 | B7/B8/B9 mốc hình khối | Không thay thiết kế đã duyệt |
| ART-08 | Màn 320–430 px, khi thêm shell thật | Ảnh đúng tỉ lệ, anchor không đè nút chính |
| SAVE-ART-01 | Save v87 cũ không có `decorV88` | Vẫn mở được, 14 món theo sở hữu, không tự tạo |
| ART-09 | Ảnh shell không có nội thất baked | Đồ chỉ vẽ khi thật sự đã sở hữu/đặt |

## 6. Các quyết định cần duyệt trước khi vẽ hàng loạt
1. **Batch A**: xác nhận làm mẫu đầu tiên **Trà Sữa B1** (xe gỗ hai bánh + dù kem), sau đó mở rộng B1–B3 cho cả 3 nghề.
2. B7: xử lý diện tích sân quanh S17/S18/S19 và điểm treo S20 theo bản review v2.
3. B8: **đài nước ở sân là phần kiến trúc nền hay decor mua riêng?** Chưa tự chọn để tránh tặng đồ miễn phí.
4. B9: sử dụng nguyên bố cục B9 đã duyệt; xin bản ảnh shell riêng để đo anchor, không tái tạo kiến trúc từ đầu.

**Hồ sơ này không khẳng định đã tạo 27 shell.** Đợt hiện tại chỉ hoàn thiện schema, nạp ảnh an toàn và tiêu chí kiểm duyệt.
