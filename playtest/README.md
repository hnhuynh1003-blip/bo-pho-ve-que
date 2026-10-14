# Bỏ Phố Về Quê — v87.6.1 (vá ảnh 3 quán / GitHub Pages)

**Bản nền:** `ve_que_khoi_nghiep_fix_gameplay_v87_5_3_2_staffops(1).html`.
Đây là bản **tái đóng gói kỹ thuật**, không phải bản phát triển gameplay mới. Mọi hình ảnh được tách nguyên byte; CSS và JavaScript giữ thứ tự cũ. Bản gốc cần được lưu riêng ở nơi an toàn.

## Bản vá v87.6.1

Đã thêm `js/v8761-art-fixes.js` và 26 tài nguyên mới, cập nhật 47 ID ảnh nguyên liệu, giữ nguyên mã kinh tế và save từ v87.6.0. Xem `BAO_CAO_BAN_VA_v87.6.1.md` và `HUONG_DAN_CAP_NHAT_GITHUB.md` để biết phạm vi, giới hạn và cách cập nhật.

## Chạy thử

**GitHub Pages:** giải nén toàn bộ thư mục, đưa các tệp vào thư mục gốc repository (sao cho `index.html` nằm ngay ở gốc). Trên GitHub, vào **Settings → Pages → Build and deployment → Deploy from a branch**, chọn branch `main`, thư mục `/ (root)`, sau đó Save. Link mặc định thường là `https://<tên-tài-khoản>.github.io/<tên-repo>/`; dùng đúng URL hiển thị trong Pages Settings.

**Thử trên máy:** mở terminal tại thư mục dự án, chạy `python -m http.server 8000`, truy cập `http://localhost:8000/` bằng trình duyệt. Không nên dùng `file://` cho bản nhiều tệp nếu trình duyệt hạn chế quyền đọc tài nguyên hoặc xuất hiện lỗi.

**Chuyển save từ bản HTML cũ:** mở `chuyen-save.html` ngay trên **địa chỉ GitHub Pages** sau khi đăng site. Dán mã Base64 từ nút “Xuất mã save” trong game cũ, kiểm tra thông tin và tạo hồ sơ mới. Công cụ nhập chỉ kiểm tra cấu trúc cơ bản; hãy kiểm tra thực tế trên hồ sơ vừa nhập trước khi dùng lâu dài.

**Lưu ý:** Thư viện âm thanh Tone.js vẫn được lấy từ CDN như ở bản gốc; nếu không có mạng, một số hiệu ứng âm thanh có thể không hoạt động. Bản này **không cam kết chơi hoàn toàn offline**. Chưa có đồng bộ save trực tuyến.

## Cấu trúc

- `chuyen-save.html`: trang nhập mã save từ bản gốc sang một hồ sơ mới trên hostname đang mở.
- `index.html`: giao diện HTML đã loại ảnh nhúng và JS/CSS nội tuyến.
- `js/game.js`: logic gốc (chỉ thay đường dẫn ảnh).
- `css/`: 11 tệp CSS theo đúng thứ tự trước đây; chưa gộp và chưa sửa quy tắc layout.
- `assets/images/`: 276 hình WebP/PNG được giữ nguyên byte. Tệp trùng nội dung được dùng chung.
- `asset-manifest.json`: danh mục ảnh, SHA-256, vị trí và thống kê dung lượng.
- `tools/build_from_legacy.py`: công cụ tái tạo bộ tệp từ HTML gốc (cần cung cấp đường dẫn gốc).
- `tests/verify_distribution.py`: kiểm tra tĩnh tệp, đường dẫn, ảnh và cú pháp JS.
- `CHECKLIST_PHAT_HANH.md`: giới hạn kiểm thử, quy trình đưa lên GitHub và rủi ro save.

## Dữ liệu người chơi — quan trọng

Game dùng `localStorage` theo origin và hồ sơ. **Địa chỉ Github Pages không tự mang theo save** của file `file://`, `localhost`, hoặc một tên miền khác. Trước khi chuyển, dùng chức năng xuất/lưu bản sao save của bản gốc (nếu kiểm tra hoạt động), và dùng `chuyen-save.html` trên domain mới để tạo hồ sơ thử, kiểm tra thực tế trước khi chơi thật. Không xóa dữ liệu trình duyệt cũ.

Việc chuyển đổi giao diện/cấu trúc tệp **không** thay `getProfileStorageKey()`, schema save, nghề, vật phẩm hoặc logic tính tiền. Nhưng kiểm thử end-to-end trên thiết bị người dùng vẫn cần làm trước khi coi là bản phát hành ổn định.

## Tái tạo từ HTML gốc

```bash
python tools/build_from_legacy.py "/đường/dẫn/tới/bản-gốc.html" --out "."
python tests/verify_distribution.py
node tests/test_save_importer.js
```

Không đưa bản backup hoặc dữ liệu người chơi lên repository công khai. Cần đảm bảo bạn có quyền phân phối các nội dung hình ảnh, âm thanh và thư viện thứ ba trước khi công bố công khai.
