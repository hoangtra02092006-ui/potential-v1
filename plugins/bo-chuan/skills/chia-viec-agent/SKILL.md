---
name: chia-viec-agent
description: Chia việc cho nhiều agent chạy song song sau khi thiết kế đã duyệt, rồi gom lại. Dùng khi bắt đầu dựng một dự án hay một tính năng, khi việc lớn hơn một agent làm trong khoảng một giờ, khi người quản lý nói "chạy song song", "chia agent", "làm cho nhanh". Gồm làm khung dùng chung trước, chia backend và frontend rồi chia tiếp phần độc lập, giao mỗi agent một thẻ việc có tiêu chí xong chi tiết, kiểm chéo và gom theo mốc.
---

# Chia việc cho agent

Người quản lý từng giao một tính năng cho một agent: agent code rất lâu, xong thì hiểu sai yêu cầu hoặc bỏ sót tiểu tiết, người quản lý phải test đi test lại rồi ra lệnh làm lại. Skill này nhắm vào đúng ba chỗ đó: **nhanh** (nhiều agent song song, mỗi phần nhỏ), **đúng yêu cầu** (mỗi thẻ việc mang theo yêu cầu gốc và tiêu chí xong chi tiết), **người quản lý ít phải test lại** (agent tự test, agent khác review trước khi người quản lý xem).

Điều kiện: yêu cầu và thiết kế đã được người quản lý duyệt (skill lam-ro-yeu-cau, thiet-ke-loi-giai; có giao diện thì DESIGN.md đã duyệt). Chưa có thì quay lại bước đó, không chia việc trên yêu cầu mơ hồ.

## 1. Thứ tự chia
1. **Khung dùng chung trước, một agent làm.** Gồm: tạo dự án và cấu trúc thư mục, cấu hình build, lint, test, kết nối database, layout và router chính, file token giao diện, **hợp đồng API** (đường dẫn, dữ liệu vào ra, mã lỗi), schema database và dữ liệu mẫu. Mọi file mà nhiều phần sau cùng cần sửa (router, menu, file dịch, file cấu hình, migration đầu) được dựng sẵn ở bước này, để các phần sau chỉ thêm file mới. Khung xong phải build và chạy test được. Khung cũng theo giới hạn ở mục 2: khung lớn thì tách thành vài thẻ khung (vd K-BE, K-FE) không đụng file nhau. File riêng của một phần (entity, repository, service của module đơn hàng) để cho thẻ của phần đó, khung chỉ giữ thứ thật sự dùng chung.
2. **Chia backend và frontend.** Hai bên chạy song song nhờ hợp đồng API: frontend dùng dữ liệu giả đúng theo hợp đồng, không chờ backend.
3. **Chia tiếp trong mỗi bên** những phần tách biệt, không ảnh hưởng nhau (vd backend: đơn hàng, khách hàng, báo cáo; frontend: màn danh sách, màn tạo đơn, màn báo cáo). Phần nào phụ thuộc phần khác thì xếp vào đợt sau.
4. **Gom và kiểm theo mốc:** nối frontend vào backend thật, chạy test toàn bộ, kiểm luồng chính.

Việc nhỏ thì chia ít: web chỉ frontend vài giờ, hoặc chỉ một vài file, thì **một agent làm trọn** (không tách bước khung riêng) và một agent khác review; nhiều nhất hai agent làm nếu có hai phần thật sự tách biệt. Không chia một việc 30 phút cho 3 agent; chi phí giao việc và gom lại lớn hơn phần tiết kiệm.

## 2. Giới hạn
- **Tối đa 5 agent chạy cùng lúc.** Nhiều phần hơn thì chia đợt.
- **Mỗi agent sửa hoặc tạo không quá 5 file.** Phần lớn hơn thì cắt nhỏ.
- **Hai agent không bao giờ sửa cùng một file** (tránh ghi đè). Mỗi thẻ việc ghi rõ danh sách file được sửa. File dùng chung bắt buộc phải sửa thì: giao cho đúng một agent làm chủ, agent khác gửi yêu cầu thay đổi cho agent chủ hoặc cho điều phối; hoặc đưa vào bước khung / bước gom.
- Mỗi phần nên xong trong khoảng **một giờ**. Ước lượng lâu hơn thì cắt nhỏ.
- Hợp đồng API và schema chỉ điều phối được sửa. Agent thấy hợp đồng sai thì dừng, báo điều phối, không tự sửa. Điều phối:
  1. **Đánh giá ảnh hưởng trước:** tìm mọi thẻ và mọi chỗ code đang dùng phần hợp đồng đó (tìm theo đường dẫn API, tên trường), dữ liệu giả, test hợp đồng sẽ phải đổi; thay đổi phá vỡ cái đang có (đổi tên, bỏ trường, thêm trường bắt buộc ở đầu vào) hay chỉ thêm.
  2. Thay đổi nhỏ chỉ thêm thì điều phối sửa hợp đồng; thay đổi phá vỡ hoặc đổi phạm vi thì hỏi người quản lý.
  3. Cập nhật thẻ việc và báo mọi agent liên quan, rồi mới cho chạy tiếp.

