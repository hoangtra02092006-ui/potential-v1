# Bẫy hay gặp

Soát từng dòng trước khi báo xong. Mỗi bẫy kèm ca test nên có.

| Bẫy | Ví dụ thật | Ca test nên có |
|---|---|---|
| Tối ưu nội bộ làm sai số báo khách | Ảnh được lồng vào khoảng trống của ảnh khác để tiết kiệm giấy → thống kê báo 0 m, trong khi khách cần số mét thật của ảnh | Ảnh nằm lồng trong ảnh khác vẫn ra đúng số mét của chính nó; tổng báo khách khác tổng giấy thực dùng |
| Làm tròn từng bước | Dư nợ cuối kỳ 475.000.001 đồng | Tổng các kỳ đúng bằng số gốc; dư nợ cuối kỳ đúng 0 |
| Số thực nhị phân cho tiền | 0,1 + 0,2 = 0,30000000000000004; tỷ giá nhân chia lệch vài đồng | Cộng nhiều khoản lẻ, quy đổi tỷ giá hai chiều, so khớp từng đồng |
| Dữ liệu rỗng | Danh sách rỗng làm chia cho 0, trang trắng, tổng NaN | 0 dòng, 1 dòng, trường bị bỏ trống |
| Múi giờ | Đơn đặt 23:30 bị tính sang ngày hôm sau; lọc "hôm nay" thiếu đơn | Mốc 23:59 và 00:00 giờ Việt Nam, đầu tháng, cuối tháng |
| Đơn vị đo | Trộn mm, cm, inch, px, DPI khi tính khổ in | Đổi đơn vị hai chiều; ảnh có DPI khác nhau |
| Windows | Đường dẫn viết cứng "/", ký tự xuống dòng CRLF, script chỉ chạy bash | Chạy lệnh của dự án trên Windows hoặc dùng path.join; không phụ thuộc lệnh chỉ có trên Linux |
| Tiếng Việt | Sắp xếp sai thứ tự có dấu, tìm kiếm "Đ" không ra "D", font mất dấu | Sắp xếp và tìm kiếm với tên có dấu |
| Giới hạn | Xuất 10.001 dòng làm treo, chuỗi dài vỡ giao diện | Đúng ngưỡng, vượt ngưỡng một đơn vị |
| Quyền | Người không có quyền vẫn gọi được API | Gọi API bằng tài khoản không có quyền |
