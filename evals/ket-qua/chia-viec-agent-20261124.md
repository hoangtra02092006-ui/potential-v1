# Kết quả bộ đề chia-viec-agent (24/11/2026)

| Câu | Lượt 1 | Lượt 2 | Lượt 3 |
|---|---|---|---|
| 1. Web quản lý đơn sỉ cà phê | TRƯỢT | TRƯỢT | ĐẠT |
| 2. Trang demo nhỏ | TRƯỢT | ĐẠT | |
| 3. Hai tính năng cùng sửa một file | ĐẠT | | |
| 4. Viết thẻ việc có tiểu tiết | ĐẠT | | |
| 5. Hợp đồng API sai giữa chừng | TRƯỢT | ĐẠT | |

Lỗi và cách sửa skill:
- Lượt 1, câu 1: thẻ khung quá 5 file, thẻ gom không có danh sách file, hai thẻ cùng đợt cùng sửa CLAUDE.md, hai thẻ phụ thuộc nhau xếp cùng đợt → thêm bước tự soát bảng chia việc; khung cũng theo giới hạn 5 file, file riêng của module để cho thẻ module.
- Lượt 1, câu 2: trang demo một file vẫn chia 3 thẻ (khung, logic, giao diện) → việc nhỏ thì một agent làm trọn, không tách khung.
- Lượt 1, câu 5: chưa đánh giá ảnh hưởng trước khi cho chạy tiếp → thêm 3 bước điều phối xử lý khi hợp đồng sai.
- Lượt 2, câu 1: một thẻ ghi thư mục thay vì file, tự soát vẫn ghi đạt → ghi từng file cụ thể, file chỉ đọc ghi riêng, đếm thật.
