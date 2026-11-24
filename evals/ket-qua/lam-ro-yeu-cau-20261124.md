# Kết quả chạy thử lam-ro-yeu-cau (24/11/2026)

Lượt 1: đạt 3/5. Trượt câu 2 và 5 vì agent hỏi quá nhiều (câu 2 ra phiếu 15 câu dù khách đã nói đủ; câu 5 hỏi 5 câu cho việc đổi màu nút). Đã sửa mục 4 của skill: phân biệt chỗ lớn phải hỏi khách và chi tiết agent tự ghi thành giả định.

Lượt 2 (bản dưới đây): đạt 5/5. Agent làm bài không thấy đề; người chấm là một agent riêng.

---

## Câu 1

**Tình huống:** Khách nhắn: "Làm cho anh trang quản lý đơn hàng, có xuất Excel."

### Agent trả lời

Chị ơi, yêu cầu này chưa đủ rõ để làm, nên em chưa giao việc lập trình. Em chưa biết khách bán gì, đơn hàng đi qua những bước nào, cần xem thông tin gì, và file Excel dùng để làm gì. Đoán sai mấy điểm này là phải làm lại cả màn hình lẫn file xuất. Em đã soạn phiếu hỏi để chị mang đi hỏi khách, lưu ở `docs/yeu-cau/phieu-hoi-20261124.md`. Nội dung đầy đủ:

---

# Phiếu hỏi khách – Màn quản lý đơn hàng (24/11/2026)

**Yêu cầu như đang hiểu:** Anh cần một trang web để xem và theo dõi đơn hàng, và xuất danh sách đơn ra file Excel.

## 1. Lĩnh vực
1. Anh đang kinh doanh gì, bán mặt hàng gì? Anh bán cho khách lẻ hay cho cửa hàng, doanh nghiệp?
   - *Vì sao hỏi:* Mỗi loại hàng có thông tin đơn khác nhau (size/màu, số lô, hạn dùng…), và việc thống kê sau này cũng khác.
2. Đơn hàng đến từ đâu (nhập tay, Shopee/TikTok, website, Facebook, Zalo…)? Mỗi ngày khoảng bao nhiêu đơn?
   - *Vì sao hỏi:* Câu trả lời quyết định đơn được nhập tay hay lấy tự động, và trang phải xử lý được bao nhiêu đơn.

## 2. Thông tin
3. Khi mở trang, anh muốn thấy ngay những thông tin gì của mỗi đơn (mã đơn, ngày đặt, tên khách, số điện thoại, địa chỉ, sản phẩm, số lượng, tổng tiền, đã thanh toán chưa, trạng thái giao…)? Trong đó 3–5 thông tin nào quan trọng nhất?
   - *Vì sao hỏi:* Câu trả lời quyết định các cột hiện trên màn hình và cột nào đứng trước.
4. Anh hay tìm hoặc lọc đơn theo gì (ngày, khách, trạng thái, nhân viên…)?
   - *Vì sao hỏi:* Câu trả lời quyết định các ô tìm kiếm và bộ lọc.
5. Hiện anh đang quản lý đơn bằng gì (sổ, Excel, phần mềm khác)? Nếu có, anh gửi giúp một file hoặc ảnh mẫu.
   - *Vì sao hỏi:* Cách anh đang làm cho thấy thông tin nào thật sự cần. Có thể còn phải chuyển dữ liệu cũ sang trang mới.

## 3. Nghiệp vụ
6. Anh kể giúp một đơn hàng đi từ đầu đến cuối: ai tạo đơn, ai xác nhận, đóng gói hoặc sản xuất, giao hàng, thu tiền, rồi hoàn tất. Có trường hợp huỷ, đổi trả hay giao thiếu không?
   - *Vì sao hỏi:* Câu trả lời quyết định các trạng thái của đơn và cách theo dõi từng bước.
7. Có bao nhiêu người dùng trang này, mỗi người làm việc gì? Có ai chỉ được xem mà không được sửa không?
   - *Vì sao hỏi:* Câu trả lời quyết định cần những tài khoản nào và mỗi người được làm gì.
8. Anh có cần xem lại lịch sử thay đổi của đơn không (ai sửa gì, lúc nào)?
   - *Vì sao hỏi:* Câu trả lời quyết định có lưu lại các lần sửa đơn hay không.

## 4. Đầu ra – Xuất Excel
9. File Excel xuất ra để làm gì (gửi kế toán, gửi bên giao hàng, đối soát công nợ, báo cáo cho anh…)?
   - *Vì sao hỏi:* Mỗi mục đích cần nội dung file khác nhau.
