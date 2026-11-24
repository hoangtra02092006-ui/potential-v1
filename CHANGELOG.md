# Changelog

## 0.7.0 (24/11/2026)
- Thêm skill `review-doc-lap`, viết từ câu trả lời thật của người quản lý: reviewer không tham gia làm, là BA khi kiểm nghiệp vụ và senior khi soát code; chỉ ghi lỗi để agent làm sửa, không tự sửa (như người quản lý là chốt chặn, tránh thiên kiến và lẫn vai). Thứ tự soát: nghiệp vụ và chạy thử → logic, ca biên → bảo mật → code, rút gọn → test. Ba mức Chặn / Nên sửa / Góp ý; không thổi phồng, chỉ ghi lỗi có bằng chứng, báo cáo dài theo cỡ thay đổi.
- Bài học chữ trắng trên giấy trắng: kiểm đầu ra trong đúng điều kiện nơi dùng thật (`references/kiem-dau-ra-that.md`: file in, file cắt, Excel, màn hình, email, API, số liệu).
- Thêm vai trò agent đầu tiên `agents/reviewer.md` (chỉ có công cụ đọc và chạy lệnh).
- `evals/chay-bo-de.sh`: tình huống được viết nhiều dòng (trước đây chỉ lấy dòng đầu, làm mất khối code).
- Bộ đề 5 câu, câu 1 dùng file SVG decal có chữ trắng. Lượt 1 đạt 2/5 (3 câu trượt do lỗi cắt đề ở trên), sau 3 lần sửa skill đạt 5/5. Câu 3 sửa tiêu chí cho khớp nguyên tắc "lỗi nên sửa phải sửa trong PR".

## 0.6.0 (24/11/2026)
- Thêm skill `viet-code-va-test`, viết từ câu trả lời thật của người quản lý: trước khi code ghi rõ ý nghĩa nghiệp vụ của từng con số đầu ra (bài học thống kê mét in báo 0 m cho ảnh lồng trong ảnh khác); logic nghiệp vụ có thể test trước, thường code trước rồi test ngay, giao diện code trước; kết quả mong đợi lấy từ yêu cầu, không chép output; code sạch theo cấu trúc thiết kế và cách chia component; quy ước chuẩn chung, tiếng Anh, comment ngắn.
- Tiền: dự án doanh nghiệp, ngoại tệ dùng số thập phân chính xác (BigDecimal, NUMERIC, decimal.js), không dùng float/double; web đơn giản VND dùng số nguyên đồng; làm tròn có quy tắc, kỳ cuối nhận phần dư.
- Khi nào hỏi, khi nào làm luôn: chỉ hỏi chỗ mơ hồ đang chặn thẻ, tối đa 3 câu gửi điều phối; chi tiết có mặc định thì ghi giả định và làm luôn.
- References: mẫu CONSTRAINTS.md, bảng bẫy hay gặp (tối ưu nội bộ làm sai số báo khách, làm tròn, số thực, rỗng, múi giờ, đơn vị đo, Windows, tiếng Việt, giới hạn, quyền).
- `lam-ro-yeu-cau`: ghi rõ không dùng cho chỗ chưa rõ phát sinh khi đang làm thẻ việc đã duyệt. Chạy lại bộ đề lam-ro-yeu-cau: 5/5.
- Bộ đề 5 câu, câu 1-2 agent code và chạy test thật. Lượt 1 đạt 2/5, sau 3 lần sửa đạt 5/5. Code mẫu câu 1 ở `evals/ket-qua/viet-code-mau/`.

## 0.5.0 (24/11/2026)
- Thêm skill `chia-viec-agent`, viết từ câu trả lời thật của người quản lý: khung dùng chung trước (gồm hợp đồng API, schema, file dùng chung), rồi chia backend và frontend chạy song song, rồi chia tiếp phần độc lập; tối đa 5 agent cùng lúc, mỗi agent không quá 5 file, hai agent không sửa cùng file; người quản lý duyệt bảng chia việc một lần và xem ở mốc chạy được.
- Nhắm vào nỗi đau thật: một agent code lâu, hiểu sai yêu cầu, sót tiểu tiết. Thẻ việc chép nguyên văn yêu cầu gốc, có tiêu chí xong gồm tiểu tiết và ca test biên; agent ghi "tôi hiểu việc này là…" trước khi code; agent khác review đối chiếu yêu cầu gốc.
- References: mẫu thẻ việc, mẫu bảng chia việc, cách chạy song song trong Claude Code (Agent chạy nền, worktree riêng, gom theo thứ tự phụ thuộc). Tham khảo wshobson/agents (agent-teams) và addyosmani/agent-skills (planning-and-task-breakdown), MIT.
- Bộ đề 5 câu: lượt 1 đạt 2/5, lượt 2 thêm 2 câu, lượt 3 đạt câu cuối. Tổng 5/5. Bảng chia việc mẫu ở `evals/ket-qua/chia-viec-mau/`.

## 0.4.0 (24/11/2026)
- Thêm skill `giao-dien`, viết từ câu trả lời thật của người quản lý: phong cách theo mục đích web (quản lý: tối giản mà chỉn chu; marketing: chuyên nghiệp, thu hút, có thể đề xuất 3D và chuyển động), DESIGN.md cho mỗi dự án, thư viện chọn theo dự án, tự chụp màn hình 390px và 1280px rồi soát theo thứ tự màu và chữ → bố cục → nội dung, danh sách chống giao diện "trông AI".
- Tham khảo: leonxlnx/taste-skill, voltagent/awesome-design-md, vercel-labs/agent-skills, addyosmani/agent-skills, microsoft/playwright-cli.
- `evals/chay-bo-de.sh`: agent làm bài được chạy lệnh (để dựng và chụp màn hình); người chấm tự mở file và ảnh.
- Bộ đề 5 câu, lượt 1 đạt 5/5; câu 5 dựng thật trang demo, xem ở `evals/ket-qua/giao-dien-demo/`.
- Bổ sung sau video người quản lý gửi (5 công cụ thiết kế cho Claude Code): bước "hình mẫu trước, code sau" (lấy 1-3 hình mẫu, đọc như người thiết kế, dựng lại bằng thương hiệu của mình, ghép cạnh nhau để so), `references/trang-marketing.md` (nền một màu lấy từ sản phẩm, sản phẩm to nghiêng lơ lửng, chữ khổng lồ xếp lớp, thiếu ảnh thì báo ngay), `references/danh-sach-kiem-giao-dien.md` (danh sách kiểm Vercel dịch và rút gọn), giữ dấu tiếng Việt ở chữ cỡ lớn.
- Bộ đề thêm câu 6 (dựng theo hình mẫu) và câu 7 (marketing chưa có hình mẫu và ảnh). Lượt 1 đạt 4/7; câu 6 trượt vì chữ nền mất dấu nặng, câu 1 thiếu thang khoảng cách. Sửa skill, chạy lại 3 câu trượt: đạt cả 3. Tổng 7/7.

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
