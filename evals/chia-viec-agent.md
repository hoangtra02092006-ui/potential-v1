# Bộ đề: chia-viec-agent

Dựa trên câu trả lời thật của người quản lý (24/11): khung dùng chung trước, rồi chia backend và frontend, rồi chia tiếp phần độc lập; tối đa 5 agent cùng lúc, mỗi agent không quá 5 file, hai agent không sửa cùng một file; người quản lý duyệt bảng chia việc một lần, mỗi phần tự test và agent khác review, người quản lý xem ở mốc chạy được. Nỗi đau: một agent code rất lâu, hiểu sai yêu cầu, sót tiểu tiết, phải test lại và làm lại.

## 1. Web quản lý đơn sỉ cà phê
**Tình huống:** Thiết kế lời giải đã duyệt cho web quản lý đơn sỉ cà phê hạt: backend Java Spring Boot + PostgreSQL, frontend Nuxt 3. Chức năng: quản lý khách hàng (thêm, sửa, tìm), tạo và sửa đơn (nhiều dòng hàng, tính tổng, chiết khấu theo khách), đổi trạng thái đơn (mới → đang giao → đã giao / huỷ, ai được đổi), danh sách đơn có lọc theo ngày, trạng thái, khách, và xuất Excel. DESIGN.md đã duyệt. Repo đang trống. Hãy lập kế hoạch chia việc cho các agent (chưa chạy).
**Người quản lý làm:** Khung dùng chung trước; rồi backend và frontend song song; trong mỗi bên chia tiếp phần độc lập; tối đa 5 agent cùng lúc; mỗi agent ≤ 5 file; không hai agent sửa cùng file; trình bảng chia việc để duyệt một lần.
**Đạt khi:**
- Có bước khung làm trước, gồm hợp đồng API và schema; các file dùng chung như router, menu được dựng ở khung hoặc có chủ duy nhất.
- Chia backend và frontend chạy song song (frontend dùng dữ liệu giả theo hợp đồng), trong mỗi bên chia tiếp theo phần độc lập; không đợt nào quá 5 agent.
- Mỗi thẻ có danh sách file (không quá 5) và không có file nào nằm trong hai thẻ cùng đợt.
- Thẻ có tiêu chí xong gồm tiểu tiết (vd định dạng tiền, quyền đổi trạng thái, chiết khấu) và ca test cụ thể.
- Có ước lượng thời gian, mốc người quản lý xem, và trình như bản chờ duyệt, không tự chạy.

## 2. Trang demo nhỏ
**Tình huống:** Thiết kế lời giải đã duyệt: trang demo tính trả góp chỉ frontend, một file HTML/CSS/JS, gồm form nhập (số tiền vay, lãi suất năm, số tháng) và bảng trả góp từng tháng. DESIGN.md đã duyệt. Người quản lý muốn xong trong khoảng 3 giờ. Hãy lập kế hoạch chia việc cho agent.
**Người quản lý làm:** Việc nhỏ thì chia gọn, ít agent, không cắt vụn.
**Đạt khi:**
- Dùng 1-2 agent làm (không kể agent review), không chia thành nhiều thẻ nhỏ.
- Vẫn có tiêu chí xong và ca test cụ thể cho phần tính toán, gồm ca làm tròn (dư nợ cuối kỳ về đúng 0, không lẻ đồng).
- Vẫn có bước review bởi agent khác và tổng ước lượng trong khoảng 3 giờ.

## 3. Hai tính năng cùng phải sửa một file
**Tình huống:** Dự án Nuxt 3 + Spring Boot đang chạy. Cần thêm song song hai tính năng: "Báo cáo doanh thu theo tháng" và "Quản lý nhà cung cấp". Cả hai cần thêm mục vào menu trái (`components/AppSidebar.vue`), thêm route, thêm chuỗi vào file dịch `locales/vi.json`, và mỗi tính năng cần một migration database. Hãy lập kế hoạch chia việc cho agent.
**Người quản lý làm:** Hai agent không sửa cùng một file, tránh ghi đè.
**Đạt khi:**
- Nhận ra các file dùng chung (menu, file dịch, có thể router, thứ tự migration) và không giao cùng một file cho hai agent chạy song song.
- Có cách xử lý cụ thể: một chủ duy nhất, hoặc làm ở bước trước / bước gom, hoặc tách file (vd file dịch riêng theo tính năng), hoặc đặt tên migration để không đụng nhau.
- Hai tính năng vẫn chạy song song được ở phần còn lại, có bước gom và test toàn bộ.

## 4. Viết thẻ việc có tiểu tiết
**Tình huống:** Trong kế hoạch đã duyệt có thẻ "Xuất Excel danh sách đơn". Yêu cầu gốc: "Xuất Excel theo bộ lọc đang chọn. Mỗi dòng một đơn: mã đơn, ngày đặt (dd/MM/yyyy), tên khách, số điện thoại, tổng tiền (VND, có dấu chấm ngăn nghìn, không lẻ), trạng thái bằng tiếng Việt. Dòng cuối là tổng cộng. Tên file: don-hang-<từ ngày>-<đến ngày>.xlsx. Tối đa 10.000 đơn một lần; quá thì báo người dùng thu hẹp bộ lọc. Chỉ quản lý và kế toán được xuất." Hãy viết thẻ việc để giao cho agent backend.
**Người quản lý làm:** Agent hay hiểu sai và sót tiểu tiết, nên thẻ phải mang đủ yêu cầu và tiêu chí để agent không phải đoán.
**Đạt khi:**
- Thẻ chép yêu cầu gốc nguyên văn, không tóm tắt làm mất chi tiết.
- Tiêu chí xong có đủ tiểu tiết: định dạng ngày, tiền, trạng thái tiếng Việt, dòng tổng, tên file, giới hạn 10.000, quyền xuất.
- Có ca test cụ thể gồm ca biên: 0 đơn, đúng 10.000, 10.001 đơn, người không có quyền.
- Có danh sách file được sửa (≤ 5), file chỉ đọc, lệnh test, và yêu cầu agent ghi "tôi hiểu việc này là…" trước khi code.

## 5. Agent phát hiện hợp đồng API sai giữa chừng
**Tình huống:** Đang chạy đợt 1 với 4 agent. Agent backend làm thẻ "Tạo đơn" báo: hợp đồng API ghi `POST /api/orders` trả về `{ id }`, nhưng màn tạo đơn của frontend (agent khác đang làm) cần cả `orderCode` và `total` để hiện ngay; agent backend đề xuất tự thêm hai trường vào response và sửa luôn file hợp đồng `docs/api/openapi.yaml`. Bạn là điều phối, xử lý thế nào?
**Người quản lý làm:** Hợp đồng là thứ dùng chung, không để agent tự sửa; các bên phải biết khi hợp đồng đổi.
**Đạt khi:**
- Không cho agent backend tự sửa file hợp đồng; điều phối sửa (hoặc xin người quản lý nếu là thay đổi lớn).
- Báo cho agent frontend liên quan về thay đổi, cập nhật thẻ việc của cả hai bên.
- Đánh giá ảnh hưởng (thẻ khác dùng endpoint này, test hợp đồng) trước khi cho chạy tiếp.
