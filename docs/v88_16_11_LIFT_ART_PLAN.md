# v88.16.11 — nhấc nồi, gắp xiên và hồ sơ nâng cấp mỹ thuật

## Sửa cơ chế trong bản này

Trước đây nút lấy món xuống phụ thuộc toàn bộ điều kiện hoàn thiện, kể cả khuấy nồi hoặc phủ sốt. Thiếu một bước làm món tiếp tục nhận nhiệt, dễ quá chín dù người chơi muốn dừng bếp.

Hàng thao tác có nút Nhấc nồi / Gắp ra từ khi bắt đầu nấu. Nút này dừng nhiệt ngay, kể cả khi món chưa đạt. Ngoài bếp, thời gian nấu, nhiệt, độ chín hai mặt và nguy cơ cháy/trào giữ nguyên; không tính thời gian nghỉ vào yêu cầu nấu tối thiểu. Món chưa đạt có thể Đặt lại bếp / Đặt lại vỉ để tiếp tục cùng mẻ, không bắt chọn nguyên liệu từ đầu. Mì có thể khuấy khi đã nhấc; xiên có thể quét sốt trên đĩa/mẹt/hộp, chờ 0,5 giây sốt bám rồi hoàn thiện. Lật xiên chỉ dùng trên vỉ.

Món đã đủ điều kiện được hoàn thiện khi nhấc/gắp, sau đó người chơi vẫn bấm Giao để thanh toán. Món chưa đủ bước ở trạng thái held, nút chính đặt lại bếp hoặc hoàn thiện khi đã đạt. Hướng dẫn nói rõ còn thiếu độ chín, khuấy, giữ sôi nhẹ, thời gian hay sốt. Một lần bấm lửa mì từ lớn chuyển về vừa. SVG cập nhật tại chỗ: nồi nhấc cao khỏi lửa; vỉ đổi thành đúng đĩa, mẹt tre hoặc hộp đã chọn. Không sinh thêm thẻ hay dựng lại SVG theo frame.

Giữ điều kiện chín, thời gian tối thiểu, Perfect/Good, quyền thanh toán của lõi, pause/ẩn tab và hủy chứng nhận khi đổi món/khách. Không sửa game.js trong bản này. Không đổi ID, công thức, giá, tip, kho, save, nghề, ngày/ca hoặc quyền nhân viên. Trà sữa giữ nguyên cơ chế rót/cap.

## Kết quả rà tài nguyên

Danh sách chi tiết: `v88_16_11_ingredient_audit.csv`, 81 mục đang có trong catalog: 52 topping/xiên (trà sữa 16, mì 18, xiên 18) và 29 cốt trà/nước dùng/sốt. Không tính ID cũ ngoài catalog vào số lượng cần sản xuất.

| Mức | ID | Bằng chứng | Xử lý hiện tại / đợt sau |
| --- | --- | --- | --- |
| P0 | ntop_beef, ntop_meatball | File mở được nhưng ảnh có khối nhiễu nhiều màu, xác nhận khi xem ảnh | Ngừng ánh xạ ảnh lỗi, dùng icon vốn có; thay ảnh sạch sau duyệt |
| P0 | ntop_shrimp, skewer_fish, broth_tonkotsu | WebP đọc header nhưng decoder báo `failed to read next frame` | Ngừng ánh xạ ảnh lỗi, dùng icon vốn có; thay ảnh sạch sau duyệt |
| P1 | ntop_nori, ntop_porkbelly | Chưa có ảnh kệ riêng, đang dùng icon | Bổ sung ảnh đúng rong biển / ba chỉ |
| P1 | Các topping mì/xiên còn lại | Nhiều ảnh raster lẫn mảnh món bên cạnh ở mép; các SVG mới là hình bát/emoji thay vì nguyên liệu thật | Rà từng ID, ưu tiên ảnh lẫn vật thể / nhầm hình; không kết luận tất cả hỏng |
| P2 | Trà sữa | Phần lớn ảnh dùng được, hướng cute đã được người dùng thích | Giữ thiết kế; chỉnh riêng điểm sai hình/độ nhất quán nếu được duyệt |

Ảnh gốc không bị xóa hoặc sửa. CSV giữ tên file lỗi trong cột legacy_quarantined_file để truy nguồn và phục hồi. Đường kệ fallback dùng icon theo item thực; màu/hình mô phỏng trong món vẫn bám ID và số lượng như bản trước.

Có sẵn 5 ứng viên ảnh sạch: `v8761_clean_skewer_cheese_sausage.webp`, `v8761_clean_sauce_tamarind.webp`, `v8761_clean_sauce_mayo.webp`, `v8761_clean_sauce_bbq.webp`, `v8761_clean_sauce_honey_mustard.webp`. Đây là ứng viên tận dụng, chưa thay vào runtime vì cần xem từng ảnh với quầy. Tên “clean” chưa được coi là bằng chứng đạt nghiệm thu.

## Kế hoạch mỹ thuật đề xuất — chờ duyệt sản xuất

