# v88.16.5 — Quầy liền khối và khoảng cách sát header

Phạm vi: tiếp tục phương án cute premium với hai vùng trống người dùng chỉ trong ảnh ngày12/10/2026. Giữ cơ chế16.4; gom thông báo/phân trang và phối màu theo sân.

| Khối | Thay đổi | Bảo toàn |
| --- | --- | --- |
| Header → mở quán | Khoảng cách đầu trang2px, các khối sau gap3px | Header54/tab đáy, app, mở/đóng ca |
| Khu pha | Thông báo trong caption; bỏ dải30px riêng | Ly/size/đường/đá/canh kim |
| Khay | Kệ78px một hàng, điều hướng nằm cùng tab | 9 cốt trà,15topping,1siro,8cấp cay, native ID/unlock |
| Toàn quầy | Mặt gỗ liền, nâu nhạt/kem/xanh dịu; giảm viền hộp | DOM quầy khi nghỉ/chờ/có khách |
| Chi tiết | Dòng rót cập nhật opacity; phản hồi chọn/dập ngắn | SVG không dựng lại mỗi poll, không RAF chờ |

Siro nằm chung topping và vẫn native group topping, không thay dữ liệu. Shelf chứa toàn catalog của nhóm, cuộn native; stock/picked/quantity cập nhật đúng node. Giữ scroll/group qua khách, đổi nhóm mới cài shelf. Hai nút điều hướng đặt sẵn, chỉ hiện khi kệ tràn; không chừa dải riêng. Cấp cay bố trí8nút, không clip phía dưới.

Chỉ sửa UI cooking-station, index, CSS và QA. js/game.js giữ nguyên blob f73f735a5990b3bf4327f365597dfa49c154f378 của16.4. Không migration/schema, không đổi giá/tip/kho/claim/nghề/ngày/ca; không thêm ảnh/NPC/item. Chỉ thêm animation trên sự kiện chọn/dập, tôn trọng prefers-reduced-motion.

QA:6 viewport/career với header gap<=4px, shelf78px, counter<=430px, action nằm trên dock; scroll arrow + native siro thêm/bớt không settlement;8spicebuttons không clip.40lượt khách/chờ <=1px, giữ nodes và zero SVG redraw không thao tác; luyện tập3nghề không tiền/kho.4viewport sân/cap + native tip đối chứng/giới hạn/chặn lặp/pause.5viewport quantity/cost/stock/native serve. CI toàn repo gồm Chromium và WebKit; chưa điện thoại thật. PR vẫn Draft, chưa main; giữ nguyên gate nghiệm thu27shell.
