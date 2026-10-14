# v88.16.6 — Kệ hai hàng và nút nổi native

User sửa13/10/2026: kệ cuộn ngang phải có2hàng với khoảng10nguyên liệu nhìn thấy; Phone/Mika nổi như các tab khác.

CSS shelf dùng grid-auto-flow:column,2hàng78px và auto-column bằng1/5chiều rộng sau4khoảng cách. Nhóm16topping+siro có8cột, khung nhìn5cột; không tạo trang cuối rỗng. Nhóm9cốt/ít món hiển thị catalog thật. Pantry206px, điều hướng cùng hàng tab, feedback ở caption. DOM/data IDs/unlock giữ nguyên, shelf không dựng lại khi đổi khách. Spice dùng2hàng trong160px,8nút không clip.

Bỏ nút phụ cs29-yard-tools khỏi scene. Bỏ3rule chỉ ẩn native floating trong Shop ở CSS cooking/steady. Dùng launcher phone và Mika gốc với vị trí/thước/mode onboarding như tab khác. Thêm aria-label cho phonebutton gốc, không tạo app/hướng dẫn mới. Bump queryversion các stylesheet/script chỉnh sửa để tránh cache rulehide cũ.

Gameplay core js/game.js giữ blob f73f735a5990b3bf4327f365597dfa49c154f378. Không migration, không sửa tip/economy/inventory/ID/career/shift/day/rewards.

Validation: compact6viewport/career có2hàng+min10/catalog, targets>=44px, headergap<=4px, scroll/native siro và8spice. Steady40lượt <=1px, retained DOM/SVG, luyện tập3nghề. Yard/cap4viewport so boundingbox native floats Quán/Vườn và khi scroll, mởapp/mika, cap/tip/one-shot/pause. Quantity/stock/cost/settlement5viewport. CI toàn repo Chromium/WebKit. Chưa thiết bị mobile thật; PR Draft.