10. Anh muốn xuất toàn bộ thông tin đơn hay chỉ một số cột? Mỗi sản phẩm trong đơn là một dòng riêng, hay mỗi đơn chỉ một dòng? Có cần dòng tổng cộng không?
    - *Vì sao hỏi:* Câu trả lời quyết định cách sắp xếp file, tránh phải làm lại.
11. Anh muốn xuất đúng những đơn đang lọc trên màn hình (ví dụ đơn trong tháng, đơn chưa thanh toán) hay lúc nào cũng xuất tất cả?
    - *Vì sao hỏi:* Câu trả lời quyết định cách bấm xuất.
12. Nếu file Excel phải nhập vào một phần mềm khác (phần mềm kế toán, hãng vận chuyển như GHN, GHTK, Viettel Post…), anh gửi giúp **file mẫu** của phần mềm đó.
    - *Vì sao hỏi:* Phần mềm khác thường bắt đúng tên cột, thứ tự cột và cách ghi ngày, ghi tiền. **Em chỉ làm phần xuất Excel sau khi có file mẫu và anh chốt.**

---

Khi khách trả lời, chị gửi lại cho em. Em sẽ soạn bản tóm tắt yêu cầu gồm các màn hình chính, luồng xử lý đơn và nội dung file Excel, kèm danh sách giả định để chị duyệt trước khi giao lập trình.

### Chấm

**Chấm câu trả lời của agent: tình huống "trang quản lý đơn hàng, có xuất Excel"**

- **Tiêu chí 1. Không bắt tay thiết kế hay code, ra phiếu hỏi: ĐẠT.** Agent nói rõ chưa giao việc lập trình và chỉ đưa ra phiếu hỏi. Agent cũng hẹn chỉ soạn bản tóm tắt yêu cầu sau khi khách trả lời và chị duyệt.
- **Tiêu chí 2. Có đủ 4 ý: ĐẠT.** Phiếu có đủ cả 4 ý:
  - Mặt hàng, ngành: câu 1.
  - Thông tin hiển thị và mức quan trọng: câu 3, có yêu cầu chọn 3–5 thông tin quan trọng nhất.
  - Quy trình giao đơn: câu 6, đi từ tạo đơn, xác nhận, đóng gói, giao hàng, thu tiền đến huỷ và đổi trả.
  - Phạm vi file Excel: câu 9–12, gồm mục đích, cột, cách chia dòng, phạm vi xuất và file mẫu.
- **Tiêu chí 3. Mỗi câu có lý do hỏi: ĐẠT.** Cả 12 câu đều có dòng "Vì sao hỏi", và mỗi lý do nói rõ câu trả lời sẽ quyết định phần nào của trang.

Ghi chú (không ảnh hưởng kết quả): agent nói đã lưu phiếu ở `docs/yeu-cau/phieu-hoi-20261124.md`. Phần chấm này không kiểm tra file đó có tồn tại hay không.

KẾT QUẢ: ĐẠT

---

## Câu 2

**Tình huống:** Khách bán cà phê hạt cho quán. Cần trang quản lý đơn: hiện mã đơn, tên quán, sản phẩm, số kg, tổng tiền, trạng thái; quan trọng nhất là trạng thái và ngày giao. Quy trình: sale tạo đơn → kho đóng gói → shipper giao → thu tiền khi giao, mỗi bước đổi trạng thái. Xuất Excel đúng các cột đang hiện, lọc theo khoảng ngày.

### Agent trả lời

Em đã chạy bước làm rõ yêu cầu. Khách đã trả lời đủ 4 nhóm cần hỏi (ngành hàng, thông tin cần thấy, quy trình, file xuất), nên **không cần gửi phiếu hỏi khách**. Em đã soạn bản tóm tắt yêu cầu để chị duyệt. Chưa có thiết kế hay code nào, vì phải chờ chị duyệt bản này trước.

File: `docs/yeu-cau/20261124-quan-ly-don-ca-phe.md`

---

# Tóm tắt yêu cầu: Màn quản lý đơn cà phê hạt

Ngày 24/11/2026, đang chờ chị duyệt. Ký hiệu nguồn: **[K]** là khách nói, **[GĐ-n]** là giả định của em.

**1. Ngành hàng:** bán sỉ cà phê hạt cho quán, tính theo kg. [K]

**2. Các màn hình chính**

