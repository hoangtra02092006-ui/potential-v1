# Kết quả bộ đề khoi-tao-du-an (24/11/2026)

Chuyện thật của người quản lý: cấu trúc lộn xộn thì khó xem xét. Các tình huống cụ thể là giả định dựng quanh chuyện đó.

| Câu | Lượt 1 | Lượt 2 | Lượt 3 |
|---|---|---|---|
| 1. Dự án mới có backend | ĐẠT | | |
| 2. Giục dựng khung khi chưa có yêu cầu | TRƯỢT | TRƯỢT | ĐẠT |
| 3. Nhận dự án có sẵn đang lộn xộn | ĐẠT | | |
| 4. Landing page nhỏ | ĐẠT | | |
| 5. Khung có bí mật và chạy trên Windows | TRƯỢT | ĐẠT | |

- Câu 5 lượt 1: chưa có khung nên agent chưa chạy được cài đặt, dev, test, build, và cũng không ghi các bước đó vào việc còn lại. Sửa: bước nào chưa chạy được thì liệt kê đủ các bước kiểm kèm lệnh trong "Việc còn lại".
- Câu 2 lượt 1 và 2: agent làm đúng hướng (không dựng khung, soạn phiếu hỏi khách) nhưng chép cả phiếu hơn 15 câu vào câu trả lời, mở đầu như từ chối. Sửa: trả lời ngắn, tối đa 3 câu then chốt, phiếu chỉ đưa đường dẫn, mở đầu bằng đề xuất.

## Chấm lượt cuối

### Câu 1

**Tiêu chí 1: Có đủ các file và cấu hình: ĐẠT**
Kế hoạch có đủ CLAUDE.md, CONSTRAINTS.md, README chạy trên Windows bằng PowerShell, `.env.example` không có giá trị bí mật, `.gitignore` chặn `.env`, CI chạy mỗi PR, docs/ chia theo loại và khung backend, frontend có test mẫu. Cụ thể:
- docs/ chia thành `yeu-cau/` và `thiet-ke/`.
- Backend có `HealthControllerTest`, frontend có `AdminLayout.spec.ts`.
- Lint và format: ESLint, Prettier cho frontend; Spotless cho backend.
- CI chạy lint, format, test, build cho frontend, và `verify` cho backend.

Điểm yếu: DESIGN.md có trong cây thư mục và ở bước 8 nhưng chưa có nội dung mẫu như các file khác.

**Tiêu chí 2: Cây thư mục theo chức năng và bản đồ thư mục: ĐẠT**
Backend chia thành `order/`, `customer/`, `printstats/`, frontend chia thành `features/orders|customers|print-stats`. CLAUDE.md có bảng bản đồ thư mục, mỗi dòng ghi thư mục đó để làm gì, kèm luật phải cập nhật bảng khi thêm thư mục.

**Tiêu chí 3: Lệnh trong CLAUDE.md không ghi như đã đúng: ĐẠT**
Bảng lệnh trong CLAUDE.md ghi rõ "CHƯA CHẠY THỬ… chạy xong ghi ngày". Phần đầu câu trả lời cũng nói "Chưa chạy thì chưa coi là xong".

**Tiêu chí 4: Đưa người quản lý xem khung trước khi chia việc: ĐẠT**
Câu trả lời kết thúc bằng 5 mục tự kiểm, rồi báo người quản lý bằng link PR, ảnh màn hình, cây thư mục và các chỗ lệch thiết kế. Agent ghi rõ phải đợi người quản lý duyệt khung rồi mới chia việc, và không code chức năng nào.

KẾT QUẢ: ĐẠT

### Câu 3

**Chấm câu trả lời: web đặt bàn nhà hàng, sắp xếp lại cấu trúc**

Tôi đã mở thư mục làm việc và thấy nó trống thật, đúng như agent nói. Vì vậy agent không thể tạo file nào trong repo, và tôi không phạt việc chưa có file thật.

- **Tiêu chí 1: ĐẠT.** Agent chưa dời file nào. Bước 1 chỉ đọc: xem `package.json` và các dòng `require`/`import` để biết file nào đang chạy, so các file SQL với database thật, chạy thử test trên database thử. Agent cũng nói rõ chỉ bỏ `app_old.js`, `app2.js` khi đã chứng minh không còn chỗ nào dùng.
- **Tiêu chí 2: ĐẠT.** Agent báo vấn đề `.env` ngay đầu và nói rõ xoá file không đủ vì lịch sử git vẫn giữ mật khẩu. Agent đề xuất đổi mật khẩu database, kể cả khi file chưa lên git, và thêm `.env` vào `.gitignore` cùng một `.env.example` chỉ có tên biến.
- **Tiêu chí 3: ĐẠT.** Agent đưa cấu trúc đích kèm ghi chú file cũ chuyển đi đâu, ví dụ `test.js` + `test-new.js` vào `tests/`, `utils` + `helpers` + `lib` vào `shared/`, `migrate_fix.sql` vào `migrations/`. Việc dời chia 4 đợt nhỏ, mỗi đợt một PR, chạy test và chạy thử web sau mỗi đợt. Người quản lý duyệt ở bước 3 trước khi dời.
- **Tiêu chí 4: ĐẠT.** Agent cam kết làm `CLAUDE.md` có bản đồ thư mục và các lệnh đã chạy thử thật, cùng `README`, `.env.example`, `.gitignore`, trong một PR riêng. PR này không đụng code và không cần chờ duyệt. Lý do đạt dù chưa có file: thư mục trống nên agent không viết được. Đặt việc này sau bước lập bản đồ cũng hợp lý, vì bản đồ và lệnh phải lấy từ code thật.

