# v88.0 · Đợt 3 — Báo cáo kiểm thử tích hợp Phone OS / Kho Nội Thất
**Nhánh:** `feat/v88-phone-os-core` · **PR:** #1 (Draft) · **Nền:** `main` v87.8.0.1.
**Kết quả CI được xác minh:** [GitHub Actions #38138542222](https://github.com/hnhuynh1003-blip/bo-pho-ve-que/actions/runs/38138542222) — **success**, hai job `phone-os`, `browser-smoke` đều đạt ở commit `fc9482b1d283ae98222bba64e6a8e4805ce1b78d`.

## Công việc và phạm vi kiểm thử đã chạy
| Nhóm | Được kiểm tra thực tế | Kết quả |
|---|---|---|
| 3A — Phone OS | Chromium 320/390/430 CSS px: mở/đóng Phone, Home, app Xây Quán, Thông Báo, Cài Đặt, alias `progress`, 15 app **đăng ký**; không lỗi JS chưa xử lý | PASS |
| 3B — Decor | Trên game thật: 24 ô logic, 14 decor cửa hàng, bốn thẻ Xây Quán; bộ test riêng kiểm tra 9 mốc mở khóa, trùng vật phẩm, footprint S5–S7, rollback khi save lỗi | PASS |
| 3C — Save và kinh tế | Browser tạo **ba tài khoản/hồ sơ độc lập** theo nghề `boba/noodle/streetfood`; mua `welcome_sign` giá **180 Xu** từ 450 → **270 Xu**; đặt/cất/đặt, +2 giây, không cộng bonus hai lần, lưu `decorV88`, reload và so sánh save | PASS |
| 3D — CSS | Bundle 9 stylesheet theo thứ tự và kiểm tra JSX/JS syntax | Đạt cấu trúc; chưa kiểm tra chồng lấn bằng ảnh |
| 3E — Thiết bị | Chromium headless theo 3 viewport | Đạt smoke; chưa test Android Chrome/iOS Safari thật |

### Bài kiểm thử đã thêm trên nhánh
- `tests/verify_phone_os_v88.mjs`: hợp nhất module, vòng đời, danh mục.
- `tests/test_decor_v88.mjs`: logic slot, 14 decor, save migration.
- `tests/test_phone_browser_v88.mjs`: **trình duyệt Chromium thật**, thao tác màn và app theo 320/390/430px.
- `tests/test_phone_profile_v88.mjs`: **ba nghề**, onboarding tạo tên quán, giao dịch 180 Xu, hiệu ứng sở hữu và localStorage reload.
- `.github/workflows/phone-os-v88.yml`: cả nhóm kiểm thử tĩnh và browser đều chạy trên push / PR.

### Lưu ý về những lần chạy ban đầu
- Một test ban đầu giả định tab Mở rộng luôn có từ `Đã` ở B1; thực tế không phải điều kiện cố định. Chỉnh sang xác minh panel Bậc 1 và nội dung render.
- Test tạo hồ sơ ban đầu bỏ qua quy tắc onboarding v87.7.1: tên quán cần nhập **lại ở Intro**. Điều chỉnh kịch bản test đúng luồng. **Hai lỗi này thuộc kịch bản kiểm thử, không xác nhận là lỗi game.**
- Không có bug gameplay mới nào được **xác minh** từ các ca đã chạy; chưa khẳng định game không lỗi ngoài phạm vi đó.

## Để nghiệm thu PR: UAT còn thiếu (không đánh dấu hoàn thành)
1. **iOS Safari + Android Chrome**: mở / đóng Phone giữa ca thật, khách quay lại đúng timer, popup không lệch.
2. **Visual QA:** 320–430px ảnh chụp Home, dock, 4 tab Xây Quán, chữ dài, không cắt bớt/lấn chồng; kiểm tra khi bàn phím mở.
3. **Kiểm tra 9 bậc quán:** bắt đầu hợp đồng, qua ngày, khánh thành, kiểm tra chuyển decor không nhân đồ / không đổi thưởng bậc.
4. **Save thật và save từ bản cũ:** nhập mã save v87 nhiều trường dữ liệu (NPC, kho nguyên liệu, người chơi, tiền, đồ mua), sao lưu và so sánh trước/sau.
5. **Nhân Sự, Ship, Soppi, NPC, Auction, Banking**: giao dịch theo đúng luật cũ, không sinh thưởng đôi khi mở Phone.
6. **27 công trình (3 nghề × 9 bậc) và neo sprite**: chưa triển khai đồ họa thật nên không thể nghiệm thu.
7. **Tối ưu Phone OS:** sau test UI thực, tiếp tục hợp nhất listener/observer và giảm CSS override nếu không làm thay đổi giao diện đã duyệt.

**Quy tắc phát hành:** PR tiếp tục ở trạng thái **Draft**; không merge vào `main` hoặc tuyên bố v88 hoàn chỉnh.