*2.1 Danh sách đơn* (màn hình chính)
- Cột: mã đơn, tên quán, sản phẩm, số kg, tổng tiền [K].
- **Trạng thái** và **ngày giao** làm nổi bật, trạng thái có màu riêng [K].
- Mặc định xếp đơn có ngày giao gần nhất lên đầu [GĐ-4].
- Lọc theo khoảng ngày [K], tính theo **ngày giao** [GĐ-3]. Có thêm lọc theo trạng thái [GĐ-5].
- Nút **Xuất Excel** [K].

*2.2 Tạo và sửa đơn* (sale dùng)
- Nhập tên quán, sản phẩm, số kg, đơn giá, ngày giao. Tổng tiền tự tính bằng số kg × đơn giá [GĐ-2].
- Mã đơn tự sinh [GĐ-6].

*2.3 Đổi trạng thái*
- Mỗi dòng có 1 nút "bước tiếp theo" [K + GĐ-7].

**3. Quy trình** [K]

`Mới tạo (sale) → Đã đóng gói (kho) → Đang giao (shipper) → Đã giao & đã thu tiền (shipper)`

- Trạng thái chỉ đi tới, không lùi [GĐ-8].
- Thu tiền gộp vào bước giao [GĐ-9].
- Có thêm trạng thái Huỷ [GĐ-10].
- Lưu lại ai đổi trạng thái và lúc nào [GĐ-11].

**4. File Excel** [K]
- Xuất đúng các cột đang hiện, theo bộ lọc đang áp dụng.
- File .xlsx. Tổng tiền để dạng số để cộng được trong Excel, ngày dạng dd/mm/yyyy [GĐ-12].
- Việc này không cần thông số chuyên ngành, vì không in ấn hay làm tem nhãn.

**5. Danh sách giả định**

| # | Giả định | Nếu sai thì phải đổi gì |
|---|---|---|
| GĐ-1 | **Mỗi đơn chỉ có 1 sản phẩm** | Cần làm lại cách lưu dữ liệu, cách hiện danh sách và cách xuất Excel. Đây là giả định lớn nhất. |
| GĐ-2 | Sale tự nhập đơn giá, chưa có danh mục sản phẩm và danh sách quán | Thêm màn hình quản lý danh mục |
| GĐ-3 | Lọc khoảng ngày theo ngày giao | Đổi sang ngày tạo đơn, hoặc cho chọn cả hai |
| GĐ-4 → 7 | Cách xếp, lọc theo trạng thái, mẫu mã đơn `DH-yyyymmdd-001`, nút đổi trạng thái | Chỉ sửa nhỏ |
| GĐ-8 | Không lùi trạng thái, trừ quản lý sửa tay | Thêm nút lùi |
| GĐ-9 | Giao hàng và thu tiền là một bước | Tách thành "Đã giao – chưa thu" và "Đã thu tiền", thêm cột số tiền đã thu |
| GĐ-10 | Có trạng thái Huỷ (khách không nhắc) | Bỏ đi nếu thừa |
| GĐ-11 | Có đăng nhập, mỗi người một vai (sale, kho, shipper, quản lý), mỗi vai chỉ bấm được bước của mình | Nếu không cần phân quyền thì bỏ, làm nhanh hơn nhiều |
| GĐ-12 | Định dạng Excel như mục 4 | Chỉ sửa nhỏ |

**6. Chưa làm trong bản này** (khách chưa nhắc nên em không tự thêm): báo cáo doanh thu, công nợ của quán, tồn kho, in phiếu giao.

---

## 3 câu em cần chị chốt

1. **Một đơn có thể có nhiều loại hạt không?** Em đề xuất làm ngay từ đầu cho mỗi đơn có nhiều sản phẩm. Đơn sỉ cho quán thường đặt vài loại một lần, và nếu đổi về sau thì phải làm lại phần lõi. Chị muốn chắc thì có thể hỏi khách đúng một câu này.
2. **Có cần mỗi người đăng nhập riêng và chỉ bấm được bước của mình không?** Em đề xuất là có, vì khách chia việc rõ cho sale, kho và shipper. Nếu khách chỉ có 1–2 người dùng chung thì bỏ để làm nhanh hơn.
3. **Có trường hợp giao hàng rồi mà chưa thu được tiền không?** Em đề xuất tạm gộp giao và thu tiền làm một bước, đúng như khách tả, và thêm trạng thái Huỷ. Nếu hay gặp ca chưa thu được tiền thì em tách thành 2 trạng thái.

