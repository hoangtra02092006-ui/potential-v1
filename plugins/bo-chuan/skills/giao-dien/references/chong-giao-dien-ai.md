# Chống "giao diện AI"

Những dấu hiệu khiến giao diện trông như AI làm. Gặp là sửa.

## Hình thức
| Dấu hiệu | Vì sao trông giả | Làm thay |
|---|---|---|
| Tím, chàm, xanh tím làm màu chính khi không ai chọn | Màu mặc định của model, trang nào cũng giống nhau | Màu theo thương hiệu hoặc theo ngành, ghi trong DESIGN.md |
| Gradient ở nền, nút, chữ | Thêm nhiễu, lệch hệ thống | Màu phẳng; gradient chỉ khi thương hiệu có |
| Bo tròn lớn mọi thứ, bóng đổ dày nhiều lớp | Không có thứ bậc, nặng nề | Một thang bo góc, bóng nhẹ hoặc không bóng |
| Lưới 3-4 thẻ giống hệt nhau ở mọi mục | Lối tắt, bỏ qua thứ tự quan trọng của nội dung | Bố cục theo nội dung: mục quan trọng to hơn, đổi cách trình bày giữa các mục |
| Mục nào cũng: dòng nhỏ trên tiêu đề, tiêu đề, đoạn dẫn, 3 thẻ | Khuôn mẫu lặp | Mỗi mục một ý, một cách trình bày hợp ý đó |
| Hero chung chung: tiêu đề to, hai nút, hình minh hoạ trừu tượng | Không nói được bán gì | Nói rõ bán gì cho ai, cho thấy thứ thật (ảnh thật, giao diện thật của sản phẩm) |
| Emoji làm icon, icon vẽ tay lệch bộ | Thiếu chuyên nghiệp | Một bộ icon thống nhất (vd Lucide, Heroicons) hoặc icon thật của sản phẩm |
| Padding to và đều khắp nơi | Mất thứ bậc, phí màn hình | Thang khoảng cách: gần cho thứ liên quan, xa cho thứ khác nhóm |
| Mọi chữ căn giữa | Khó đọc đoạn dài | Căn trái cho nội dung đọc; căn giữa chỉ cho dòng ngắn |
| Nhiều màu nhấn cùng lúc | Rối | Một màu nhấn, dùng cho hành động chính |
| Mọi thứ trôi lên, mờ dần khi cuộn | Chậm, phiền | Chuyển động theo mục 6 của skill |

## Câu chữ
- Câu sáo: "Khai phá sức mạnh", "Trong thời đại số hôm nay", "Giải pháp toàn diện", "Unlock the power of", "Seamless".
- Số liệu bịa cho đẹp: "Nhanh hơn 3 lần", "10.000+ khách hàng", "98% hài lòng" khi không có nguồn.
- Lời chứng thực bịa, luôn đúng 3 cái, mỗi cái một câu chuyện có số.
- Tiêu đề hai mảnh kiểu "Nhanh. Gọn. Đẹp."; nhiều câu phủ định liên tiếp "Không X, không Y, không Z".
- Câu nói về chính trang: "Dưới đây là 3 lý do…", "Mục này cho thấy…".
- Mọi thẻ dài bằng nhau, mọi đoạn cùng một nhịp.
- Dấu gạch dài (—) và dấu chấm than rải khắp.
- Văn bản phụ bị bỏ quên: lỗi form, trạng thái rỗng, lời cảm ơn để mặc định.

Viết như người thật của doanh nghiệp đó nói: cụ thể, ngắn, không quảng cáo quá đà.

Nguồn tham khảo: addyosmani/agent-skills (frontend-ui-engineering), leonxlnx/taste-skill (copy-tells, motion), vercel-labs/agent-skills (web-design-guidelines). Đều giấy phép MIT.
