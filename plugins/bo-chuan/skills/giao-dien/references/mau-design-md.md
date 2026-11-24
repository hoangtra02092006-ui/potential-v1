# Mẫu DESIGN.md

Đặt ở gốc dự án. Gọn, cụ thể, có giá trị thật (mã màu, px), không viết chung chung.

```markdown
# DESIGN.md: <tên dự án>
Loại web: quản lý | marketing | nơi chốn. Tham chiếu: <1-2 trang>, học điều gì từ đó.

## Màu
| Token | Giá trị | Dùng cho |
|---|---|---|
| bg | #FAFAF9 | nền trang |
| surface | #FFFFFF | thẻ, bảng |
| border | #E7E5E4 | viền, đường chia |
| text | #1C1917 | chữ chính |
| text-muted | #78716C | chữ phụ |
| accent | #… | MỘT màu nhấn: hành động chính, link, focus |
| success / warning / danger | #… | chỉ cho trạng thái |

## Chữ
Họ chữ: <tên> (tiêu đề), <tên> (nội dung); hỗ trợ tiếng Việt.
Thang cỡ: 12 / 14 / 16 / 20 / 24 / 32 / 48. Độ đậm: 400 nội dung, 500-600 tiêu đề.

## Khoảng cách, bo góc, bóng
Khoảng cách: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
Bo góc: 4 (ô nhập), 8 (nút, thẻ). Bóng: không, hoặc một mức nhẹ cho lớp nổi.

## Chuyển động
Thời lượng 150-250ms, easing <…>. Chuyển động nào, ở đâu, để làm gì.

## Component chính
Nút (chính, phụ, nguy hiểm), ô nhập, bảng, thẻ, hộp thoại, thông báo: mô tả ngắn hình dáng và trạng thái.

## Nên
- …
## Không nên
- …
```

Muốn xem bản phân tích phong cách đầy đủ của các trang thật (Linear, Stripe, Notion, Apple…): github.com/voltagent/awesome-design-md (giấy phép MIT). Chỉ học cách phối; không dùng logo, tên, ảnh của thương hiệu khác.
