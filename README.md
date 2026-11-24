# bo-chuan (bản nền)

Plugin Claude Code chứa năng lực lập trình web của người quản lý. Plugin chỉ là cái hộp; năng lực nằm ở các phần bên trong, được xây từng phần một.

| Phần | Nằm ở | Trạng thái |
|---|---|---|
| Nguyên tắc chung (nạp vào mọi phiên) | `plugins/bo-chuan/nen/nguyen-tac.md` | có |
| Luật cứng | `plugins/bo-chuan/hooks/` | có: chặn push main, chặn xoá hàng loạt |
| Skill (cách phán đoán và quy trình từng việc) | `plugins/bo-chuan/skills/` | lam-ro-yeu-cau, thiet-ke-loi-giai, giao-dien, chia-viec-agent, viet-code-va-test |
| Bộ đề kiểm tra | `evals/` (ngoài plugin) | mỗi skill 5 câu; chạy bằng `evals/chay-bo-de.sh` |
| Vai trò agent | `plugins/bo-chuan/agents/` | chưa có |


## Cài thử
```
/plugin marketplace add <đường dẫn tới thư mục này>
/plugin install bo-chuan@noal-drm-plugins
```

