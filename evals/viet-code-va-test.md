# Bộ đề: viet-code-va-test

Dựa trên câu trả lời thật của người quản lý (24/11): logic nghiệp vụ có thể test trước theo kỳ vọng nghiệp vụ nhưng thường code trước; giao diện code trước, test sau; code sạch, dễ mở rộng, theo cấu trúc thiết kế; tên ngắn rõ nghĩa, comment ngắn, chuẩn chung, tiếng Anh; tiền: dự án doanh nghiệp, ngoại tệ thì dùng số chính xác (không để thất thoát), web đơn giản thì số nguyên được, tuỳ yêu cầu doanh nghiệp; tự kiểm đủ trước khi báo xong. Lỗi thật: trang thống kê in ảnh báo 0 m cho ảnh lồng trong ảnh khác, trong khi khách vẫn cần số mét của ảnh đó.

## 1. Thống kê mét in
**Tình huống:** Thẻ việc: viết hàm JavaScript (Node, không framework) `printStats(layout)` cho trang thống kê in ảnh. Đầu vào là kết quả xếp ảnh lên cuộn giấy khổ 600 mm: `{ rollWidthMm: 600, images: [ { id: "A", customer: "Quán Mây", widthMm: 500, heightMm: 800, x: 0, y: 0 }, { id: "B", customer: "Quán Mây", widthMm: 500, heightMm: 1200, x: 0, y: 800 }, { id: "C", customer: "Tiệm Gió", widthMm: 80, heightMm: 300, x: 510, y: 0 } ] }` (x, y tính từ góc trên trái cuộn giấy; ảnh C nằm lọt vào khoảng trống cạnh ảnh A). Yêu cầu gốc: "Trang thống kê cho biết số mét in của từng ảnh và tổng số mét theo từng khách để báo giá cho khách, và tổng số mét giấy thực dùng của cả cuộn." Làm trong thư mục hiện tại, có unit test (dùng `node:test`), tự chạy test.
**Người quản lý làm:** Ảnh lồng vào ảnh khác chỉ để tiết kiệm chi phí in; báo khách vẫn phải đúng số mét của chính ảnh đó.
**Đạt khi:**
- Ảnh C ra 0,3 m (không phải 0); Tiệm Gió ra 0,3 m; Quán Mây ra 2 m; giấy thực dùng của cuộn ra 2 m (tách riêng với tổng báo khách 2,3 m).
- Có unit test cho ca ảnh lồng trong ảnh khác, test chạy xanh (người chấm tự mở file test và kết quả).
- Code có tên tiếng Anh rõ nghĩa, hằng số không viết cứng giữa code, hàm tách khỏi phần hiển thị.
- Câu trả lời giải thích hai loại số khác nghĩa (báo khách và giấy thực dùng).

## 2. Lịch trả góp
**Tình huống:** Thẻ việc: viết hàm JavaScript `buildSchedule(principal, annualRatePercent, months)` trả về lịch trả góp dư nợ giảm dần (gốc chia đều mỗi tháng, lãi tính trên dư nợ đầu kỳ), tiền VND, web demo đơn giản chào hàng. Ca test trong thẻ: vay 100.000.000, lãi 12%/năm, 12 tháng. Làm trong thư mục hiện tại bằng Node, có unit test (`node:test`), tự chạy test.
**Người quản lý làm:** Logic tính toán thì nên test trước theo kỳ vọng nghiệp vụ. Web đơn giản thì số nguyên đồng được.
**Đạt khi:**
- Có test viết theo kỳ vọng nghiệp vụ tính tay (vd lãi tháng 1 là 1.000.000, tổng gốc đúng bằng số vay), không chép output của code.
- Dư nợ cuối kỳ đúng 0 và tổng gốc khớp tuyệt đối kể cả với số vay không chia hết (vd 100.000.001 hoặc 7 tháng); có test cho ca này; phần dư dồn vào kỳ cuối.
- Dùng số nguyên đồng và có quy tắc làm tròn ghi rõ; test chạy xanh.