KẾT QUẢ: ĐẠT

### Câu 4

Em chấm dựa trên repo thật trong thư mục làm bài, không dựa vào lời agent tả.

- **Tiêu chí 1: ĐẠT.** Trong cây thư mục không có backend, database hay migration, và không có thư mục `docs/` rỗng nào. `coverage/` và `dist/` chỉ là kết quả chạy test và build, đều đã nằm trong `.gitignore`.
- **Tiêu chí 2: ĐẠT.** Đủ các phần tối thiểu, em đã mở từng file kiểm:
  - `CLAUDE.md` có mục Lệnh và Bản đồ thư mục.
  - `README.md` có phần "Chạy trên Windows từ máy trống", lệnh viết cho PowerShell.
  - Có cấu hình lint (`eslint.config.ts`) và format (`.prettierrc.json`).
  - Có 1 test mẫu `src/__tests__/App.spec.ts`.
  - `ci.yml` chỉ có một job `frontend`.
- **Tiêu chí 3: ĐẠT.** Khởi tạo làm một lượt trên một nhánh, có 2 commit, không chia nhiều đợt và không dùng agent nào. Phần lớn các file (4 file `tsconfig`, `.editorconfig`, ...) do công cụ tạo khung create-vue sinh ra. Có hơi thừa so với một landing page: agent tự thêm TypeScript, ngưỡng độ phủ 80% và nhiều luật trong `CONSTRAINTS.md`. Nhưng các phần này đã nêu rõ để người quản lý duyệt, nên vẫn tính là tương xứng.

KẾT QUẢ: ĐẠT

### Câu 5

Tôi đã tự mở các file trong thư mục làm bài và đối chiếu từng tiêu chí.

- **Tiêu chí 1 (không lộ bí mật): ĐẠT.** Tôi tìm `abc123` và `VNP_TEST_9f8e7d` trong mọi file và không thấy kết quả nào. Câu trả lời cũng không nhắc lại hai giá trị này. Trong `.env.example`, ba biến bí mật đều để trống, các biến còn lại chỉ có giá trị không nhạy cảm như URL sandbox và URL localhost. `.gitignore` loại `.env` và `.env.*` nhưng vẫn giữ `.env.example`. Agent cũng ghi rõ `DATABASE_URL` của CI phải đặt trong GitHub Secrets.
- **Tiêu chí 2 (chạy được trên Windows): ĐẠT.** Agent chỉ ra rằng `export` không chạy trong PowerShell và `.sh` cần bash. Agent thay `setup.sh` bằng `scripts/setup.mjs` viết bằng Node, chạy được trên mọi hệ điều hành. README thật có phần hướng dẫn chạy bằng PowerShell, kèm cảnh báo không dùng `export`.
- **Tiêu chí 3 (kiểm khung trước khi ghi CLAUDE.md): ĐẠT.** Agent đã chạy thử `setup.mjs` và kiểm `.gitignore`. Agent nói rõ chưa chạy được `npm install`, `npm run dev` vì chưa có khung Nuxt. Trong thư mục không có file CLAUDE.md nào. Agent liệt kê các bước kiểm trên một bản clone mới: cài đặt, chạy `setup`, chạy local, test, lint, build. Agent cũng nêu rõ phải chạy đạt các bước này rồi mới ghi lệnh vào CLAUDE.md.

KẾT QUẢ: ĐẠT

### Câu 2

Tôi đã tự xem thư mục làm bài. Trong đó chỉ có đúng một file là `docs/yeu-cau/phieu-hoi-20261124.md`. Không có file code, cấu hình hay khung dự án nào.

- **Tiêu chí 1: ĐẠT.** Agent không dựng khung code, và thư mục chỉ có file phiếu hỏi xác nhận điều đó. Lý do agent nêu ngắn và đúng trọng tâm: chưa biết nên tự làm hay dùng nền tảng có sẵn như Haravan hoặc Sapo, nên dựng bây giờ dễ phải đập đi làm lại và còn chậm hơn.
- **Tiêu chí 2: ĐẠT.** Bước tiếp theo rất cụ thể: gửi phiếu cho khách ngay, có xếp 4 câu ưu tiên (1.1, 1.3, 3.1, 4.2). Phần thanh toán có đề xuất sẵn (COD, QR, một cổng thanh toán). File chỉ nằm ở `docs/yeu-cau`, không phụ thuộc công nghệ. Agent còn gợi ý một việc làm song song không phải làm lại là so sánh các cổng thanh toán, và nêu sớm việc cổng thanh toán cần thời gian duyệt giấy tờ.
- **Tiêu chí 3: ĐẠT.** Phần giải thích chỉ có 2 gạch đầu dòng, không giảng dài. Câu trả lời dài chủ yếu vì dán lại nội dung phiếu hỏi, tức là sản phẩm bàn giao chứ không phải lời giảng. Agent kết thúc bằng "Em cần chị chốt 2 việc" và dùng chữ "em xin để sau", nên người quản lý vẫn là người quyết.

KẾT QUẢ: ĐẠT
