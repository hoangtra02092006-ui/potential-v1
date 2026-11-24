---
name: viet-code-va-test
description: Viết code và unit test cho một thẻ việc, rồi tự kiểm đến khi đủ chuẩn để đưa review. Dùng khi agent nhận thẻ việc để code, khi sửa lỗi, khi viết logic tính toán và nghiệp vụ (tiền, số lượng, đo đạc, trạng thái), hoặc khi người quản lý nói "code đi", "viết test", "sao số này sai". Cũng dùng khi đang làm thẻ việc mà gặp chỗ chưa rõ: hỏi điều phối tối đa 3 câu, không quay lại soạn phiếu hỏi khách. Gồm hiểu ý nghĩa nghiệp vụ của từng con số, test trước hay code trước, tổ chức code sạch, cách xử lý tiền tệ, CONSTRAINTS.md, các bẫy hay gặp và danh sách tự kiểm.
---

# Viết code và test

Agent chạy đúng chưa đủ. Lỗi người quản lý gặp nhiều nhất không phải code hỏng mà là **code chạy được nhưng ra số sai nghiệp vụ**: trang thống kê in ảnh báo một ảnh chiếm 0 m vì ảnh đó được lồng vào khoảng trống của ảnh khác để tiết kiệm giấy, trong khi khách vẫn phải được báo đúng số mét của ảnh đó. Code đúng theo cách sắp xếp, sai theo ý nghĩa với khách. Skill này bắt đầu từ chỗ đó.

## 1. Trước khi code: hiểu từng con số đầu ra
Đọc thẻ việc (skill chia-viec-agent), viết "tôi hiểu việc này là…". Với **mỗi con số hoặc dữ liệu đầu ra**, ghi một dòng:
- Số này **cho ai xem, dùng để làm gì** (báo khách, tính tiền, nội bộ tối ưu chi phí).
- Nó đo **cái gì theo nghĩa nghiệp vụ**, không phải theo cách dữ liệu đang được sắp xếp hay lưu.

Cách làm nội bộ để tiết kiệm (ghép ảnh, gộp đơn, gộp chuyến giao, dùng chung kho) **không được làm thay đổi con số báo cho khách**, trừ khi yêu cầu nói rõ. Hai loại số khác nghĩa thì tính và hiển thị riêng (vd "mét in thực tế của ảnh" và "mét giấy thực dùng sau khi ghép").

**Khi nào hỏi, khi nào làm luôn:**
- Ý nghĩa nghiệp vụ của con số mơ hồ, các cách hiểu cho ra kết quả khác nhau với khách hoặc với tiền thật: dừng, hỏi điều phối hoặc người quản lý trước khi code. Gộp thành **tối đa 3 câu**, mỗi câu kèm đề xuất (vd một câu cho mỗi trường hợp chưa rõ), không đưa phiếu hỏi dài. **Chỉ hỏi đúng chỗ mơ hồ đang chặn thẻ**; chuyện khác nảy ra (cột phụ, giờ chốt, định dạng xuất…) thì dùng mặc định và ghi giả định, không thêm câu hỏi. Thẻ việc đã qua làm rõ yêu cầu và đã duyệt, nên ở bước này **không chuyển sang skill lam-ro-yeu-cau và không soạn phiếu hỏi khách**; câu hỏi gửi điều phối hoặc người quản lý, họ tự quyết có cần hỏi khách không. Kèm luôn ca test cụ thể (dữ liệu vào, kết quả mong đợi) cho cách hiểu đề xuất, để khi chốt là dùng được ngay.
- Thẻ đã đủ rõ, chỉ còn chi tiết có mặc định thông dụng (lãi tháng = lãi năm / 12, làm tròn nửa lên, web demo VND dùng số nguyên đồng theo mục 4): **tự chọn mặc định, ghi giả định trong báo cáo và CONSTRAINTS.md, rồi làm luôn đến khi test xanh.** Không dừng chờ hỏi những chi tiết này.

## 2. Test trước hay code trước
- **Logic tính toán, nghiệp vụ có kết quả mong đợi rõ** (tiền, lãi, chiết khấu, đo đạc, chuyển trạng thái): viết test từ ca test của thẻ trước, cho test đỏ, rồi code cho xanh.
- **Còn lại** thường code trước, rồi viết test **ngay sau**, trong cùng thẻ việc. Giao diện: code trước, test sau.
- Dù trước hay sau, **kết quả mong đợi trong test lấy từ yêu cầu và phép tính tay, không chép từ output của code vừa viết**. Test chép output chỉ chứng minh code chạy như code đang chạy.
- Mỗi ca test của thẻ có ít nhất một test. Thêm ca biên: 0, rỗng, rất lớn, sai định dạng, và ca "xếp lồng / gộp / chia nhỏ" nếu nghiệp vụ có tối ưu nội bộ.

