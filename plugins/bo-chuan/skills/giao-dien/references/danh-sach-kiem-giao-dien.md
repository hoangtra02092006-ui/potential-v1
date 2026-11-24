# Danh sách kiểm giao diện

Chạy trên code trước khi đưa duyệt. Ghi lỗi dạng `file:dòng - lỗi`, ngắn gọn; file không lỗi ghi `✓ đạt`.

## Truy cập
- Nút chỉ có icon có `aria-label`; icon trang trí có `aria-hidden="true"`.
- Ô nhập có `<label>` (hoặc `aria-label`), bấm vào nhãn thì vào ô.
- Thao tác dùng `<button>`, chuyển trang dùng `<a>`; không gắn click vào `<div>`, `<span>`.
- Ảnh có `alt` (`alt=""` nếu trang trí).
- Thông báo cập nhật (lỗi form, toast) có `aria-live="polite"`.
- Tiêu đề đúng thứ bậc h1 → h6; có link "bỏ qua đến nội dung chính".

## Focus
- Mọi thứ bấm được có viền focus nhìn thấy; không `outline: none` mà không có cái thay thế.
- Dùng `:focus-visible` thay `:focus`; cụm điều khiển dùng `:focus-within`.
- Thanh dính đầu hoặc chân trang không che phần tử đang focus.

## Form
- Ô nhập có `autocomplete`, `name`, đúng `type` (`email`, `tel`, `number`) và `inputmode`.
- Không chặn dán.
- Lỗi hiện ngay cạnh ô; bấm gửi thì focus vào ô lỗi đầu tiên.
- Nút gửi không bị khoá trước khi gửi; đang gửi thì có chỉ báo.
- Placeholder là ví dụ, kết thúc bằng `…`.
- Rời trang khi còn thay đổi chưa lưu thì cảnh báo.

## Chuyển động
- Tôn trọng `prefers-reduced-motion`.
- Chỉ animate `transform` và `opacity`; không `transition: all`.
- Chuyển động dừng được giữa chừng khi người dùng thao tác.
- Chuyển động tự chạy quá 5 giây có nút dừng.

## Chữ và nội dung
- Dùng `…` thay `...`; đang tải ghi "Đang tải…".
- Số tiền, ngày giờ dùng `Intl.NumberFormat`, `Intl.DateTimeFormat`; cột số dùng `tabular-nums`.
- Tiêu đề dùng `text-wrap: balance`.
- Khối chữ chịu được nội dung rất dài và rỗng (cắt dòng, xuống dòng, trạng thái rỗng); con của flex có `min-width: 0`.
- Nút ghi rõ việc ("Lưu đơn" thay vì "Tiếp tục"); lỗi nói cách sửa.

## Ảnh và tốc độ
- `<img>` có `width`, `height`; ảnh dưới màn đầu `loading="lazy"`, ảnh chính màn đầu `fetchpriority="high"`.
- Có `preconnect` cho nguồn phông và ảnh; phông dùng `font-display: swap`.
- Danh sách trên 50 dòng thì ảo hoá hoặc `content-visibility: auto`.
- Mô hình 3D, video nặng có trạng thái đang tải và bản thay thế khi không tải được.

## Chạm và bố cục
- `touch-action: manipulation`; hộp thoại, ngăn kéo có `overscroll-behavior: contain`.
- Thao tác kéo, vuốt có cách khác bằng bấm hoặc bàn phím.
- Trang tràn mép có `env(safe-area-inset-*)`; không có thanh cuộn ngang.
- Không chặn phóng to (`user-scalable=no`, `maximum-scale=1`).
- Xoá cần xác nhận hoặc cho hoàn tác.

## Trạng thái và điều hướng
- Bộ lọc, tab, trang hiện tại nằm trên URL để gửi link được.
- Nút và link có trạng thái hover; hover, nhấn, focus rõ hơn lúc thường.

Nguồn: vercel-labs/agent-skills, web-design-guidelines (MIT), dịch và rút gọn, bỏ phần riêng cho React.
