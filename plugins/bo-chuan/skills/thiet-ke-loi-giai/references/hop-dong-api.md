# Hợp đồng API (khi có backend)

Thống nhất API trước khi code. Frontend và backend làm song song được nhờ hợp đồng này.

- **Liệt kê endpoint trước:** phương thức, đường dẫn, dữ liệu gửi, dữ liệu trả, lỗi có thể có. Với Java Spring thì viết thành OpenAPI.
- **Một kiểu lỗi cho mọi endpoint:** `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": ... } }`. Mã HTTP: 400 dữ liệu sai, 401 chưa đăng nhập, 403 không có quyền, 404 không có, 409 trùng hoặc xung đột, 422 không hợp lệ về nghiệp vụ, 500 lỗi máy chủ (không lộ chi tiết bên trong).
- **Kiểm dữ liệu ở biên:** dữ liệu từ người dùng, từ dịch vụ ngoài, từ biến môi trường thì kiểm ngay chỗ vào. Bên trong đã kiểm thì không kiểm lại.
- **Đặt tên nhất quán:** đường dẫn là danh từ số nhiều (`/api/orders`), trường dạng camelCase, trường đúng sai bắt đầu bằng is/has, giá trị enum viết HOA_GẠCH_DƯỚI.
- **Thêm, đừng sửa:** mở rộng bằng trường mới tuỳ chọn. Không đổi kiểu hay xoá trường đang có người dùng.
- **Danh sách có phân trang** ngay từ đầu.

Nguồn tham khảo: addyosmani/agent-skills (api-and-interface-design), giấy phép MIT.
