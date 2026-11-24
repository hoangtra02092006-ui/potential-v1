# Mẫu gói phát hành

File: `docs/phat-hanh/<phiên bản>.md`

```markdown
# Phát hành <phiên bản> (<ngày>)

Trạng thái: SẴN SÀNG | CHƯA SẴN SÀNG (lý do)

## 1. Kiểm trước khi phát hành
| Mục | Kết quả | Bằng chứng |
|---|---|---|
| Test và build trên nhánh phát hành | đạt / chưa | lệnh, số test, độ phủ |
| Review độc lập không còn lỗi Chặn | đạt / chưa | link PR, báo cáo review |
| Phiên bản và CHANGELOG | đạt / chưa | <cũ> → <mới>, lý do tăng X/Y/Z |
| Cách lùi và sao lưu | đạt / chưa | mục 4 dưới đây |
| Cấu hình production, khoá bí mật | đạt / chưa / không liên quan | |

## 2. Ghi chú phát hành (cho người dùng)
- Mới: ...
- Sửa: ...
- Lưu ý: ... (vd cần đăng nhập lại)

## 3. Các bước deploy (người quản lý làm)
1. Sao lưu database: <lệnh / nút>. Xong khi: có file sao lưu <tên>.
2. Chạy migration <tên>: <lệnh>. Xong khi: <cách kiểm, vd số dòng bảng mới = bảng cũ>.
3. Deploy bản build <commit / tên>: <nút / lệnh>. Xong khi: trang hiện phiên bản <mới>.
4. Kiểm trên bản thật theo mục 5.

## 4. Các bước lùi bản
- Lùi code: deploy lại bản build <phiên bản trước>. Bản đó chạy được trên database sau migration vì <lý do>.
- Lùi dữ liệu (chỉ khi dữ liệu hỏng): khôi phục <file sao lưu>; mất dữ liệu phát sinh sau <giờ sao lưu>.

## 5. Kiểm trên bản thật
| Kiểm | Cách làm | Đúng khi |
|---|---|---|
| ... | mở trang ..., bấm ... | thấy ... |

## 6. Việc để lần sau
- Bước thu gọn của migration <tên> (xoá <cột cũ>) ở bản <phiên bản sau>, khi ...
```
