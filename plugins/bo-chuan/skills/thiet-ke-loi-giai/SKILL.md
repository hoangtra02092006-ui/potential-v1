---
name: thiet-ke-loi-giai
description: Thiết kế lời giải cho một yêu cầu web đã được duyệt: cấu trúc dự án (chỉ frontend hay có backend), công nghệ đề xuất, tổng quan giao diện, dữ liệu, ưu và nhược của kiến trúc, hạn chế của thiết kế, kế hoạch test, rồi dừng chờ người quản lý duyệt. Dùng ngay sau lam-ro-yeu-cau khi bản tóm tắt yêu cầu đã duyệt, hoặc khi được nhờ "thiết kế", "lên phương án", "chọn công nghệ", "nên làm backend không". Không dùng khi yêu cầu chưa rõ.
---

# Thiết kế lời giải

## 1. Điều kiện bắt đầu
- Có bản tóm tắt yêu cầu đã được người quản lý duyệt (đầu ra của `lam-ro-yeu-cau`). Chưa có thì quay lại skill đó, không thiết kế trên yêu cầu còn phải đoán.
- Đọc CLAUDE.md và `docs/kien-truc.md` của dự án nếu có. Việc nằm gọn trong kiến trúc đang có thì chỉ thiết kế phần thay đổi, không đề xuất lại kiến trúc.

## 2. Chỉ frontend hay có backend
**Có backend** khi có ít nhất một điều sau:
- Cần lưu dữ liệu vào database, nhiều người cùng dùng chung dữ liệu.
- Có logic tính toán hoặc nghiệp vụ thật (trạng thái, quy trình, báo cáo).
- Cần bảo mật: dữ liệu riêng tư, phân quyền, khoá bí mật không được lộ ra trình duyệt.
- Có tiềm năng mở rộng: phần mềm sẽ lớn dần, thêm ứng dụng khác dùng chung dữ liệu.

**Chỉ frontend** khi yêu cầu thật đơn giản: demo dự án nhỏ, hoặc trang chỉ để xem (nội dung tĩnh), không lưu dữ liệu, không có logic phải gọi backend.

Ghi rõ lựa chọn và điều nào ở trên dẫn tới lựa chọn đó.

## 3. Công nghệ: đề xuất theo yêu cầu
- Người quản lý hay dùng **Java (backend) và Vue/Nuxt (frontend)**. Dùng làm mặc định khi hợp, nhưng không bắt buộc.
- Đề xuất công nghệ theo nghiệp vụ, khả năng bảo trì và mở rộng của từng dự án. Nếu đề xuất khác mặc định, nói rõ vì sao hợp hơn với yêu cầu này.
- Mỗi lựa chọn có lý do gắn với yêu cầu hoặc ràng buộc (ngân sách, hạn giao, ai bảo trì), không ghi "vì phổ biến".

## 4. Kiến trúc: luôn nêu lợi và hại
Bài học thật: web theo dõi tiêu dùng của khách làm theo kiểu monolith cho nhanh và dễ hiểu. Càng thêm chức năng, thời gian build càng lâu, người mới vào càng khó hiểu. Lẽ ra lúc đầu phải đưa ra lợi và hại để cân nhắc.

Vì vậy:
- Với kiến trúc được chọn (monolith, monolith chia module, tách dịch vụ…), luôn có bảng **lợi và hại**, cả trước mắt lẫn khi dự án lớn lên: tốc độ làm ban đầu, thời gian build, độ dễ hiểu cho người mới, deploy, chi phí.
- Ước lượng dự án sẽ lớn đến đâu (số chức năng, số người làm) từ yêu cầu. Nếu dự kiến lớn dần, chia code theo **module nghiệp vụ** ngay từ đầu (vd `orders`, `customers`, `reports`), ranh giới rõ, để sau tách ra được mà không viết lại.
- Ghi điều kiện để chuyển sang kiến trúc kế tiếp (vd build quá X phút, quá N người cùng làm).

## 5. Chọn phương án
Chấm theo thứ tự ưu tiên: thực dụng (đúng yêu cầu khách) → tối giản → dễ dùng → dễ mở rộng và bảo trì → dễ nhìn.

Chỉ đưa 2 phương án khi có đánh đổi thật giữa hai phương diện (vd tốc độ với bộ nhớ). Khi đó so bằng bảng, có con số ước lượng, đề xuất một. Không có đánh đổi thì trình một phương án. Riêng kiến trúc thì luôn có bảng lợi và hại ở mục 4.

## 6. Đầu ra
Lưu `docs/thiet-ke/<yyyymmdd>-<ten>.md`, gọn, gồm:
1. **Cấu trúc dự án tổng quan:** chỉ frontend hay có backend (kèm lý do ở mục 2), các phần chính và cách chúng nối với nhau, cây thư mục chính.
2. **Công nghệ đề xuất** kèm lý do.
3. **Kiến trúc: lợi và hại** (mục 4).
4. **Tổng quan giao diện:** danh sách màn hình, bố cục chính và thông tin trên từng màn, luồng đi giữa các màn. Đủ để người quản lý thấy giao diện có hài hoà và có đáp ứng nghiệp vụ không. Chi tiết màu, chữ, component để skill giao diện làm sau.
5. **Dữ liệu chính:** các bảng hoặc đối tượng và quan hệ.
6. **Hạn chế của thiết kế này** và hướng đi khác có thể cân nhắc. Không giấu điểm yếu.
7. **Kế hoạch test:** mỗi tiêu chí trong yêu cầu ứng với test nào.

Dừng, chờ người quản lý duyệt. Không viết code trước khi duyệt.
