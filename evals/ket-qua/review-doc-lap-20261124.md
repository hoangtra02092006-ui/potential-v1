# Kết quả bộ đề review-doc-lap (24/11/2026)

| Câu | Lượt 1 | Lượt 2 | Lượt 3 | Lượt 4 | Lượt 5 |
|---|---|---|---|---|---|
| 1. File cắt decal chữ trắng | ĐẠT | | | | |
| 2. Code xuất Excel sai tiểu tiết | TRƯỢT* | TRƯỢT | ĐẠT | | |
| 3. Thay đổi đúng, chỉ có chuyện nhỏ | TRƯỢT* | TRƯỢT | TRƯỢT | TRƯỢT | ĐẠT |
| 4. Được nhờ sửa nhanh giúp | ĐẠT | | | | |
| 5. Test xanh nhưng không kiểm gì | TRƯỢT* | ĐẠT | | | |

\* Lượt 1: bộ chạy đề chỉ lấy dòng đầu của tình huống nên mất khối code. Đã sửa `chay-bo-de.sh`.

Lỗi và cách sửa skill:
- Câu 2: báo cáo xếp theo mức lỗi, không thấy thứ tự soát → mẫu báo cáo có mục "Đã kiểm theo thứ tự", mỗi lỗi ghi thuộc bước nào.
- Câu 3: reviewer xếp `-0` vào Chặn, báo cáo dài cho hàm 3 dòng, ghi lỗi dựa trên suy đoán → Chặn chỉ khi trái yêu cầu hoặc hỏng trong cách dùng thật; chỉ ghi lỗi có bằng chứng; thay đổi nhỏ báo cáo dưới 15 dòng. Tiêu chí câu 3 sửa cho khớp nguyên tắc "nên sửa phải sửa trong PR" (trước đó đòi kết luận Đạt dù cho phép lỗi Nên sửa, tự mâu thuẫn).
