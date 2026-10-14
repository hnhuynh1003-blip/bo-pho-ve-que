# Bỏ Phố Về Quê v88 — Đợt 14: Cooking Station 2.0 / Dấu Ấn Chế Biến
**Ngày lập hồ sơ:** 12/10/2026
**Trạng thái:** ĐÃ CHỐT ĐỊNH HƯỚNG THIẾT KẾ; các hệ số cân bằng, asset và luật chi tiết là **đề xuất cần kiểm chứng bằng bản chơi thử**, không phải code đã triển khai.
**Ranh giới:** Design-only. Chưa tạo hình, chưa sửa code, chưa thay schema save/giá/Xu/SP, chưa merge main.

## 0. Động lực và nguyên tắc sáng tạo
- Phản hồi chủ dự án: hiện khu "Món đang làm" là thẻ text; quầy nấu thiên về bấm chọn danh sách; yêu cầu gameplay nấu ăn thú vị, gây muốn chơi tiếp mà **không sao chép ý tưởng/hình/UI/hệ thưởng có tính nhận dạng của game khác**.
- Game là **cuộc sống làng quê + xây quán + nghề + NPC + nguồn nguyên liệu**. Điểm riêng phải đến từ *tương tác giữa các hệ thống*, không chỉ một minigame rời rạc.
- Tránh hứa "chưa ai từng làm"; mục tiêu là bản sắc phối hợp ba trục (Dấu ấn món, Ký ức khẩu vị, Xuất xứ nguyên liệu), có tham chiếu sáng tạo độc lập và kiểm tra trùng lặp hình ảnh/cảm giác ở giai đoạn art.
- Ưu tiên **mobile portrait 320×568, 360×640, 375×812, 390×844, 430×932**. Bàn chơi một tay, có hỗ trợ chạm thay thế kéo/giữ/vuốt, animation có thể giảm.

## 1. Kiểm kê nguồn thật — nhánh feat/v88-phone-os-core
- `index.html`: `#tab-shop`, `#customer-booth-card`, `.workbench-shell`, `#dish-preview-icon/name/desc`, khu thao tác `workbench-career-boba/noodle/streetfood`. Ảnh `v88-live-scene` chỉ là QA sân B1 tách biệt, hiện chưa phải bàn nấu.
- `js/game.js`: dùng `workbenchDish`, `renderWorkbenchControls`, `updateWorkbenchPreview`, `calculateDishCost`; nghề boba chọn `setBobaCupSize`, `setBobaTeaBase`, `toggleDishTopping`, `setBobaSugar/Ice`, `startShakeProcess` (1,5s timer). Noodle chọn thố, nước lèo, cấp cay, topping, `startCookNoodleProcess` (1,5s timer). Streetfood chọn khay/xiên/sốt/nhiệt, `startFryProcess` + `pullFryProcess` canh progress, có trạng thái `undercooked/perfect/burnt`.
- `createCustomerOrder`: ưu tiên các công thức đã mở, có biến thể; `validatePlayerDishAgainstOrder` đã so container/base/toppings/đường/đá/cấp cay/sốt/số xiên/chín; phải giữ điều kiện nhận đơn và xử lý sai món.
- `applyRecipePreset`, `maybeAutoFinishWorkbench`, `isShopFastAssistantUnlocked`: có công thức nhanh và trợ lý; cần bảo toàn khả năng mở khóa/cân bằng, không để trợ lý nhân đôi phần thưởng.
- `SHOP_STAGE_CONFIG` tương ứng shopStage code 0..8 = Bậc UI 1..9; 24 slot và `S1` biển tên thuộc hệ khác, **không thêm một bảng tên mới vào khu bếp**.

## 2. Khái niệm thiết kế cốt lõi: "Dấu Ấn Chế Biến"
Mỗi đơn có 2 lớp đánh giá độc lập:
1. **Khớp yêu cầu khách (Correctness)** — kiểm tra theo thuật toán hiện tại: đúng nghề, ly/thố/khay, loại nguyên liệu, số lượng, khẩu vị, có chín/lắc. Không thể "thao tác đẹp" để hợp thức hóa món sai hoặc thiếu nguyên liệu.
2. **Tay nghề (Craft)** — chất lượng xử lý thao tác: mức rót, sự đều tay, nhiệt, độ phủ, thứ tự, độ trễ. Là thành phần **phụ**, được giới hạn và không thay giá vốn hay thưởng sale hiện có ở M1.
Mỗi nghề biểu đạt dấu ấn khác nhau nhưng có biểu diễn chuẩn hóa:
`craft={precision:0..1, rhythm:0..1, finish:0..1, mistakes:[], inputsVersion:1}`.
Quy tắc phát triển: **thao tác → phản hồi lập tức → chất lượng nhìn thấy → kết quả đơn/đặc sản**. Không chỉ hình động rồi trả kết quả random.

