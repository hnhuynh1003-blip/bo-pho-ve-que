# BPVQ v88 — Đợt 12: B1 Draft 5 — Bản TEST tương tác độc lập (QA, không phải game tích hợp)

**Ngày:** 12/10/2026. **Mục tiêu:** chuyển từ duyệt mỹ thuật lặp lại sang **bản tương tác để người dùng tự thử ngay** rồi gom nhận xét thành một đợt. Không làm giả trạng thái phát hành asset.

## 1. Deliverables — lưu tên chính xác để tiếp tục qua chat

- Bản HTML **một tệp**, dùng offline không CDN: `BPVQ_v88_B1_Draft5_TEST_TUONG_TAC.html`, SHA-256: `3ccb803fc6463a70f135a2517fabbf24951b49b93a864b664cab4ed4090f1abd`.
- ZIP chứa bản HTML + hướng dẫn: `BPVQ_v88_B1_Draft5_TEST_TUONG_TAC.zip`, SHA-256: `3ab9a208664cb68bc09c64b7163a7ac4eb1f0376dabec9443091754600329770`.
- Cả hai đã **upload lên Thư viện người dùng** tại thư mục `/làm game 2d: bỏ phố về quê/` (tệp ở chat hiện tại cũng có thể tải); không commit asset nháp binary vào `assets/images/v88/shops/`.
- Bản ảnh lấy đúng 6 biến thể B1 Draft 5 từ gói QA ngoài repo, nén lại WebP 1200×900 quality 90 và embed base64; không dựng mới cảnh quán khác.

## 2. Tính năng người dùng có thể thử trực tiếp
- Chọn **6 màu dù** (mặc định, kem sữa, trắng kem, hồng trà, xanh quê, mật ong).
- Nhập tên quán tối đa 32 ký tự, biển hiệu S1 là text DOM (`textContent`, chống HTML injection), không bake lên ảnh.
- Hiện/ẩn 6 neo `S1, S5, S6, S8, S11, S14`, kéo bằng con trỏ/chạm hoặc tinh chỉnh bằng phím mũi tên.
- Khôi phục 6 neo tham khảo; xuất JSON có `approved:false`; lưu trạng thái thử nghiệm vào **duy nhất** khóa `BPVQ_V88_B1_DRAFT5_QA_ONLY_v1`.
- **Tuyệt đối không gọi hoặc sửa** `gameState`, save v87/v88, `decorV88`, kho, tiền, SP, nhân viên, ca bán. Không giả lập chuyện mua decor.

## 3. Kiểm thử đã thực hiện (Chromium headless)
- 5 viewport: **320×730, 375×812, 390×844, 430×932, 1365×768**.
- Mỗi viewport: ảnh nguồn decode kích thước 1200×900; 6 preset/6 slot hiện đúng; không scroll ngang; nhập tên chứa HTML vẫn là chữ an toàn, không sinh thẻ DOM; chọn màu; tinh chỉnh S5 bằng phím; lưu và tải lại state QA bằng localStorage mock, không sửa khóa save game; 0 JS page errors.
- Kéo thực tế S11 bằng pointer tại 390px: PASS, ví dụ `(24.2%,70.6%)→(31.1%,67.7%)`.
- Screenshot tại 390px & 1365px lưu trong gói trao đổi; **không khẳng định** đã test iOS/Android thật.
- Hạn chế của môi trường: policy không cho Chromium điều hướng `file://` hoặc localhost nên dùng Playwright `page.set_content` với HTML thật để test DOM/layout; các hành vi persist được kiểm thử với localStorage mock, **chưa xác nhận riêng file-origin persistence trên máy người dùng**.

## 4. Không đồng nhất QA demo và game release
- **Playtest QA B1 ≠ tích hợp gameplay v88**; còn thiếu chính thức pipeline art, phê duyệt hình, 6 anchor final, mua/lắp/cất decor trên giao diện game, save migration và mobile thiết bị thật.
- Ảnh Draft 5 **chưa duyệt mỹ thuật**: tiếp tục rà vết vá 2 cột và họa tiết lặp ở hàng rào chậu hoa. Không tự bật `approved:true`.
- PR #1 Draft, `main` và save người chơi không đổi. Registry 27 scene giữ 0 ready cho đến khi có nghiệm thu.

## 5. Tiêu chí kế tiếp (không bắt người dùng duyệt từng lỗi)
1. Thu nhận **một lượt** góp ý trên bản HTML đã test, không mở lại các quyết định kiến trúc/chậu hoa đã chốt.
2. Gom các chỉnh ảnh, mask, S1, anchor còn thiếu thành **một lô hoàn thiện B1**, tự test trước khi bàn giao.
3. Sau khi người dùng phê duyệt art cuối, tích hợp vào **nhánh v88 riêng**, chạy smoke game trên ba nghề, ca bán, Kho Nội Thất, Xu/SP, save v87. Chỉ khi CI/UAT PASS mới trình bản **game test đầy đủ** để nghiệm thu; không tự merge main.

## 6. Tái lập và tính toàn vẹn
- Nguồn test: `B1_DRAFT5_CANOPY_{ORIGINAL,CREAM,VANILLA,TEA_ROSE,SAGE,HONEY}_QA.png` từ `BPVQ_V88_B1_DRAFT5_KIEM_DUYET_CHUA_DUYET.zip`.
- SHA-256 file nền Draft5 `B1_DRAFT5_RETOUCH_CANDIDATE_CHUA_DUYET.png`: `c587d3587d7a5615126460f71809376f0fc3fb592e491466d7186acdf434b16d`.
- Bản HTML ZIP trong Thư viện giúp giảm nguy cơ mất asset khi đổi chat; GitHub doc làm trạng thái và tiêu chí nguồn chuẩn; nếu không đọc được byte Library ở phiên sau, người dùng có thể đính kèm lại bản HTML/ZIP đã tải, **không phải duyệt từ đầu**.