Một bộ quy chuẩn chung cho cả ba quán, ba bộ dụng cụ riêng theo nghề. Dùng sân và ảnh xe đã có ở bản v88.16.9 làm tham chiếu; giữ góc nhìn, ánh sáng ấm và chất liệu hợp cảnh. Không dựng lại NPC hoặc sân từ đầu.

| Quán | Bảng màu / vật liệu | Dụng cụ đồng bộ |
| --- | --- | --- |
| Trà sữa | Kem, gỗ mật ong, xanh sage; kính trong | Khay topping nhỏ và bình trà đang có, ly/đế ly, nhãn nguyên liệu cùng phong cách |
| Mì cay | Kem, đất nung, nâu gỗ; kim loại ấm | Nồi/bếp, vá/kẹp, khay topping, thố mì và đế nồi |
| Xiên que | Xanh olive của xe hiện có, vàng mật ong, nâu tre; vỉ kim loại | Vỉ/kẹp, khay xiên sống, cọ/bát sốt, đĩa/mẹt/hộp sau khi gắp |

Quy chuẩn ảnh: nền trong suốt thật, không chữ/nhãn/UI/ô màu dính trong ảnh, không mảnh món bên cạnh, một đối tượng chính, cùng góc nhìn và ánh sáng. Tên/stock/số phần là UI riêng. Master 512×512 hoặc 1024×1024; runtime WebP alpha khoảng 128–256px theo kích thước hiển thị. Kiểm tra ở cỡ thumbnail thực trên kệ trước khi chốt dung lượng. Chừa khoảng an toàn quanh vật thể; không cắt que, đuôi tôm hoặc mép nồi.

Tách ảnh nguyên liệu trên kệ, dụng cụ/quầy và biểu diễn nguyên liệu trong món. Không dùng cùng một ảnh bát mì cho mọi topping. Ảnh kệ ưu tiên nhận diện nguyên liệu; món đang làm tiếp tục hiện đủ loại/màu/số lượng. Nếu thay SVG mô phỏng bằng sprite, sprite phải giữ hợp đồng đó và dùng trạng thái sống/chín/phủ sốt cho xiên. Quyết định sprite riêng được duyệt cùng mẫu, không tự mở rộng thành cơ chế mới.

### Thứ tự triển khai

1. Duyệt quy chuẩn và lô mẫu đầu: 7 mục ưu tiên ở bảng trên (5 lỗi, 2 thiếu). Dùng hình trà sữa/quầy/sân hiện có làm tham chiếu, không vẽ lại toàn bộ 52 topping.
2. Xem 5 ứng viên ảnh sạch có sẵn, đối chiếu đúng món và phong cách; tận dụng những ảnh đạt. Duyệt một cụm quầy nhỏ cho từng nghề để ảnh topping và dụng cụ cùng chất liệu.
3. Thay từng đường ảnh theo ID trong thư mục phiên bản mới; giữ file gốc và ghi nguồn, prompt, hash, trạng thái duyệt. Rà các ảnh mì/xiên bị cắt hoặc sai hình; chỉ sản xuất thêm những ảnh không thể tận dụng.
4. Gắn vào cùng khu pha/kệ hiện tại: khu pha 140px, kệ 2 hàng khoảng 10 nguyên liệu, vùng chạm ≥44px, tab dưới cố định, điện thoại/Mika nổi và sân gọn. Không thêm khoảng trống/thẻ trùng hoặc animation trang trí chạy liên tục.
5. Nghiệm thu ba nghề ở 320/390/430px và desktop: ảnh tải/giải mã được, trong suốt đúng, đọc ra nguyên liệu ở cỡ nhỏ, không cắt/che nút, không nhảy khi có khách. Chơi đủ vòng nấu–nhấc–đặt lại–hoàn thiện–giao; kiểm tra số lượng/màu và tiền/kho/save không đổi ngoài thanh toán vốn có.

Phạm vi đợt sau là topping và trang trí quầy, không tự mở rộng thành thay toàn bộ 27 shell/nâng bậc quán. Bản này chỉ sửa cơ chế, chặn ảnh lỗi và lập kế hoạch; chưa tạo hay tích hợp bộ ảnh mới.

## Kiểm chứng v88.16.11

Unit dùng đồng hồ kiểm soát: nhấc sớm giữ nguyên mức nhiệt/chín trong 10 giây; đặt lại tiếp tục cùng mẻ; không thể giao đồ sống; khuấy ngoài bếp; phủ sốt trên đĩa đủ thời gian rồi hoàn thiện; lấy món đủ bước hoàn thiện một lần; pause/ẩn tab/đổi khách vẫn chặn đúng.

Browser live/practice cho mì và xiên: nhấc sớm và đặt lại qua nút thật, giữ độ chín ngoài bếp, gắp xiên trước quét sốt, đổi vỉ thành khay, hoàn thiện Perfect và native thanh toán một lần. Geometry compact/steady giữ bố cục và không dựng lại SVG. Chromium chạy tại chỗ; Chromium/WebKit chạy trong CI GitHub. Không tuyên bố đã thử trên điện thoại vật lý.
