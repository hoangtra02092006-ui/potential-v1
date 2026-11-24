# Tổng hợp 3 repo tham khảo (24/11/2026)

Đã đọc: addyosmani/agent-skills, wshobson/agents, vercel-labs/agent-skills (cả 3 giấy phép MIT). Chỉ lấy ý tưởng và viết lại bằng tiếng Việt theo cách làm của người quản lý; không chép nguyên văn.

## Lấy gì, cho skill nào

| Lấy từ | Ý chính | Đưa vào skill | Trạng thái |
|---|---|---|---|
| addy: spec-driven-development | Bản đồ module (module, việc, phụ thuộc một chiều) trước khi viết chi tiết; ranh giới cho agent: luôn làm / hỏi trước / không bao giờ; mục "Ngoài phạm vi" | 2 thiết kế lời giải | Đã đưa vào |
| addy: api-and-interface-design | Hợp đồng API trước khi code, một kiểu lỗi chung, kiểm dữ liệu ở biên, thêm chứ không sửa | 2 thiết kế lời giải | Đã đưa vào |
| addy: documentation-and-adrs | Mỗi quyết định khó đảo ngược ghi một ADR ngắn có phương án đã cân nhắc | 2 thiết kế lời giải | Đã đưa vào |
| wshobson: architecture-patterns, c4-architecture | Bảng kiểu kiến trúc (phân lớp, chia module, Clean/Hexagonal, tách dịch vụ) kèm khi nào hợp; sơ đồ tổng quan 2 tầng | 2 thiết kế lời giải | Đã đưa vào |
| addy: frontend-ui-engineering | Component nhỏ, tách lấy dữ liệu khỏi hiển thị, đủ trạng thái tải/rỗng/lỗi, responsive từ đầu, tránh "giao diện kiểu AI" (tím, gradient, bo tròn quá, bóng nhiều) | 3 giao diện | Đã đưa vào (v0.4.0) |
| vercel: composition-patterns | Ghép component thay vì thêm nhiều prop true/false; tách biến thể thành component riêng; trạng thái để ở provider | 3 giao diện | Đã đưa vào (v0.4.0), viết theo cách của Vue |
| vercel: web-design-guidelines | Danh sách kiểm giao diện (truy cập, focus, form, ảnh, chữ) để soát | 3 giao diện, 6 review | Phần giao diện đã đưa vào (v0.4.0) |
| addy: constraint-driven-development | File `CONSTRAINTS.md` ghi chuẩn chất lượng bằng con số và lệnh kiểm (độ phủ 80%, lint, lộ khoá bí mật); không được hạ chuẩn để qua kiểm | 8 khởi tạo dự án, 5 code và test | Làm khi tới skill 5, 8 |
| addy: code-simplification | Đơn giản hoá code: giữ nguyên hành vi, chỉ trong phạm vi đã sửa, bảng dấu hiệu code rối | 6 review | Làm khi tới skill 6 |
| addy: deprecation-and-migration | Đổi database theo kiểu thêm trước, xoá sau và riêng; migration luôn có đường lùi đã chạy thử | 7 phát hành | Làm khi tới skill 7 |

## Không lấy
- Chi tiết microservices, CQRS, saga, event sourcing, GraphQL, gRPC: quá nặng cho dự án web thông thường. Chỉ giữ một dòng trong bảng kiểu kiến trúc.
- Agent chuyên Java (java-pro): kiến thức chung, model đã biết, không thêm giá trị.
- Các skill React riêng (react-best-practices, React 19), deploy lên Vercel: không khớp Vue/Nuxt và hosting của người quản lý.
- before-you-build (soát rủi ro trước khi làm sản phẩm): gần với skill 1 nhưng hướng về khởi nghiệp sản phẩm; skill 1 đã đủ.

## Bổ sung cho skill 3 (24/11): nguồn người quản lý gửi thêm
| Lấy từ | Ý chính | Đã đưa vào |
|---|---|---|
| leonxlnx/taste-skill (MIT) | Loại web quyết định phong cách; ảnh thật dẫn dắt; 3D và hiệu ứng chỉ hợp sản phẩm công nghệ; chuyển động có mục đích (xuất hiện đầu trang, 1-2 khoảnh khắc, hover); danh sách câu chữ "trông AI" | giao-dien |
| voltagent/awesome-design-md (MIT) | Mỗi dự án có DESIGN.md ghi token và Nên / Không nên; kho phân tích phong cách của trang thật để tham chiếu | giao-dien |
| microsoft/playwright-cli (Apache 2.0) | Agent tự mở trang, chụp ảnh, tự xem và sửa | giao-dien |

Không lấy từ taste-skill: bộ công cụ và script riêng (deal, gate, kho ảnh), quy tắc rất chi tiết cho landing page; quá nặng và gắn với cách làm riêng của tác giả.
