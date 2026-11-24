# Bộ đề: thiet-ke-loi-giai

Câu 1, 2, 3 dựa trên câu trả lời thật của người quản lý (24/11). Câu 4, 5 do agent suy ra từ tiêu chí backend của người quản lý, chờ duyệt.

## 1. Quản lý đơn cà phê (cần backend)
**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: khách bán sỉ cà phê hạt cho quán. Màn danh sách đơn (mã đơn, tên quán, sản phẩm, số kg, tổng tiền, trạng thái, ngày giao; lọc theo khoảng ngày, xuất Excel các cột đang hiện). Quy trình: sale tạo đơn → kho đóng gói → shipper giao → thu tiền khi giao, mỗi bước đổi trạng thái. Khoảng 5 nhân viên dùng chung. Hãy thiết kế lời giải.
**Người quản lý làm:** Có backend vì lưu dữ liệu, nhiều người dùng chung, có quy trình trạng thái. Muốn thấy cấu trúc tổng quan, tổng quan giao diện, hạn chế của thiết kế.
**Đạt khi:**
- Chọn có backend, lý do gắn với lưu dữ liệu / nhiều người dùng / quy trình.
- Có đủ: cấu trúc dự án tổng quan, công nghệ có lý do, tổng quan giao diện (các màn và thông tin), hạn chế của thiết kế.
- Có bảng lợi và hại của kiến trúc được chọn.
- Không viết code; dừng chờ duyệt.

## 2. Trang giới thiệu quán (chỉ frontend)
**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: trang giới thiệu một quán cà phê gồm ảnh quán, menu, giờ mở cửa, địa chỉ có bản đồ. Chủ quán tự gửi nội dung, vài tháng mới đổi một lần. Không có đặt bàn, không có form, không lưu gì. Hãy thiết kế lời giải.
**Người quản lý làm:** Chỉ frontend, vì chỉ để xem, nội dung tĩnh, không lưu dữ liệu, không có logic.
**Đạt khi:**
- Chọn chỉ frontend, lý do: nội dung tĩnh, không lưu dữ liệu, không có logic.
- Không thêm backend, database hay trang quản trị như thể bắt buộc (có thể nêu ở phần hạn chế hoặc hướng mở rộng).
- Có tổng quan giao diện và hạn chế của thiết kế.

## 3. Theo dõi tiêu dùng khách hàng (bài học monolith)
**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: web quản lý theo dõi lượng tiêu dùng của khách hàng cho một chuỗi cửa hàng. Bản đầu: ghi nhận giao dịch, xem lịch sử tiêu dùng từng khách. Khách đã nói sẽ thêm dần tích điểm, khuyến mãi, báo cáo theo cửa hàng, và có thể thuê thêm lập trình viên. Hãy thiết kế lời giải.
**Người quản lý làm:** Đưa ra lợi và hại của monolith để cân nhắc ngay từ đầu, vì monolith làm nhanh nhưng càng lớn build càng lâu và người mới khó hiểu.
**Đạt khi:**
- Có bảng lợi và hại của kiến trúc, nhắc tới thời gian build và độ dễ hiểu cho người mới khi dự án lớn.
- Không chọn monolith thuần chỉ vì làm nhanh mà bỏ qua kế hoạch lớn lên; có cách chia theo module nghiệp vụ hoặc phương án tương đương.
- Có điều kiện hoặc thời điểm để chuyển sang kiến trúc kế tiếp.

## 4. Demo tính lãi vay
**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: trang demo cho khách nhập số tiền vay, lãi suất, số tháng, ra bảng trả góp từng tháng. Dùng để chào hàng trong một tuần, không lưu gì, không đăng nhập. Hãy thiết kế lời giải.
**Người quản lý làm (dự đoán):** Chỉ frontend, vì là demo nhỏ, phép tính đơn giản chạy được trên trình duyệt, không lưu dữ liệu.
**Đạt khi:**
- Chọn chỉ frontend, lý do: demo nhỏ, không lưu, phép tính đơn giản.
- Không dựng backend cho phép tính.

## 5. Tra cứu kết quả xét nghiệm
**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: phòng khám muốn bệnh nhân nhập mã phiếu và ngày sinh để xem kết quả xét nghiệm của mình. Nhân viên phòng khám tải kết quả lên. Khoảng 200 lượt tra cứu mỗi ngày. Hãy thiết kế lời giải.
**Người quản lý làm (dự đoán):** Có backend vì cần bảo mật dữ liệu riêng tư và lưu dữ liệu.
**Đạt khi:**
- Chọn có backend, lý do có nhắc bảo mật dữ liệu riêng tư.
- Không để dữ liệu kết quả hay khoá bí mật nằm ở frontend.
- Có hạn chế của thiết kế.