Các giả định khác chị chỉ cần gật hoặc sửa. Khi chị duyệt xong, em mới chuyển sang bước thiết kế.

### Chấm

# Kết quả chấm: Màn quản lý đơn cà phê hạt

**Tiêu chí 1. Kết luận rõ, không gửi phiếu hỏi khách: ĐẠT**
Agent nói thẳng là không cần phiếu hỏi khách. Agent chỉ hỏi chị 3 câu, câu nào cũng kèm đề xuất sẵn, nên chị chỉ cần gật hoặc sửa. Ở câu 1, agent có gợi ý "có thể hỏi khách đúng một câu" nhưng để chị quyết, không tự gửi phiếu.

**Tiêu chí 2. Có phác thảo màn hình, thông tin, luồng trạng thái và file Excel: ĐẠT**
Bản tóm tắt có đủ 3 màn hình (danh sách, tạo/sửa đơn, đổi trạng thái) với các cột khách nêu. Trạng thái và ngày giao được làm nổi bật. Luồng 4 bước theo đúng vai sale → kho → shipper. File Excel xuất đúng các cột đang hiện theo bộ lọc, kèm định dạng số và ngày.

**Tiêu chí 3. Không tự thêm chức năng như thể đã chốt: ĐẠT**
Các phần khách không nói đều được gắn nhãn giả định [GĐ], có cột "nếu sai thì phải đổi gì" và được đưa lên hỏi chị. Đó là đăng nhập phân quyền, trạng thái Huỷ, lọc theo trạng thái và lưu lịch sử đổi trạng thái. Mục 6 còn ghi rõ là không làm báo cáo doanh thu, công nợ hay tồn kho.

Vẫn còn 2 điểm sai sót nhỏ, không đủ để đánh trượt:
- **Lệch số giả định:** Mục 3 ghi "lưu ai đổi trạng thái" là GĐ-11, nhưng trong bảng thì GĐ-11 lại là đăng nhập phân quyền.
- **Đề xuất nghiêng về phía làm thêm:** Agent đề xuất có đăng nhập phân quyền và gọi đó là "đề xuất". Tuy chưa coi là đã chốt, nên để chị quyết hoàn toàn thì hơn.

**KẾT QUẢ: ĐẠT**

---

## Câu 3

**Tình huống:** Khách: "Làm chức năng xuất ảnh thiết kế ra file TIF để đưa thẳng lên máy in dùng luôn."

### Agent trả lời

Chị ơi, yêu cầu này chưa đủ rõ để bắt tay làm. Mình chưa biết khách in lên chất liệu gì, in bằng máy nào, file có cần thông số gì. Đây đúng là trường hợp xuất TIF chị từng gặp: làm theo thông số chung, in ra không đẹp, phải làm lại. Vì vậy em soạn phiếu hỏi để chị mang đi hỏi khách, chưa giao việc lập trình.

Phiếu đã lưu ở `docs/yeu-cau/phieu-hoi-20261124.md`. Nội dung đầy đủ:

---

# Phiếu hỏi khách: xuất ảnh thiết kế ra file TIF để in

**Đang hiểu:** Khách muốn bấm một nút trên web để tải ảnh thiết kế về dưới dạng file TIF, rồi đưa file đó vào máy in và in luôn, không phải chỉnh thêm bằng phần mềm khác.

**Còn phải hỏi:** chưa biết khách in lên chất liệu gì, bằng máy nào, và file đang gửi máy in hiện nay trông như thế nào. Đây là việc in ấn nên cần thông số chuẩn. **Chỉ bắt đầu làm khi khách đã chốt thông số ở mục 4.**

## 1. Lĩnh vực
**1.1. Anh/chị in thiết kế lên gì? (áo, cốc, giấy, decal, bạt, tem nhãn…) Ảnh in ra dùng để bán cho khách hay để dùng trong nội bộ?**
*Vì sao hỏi:* mỗi chất liệu dùng một cách in và một loại file khác nhau. Ví dụ in lên áo cần nền trong suốt, còn in lên giấy cần chừa thêm mép để cắt.

## 2. Thông tin
**2.1. Một file xuất ra chỉ có hình thiết kế thôi, hay cần thêm thông tin như mã đơn, tên khách, kích thước hoặc vạch cắt?**
*Vì sao hỏi:* để biết file có cần chừa chỗ ghi chữ hoặc vẽ đường cắt hay không.

