# v88.16.12 — bỏ bước khuấy bắt buộc; đề xuất món hoàn thiện và khách nhận đơn

## Phạm vi bản sửa lỗi đã được yêu cầu

Người dùng báo mì bị bắt làm lại khi khuấy và cho phép chỉnh hoặc bỏ bước khuấy. Kiểm tra đồng hồ mô phỏng: khuấy một nồi khỏe không reset session; sau khi thả mì mà giữ lửa lớn khoảng 3 giây, nồi có thể trào trước thao tác khuấy. Không khẳng định đây là toàn bộ nguyên nhân trên thiết bị người dùng, vì chưa tái hiện đúng thao tác thực tế của họ.

Chọn bỏ khuấy khỏi luồng chơi và khỏi điều kiện hoàn thiện. Hàng mì chỉ còn Lửa / Nhấc nồi; chiều cao cũ giữ nguyên, không để ô trống. Luồng: đun nước → thả mì/topping → hạ lửa vừa → canh chín → nhấc → giao. Hướng dẫn ưu tiên nhắc hạ lửa lớn sau khi thả; lửa quá nhỏ thì nhắc tăng về vừa. API stir cũ giữ tương thích nhưng không còn là bước UI hoặc điều kiện giao món. Không thay ngưỡng chín, thời gian, giữ sôi nhẹ, nguy cơ trào, quyền kinh tế/save hay cơ chế xiên.

Kiểm thử ba thố M/L/XL có thể hoàn thiện Perfect với stirs=0; đồ sống/chưa đủ thời gian vẫn không được giao; nhấc/đặt lại, pause/ẩn tab, đổi khách/món vẫn đúng; khuấy qua API cũ không reset nồi khỏe; native thanh toán đúng một lần. Kiểm tra hàng hai nút ở 320/390/430px và bài hồi quy xiên/trà sữa. Chưa thử điện thoại vật lý.

## Kiểm kê tính năng trước khi đề xuất

| Thành phần | Đã có | Phần cần mở rộng |
| --- | --- | --- |
| Món đang làm | SVG theo nghề, nguyên liệu/màu/số lượng thực; ly có nắp; xiên gắp ra đĩa/mẹt/hộp | Hình hoàn thiện/đóng gói đồng bộ cho cả ba nghề, mì có nắp/thố hoàn thiện |
| Bao bì/size | cup_m/l/xl, bowl_m/l/xl; tray_plate/basket/box; có tính nguyên liệu bao bì trong lõi | Ảnh đúng bao bì đã chọn, không tự đổi ID hoặc thêm vật phẩm |
| Khách nhận/từ chối | serveDishToCustomer → validatePlayerDishAgainstOrder → evaluateCustomerDecision | Thể hiện chuyển món từ quầy tới khách tại sân |
| Sao và lời khen/chê | Native 1–5 sao theo sai món, giá, tính cách, chờ lâu; buildV85CustomerReview có giọng NPC/nghề | Đưa kết quả thật vào khung nhận món, không tạo bộ chấm sao thứ hai |
| Phản hồi nhanh | showV85QuickReview hiện tên, emoji, sao và bình luận khoảng 5,2 giây ở đáy màn hình | Dùng lại nội dung đó tại khung khách ở sân, tránh hai thông báo trùng |
| Lịch sử đánh giá | gameState.reviews, tối đa 30 nhận xét; reputation/ratingCount, tab Đánh giá | Giữ nguyên nguồn lưu và lịch sử |
| Thanh toán | Lõi tiêu hao kho, trả doanh thu/tip, XP, nhiệm vụ/mastery và ghi save | Chỉ đọc kết quả đã xử lý; không thêm nút nhận thưởng hoặc thanh toán UI |

Các đường đóng hàng giao xa vốn có (packingTargetOrder và đơn điện thoại) không được dùng thay khách trực tiếp. Đề xuất này dành cho quầy bán của nghề đã đăng ký; không mở chức năng đổi nghề.

## Phương án đề xuất để duyệt — chưa lập trình/tạo ảnh

