# Mẫu báo cáo review

```markdown
# Review: <thẻ / PR>

**Kết luận:** Đạt | Chưa đạt (Chặn: n · Nên sửa: n · Góp ý: n)
**Đã kiểm theo thứ tự:**
1. Nghiệp vụ và tiểu tiết: yêu cầu gốc <đường dẫn>, luồng đã chạy <…>, đầu ra đã mở trong điều kiện <…> → <kết quả, mã lỗi liên quan>
2. Logic và ca biên → <…>
3. Bảo mật → <…>
4. Code → <…>
5. Test: lệnh <test, lint, build> và kết quả → <…>

Mỗi lỗi bên dưới ghi thuộc bước nào (vd "[1. Nghiệp vụ]").

## Chặn
1. [<bước soát>] `<file:dòng>` hoặc <bước tái hiện>
   - Sai: <so với yêu cầu gốc, trích câu>
   - Bằng chứng: <ảnh, lệnh và kết quả>
   - Gợi ý sửa: <hướng, không viết code thay>

## Nên sửa
...

## Góp ý
...

## Chưa kiểm được
- <điều kiện không giả lập được> → người quản lý kiểm tay: <cách>
```

Thay đổi nhỏ và đạt thì chỉ cần: kết luận, mục "Đã kiểm theo thứ tự" mỗi bước một dòng, và góp ý nếu có.