**2.2. Mỗi lần xuất là một thiết kế, hay cần gom nhiều thiết kế vào một tấm để in một lượt cho đỡ tốn vật liệu?**
*Vì sao hỏi:* nếu phải gom nhiều thiết kế vào một tấm, cần làm thêm phần xếp hình. Việc đó lớn hơn hẳn so với xuất từng file.

## 3. Nghiệp vụ
**3.1. Anh/chị kể giúp các bước hiện nay, từ lúc có thiết kế đến lúc cầm sản phẩm in ra: ai làm thiết kế, ai xuất file, file chuyển sang máy in bằng cách nào (chép USB, gửi qua mạng, gửi cho xưởng in ngoài)?**
*Vì sao hỏi:* để biết nút xuất đặt ở màn hình nào, ai được bấm, và file cần tải về máy tính hay gửi thẳng tới đâu.

**3.2. Hiện nay file in đang làm bằng phần mềm gì (Photoshop, Illustrator, Corel…)? Bước nào đang mất công nhất?**
*Vì sao hỏi:* để biết chức năng mới thay được bước nào, và lấy file hiện có làm mẫu chuẩn khi so kết quả.

## 4. Đầu ra: thông số file in (quan trọng nhất)
**4.1. Anh/chị cho xin giúp:**
- Hãng và tên máy in (chụp ảnh tem dán trên máy cũng được).
- Tên phần mềm điều khiển máy in, nếu có (thợ in hay gọi là "RIP").
- **1–2 file TIF đang in ra đẹp** để dùng làm mẫu.

*Vì sao hỏi:* mỗi máy in và mỗi phần mềm điều khiển đòi thông số khác nhau. Nếu làm theo thông số chung chung thì có thể in ra bị nhạt màu, vỡ nét hoặc sai kích thước, rồi phải làm lại.

**4.2. Nếu chưa có file mẫu, bên em đề xuất thông số dưới đây. Anh/chị (hoặc thợ in) xem và sửa giúp dòng nào chưa đúng:**

| Thông số | Đề xuất | Ghi chú |
|---|---|---|
| Kích thước | Đúng kích thước in thật (cm), khách nhập hoặc chọn sẵn | Cần biết các khổ hay dùng |
| Độ nét | 300 dpi tại kích thước in thật | In khổ lớn xem từ xa (bạt, băng rôn) có thể chỉ cần 150 dpi |
| Hệ màu | **Chờ thợ in chốt.** Máy in phun hoặc in lên áo thường nhận màu RGB. Máy in offset hoặc nhà in thường đòi màu CMYK | Hệ màu sai là lý do hay gặp nhất khiến bản in lệch màu |
| Nền | Trong suốt nếu in lên áo hoặc decal; nền trắng nếu in lên giấy | Theo câu 1.1 |
| Chừa mép cắt | 3 mm mỗi cạnh nếu sản phẩm in xong cần cắt | Không cần nếu in lên áo |
| Lớp ảnh | Gộp thành một lớp | Để máy in đọc được ngay |
| Nén file | Nén LZW (không làm giảm chất lượng ảnh) | Giúp file nhẹ hơn |

**4.3. Thường in khổ lớn nhất bao nhiêu (ví dụ A3, 60×90 cm, cuộn khổ 1,6 m)?**
*Vì sao hỏi:* in khổ lớn ở 300 dpi thì file có thể nặng vài trăm MB. Khi đó bên em phải đổi cách xuất file, để trình duyệt không bị treo và máy chủ không quá tải.

---

**Bước tiếp theo:** chị mang phiếu đi hỏi khách. Câu 4.1 là quan trọng nhất. Nếu khách gửi được 1–2 file TIF đang in đẹp thì mình lấy thông số từ đó, đỡ phải đoán. Khách trả lời xong, em sẽ viết bản tóm tắt yêu cầu để chị duyệt. Sau khi chị duyệt bản tóm tắt mới giao việc lập trình.

### Chấm

