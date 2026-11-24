# Changelog

## 0.4.0 (24/11/2026)
- Thêm skill `giao-dien`, viết từ câu trả lời thật của người quản lý: phong cách theo mục đích web (quản lý: tối giản mà chỉn chu; marketing: chuyên nghiệp, thu hút, có thể đề xuất 3D và chuyển động), DESIGN.md cho mỗi dự án, thư viện chọn theo dự án, tự chụp màn hình 390px và 1280px rồi soát theo thứ tự màu và chữ → bố cục → nội dung, danh sách chống giao diện "trông AI".
- Tham khảo: leonxlnx/taste-skill, voltagent/awesome-design-md, vercel-labs/agent-skills, addyosmani/agent-skills, microsoft/playwright-cli.
- `evals/chay-bo-de.sh`: agent làm bài được chạy lệnh (để dựng và chụp màn hình); người chấm tự mở file và ảnh.
- Bộ đề 5 câu, lượt 1 đạt 5/5; câu 5 dựng thật trang demo, xem ở `evals/ket-qua/giao-dien-demo/`.

## 0.3.0 (24/11/2026)
- Thêm skill `thiet-ke-loi-giai`, viết từ câu trả lời thật của người quản lý: tiêu chí chỉ frontend hay có backend, công nghệ mặc định Java + Vue/Nuxt nhưng đề xuất theo yêu cầu, kiến trúc luôn có bảng lợi và hại (bài học monolith build lâu, khó hiểu cho người mới), bản thiết kế phải có cấu trúc tổng quan, tổng quan giao diện và hạn chế.
- Theo góp ý của người quản lý: agent chỉ đề xuất, người quản lý quyết vấn đề nhạy cảm; thiết kế cân theo cỡ việc (web đơn giản xong trong vài giờ), luôn có ước lượng thời gian và cách chia agent; kiến trúc không thiên về kiểu nào.
- Thêm phần tham khảo từ 3 repo (addyosmani/agent-skills, wshobson/agents): kiểu kiến trúc, bản đồ module, sơ đồ tổng quan 2 tầng, hợp đồng API, ADR. Tổng hợp ở `docs/tham-khao-3-repo.md`.
- Bộ đề 5 câu, lần chạy cuối đạt 5/5. Thêm `evals/chay-bo-de.sh` (chạy cả bộ hoặc vài câu).

## 0.2.1 (24/11/2026) — skill lam-ro-yeu-cau được duyệt
- Người quản lý duyệt skill `lam-ro-yeu-cau` và cả 5 câu trong bộ đề (câu 4, 5 hết là suy đoán).
- Không ghi tên người trong plugin: đổi tên plugin thành `bo-chuan`, kho thành `noal-drm-plugins`, tác giả `noal.drm`; mọi chỗ khác ghi "người quản lý".

## 0.2.0 (24/11/2026)
- Thêm skill `lam-ro-yeu-cau` cho agent quản lý, viết từ câu trả lời thật của người quản lý: 4 nhóm câu hỏi (ngành, thông tin, nghiệp vụ, đầu ra), thông số chuyên ngành phải đề xuất và chờ khách chốt, tiêu chí "đủ rõ".
- Bộ đề 5 câu ở `evals/lam-ro-yeu-cau.md`. Lượt 1 đạt 3/5 (agent hỏi quá nhiều), sửa skill, lượt 2 đạt 5/5. Kết quả ở `evals/ket-qua/`.

## 0.1.0 (24/11/2026)
- Dựng lại từ đầu thành bản nền: nguyên tắc chung nạp tự động khi mở phiên (hook SessionStart), 2 luật cứng, khung bộ đề kiểm tra. Chưa có skill.
- Lý do: bản 0.7.1 nặng quy trình, mỏng cách phán đoán, không có cách kiểm agent đã giống người quản lý chưa.
