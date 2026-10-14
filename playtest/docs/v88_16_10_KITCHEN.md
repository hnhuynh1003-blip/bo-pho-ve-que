# v88.16.10 — hai minigame chế biến, nguyên liệu hiện đúng món

Phạm vi được duyệt13Oct2026: Canh nồi mì (đun→thả→hạ lửa/khuấy→bưng), nướng hai mặt/phủ sốt đúng lúc, thời gian thật, nguyên liệu đúng loại/màu/số lượng, không sửa trang trí hoặc tạo ảnh. Trà sữa và kinh tế giữ nguyên.

## Luật

Mì bắt đầu20%nhiệt với lửa lớn. Nước dùng đạt84% và tối thiểu1.6giây mới thả mì. Lửa nhỏ/vừa/lớn hướng tới54/74/96%nhiệt. Sau thả, mì tích lũy độ chín khi nhiệt>=60%; thố M/L/XL có hệ số1/1.09/1.18. Khuấy giảm8điểm nhiệt,30điểm nguy cơ trào, có cooldown0.7giây; không cộng độ chín. Giữ>88%nhiệt tích trào38điểm/giây, hạ lửa làm giảm17điểm/giây. Trào100 hoặc mì>137% thành mẻ lỗi. Bưng cần tối thiểu6×hệ số giây, mì88–118%, đã khuấy, giữ62–82%nhiệt ít nhất1giây, trào<65. Perfect khi mì95–106%, nhiệt66–82% và chưa trào nặng. Mục tiêu thao tác đúng6–9giây.

Xiên nướng mặt đang chọn với tốc độ13/20/29điểm mỗi giây theo lửa nhỏ/vừa/lớn. Mặt còn lại không tự chín. Lật cooldown0.7giây, sai vùng65–95% ghi lỗi tay nghề nhưng cho trở lại để cứu mẻ. Phủ sốt khi mặt ít chín<55% hoặc mặt còn lại>100% bị coi sai nhịp. Sốt tích nguy cơ khét2/6/15điểm/giây theo lửa. Mặt>116% hoặc sốt>=70 thành mẻ cháy. Lấy xuống cần>=7giây, mỗi mặt65–105%, có sốt đã bám>=0.5giây, nguy cơ khét<55. Perfect cần mỗi mặt74–94%, lệch<=12điểm, không lỗi lật/phủ, nguy cơ khét<=15. Mục tiêu7–10giây. Good cũng đạt độ chín yêu cầu của đơn cũ; Perfect là phản hồi tay nghề, không tạo bonus kinh tế mới.

## Quyền sở hữu trạng thái

v88-kitchen-play.js là factory chung cho live/practice, không có quyền ghi tiền/kho/save. Native engine nằm trong closure BPVQCookingBridge và dùngperformance.now cùng khách/món thực; thời gian công khai chỉ đọc. Signature gắn khách, đối tượng món, nghề và lựa chọn nguyên liệu/size/spice/sốt/số lượng. Giá không tham gia vì đổi giá không thay cách nấu. Native finish callback là nơi đặt isCooked hoặc fryState, chỉ sau các điều kiện thời gian/nhịp. Bridge.deliver và serveDishToCustomer đều chặn cờ ready giả nếu chưa có chứng nhận engine. Các timer nấu/chiên legacy được chuyển tới minigame khi quầy mới hoạt động; không chạy hai đồng hồ.

Session được hủy khi reset, sửa món, đổi khách/món/phase/nghề. Pause hoặc document.hidden không tích nhiệt/chín; lần resume bỏ thời gian đã nghỉ. Giới hạn delta0.12giây để không nhảy khi máy giật. Không lưu engine vào localStorage; hồ sơ cũ không migration. Giữ trợ lý nhanh theo đúng khóa cấp/đồ trang trí và cờ automation.shopFastEnabled; nhân viên tự động vốn có dùng đường thanh toán riêng giữ nguyên. Không đổi công thức/ID/giá/tip/ca/ngày.

## Quầy và tài nguyên

Nối bước vào primary và một hàng thao tác44px: mì Lửa/Khuấy, xiên Lửa/Lật/Quét sốt. Hàng được lắp sẵn cả lúc chờ, không nhảy khi có khách. Khu pha140px và kệ2hàng5cột giữ nguyên. Chỉ chạy RAF khi thực sự nấu/rót/cap; đồ trang trí không có loop mới.

v88-food-art.js ánh xạ55ảnh/SVG nguyên liệu cũ;38loại topping/xiên có màu/hình riêng. Màu nước dùng và sốt theo ID đã chọn. Nồi dùng cluster theo loại kèm×số phần; vỉ hiển thị từng que đến24, mẻ lớn dùng các loại kèm×số que đầy đủ. Không cắt mất loại cuối do giới hạn4hàng cũ. SVG slots cài một lần mỗi nghề, cập nhật thuộc tính; không thay SVG mỗi frame. Không tạo art mới; trùng tu mỹ thuật để đợt riêng.

Sửa guard khởi động: chọn/tạo profile khi ảnh mới còn tải sẽ không bị window.onload reset lại. Interval game vẫn được đăng ký; reload bình thường vẫn mở màn hình tài khoản. Thêm cache version cho game.js và kiểm tra thứ tự script để điện thoại lấy đúng lõi mới.

## Kiểm chứng

Unit clock: spam không tích thời gian; boil/drop/stir/overflow, thố3size, lửa ảnh hưởng mặt nướng, earlyflip hồi phụcGood, earlyglaze/highfire cháy, pause/hidden/resume, signature đổi món, completion một lần.

Browser live/practice cả hai nghề: ảnh tải thật, màu/số lượng3nguyên liệu, tự đặt cờready/gọi native serve sớm không tiền/kho, Phone pause, thực chơi tớiPerfect, hoàn thiện không thanh toán, native giao đúng đơn trừ kho một lần, practice không tiền/kho. Compact-counter10viewport/career, steady-counter40lượt và practice3nghề, retained-pour/cap/tip/Phone OS/kho/save hồi quy. QA screenshot chỉ dùng nội bộ. GitHub CI Chromium/WebKit và native Site deploy xác nhận bản cuối; chưa thử Android/iPhone thật.

Các rủi ro nghiệm thu: vùng canh quá hẹp trên máy chậm, nhiều nguyên liệu gộp quá nhỏ, nút thao tác chồng dock, timer legacy còn chạy hoặc phần thưởng trả lặp. Các guard/đo bố cục ở trên kiểm tra trực tiếp các điểm này. Không merge main hoặc tự duyệt27shell trong đợt này.