- **Không bắt tay làm với thông số mặc định: ĐẠT.** Agent nói rõ yêu cầu "chưa đủ rõ để bắt tay làm" và "chưa giao việc lập trình", nên chỉ soạn phiếu hỏi khách.
- **Có bản đề xuất thông số cụ thể: ĐẠT.** Mục 4.2 có bảng thông số cụ thể: kích thước in thật, 300 dpi (150 dpi cho khổ lớn), nền trong suốt hoặc trắng, chừa mép 3 mm, gộp một lớp, nén LZW. Riêng hệ màu chưa chốt, nhưng agent có giải thích khi nào dùng RGB, khi nào dùng CMYK.
- **Hỏi thông số thật: ĐẠT.** Câu 4.1 xin hãng và tên máy in, phần mềm điều khiển máy in (RIP), và 1–2 file TIF đang in đẹp để làm mẫu. Câu 3.1 hỏi thêm trường hợp gửi file cho xưởng in ngoài.
- **Nói rõ chỉ làm sau khi khách chốt: ĐẠT.** Phiếu ghi đậm "Chỉ bắt đầu làm khi khách đã chốt thông số ở mục 4". Phần bước tiếp theo nói thêm: phải có bản tóm tắt được duyệt rồi mới giao việc lập trình.

KẾT QUẢ: ĐẠT

---

## Câu 4

**Tình huống:** Khách: "Thêm nút xuất hoá đơn PDF để gửi kế toán."

### Agent trả lời

Yêu cầu này chưa đủ rõ để giao việc, nên tôi đã soạn phiếu hỏi khách để chị mang đi hỏi. Tôi chưa viết code nào.

**Lý do chính:** "hoá đơn gửi kế toán" là việc của ngành kế toán. Hoá đơn VAT hợp lệ phải phát hành qua nhà cung cấp hoá đơn điện tử và có mã của cơ quan thuế. Một file PDF do phần mềm tự tạo không thay được hoá đơn VAT. Nếu khách thật sự cần phần mềm tự phát hành hoá đơn VAT thì việc này lớn hơn nhiều so với một nút bấm. Cần hỏi khách trước khi làm.

Tôi đã lưu phiếu tại `docs/yeu-cau/phieu-hoi-20261124.md`. Nội dung đầy đủ:

---

# Phiếu hỏi khách: Xuất hoá đơn PDF gửi kế toán

Ngày: 24/11/2026 · Trạng thái: **chờ khách trả lời, chưa bắt đầu làm**

**Yêu cầu như đang hiểu:** Thêm một nút trên phần mềm để xuất hoá đơn thành file PDF, rồi gửi file đó cho kế toán.

## A. Lĩnh vực
**1. Anh/chị đang bán hàng hay dịch vụ gì? Mỗi hoá đơn thường có khoảng bao nhiêu dòng hàng?**
*Vì sao hỏi:* Bán hàng hoá hay dịch vụ thì cột trên hoá đơn khác nhau (đơn vị tính, số lượng, thuế suất). Số dòng nhiều hay ít quyết định hoá đơn dài 1 trang hay nhiều trang.

## B. Thông tin
**2. Kế toán dùng file PDF này để làm gì?**
- (a) Để **xuất hoá đơn đỏ (hoá đơn VAT) thật** từ thông tin trong file, hoặc
- (b) Chỉ để **đối chiếu, lưu sổ**, còn hoá đơn VAT thật kế toán tự xuất ở phần mềm hoá đơn điện tử (Viettel, VNPT, MISA, …), hoặc
- (c) Muốn phần mềm **tự phát hành hoá đơn VAT** luôn.

*Vì sao hỏi:* Đây là câu quan trọng nhất. Theo quy định hiện hành, hoá đơn VAT hợp lệ phải phát hành qua nhà cung cấp hoá đơn điện tử, có mã của cơ quan thuế. Một file PDF tự tạo **không thay được hoá đơn VAT**. Nếu là (a) hoặc (b), chúng tôi làm "phiếu thông tin hoá đơn" dạng PDF. Nếu là (c), đây là việc lớn hơn nhiều: phải nối với nhà cung cấp hoá đơn điện tử của anh/chị.

**3. Trên file cần có những thông tin nào? Đánh dấu giúp những mục cần:**
- [ ] Thông tin bên bán (tên công ty, mã số thuế, địa chỉ)
- [ ] Thông tin bên mua (tên, mã số thuế, địa chỉ, email)
- [ ] Danh sách hàng: tên, đơn vị tính, số lượng, đơn giá, thành tiền
- [ ] Thuế suất VAT, tiền thuế, tổng tiền, số tiền bằng chữ
- [ ] Chiết khấu, giảm giá
- [ ] Hình thức thanh toán, đã thanh toán hay còn nợ
- [ ] Mã đơn hàng, ngày đơn
- [ ] Mục khác: …

*Vì sao hỏi:* Quyết định nội dung file. Thiếu thông tin thì kế toán phải hỏi lại, thừa thì file rối.

