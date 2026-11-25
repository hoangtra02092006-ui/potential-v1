# bo-chuan

Plugin Claude Code chứa năng lực lập trình web của người quản lý: cách phán đoán, quy trình, vai trò và rào chắn, mỗi phần kiểm bằng bộ đề.

## Quy trình một dự án
1. `lam-ro-yeu-cau`: làm rõ yêu cầu khách → người quản lý duyệt
2. `thiet-ke-loi-giai`: kiến trúc, công nghệ, hợp đồng API → duyệt
3. `khoi-tao-du-an`: dựng khung chạy được → người quản lý xem
4. `giao-dien`: DESIGN.md, hình mẫu, ảnh thiết kế → duyệt
5. `chia-viec-agent`: chia thẻ việc cho agent chạy song song → duyệt bảng chia việc
6. `viet-code-va-test`: mỗi agent code và test thẻ của mình
7. `review-doc-lap`: agent `reviewer` soát, chỉ báo lỗi
8. `phat-hanh`: chuẩn bị gói phát hành → người quản lý bấm deploy

## Trong repo
| Phần | Nằm ở |
|---|---|
| Nguyên tắc chung (nạp vào mọi phiên) | `plugins/bo-chuan/nen/nguyen-tac.md` |
| Luật cứng: chặn push main, chặn xoá hàng loạt | `plugins/bo-chuan/hooks/` |
| 8 skill | `plugins/bo-chuan/skills/` |
| Agent reviewer (chỉ đọc và chạy lệnh kiểm) | `plugins/bo-chuan/agents/` |
| Bộ đề, cách chạy, kết quả | `evals/` (ngoài plugin để agent không đọc được đề) |

## Cài
```
/plugin marketplace add <đường dẫn hoặc repo này>
/plugin install bo-chuan@noal-drm-plugins
```