Hoàn thiện minigame → món đổi sang trạng thái sẵn sàng trong khu pha hiện tại → người chơi bấm Giao món → lõi xử lý một lần → khung khách ngay sân hiện món, kết quả nhận/từ chối, lời nói và sao → tự thu gọn. Không thêm một thẻ hoàn thành dài bên dưới hoặc popup che xe.

Trước Giao: nhãn “Món đã hoàn thiện • sẵn sàng giao”, hình đúng ly/thố/khay đang chọn. Không hiển thị sao hoặc tiền được nhận trước kết quả của lõi. Sau Giao: ví dụ “Bé Bơ đã nhận món • ⭐⭐⭐⭐⭐” và một lời nhận xét từ hệ thống hiện có. Khi từ chối: “Khách không nhận món” và sao/lý do thật; không giả hình vui vẻ hoặc thông báo trả tiền. Chỉ hiển thị doanh thu/tip đã thực trả nếu đưa thông tin tiền vào khung.

Giữ vị trí/khung khách hiện có trên sân; dùng ảnh NPC đã có, bóng thoại gọn 2–3 dòng. Toàn văn ở tab Đánh giá. Khung kết quả dùng cùng vùng với phiếu gọi món, không xuất hiện hai phiếu; thông báo quick-review cũ được chuyển vị trí hoặc tắt hiển thị khi khung mới đã hoạt động. Hết khoảng 5,2 giây hoặc khi khách mới đến/đóng ca/chuyển hồ sơ thì kết quả cũ biến mất. Không kéo dài lịch đón khách hoặc khóa thao tác chờ animation trong đợt đầu.

### Danh sách hình cần bổ sung/tận dụng

| Mã ảnh | Master đề xuất | Bao bì native được phủ |
| --- | --- | --- |
| PK-A1 | Ly trong có nắp kín, nhãn quán gọn; lớp trà/topping nằm dưới mask | cup_m, cup_l, cup_xl bằng scale trong cùng vùng cố định |
| PK-A2 | Thố mì hoàn thiện với nắp phù hợp; lớp nước dùng/topping theo món | bowl_m, bowl_l, bowl_xl bằng scale |
| PK-A3 | Đĩa giấy sạch, nền/lót phù hợp xiên | tray_plate |
| PK-A4 | Mẹt tre có lót giấy | tray_basket |
| PK-A5 | Hộp mang đi, phần nắp/đáy tách lớp | tray_box |

Tổng đề xuất: 5 master bao bì phủ 9 lựa chọn đang có. Tận dụng ly/nắp/thố/khay SVG hiện tại làm bản chức năng trước; chỉ tạo hoặc chỉnh ảnh ở mẫu đã duyệt. Không thêm túi xách/dao nĩa/tem thành vật phẩm tiêu hao mới. Nếu có phụ kiện chỉ là trang trí, không cộng giá/kho hoặc thưởng. Phần này nối với hồ sơ topping/quầy v88.16.11, không sản xuất lại cả 52 topping.

Ảnh nền trong suốt, không chữ/sao/giá dính trong bitmap, không vẽ món cố định trái nguyên liệu đang chọn; cùng góc nhìn và ánh sáng với quầy. Trà sữa giữ kem/gỗ/sage; mì dùng đất nung/gỗ/kim loại ấm; xiên dùng olive/mật ong/tre. Được phép dùng hình bao bì tách lớp để lớp món thực vẫn hiển thị. Cần xem mẫu trên khu pha 140px và thumbnail tại sân trước khi chốt.

### Dữ liệu và phụ thuộc

Đề xuất snapshot tạm trước khi native cleanWorkbenchDish: career, container/tray, base/sauce, toppingPortions/skewerCounts và tên món. Kết quả sau thanh toán: reviewId, customerName/npc appearance, accepted, stars, comment, earned, tip. UI chỉ đọc snapshot và kết quả từ native; không được tự gọi addShopReview hoặc cộng rating/reward. Điểm nối vào core cần được duyệt vì hiện bridge.deliver chỉ trả boolean và lõi xóa món/khách ngay sau giao.

Sao giữ nguyên quy tắc hiện tại: 5 sao không đảm bảo chỉ vì Perfect; vẫn phụ thuộc đúng món, giá và thời gian chờ. Không đổi ngưỡng/boa trong đợt trình bày. Bản luyện tập chỉ hiện “Hoàn thành luyện tập”, không có khách thật, review, sao vào reputation hay tiền thưởng.