## 3. Tổ chức code
- Theo đúng cấu trúc dự án, bản đồ module và cây thư mục trong bản thiết kế (skill thiet-ke-loi-giai), cách chia component trong skill giao-dien. Không tự đặt cấu trúc mới; cần đổi thì hỏi.
- Màn giao diện: dùng lại component và hàm có sẵn trước; chưa có thì tách thành component nhỏ, mỗi cái một việc, và **ghi rõ tên từng component** trong kế hoạch (vd ô tìm kiếm, bảng, phân trang, khung rỗng, khung lỗi, khung đang tải), không gộp cả màn vào một component lớn. Gọi dữ liệu để trong composable (Vue) hoặc hook (React), không để trong component hiển thị.
- Logic nghiệp vụ tách khỏi giao diện và khỏi tầng lưu dữ liệu: hàm thuần, nhận vào trả ra, dễ test. Giao diện và controller chỉ gọi.
- Code sạch, dễ mở rộng: hàm ngắn làm một việc, không lặp code, không code chết, không `console.log` hay `print` để quên, không nuốt lỗi (bắt lỗi thì xử lý hoặc báo rõ). Số và chuỗi nghiệp vụ (tỷ lệ, ngưỡng, khổ giấy) đặt thành hằng số có tên hoặc cấu hình, không viết thẳng giữa code.
- Quy ước theo chuẩn chung của thế giới cho từng ngôn ngữ (vd Java theo Google Java Style, JS/TS theo ESLint + Prettier, Vue theo Vue Style Guide), tên và comment bằng **tiếng Anh**. Tên hàm, biến ngắn, rõ nghĩa. Comment ngắn, nói **vì sao**, chỉ ở chỗ người đọc lại cần để hiểu và bảo trì; không comment lại điều code đã nói rõ.

## 4. Tiền tệ và số chính xác
Chọn theo yêu cầu của doanh nghiệp và ghi vào CONSTRAINTS.md:
- **Dự án doanh nghiệp, ngoại tệ, tỷ giá, kế toán:** dùng **số thập phân chính xác** để không thất thoát: Java `BigDecimal`, database `NUMERIC(19,4)` hoặc `DECIMAL`, JS dùng thư viện như `decimal.js` hoặc `big.js`. **Không dùng `float`/`double`/`Number` cho tiền**: kiểu số thực nhị phân sai lệch ngầm (`0.1 + 0.2 = 0.30000000000000004`) và cộng dồn thành thất thoát.
- **Web đơn giản, chỉ VND, không chia nhỏ:** số nguyên đồng là đủ.
- Chưa rõ thuộc loại nào thì hỏi người quản lý, kèm đề xuất.
- **Làm tròn:** ghi rõ quy tắc (vd làm tròn nửa lên, đến đồng hoặc đến 2 số lẻ), làm tròn ở bước hiển thị hoặc bước chốt số theo quy định, không làm tròn từng bước giữa chừng. Chia đều nhiều kỳ thì **kỳ cuối nhận phần dư** để tổng khớp tuyệt đối. Bài học: bảng trả góp từng hiện dư nợ cuối kỳ 475.000.001 đồng.
- Hiển thị bằng `Intl.NumberFormat` (hoặc tương đương), không tự ghép dấu chấm.

## 5. CONSTRAINTS.md của dự án
Mỗi dự án có `CONSTRAINTS.md` ở gốc: luật riêng mà mọi agent phải theo, ngắn, kiểm được. Mẫu ở `references/mau-constraints.md`. Agent đọc trước khi code; gặp luật mới người quản lý chốt thì đề xuất thêm vào, người quản lý duyệt.

## 6. Bẫy hay gặp
Đọc `references/bay-hay-gap.md` trước khi tự kiểm. Quy tắc chung: **kết quả 0, rỗng, âm, hoặc lệch tổng cho một thứ có thật là đáng ngờ**; kiểm lại ý nghĩa nghiệp vụ trước khi tin.

## 7. Tự kiểm trước khi báo xong
Thiếu một mục là chưa xong, không ghi "xong":
1. Test xanh, độ phủ trên 80% cho logic nghiệp vụ và API/controller.
2. Lint và kiểm kiểu không lỗi, build được.
3. **Chạy thật:** mở luồng trên trình duyệt hoặc gọi API thật với dữ liệu giống thật, xem con số hiển thị có đúng nghĩa nghiệp vụ không (có giao diện thì chụp màn hình theo skill giao-dien).
4. Đi lại từng tiêu chí và từng ca test của thẻ, ghi đạt hay không.
5. Soát bẫy hay gặp.
6. Chỉ sửa file trong danh sách của thẻ.

Báo lại theo mẫu trong thẻ việc: tiêu chí và ca test đạt / chưa, lệnh đã chạy và kết quả (dán số liệu độ phủ), file đã sửa, giả định còn lại.
