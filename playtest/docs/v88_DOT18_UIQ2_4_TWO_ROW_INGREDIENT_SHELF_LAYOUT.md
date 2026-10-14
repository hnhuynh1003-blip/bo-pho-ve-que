# Bỏ Phố Về Quê · UI-Q2.4 — Khay nguyên liệu hai hàng & thanh giao món tối ưu

**Ngày:** 12/10/2026 · **Định hướng:** chủ dự án đã đồng ý bố cục mới. **Trạng thái:** đặc tả khóa; Figma đã sửa một phần, **chưa hoàn tất Figma QA do giới hạn thao tác Figma Starter; chưa thay code game**.

## Mục tiêu thiết kế đã chốt

1. Khi mở Topping, người chơi nhìn được **8 hũ ở 390 px / 6 hũ ở 320 px** trong **hai hàng**, không phải kéo qua một chuỗi rất dài.
2. **Không che cảnh quán / NPC**: ảnh quán, biển S1, lời thoại vẫn nằm trong scene có kích thước không đổi.
3. Bỏ thanh trạng thái 50 px rời rạc: trạng thái quán + đồng hồ/nhãn bậc nằm **ngay trong mép trên của mặt bàn gỗ**, không tự tạo card mới.
4. Bàn nguyên liệu luôn giữ chiều cao tương đương khi chuyển nhóm, có khách, đóng ca, luyện tập. Không tự cuộn nguyên trang do khách xuất hiện hay bếp mở.
5. Dải tóm tắt đơn ngay phía trên vùng hành động: **tên món + topping đã thêm (×n) + lượng đá/đường + báo thiếu**. Phiếu đơn đầy đủ luôn mở được bằng một chạm; bản tóm tắt không thay phiếu đầy đủ.
6. Cùng phong cách **Cute Premium** với Phone OS: vải/men sứ/gỗ sáng, viên hũ nhỏ có ảnh nguyên liệu, trạng thái chọn xanh dịu, nắp thủy tinh, giảm card bo tròn chồng nhau.
7. **Tự do chọn topping trực tiếp:** chạm vào hũ/kéo vào ly để thêm, thao tác trên ly để lấy bớt/hoàn tác, KHÔNG lấy nút +/− làm cơ chế chính. Cột Đường/Đá mini (44×94 px) vẫn nằm cạnh ly.

## Số lượng item trong game gốc (kiểm tra từ CAREER_WORKBENCH_KEYS)

- Trà Sữa: 9 cốt trà, 16 IDs trong nhóm topping (có `syrup_rainbow`; UI Siro là bộ lọc của cùng catalog, không tạo SKU mới), 3 cỡ ly.
- Mì Cay: 10 loại nước cốt, 18 topping, 3 cỡ thố.
- Xiên Que: 18 loại xiên, 10 loại sốt, 3 khay/đĩa.
- Danh sách hiển thị lấy trực tiếp catalog ID/unlock/stock, không hardcode một danh sách bốn mẫu và không nhân hàng giả cho đẹp.

## Geometry Figma gốc và geometry mục tiêu (mốc **390×844**, CSS px)

| Vùng | Bản trước | UI-Q2.4 |
| --- | --- | --- |
| Header + nav | y=0..147 | Giữ nguyên |
| **Cảnh quán / NPC** | y=147..415 (268 cao) | **Giữ nguyên** |
| Thanh trạng thái riêng | y=412..462 (50 cao, trùm mí ảnh) | **Xóa vùng riêng**, đưa status vào mặt bàn |
| **Mặt bàn gỗ** | x=12, y=462, w=366, h=346 | **x=12, y=413, w=366, h=395**, nối liền cảnh |
| Trạng thái/bậc/timer | Card riêng | Trong bàn tại y≈431..448 tổng thể, không có card |
| Tên món + giải thích | vùng đầu bàn | giữ hai dòng, gọn |
| Món đang làm + ống Đường/Đá | 336×117 | 336×109, không cắt ly/hũ |
| Nhóm Cốt trà/Topping/Ly/Siro | 4 tab × ~79px | 4 tab cao 25px, cùng khay |
| **Khay đồ** | 1 hàng 4×79×54 | **2 hàng × 4 món 79×54**, cách nhau 2px |
| Tóm tắt đơn | tản mạn | 1 dòng ngay trước CTA |
| Nút phụ/chính | chiều cao 43 | **Giữ nút 43px**, không thu nút để nhường topping |

