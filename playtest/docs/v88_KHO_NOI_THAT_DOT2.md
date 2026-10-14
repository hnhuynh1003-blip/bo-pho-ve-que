# Bỏ Phố Về Quê — v88 Đợt 2: Kho Nội Thất & Xây Quán 24 Slot
**Bản nền:** v87.8.0.1; **nhánh thử nghiệm:** `feat/v88-phone-os-core`; **PR #1 Draft**.

## Phạm vi thực thi
- Tích hợp trực tiếp vào app **Xây Quán** đã có. Bốn thẻ: **Mở rộng / Bố trí / Kho Nội Thất / Cửa hàng**. App và đường dẫn `construction` giữ nguyên; alias cũ `constructionTab('decor')` mở cửa hàng.
- Cửa hàng kế thừa `SHOP_DECOR_CONFIG`, `renderGrowthDecor`, `buyShopDecor` từ `js/game.js`. **Chưa thêm item, giá, công thức, XP, SP hoặc bonus mới.**
- Kho Nội Thất phân biệt **Đang dùng / Đã sở hữu · Đang cất / Chưa mở / Chưa mua**, đọc từ `gameState.decorations`. Những vật phẩm sở hữu nhưng không có bố trí sẽ ở kho, **vẫn nhận buff theo luật hiện tại**.
- Đặt, chuyển và cất bằng các ô logic; lần đặt/move/store thành công được lưu qua `saveGameToStorage(false)`, thất bại sẽ rollback vị trí. Không trừ Xu, không nhân bản ID và không đưa đồ trang trí vào `gameState.inventory`.
- Tự kiểm tra và chuyển vị trí khi vào Xây Quán sau khi tăng bậc; ưu tiên giữ ô cũ, tìm ô cùng nhóm có thể đặt rồi cất. Tất cả item vẫn thuộc người chơi; không tác động `shopConstruction` hoặc thưởng khánh thành.
- Cảnh đồ hoạ hiện dùng **sơ đồ slot tương tác**, chưa có sprite/shell/neo ảnh chuẩn cho 27 công trình. Đây là phần gameplay quản trị/kho, không phải artwork cuối cùng.

## Slot mở theo bậc
| Bậc | Slot mới | Tổng slot | Tùy biến được |
|---|---|---:|---:|
| 1 | S1, S5, S6, S8, S11, S14 | 6 | 5 |
| 2 | S2, S7, S9 | 9 | 7 |
| 3 | S3, S15 | 11 | 9 |
| 4 | S4, S10, S12 | 14 | 12 |
| 5 | S16, S18 | 16 | 14 |
| 6 | S13, S19 | 18 | 16 |
| 7 | S17, S20 | 20 | 18 |
| 8 | S21, S22 | 22 | 20 |
| 9 | S23, S24 | 24 | 22 |

**S1**: biển tên quán động; **S2**: huy hiệu quán — hai slot hệ thống, không bán, không dùng để đặt đồ. **S4** chỉ cho biển/banner mái, KHÔNG đặt bàn. Quầy Đá `stone_counter` chiếm nhóm **S5–S7** và không thể đặt nếu còn đồ khác chắn.

## Ghép 14 ID decor vào slot
| ID | Slot phù hợp |
|---|---|
| welcome_sign | S5, S6, S3, S4 |
| flower_corner | S14, S15, S16, S17 |
| warm_lights | S8, S9, S20, S24 |
| lucky_bamboo | S11, S12, S14, S15 |
| menu_board | S5, S7, S9, S3 |
| cat | S11, S12, S13 |
| music_corner | S6, S7, S9 |
| neon_sign | S3, S4 |
| aquarium | S12, S13, S16 |
| wood_furniture | S18, S19 |
| koi_corner | S16, S17 |
| stone_counter | S5 (+ giữ chỗ S6–S7) |
| vip_room | S21 |
| heritage_wall | S22 |

## Save và luật chuyển phiên bản
- Dữ liệu đã có: `gameState.decorations` (array các ID **đã mua/được trao đúng luật cũ**). Không sửa trường này.
- Bổ sung khi người chơi thực sự đặt/cất: `gameState.decorV88={schema:1,placements:{S5:'welcome_sign',...},lastStage:<1..9>}`.
- **Save v87 không có `decorV88`**: đọc được bình thường; đồ sở hữu ở kho, không tự đặt hay tự thưởng. Không ghi trường mới khi chỉ mở app/xem hàng.
- Sau nâng bậc, lần kế tiếp vào Xây Quán sẽ kiểm tra `lastStage`; các slot hợp lệ được giữ; vật phẩm không đặt được vẫn thuộc `decorations`. Không thay cơ chế thuê thợ 1–3 ngày.
- Nếu người chơi thử giảm bậc trong Admin TEST, vị trí khóa sẽ không hiện tạm thời nhưng vẫn lưu bản gốc để phục hồi khi trở lại bậc trước; không tự phá nội thất khi giảm bậc.
- Không xóa metadata ngoài hệ mới. Cần xuất save dự phòng trước khi trải nghiệm trên hồ sơ đang chơi thật.

## Kiểm thử
CI: `node --check js/game.js`; `node --check js/phone-os-v88.js`; `node tests/verify_phone_os_v88.mjs`; `node tests/test_decor_v88.mjs`.

Ca chính: 9 mốc unlock, S1/S2 system, 14 IDs, vật phẩm chưa mua, chuyển một món không nhân bản, chặn vật phẩm lên mái sai loại, chặn S5–S7 khi đặt bộ quầy đá, nâng bậc giữ nguyên chỗ ngồi, xuống bậc tạm ẩn (ADMIN), save thất bại rollback, nhận/cất không tăng tiền hoặc kho nguyên liệu, UI hiển thị 24 ô, save cũ không bị mutate khi chỉ đọc.

**Giới hạn nghiệm thu:** CI kiểm tra cú pháp, cấu trúc và logic trong bộ giả lập tách riêng. Chưa khẳng định UI được test end-to-end qua Chrome mobile/Android/iOS với game thật. PR phải giữ **Draft** cho đến khi kiểm tra thực tế.
