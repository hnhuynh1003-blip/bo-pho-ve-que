# v88.16.8 — sân gọn và rót thêm

Sân quán đổi từ 4:3 sang 16:10, giảm chiều cao khoảng 17% tại cùng chiều rộng. Ảnh cover căn dọc 55% giữ xe quán trong khung. Tỷ lệ cố định cho cả trạng thái chờ và phục vụ, không gây thay đổi vị trí quầy khi khách vào.

Trà sữa có nút `Rót thêm` cạnh `Làm lại` và nút chính. Sau một lần dừng rót, nút này bắt đầu tiếp từ `ui.pour` hiện tại thay vì đặt lại về 0. Nút chính dừng lúc đang rót và tiếp tục dập nắp/giao khi đã dừng. Đổi cốt/size/đường/đá/topping dùng cơ chế giữ lượng của v88.16.7.

Nút rót thêm khóa khi chưa có khách/ly, chưa rót lần đầu, đang thao tác, tạm dừng, đã đầy 100%, đã dập nắp hoặc đang giao. Hàm pour chỉ nhận giai đoạn choose/mix và chặn lượng >=100. Món bị chỉnh sau đóng nắp trở về mix và hủy cap/award theo bridge cũ; cần dập lại để giao.

Không thay `js/game.js`, mã save, giá, tip, tiền/kho, recipe hay ID. Khu pha 140px, shelf hai hàng năm cột, Phone/Mika nổi giữ nguyên.

Kiểm chứng local: retained-pour live và practice kiểm tra rót tiếp sau đổi cốt/size/portion, lượng tăng từ mức giữ, tự dừng 100%, khóa cap/full/reset; compact-counter đo tỷ lệ 16:10 tại 320/390/430/1366px và ba nghề. Các bộ steady-counter, yard-cap, UI-Q2.6 và structural Phone OS đều PASS. QA screenshot chỉ dùng nội bộ.

Link chơi thử giữ nguyên: https://bo-pho-ve-que-playtest.amplepin32.chatgpt.site. Runtime Site sao chép cùng byte từ game đã kiểm thử; source commit/archive trước native private deploy. PR #1 vẫn Draft. Chưa xác nhận trên Android/iPhone thật.