## C. Nghiệp vụ
**4. Anh/chị kể giúp từ lúc có đơn đến lúc kế toán nhận được file: ai bấm nút xuất, xuất lúc nào (khi tạo đơn, khi giao xong, khi khách trả tiền), rồi gửi cho kế toán bằng cách nào (tải về rồi gửi Zalo/email, hay phần mềm tự gửi email)?**
*Vì sao hỏi:* Quyết định nút đặt ở màn hình nào, ai được bấm, và có cần chức năng tự gửi email hay không.

**5. Mỗi lần xuất một hoá đơn, hay cần xuất nhiều hoá đơn một lúc (vd tất cả đơn trong tháng để kế toán chốt sổ)?**
*Vì sao hỏi:* Xuất từng cái và xuất hàng loạt là hai cách làm khác nhau (một file mỗi đơn, hay gộp/nén nhiều file).

**6. Đơn đã xuất hoá đơn mà sau đó bị sửa hoặc huỷ thì xử lý thế nào? Có cần đánh dấu "đã xuất cho kế toán" không?**
*Vì sao hỏi:* Tránh kế toán cầm bản cũ, sai số liệu.

## D. Đầu ra và thông số
**7. Anh/chị gửi giúp 1 mẫu hoá đơn (hoặc phiếu) kế toán đang dùng** (ảnh chụp hoặc file). Nếu chưa có mẫu, chúng tôi đề xuất như sau, anh/chị gật hoặc sửa:

| Mục | Đề xuất |
|---|---|
| Khổ giấy | A4 đứng, lề 15 mm |
| Bố cục | Tiêu đề và thông tin bên bán ở trên, thông tin bên mua, bảng hàng, tổng tiền và số tiền bằng chữ, chữ ký người lập ở cuối |
| Logo | Có, ở góc trên trái (anh/chị gửi file logo) |
| Ngôn ngữ, tiền tệ | Tiếng Việt, VNĐ, dấu chấm phân cách hàng nghìn (vd 1.250.000) |
| Tên file | `HD_<mã đơn>_<ngày>.pdf` |
| In được | Đen trắng vẫn rõ, in ra đúng 1 trang A4 nếu ít hơn khoảng 20 dòng hàng |
| Tiêu đề | "PHIẾU THÔNG TIN HOÁ ĐƠN" (không ghi "Hoá đơn GTGT", để tránh nhầm với hoá đơn VAT thật) |

*Vì sao hỏi:* Kế toán thường đã quen một mẫu. Làm theo mẫu chung rồi phải làm lại thì tốn công cả hai bên.

**Chúng tôi chỉ bắt đầu làm sau khi anh/chị chốt câu 2 và mẫu ở câu 7.**

---

**Chị cần trả lời giúp tôi 2 câu:**
1. **Khách này thuộc dự án nào?** Tin nhắn không ghi tên dự án, và thư mục làm việc hiện tại chưa có code. Tôi đề xuất: chị cho tôi tên dự án hoặc link repo. Khi có, tôi xem dự án đã có sẵn những thông tin nào, rồi bỏ khỏi phiếu những câu mà code đã trả lời được.
2. **Phiếu này đã ổn để gửi khách chưa?** Tôi đề xuất gửi nguyên văn. Nếu chị đã biết khách bán gì thì bỏ câu 1 trước khi gửi.

### Chấm

**Chấm theo từng tiêu chí**

- **Tiêu chí 1: Hỏi mẫu hoặc quy định hoá đơn khách đang dùng, không tự chế mẫu rồi làm.** ĐẠT. Câu 7 xin khách gửi mẫu kế toán đang dùng, câu 2 hỏi rõ quy định về hoá đơn VAT, và mẫu đề xuất chỉ để khách gật hoặc sửa, đồng thời agent ghi rõ chỉ bắt đầu làm khi khách đã chốt câu 2 và câu 7.
- **Tiêu chí 2: Hỏi phạm vi nội dung (từng đơn hay gộp, thông tin nào).** ĐẠT. Câu 5 hỏi xuất từng hoá đơn hay nhiều hoá đơn một lúc, còn câu 3 có danh sách các mục thông tin để khách đánh dấu.

KẾT QUẢ: ĐẠT

---

## Câu 5

**Tình huống:** (Web quản lý đơn đã chạy, code có sẵn.) Khách: "Nút Lưu ở màn sửa đơn đang màu xám, khó thấy, đổi sang màu chính của web giúp anh."

### Agent trả lời

