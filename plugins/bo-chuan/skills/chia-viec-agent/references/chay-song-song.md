# Chạy nhiều agent song song trong Claude Code

## Giao việc
- Dùng công cụ **Agent** cho mỗi thẻ, chạy nền (`run_in_background`), gửi các thẻ cùng đợt **trong một lượt** để chúng chạy song song. Tối đa 5 cùng lúc.
- Mỗi agent làm trên **nhánh hoặc worktree riêng** (`isolation: "worktree"`), tên nhánh `feat/<mã-thẻ>-<tên-ngắn>`. Không có worktree thì chạy chung thư mục nhưng tuyệt đối theo danh sách file của thẻ.
- Lời giao cho agent là **nguyên thẻ việc** kèm đường dẫn tài liệu cần đọc. Agent không thấy cuộc trò chuyện của điều phối, nên thẻ thiếu gì là agent đoán cái đó.

## Trong lúc chạy
- Không ngồi chờ hay hỏi liên tục; agent xong sẽ báo về.
- Agent hỏi lại thì trả lời theo yêu cầu gốc; câu cần người quản lý quyết thì gom lại hỏi một lần.
- Agent báo hợp đồng sai: dừng các agent liên quan, sửa hợp đồng, báo lại cho cả hai bên.

## Gom
1. Kiểm báo cáo của từng agent: đủ tiêu chí, test xanh, đúng danh sách file (soát `git diff --stat`, file ngoài danh sách là lỗi).
2. Giao agent review cho từng thẻ (agent khác agent làm).
3. Gộp nhánh theo thứ tự phụ thuộc vào nhánh tính năng; xung đột thì điều phối xử, không giao lại cho agent làm.
4. Chạy test toàn bộ, build, kiểm luồng của mốc. Rồi mới báo người quản lý.

Tham khảo: wshobson/agents (agent-teams: parallel-feature-development, MIT), addyosmani/agent-skills (planning-and-task-breakdown, MIT).