Tiền/kho: cùng một native settlement; bao bì đã tính bởi getDishRequirements. Nghề/nhân viên: không đổi nghề hoặc route thanh toán tự động của nhân viên. NPC/nhiệm vụ/mastery: giữ native callbacks, không chạy lại khi hết animation. Save: dùng gameState.reviews hiện có, snapshot trình bày là tạm và không cần migration. Reload không replay thông báo hoặc trả thưởng. Không cấp lại phần thưởng đã nhận và không ảnh hưởng đóng ca/sang ngày.

### Bảng công việc

| Mã | Ưu tiên | Việc | Phụ thuộc | Rủi ro/điều kiện hoàn thành |
| --- | --- | --- | --- | --- |
| FIX-12 | P0 | Bỏ khuấy bắt buộc, nhắc hạ lửa rõ hơn | Engine/quầy hiện có | M/L/XL không khuấy vẫn đạt; không cho giao đồ sống |
| PK-01 | P1 | Duyệt khung hoàn thiện/nhận món và 5 master | Hồ sơ v88.16.11, sân/NPC cũ | Không che xe, không tăng chiều cao quầy |
| PK-02 | P1 | Điểm nối kết quả native + snapshot tạm | Người dùng duyệt core hook | Không gọi thanh toán/review hai lần; không dùng món đã bị reset |
| PK-03 | P1 | Món hoàn thiện đúng bao bì và thành phần | PK-01, ảnh được duyệt | Không hiện ly/thố/mẹt sai size hoặc sai món |
| PK-04 | P1 | Khung nhận món/sao/lời nói tại sân, chuyển quick-review | PK-02, PK-03 | Kết quả từ chối/chấp nhận đúng native; không trùng toast |
| PK-05 | P1 | Nghiệm thu viewport/economy/save/chuyển khách | PK-04 | Tiền/kho/rating/review cập nhật một lần, history nguyên vẹn |

### Ma trận kiểm thử và nghiệm thu

| Ca kiểm tra | Kết quả cần đạt |
| --- | --- |
| 3 nghề × mọi bao bì đang có | Hoàn thiện hiện đúng ly/thố/đĩa/mẹt/hộp; không đổi item ID |
| Đúng món, sai món, quá giá, khách chờ lâu | Sao và bình luận bằng kết quả native, gồm cả 1–2 sao/từ chối |
| Giao spam, click lại lúc animation, event UI giả | Không cộng tiền/tip/XP hoặc trừ kho/ghi review lần hai |
| Luyện tập và nhân viên tự động | Luyện tập không phát sinh kinh tế/review; nhân viên giữ route hiện có |
| Pause/ẩn tab, khách mới, đóng ca, sang ngày | Không hiện kết quả của khách cũ lên khách mới; không chặn lịch ca/ngày |
| Load save v87.5.3.2 / save v88 hiện tại | Nghề, kho, Xu, nhiệm vụ, review và reward đã nhận giữ nguyên; không replay settlement |
| 320/390/430px, desktop; Chromium/WebKit | Kệ hai hàng, nút chạm ≥44px, khu pha 140px, khung sao không che xe/dock/điện thoại/Mika |

## Những điểm cần phê duyệt

1. Duyệt luồng hiển thị ngay trên quầy/sân, tự thu gọn, dùng lại lời khen/chê và sao native; không thêm popup nhận thưởng.
2. Duyệt danh sách 5 master đóng gói phủ 9 lựa chọn hiện có, phối hợp đợt topping/quầy đã lập kế hoạch; mẫu phải duyệt trước tích hợp.
3. Duyệt điểm nối đọc kết quả native trước khi reset món, chỉ phục vụ trình bày. Không đổi luật sao/tiền/tip trong đợt này.

Theo quy trình đính kèm: “Không triển khai vượt phạm vi đã phê duyệt.” Bản v88.16.12 chỉ thực hiện sửa bước khuấy đã được yêu cầu; phần đóng gói/nhận món/sao ở trên là hồ sơ trình duyệt, chưa thực hiện.
