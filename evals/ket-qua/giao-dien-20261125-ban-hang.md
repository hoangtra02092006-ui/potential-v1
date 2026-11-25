# Kết quả bộ đề giao-dien sau khi thêm luật web bán hàng (25/11/2026)

Nguồn sửa: lần thử plugin trên web thời trang 25/11 (sổ ghi chép ở `/mnt/project-files/web-thoi-trang/so-ghi-chep-plugin.md`). Thêm câu 8, 9; chạy lại câu 1 và 7 để kiểm sửa không làm hỏng luật cũ.

| Câu | Lượt 1 | Lượt 2 |
|---|---|---|
| 1. Quản lý đơn cà phê | ĐẠT | |
| 7. Trang marketing chưa có hình mẫu và ảnh | TRƯỢT | ĐẠT |
| 8. Web bán hàng chưa có hình mẫu (mới) | ĐẠT | ĐẠT |
| 9. Soát trang bán hàng đã dựng (mới) | ĐẠT | |

Câu 7 lượt 1 trượt vì luật mới "dựng 2-3 hướng thay vì gửi link" làm agent bỏ luôn bước hỏi hình mẫu và không nêu trang thật nào. Sửa: vẫn hỏi người quản lý có hình mẫu không, đồng thời đề xuất dựng 2-3 hướng, mỗi hướng ghi rõ học từ trang thật nào.

Lỗi của bộ chạy đề: ở lượt 1, agent làm câu 8 ghi tình huống giả vào bộ nhớ chung của dự án (file `du-an-web-giay-nu.md`). Sửa `chay-bo-de.sh`: bỏ biến môi trường bộ nhớ cho agent làm bài và agent chấm. Lượt 2 không còn ghi.

## Chấm lượt cuối

### Câu 1

- **Tiêu chí 1: ĐẠT.** Câu trả lời xếp web là "công cụ quản lý nội bộ", chọn phong cách gọn, dày thông tin nhưng vẫn chỉn chu, và nói rõ ít hiệu ứng, không 3D, không gradient; chuyển động chỉ 150–200ms và tắt được khi máy bật chế độ giảm chuyển động.
- **Tiêu chí 2: ĐẠT.** Có token nháp cụ thể: đúng một màu nhấn nâu rang #8A4B2A, chữ Be Vietnam Pro, thang cỡ 12/14/16/20/24, khoảng cách 4/8/12/16/24/32. Thư mục cũng có sẵn `DESIGN.md` ghi rõ là bản nháp, đủ các mục này. Có một chỗ lệch: `DESIGN.md` dùng màu nhấn #7A4419, mẫu tham khảo là Stripe và Linear, còn câu trả lời ghi #8A4B2A với Linear và Airtable, lại nói "sẽ đưa vào DESIGN.md" như thể file chưa có. Chỗ lệch này không làm trượt tiêu chí nhưng cần thống nhất lại.
- **Tiêu chí 3: ĐẠT.** Nuxt UI v3 được nêu là "đề xuất", kèm lý do: chỉnh màu và cỡ chữ qua biến CSS để theo token của dự án, có sẵn các thành phần cần dùng, và bảng dựa trên TanStack Table nên sau này dễ thêm cột, sắp xếp hay chọn nhiều đơn. Cả bản đề xuất đặt trong khung "chờ duyệt".
- **Tiêu chí 4: ĐẠT.** Màn danh sách có đủ trạng thái đang tải (dòng xám giữ chỗ), rỗng (không có đơn khớp lọc, kèm nút xoá lọc) và lỗi (kèm nút thử lại), màn sửa đơn có báo lỗi ngay tại ô. Màn shipper trên điện thoại 390px được mô tả riêng: thẻ to, nút 48px dính đáy, chữ từ 16px, độ tương phản cao để đọc ngoài nắng. Còn hở hai chỗ: chỉ nói lỗi khi xuất Excel mà chưa nói lỗi khi tải danh sách, và màn shipper chưa nói trạng thái tải, rỗng, lỗi.

KẾT QUẢ: ĐẠT

### Câu 9

**Chấm câu trả lời soát trang chủ web bán áo**

Thư mục làm bài trống, không có ảnh chụp hay file nào để mở. Vì vậy tôi chấm hoàn toàn trên đoạn trích và câu trả lời của agent.