**Vị trí tương đối trong mặt bàn x=12, y=413:**
- Status y=18, tên món y=38, mô tả y=57.
- Khu món (ly/nồi/vỉ) y=77, h=109.
- Tab nhóm y=189, h=25.
- Shelf nền y=215, h≈115.
- Hàng một y=218, bốn ô x=[15,100,185,270], kích thước 79×54.
- Hàng hai y=274, bốn ô x=[15,100,185,270], kích thước 79×54.
- Tóm tắt đơn y≈332 (một dòng tối đa).
- CTA y=347, cao 43; dưới mặt bàn còn khoảng 5px.
- Footer xưa tại y≈816, không thay; CTA vẫn ở ngay trước footer.

**Cỡ nhỏ:** Tại 320×568 ưu tiên **3 cột × 2 hàng / trang = 6 hũ**; nhãn hũ 1–2 dòng/hạn chế dài, mỗi vùng chạm hũ cao **≥44px**. Nếu chiều cao thực tế không đủ, dùng cuộn bên trong vùng chọn hoặc cho phép scroll có kiểm soát; không ép toàn bộ trang vào một màn để đổi lấy nút bé. Giữ CTA và yêu cầu đơn có thể truy cập được, hỗ trợ `safe-area-inset-bottom`.

## Cách điều hướng nhiều nguyên liệu

- Ở 390px: pageSize=8 (4 cột×2), ví dụ boba topping 15 item sau khi lọc siro → 2 trang.
- Ở 320px: pageSize=6 (3 cột×2), boba 15 → 3 trang. Số trang tính động theo catalog đã mở hoặc chưa mở tùy filter (item khóa hiển thị có khóa nếu game muốn khám phá).
- Vuốt trái/phải **trong chính khay** để đổi trang, có 2 nút mũi tên nhỏ và nhãn `1 / 2`. Không điều hướng cả màn game; tab Cốt trà/Topping/Ly/Siro vẫn trên cùng một vị trí.
- Chạm tab nhóm khác thì về trang một; đang chế biến quay lại tab có topping đã dùng nên hiển thị **dấu chọn + `×2`**, bất kể hũ nằm ở trang nào.
- Khi thêm topping, khay **không tự nhảy về trang đầu**, không mất vị trí ngón tay, không làm co chiều cao giao diện.

## Thanh đơn và nút cuối theo tình huống

| State | Status trong mặt bàn | Dòng đơn/tình trạng | Nút phụ | Nút chính |
| --- | --- | --- | --- | --- |
| Nghỉ ca trước khi mở | `Nghỉ ca · quầy sẵn sàng` | `Trà Đen đã chọn · Sẵn sàng đón khách` | `Luyện tập` | `Mở Quán` |
| Quán mở chờ khách | `Đang chờ khách` | `Chuẩn bị nguyên liệu` | `Xem kho` (khi khả dụng) | Theo luật ca bán gốc |
| Có khách, chưa chế biến | `Khách đang chờ · [Tên NPC]` + timer | `Đơn: Trà Đen · Trân Châu ×2 · Đá 50%` | `Xem đơn` | `Bắt đầu pha` |
| Đang chế biến | `Đang làm món` + timer | `Đã thêm: Trân Châu ×2... / còn thiếu...` | `Hoàn tác` / `Xem đơn` | `Rót / Lắc / Nấu / Giao` tùy bước |
| Luyện tập | `Luyện tập · không tốn kho` | `Thạch Dừa ×1 · Thử pha tự do` | `Thoát tập` | `Hoàn thiện` |
| Sau giao hàng | status kế tiếp | Hiển thị phản hồi ngắn **trong vùng đã dành sẵn**, không bung modal thẻ dài | — | — |

