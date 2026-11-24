# Changelog

## 0.3.0 (24/11/2026)
- Thêm skill `thiet-ke-loi-giai`, viết từ câu trả lời thật của người quản lý: tiêu chí chỉ frontend hay có backend, công nghệ mặc định Java + Vue/Nuxt nhưng đề xuất theo yêu cầu, kiến trúc luôn có bảng lợi và hại (bài học monolith build lâu, khó hiểu cho người mới), bản thiết kế phải có cấu trúc tổng quan, tổng quan giao diện và hạn chế.
- Bộ đề 5 câu, lượt 1 đạt 5/5. Thêm `evals/chay-bo-de.sh` để chạy bộ đề của bất kỳ skill nào.

## 0.2.1 (24/11/2026) — skill lam-ro-yeu-cau được duyệt
- Người quản lý duyệt skill `lam-ro-yeu-cau` và cả 5 câu trong bộ đề (câu 4, 5 hết là suy đoán).
- Không ghi tên người trong plugin: đổi tên plugin thành `bo-chuan`, kho thành `noal-drm-plugins`, tác giả `noal.drm`; mọi chỗ khác ghi "người quản lý".

## 0.2.0 (24/11/2026)
- Thêm skill `lam-ro-yeu-cau` cho agent quản lý, viết từ câu trả lời thật của người quản lý: 4 nhóm câu hỏi (ngành, thông tin, nghiệp vụ, đầu ra), thông số chuyên ngành phải đề xuất và chờ khách chốt, tiêu chí "đủ rõ".
- Bộ đề 5 câu ở `evals/lam-ro-yeu-cau.md`. Lượt 1 đạt 3/5 (agent hỏi quá nhiều), sửa skill, lượt 2 đạt 5/5. Kết quả ở `evals/ket-qua/`.

## 0.1.0 (24/11/2026)
- Dựng lại từ đầu thành bản nền: nguyên tắc chung nạp tự động khi mở phiên (hook SessionStart), 2 luật cứng, khung bộ đề kiểm tra. Chưa có skill.
- Lý do: bản 0.7.1 nặng quy trình, mỏng cách phán đoán, không có cách kiểm agent đã giống người quản lý chưa.
