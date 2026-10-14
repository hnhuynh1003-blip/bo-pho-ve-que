BỎ PHỐ VỀ QUÊ — v88.16.3 QUẦY CUTE CỐ ĐỊNH / BẢN THỬ

Nền: v88.16.2, nhánh feat/v88-phone-os-core.

ĐÃ SỬA
- Quầy được đặt sẵn ngay từ lúc nghỉ ca: phiếu đơn, khu pha, giá, khay và nút thao tác luôn giữ chỗ.
- Khách đến/rời/giao xong chỉ đổi nội dung, thời gian, stock và trạng thái nút.
- Đơn dài cuộn trong phiếu cố định; không tự thêm thẻ hoặc đẩy các khối phía dưới.
- Giữ nút nguyên liệu, thanh đường/đá, size và SVG món qua các lượt khách.
- Lúc chờ không chạy vòng requestAnimationFrame; lúc rót/nấu chỉ cập nhật thuộc tính hình, tối đa khoảng 30 lần/giây.
- Vẫn có một nơi chọn cốt trà và một phiếu đơn. Tab khu vực cố định ở đáy.

HÌNH QUẦY
- Nền gỗ sáng, ly trong suốt có nước/đá/topping, chồng ly M/L/XL.
- Hai prop ImageGen mới: bình trà có vòi và viền khay mây/gốm, dùng chung cho catalog gốc.
- 9 cốt trà, 15 topping và siro dùng đúng ID/ảnh nguyên liệu có sẵn; hình lớn hơn, số kho ở góc.
- Hai WebP mới tổng cộng khoảng 50 KB. File PROMPTS_V88_16_3.txt có prompt; provenance.json có nguồn và checksum.
- Không thay hoặc tự duyệt ảnh ngoại cảnh B1–B9.

BẢO TOÀN
Không đổi js/game.js so với v88.16.2. Không đổi schema save, nghề, giá, kho, tiền, nhiệm vụ, thưởng hoặc luật giao đơn.
Luyện tập vẫn miễn phí, không ghi vào tiền/kho. Giao món do hệ thống gốc xử lý một lần.
Giữ main chưa merge; đây là bản test trên nhánh phát triển.

KIỂM TRA
- Chromium: 320/390/430px và desktop 1366px, đủ ba nghề; tab đáy và hành vi chọn nguyên liệu.
- 40 lần chuyển trạng thái khách/chờ trên 320/390px và 3 nghề: vị trí/chiều cao các khối lệch dưới 1px.
- SVG không bị dựng lại trong 1,65 giây không thao tác; DOM nút, range và ly được giữ qua lượt khách.
- Pha trà, nấu mì và nướng xiên ở luyện tập đạt trạng thái hoàn thành, không đổi Xu/kho và dừng hoạt ảnh khi kết thúc.
- Regression topping theo số phần, vốn, trừ kho và chặn giao hai lần.
- Chưa test Android/iPhone thật. Kiểm tra trên máy người chơi vẫn cần thiết.

CÁCH TEST
1. Giải nén thư mục phiên bản, giữ index.html cùng css/, js/, assets/.
2. Dùng cùng địa chỉ web và trình duyệt bạn đang chơi nếu muốn tiếp tục save cục bộ; sao lưu trước khi đổi bản.
3. Tải lại trang hoàn toàn để nạp CSS/JS mới (Ctrl+F5 trên máy tính).
4. Quan sát lúc nghỉ ca, mở quán, khách đến, giao xong và khách tiếp: quầy phải giữ nguyên vị trí.
5. Xem Cốt trà/Topping/Siro; đổi size; thử pha và giao. Đơn dài có thể cuộn trong phiếu.
6. Thử Tập chế biến; Xu/kho không được thay đổi. Thử tab khu vực ở đáy khi cuộn.
