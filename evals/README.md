# Bộ đề kiểm tra

Mỗi skill có một file `<ten-skill>.md` ở đây. Thư mục này nằm ngoài plugin để agent đang được kiểm không đọc được đề. Bộ đề là cách duy nhất biết agent đã làm giống người quản lý chưa.

## Một câu trong bộ đề
```
## <số>. <tên ngắn của tình huống>
**Tình huống:** đầu vào agent nhận được, viết như việc thật (được nhiều dòng, kể cả khối code).
**Người quản lý làm:** câu trả lời hoặc quyết định thật của người quản lý.
**Đạt khi:** 2-4 tiêu chí kiểm được (phải có ..., không được ...).
```

## Quy trình thêm một skill
1. Người quản lý kể 5-10 tình huống thật cùng cách mình xử lý. Ghi vào bộ đề.
2. Viết skill từ chính các tình huống đó.
3. Cho agent mới (không thấy bộ đề) làm từng tình huống, chấm theo "Đạt khi".
4. Câu nào trượt thì sửa skill, chạy lại. Không sửa bộ đề cho dễ đạt.
5. Người quản lý đọc kết quả và duyệt. Tăng phiên bản, ghi CHANGELOG, cập nhật bảng `ket-qua.md`.

Kết quả chạy (bài làm, bài chấm) ghi ra thư mục tạm ngoài repo, không commit. Agent làm bài và agent chấm không được dùng bộ nhớ chung của dự án.