### 2A. Trà Sữa: "Dòng Hương Vị"
- Người chơi chạm lấy ly (giữ luật size/tồn kho), chọn cốt trà, rót qua thao tác **giữ liên tục hoặc chạm-để-bắt-đầu/chạm-để-dừng**. Chỉ số rót hiển thị bằng vạch và độ đầy thật trên ly.
- Thêm topping bằng kéo vào miệng ly **hoặc chạm chọn rồi chạm ly**; topping rơi và phân lớp theo kích thước/độ nổi. Vẫn dùng key nguyên liệu hiện có; không cộng stock ảo.
- Đường/đá giữ các mức chọn thật đang có (30/70/100%; 0/50/100%) nhưng hiển thị bằng núm dễ bấm. Nút khóa chỉ thao tác phù hợp nghề.
- "Hòa vị" là bước rút ngắn: một chuỗi vuốt ngắn/lắc nhịp 2–3 nhịp có vùng sai số rộng. **Không bắt người chơi lắc thiết bị ngoài đời**. M1 dùng kết quả `isShaken` của hệ hiện có sau khi mini-flow hoàn tất.
- Chất lượng Craft dự kiến: độ đầy đúng khoảng, phân lớp/độ trộn và hoàn tất công đoạn; **không** dùng may rủi để chọn món chính xác.
- Dấu ấn thị giác: bọt, vân xoáy nhẹ, tầng topping, tem "đặc sản" chỉ khi thật sự có công thức/điều kiện.

### 2B. Mì Cay: "Nhịp Lửa"
- Chọn thố/nước cốt/cấp cay theo đơn hiện tại; thao tác khuấy tạo đường chuyển động nước, topping xuất hiện theo thứ tự đưa vào (bằng thao tác chạm/kéo vào nồi).
- Độ sôi thể hiện bởi thang nhiệt **3 vùng: ấm / sôi vừa / quá lửa**. Người chơi có thể nhấn "Tăng nhiệt" hoặc "Giảm nhiệt"; giữ trong dải phù hợp vài nhịp để món chín. Chế độ bàn chơi đầu cấp dùng vùng đạt rộng.
- Khi "chốt món" cập nhật `isCooked` nếu đạt công đoạn; không đặt thành một bước chỉ chờ 1,5 giây. Giai đoạn đầu 1 nồi/1 đơn, cấp cao mới mở khả năng phối hợp nhiều nhóm topping.
- Dấu ấn thị giác: màu nước thay đổi, hơi nước/nhịp sôi, bề mặt mì/chất liệu thố (không có gore/bạo lực).

### 2C. Xiên Que: "Vũ Điệu Vỉ Lửa"
- Chọn khay/loại xiên/số xiên/sốt theo đơn thật. Trên vỉ có 2–3 vị trí nhiệt; **chạm đặt xiên** (hoặc kéo nếu màn lớn) thay vì danh sách là trải nghiệm duy nhất.
- Lật xiên bằng chạm vào đúng thời điểm; lựa chọn "Quét sốt" qua kéo phủ hoặc chạm ô sốt/chạm xiên. Lớp sốt phản chiếu trên xiên; mỗi loại có mức ưu tiên nhiệt, không tạo thêm nguyên liệu nếu chưa có.
- Bảo toàn trạng thái `fryProgress/fryState` và chu trình phục vụ hiện có; ở M1 có thể giữ logic cũ phía sau và biểu diễn `perfect/undercooked/burnt` bằng mini-flow, không đổi loại nghề thành một nghề khác.
- Dấu ấn thị giác: vệt cháy nhẹ, sắc vàng, lớp sốt phủ, rung nhiệt, bày mẻ ra đĩa.

