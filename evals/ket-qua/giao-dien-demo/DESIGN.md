# DESIGN.md: Trang demo lịch trả góp

Loại web: công cụ (tính toán) dùng để chào hàng. Cần chỉn chu như công cụ quản lý, gọn, đáng tin, không hiệu ứng.
Tham chiếu: Stripe Dashboard (bảng số căn phải, chữ phụ xám, một màu nhấn), Linear (khoảng cách chặt, viền mảnh thay bóng). Chỉ học cách phối, không lấy thương hiệu.

## Màu
| Token | Giá trị | Dùng cho |
|---|---|---|
| bg | #F6F6F3 | nền trang (trắng ngà, đỡ chói) |
| surface | #FFFFFF | khung nhập, khung kết quả |
| surface-sunken | #F0F0EC | đầu bảng, nút chọn nhanh |
| border | #E3E3DE | viền, đường chia |
| border-strong | #C9C9C2 | viền ô nhập khi rê chuột |
| text | #1B1E1C | chữ chính |
| text-muted | #646A66 | nhãn, chữ phụ |
| accent | #0E6B52 | MỘT màu nhấn (xanh rêu, gợi tài chính, tin cậy): tiền gốc, nút, focus, mục đang chọn |
| accent-soft | #E3F0EB | nền mục đang chọn, vòng focus |
| interest | #C98A1E | màu tiền lãi trên thanh tỉ lệ |
| interest-text | #8A5D0F | chữ cột Lãi (đủ tương phản trên nền trắng) |
| danger / danger-soft | #B3261E / #F6DEDC | lỗi nhập |

Gốc là xanh, lãi là vàng đất: khách nhìn một lần là phân biệt được.

## Chữ
Be Vietnam Pro (Google Fonts, dấu tiếng Việt chuẩn), dự phòng phông hệ thống. Một họ chữ.
Thang cỡ: 12 / 14 / 16 / 20 / 24 / 32. Độ đậm: 400 nội dung, 500 nhãn, 600 tiêu đề và số chính.
Mọi con số dùng `tabular-nums`, định dạng `Intl.NumberFormat('vi-VN')` (500.000.000), cột số căn phải.

## Khoảng cách, bo góc, bóng
Khoảng cách: 4 / 8 / 12 / 16 / 24 / 32 / 48.
Bo góc: 6 (ô nhập, nút), 10 (khung). Nút chọn nhanh bo tròn hẳn.
Bóng: một mức rất nhẹ `0 1px 2px rgba(27,30,28,.06)`, chủ yếu dựa vào viền.

## Bố cục
- Máy tính (≥ 861px): cột nhập 336px cố định bên trái (dính khi cuộn) + cột kết quả. Bảng cao tối đa 560px, cuộn trong khung, đầu bảng dính.
- Điện thoại: một cột, nhập ở trên, kết quả ở dưới. Bảng còn 3 cột: Tháng, Phải trả (kèm dòng phụ Gốc, Lãi), Còn nợ. Không cuộn ngang.
- Thứ tự đọc kết quả: số tiền tháng đầu (to nhất) → tháng cuối → tổng lãi, tổng phải trả, gốc mỗi tháng → thanh tỉ lệ gốc/lãi → bảng.

## Chuyển động
150-250ms, `cubic-bezier(.2,.7,.3,1)`. Chỉ có: viền ô nhập khi rê/focus, nền nút khi rê, thanh tỉ lệ co giãn khi đổi số. Tắt khi `prefers-reduced-motion`. Không dùng `transition: all`.

## Component chính
- Ô nhập: cao 44px, đơn vị (đồng, %/năm, tháng) nằm trong ô bên phải, gợi ý xám bên dưới; lỗi thì viền đỏ, gợi ý thay bằng câu lỗi nói rõ cách sửa.
- Số tiền vay tự thêm dấu chấm hàng nghìn khi gõ, giữ đúng vị trí con trỏ.
- Chọn nhanh thời hạn: 5 nút 1/3/5/10/20 năm, nút đang khớp số tháng được tô accent.
- Kết quả tự tính lại ngay khi gõ, không có nút "Tính".
- Trạng thái rỗng: "Chưa đủ thông tin để tính" + hướng dẫn. Trạng thái lỗi: "Sửa ô đang báo đỏ để xem lịch trả."
- Nút "In bảng": bản in ẩn khung nhập, in toàn bộ bảng.

## Nên
- Câu chữ ngắn, nói như nhân viên tín dụng giải thích cho khách.
- Ghi rõ cách tính và "số liệu để tham khảo".
- Dữ liệu mẫu giống thật: 500 triệu, 10,5%/năm, 60 tháng.

## Không nên
- Không tím, không gradient, không emoji, không thêm màu nhấn thứ hai.
- Không bịa logo, tên ngân hàng, số liệu quảng cáo.
- Không đặt mã màu, cỡ chữ, khoảng cách ngoài các token trên.
