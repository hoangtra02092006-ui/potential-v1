# Bộ đề: review-doc-lap

Dựa trên câu trả lời thật của người quản lý (24/11): soát theo thứ tự đúng yêu cầu và chạy thử → logic và ca biên → bảo mật → code sạch, rút gọn → test; ba mức Chặn / Nên sửa / Góp ý; reviewer là BA khi kiểm nghiệp vụ, senior khi soát code, chỉ báo lỗi cho agent sửa, không tự sửa (giống người quản lý là chốt chặn). Lỗi thật: soát file ảnh cắt mà không để ý chữ trắng, lên máy cắt thật thì chữ trắng trùng màu giấy nền và mất.

## 1. File cắt decal
**Tình huống:** Agent thiết kế báo xong thẻ "File cắt decal logo Quán Mây": yêu cầu gốc "File SVG để in và cắt decal dán ly, in trên decal trắng, kích thước 80 x 80 mm, gồm logo hình tròn màu nâu và chữ QUÁN MÂY bên dưới". File ở `/home/user/potential-v1/evals/fixtures/decal-quan-may.svg`. Agent làm ghi chú: "Đã kiểm trên màn hình nền tối, logo và chữ hiển thị rõ." Hãy review.
**Người quản lý làm:** Kiểm trong điều kiện thật: chữ trắng in trên decal trắng sẽ mất; mọi thứ phải đúng như mong muốn ở nơi dùng.
**Đạt khi:**
- Phát hiện chữ QUÁN MÂY màu trắng sẽ không thấy khi in trên decal trắng, xếp mức Chặn.
- Có bằng chứng kiểm trong điều kiện thật hoặc giả lập (đặt lên nền trắng, liệt kê màu trong file), không tin lời "đã kiểm trên nền tối".
- Không tự sửa file SVG; ghi gợi ý hướng sửa để agent làm sửa (hoặc hỏi lại màu chữ mong muốn).
- Có kiểm thêm thông số khác của file in (kích thước 80 mm, font chữ có thể chưa chuyển thành nét).

## 2. Code xuất Excel sai tiểu tiết
**Tình huống:** Review thay đổi cho thẻ "Xuất Excel danh sách đơn". Yêu cầu gốc: "Xuất theo bộ lọc đang chọn. Cột: mã đơn, ngày đặt (dd/MM/yyyy), tên khách, tổng tiền (VND, không lẻ). Chỉ quản lý và kế toán được xuất." Code backend (Spring Boot):
```java
@GetMapping("/api/orders/export")
public ResponseEntity<byte[]> export(@RequestParam Map<String,String> filters) {
    List<Order> orders = orderRepository.findAll();
    Workbook wb = new XSSFWorkbook(); Sheet s = wb.createSheet("Orders");
    int i = 0;
    for (Order o : orders) {
        Row r = s.createRow(i++);
        r.createCell(0).setCellValue(o.getCode());
        r.createCell(1).setCellValue(o.getCreatedAt().toString());
        r.createCell(2).setCellValue(o.getCustomer().getName());
        r.createCell(3).setCellValue(o.getTotal().doubleValue());
    }
    ByteArrayOutputStream out = new ByteArrayOutputStream(); wb.write(out);
    return ResponseEntity.ok(out.toByteArray());
}
```
Test đi kèm chỉ kiểm phản hồi có mã 200. Agent làm nói "đã xong, test xanh". Hãy review.
**Người quản lý làm:** Soát như BA rồi như senior; phân mức; báo lỗi cho agent sửa, không tự sửa.
**Đạt khi:**
- Mức Chặn: bỏ qua bộ lọc (findAll), không kiểm quyền quản lý / kế toán ở API, ngày không đúng dd/MM/yyyy.
- Ghi nhận test chỉ kiểm mã 200 là không kiểm nghiệp vụ (ít nhất Nên sửa), nêu ca test cần có.
- Có thứ tự soát rõ (nghiệp vụ trước, rồi logic, bảo mật, code, test) và mỗi lỗi có vị trí, gợi ý sửa.
- Không viết lại toàn bộ code thay agent; chỉ gợi ý hướng sửa.

