# Bỏ Phố Về Quê — checkpoint v88.16.13.4 / Đợt 3

Ngày: 2026-10-13. **Trạng thái: playtest, chưa nghiệm thu game đầy đủ trên máy người dùng, không merge**.

## Điểm khởi đầu khi chuyển sang cuộc trò chuyện khác

- **Nhánh mã nguồn:** `feat/v88-16-13-4-day-economy` (tách khỏi nhánh Work `feat/v88-phone-os-core`).
- Commit mã Đợt 3: `f5a3554875706f0e28fcb50a2cfaa6dd1d21fc92`.
- ZIP snapshot (458 tệp): `BPVQ_v88_16_13_4_DOT3_PLAYTEST.zip`, SHA-256 `7578067709505ac4da4338afc9bb6a66eaf3d512e80dd2d3d71a750a420c6079`.
- ZIP, báo cáo: lưu trong **Thư viện** → `/làm game 2d: bỏ phố về quê/`. Mã nguồn GitHub bao gồm 36 tệp văn bản được thay/mở rộng, byte-exact với ZIP; ba ảnh minh họa kiểm thử ở ZIP nhưng không commit lên repo.
- **Không quay lại GitHub `main` hoặc `feat/v88-phone-os-core` cũ khi tiếp tục Chat**, cũng không ghi đè các thay đổi chưa xuất bản trong Work.

## Đợt 3 đã lập trình

1. **DailyVisitPlan**: số lượt quầy bậc 1–9 là `9,11,14,16,19,22,25,29,32`, lượt ship `2,2,3,4,4,5,6,7,8`; số khách hữu hạn, trạng thái mỗi lượt ghi nhận, reload không reset hạn ngạch.
2. Lịch khách và giá Menu/uy tín tác động nhu cầu trong giới hạn lượt ngày; quầy bán tay/nhân viên và ship sử dụng cùng quản lý slot tương ứng.
3. **DayLedger**: theo dõi doanh thu, phí, khoản còn nợ, guard qua ngày. Khi thiếu Xu: giữ nghĩa vụ chưa trả; tránh ghi nợ lương/lãi hai lần. Khoản lãi đã vốn hóa vào dư nợ không bị tính lại thành nợ phí.
4. Phone OS bổ sung **Sổ Kinh Doanh** cho lượt khách và phí/nghĩa vụ.
5. Chống thanh toán ship lặp, lưu runtime ca và restore khách/đơn ship khi tải lại.
6. Vẫn giữ cơ chế ba nghề canh nhịp, bảng Menu/giá topping, phiếu đơn khách của Đợt 1–2.

## Kiểm thử và hạn chế

- PASS: `node tests/test_day_rules_v88.mjs` (3 nghề × 9 bậc, giới hạn lịch, giá, 225 tình huống quyết toán).
- PASS: `node tests/test_day_integration_v88.mjs` (save, qua ngày, sổ công nợ, ship một lần).
- PASS: `node tests/test_menu_dot2_v88.mjs`, `node tests/test_counter_settlement_v88.mjs`, `node tests/test_visible_timing_zones_v88.mjs` và kiểm tra cú pháp JS.
- Giao diện Sổ Kinh Doanh đã được thử **trên fixture Chromium riêng** tại 320/390/430px. Không được suy ra đã test toàn bộ game trên browser.
- **Chưa đạt cổng nghiệm thu cuối:** cần thử game HTML đầy đủ trên laptop/Chromium và WebKit/mobile thực tế, giao–ship–đóng ca–sang ngày, reload, NPC, nhân viên, bảng tồn kho và các khoản nợ. Các bài Playwright Node cũ chưa chạy được do môi trường thiếu gói; việc này không phải game bug được chứng minh.

## Phạm vi v89 đã ghi nhận, chưa làm

- Khung thành phẩm giao NPC, sao/nhận xét dựa native (`PK-01..05`).
- Bỏ tên quán **trên ảnh sân**, giữ trong hồ sơ và Menu; trang trí quán tăng xác suất Perfect, giảm cháy hoặc mất nguyên liệu, thu hút khách nhưng bị trần lượt/ngày.
- Gộp Vườn + Chuồng trong tab **Nông trại**, thêm tab **Phố/Hùn vốn**, sự kiện đầu tư 30% bất lợi, 50% bình thường, 20% trúng lớn, hợp đồng nông sản, liên hệ NPC Làng.
- AI Gemini tùy chọn sinh hội thoại với sandbox/quy tắc game độc lập; không để AI tự phát Xu/đổi quan hệ.

## Cổng chốt v88

Sau phản hồi laptop: ưu tiên sửa lỗi P0/P1 ngay trên nhánh Đợt 3, test hồi quy, tạo bản đóng gói kiểm thử mới nhất. Chỉ sau khi quầy/ship/save/kinh tế nghiệm thu ổn mới xét hoàn thành v88 và chuẩn bị thiết kế v89; không tự merge nhánh `main`.
