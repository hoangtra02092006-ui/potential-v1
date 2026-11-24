# Kiểm đầu ra trong điều kiện thật

Đầu ra đúng trên màn hình của agent chưa chắc đúng ở nơi dùng. Với mỗi đầu ra, hỏi: **nó sẽ được dùng ở đâu, trên thiết bị nào, bởi ai** rồi kiểm trong đúng điều kiện đó, hoặc giả lập gần nhất có thể.

| Đầu ra | Nơi dùng thật | Kiểm gì |
|---|---|---|
| File in, file cắt (PNG, SVG, PDF, TIF) | Máy in, máy cắt, trên giấy hoặc vật liệu có màu | Đặt lên nền màu giấy thật (trắng, kraft, trong suốt) rồi xem: chữ hoặc nét **trùng màu nền** (vd chữ trắng trên giấy trắng) sẽ mất; nét quá mảnh; ảnh thiếu DPI; kích thước thật (mm) đúng khổ; hệ màu (CMYK/RGB) đúng thông số máy; đường cắt khép kín |
| File Excel, CSV | Excel trên Windows của khách | Mở được, tiếng Việt không lỗi font (UTF-8 có BOM với CSV), định dạng số và ngày đúng kiểu Việt Nam, cột không bị cắt, công thức tổng đúng |
| Màn hình web | Điện thoại và máy tính của người dùng | Chụp 390px và 1280px, mạng chậm, dữ liệu thật dài, tài khoản không có quyền |
| Email, tin nhắn | Hộp thư của khách | Hiển thị trên Gmail và điện thoại, link đúng, không lộ dữ liệu người khác |
| API | Ứng dụng gọi thật | Gọi với dữ liệu thật, thiếu quyền, đầu vào sai; mã lỗi đúng hợp đồng |
| Số liệu báo cáo | Người quản lý, khách đọc để quyết định | Tính tay lại vài dòng, tổng khớp, số đúng nghĩa nghiệp vụ |

Cách giả lập nhanh với file ảnh: ghép ảnh lên một nền đúng màu vật liệu rồi xem; hoặc tách kênh và liệt kê các màu có trong file, so với màu nền của vật liệu. Màu nào trùng hoặc quá gần màu nền là lỗi Chặn nếu phần đó cần hiện.

Không giả lập được điều kiện thật thì ghi rõ "chưa kiểm được trên <thiết bị>" trong báo cáo, kèm cách người quản lý kiểm tay; không ghi đạt.
