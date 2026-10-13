# Bỏ Phố Về Quê — Checkpoint tiến độ Chat (13/10/2026)

> **Lưu ý:** Nhánh này hiện lưu **checkpoint/tài liệu**, chưa đồng bộ toàn bộ mã game v88.16.13.3 từ ZIP. **Không dùng HEAD của nhánh để phát hành bản v88.16.13.3.**

## Bản nguồn đã được người chơi thử

- Bản ZIP cuối Đợt 2: `BPVQ_v88_16_13_3_ORDER_MENU_PLAYTEST.zip` (449 tệp; SHA-256 `20aa426eabd7d4c314434ae3ad3c89a10bc5aa88592b8e081bf623374c38c38b`).
- Được lưu trong **Thư viện của dự án** tại `/làm game 2d: bỏ phố về quê/BPVQ_v88_16_13_3_ORDER_MENU_PLAYTEST(1).zip` và bản gốc cùng tên không hậu tố.
- Báo cáo `BPVQ_v88_16_13_3_BAO_CAO.md` được lưu cùng thư mục Thư viện.
- Các thay đổi của ZIP: thanh Good/Perfect thấy rõ; Menu/giá món + giá topping; giá chờ ngày sau; giá đơn cố định và đồng bộ nhân viên; phiếu đơn dưới quầy; hướng dẫn trong nút ?, chuyển Vốn/Lãi vào điện thoại. Đã chạy test logic/cú pháp; người dùng đã nghiệm thu thao tác thanh canh trên laptop ở bản vá v88.16.13.1; không suy ra đã nghiệm thu end-to-end .13.3.

## Trạng thái GitHub khi tạo checkpoint

- PR #1 Draft: `feat/v88-phone-os-core`, mã GitHub đang ở **v88.16.12**, head `181a9629ce14feaf9272ef64ce1caf53eed74ca6`.
- Chat phiên bản mới nhất đã lưu **.13.3 trong Thư viện**, nhưng chưa import diff mã vào branch này.
- Không ghi đè `feat/v88-phone-os-core`, không sửa `main`, không tự merge.

## Đợt 3 (đã được duyệt nguyên tắc, số khách thử nghiệm)

- Khách tại quầy + ship hữu hạn; khách bỏ đi vẫn tiêu tốn suất ghé.
- Bậc 1–9: lượt quầy `[9,11,14,16,19,22,25,29,32]`; lượt ship `[2,2,3,4,4,5,6,7,8]` làm thông số thử.
- Lịch khách sinh 1 lần/ngày và lưu qua reload/đóng mở; giá Menu có tác động nhu cầu trong trần, không bốc lại lịch để farm.
- DayLedger quyết toán một lần các phí hiện hữu, lương, lãi vay, theo dõi thiếu tiền như khoản nợ. **Không tự thêm thuế.**
- Bán tay, nhân viên, ship phải dùng lịch khách chung, giữ save/NPC/recipe ID/đơn đã nhận.
- Nghiệm thu: 3 nghề, 9 bậc, autoship, save giữa ca/qua ngày, giá chờ, phí ghi nợ, chống lặp reward, mobile/desktop.
- **Đợt 3 chưa lập trình hoặc bàn giao mã trong checkpoint này.**

## Backlog v89 (chưa triển khai)

1. **Mỹ thuật:** bỏ dòng tên quán vẽ trực tiếp trên sân, giữ tên trong hồ sơ/Phone; đồ trang trí có buff cân bằng (Perfect, chống cháy, nguyên liệu may mắn, sức hút khách hữu hạn).
2. **Phiếu thành phẩm NPC:** PK-01..PK-05 — hình món đúng nguyên liệu/bao bì và feedback sao/nhận/từ chối từ native settlement; không cấp lại thưởng.
3. **Phố/Hùn vốn:** mở theo NPC Làng/tim/nhiệm vụ, liên kết Nông trại–Kho–Quầy; xác suất nhóm sự kiện `30% bất lợi / 50% bình thường / 20% trúng lớn`; có trả thiếu/khất/đình trệ/lừa đảo, không bảo đảm lãi.
4. **Nông trại:** gộp tab Vườn + Chuồng thành một tab với 2 mục con, giữ nguyên dữ liệu game.
5. **Gemini:** tùy chọn hội thoại/sự kiện có kiểm soát; AI không tự quyết định Xu, kho, thưởng hoặc đổi trạng thái đầu tư; cần backend bảo vệ khóa API.

## Hướng dẫn chat tiếp theo

Đọc checkpoint này **và** ZIP .13.3 trong Thư viện, không lấy HEAD .12 làm nguồn mới nhất của Chat. Trước mọi patch, kiểm tra nhánh GitHub có cập nhật từ Work hay chưa. Đồng bộ mã ZIP .13.3 lên nhánh tách biệt rồi mới triển khai Đợt 3. Giữ PR #1 Draft nếu chưa có chỉ đạo khác.
