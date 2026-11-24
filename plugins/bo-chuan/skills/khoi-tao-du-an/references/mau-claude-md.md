# Mẫu CLAUDE.md

Ngắn, chỉ điều agent cần để làm đúng. Lệnh nào cũng phải đã chạy thử, ghi ngày.

```markdown
# <Tên dự án>

> Dùng plugin bo-chuan. File này chỉ ghi phần riêng của dự án.

## Tổng quan
- <Web làm gì, cho ai, 1-2 dòng>. Trạng thái: <đang phát triển / có người dùng thật>.
- Yêu cầu: docs/yeu-cau/<file>. Thiết kế: docs/thiet-ke/<file>.

## Công nghệ
- Backend: ... Frontend: ... Database: ... Hosting: ...

## Lệnh (đã chạy thử <ngày>, Windows PowerShell)
| Việc | Lệnh |
|---|---|
| Cài đặt | ... |
| Chạy local | ... |
| Test | ... |
| Độ phủ | ... (ngưỡng > 80% cho <thư mục>) |
| Lint / format | ... |
| Build | ... |

## Bản đồ thư mục
| Thư mục | Để làm gì |
|---|---|
| backend/src/main/java/<goi>/<chuc-nang>/ | code một chức năng |
| ... | ... |

## Luật riêng
- Xem CONSTRAINTS.md. Giao diện: DESIGN.md.

## Nhánh, môi trường, phát hành
- Nhánh `feat/<ten>`, `fix/<ten>`; PR vào `main`, CI phải xanh.
- Môi trường: local, production. Biến môi trường: .env.example.
- Phát hành: người quản lý bấm deploy (skill phat-hanh).
```
