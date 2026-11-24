---
name: phat-hanh
description: Chuẩn bị phát hành một phiên bản lên production và xử lý sau phát hành. Dùng khi người quản lý nói "phát hành", "deploy", "release", "lên production", "lên bản mới", khi một nhóm thẻ việc đã review xong và sắp merge để phát hành, khi có thay đổi cấu trúc dữ liệu cần lên production, hoặc khi production vừa lỗi và cần quyết lùi bản. Agent chuẩn bị gói phát hành; người quản lý tự bấm deploy.
---

# Phát hành

Người quản lý tự bấm deploy production. Agent **không tự deploy production, không tự chạy migration trên database production, không tự lùi bản**, kể cả khi được đưa token hay được nhờ "làm luôn cho nhanh". Việc của agent là chuẩn bị đủ để người quản lý bấm một lần là xong, và biết ngay phải làm gì nếu hỏng.

## 1. Kiểm trước khi phát hành
Đi lần lượt, ghi kết quả từng mục (đạt, chưa đạt, kèm bằng chứng: lệnh và kết quả, link PR):

1. **Test và build đạt** trên đúng nhánh sẽ phát hành, chạy lại sau lần merge cuối. Độ phủ đạt ngưỡng của dự án.
2. **Review độc lập không còn lỗi Chặn** ở mọi PR trong bản này (skill review-doc-lap). Lỗi Nên sửa đã sửa trong chính PR đó.
3. **Đã tăng phiên bản và ghi CHANGELOG** (xem mục 3).
4. **Có cách lùi về bản trước** và đã ghi thành các bước (xem mục 5). Có thay đổi dữ liệu thì có bản sao lưu trước khi chạy.

Mục agent tự làm được (tăng phiên bản, viết CHANGELOG, viết các bước lùi) thì làm luôn rồi đánh đạt, không chặn bản vì nó. Kết quả người quản lý đã báo (vd "test xanh, review Đạt") thì ghi nhận là nguồn; tự chạy lại được nhanh thì chạy, không được thì ghi "theo người quản lý báo", không coi là chưa đạt.

Thêm khi liên quan: biến môi trường và cấu hình production đã có đủ (không có khoá bí mật trong code); thay đổi cấu trúc dữ liệu theo mục 2.

**Một mục chưa đạt thì bản chưa sẵn sàng.** Nói rõ mục nào, còn thiếu gì, ai cần làm gì, ước lượng bao lâu. Người quản lý giục "deploy luôn" thì vẫn báo trung thực là chưa đạt và hậu quả cụ thể; quyết vẫn là của người quản lý, nhưng agent không ghi "sẵn sàng" khi chưa đạt. Có thể đề xuất phát hành phần đã đạt (bỏ PR còn lỗi ra khỏi bản) nếu tách được.

## 2. Thay đổi cấu trúc dữ liệu: đổi theo 2 bước
Khi production đã có dữ liệu thật, mọi thay đổi làm code cũ chạy hỏng (đổi tên, xoá cột hay bảng, đổi kiểu, thêm cột bắt buộc không có giá trị mặc định) đều chia 2 lần phát hành:

1. **Mở rộng (bản này):** thêm cái mới, giữ cái cũ. Chép dữ liệu cũ sang mới. Code mới đọc và ghi theo cách để bản trước vẫn chạy được trên database này (vd ghi cả hai cột). Lùi bản lúc này không mất dữ liệu.
2. **Thu gọn (bản sau):** khi bản mới đã chạy ổn và không còn code nào dùng cái cũ, mới xoá cái cũ, trong một lần phát hành riêng.

Mỗi migration có: bản sao lưu trước khi chạy, lệnh chạy, cách kiểm sau khi chạy (đếm dòng, so mẫu), cách lùi. Thêm cột cho phép rỗng hay thêm bảng mới không làm hỏng code cũ thì làm một bước.

**Cân theo cỡ:** dự án chưa có người dùng thật và dữ liệu production chỉ là dữ liệu thử thì đổi trực tiếp một bước được, ghi rõ lý do. Không dựng quy trình 2 bước cho dữ liệu vứt đi được.

## 3. Phiên bản và CHANGELOG
- Quy ước của người quản lý: **X.Y.Z**, X = giai đoạn phát triển (bản chính thức đầu tiên là 1.0.0), Y = thêm nhóm chức năng, Z = sửa lỗi nhỏ. Dự án có quy ước khác trong CLAUDE.md thì theo dự án.
- CHANGELOG ghi theo người dùng thấy gì, không chép danh sách commit. Có mục riêng cho thay đổi dữ liệu và việc người quản lý cần làm tay.

## 4. Gói phát hành
Một file `docs/phat-hanh/<phiên bản>.md` theo mẫu `references/goi-phat-hanh.md`, gồm:
- Kết quả kiểm mục 1.
- **Ghi chú phát hành** bằng tiếng Việt, cho người dùng và khách đọc được.
- **Các bước deploy** người quản lý làm, theo thứ tự, mỗi bước có cách biết đã xong (vd "sao lưu database → chạy migration → kiểm số dòng → bấm deploy bản build X").
- **Các bước lùi bản**, viết sẵn trước khi deploy, không đợi hỏng mới nghĩ.
- **Danh sách kiểm trên bản thật** sau deploy (mục 6).

**Cân gói theo cỡ dự án.** Dự án nhỏ hoặc chưa có người dùng thật: gói khoảng một trang, kiểm trên bản thật 3-5 mục, không đòi đo thêm số liệu, không câu SQL đối chiếu từng dòng, không bảng kiểm DevTools. Gói đầy đủ dành cho production có người dùng và dữ liệu thật.

Báo người quản lý ngắn: bản nào, gồm gì, sẵn sàng hay chưa, link gói.

## 5. Lùi bản
- Cách lùi mặc định: deploy lại bản build trước. Có migration thì kiểm bản build trước còn chạy được trên database hiện tại không; nhờ mục 2 thì thường chạy được. Chỉ khôi phục bản sao lưu database khi dữ liệu đã hỏng, vì sẽ mất dữ liệu phát sinh sau lúc sao lưu.
- **Khi production lỗi:** lỗi mức Chặn với người dùng (sai số tiền, không đăng nhập được, mất hoặc hỏng dữ liệu, chức năng chính không dùng được) thì **đề xuất lùi trước, sửa sau**, vì sửa nóng trên production dễ làm hỏng thêm. Đưa người quản lý: lỗi gì, ảnh hưởng ai, đề xuất lùi hay sửa nhanh kèm lý do, các bước lùi. Người quản lý quyết và bấm.
- Sau khi lùi: tìm gốc lỗi, sửa ở nhánh `fix/<tên>`, vẫn qua test và review, phát hành lại với Z tăng. Ghi vào CHANGELOG và thêm ca vào bộ test để lỗi không lặp.

## 6. Kiểm trên bản thật sau deploy
Agent đưa người quản lý danh sách ngắn để mở ra kiểm trên production, hoặc tự kiểm phần làm được mà không cần quyền ghi:
- Trang chính mở được, đăng nhập được, không có lỗi trong console.
- **Từng chức năng có trong bản này**, chạy đúng luồng thật với dữ liệu thật, kiểm đúng con số nghiệp vụ (bài học review-doc-lap: kiểm đầu ra trong điều kiện thật, không chỉ thấy trang hiện lên).
- Một hai chức năng cũ quan trọng không bị ảnh hưởng.
- Có migration: dữ liệu cũ hiển thị đúng ở chỗ mới.

Mỗi mục có cách kiểm cụ thể (mở trang nào, bấm gì, thấy gì là đúng). Mục nào hỏng thì theo mục 5.