## 3. Tính độc đáo đến từ vòng lặp dài hạn, KHÔNG gắn phần thưởng trực tiếp vô hạn
A. **Nhật ký khẩu vị** (dự kiến): NPC đã tồn tại có thể nhớ *sở thích được tiết lộ qua các lần ghé*; được áp dụng sau M1, tránh xâm phạm đơn đã sinh trong ca. Sự hài lòng ảnh hưởng ưu tiên hội thoại/ghé lại trong phạm vi có trần theo ngày, không tự sinh thêm Xu/SP.
B. **Dấu Ấn Đặc Sản** (dự kiến): người chơi chọn công thức hợp lệ từ nguyên liệu đã có và một vài tham số chế biến; lưu một profile recipe riêng có ID, giới hạn số profile và chi phí chuẩn. Không cho chế biến miễn phí, không bypass recipe unlock.
C. **Vườn→Quán** (dự kiến): nguồn nguyên liệu nội sinh nông trại có thể thay metadata trình bày/hội thoại/đơn sự kiện theo lô; **không mặc định buff sức mạnh hoặc giá**. Nâng cấp sau khi kiểm toán kho/hệ nông trại.
D. Hiệu ứng "Perfect" thể hiện thành tựu kỹ năng, **không tặng tiền mỗi lần animation**. Nếu muốn cộng Xu/XP/đánh giá phải ghi rõ giới hạn, nguồn thưởng và kiểm thử chống farming trước khi code.

## 4. Luồng mobile portrait — một màn hình, hai trạng thái
- Giữ header nhỏ + 6 tab, **không chồng thêm một header tên quán**. Tên quán đọc ở biển S1 trong cảnh khi scene đã được duyệt; với nghề/bậc chưa có art thì header danh tính gọn là fallback truy cập được.
- **Chờ khách:** sân/quán tương đối rộng (4:3), công trình + decor + NPC; khối đơn mini; không ép hiện khay nguyên liệu.
- **Có đơn/đang nấu:** tự thu cảnh thành banner hẹp có hỗ trợ tạm phóng; phiếu đơn sticky gọn có mô tả mục tiêu, độ kiên nhẫn; **món đang làm là một object 2D trực tiếp thay đổi**; các dụng cụ/nguồn nguyên liệu xếp thành khay ngang cuộn có phân nhóm; CTA `Làm lại`/`Hoàn thiện` trong vùng ngón cái.
- Vùng tương tác tính trên kích thước còn lại **sau** safe-area và bàn phím; dành ưu tiên cao nhất cho CTA và món. 320×568 dùng compact và cuộn dọc tối đa vùng khay, không tuyên bố 100% hết scroll.
- Tap target chính tối thiểu 44×44 px; phòng ngón tay che món: chạm lựa chọn có hiện preview; kéo thả chỉ là hành vi tăng trải nghiệm, không bắt buộc; hiệu ứng chuyển động có Reduced Motion.
- Dự kiến kiểm thử Android/iOS touch trên thiết bị thật hoặc ghi rõ thiếu thiết bị; Chromium/WebKit automation chỉ là một phần.

## 5. Luồng trạng thái kỹ thuật đề xuất
`idle → orderAccepted → selecting → interacting → readyToServe → settled`, có nhánh `paused/cancelled/timeout/closed`.
- Sinh `CookingSession` tạm trong RAM: `{sessionId, orderId, career, step, startedAt, gestureAccum, craftMetrics, commitGuard}`. Đối chiếu `orderId`/phiên và nghề trước khi gọi settlement.
- **Không tự trừ kho khi bắt đầu animation**; lựa chọn nguyên liệu và giao đơn phải đi qua đường nghiệp vụ kiểm tra/tính chi phí/giảm stock vốn có. Khi người dùng hủy/lỗi đóng tab phải có rollback hoặc không trừ gì, tùy điểm commit thật đã kiểm định.
- `settled` chỉ được gọi 1 lần nhờ guard; đóng ca/chuyển nghề/qua ngày/hết đơn phải hủy timer và cấm callback cũ cập nhật đơn mới.
- M1 chưa yêu cầu thêm trường save. Nếu cần resume mid-order, ghi schema mới riêng, có migration/rollback và chỉ triển khai sau kiểm thử bản save mô phỏng; **không reset save cũ**.
- Tool điều khiển thao tác chỉ tạo các **event có kiểm tra** (pour/ingredient/mix/heat/flip/sauce), không trực tiếp gọi `gameState.coins += ...`, `inventory -= ...` từ UI.

### Điểm số dự kiến (CHƯA CHỐT KINH TẾ)
`craftScore = clamp(0.45*precision + 0.35*rhythm + 0.20*finish, 0, 1)`; đây là công thức **thử nghiệm cho UI**, chưa được phép cộng điểm đánh giá/Xu/XP trong game. Đề nghị chuẩn hóa qua playtest 3 nghề, để người chậm thao tác vẫn có thể phục vụ và thu tiền theo luật cũ.
- **M1:** hiện sao kỹ thuật/cách trình bày riêng, **không** sửa mức thanh toán/bonus/rating thật.
- **M2+:** sau đối chiếu dữ liệu thực tế mới đề xuất điều chỉnh rating có trần; không cộng trực tiếp vào Xu nếu chưa duyệt mô hình kinh tế.

