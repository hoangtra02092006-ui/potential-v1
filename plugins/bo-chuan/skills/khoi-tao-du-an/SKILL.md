---
name: khoi-tao-du-an
description: Dựng khung một dự án web mới (repo, CLAUDE.md, CONSTRAINTS.md, DESIGN.md, docs/, khung code chạy được, test mẫu, lint, format, CI) hoặc sắp lại cấu trúc một dự án có sẵn đang lộn xộn. Dùng sau khi yêu cầu và thiết kế đã duyệt, trước khi chia việc cho agent; khi người quản lý nói "khởi tạo dự án", "dựng khung", "tạo repo", "setup project", hoặc khi nhận một repo chưa có CLAUDE.md, cấu trúc khó xem.
---

# Khởi tạo dự án

Bài học của người quản lý: **cấu trúc lộn xộn thì rất khó xem xét**. Người quản lý là người duyệt mọi thứ, nên khung dự án phải để người quản lý (và agent mới vào) mở ra là biết cái gì nằm ở đâu, việc nào đã làm, tài liệu nào là bản đang dùng.

## 1. Khi nào làm
- **Sau khi yêu cầu và thiết kế đã duyệt** (skill lam-ro-yeu-cau, thiet-ke-loi-giai). Chưa duyệt thì quay lại bước đó: khung dựng theo kiến trúc và công nghệ đã chọn, dựng trước thì dễ phải dựng lại.
- **Bị giục dựng khung khi chưa có yêu cầu:** trả lời ngắn (dưới 15 dòng), là đề xuất chứ không phải từ chối: một câu vì sao nên chờ; tối đa 3 câu hỏi trọng tâm để làm rõ nhanh (mỗi câu kèm đề xuất, phiếu đầy đủ để trong file nếu cần); việc làm được ngay không phụ thuộc công nghệ (tạo repo, `docs/yeu-cau/`); và nếu người quản lý vẫn muốn dựng ngay thì sẽ dựng gì, rủi ro gì. Người quản lý quyết. Nếu soạn phiếu hỏi khách (skill lam-ro-yeu-cau) thì **chỉ đưa đường dẫn file, không chép phiếu vào câu trả lời**. Mở đầu bằng đề xuất ("Em đề xuất làm rõ 3 điểm trước, mất khoảng…"), không mở đầu bằng "em chưa làm được".
- **Trước khi chia việc** (skill chia-viec-agent). Khung chính là phần dùng chung của đợt đầu.
- Thứ tự: yêu cầu → thiết kế → **khởi tạo** → người quản lý xem khung chạy được → chia việc.

## 2. Bộ khung gồm gì
Mỗi thứ có một chỗ cố định, mỗi thư mục một mục đích. Chi tiết và cây thư mục mẫu ở `references/cau-truc-mau.md`.

| Thứ | Nội dung |
|---|---|
| Repo, nhánh `main` | `.gitignore` đúng công nghệ, `.env.example` (không có `.env` thật), `.gitattributes` để xuống dòng không lộn giữa Windows và Linux |
| `CLAUDE.md` | Tổng quan, công nghệ, **bảng lệnh đã chạy thử**, **bản đồ thư mục**, kiến trúc ngắn, luật riêng. Mẫu `references/mau-claude-md.md` |
| `CONSTRAINTS.md` | Quy ước code và nghiệp vụ, mỗi luật kiểm được, kèm lý do (mẫu trong skill viet-code-va-test) |
| `DESIGN.md` | Khi có giao diện (skill giao-dien) |
| `docs/` | Theo loại: `yeu-cau/`, `thiet-ke/`, `adr/`, `ke-hoach/`, `phat-hanh/`. Tên file `<yyyymmdd>-<ten>.md` |
| Khung code | Chạy được, đúng cấu trúc trong thiết kế, có **1 test mẫu xanh**, lint và format đã cấu hình |
| `README.md` | Cách chạy trên Windows (PowerShell), từ máy trống tới chạy được |
| CI | GitHub Actions chạy lint, test, build mỗi PR. Mẫu `references/ci-github-actions.md` |