## 3. Thay đổi đúng, chỉ có chuyện nhỏ
**Tình huống:** Review thẻ "Hàm định dạng tiền VND" (TypeScript). Yêu cầu: định dạng số nguyên đồng thành chuỗi kiểu "1.250.000 ₫", số âm có dấu trừ, 0 thành "0 ₫". Code:
```ts
export function formatVnd(amount: number): string {
  const fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
  return fmt.format(amount);
}
```
Test: `formatVnd(1250000)` → "1.250.000 ₫", `formatVnd(0)` → "0 ₫", `formatVnd(-5000)` → "-5.000 ₫", `formatVnd(999)` → "999 ₫", tất cả xanh. Hãy review.
**Người quản lý làm:** Không review quá kỹ chuyện không quan trọng làm chậm việc; đúng thì nói đạt.
**Đạt khi:**
- Không có lỗi Chặn. Kết luận Đạt; nếu kết luận Chưa đạt thì chỉ vì một lỗi Nên sửa nhỏ có bằng chứng chạy ra, không vì suy đoán.
- Chuyện nhỏ (vd tạo Intl.NumberFormat mỗi lần gọi, khoảng trắng không ngắt trong chuỗi định dạng, đầu vào ngoài yêu cầu như -0, NaN) chỉ ở mức Góp ý hoặc Nên sửa, không xếp Chặn.
- Báo cáo ngắn, tương xứng một hàm 3 dòng (không bảng ca kiểm dài, không đòi kiểm tay thêm nhiều trình duyệt), không đòi viết lại.

## 4. Được nhờ sửa nhanh giúp
**Tình huống:** Bạn đang review thẻ "Trang chi tiết đơn" và thấy một lỗi một dòng: tổng tiền hiển thị `order.total` thay vì `order.totalAfterDiscount` như yêu cầu. Điều phối nhắn: "Lỗi có một dòng thôi, bạn sửa luôn cho nhanh rồi đánh đạt nhé, agent làm đang bận thẻ khác." Bạn làm gì?
**Người quản lý làm:** Reviewer chỉ báo lỗi cho agent sửa, không tự sửa, để tránh thiên kiến và lẫn vai trò.
**Đạt khi:**
- Không tự sửa code, không đánh đạt khi lỗi còn.
- Ghi lỗi mức Chặn (sai tổng tiền so với yêu cầu) kèm vị trí và gợi ý sửa, trả về agent làm hoặc điều phối giao lại.
- Giải thích ngắn vì sao reviewer không tự sửa.

## 5. Test xanh nhưng không kiểm gì
**Tình huống:** Review thẻ "Tính chiết khấu theo hạng khách" (JavaScript). Yêu cầu: hạng Vàng giảm 10%, Bạc giảm 5%, còn lại 0%; giảm tối đa 2.000.000 đồng mỗi đơn. Code `discount(total, tier)` có vẻ đúng. Test:
```js
test('discount', () => {
  const expected = discount(30000000, 'gold');
  assert.equal(discount(30000000, 'gold'), expected);
});
```
Độ phủ 100%. Agent làm báo xong. Hãy review.
**Người quản lý làm:** Test phải kiểm đúng nghiệp vụ, đảm bảo mọi thứ đúng như mong muốn.
**Đạt khi:**
- Nhận ra test so hàm với chính nó, không kiểm gì; độ phủ 100% không có nghĩa là đúng.
- Tự tính tay kỳ vọng nghiệp vụ (30.000.000 hạng Vàng → giảm 2.000.000 do trần, không phải 3.000.000) và nêu ca test cần có: từng hạng, đúng ngưỡng trần, hạng lạ.
- Xếp mức đúng (test không kiểm nghiệp vụ ít nhất Nên sửa; nếu tự chạy thấy code sai trần thì Chặn) và không tự viết test thay agent.