## 6. Công việc và phụ thuộc (ưu tiên bản chơi thử đầy đủ, không duyệt vụn)
| ID | Gói | Phụ thuộc | Đầu ra | Tiêu chí nghiệm thu |
|---|---|---|---|---|
| CS-01 P0 | Core `CookingSession` và adapter 3 nghề | Chính xác schema đơn/tồn kho/giao món hiện có | Mô hình tạm không phá `workbenchDish` | Unit test state transitions; không mutating save; khóa double settlement |
| CS-02 P0 | Trà Sữa - Dòng Hương Vị | CS-01, renderer món | Rót, topping, điều vị, hòa vị có phản hồi | Chạm + kéo fallback, đơn đúng/sai, cấp thấp, mất stock, kho rỗng |
| CS-03 P0 | Mì Cay - Nhịp Lửa | CS-01 | Nhiệt, topping, nước lèo, nấu chín | Sai mức cay/loại thố; không chín vẫn bị reject |
| CS-04 P0 | Xiên Que - Vũ Điệu Vỉ Lửa | CS-01 | Đặt xiên, trở, sốt, vùng nhiệt | Sai số xiên, cháy/chưa chín, món hoàn chỉnh |
| CS-05 P0 | Main Game portrait UI | CS-02/03/04 | Tab Quán 2 trạng thái, dish object và khay ngang | 320–430px, safe-area, không che CTA và đơn |
| CS-06 P0 | Tích hợp kinh tế + save | CS-01..05 | Adapter vào settlement cũ; ngăn duplicate | Số tiền/stock/rating cơ sở trước và sau giống nhau với dữ liệu cùng món |
| CS-07 P1 | Đặc sản + ký ức NPC + nguyên liệu Vườn | CS-06 và kiểm kê game state liên quan | Thiết kế + build sau | NPC không ghi nhớ sai khách, không farm bonus, món khóa không mở |
| CS-08 P0 | One-batch mobile UAT | CS-01..06 | ZIP game thực sự khác và có test case thao tác | Một lượt feedback tổng hợp; không yêu cầu duyệt từng card |

## 7. Bộ kiểm thử bắt buộc trước khi bàn giao
- 3 nghề × [đơn đúng, sai thành phần, thiếu stock, nguyên liệu khóa, không nấu/lắc, chín non/cháy, đổi nghề giữa chừng, timeout, hủy món, đóng ca, qua ngày].
- Chạm đơn, kéo thả, giữ, nút thay thế và input xử lý trễ ở 320×568, 375×812, 390×844, 430×932; hỗ trợ bàn phím và giảm hiệu ứng.
- Một sự kiện đã kết toán **không được cộng Xu/SP/đánh giá hay trừ kho 2 lần** dù double tap, callback timeout hoặc reload.
- Preset/Trợ lý hiện có không bỏ qua unlock/tồn kho; chức năng mới không biến auto thành máy farm.
- Migration save v87.5.3.2/v87.8/v88; không xóa trường `gameState.decorations`, `decorV88`, `shopAppearanceV88` hoặc `shopConstruction`.
- So sánh baseline trước/sau trên các trường hợp cùng một đơn. Tác động Craft vào rating/phần thưởng chỉ kiểm thử sau khi **thiết kế cân bằng được chấp thuận riêng**.
- Giao diện tab Quán **không thêm thẻ dài chồng thẻ cũ**; cảnh B1 QA vẫn là ảnh QA, không âm thầm đặt thành production shell.
- Release gate: cung cấp screenshot/mobile gameplay đã thao tác thật + hồ sơ kết quả; `main` không đổi trước khi người dùng nghiệm thu.

## 8. Quyết định và ranh giới thực hiện
**Đã duyệt định hướng:** ưu tiên trải nghiệm thực tế, sáng tạo riêng, mobile đứng, ba nghề tách biệt, giữ kinh tế/save.
**Chưa khóa thông số:** ngưỡng kỹ năng/chấm điểm, độ khó cấp cao, buff nguyên liệu và lưu đặc sản, ảnh sprite cuối.
**Quy tắc bàn giao:** khi bắt đầu code, thực hiện M1 theo một lô chơi được, tự test và xử lý lỗi trong lô, báo cáo kết quả rõ ràng. Không gọi một bản chỉ đổi thẻ CSS là "Cooking Station 2.0". Chưa code hoặc ảnh trong commit tài liệu này.
