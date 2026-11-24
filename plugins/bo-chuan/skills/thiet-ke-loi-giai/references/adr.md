# Ghi quyết định kiến trúc (ADR)

Mỗi quyết định khó đảo ngược ghi một file ngắn trong `docs/adr/NNN-ten.md`: chọn framework hay database, kiểu kiến trúc, cách đăng nhập, nơi hosting. Người mới vào đọc là biết vì sao dự án như vậy.

```markdown
# ADR-001: <quyết định>
Trạng thái: Đề xuất | Đã duyệt | Bị thay bởi ADR-xxx
Ngày: yyyy-mm-dd

## Bối cảnh
Bài toán và ràng buộc dẫn tới quyết định này.

## Quyết định
Chọn gì.

## Phương án đã cân nhắc
- <phương án>: lợi, hại, vì sao không chọn.

## Hệ quả
Được gì, mất gì, khi nào nên xem lại.
```

- Agent viết ở trạng thái **Đề xuất**. Chỉ người quản lý chuyển sang **Đã duyệt**.
- Quyết định đổi thì viết ADR mới thay ADR cũ, không xoá ADR cũ.

Nguồn tham khảo: addyosmani/agent-skills (documentation-and-adrs), giấy phép MIT.
