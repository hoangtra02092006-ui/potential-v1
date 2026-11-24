# Nguyên tắc chung (plugin bo-chuan)

Áp dụng cho mọi việc lập trình web, mọi dự án. Chỉ ghi điều người quản lý đã xác nhận. Chi tiết từng bước nằm trong các skill; công nghệ và lệnh cụ thể nằm trong CLAUDE.md của dự án. CLAUDE.md thiếu lệnh cần dùng thì hỏi, không đoán.

## Làm rõ trước khi làm
- Không bắt tay làm khi yêu cầu chưa rõ và chưa được người quản lý duyệt. Bài học gốc: sửa đi sửa lại vì chưa hiểu đúng nghiệp vụ.
- Làm rõ chức năng trên môi trường thực tế (thiết bị, file, người dùng thật), vì khách thường thiếu ý.
- Agent không nói chuyện với khách. Agent soạn câu hỏi, người quản lý mang đi hỏi.
- Hỏi tối đa 3 câu một lần, mỗi câu kèm phương án đề xuất để người quản lý chỉ cần gật hoặc sửa. Không tự bịa yêu cầu để lấp chỗ trống.

## Con người giữ quyền quyết
- Người quản lý duyệt ở các điểm dừng do skill quy định. Agent không tự duyệt thay.
- Không ghi "xong" khi tiêu chí xong chưa đạt đủ.

## Sửa tận gốc
- Tìm nguồn gốc lỗi, không sửa theo triệu chứng. Quét chỗ khác có cùng lỗi và ghi kết quả quét.
- Từ 2 chỗ cùng lỗi trở lên thì sửa ở phần dùng chung, coi là việc lớn.
- Vá tạm chỉ khi người quản lý đồng ý, ghi rõ "VÁ TẠM" kèm việc sửa tận gốc.

## Chọn phương án
- Thứ tự ưu tiên: thực dụng, tối giản, dễ dùng, dễ mở rộng và bảo trì, dễ nhìn.
- Chỉ đưa 2 phương án khi có đánh đổi thật (vd tốc độ với bộ nhớ). Còn lại đề xuất 1.

## Test và kiểm
- Unit test bắt buộc cho logic nghiệp vụ và API/controller, độ phủ trên 80%.
- Kiểm tay chỉ sau khi unit test xanh, và không thay unit test.
- Ai làm thì không tự chấm. Review cuối do bên độc lập. Lỗi chặn và nên sửa phải sửa trong chính PR đó.

## Ngôn ngữ và tài liệu
- Trao đổi với người quản lý và tài liệu: tiếng Việt.
- Code, tên biến, comment, commit, tên nhánh: tiếng Anh. Commit theo Conventional Commits. Nhánh `feat/<tên>`, `fix/<tên>`.
- Tài liệu để trong `docs/` của dự án, gọn nhưng đủ: chỉ ghi điều người đọc cần để quyết định hoặc làm tiếp.
- Người quản lý dùng Windows.

## Luật cứng (hook tự chặn)
- Không push thẳng lên `main`/`master`.
- Không xoá hàng loạt (rm -rf thư mục gốc/nhà, git clean -fd, xoá hoặc reset database, format ổ đĩa).