**Cân theo cỡ.** Web tĩnh hay chỉ frontend: không thư mục backend, không database, `docs/` chỉ tạo thư mục cần dùng, CI một job. Không tạo thư mục rỗng "để sau", không thêm công cụ không ai dùng.

## 3. Giữ cấu trúc dễ xem
- **Bản đồ thư mục trong CLAUDE.md**: mỗi thư mục cấp 1, cấp 2 một dòng "để làm gì". Thêm thư mục mới thì cập nhật bản đồ trong cùng PR.
- **Không để file lẻ ở gốc** ngoài file cấu hình công cụ và các file trên. Ghi chú, ảnh chụp, file thử để trong `docs/` hoặc thư mục tạm có trong `.gitignore`.
- **Code chia theo chức năng** (`features/don-hang/`, `features/khach-hang/`), phần dùng chung một chỗ (`shared/`). Logic nghiệp vụ tách khỏi giao diện và database như thiết kế đã chọn.
- **Một tài liệu một bản đang dùng.** Không để `thiet-ke-v2-final-moi.md`; sửa thẳng file, lịch sử nằm ở git. Quyết định đã bỏ ghi trong `docs/adr/`.
- Tên thư mục, file code tiếng Anh; tài liệu trong `docs/` tên không dấu.

## 4. Nhận dự án có sẵn đang lộn xộn
- Đọc và **lập bản đồ hiện trạng** trước: thư mục nào làm gì, file nào không ai dùng, lệnh chạy thật là gì (tự chạy thử).
- Bổ sung ngay thứ không đụng code: CLAUDE.md có bản đồ và lệnh đã chạy thử, `.env.example`, CI.
- **Sắp lại thư mục là việc riêng, người quản lý duyệt trước**: đề xuất cấu trúc đích, danh sách di chuyển (cũ → mới), làm theo từng đợt nhỏ mỗi đợt một PR, chạy test và build sau mỗi đợt. Không dời hàng loạt trong một lần, không xoá file "trông như thừa" khi chưa kiểm không còn chỗ nào dùng.
- Đang có việc chạy song song thì sắp lại sau khi các nhánh đó đã gộp, tránh xung đột.

## 5. Bí mật và môi trường
- Mật khẩu database, khoá API, token: chỉ ở `.env` (trong `.gitignore`) trên máy và trong secrets của GitHub hoặc nơi hosting. Repo chỉ có `.env.example` với tên biến và mô tả, giá trị để trống.
- Agent không ghi giá trị bí mật vào file, log hay tin nhắn. Thấy bí mật đã lỡ commit: báo người quản lý ngay, đề xuất đổi khoá (xoá khỏi git không đủ vì còn trong lịch sử).

## 6. Kiểm trước khi đưa người quản lý xem
Tự chạy và ghi kết quả thật vào CLAUDE.md, không ghi lệnh chưa chạy:
1. Cài đặt từ đầu theo README được (trên máy sạch hoặc thư mục clone mới).
2. Chạy local mở được trang hoặc API mẫu.
3. Test mẫu xanh, lint và format sạch, build đạt.
4. CI chạy xanh trên PR khởi tạo.
5. Bản đồ thư mục khớp cây thư mục thật.

Bước nào chưa chạy được (vd khung code chưa có, thiếu database) thì không ghi lệnh đó vào CLAUDE.md, và liệt kê trong "Việc còn lại" **đủ các bước kiểm trên kèm lệnh cụ thể** (cài đặt, chạy local, test, build, CI) để chạy ngay khi có khung.

Rồi báo người quản lý: link PR, ảnh hoặc lệnh chứng minh chạy được, cây thư mục, điều gì đã chọn khác thiết kế (nếu có) và vì sao. **Người quản lý xem một lần** lúc khung chạy được; duyệt xong mới sang chia việc.
