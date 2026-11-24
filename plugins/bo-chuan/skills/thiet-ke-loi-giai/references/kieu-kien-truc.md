# Các kiểu kiến trúc thường gặp

Chọn theo bài toán, không theo thói quen. Mỗi kiểu ghi khi nào hợp và cái giá phải trả.

| Kiểu | Hợp khi | Cái giá |
|---|---|---|
| Chỉ frontend (trang tĩnh, SPA không backend) | Nội dung tĩnh, demo, không lưu dữ liệu, không cần bảo mật | Không có chỗ giữ bí mật, không chia sẻ dữ liệu giữa người dùng |
| Phân lớp (controller → service → repository) | Ứng dụng nhỏ đến vừa, ít nghiệp vụ phức tạp, đội nhỏ | Logic dễ dồn vào service lớn; càng nhiều chức năng càng khó tìm code |
| Chia module theo nghiệp vụ (modular monolith) | Nhiều nhóm chức năng, sẽ thêm dần, một lần deploy | Phải giữ kỷ luật ranh giới module; build vẫn chung một khối |
| Clean / Hexagonal (lõi nghiệp vụ không phụ thuộc framework, DB nối qua cổng) | Nghiệp vụ phức tạp, cần test lõi không cần DB, có thể đổi DB hay dịch vụ ngoài | Nhiều lớp và interface hơn; thừa với CRUD đơn giản |
| Tách dịch vụ (microservices) | Nhiều đội làm độc lập, phần hệ thống cần mở rộng hoặc deploy riêng | Phức tạp vận hành: mạng, dữ liệu phân tán, giám sát, chi phí. Thường quá sớm cho dự án mới |

Kết hợp được: vd chia module theo nghiệp vụ, bên trong mỗi module dùng phân lớp; module nào nghiệp vụ nặng thì dùng Hexagonal.

## Bản đồ module
Khi có từ 2 nhóm chức năng trở lên, ghi bảng module trước khi vẽ chi tiết:

| Module | Lo việc gì | Phụ thuộc |
|---|---|---|
| customers | Thông tin khách | — |
| orders | Đơn hàng, trạng thái | customers |
| reports | Báo cáo | orders, customers |

- Tên module đặt một lần, không đổi giữa chừng.
- Phụ thuộc đi một chiều, không vòng. Hai module cần nhau thì gộp làm một.
- Module khác chỉ gọi qua interface công khai của module, không đọc thẳng bảng của nhau.

## Sơ đồ tổng quan (theo C4, chỉ 2 tầng)
1. **Ngữ cảnh:** ai dùng hệ thống, hệ thống nói chuyện với hệ thống ngoài nào.
2. **Container:** các phần chạy riêng (web frontend, API backend, database, dịch vụ ngoài) và cách chúng gọi nhau.
Hai tầng này đủ cho hầu hết dự án. Không vẽ tới mức class.

Nguồn tham khảo: addyosmani/agent-skills (spec-driven-development), wshobson/agents (architecture-patterns, c4-architecture), đều giấy phép MIT.