Chị ơi, đây chỉ là việc đổi giao diện nên em **không soạn phiếu hỏi khách**. Em đã viết bản tóm tắt yêu cầu để chị duyệt, lưu ở `docs/yeu-cau/20261124-mau-nut-luu.md`. Toàn bộ nội dung như sau.

---

# Đổi màu nút Lưu ở màn sửa đơn

Ngày: 24/11/2026 · Trạng thái: **chờ người quản lý duyệt**

## Yêu cầu
Khách: "Nút Lưu ở màn sửa đơn đang màu xám, khó thấy, đổi sang màu chính của web giúp anh."

Việc nhỏ, chỉ đổi giao diện. Không cần hỏi khách thêm.

## Lời giải
| Điểm | Nội dung | Nguồn |
|---|---|---|
| Màn hình | Màn sửa đơn, chỉ nút Lưu | Khách nói |
| Thay đổi | Nút Lưu đổi từ xám sang màu chính của web | Khách nói |
| Màu chính | Lấy màu chính đang khai báo trong code (biến màu hoặc theme), không thêm mã màu mới | Giả định 1 |
| Cách đổi | Dùng kiểu nút chính có sẵn của web (vd `primary`), không tô màu riêng cho một nút | Giả định 2 |
| Phạm vi | Quét các màn tạo/sửa khác (tạo đơn, sửa khách hàng...). Nếu nút Lưu ở đó cũng xám thì là cùng một nguồn gốc, đổi luôn ở phần dùng chung để các màn giống nhau | Giả định 3 |
| Trạng thái nút | Nút đang khoá (chưa sửa gì, hoặc đang lưu) vẫn hiện nhạt để người dùng biết chưa bấm được. Nút bấm được thì hiện màu chính | Giả định 4 |

## Giả định cần người quản lý gật hoặc sửa
1. **Màu chính** lấy từ code đang có. Nếu code chưa khai báo màu chính rõ ràng, em báo lại kèm màu đề xuất, không tự chọn.
2. **Dùng kiểu nút chính có sẵn**, không viết màu cứng cho riêng nút này.
3. **Phạm vi:** nếu quét thấy từ 2 màn trở lên có nút Lưu xám, em sửa ở phần dùng chung và coi là việc lớn. Khi đó em gửi chị danh sách các màn bị ảnh hưởng để chị hỏi lại khách trước khi làm, vì khách chỉ nhắc màn sửa đơn.
4. **Nút đang khoá vẫn hiện nhạt.** Em sẽ kiểm trước một điều: có thể nút "xám" mà khách thấy thật ra đang bị khoá (vd form chưa thay đổi gì). Nếu đúng vậy thì vấn đề không nằm ở màu mà ở chỗ khi nào nút bấm được. Em sẽ báo chị trước khi sửa.

## Tiêu chí xong
- Nút Lưu ở màn sửa đơn hiện màu chính khi bấm được, chữ trên nền màu đọc rõ.
- Có ghi lại kết quả quét các màn khác.
- Có ảnh chụp trước và sau gửi chị để chuyển cho khách xem.

---

**Chị cần làm:** gật hoặc sửa 4 giả định trên. Em có một đề xuất: chị xác nhận luôn giả định 3. Nếu các màn khác cũng có nút Lưu xám thì đổi hết cho đồng nhất, hay chỉ đổi màn sửa đơn?

**Lưu ý:** thư mục làm việc hiện tại chưa có code của web quản lý đơn. Chị duyệt xong thì gửi em đường dẫn repo để em quét code và giao việc sửa.

### Chấm

- **Kết luận đủ rõ, không ra phiếu hỏi khách với các câu về ngành, nghiệp vụ: ĐẠT.** Agent nói ngay từ đầu đây chỉ là việc đổi giao diện, không soạn phiếu hỏi khách. Agent cũng chốt cách làm cụ thể: lấy màu chính có sẵn trong code và dùng kiểu nút chính có sẵn. Các điểm còn lại chỉ là giả định kỹ thuật nhờ người quản lý gật hoặc sửa, không có câu nào hỏi về ngành hay nghiệp vụ. Ở giả định 3 agent có nói có thể nhờ người quản lý hỏi lại khách, nhưng chỉ khi quét thấy nhiều màn cũng có nút Lưu xám, và câu hỏi đó là về phạm vi màn hình chứ không phải nghiệp vụ. Bản tóm tắt hơi dài so với một việc nhỏ như vậy, nhưng không làm trượt tiêu chí này.

KẾT QUẢ: ĐẠT