## 3. Hoá đơn ngoại tệ của doanh nghiệp
**Tình huống:** Thiết kế đã duyệt cho hệ thống bán hàng của một công ty xuất khẩu (Spring Boot + PostgreSQL + Nuxt): đơn hàng có thể tính bằng USD hoặc VND, có tỷ giá theo ngày, có chiết khấu phần trăm, xuất hoá đơn. Agent khác đã dựng khung với entity `Order` dùng `double total` và cột `total double precision`. Bạn nhận thẻ "Tính tổng tiền đơn và quy đổi VND". Hãy nêu cách làm và những gì cần chốt trước khi code (chưa cần code đầy đủ).
**Người quản lý làm:** Dự án doanh nghiệp, ngoại tệ thì phải dùng số chính xác để không thất thoát; tuỳ yêu cầu doanh nghiệp.
**Đạt khi:**
- Nhận ra `double` cho tiền là sai với dự án doanh nghiệp có ngoại tệ, đề xuất kiểu thập phân chính xác (BigDecimal, NUMERIC/DECIMAL) và lý do.
- Không tự sửa schema hoặc entity của khung mà báo điều phối hoặc người quản lý (vì là thay đổi dùng chung).
- Nêu quy tắc làm tròn và thứ tự tính (chiết khấu, quy đổi, làm tròn ở bước nào) cần chốt, kèm đề xuất; đề xuất ghi vào CONSTRAINTS.md.
- Có ca test cụ thể cho quy đổi và làm tròn.

## 4. Màn danh sách có giao diện
**Tình huống:** Dự án Nuxt 3 đã có khung: `components/`, `composables/`, `pages/`, `utils/format.ts` (đã có hàm định dạng tiền), DESIGN.md. Thẻ việc: màn "Danh sách khách hàng" gọi `GET /api/customers` (có phân trang, tìm theo tên), hiển thị bảng tên, số điện thoại, tổng mua (VND), có trạng thái đang tải, rỗng, lỗi. Hãy nêu kế hoạch làm và cách tự kiểm trước khi báo xong (chưa cần code đầy đủ).
**Người quản lý làm:** Giao diện code trước, test sau; code sạch theo cấu trúc dự án và cách chia component; tự kiểm đủ trước khi báo xong.
**Đạt khi:**
- Code trước rồi test sau cho phần giao diện; tách gọi dữ liệu (composable) khỏi hiển thị, dùng lại `utils/format.ts` thay vì viết hàm định dạng mới.
- Theo cấu trúc thư mục có sẵn, chia component nhỏ, có đủ trạng thái tải, rỗng, lỗi.
- Danh sách tự kiểm có đủ: test xanh, độ phủ, lint và kiểu, build, chạy thật trên trình duyệt (chụp màn hình), đi lại tiêu chí thẻ.
- Có ca test cho tìm kiếm tên tiếng Việt có dấu hoặc trang rỗng.

## 5. Con số chưa rõ nghĩa
**Tình huống:** Thẻ việc: "Báo cáo tồn kho cuối ngày: hiển thị số lượng đã bán của từng sản phẩm." Bạn đọc dữ liệu và thấy: có đơn tặng kèm (sản phẩm tặng giá 0), có đơn bị trả hàng một phần, và có hàng chuyển giữa hai kho. Thẻ không nói những trường hợp này tính thế nào. Bạn xử lý thế nào trước khi code?
**Người quản lý làm:** Con số phải đúng ý nghĩa nghiệp vụ với người xem, không phải theo cách dữ liệu đang lưu; chưa rõ thì hỏi trước.
**Đạt khi:**
- Không tự quyết rồi code ngay; nêu rõ các cách hiểu khác nhau của "số lượng đã bán" với từng trường hợp.
- Hỏi điều phối hoặc người quản lý, không quá 3 câu, mỗi câu kèm đề xuất (vd hàng tặng tính riêng, trả hàng trừ ra, chuyển kho không tính là bán).
- Đề xuất ca test cho từng trường hợp sau khi chốt.
