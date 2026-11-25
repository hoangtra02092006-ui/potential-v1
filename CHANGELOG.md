# Changelog

Bài học cụ thể và kết quả bộ đề của từng lần sửa. Bảng điểm hiện tại ở `evals/ket-qua.md`.

## 0.10.0 (25/11/2026)
Sửa `giao-dien` sau lần thử trên web thời trang (vòng 1 bị nhận xét "như album ảnh").
- Loại web **bán hàng** có khung khối riêng (`references/trang-ban-hang.md`); luật landing "mỗi khối một màn hình" chỉ cho landing.
- Bảng `references/chon-hinh-mau.md`: loại web → bản nào trong awesome-design-md → lấy phần nào.
- Bắt buộc ảnh thiết kế trước khi code màn hình chính, so cạnh sau mỗi vòng. Chưa có hình mẫu: hỏi, đồng thời dựng 2-3 hướng thật.
- Thêm 4 nét giao diện AI; thử phông với chữ hoa hai dấu; ảnh sản phẩm cùng nền; lưới cố định dùng `minmax(0,1fr)`; trước khi đưa duyệt chạy copy-lint, luật Vercel, đo tràn bằng code.
- Bộ đề thêm câu 8, 9: 4/4 sau một lần sửa (câu 7 trượt vì agent bỏ bước hỏi hình mẫu).
- `chay-bo-de.sh`: agent làm bài không dùng bộ nhớ chung (đã từng ghi dự án giả vào đó).
- Báo cáo soát giao diện giữ thứ tự màu chữ → bố cục → nội dung (câu 4 trượt khi chạy lại cả bộ, đã sửa).
- Dọn repo: bỏ bài làm và bài chấm đầy đủ trong `evals/ket-qua/` (thay bằng bảng `evals/ket-qua.md`), bỏ `docs/tham-khao-3-repo.md` (đã đưa hết vào skill), rút gọn CHANGELOG và README, đồng bộ phiên bản ở marketplace.json; `thiet-ke-loi-giai` bỏ đoạn lặp nguyên tắc chung. Chạy lại cả bộ giao-dien 9/9 và thiet-ke-loi-giai 5/5.

## 0.9.0 (24/11/2026)
- Skill `khoi-tao-du-an`: khung chuẩn (CLAUDE.md có lệnh đã chạy thử và bản đồ thư mục, CONSTRAINTS.md, DESIGN.md, docs/, test mẫu, lint, README Windows, CI). Bài học "cấu trúc lộn xộn khó xem xét": mỗi thư mục một mục đích, sắp lại dự án cũ theo đợt nhỏ có duyệt. Bộ đề 3/5 → 5/5.

## 0.8.0 (24/11/2026)
- Skill `phat-hanh`: kiểm 4 mục trước deploy, agent chuẩn bị gói, người quản lý bấm deploy; đổi dữ liệu 2 bước khi có dữ liệu thật; lỗi Chặn trên production thì lùi trước, sửa sau. Bộ đề giả định 4/5 → 5/5 (gói quá nặng cho dự án nhỏ).

## 0.7.0 (24/11/2026)
- Skill `review-doc-lap` và agent `reviewer`: BA khi kiểm nghiệp vụ, senior khi soát code, chỉ báo lỗi không tự sửa; ba mức Chặn / Nên sửa / Góp ý, không thổi phồng. Bài học chữ trắng trên giấy trắng: kiểm đầu ra ở điều kiện dùng thật. Bộ đề 2/5 → 5/5 (một phần do lỗi cắt đề nhiều dòng của `chay-bo-de.sh`, đã sửa).

## 0.6.0 (24/11/2026)
- Skill `viet-code-va-test`: nghĩa nghiệp vụ của từng con số (bài học ảnh lồng báo 0 m); kết quả mong đợi lấy từ yêu cầu; tiền doanh nghiệp, ngoại tệ dùng decimal chính xác, web đơn giản số nguyên đồng; chỉ hỏi chỗ mơ hồ đang chặn. Bộ đề 2/5 → 5/5.

## 0.5.0 (24/11/2026)
- Skill `chia-viec-agent`: khung chung trước, rồi backend và frontend song song; tối đa 5 agent, 5 file mỗi agent, không sửa chung file; thẻ việc chép nguyên văn yêu cầu, có tiểu tiết và ca biên. Bộ đề 2/5 → 5/5.

## 0.4.0 (24/11/2026)
- Skill `giao-dien`: phong cách theo loại web, DESIGN.md, hình mẫu trước code, tự chụp 390/1280 và soát theo thứ tự màu chữ → bố cục → nội dung, danh sách chống giao diện AI. Tham khảo taste-skill, awesome-design-md, vercel-labs, addyosmani, playwright-cli. Bộ đề 4/7 → 7/7.

## 0.3.0 (24/11/2026)
- Skill `thiet-ke-loi-giai`: khi nào cần backend, công nghệ mặc định Java + Vue/Nuxt nhưng đề xuất theo yêu cầu, kiến trúc luôn có lợi và hại, thiết kế cân theo cỡ việc. Thêm `evals/chay-bo-de.sh`. Bộ đề 5/5.

## 0.2.0 - 0.2.1 (24/11/2026)
- Skill `lam-ro-yeu-cau`: 4 nhóm câu hỏi, thông số chuyên ngành đề xuất rồi chờ khách chốt, tiêu chí "đủ rõ". Bộ đề 3/5 → 5/5. Không ghi tên người trong plugin.

## 0.1.0 (24/11/2026)
- Bản nền: nguyên tắc chung nạp bằng hook SessionStart, 2 luật cứng, khung bộ đề.