Không được tự động giao hàng khi nguyên liệu chưa hợp lệ. Lỗi đơn phải hiển thị cụ thể mà không khóa lựa chọn sáng tạo/tự do, theo chính sách NPC khó/dễ sau khi nâng cấp. Toàn bộ logic chốt Xu/kho/save dùng bridge gốc, không làm engine tiền thứ hai.

## Nội dung 8 hũ demo đã lên cấu trúc trong Figma

- Nghỉ ca/Cốt trà: Trà Đen, Lục Trà, Trà Dâu, Ô Long; hàng hai **Khoai Môn, Trà Nhài, Matcha, Sữa Tươi**.
- Khách/Topping: Trân Châu, Thạch Dừa, Pudding, Mochi; hàng hai **Nha Đam, Milk Foam, Sương Sáo, Trân Trắng**.
- Luyện/Topping: Trân Châu, Thạch Dừa, Pudding, Mochi; hàng hai **Nha Đam, Đậu Đỏ, Thạch Vải, Bánh Quy**.
- Tất cả dùng khóa `ITEM_DICTIONARY` thực, ảnh minh họa Figma chỉ là placeholder editable chưa là sprites sản xuất.

## Giới hạn / lỗi Figma cần tiếp tục xử lý, KHÔNG được đánh dấu hoàn thành

**Đã xác minh qua screenshot mới nhất:** thanh trạng thái rời đã biến mất, dòng trạng thái ở mặt bàn đã xuất hiện, nút ở dưới không bị đẩy xuống, nhưng **chỉ 4 hũ hàng một hiện rõ trên Figma**. Các layer clone hàng hai có ID được tool trả về nhưng không xuất hiện trong nhóm counter khi rà lại (cần kiểm tra parent của clone, có khả năng chưa được `counter.appendChild(clone)`). Khi vừa rà lại Figma thì tài khoản Starter trả **MCP tool call limit**, chưa sửa được trong phiên này.

**Cách khắc phục khi Figma cho phép thao tác lại:** trong một thao tác idempotent, tìm bốn `INGREDIENT /` IDs hàng hai theo tên và đúng frame, bảo đảm parent là frame counter chứa row1, không bị top-level; thêm bằng `counter.appendChild(jar)`, đặt `x=15+85*i, y=274`, đưa lên sau lớp nền shelf và trước receipt/CTA. Kiểm tra screenshot ba trạng thái; không clone thêm trùng khi đã tồn tại. Nếu cần dời/khôi phục lớp, thao tác trên layer Figma có sẵn chứ không xóa UI đã hoàn thành. Ngay hiện tại **chưa có bản Figma hai hàng đạt nghiệm thu**.

## Acceptance test cho lần code sau

1. 390px đúng 8 hũ đồng thời; 320px đúng 6; item thứ 9 trở đi sang trang tiếp, không biến mất.
2. Chạm hũ hai lần được thêm hai phần tương ứng và nhìn rõ hai lớp trong món; có hoàn tác/gỡ bằng chạm trên ly.
3. Đồng bộ stock/lượng: nếu còn 1 đơn vị nguyên liệu thì không thể dùng 2 phần; **không trừ kho trước lúc giao**, settlement đúng một lần; luyện tập không trừ kho hay đổi Xu.
4. 5 viewport 320×568, 360×640, 375×812, 390×844, 430×932: không tràn ngang, không bị safe area che nút, không tự cuộn khung khi đổi trang topping.
5. UI-Q2 status và khu giao món có hành động thật tương ứng `phase`; `closed` khác `preparing`, không giả vờ mở quán khi ca đã kết thúc.
6. Game dùng asset cũ nếu đạt Cute Premium; chỉ tạo lại nhóm topping **một lần** nếu asset cũ không thể xếp lớp/không hợp màu.
7. Save v87/v88 có `toppings[]` cũ mặc định 1 phần mỗi loại, không mất món hoặc tiến trình; validate NPC khó/dễ phải được kiểm thử.

**Bước tiếp theo:** hoàn tất khung Figma hai hàng sau khi giới hạn thao tác mở lại, sau đó triển khai HTML/CSS/JS và kiểm thử game theo đợt. **Chưa** sửa game code, chưa tạo artwork và chưa merge `main`.