- **Tiêu chí 1 — ĐẠT:** Agent chỉ ra đủ bốn nét AI. Đó là nút viên thuốc chữ hoa giãn chữ (mục 4), dải số `499K | 30 | 15:00` không rõ nghĩa (mục 3.2), hàng icon kèm vạch dọc (mục 4) và ảnh Unsplash mỗi ảnh một nền (mục 3.4).
- **Tiêu chí 2 — ĐẠT:** Agent nêu Anton vẽ sai chữ hoa hai dấu (CUỐI, TUẦN) và `line-height:.9` cắt dấu ở cỡ 96px (mục 1.1–1.2). Agent cũng yêu cầu gõ thử `Ố Ầ Ứ Ặ Ẫ Ở` ở cỡ lớn nhất rồi chụp ảnh lại, và đòi ảnh tiêu đề có đủ dấu ở cả hai khổ (mục C).
- **Tiêu chí 3 — ĐẠT:** Agent chỉ ra lưới cao cố định 900px dùng `1fr` trần sẽ tràn đè. Hướng sửa là bỏ chiều cao cố định, hoặc dùng `minmax(0,1fr)` nếu buộc phải giữ (mục 2.1). Agent đề xuất đo bằng Playwright với `getBoundingClientRect` và `scrollHeight > clientHeight`. Agent cũng nêu thẻ sản phẩm thiếu giá, màu và size (mục 3.1).
- **Tiêu chí 4 — ĐẠT:** Agent bác lời "nhìn ổn" và yêu cầu chụp thêm khổ 390px. Agent cũng yêu cầu chạy `copy-lint.mjs` và đi đủ danh sách kiểm giao diện trước khi đưa người quản lý duyệt, rồi giao một reviewer độc lập soát. Agent không gọi tên "danh sách luật Vercel", nhưng có yêu cầu chạy công cụ soát theo danh sách luật, nên vẫn đạt ý chính.

**KẾT QUẢ: ĐẠT**

### Câu 7

Tôi đã tự mở `docs/giao-dien-de-xuat.md` để đối chiếu. File có thật, nội dung khớp với câu trả lời của agent.

- **Tiêu chí 1 (hình mẫu): ĐẠT.** Câu hỏi 1 xin người quản lý hình mẫu, và agent tự đề xuất 3 hướng A/B/C. Mỗi hướng ghi rõ học phần nào của trang nào: Nike cho chữ khổng lồ, Apple cho phần chọn phiên bản và nút mua, Tesla, Lamborghini. Agent cũng nói thật là chưa mở được kho tham chiếu và sẽ đọc lại trước khi dựng.
- **Tiêu chí 2 (thiếu ảnh sản phẩm): ĐẠT.** Ngay đoạn mở đầu, agent đã nêu thiếu ảnh chai là việc chặn bước dựng. Bảng 4 cách có cột "Cái giá": khách chụp mới, file bao bì, ảnh AI (tốn phí, cần duyệt, chỉ để chọn hướng), mô hình 3D (tốn thời gian, trang tải nặng, thêm khoảng 2-3 ngày).
- **Tiêu chí 3 (không dùng khung ảnh xám): ĐẠT.** Agent từ chối khung ảnh xám và nói rõ lý do. Trong lúc chờ ảnh thật, agent dùng chai minh hoạ bằng AI, có ghi nhãn "ảnh minh hoạ".
- **Tiêu chí 4 (câu hỏi cho người quản lý): ĐẠT.** Có đúng 3 câu hỏi, câu nào cũng có đề xuất sẵn để người quản lý chỉ cần gật hoặc sửa.

KẾT QUẢ: ĐẠT

### Câu 8

Kết quả chấm từng tiêu chí (tôi đã mở file `docs/ke-hoach-giao-dien.md` và đối chiếu, nội dung khớp với câu trả lời của agent):

1. **Loại web và các khối bắt buộc: ĐẠT.** Agent xếp đúng là web bán hàng, đủ các khối bắt buộc:
   - Trang chủ có "Mua theo size".
   - Danh mục lọc được size, màu, giá.
   - Chi tiết có chọn màu, size 35-40, link "Bảng size" và nút thêm giỏ.
   - Giỏ hàng đủ ảnh, màu, size, số lượng.
   - Thẻ sản phẩm có giá, chấm màu và các size còn hàng.
   - Agent nói rõ không dùng bố cục mỗi khối một màn hình.
2. **Nguồn tham khảo cụ thể: ĐẠT.** Agent nêu ba bản trong awesome-design-md và phần lấy từ mỗi bản: Nike cho thẻ, lưới và ô chiến dịch; Airbnb cho thẻ nhiều thông tin, thanh lọc và chip lọc; Apple cho trang chi tiết và chọn màu, size. Agent cũng tự nhận là chưa đọc kỹ các bản này.
3. **Dựng hướng, ảnh thiết kế trước khi code, so cạnh: ĐẠT.** Bước 2 dựng 2 hướng A và B để người quản lý chọn. Bước 3 làm ảnh thiết kế trước khi dựng màn mẫu. Bước 5 so cạnh với ảnh thiết kế, sửa tối đa 3 vòng.
4. **Ảnh khác nền và thử phông tiếng Việt: ĐẠT.** Agent nêu rõ ảnh khác nền là vấn đề và đưa cách xử lý:
   - Tách nền về một nền chung, cùng khung 4:5.
   - Ảnh nào không đạt thì lập danh sách để shop chụp lại.
   - Hỏi người quản lý và báo sớm nếu ít ảnh đạt.
   - Thử phông bằng các chữ hoa hai dấu `Ố Ầ Ứ Ặ Ẫ Ở` ở cỡ lớn nhất.

KẾT QUẢ: ĐẠT
