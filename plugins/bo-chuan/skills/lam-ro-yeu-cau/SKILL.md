---
name: lam-ro-yeu-cau
description: Làm rõ yêu cầu của khách trước khi giao việc lập trình web. Dùng khi nhận một yêu cầu mới hoặc thay đổi (vd "làm trang quản lý đơn hàng", "thêm xuất Excel", "xuất file để in"), trước khi thiết kế hay viết code. Kết quả là phiếu hỏi để người quản lý mang đi hỏi khách, hoặc bản tóm tắt đã đủ rõ để người quản lý duyệt.
---

# Làm rõ yêu cầu

Agent quản lý dùng skill này trước khi giao bất kỳ việc nào. Agent không hỏi khách trực tiếp: agent soạn phiếu hỏi, người quản lý mang đi hỏi.

## 1. Đọc yêu cầu, tìm chỗ phải đoán
Đọc yêu cầu và thử hình dung lời giải: có những màn hình nào, mỗi màn hình hiện gì, dữ liệu đi qua những bước nào, đầu ra là gì. Chỗ nào phải đoán mới hình dung được là chỗ cần hỏi.

## 2. Bốn nhóm câu hỏi luôn xét
Với mỗi nhóm, chỉ hỏi khi yêu cầu chưa trả lời. Mỗi câu ghi kèm **vì sao hỏi** (câu trả lời làm thay đổi cái gì trong lời giải).

| Nhóm | Hỏi gì | Vì sao |
|---|---|---|
| Lĩnh vực | Khách làm ngành gì, bán gì | Loại hàng, loại khách khác nhau thì màn hình và thống kê sau này khác nhau |
| Thông tin | Muốn thấy thông tin gì; thông tin nào thật sự quan trọng | Quyết định cột, bộ lọc, thứ tự ưu tiên trên màn hình |
| Nghiệp vụ | Kể quy trình thật từ đầu đến cuối (vd đơn được tạo, giao, đổi trạng thái thế nào) | Quyết định trạng thái, theo dõi chi tiết, ai làm bước nào |
| Đầu ra | Với mỗi chức năng xuất (Excel, PDF, file in…): xuất toàn bộ hay tóm gọn, bỏ phần nào | Quyết định nội dung file, tránh làm lại |

## 3. Thông số chuyên ngành: đề xuất trước, khách chốt rồi mới làm
Khi đầu ra phải dùng được ngay ở thiết bị hoặc nghiệp vụ của một ngành (file in, máy in, tem nhãn, hoá đơn, chuẩn của ngành y tế, kế toán…):
- **Không** làm trước với thông số chung chung rồi tính sau. Bài học thật: làm file TIF cho máy in với thông số chung, in ra không đẹp, phải làm lại.
- Tự tìm hiểu thông số thường dùng của ngành đó, soạn **bản đề xuất thông số** (vd độ phân giải, hệ màu, khổ, lề) kèm câu hỏi xin thông số thật từ khách (vd model máy in, mẫu file đang dùng).
- Ghi rõ: chỉ bắt đầu làm sau khi khách chốt thông số.

## 4. Khi nào đủ rõ
Đủ rõ khi đã hiểu **nghiệp vụ** và **mong muốn** của khách, tức là hình dung được lời giải và giao diện tổng quan:
- Các màn hình chính và thông tin trên từng màn hình.
- Luồng nghiệp vụ chính.
- Đầu ra (file, báo cáo) và thông số nếu là việc chuyên ngành.

Đủ rõ **không** có nghĩa là hết mọi chi tiết. Phân biệt hai loại chỗ phải đoán:
- **Chỗ lớn, phải hỏi khách:** đoán sai thì lời giải hoặc giao diện tổng quan đổi hẳn: không biết khách bán gì, không biết quy trình, không biết thông tin nào quan trọng, thông số chuyên ngành chưa có.
- **Chi tiết, không hỏi khách:** đoán sai thì chỉ sửa nhỏ (cách sắp xếp, định dạng ngày, tên file, màu nhấn, trường hợp hiếm). Agent tự chọn phương án hợp lý, ghi thành **giả định** trong bản tóm tắt để người quản lý duyệt.

Chỉ ra phiếu hỏi khách khi còn chỗ lớn. Khách đã trả lời đủ 4 nhóm ở mục 2 thì coi là đủ rõ, dù vẫn nghĩ ra thêm câu hỏi được.

Cân theo cỡ việc: việc nhỏ chỉ đổi giao diện (màu, chữ, vị trí nút) thì không hỏi về ngành hay nghiệp vụ; nếu cần, ghi giả định (vd màu lấy theo màu chính đang dùng trong code) rồi chuyển người quản lý duyệt.

## 5. Đầu ra
**Chưa đủ rõ → phiếu hỏi khách**, lưu `docs/yeu-cau/phieu-hoi-<yyyymmdd>.md`:
- Một dòng tóm tắt yêu cầu như đang hiểu.
- Câu hỏi theo 4 nhóm trên (bỏ nhóm đã rõ), mỗi câu có "vì sao hỏi". Câu hỏi về thông số chuyên ngành kèm bản đề xuất.
- Viết bằng lời của khách, không dùng từ kỹ thuật.

**Đủ rõ → bản tóm tắt yêu cầu** để người quản lý duyệt, lưu `docs/yeu-cau/<yyyymmdd>-<ten>.md`: phác thảo lời giải theo mục 4, mỗi điểm ghi nguồn (khách nói, hoặc giả định của agent). Giả định để thành danh sách riêng cho người quản lý gật hoặc sửa.

Phiếu hỏi khách không giới hạn số câu. Câu hỏi agent gửi cho **người quản lý** thì tối đa 3 câu một lần, mỗi câu kèm phương án đề xuất.
