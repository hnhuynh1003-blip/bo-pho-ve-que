# v88.16.7 — Giữ lượng trà khi chỉnh món và link thử mobile

Fix: emitSelection/chooseFlavor trước đây đều xóa ui.pour và chuyển choose sau mọi chỉnh sửa. Tách afterIngredientEdit: với boba giữ ui.pour/poured; active pour giữ stage pour, stopped pour chuyển mix (cap-start). Trước khi rót vẫn choose. Noodle/streetfood giữ quy tắc cũ.

Native bridge.choose vẫn resetFinish (nắp/tip), dùng lại cùng validator/settlement. Sửa món đã cap cần cap lại, không rót lại. Mỗi reset/new customer/practice session mới khởi tạo pour0,pouredfalse. Không thêm save field hoặc giá/tip mới. Ly/size/cốt đổi dùng cùng mức rót UI; đây là tiến độ thao tác, không chuyển sang mô phỏng ml/tiêu kho lúc rót.

Preparation140px thay164; figure125px và sliders110px; caption/feedback gọn. Giữ kệ2x5 và floating native.

User chọn mở bằng link web13/10/2026. Site owner-private, buildless static: dist chứa đúng runtime index/css/js/assets của bản đã QA. GitHub vẫn nguồn phát triển gốc, Site là bản chạy cùng mã để kiểm tra. Không backend/dữ liệu game mới, không plugin connectors; localStorage của mỗi origin/thiết bị giữ riêng. Native xuất/nhập save dùng để chuyển profile nếu cần; không tự ghi đè save. GitHub PR Draft/main giữ nguyên.

test_pour_retention_v88 kiểm tra2mode live/practice: trước/trong/sau rót, đường/đá/topping/cốt/size, thêm/bớt, cap-edit-recap, economy unchanged, reset/new drink. Bộ compact kiểm tra prep140 và10nguyên liệu; steady40lượt/no redraw/luyện tập3nghề; yard native tip/pause/one-shot; stock/quantity5viewport. CI Chromium/WebKit. Sites deployment xác nhận native; không browser QA Sites khi control-browser không có, chưa thử điện thoại thật.

Site: https://bo-pho-ve-que-playtest.amplepin32.chatgpt.site (owner-private). Hosting project_id được lưu tại /workspace/sites/bpvq-playtest/.openai/hosting.json; cập nhật bản sau phải dùng cùng Site, không tạo lại.
