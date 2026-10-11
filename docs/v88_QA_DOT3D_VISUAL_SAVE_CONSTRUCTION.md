# v88.0 · Đợt 3D — QA bố cục, save v87 và 9 bậc thi công
**Repo:** hnhuynh1003-blip/bo-pho-ve-que · **Nhánh:** feat/v88-phone-os-core · **PR:** #1 Draft.
**Nền dự án:** v87.8.0.1. Không merge hoặc thay đổi nhánh main.

## Chứng cứ xác minh
- [Run #38139157777 — GitHub Actions: PASS](https://github.com/hnhuynh1003-blip/bo-pho-ve-que/actions/runs/38139157777): `phone-os` và `browser-smoke` đều PASS trên commit `962e5b70c3ec4068edfcfd1d0ef44167bbaf2b0e`.
- [Run #38138886048 — ảnh QA đầu tiên](https://github.com/hnhuynh1003-blip/bo-pho-ve-que/actions/runs/38138886048): 35 screenshot dạng `v88-phone-visual-qa` (14 ngày lưu), file `geometry.json`.
- Thực thi Chromium trực tiếp với server HTTP cục bộ trong GitHub Actions; không truy cập save/người dùng thực.

## Kết quả QA v88
| Hạng mục | Cách kiểm tra | Kết quả |
|---|---|---|
| CSS/DOM bố cục | **5 viewport:** 320×568, 375×667, 390×844, 430×932, 1280×800; **7 màn:** Home, Mở rộng, Bố trí, Kho, Cửa hàng, Thông báo, Cài đặt. Kiểm tra khung Phone trong viewport, thẻ không vượt chiều ngang, không chồng slot/nút; lưu 35 ảnh và JSON đo hình học. | 35/35 **PASS** kiểm thử hình học |
| Phone OS | App router, Home, 15 app đăng ký, legacy route progress, đóng/mở, thông báo, cài đặt. | **PASS** kiểm thử luồng đã liệt kê |
| 3 nghề | Tạo 3 profile, mua welcome_sign với 180 Xu (450→270), đặt/cất/đặt, bonus +2 giây, lưu/reload. | **PASS** |
| Save v87 mô phỏng | Tạo save từ cấu trúc v87.8.0.1 **không có `decorV88`**, có 2 decor và hợp đồng thi công; tải vào hệ v88. Mở Kho không tự tạo bố trí/quà, giữ Xu/SP/ingredient/đồ/contract; khi chủ động đặt mới lưu sơ đồ. | **PASS** |
| Thi công B1→B2 | Kiểm tra hợp đồng cũ còn hiệu lực, trước hạn không hoàn thành; đúng hạn chỉ nhận +1 SP, chống lặp, không mất sơ đồ decor sau khánh thành. | **PASS** |
| Toàn bộ B1→B9 | Dùng `upgradeShopStage`, `v8775ConstructionDuration`, `v8775FinishConstructionIfReady` thực của game. Kiểm tra phí 700/1800/4200/9000/18000/32000/55000/90000 Xu, 1–3 ngày, thưởng SP chính xác, chống ký trùng/nhận trùng, khóa nâng tiếp sau B9; lưu và reload. | **PASS** |

## Những điều *chưa* được xác nhận
- Chưa đánh giá mỹ thuật trực quan từng ảnh bằng mắt người; kiểm tra bố cục tự động không đảm bảo phối màu, thẩm mỹ, cỡ chữ, sprite tốt.
- Chưa có test thiết bị thật Android Chrome/iOS Safari, mở/đóng điện thoại khi khách đang chờ theo thời gian thực, bàn phím ảo.
- Chưa có save thực do người chơi xuất; fixture v87 do test tạo ra từ game tương ứng, không đại diện mọi save lịch sử.
- Kiểm tra hợp đồng từ các hàm gốc với ngày game điều chỉnh trong profile TEST, chưa đi xuyên suốt qua thao tác nút Qua Ngày và chu kỳ lương/sự kiện.
- Chưa test toàn bộ giao dịch các app Ship/Soppi/Nhân Sự/Ví/Vay/Đấu Giá; chưa có 27 shell công trình và neo ảnh sprite.

## Các bài kiểm thử mới
- `tests/test_phone_visual_v88.mjs`: ảnh và đo layout ở 35 trường hợp.
- `tests/test_save_upgrade_v88.mjs`: save v87 không layout, B1→B2 giữ sở hữu/Xu/SP/ingredients/hợp đồng.
- `tests/test_all_shop_stages_v88.mjs`: tám hợp đồng B1→B9, đơn giá/ngày/SP/idempotence.
- `.github/workflows/phone-os-v88.yml`: chạy các bài kiểm thử cùng nhóm đã có, lưu screenshot khi luôn kết thúc.

## Quy tắc phát hành
**Giữ PR #1 ở trạng thái Draft. Không merge vào `main` khi chưa xem ảnh và thử nghiệm trên thiết bị thật.** Giai đoạn tiếp theo là đánh giá ảnh screenshot và kiểm thử phone khi ca bán đang chạy, rồi mới mở rộng hình ảnh 27 công trình / Main Game.
