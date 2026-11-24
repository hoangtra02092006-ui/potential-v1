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

## 4. Kiến trúc: không thiên về kiểu nào, luôn nêu lợi và hại
Kiến trúc nào cũng được, miễn là đáp ứng bài toán, dễ làm, dễ mở rộng và dễ bảo trì. Không mặc định chọn hay tránh một kiểu (monolith, chia module, tách dịch vụ, serverless…). Chọn theo bài toán cụ thể.

Vì sao phải nêu lợi và hại: người quản lý từng làm một web theo kiểu monolith cho nhanh và dễ hiểu, càng thêm chức năng thì build càng lâu và người mới càng khó hiểu. Vấn đề không nằm ở monolith, mà ở chỗ lúc đầu không cân nhắc lợi và hại. Chuyện này chỉ để agent hiểu vì sao phải làm vậy: không nhắc lại nó trong bản thiết kế, và lợi hại phải nói bằng chính dự án đang làm.

Vì vậy:
- Với kiến trúc được đề xuất, luôn có bảng **lợi và hại**, cả trước mắt lẫn khi dự án lớn lên: tốc độ làm, thời gian build, độ dễ hiểu cho người mới, deploy, chi phí.
- Ước lượng dự án sẽ lớn đến đâu (số chức năng, số người làm) từ yêu cầu, và chọn kiến trúc hợp với mức đó.
- Ghi điều kiện để đổi sang kiến trúc khác khi bài toán thay đổi.

## 5. Chọn phương án
**Agent chỉ đề xuất, người quản lý quyết.** Vấn đề nhạy cảm (công nghệ, kiến trúc, bảo mật, chi phí, dữ liệu khách) luôn để người quản lý chọn. Trình đề xuất kèm lý do, không viết như thể đã chốt.

Chấm theo thứ tự ưu tiên: thực dụng (đúng yêu cầu khách) → tối giản → dễ dùng → dễ mở rộng và bảo trì → dễ nhìn.

Chỉ đưa 2 phương án khi có đánh đổi thật giữa hai phương diện (vd tốc độ với bộ nhớ). Khi đó so bằng bảng, có con số ước lượng, đề xuất một. Không có đánh đổi thì trình một phương án. Riêng kiến trúc thì luôn có bảng lợi và hại ở mục 4.

## 6. Cân theo cỡ việc
Thiết kế dài ngắn theo độ khó của bài toán:
- **Web đơn giản, chỉ frontend** (vd trang demo, trang giới thiệu): người quản lý mong làm xong trong vài giờ (khoảng 3 giờ). Bản thiết kế ngắn, chỉ ghi điều cần để duyệt. Chia việc gọn: ít agent, không tách việc nhỏ thành nhiều phần.
- **Có backend, nghiệp vụ, bảo mật:** thiết kế đầy đủ các mục ở dưới.

Luôn ghi **ước lượng thời gian làm** và **cách chia việc cho agent** ở mức tổng quan (bao nhiêu agent, mỗi agent làm phần nào, phần nào chạy song song). Chia hợp lý với cỡ việc.

## 7. Đầu ra
Lưu `docs/thiet-ke/<yyyymmdd>-<ten>.md`, gọn, gồm:
1. **Cấu trúc dự án tổng quan:** chỉ frontend hay có backend (kèm lý do ở mục 2), các phần chính và cách chúng nối với nhau, cây thư mục chính.
2. **Công nghệ đề xuất** kèm lý do (đề xuất, chờ người quản lý chọn).
3. **Kiến trúc: lợi và hại** (mục 4).
4. **Tổng quan giao diện:** danh sách màn hình, bố cục chính và thông tin trên từng màn, luồng đi giữa các màn. Đủ để người quản lý thấy giao diện có hài hoà và có đáp ứng nghiệp vụ không. Chi tiết màu, chữ, component để skill giao diện làm sau.
5. **Dữ liệu chính:** các bảng hoặc đối tượng và quan hệ.
6. **Hạn chế của thiết kế này** và hướng đi khác có thể cân nhắc. Không giấu điểm yếu.
7. **Kế hoạch test:** mỗi tiêu chí trong yêu cầu ứng với test nào.
8. **Ước lượng thời gian và cách chia việc cho agent** (mục 6).

Với web đơn giản, gộp các mục cho ngắn; mục không áp dụng ghi một dòng "Không có".

Dừng, chờ người quản lý duyệt. Không viết code trước khi duyệt.
