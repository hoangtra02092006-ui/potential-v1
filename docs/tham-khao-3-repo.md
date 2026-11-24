# Tổng hợp 3 repo tham khảo (24/11/2026)

Đã đọc: addyosmani/agent-skills, wshobson/agents, vercel-labs/agent-skills (cả 3 giấy phép MIT). Chỉ lấy ý tưởng và viết lại bằng tiếng Việt theo cách làm của người quản lý; không chép nguyên văn.

## Lấy gì, cho skill nào

| Lấy từ | Ý chính | Đưa vào skill | Trạng thái |
|---|---|---|---|
| addy: spec-driven-development | Bản đồ module (module, việc, phụ thuộc một chiều) trước khi viết chi tiết; ranh giới cho agent: luôn làm / hỏi trước / không bao giờ; mục "Ngoài phạm vi" | 2 thiết kế lời giải | Đã đưa vào |
| addy: api-and-interface-design | Hợp đồng API trước khi code, một kiểu lỗi chung, kiểm dữ liệu ở biên, thêm chứ không sửa | 2 thiết kế lời giải | Đã đưa vào |
| addy: documentation-and-adrs | Mỗi quyết định khó đảo ngược ghi một ADR ngắn có phương án đã cân nhắc | 2 thiết kế lời giải | Đã đưa vào |
| wshobson: architecture-patterns, c4-architecture | Bảng kiểu kiến trúc (phân lớp, chia module, Clean/Hexagonal, tách dịch vụ) kèm khi nào hợp; sơ đồ tổng quan 2 tầng | 2 thiết kế lời giải | Đã đưa vào |
| addy: frontend-ui-engineering | Component nhỏ, tách lấy dữ liệu khỏi hiển thị, đủ trạng thái tải/rỗng/lỗi, responsive từ đầu, tránh "giao diện kiểu AI" (tím, gradient, bo tròn quá, bóng nhiều) | 3 giao diện | Làm khi tới skill 3 |
| vercel: composition-patterns | Ghép component thay vì thêm nhiều prop true/false; tách biến thể thành component riêng; trạng thái để ở provider | 3 giao diện | Làm khi tới skill 3. Bản gốc viết cho React, sẽ chuyển sang cách làm của Vue (slot, composable, provide/inject) |
| vercel: web-design-guidelines | Danh sách kiểm giao diện (truy cập, focus, form, ảnh, chữ) để soát | 3 giao diện, 6 review | Làm khi tới skill 3 |
| addy: constraint-driven-development | File `CONSTRAINTS.md` ghi chuẩn chất lượng bằng con số và lệnh kiểm (độ phủ 80%, lint, lộ khoá bí mật); không được hạ chuẩn để qua kiểm | 8 khởi tạo dự án, 5 code và test | Làm khi tới skill 5, 8 |
| addy: code-simplification | Đơn giản hoá code: giữ nguyên hành vi, chỉ trong phạm vi đã sửa, bảng dấu hiệu code rối | 6 review | Làm khi tới skill 6 |
| addy: deprecation-and-migration | Đổi database theo kiểu thêm trước, xoá sau và riêng; migration luôn có đường lùi đã chạy thử | 7 phát hành | Làm khi tới skill 7 |

## Không lấy
- Chi tiết microservices, CQRS, saga, event sourcing, GraphQL, gRPC: quá nặng cho dự án web thông thường. Chỉ giữ một dòng trong bảng kiểu kiến trúc.
- Agent chuyên Java (java-pro): kiến thức chung, model đã biết, không thêm giá trị.
- Các skill React riêng (react-best-practices, React 19), deploy lên Vercel: không khớp Vue/Nuxt và hosting của người quản lý.
- before-you-build (soát rủi ro trước khi làm sản phẩm): gần với skill 1 nhưng hướng về khởi nghiệp sản phẩm; skill 1 đã đủ.
