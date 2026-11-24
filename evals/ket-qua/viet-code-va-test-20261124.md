# Kết quả bộ đề viet-code-va-test (24/11/2026)

| Câu | Lượt 1 | Lượt 2 | Lượt 3 | Lượt 4 |
|---|---|---|---|---|
| 1. Thống kê mét in (ảnh lồng) | ĐẠT | | | |
| 2. Lịch trả góp | TRƯỢT | ĐẠT | | |
| 3. Hoá đơn ngoại tệ | ĐẠT | | | |
| 4. Màn danh sách | TRƯỢT | ĐẠT | | |
| 5. Con số chưa rõ nghĩa | TRƯỢT | TRƯỢT | TRƯỢT | ĐẠT |

Lỗi và cách sửa skill:
- Câu 2: agent dừng hỏi 3 chi tiết có mặc định thông dụng (làm tròn, lãi tháng, dạng trang demo), không code → thêm "khi nào hỏi, khi nào làm luôn": chi tiết có mặc định thì ghi giả định và làm đến khi test xanh.
- Câu 4: chỉ có một component cho cả màn → ghi rõ tên từng component nhỏ, gọi dữ liệu để trong composable.
- Câu 5: agent chuyển sang skill lam-ro-yeu-cau, soạn phiếu hỏi khách 6-11 câu → chỉ hỏi chỗ đang chặn thẻ, tối đa 3 câu gửi điều phối, không soạn phiếu hỏi khách ở bước code; mô tả lam-ro-yeu-cau ghi rõ ranh giới. Chạy lại bộ đề lam-ro-yeu-cau sau thay đổi: 5/5 (câu 1 chạy lại lần 2 mới đạt, lỗi một câu con thiếu "vì sao hỏi", không liên quan thay đổi).