**Tự soát bảng chia việc trước khi trình**, soát từng dòng, không ước chừng:
- Mọi thẻ, kể cả thẻ khung và thẻ gom, có danh sách file **được sửa hoặc tạo** và không quá 5 file. Ghi từng file cụ thể, không ghi thư mục hay "các file …". File chỉ đọc ghi riêng, không tính vào 5. Đếm thật từng thẻ rồi mới ghi "đã soát".
- Lập danh sách file của từng đợt: không file nào (kể cả CLAUDE.md, README, file cấu hình, file dịch) xuất hiện ở hai thẻ cùng đợt.
- Thẻ phụ thuộc thẻ khác thì nằm ở đợt sau, không cùng đợt.
- Mỗi đợt không quá 5 agent.

## 3. Thẻ việc: chống hiểu sai và sót tiểu tiết
Mỗi agent nhận một thẻ việc theo mẫu `references/the-viec.md`. Thẻ phải đủ để agent làm mà **không cần đoán**:
- **Yêu cầu gốc:** chép nguyên văn đoạn liên quan trong tài liệu yêu cầu và thiết kế, không tóm tắt lại bằng lời mình.
- **Tiêu chí xong** kiểm được, gồm cả **tiểu tiết**: định dạng (tiền VND không lẻ, ngày dd/MM/yyyy), làm tròn, giới hạn (độ dài, số lượng), quyền (ai được làm), trạng thái rỗng và lỗi, câu chữ hiển thị.
- **Ca test cụ thể** có số liệu vào và kết quả mong đợi, gồm ca biên (0, rỗng, rất lớn, sai định dạng). Đây là chỗ bắt lỗi kiểu "dư nợ cuối kỳ còn 1 đồng".
- **File được sửa** và **file chỉ được đọc** (hợp đồng, token, DESIGN.md).
- **Lệnh** test, lint, build của dự án.

Trước khi code, agent ghi lại 3-5 dòng "tôi hiểu việc này là…" kèm điều chưa rõ. Có điều chưa rõ thì hỏi điều phối trước, không đoán. Điều phối đối chiếu với yêu cầu gốc; câu nào cần người quản lý quyết thì gom lại hỏi một lần (tối đa 3 câu, kèm đề xuất).

## 4. Kiểm trước khi người quản lý xem
1. **Agent làm tự kiểm:** chạy test, lint, build; tự đi lại từng tiêu chí xong và từng ca test, ghi đạt hay không. Có giao diện thì tự chụp màn hình theo skill giao-dien.
2. **Một agent khác review** (không phải agent làm): đối chiếu với **yêu cầu gốc trong thẻ**, không chỉ đọc code. Ưu tiên tìm chỗ hiểu sai yêu cầu và tiểu tiết bị sót, rồi mới đến chất lượng code.
3. Lỗi thì trả về chính agent đó sửa, kèm chỗ sai và tiêu chí bị trượt.
4. Người quản lý chỉ xem khi gom xong một **mốc chạy được** (vd luồng tạo đơn đến đổi trạng thái chạy thật), kèm bảng: tiêu chí nào đạt, ca test nào chạy, chỗ nào còn giả định.

## 5. Điểm dừng cho người quản lý
- **Duyệt bảng chia việc một lần** trước khi chạy: các đợt, agent nào làm gì, file nào, ước lượng thời gian, mốc nào người quản lý sẽ xem. Mẫu ở `references/bang-chia-viec.md`, lưu ở `docs/ke-hoach/<yyyymmdd>-chia-viec.md`.
- **Xem ở mỗi mốc.**
- Ngoài ra chỉ hỏi khi phải đổi hợp đồng API, schema, phạm vi, hoặc một phần trễ gấp đôi ước lượng.

## 6. Cách chạy trong Claude Code
Đọc `references/chay-song-song.md`: giao bằng công cụ Agent chạy nền, mỗi agent một nhánh hoặc worktree riêng, điều phối gom theo thứ tự phụ thuộc.
