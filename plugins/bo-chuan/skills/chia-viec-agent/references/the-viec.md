# Mẫu thẻ việc

Mỗi agent nhận đúng một thẻ. Thẻ là toàn bộ những gì agent biết, nên phải đủ để làm mà không cần đoán.

```markdown
## Thẻ <mã>: <việc, viết như người dùng thấy> (vd "BE-2: Tạo đơn hàng")

**Đợt:** <1, 2…>   **Phụ thuộc:** <mã thẻ phải xong trước, hoặc "không">   **Ước lượng:** <phút>

**Yêu cầu gốc** (chép nguyên văn từ docs/yeu-cau/... và docs/thiet-ke/...):
> ...

**Tiêu chí xong:**
- [ ] <hành vi kiểm được>
- [ ] Tiểu tiết: <định dạng tiền, ngày, làm tròn, giới hạn độ dài, quyền, câu chữ hiển thị>
- [ ] Trạng thái rỗng / lỗi: <hiện gì>

**Ca test** (vào → mong đợi):
| Ca | Vào | Mong đợi |
|---|---|---|
| Thường | ... | ... |
| Biên | 0 / rỗng / rất lớn | ... |
| Sai | định dạng sai, thiếu quyền | mã lỗi / thông báo ... |

**File được sửa hoặc tạo** (tối đa 5): ...
**File chỉ đọc:** hợp đồng API, schema, DESIGN.md, token ...
**Lệnh:** test `...` · lint `...` · build `...`

**Báo lại khi xong:** "tôi hiểu việc này là…" (viết trước khi code), danh sách tiêu chí và ca test đạt / chưa, lệnh đã chạy và kết quả, file đã sửa, điều còn giả định.
```
