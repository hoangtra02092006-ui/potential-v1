# Mẫu bảng chia việc (người quản lý duyệt một lần)

Lưu ở `docs/ke-hoach/<yyyymmdd>-chia-viec.md`.

```markdown
# Chia việc: <dự án / tính năng>

Dựa trên: docs/yeu-cau/..., docs/thiet-ke/..., DESIGN.md
Tổng ước lượng: <giờ> (so với một agent làm tuần tự: <giờ>)

## Sơ đồ phụ thuộc
Khung (K) → BE-1, BE-2, FE-1, FE-2 (song song) → BE-3, FE-3 → Gom mốc 1

## Các đợt
| Đợt | Thẻ | Agent làm | File chính | Ước lượng | Ai review |
|---|---|---|---|---|---|
| 0 | K: khung, hợp đồng API, schema | 1 | ... | 45' | điều phối |
| 1 | BE-1 Đơn hàng · BE-2 Khách hàng · FE-1 Danh sách đơn · FE-2 Tạo đơn | 4 | ... | 60' | agent review |
| 2 | ... | ... | ... | ... | ... |
| Gom | Nối FE vào BE thật, test toàn bộ, kiểm luồng chính | 1 | ... | 30' | agent review |

## File dùng chung và chủ sở hữu
| File | Chủ | Người khác muốn sửa thì |
|---|---|---|
| router, menu | Khung (đã dựng sẵn chỗ) | chỉ thêm file trang mới |
| hợp đồng API | điều phối | báo điều phối |

## Mốc người quản lý xem
1. <luồng chạy được, vd tạo đơn → đổi trạng thái> sau đợt <n>

## Rủi ro và giả định
- ...
```
