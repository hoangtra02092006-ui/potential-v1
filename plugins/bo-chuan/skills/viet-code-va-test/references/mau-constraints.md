# Mẫu CONSTRAINTS.md

Luật riêng của dự án, mọi agent đọc trước khi code. Mỗi luật một dòng, kiểm được, kèm lý do ngắn. Người quản lý duyệt khi thêm luật.

```markdown
# CONSTRAINTS

## Số và tiền
- Tiền dùng BigDecimal (backend) / NUMERIC(19,4) (database) / decimal.js (frontend). Không dùng double hay Number cho tiền. Lý do: dự án doanh nghiệp, có ngoại tệ.
- Làm tròn nửa lên đến đồng, chỉ ở bước chốt hoá đơn. Chia nhiều kỳ thì kỳ cuối nhận phần dư.

## Nghiệp vụ
- Số mét in báo khách tính theo kích thước thật của từng ảnh, không theo cách ghép trên khổ giấy.
- Đơn đã giao không được sửa, chỉ tạo phiếu điều chỉnh.

## Code
- Logic nghiệp vụ nằm trong `src/domain/`, không import framework giao diện hay database.
- Mọi API trả lỗi theo dạng { code, message } trong hợp đồng API.

## Môi trường
- Người quản lý dùng Windows: đường dẫn dùng path.join, không viết cứng "/" ; script chạy được cả PowerShell.
- Ngày giờ lưu UTC, hiển thị theo Asia/Ho_Chi_Minh.
```
