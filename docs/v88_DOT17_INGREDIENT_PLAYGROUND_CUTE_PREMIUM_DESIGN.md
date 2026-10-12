# Bỏ Phố Về Quê v88 · UI-Q2.3 — Ingredient Playground (Cute Premium)

**Checkpoint:** 12/10/2026 · trạng thái: **Figma đã sửa, chỉ đặc tả gameplay — chưa sửa HTML/JS/CSS hoặc art production**.

**Bản xem trực tiếp:** [Figma 390×844](https://www.figma.com/design/NHtsDX93qIk4hfdlD5IYHA). Ba trạng thái:
- [01 Nghỉ ca · chọn Cốt trà](https://www.figma.com/design/NHtsDX93qIk4hfdlD5IYHA?node-id=1-2)
- [02 Khách đến · hũ Trân Châu](https://www.figma.com/design/NHtsDX93qIk4hfdlD5IYHA?node-id=1-82)
- [03 Luyện tập · hũ Thạch Dừa](https://www.figma.com/design/NHtsDX93qIk4hfdlD5IYHA?node-id=1-165)

## 1. Đã thiết kế

- Thay dải 4 ô chữ chung bằng **4 tab nhóm nhỏ Cốt trà / Topping / Ly / Siro**, nằm **trong cùng 346px chiều cao mặt bàn đã có**, không phát sinh thêm card hoặc làm dài màn hình.
- Tab Cốt trà trình bày **chai thủy tinh màu theo loại trà**; tab Topping trình bày **hũ nhỏ có nắp, nguyên liệu bên trong và điểm chọn màu xanh**. Chiều rộng 79 px/card tại viewport 390 px; sau này trượt ngang khi nhiều món hoặc màn hình 320 px.
- Mẫu Cốt trà dùng ID game thật `tea_black`, `tea_green`, `tea_strawberry`, `tea_oolong`; mẫu Topping dùng `topping_boba`, `topping_jelly`, `topping_pudding`, `topping_mochi`. Không tạo một SKU giả, không thay giá vốn.
- **Ly trực quan** có thêm hạt trân châu hoặc thạch dừa trong ly, kèm nhãn "Trân Châu · 2 phần" / "Thạch Dừa · 1 phần" ở khu visual; nắp/hũ phản hồi đã chọn. Cả ba màn hình nghỉ/khách/luyện giữ nguyên camera, service rail, counter footprint.
- **Hai ống Đường/Đá mini 44×94 px** tiếp tục nằm phía phải ly, không chiếm khay; chưa phải slider có thể kéo thật.
- Cấu tạo Figma là các lớp vector/text **có thể chỉnh sửa**, hình hũ chỉ là **mock art**, không mặc định coi là asset game mới được duyệt.

## 2. Căn cứ gameplay cũ, chỗ cần thay (đã đối chiếu js/game.js + js/v88-cooking-station.js)

| Lĩnh vực | Hiện tại | Hướng bổ sung |
| --- | --- | --- |
| Trà / cốt | `workbenchDish.base`, chọn đúng 1 ID | Giữ logic đó; thay icon bằng chai theo màu trà và cập nhật visual ly |
| Topping trà & mì | `workbenchDish.toppings: string[]`; chạm toggle **có/không** | Kế thừa danh sách cũ, bổ sung **số khẩu phần** theo ID trong một lớp chọn tương tác mới |
| Xiên que | `workbenchDish.skewerCounts: Record<string,number>` đã có số lượng | Giữ và gắn thao tác đặt từng xiên lên vỉ |
| Đá/đường | `setBobaSugar(30\|70\|100)` / `setBobaIce(0\|50\|100)` | Giao diện ống mini có snap các mức hiện có, không tự thêm enum |
| Tồn kho | `getDishRequirements()` đếm một topping/1 tồn kho; chi phí `calculateDishCost()` cộng theo danh sách | Chỉ khi xây định lượng: mặc định 1 phần với save cũ; 2 phần thì trừ 2 đơn vị và tính chi phí 2 lần; **cùng một đường settlement, không trừ khi chạm hũ** |
| Khách | `validatePlayerDishAgainstOrder` so tập topping; `formatCustomerOrder` chưa có số lượng | Old-order fallback=1 phần; đặt mới có thể yêu cầu ít/vừa/nhiều, phục vụ tiếp tục phụ thuộc tính cách NPC và ngân sách |
| Luyện tập | `practiceDish` clone ephemeral | Số phần luyện cũng chỉ trong RAM, không ghi save / trừ kho / cộng Xu |

**Lưu ý:** nhãn "2 phần" trên Figma hiện chỉ là một **tình huống thiết kế**, không phải đơn đã phát sinh trong gameplay thật.

## 3. Hợp đồng tương tác đề xuất cho bản code tiếp theo

1. **Tự chọn**: người chơi mở Cốt trà hoặc Topping và chạm/ kéo trực tiếp hình hũ vào ly. Mỗi lần thêm một khẩu phần tăng hiển thị (không dùng các nút `+`/`−` làm cơ chế chính). Cho thay cốt trà trước khi chốt.
2. **Sửa dễ dàng**: chạm phần topping đã có trên ly để mở menu ngữ cảnh / kéo ra ngoài để giảm một phần; có tùy chọn "Hoàn tác" rõ và tiếp cận được bằng keyboard/tap.
3. **Tự do hợp lý**: đơn có thể bắt buộc topping/mức lượng hoặc mô tả gu; người chơi vẫn được tạo biến tấu. Món lạ hợp gu có thể được nhận theo mức dễ tính của NPC; phải cập nhật đánh giá dựa trên gu, tránh luôn cho điểm cao. Lỗi an toàn (món chưa chín) vẫn không được chấp nhận.
4. **Định lượng trực quan**: trân châu 0→1→2→3 khẩu phần tạo 0→1→2→3 lớp hạt, thạch thành viên lập thể, pudding thành khối, foam ở bề mặt. Mức khuyến nghị thử `0..3` phần/loại, nhưng phải cân bằng với cỡ ly và tồn kho trước khi chốt. Không ép canh gram/đúng vạch với topping.
5. **Không tăng chiều cao giao diện**: 4 nhóm tab gọn, khay cuộn ngang phía dưới, ly và hai ống định lượng trong khu hiển thị cao 117px đã giữ; mọi thay đổi chỉ update lớp visual và trạng thái chọn, không rebuild toàn màn theo mỗi cú chạm.
6. **Không tách `Siro` thành ngành hàng dữ liệu mới**: đây chỉ là **lọc UI**; nguyên liệu `syrup_rainbow` hiện thuộc `CAREER_WORKBENCH_KEYS.boba.toppings`. Đổi nhóm hiển thị không được tạo kho/giá/save thứ hai.
7. **Phản hồi premium**: hũ mở nắp nhẹ, một hạt/miếng bay theo quỹ đạo tới ly, có va chạm/nảy rất nhỏ, âm thanh nhỏ, giảm chuyển động với `prefers-reduced-motion`. Tương tác phải dùng được bằng chạm chứ không bắt buộc drag.

### Lộ trình thay code để không hỏng save
- P0: audit toàn bộ hình nguyên liệu cũ và map `ITEM_DICTIONARY` → `art src` → `layer renderer`; chỉ tạo lại ảnh **các loại có art lệch tông hoặc không thể tách lớp**, theo một gói asset đồng bộ, không phát sinh bản art mỗi ngày.
- P0: extend model món trong session dưới dạng `toppingPortions: {[ingredientId]: count}` hoặc adapter tương đương, **migrate tất cả `toppings[]` cũ thành phần lượng 1**, preserve output format chỗ logic cũ còn dùng.
- P0: sau khi model có lượng, sửa đồng bộ `calculateDishCost/getDishRequirements/getMissingDishIngredients/validatePlayerDishAgainstOrder/formatCustomerOrder`; đảm bảo `serveDishToCustomer` là đường trừ kho/nhận tiền duy nhất.
- P0: unit test min/max lượng, double-tap, không đủ hàng, thao tác đảo chiều, rời ca trong lúc đang thao tác, luyện/thoát luyện, NPC khó/dễ, save v87/v88, màn 320–430 px.
- P1: luật sở thích NPC tinh hơn và hiệu ứng lớp món, chỉ bật art production sau QA.

## 4. Tiêu chí nghiệm thu bản game, KHÔNG phải Figma
- Người chơi có thể chạm trực tiếp một hũ topping **hai lần**, nhìn thấy hai khẩu phần rõ ràng **trong ly** mà vẫn ở đúng vùng bàn chế biến.
- Cốt trà đổi màu ly; đường/đá snap và phản hồi; khay nguyên liệu không che nhân vật hay phiếu đơn.
- Game không trừ kho trước khi giao, không thanh toán hai lần; luyện tập không tiêu tiền/tồn kho; save cũ vẫn hiểu mỗi topping là 1 phần.
- Không tràn ngang tại 320, 360, 375, 390, 430 px; nút chạm thực ít nhất 44px, không xảy ra scroll jump khi thêm topping.
- Hũ mock của Figma chưa được coi là bản hình nguyên liệu final; thực nghiệm trên Android/iOS thật còn cần thiết bị.

**Thứ tự dự án:** hoàn thiện tương tác nguyên liệu + UI Cute Premium → test gameplay điện thoại → duyệt bộ asset ingredient nếu cần → hình công trình B1–B9. **Không merge `main` khi chưa được chủ dự án đồng ý.**
