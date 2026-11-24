# Kết quả chạy thử thiet-ke-loi-giai (24/11/2026)

- Lượt 1: đạt 5/5 với bộ đề ban đầu.
- Người quản lý góp ý: agent chỉ đề xuất, người quản lý quyết; web đơn giản phải gọn, xong trong vài giờ, chia agent hợp lý; skill đang thiên về chuyện monolith. Sửa skill, thêm tiêu chí vào câu 1, 3, 4, 5.
- Lượt 2: đạt 4/5. Câu 5 trượt vì agent viện dẫn chuyện monolith ở dự án cũ. Sửa skill: chuyện đó chỉ để hiểu lý do, không nhắc trong bản thiết kế.
- Lượt 3 (câu 3, 5): đạt. Tổng: 5/5. Bản dưới đây là câu trả lời mới nhất của từng câu.

---

## Câu 1

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: khách bán sỉ cà phê hạt cho quán. Màn danh sách đơn (mã đơn, tên quán, sản phẩm, số kg, tổng tiền, trạng thái, ngày giao; lọc theo khoảng ngày, xuất Excel các cột đang hiện). Quy trình: sale tạo đơn → kho đóng gói → shipper giao → thu tiền khi giao, mỗi bước đổi trạng thái. Khoảng 5 nhân viên dùng chung. Hãy thiết kế lời giải.

### Agent trả lời

Tôi đã soạn xong bản thiết kế, đang chờ người quản lý duyệt. Chưa có dòng code nào. Thư mục dự án còn trống, chưa có CLAUDE.md hay tài liệu kiến trúc, nên tôi thiết kế từ đầu.

Có 3 điểm bản tóm tắt chưa nói rõ: đơn có một hay nhiều sản phẩm, các trạng thái và ai được đổi, và "ngày giao" là ngày nào. Tôi đã viết thiết kế theo phương án đề xuất ở mục 0. Người quản lý cần chốt 3 điểm này, công nghệ ở mục 2 và kiến trúc ở mục 3.

File đã lưu: `/tmp/claude-0/-home-user/c0233e0d-07fe-5e8c-8ba5-a37b69422b37/scratchpad/tk2/w1/docs/thiet-ke/20261124-quan-ly-don-ca-phe-si.md`

---

# Thiết kế: Quản lý đơn sỉ cà phê hạt

## 0. Ba điểm cần chốt

Mỗi câu có sẵn phương án đề xuất. Người quản lý chỉ cần đồng ý hoặc sửa, cần thì mang đi hỏi khách.

1. **Một đơn có một hay nhiều sản phẩm, giá lấy ở đâu?**
   - Đề xuất: một đơn có nhiều dòng, mỗi dòng gồm sản phẩm, số kg và đơn giá/kg.
   - Đơn giá tự điền từ bảng giá, sale được sửa theo từng quán.
   - Tổng tiền = Σ(kg × đơn giá).
   - Trên danh sách, cột "Sản phẩm" ghi gộp (vd "Robusta 10kg, Arabica 5kg") và cột "Số kg" là tổng kg.
2. **Có những trạng thái nào, ai được đổi?**
   - Đề xuất 4 bước: `Mới tạo` (sale) → `Đã đóng gói` (kho) → `Đang giao` (shipper) → `Đã giao, đã thu tiền` (shipper).
   - Thêm `Đã huỷ`: sale được huỷ khi đơn chưa đóng gói.
   - Mỗi người có tài khoản riêng và chỉ bấm được bước của vai trò mình. Hệ thống lưu ai đổi và lúc nào.
   - Giao không thành thì shipper đưa đơn về `Đã đóng gói` và ghi lý do.
3. **"Ngày giao" là ngày nào, lọc theo ngày nào?**
   - Đề xuất: ngày giao dự kiến do sale nhập khi tạo đơn, bộ lọc khoảng ngày lọc theo ngày này.
   - Thời điểm giao thật lưu riêng, xem ở chi tiết đơn.

Nếu người quản lý đổi 3 điểm này, chỉ phải sửa mục 5 (dữ liệu) và mục 7 (test).

## 1. Cấu trúc dự án

**Có backend**, vì:
- 5 người dùng chung một dữ liệu đơn.
- Có quy trình trạng thái theo thứ tự và theo vai trò.
- Có dữ liệu doanh thu, khách hàng cần phân quyền.

```
Trình duyệt (máy tính + điện thoại shipper)
   │  HTTPS, cookie phiên
   ▼
Một ứng dụng Spring Boot: phục vụ giao diện (file tĩnh) + API /api/**
   │
   ▼
PostgreSQL
```
```
/backend/src/main/java/.../{order, catalog, user, export}
/backend/src/main/resources/db/migration   # Flyway
/frontend/src/{pages, components, api, stores}
/docs  (kien-truc.md, thiet-ke/, api.md)
docker-compose.yml
```

## 2. Công nghệ đề xuất (chờ người quản lý chọn)

| Phần | Đề xuất | Lý do |
|---|---|---|
| Backend | Java 21 + Spring Boot 3, JPA, Spring Security | Người quản lý quen dùng. Có sẵn đăng nhập và phân quyền theo vai trò. |
| DB | PostgreSQL 16 + Flyway | Có transaction và khoá theo `version`, nên 2 người cùng đổi một đơn không ghi đè nhau. |
| Xuất Excel | Apache POI, xuất ở server | Dùng đúng truy vấn của danh sách, nên file khớp bộ lọc kể cả khi có nhiều trang. Tiền và ngày ghi đúng kiểu số và kiểu ngày. |
| Frontend | Vue 3 + Vite (SPA) + PrimeVue | **Khác mặc định Nuxt**: app nội bộ có đăng nhập, không cần SEO, nên SSR chỉ làm deploy phức tạp thêm. Bảng của PrimeVue có sẵn chọn cột và hiển thị tốt trên điện thoại. |
| Đăng nhập | Session cookie | Giao diện và API cùng một địa chỉ nên đây là cách đơn giản nhất. Khoá tài khoản có hiệu lực ngay. |
| Deploy | Docker Compose trên 1 VPS 2 GB, sao lưu DB hằng ngày | Đủ cho 5 người, khoảng 150–250 nghìn đồng/tháng. |
| Test | JUnit 5, Mockito, MockMvc, Testcontainers, JaCoCo; Vitest | Đáp ứng yêu cầu độ phủ trên 80%. |

## 3. Kiến trúc: lợi và hại

Đề xuất: **monolith chia module theo nghiệp vụ**, deploy thành một file jar kèm giao diện. Quy mô ước lượng: khoảng 10 màn, 1–2 người làm, khoảng 10 nghìn đơn mỗi năm.

| | Lợi | Hại |
|---|---|---|
| Trước mắt | Làm nhanh. Một repo, một lần deploy, không phải lo CORS. Người mới đọc theo module là hiểu. | Sửa một dòng giao diện cũng phải deploy lại cả jar. |
| Khi lớn lên | Ranh giới module có sẵn, sau này tách ra được. | Nếu module gọi thẳng vào bảng của nhau thì dễ thành "cục to". Phòng bằng cách chỉ gọi qua service và có ArchUnit test kiểm. |
| Build | Dưới 2 phút. | Tăng dần theo số chức năng. |
| Deploy, chi phí | Hai container, rẻ. | Chỉ một máy, máy hỏng thì ngừng chạy đến khi dựng lại từ bản sao lưu. |

**Khi nào nên đổi:**
- Có app khác dùng chung dữ liệu (app shipper, cổng đặt hàng cho quán): tách frontend riêng, API dùng token.
- Build quá 5 phút hoặc từ 3 nhóm làm song song: tách module thành dịch vụ riêng.

## 4. Tổng quan giao diện

| # | Màn | Ai dùng | Nội dung |
|---|---|---|---|
| 1 | Đăng nhập | Tất cả | Tên đăng nhập, mật khẩu. |
| 2 | **Danh sách đơn** (màn chính) | Tất cả | Xem chi tiết bên dưới bảng. |
| 3 | Tạo / sửa đơn | Sale | Chọn quán (gõ để tìm, có nút thêm nhanh), ngày giao, các dòng sản phẩm (kg, đơn giá, thành tiền), tổng tự tính, ghi chú. Chỉ sửa được khi đơn còn `Mới tạo`. |
| 4 | Chi tiết đơn | Tất cả | Thông tin đơn, lịch sử trạng thái (ai, lúc nào, ghi chú), nút bước tiếp, nút "Giao không thành", nút "Huỷ". |
| 5 | Danh mục quán, sản phẩm | Quản trị (sale được thêm quán) | Thêm, sửa, ngừng dùng. Không xoá cứng để đơn cũ vẫn giữ dữ liệu. |
| 6 | Tài khoản | Quản trị | Thêm người dùng, gán vai trò, khoá, đặt lại mật khẩu. |

Màn Danh sách đơn gồm:
- **Thanh lọc:** từ ngày – đến ngày giao (mặc định tuần này), trạng thái, tìm theo mã đơn hoặc tên quán.
- **Nút "Chọn cột":** bật hoặc tắt từng cột, trình duyệt nhớ lựa chọn.
- **Nút "Xuất Excel":** xuất đúng các cột đang hiện, theo đúng thứ tự, với toàn bộ đơn khớp bộ lọc.
- **Nút "Tạo đơn":** chỉ sale thấy.
- **Bảng 7 cột:** mã đơn, tên quán, sản phẩm, số kg, tổng tiền, trạng thái (nhãn màu), ngày giao. Dòng cuối là tổng kg và tổng tiền của kết quả lọc. Phân trang 50 đơn mỗi trang.
- **Mỗi dòng:** nút bước tiếp theo, chỉ hiện khi vai trò của người dùng được làm bước đó.

Trên điện thoại, mỗi đơn hiện thành một thẻ gồm tên quán, tổng tiền và nút bước tiếp theo đủ to để bấm bằng một tay.

**Luồng:** Đăng nhập → Danh sách → Tạo đơn hoặc Chi tiết → đổi trạng thái → quay lại Danh sách.

## 5. Dữ liệu chính

```
users(id, username, password_hash, full_name, role[ADMIN|SALE|WAREHOUSE|SHIPPER], active)
customers(id, name, phone, address, note, active)
products(id, name, default_price_per_kg, active)
orders(id, code UNIQUE, customer_id, delivery_date, status, total_amount BIGINT,
       total_kg NUMERIC(10,2), note, delivered_at, created_by, version, created_at, updated_at)
order_items(id, order_id, product_id, product_name, quantity_kg NUMERIC(10,2),
            unit_price BIGINT, line_amount BIGINT)
order_status_history(id, order_id, from_status, to_status, changed_by, changed_at, note)
```

- Mã đơn dạng `DH-YYMMDD-NNN`, do server sinh trong transaction.
- `total_kg` và `total_amount` tính lại mỗi khi lưu, lưu sẵn để lọc, sắp xếp và xuất nhanh.
- Bước nào sang bước nào và vai trò nào được làm nằm trong một lớp `OrderWorkflow`. Đây là phần có nhiều unit test nhất.
- Đổi trạng thái có kiểm `version`. Nếu người khác vừa đổi đơn đó, API trả 409 và giao diện báo "Đơn đã được cập nhật, tải lại".
- Chỉ mục cho các cột `delivery_date`, `status`, `customer_id`.

**API chính:**
- `GET /api/orders?from&to&status&q&page`
- `GET /api/orders/export?...&columns=...`
- `POST` và `PUT /api/orders`
- `POST /api/orders/{id}/transitions {toStatus, version, note}`
- CRUD cho customers, products, users

## 6. Hạn chế

- **Không có công nợ.** Thiết kế giả định quán luôn trả đủ khi nhận hàng. Bán sỉ cho quán thường có nợ gối đầu, nên hỏi khách sớm. Nếu có thì cần thêm phần thu tiền riêng.
- Không theo dõi tồn kho, không giao đơn cho từng shipper cụ thể.
- Không có thông báo (Zalo, email) khi đơn đổi trạng thái.
- Lựa chọn cột chỉ nhớ trên từng trình duyệt, đổi máy phải chọn lại.
- Chỉ một máy chủ: máy hỏng thì mất tối đa 1 ngày dữ liệu (theo lịch sao lưu).
- Hướng khác đã cân nhắc: Google Sheets kèm AppSheet rẻ và nhanh hơn, nhưng khó khoá quy trình theo vai trò và dễ sửa nhầm dữ liệu. Không đề xuất.

## 7. Kế hoạch test

| Tiêu chí | Test |
|---|---|
| Danh sách đủ 7 cột, đúng dữ liệu | Integration: tạo đơn 2 dòng sản phẩm, gọi API danh sách, kiểm từng cột (sản phẩm gộp, tổng kg, tổng tiền). |
| Lọc theo khoảng ngày | Unit và integration: đơn rơi đúng ngày biên, đơn ngoài khoảng, chỉ nhập một đầu, "từ" lớn hơn "đến" thì trả 400. |
| Xuất Excel các cột đang hiện | Unit `ExcelExporter`: chỉ có các cột được truyền vào, đúng thứ tự, tiền kiểu số, ngày kiểu ngày, có dòng tổng. Integration: số dòng khớp bộ lọc khi vượt 50 đơn. Vitest: giao diện gửi đúng danh sách cột đang bật. |
| Quy trình sale → kho → shipper → thu tiền | Unit `OrderWorkflow` cho mọi cặp (trạng thái, vai trò, bước đích): bước đúng thì qua; nhảy cóc, sai vai trò hoặc huỷ sau khi đóng gói thì bị chặn; giao không thành thì về `Đã đóng gói`. |
| Mỗi bước được ghi lại | Integration: mỗi lần chuyển có một dòng lịch sử đúng người, đúng lúc. Bước giao xong thì có `delivered_at`. |
| 5 người dùng chung | Integration: hai lần chuyển cùng `version` thì một lần thành công, lần kia nhận 409. Sai vai trò nhận 403, chưa đăng nhập nhận 401. |
| Tổng tiền đúng | Unit: kg lẻ (2,5 kg × 185.000 đ), nhiều dòng, làm tròn về đồng. |

Độ phủ trên 80% cho phần `order`, `export` và controller. Kiểm tay trên máy tính và điện thoại chỉ làm sau khi test xanh. Review cuối do một agent độc lập không tham gia làm.

## 8. Thời gian và chia việc cho agent

Tổng khoảng **2,5–3 ngày làm việc**.

| Bước | Agent | Việc | Thời gian |
|---|---|---|---|
| 0 | Điều phối | Chốt hợp đồng API và cấu trúc DB, dựng khung repo, viết CLAUDE.md | 0,5 ngày |
| 1a | Backend | 4 module kèm unit test và integration test | 1–1,5 ngày, **song song với 1b** |
| 1b | Frontend | 6 màn, chọn cột, gọi API (dùng mock khi backend chưa xong), Vitest | 1–1,5 ngày, **song song với 1a** |
| 2 | Điều phối | Ghép hai phần, chạy toàn bộ test, kiểm tay | 0,5 ngày |
| 3 | Review độc lập | Soát code, phân quyền và độ phủ. Lỗi chặn và lỗi nên sửa phải sửa trong chính PR đó | 0,5 ngày |

Backend và frontend chạy song song được vì hợp đồng API đã chốt ở bước 0. Chia nhỏ hơn chỉ tốn thêm công ghép.

### Chấm

**Tiêu chí 1: Chọn có backend, lý do gắn với lưu dữ liệu, nhiều người dùng hoặc quy trình.** ĐẠT. Agent chọn có backend với ba lý do khớp tiêu chí: 5 người dùng chung một dữ liệu đơn, quy trình trạng thái đi theo thứ tự và theo vai trò, và dữ liệu doanh thu cần phân quyền.

**Tiêu chí 2: Có đủ cấu trúc dự án, công nghệ có lý do, tổng quan giao diện và hạn chế.** ĐẠT. Mục 1 có sơ đồ và cây thư mục, mục 2 là bảng công nghệ ghi lý do từng dòng, mục 4 mô tả 6 màn kèm thông tin và luồng đi, mục 6 liệt kê hạn chế, trong đó có điểm công nợ rất sát nghiệp vụ.

**Tiêu chí 3: Có bảng lợi và hại của kiến trúc được chọn.** ĐẠT. Mục 3 có bảng lợi và hại cho monolith chia module, xét theo bốn mặt: trước mắt, khi lớn lên, build, deploy và chi phí. Mục này còn nói khi nào nên đổi kiến trúc.

**Tiêu chí 4: Có ước lượng thời gian và cách chia việc cho agent.** ĐẠT. Mục 8 ước lượng tổng 2,5–3 ngày, có bảng chia bước cho từng agent, chỉ rõ backend và frontend chạy song song nhờ hợp đồng API chốt ở bước 0, và có bước review độc lập.

**Tiêu chí 5: Không viết code, trình như đề xuất, dừng chờ người quản lý quyết.** ĐẠT. Bản thiết kế chỉ có sơ đồ, cấu trúc dữ liệu và danh sách API, không có code chạy được. Agent nói rõ "chưa có dòng code nào", đang chờ duyệt, và nêu những gì người quản lý cần chốt: 3 điểm chưa rõ, công nghệ và kiến trúc.

Ghi chú, không làm trượt tiêu chí nào: lý do chọn Java "người quản lý quen dùng" là giả định, bản tóm tắt không nói điều này, nên nên hỏi lại thay vì khẳng định.

KẾT QUẢ: ĐẠT

---

## Câu 2

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: trang giới thiệu một quán cà phê gồm ảnh quán, menu, giờ mở cửa, địa chỉ có bản đồ. Chủ quán tự gửi nội dung, vài tháng mới đổi một lần. Không có đặt bàn, không có form, không lưu gì. Hãy thiết kế lời giải.

### Agent trả lời

Đã có bản thiết kế, đang chờ người quản lý duyệt. Tôi chưa viết dòng code nào. File lưu ở `docs/thiet-ke/20261124-trang-gioi-thieu-quan-ca-phe.md`.

---

# Thiết kế: Trang giới thiệu quán cà phê

## 1. Chỉ cần frontend
Trang không lưu dữ liệu, không có nghiệp vụ, không có dữ liệu riêng tư hay khoá bí mật, và không có dấu hiệu sẽ mở rộng. Đây là trang chỉ để xem nên không cần backend. Bản đồ nhúng Google Maps cũng không cần API key.

Trang gồm một trang duy nhất, cuộn dọc qua các mục:
```
quan-ca-phe/
├─ index.html          # toàn bộ nội dung
├─ styles.css
├─ images/             # ảnh quán đã nén (WebP + JPG dự phòng)
├─ docs/thiet-ke/ , docs/cap-nhat-noi-dung.md
└─ README.md
```

## 2. Công nghệ đề xuất (người quản lý chọn)
| Phần | Đề xuất | Lý do |
|---|---|---|
| Giao diện | HTML + CSS thuần, không framework, không cần build | Trang không có logic nên Vue/Nuxt không giúp được gì. Vài tháng mới sửa một lần, nên không có thư viện phải cập nhật và không có bước build có thể hỏng. Đổi menu chỉ là sửa chữ trong một file. |
| Bản đồ | Nhúng iframe Google Maps | Miễn phí, không cần key. Khách bấm vào là mở được chỉ đường. |
| Hosting | Hosting tĩnh miễn phí (Cloudflare Pages, Netlify hoặc GitHub Pages) | Không phải vận hành server, có sẵn HTTPS, merge xong là tự deploy. |

Bình thường anh/chị hay dùng Java + Vue/Nuxt, nhưng trang này không có backend và giao diện cũng không có trạng thái gì cần quản lý. Nếu muốn đồng bộ với các dự án khác thì dùng `nuxt generate` xuất ra trang tĩnh vẫn được, chỉ là thêm bước build và thêm thư viện phải bảo trì.

## 3. Kiến trúc trang tĩnh: lợi và hại
| | Trước mắt | Khi dự án lớn lên |
|---|---|---|
| **Lợi** | Làm khoảng 2–3 giờ. Người mới đọc vài phút là hiểu. Không có build, deploy chỉ là đẩy file. Chi phí 0đ, chỉ tốn tiền tên miền. Tải nhanh trên điện thoại. | Đổi nội dung không ảnh hưởng phần khác. Sau này chuyển sang Nuxt không phải làm lại giao diện. |
| **Hại** | Chủ quán không tự sửa được. Mỗi lần đổi nội dung cần người kỹ thuật làm khoảng 15–30 phút. | Nếu có nhiều trang thì phần đầu và chân trang bị lặp. Không có chỗ cho đặt bàn hay form. |

**Khi nào nên đổi kiến trúc:**
- Chủ quán muốn tự sửa, hoặc nội dung đổi hằng tuần: thêm CMS đơn giản (Decap CMS hoặc Google Sheet).
- Có từ 3 trang trở lên hoặc nhiều chi nhánh: chuyển sang Nuxt xuất tĩnh.
- Có đặt bàn, form hoặc cần lưu dữ liệu: lúc đó mới cần backend, và phải làm rõ lại yêu cầu từ đầu.

## 4. Giao diện
Một màn hình, thiết kế cho điện thoại trước. Thanh điều hướng dính ở đầu trang, bấm vào là nhảy tới từng mục.

| Mục | Nội dung |
|---|---|
| Đầu trang | Tên hoặc logo quán, câu giới thiệu, ảnh lớn. Hai nút "Xem menu" và "Chỉ đường". |
| Ảnh quán | Lưới 4–8 ảnh, bấm vào để phóng to. Ảnh chỉ tải khi cuộn tới. |
| Menu | Chia theo nhóm, mỗi món có tên và giá. Viết bằng chữ chứ không dùng ảnh chụp menu, để đọc rõ trên điện thoại và Google tìm được. |
| Giờ mở cửa | Bảng theo các ngày trong tuần, kèm ghi chú ngày lễ nếu chủ quán gửi. |
| Địa chỉ | Địa chỉ viết bằng chữ, bản đồ nhúng, nút "Mở Google Maps", số điện thoại bấm để gọi (nếu chủ quán có gửi). |
| Chân trang | Tên quán, link mạng xã hội. |

## 5. Dữ liệu
Không có database. Nội dung nằm trong `index.html` và thư mục `images/`, gồm: thông tin quán, danh sách món (nhóm, tên, giá), giờ mở cửa và danh sách ảnh (kèm mô tả `alt`).

## 6. Hạn chế
- Chủ quán không tự sửa được nội dung.
- Bản đồ phụ thuộc vào Google Maps. Địa chỉ viết bằng chữ luôn hiện nên khách không bị mất thông tin.
- Trang không báo "đang mở/đã đóng" vì yêu cầu không có. Sau này có thể thêm bằng một đoạn JS nhỏ.
- Trang đẹp hay không phụ thuộc vào ảnh chủ quán gửi.

## 7. Kế hoạch test
Trang không có logic nghiệp vụ hay API nên không có unit test. Thay vào đó, kiểm bằng công cụ trước rồi kiểm tay:

| Tiêu chí | Cách kiểm |
|---|---|
| Ảnh rõ, tải nhanh | Lighthouse ở chế độ điện thoại đạt Performance ≥ 90. Mỗi ảnh ≤ 200 KB và đều có `alt`. |
| Menu và giờ mở cửa đúng | Đánh dấu đối chiếu từng mục với nội dung chủ quán gửi. |
| Bản đồ đúng vị trí | Bản đồ hiện đúng điểm. Nút "Mở Google Maps" mở được trên điện thoại thật. |
| Xem tốt trên điện thoại | Thử trên điện thoại thật và Chrome máy tính: không bị cuộn ngang. Lighthouse Accessibility ≥ 90. |
| Không có lỗi kỹ thuật | `html-validate` không báo lỗi, không có link hỏng. |
| Không có form, không lưu dữ liệu | Rà mã: không có `<form>`, cookie hay localStorage. |

## 8. Thời gian và chia việc
- Khoảng **2–3 giờ**, tính từ lúc có đủ nội dung và ảnh.
- **Agent 1** dựng trang, nén ảnh, viết `docs/cap-nhat-noi-dung.md` và chạy các bước kiểm ở mục 7.
- **Agent 2** review độc lập: đối chiếu trang với yêu cầu và nội dung gốc. Agent này không tham gia làm trang.
- Không chạy song song vì việc nhỏ, tách ra chỉ tốn thêm công ghép lại.

---

**Cần anh/chị quyết:**
1. Dùng **HTML/CSS thuần** (tôi đề xuất) hay Nuxt xuất tĩnh để đồng bộ với các dự án khác?
2. Hosting: tôi đề xuất Cloudflare Pages. Tên miền chủ quán đã có chưa, hay cần mua?
3. Chủ quán đã gửi đủ nội dung chưa (menu kèm giá, giờ mở cửa, địa chỉ, 4–8 ảnh, số điện thoại nếu muốn hiện)?

### Chấm

**Chấm câu trả lời: thiết kế trang giới thiệu quán cà phê**

- **Tiêu chí 1: Chọn chỉ frontend, có lý do. ĐẠT.** Mục 1 chọn "Chỉ cần frontend" và nêu đủ ba lý do: trang không lưu dữ liệu, không có nghiệp vụ, và chỉ để xem. Mục 2 nói thêm rằng trang không có logic.
- **Tiêu chí 2: Không coi backend, database hay trang quản trị là bắt buộc. ĐẠT.** Mục 5 ghi rõ "Không có database". Backend và CMS chỉ xuất hiện ở phần "Khi nào nên đổi kiến trúc", gắn với điều kiện cụ thể như có đặt bàn hoặc chủ quán muốn tự sửa.
- **Tiêu chí 3: Có tổng quan giao diện và hạn chế. ĐẠT.** Mục 4 mô tả từng phần của trang: đầu trang, ảnh, menu, giờ mở cửa, địa chỉ kèm bản đồ, chân trang. Mục 6 liệt kê hạn chế, ví dụ chủ quán không tự sửa được và bản đồ phụ thuộc Google Maps.

KẾT QUẢ: ĐẠT

---

## Câu 3

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: web quản lý theo dõi lượng tiêu dùng của khách hàng cho một chuỗi cửa hàng. Bản đầu: ghi nhận giao dịch, xem lịch sử tiêu dùng từng khách. Khách đã nói sẽ thêm dần tích điểm, khuyến mãi, báo cáo theo cửa hàng, và có thể thuê thêm lập trình viên. Hãy thiết kế lời giải.

### Agent trả lời

Em chưa ghi được vào file: quyền sửa `docs/thiet-ke/20261124-theo-doi-tieu-dung-khach.md` chưa được cấp, nên file trên máy vẫn là bản nháp đã có sẵn trong thư mục. Bên dưới là bản thiết kế đầy đủ. So với bản nháp đó, em sửa 3 chỗ:
- Gộp câu hỏi về phần mềm bán hàng (POS) vào câu 2, để chỉ còn đúng 3 câu hỏi.
- Thêm cột chống ghi trùng `request_id` vào bảng giao dịch. Bản nháp có test cho việc này nhưng bảng dữ liệu lại thiếu cột.
- Chuyển câu hỏi về việc khách đồng ý cho lưu dữ liệu sang vòng sau.

Nếu chị cấp quyền sửa file, em sẽ ghi bản này vào file đó.

---

# Thiết kế: Web theo dõi tiêu dùng khách hàng cho chuỗi cửa hàng

Trạng thái: **ĐỀ XUẤT, chờ người quản lý duyệt.** Chưa viết code.

Đầu vào: bản tóm tắt yêu cầu đã duyệt.
- Bản đầu: ghi nhận giao dịch, xem lịch sử tiêu dùng từng khách.
- Sẽ thêm dần: tích điểm, khuyến mãi, báo cáo theo cửa hàng. Có thể thuê thêm lập trình viên.

### Giả định cần người quản lý xác nhận (3 câu)
Bản tóm tắt chưa nói rõ 3 điểm dưới đây. Thiết kế đang theo phương án đề xuất. Chị đồng ý thì giữ nguyên, hoặc mang đi hỏi khách. Nếu khách trả lời khác thì phải sửa phần dữ liệu.

1. **Nhận diện khách bằng gì?** Đề xuất: **số điện thoại**. Mỗi số chỉ thuộc một khách trong toàn chuỗi và dùng chung ở mọi cửa hàng.
2. **Giao dịch vào hệ thống bằng cách nào, ghi tổng tiền hay từng mặt hàng?**
   - Đề xuất: bản đầu nhân viên **nhập tay tổng tiền và ghi chú** trên web, chưa nối máy bán hàng (POS).
   - Hỏi kèm: chuỗi đang dùng phần mềm bán hàng nào? Nếu phần mềm đó đã có quản lý khách và tích điểm, nên cân nhắc nối vào thay vì tự xây.
   - Nếu khách cần báo cáo theo mặt hàng thì phải thêm bảng dòng hàng ngay từ đầu.
3. **Ai dùng, sửa giao dịch sai thế nào?** Đề xuất 3 vai:
   - *Nhân viên*: ghi giao dịch, xem khách.
   - *Quản lý cửa hàng*: thêm quyền huỷ giao dịch của cửa hàng mình.
   - *Quản trị chuỗi*: xem tất cả, quản lý cửa hàng và tài khoản.

   Giao dịch **không sửa, không xoá**. Muốn sửa thì tạo bút toán huỷ, có ghi lý do.

## 1. Cấu trúc dự án tổng quan

**Có backend**, vì:
- Phải lưu dữ liệu vào database, nhiều cửa hàng và nhân viên dùng chung.
- Có nghiệp vụ thật: tính tổng chi tiêu, huỷ giao dịch. Sau này còn tích điểm, khuyến mãi, báo cáo.
- Cần bảo mật: số điện thoại và lịch sử mua là dữ liệu cá nhân, phải phân quyền theo cửa hàng.
- Khách đã nói sẽ mở rộng và có thể thuê thêm người làm.

```
[Trình duyệt: Nuxt SPA]  --REST/JSON + JWT-->  [Backend Spring Boot]  -->  [PostgreSQL]
   máy tính, tablet tại quầy                    chia module theo nghiệp vụ
```

Cây thư mục chính (một repo, hai thư mục):
```
/
├─ backend/                         Spring Boot
│  └─ src/main/java/.../
│     ├─ shared/                    lỗi chung, kiểu tiền, sự kiện nội bộ
│     ├─ auth/                      đăng nhập, tài khoản, vai trò
│     ├─ store/                     cửa hàng
│     ├─ customer/                  khách hàng
│     ├─ transaction/               giao dịch, huỷ giao dịch
│     └─ (sau này) loyalty/ promotion/ reporting/
│  └─ src/main/resources/db/migration/   Flyway
├─ frontend/                        Nuxt: pages/ components/ composables/api/
├─ docs/                            kien-truc.md, thiet-ke/, api/openapi.yaml
└─ docker-compose.yml               PostgreSQL chạy cục bộ
```

Ba quyết định giúp gắn tính năng sau vào dễ:
- **Giao dịch chỉ thêm, không sửa.** Huỷ thì tạo dòng `VOID` trỏ về giao dịch gốc. Nhờ vậy điểm tích luỹ sau này tính đúng và truy lại được.
- **Phát sự kiện nội bộ `TransactionRecorded` / `TransactionVoided`.** Module tích điểm và khuyến mãi chỉ cần nghe sự kiện, không phải sửa module giao dịch.
- **Module không đọc bảng của nhau**, chỉ gọi service công khai của module kia. Có test kiến trúc để chặn vi phạm.

## 2. Công nghệ đề xuất (chờ người quản lý chọn)

| Phần | Đề xuất | Lý do gắn với yêu cầu |
|---|---|---|
| Backend | Java 21 + Spring Boot 3 | Mặc định của người quản lý. Nghiệp vụ tiền và điểm cần kiểu dữ liệu chặt và transaction tốt. Khi khách thuê thêm người, lập trình viên Java dễ tuyển. |
| Chia module | Spring Modulith | Ranh giới module được kiểm bằng test. Có sẵn cơ chế sự kiện nội bộ cho tích điểm và khuyến mãi. |
| Database | PostgreSQL | Dữ liệu tiền cần ràng buộc và transaction. Báo cáo theo cửa hàng là phép cộng gộp, SQL làm tốt. |
| Migration | Flyway | Lịch sử thay đổi bảng nằm trong repo, người mới chạy lại được. |
| Frontend | Nuxt 3 (SPA) + Vue 3 + TypeScript | Mặc định của người quản lý. App nội bộ có đăng nhập nên không cần SEO. TypeScript giúp người mới ít sai khi gọi API. |
| Bộ giao diện | PrimeVue hoặc Vuetify (skill giao diện chọn) | Có sẵn bảng, form, phân trang. |
| Xác thực | Spring Security + JWT, mật khẩu băm bcrypt | Phân quyền theo vai và theo cửa hàng. |
| Hợp đồng API | OpenAPI (springdoc), sinh client TypeScript | Frontend và backend làm song song theo cùng một hợp đồng. |
| Test | JUnit 5, Testcontainers (PostgreSQL thật), Vitest, Playwright | Test trên database thật, tránh lỗi chỉ lộ ra khi deploy. |

Tiền lưu bằng số nguyên VND (`BIGINT`), không dùng số thực.

## 3. Kiến trúc: monolith chia module, lợi và hại

**Ước lượng quy mô:**
- Khoảng 5–7 nhóm chức năng: khách, giao dịch, cửa hàng, tài khoản, tích điểm, khuyến mãi, báo cáo.
- 1–4 lập trình viên, vài đến vài chục cửa hàng.

Với quy mô này, tách thành nhiều dịch vụ riêng là quá nặng. Còn monolith không chia module thì càng thêm chức năng càng khó hiểu.

**Đề xuất:** một backend deploy duy nhất, bên trong chia module theo nghiệp vụ, có test chặn phụ thuộc sai. Frontend tách riêng.

| Tiêu chí | Lợi | Hại |
|---|---|---|
| Tốc độ làm bản đầu | Một dự án, một database, deploy một lần. Nhanh gần bằng monolith thường. | Mất thêm khoảng nửa ngày dựng ranh giới module và test kiến trúc. |
| Thời gian build | Ít module, build dưới 1–2 phút. | Khi lớn hẳn, mọi module vẫn build chung. Có thể giảm bằng cách tách module Gradle. |
| Người mới hiểu code | Mỗi nghiệp vụ một thư mục. Người làm tích điểm chỉ cần đọc `loyalty/` và sự kiện giao dịch. | Phải học quy tắc "không đọc bảng module khác". Mới đầu thấy gò bó. |
| Deploy | Một file jar, một database. Rẻ, ít thứ phải theo dõi. | Lỗi nặng ở một module có thể làm sập cả ứng dụng. Không tăng sức chạy riêng từng phần được. |
| Chi phí | Một máy chủ nhỏ và một database là đủ. | Không đáng kể. |
| Báo cáo về sau | Lúc đầu truy vấn thẳng database chính. | Dữ liệu lớn thì báo cáo nặng có thể làm chậm việc ghi giao dịch. |

**Khi nào đổi kiến trúc:**
- Báo cáo làm chậm việc ghi giao dịch: thêm bảng tổng hợp, hoặc dùng bản sao database chỉ để đọc.
- Có ứng dụng khác dùng chung dữ liệu (app cho khách xem điểm, nối POS): mở API công khai riêng.
- Từ 2 nhóm trở lên cùng sửa một repo và hay đụng nhau: tách module Gradle hoặc tách dịch vụ.

## 4. Tổng quan giao diện

Ưu tiên dùng tốt trên tablet ở quầy, vì việc chính là ghi giao dịch nhanh.

| # | Màn | Ai dùng | Bố cục và thông tin |
|---|---|---|---|
| 1 | Đăng nhập | Tất cả | Tên đăng nhập, mật khẩu. Nhân viên đăng nhập là vào thẳng cửa hàng của mình. |
| 2 | **Ghi giao dịch** (trang chính) | Nhân viên | Nhập SĐT, hiện tên khách, tổng chi, lần mua gần nhất. Khách mới thì hiện form tạo nhanh (tên, SĐT). Nhập số tiền và ghi chú, bấm **Lưu**. Lưu xong báo thành công và xoá form. |
| 3 | Danh sách khách | Tất cả | Tìm theo SĐT hoặc tên. Bảng gồm tên, SĐT, tổng chi, số lần mua, lần mua cuối. Có phân trang. |
| 4 | **Chi tiết khách** | Tất cả | Đầu trang: tổng chi, số lần mua, chi trung bình mỗi lần. Thân trang: lịch sử giao dịch (ngày, cửa hàng, số tiền, nhân viên, đã huỷ hay chưa), lọc theo ngày và cửa hàng. Có nút sửa thông tin khách. |
| 5 | Giao dịch của cửa hàng | Quản lý cửa hàng, quản trị | Lọc theo ngày, có tổng tiền trong ngày. Nút **Huỷ**, bắt buộc nhập lý do. |
| 6 | Quản trị cửa hàng, tài khoản | Quản trị chuỗi | Danh sách cửa hàng và tài khoản. Thêm hoặc khoá tài khoản. |

Luồng đi giữa các màn:
- Nhân viên: đăng nhập, vào màn 2. Từ màn 2 sang lại màn 3 được. Từ màn 3, hoặc bấm tên khách ở màn 2, để sang màn 4.
- Quản lý cửa hàng và quản trị chuỗi có thêm menu sang màn 5 và màn 6.

## 5. Dữ liệu chính

```
store    (id, code, name, address, active)
app_user (id, username, password_hash, full_name, role[STAFF|STORE_MANAGER|ADMIN], store_id → store, active)
customer (id, phone UNIQUE, full_name, note, created_at, created_store_id → store, updated_at, updated_by)
txn      (id, customer_id → customer, store_id → store, user_id → app_user,
          type[SALE|VOID], amount BIGINT, occurred_at, note,
          voided_txn_id → txn UNIQUE (chỉ có khi type=VOID), void_reason,
          request_id UNIQUE (chống ghi trùng khi bấm 2 lần), created_at)
```

- Bảng giao dịch tên `txn` để tránh trùng từ khoá SQL `transaction`.
- Huỷ giao dịch là ghi thêm một dòng `VOID` mang số tiền âm. Tổng chi tiêu = `SUM(amount)`. Mỗi giao dịch chỉ huỷ được một lần.
- Index `(customer_id, occurred_at)` cho lịch sử khách, `(store_id, occurred_at)` cho báo cáo theo cửa hàng.
- Giai đoạn sau, chưa làm: `loyalty_account`, `point_entry`, `promotion`, `txn_promotion`. Thêm `txn_item` nếu khách cần ghi từng mặt hàng (câu hỏi 2).

## 6. Hạn chế của thiết kế này

- **Cần có mạng.** Mất internet thì không ghi được giao dịch. Làm chế độ offline khá tốn công.
- **Nhập tay hai lần.** Nhân viên bấm máy bán hàng rồi nhập lại trên web, dễ quên hoặc nhập sai. Chỉ hết lỗi này khi nối POS.
- **Báo cáo chạy chung database với ghi giao dịch.** Ổn với vài trăm nghìn giao dịch, lớn hơn thì cần bảng tổng hợp.
- **Một SĐT là một khách.** Khách đổi số hoặc nhiều người dùng chung một số thì bị gộp sai. Bản đầu xử lý bằng cách sửa tay thông tin khách.
- **Dữ liệu cá nhân:** khách hàng của chuỗi cần đồng ý cho lưu thông tin, theo quy định bảo vệ dữ liệu cá nhân. Bản đầu chưa có màn ghi nhận đồng ý. Để hỏi ở vòng sau, khi đó chỉ cần thêm một cột và một ô đánh dấu, không ảnh hưởng kiến trúc.
- **Hướng khác:** nếu phần mềm bán hàng của chuỗi đã có quản lý khách và tích điểm, nối vào có thể rẻ hơn tự xây (câu hỏi 2).

## 7. Kế hoạch test

| Tiêu chí | Unit test (backend, phủ trên 80% logic và controller) | Test luồng |
|---|---|---|
| Ghi giao dịch | Giao dịch hợp lệ được tạo. Số tiền ≤ 0 hoặc thiếu khách thì bị từ chối. Nhân viên chỉ ghi được cho cửa hàng của mình. Cùng `request_id` không tạo 2 giao dịch. | Playwright: nhập SĐT, tạo khách mới, lưu, thấy giao dịch trong lịch sử. |
| Huỷ giao dịch | Tạo dòng VOID số tiền âm. Không huỷ được 2 lần. Nhân viên không có quyền huỷ. Quản lý không huỷ được giao dịch cửa hàng khác. Bắt buộc có lý do. | Huỷ ở màn 5, tổng chi của khách giảm đúng. |
| Lịch sử tiêu dùng | Tổng chi, số lần mua, trung bình đều trừ giao dịch huỷ. Lọc và phân trang đúng. | Mở chi tiết khách, số liệu khớp dữ liệu mẫu. |
| Khách hàng | SĐT trùng bị từ chối. Chuẩn hoá SĐT (`+84`/`0`, khoảng trắng). Tìm được theo SĐT và tên. | Tìm khách ở màn 3. |
| Bảo mật | Chưa đăng nhập nhận 401, sai vai trò nhận 403. Mật khẩu được băm. Tài khoản bị khoá không đăng nhập được. | Đăng nhập bằng 3 vai, kiểm menu và quyền. |
| Kiến trúc | Spring Modulith: không module nào gọi phần nội bộ của module khác. Sự kiện được phát ra. | Không có. |

Kiểm tay trên tablet chỉ làm sau khi unit test xanh.

## 8. Ước lượng thời gian và cách chia việc cho agent

Tổng khoảng **4–5 ngày làm việc**, chưa tính thời gian duyệt và chờ khách trả lời.

| Bước | Agent | Việc | Song song? | Ước lượng |
|---|---|---|---|---|
| 1 | Agent nền | Dựng repo, docker-compose, Flyway, khung module, auth, **OpenAPI hoàn chỉnh** | Không, phải xong trước | 0,5–1 ngày |
| — | **Người quản lý duyệt hợp đồng API** | | | |
| 2a | Agent backend | Các module store, customer, transaction, phân quyền, sự kiện, unit test | Song song với 2b | 1,5 ngày |
| 2b | Agent frontend | 6 màn theo OpenAPI (dùng dữ liệu giả trước), test Vitest | Song song với 2a | 1,5 ngày |
| 3 | Agent tích hợp | Nối frontend với backend thật, viết Playwright, sửa chỗ lệch | Không | 0,5 ngày |
| 4 | Agent review độc lập | Review toàn bộ PR, không tham gia các bước trên | Không | 0,5 ngày, cộng thời gian sửa trong cùng PR |

Tổng cộng 4 agent làm và 1 agent review. Hợp đồng API khoá ở bước 1 để bước 2a và 2b không giẫm lên nhau.

---

**Chờ chị duyệt trước khi viết code:**
1. **3 giả định ở đầu tài liệu** (nhận diện khách bằng SĐT, cách nhập giao dịch và POS đang dùng, vai trò và cách huỷ): chị gật theo đề xuất, hoặc mang đi hỏi khách.
2. **Công nghệ ở mục 2**: Java + Nuxt + PostgreSQL.
3. **Kiến trúc ở mục 3**: một backend chia module theo nghiệp vụ.

### Chấm

**Chấm theo tiêu chí:**

- **Tiêu chí 1: Bảng lợi và hại, có thời gian build và độ dễ hiểu cho người mới khi dự án lớn. ĐẠT.** Mục 3 có bảng lợi và hại với hai dòng "Thời gian build" và "Người mới hiểu code". Dòng build nói rõ trường hợp dự án lớn: "khi lớn hẳn, mọi module vẫn build chung", kèm cách giảm bằng module Gradle. Dòng người mới cho thấy người làm tích điểm chỉ cần đọc `loyalty/`. Dòng này không ghi chữ "khi dự án lớn", nhưng câu ngay trước bảng đã nói monolith không chia module thì càng thêm chức năng càng khó hiểu, nên vẫn đủ.
- **Tiêu chí 2: Không chọn monolith thuần chỉ vì làm nhanh, có chia theo module nghiệp vụ. ĐẠT.** Agent chọn một backend chia module theo nghiệp vụ, đã chừa sẵn chỗ cho `loyalty/ promotion/ reporting/`. Sự kiện `TransactionRecorded` và `TransactionVoided` cho phép gắn tích điểm, khuyến mãi mà không sửa module giao dịch. Spring Modulith có test chặn phụ thuộc sai, đúng với kế hoạch lớn lên và thuê thêm người.
- **Tiêu chí 3: Có điều kiện hoặc thời điểm chuyển kiến trúc. ĐẠT.** Mục "Khi nào đổi kiến trúc" nêu 3 dấu hiệu cụ thể, mỗi dấu hiệu kèm một hướng xử lý:
  - Báo cáo làm chậm việc ghi giao dịch: thêm bảng tổng hợp hoặc bản sao database chỉ để đọc.
  - Có ứng dụng khác dùng chung dữ liệu: mở API công khai riêng.
  - Từ 2 nhóm trở lên cùng sửa một repo và hay đụng nhau: tách module Gradle hoặc tách dịch vụ.
- **Tiêu chí 4: Không mặc định cấm monolith, lý do gắn với bài toán. ĐẠT.** Agent vẫn dùng monolith (một lần deploy, một database) và giải thích bằng quy mô ước lượng: 5–7 nhóm chức năng, 1–4 lập trình viên, vài đến vài chục cửa hàng. Agent cũng nêu rõ vì sao bỏ cả hai cực: tách nhiều dịch vụ thì quá nặng, monolith không chia module thì khó mở rộng.

KẾT QUẢ: ĐẠT

---

## Câu 4

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: trang demo cho khách nhập số tiền vay, lãi suất, số tháng, ra bảng trả góp từng tháng. Dùng để chào hàng trong một tuần, không lưu gì, không đăng nhập. Hãy thiết kế lời giải.

### Agent trả lời

Em đã viết xong bản thiết kế. Có 3 điểm trong yêu cầu đã duyệt chưa ghi rõ (mục 0), chị chốt giúp em trước khi làm. Em chưa viết code.

File: `docs/thiet-ke/20261124-demo-tra-gop.md`

---

# Thiết kế: Trang demo bảng trả góp

**Trạng thái:** chờ người quản lý duyệt.
**Cỡ việc:** web đơn giản, chỉ có frontend, làm trong khoảng 3 giờ.

## 0. Cần chị chốt trước khi làm (3 câu)
1. **Tính trả góp theo cách nào?**
   Em đề xuất làm cả 2 cách, có nút gạt cho khách chọn:
   - (a) **Trả đều mỗi tháng:** gốc cộng lãi cố định, lãi tính trên dư nợ giảm dần. Đây là cách mặc định.
   - (b) **Gốc đều, lãi giảm dần.**

   Ngân hàng ở Việt Nam dùng cả hai cách, nên lúc chào hàng có nút so sánh thì dễ thuyết phục khách hơn. Làm thêm cách (b) mất khoảng 20 phút. Nếu chị chỉ cần một cách thì em làm cách (a).
2. **Lãi suất nhập theo %/năm hay %/tháng?** Em đề xuất %/năm, vì ngân hàng thường công bố theo năm. Lãi tháng = lãi năm / 12.
3. **Giới hạn các ô nhập?** Em đề xuất:
   - Số tiền vay: từ 1 triệu đến 100 tỷ đồng.
   - Lãi suất: từ 0 đến 50 %/năm.
   - Số tháng: số nguyên từ 1 đến 360.

## 1. Cấu trúc dự án
Trang này chỉ cần frontend, vì:
- Không lưu dữ liệu, không đăng nhập, không có dữ liệu riêng tư.
- Chỉ có một công thức tính, chạy ngay trong trình duyệt là đủ.
- Chỉ dùng 1 tuần rồi bỏ.

Trang gồm 2 phần:
- `src/lib/amortization.ts`: các hàm tính, không phụ thuộc giao diện.
- Giao diện Vue: `LoanForm.vue` (form nhập), `ScheduleTable.vue` (bảng), `App.vue`.

## 2. Công nghệ đề xuất (chị chọn)

| Phần | Đề xuất | Lý do |
|---|---|---|
| Giao diện | Vue 3 + Vite + TypeScript | Vue là công nghệ chị quen dùng. Em không dùng Nuxt vì trang này không cần SSR, không cần chuyển trang, không cần server. |
| Test | Vitest kèm đo độ phủ | Chạy chung với Vite, test nhanh phần tính toán. |
| Hiển thị tiền | `Intl.NumberFormat('vi-VN')` | Có sẵn trong trình duyệt, không phải cài thêm thư viện. |
| Giao diện | CSS thuần | Chỉ có một màn hình, không cần bộ giao diện có sẵn (UI kit). |
| Đưa lên mạng | Hosting tĩnh miễn phí: Netlify, Vercel hoặc GitHub Pages | Không cần máy chủ, hết tuần thì gỡ. **Chị chọn nơi đưa lên.** |

## 3. Kiến trúc: lợi và hại

| | Trước mắt | Khi dự án lớn lên |
|---|---|---|
| **Lợi** | Làm trong khoảng 3 giờ. Build dưới 5 giây. Người mới đọc hiểu trong khoảng 10 phút. Đưa lên mạng miễn phí. Không có dữ liệu nên không có rủi ro bảo mật. | Phần tính toán nằm riêng. Sau này cần backend thì chuyển phần đó sang (hoặc viết lại bằng Java) mà không phải sửa giao diện. |
| **Hại** | Ai mở trình duyệt cũng xem được công thức tính. Với bản demo thì chấp nhận được. | Không lưu được hồ sơ, không có đăng nhập. Muốn thành sản phẩm thật thì phải thêm backend. |

**Khi nào nên đổi:** khi cần lưu hồ sơ vay, nhiều nhân viên dùng chung, có phân quyền, hoặc công thức là bí mật kinh doanh. Lúc đó thêm backend Java, và chuyển giao diện sang Nuxt nếu cần nhiều trang.

## 4. Tổng quan giao diện
Chỉ có 1 màn hình. Em ưu tiên hiển thị tốt trên điện thoại, vì người chào hàng thường cầm máy đưa khách xem. Từ trên xuống dưới:

- **Tiêu đề:** "Tính trả góp khoản vay".
- **Form nhập:**
  - Ô số tiền tự thêm dấu chấm ngăn cách hàng nghìn.
  - Có ô lãi suất %/năm, ô số tháng, và nút gạt chọn cách tính.
  - Kết quả tự tính lại ngay khi nhập, không cần bấm nút.
  - Nhập sai thì báo lỗi tiếng Việt ngay dưới ô.
- **Tóm tắt:** số tiền trả mỗi tháng (hoặc trả tháng đầu, nếu tính theo cách gốc đều), tổng lãi, tổng phải trả.
- **Bảng trả góp:**
  - Gồm các cột: Tháng | Gốc | Lãi | Tổng trả | Dư nợ còn lại.
  - Có dòng tổng ở cuối.
  - Trên điện thoại, bảng cuộn ngang và cột Tháng đứng yên.
- **Chân trang:** "Kết quả chỉ mang tính tham khảo".

## 5. Dữ liệu chính
Không có cơ sở dữ liệu. Dữ liệu chỉ nằm trong trình duyệt:
- `LoanInput { principal, annualRatePct, months, method }`
- `ScheduleRow { month, principal, interest, payment, balance }`
- `ScheduleResult { rows, totalInterest, totalPayment }`

Công thức:
- Ký hiệu: P là số tiền vay, n là số tháng, r là lãi tháng (lãi năm / 12).
- Cách (a): số tiền trả mỗi tháng M = P·r / (1 − (1+r)^−n). Nếu lãi suất bằng 0 thì M = P / n.
- Cách (b): gốc mỗi tháng = P / n. Lãi mỗi tháng = dư nợ đầu tháng × r.

Mọi số làm tròn đến đồng. Tháng cuối trả nốt phần còn lại, để tổng gốc đúng bằng số tiền vay và dư nợ cuối về đúng 0.

## 6. Hạn chế
- Chưa tính phí trả trước hạn, phí hồ sơ, bảo hiểm khoản vay, lãi thả nổi hay thời gian ân hạn trả gốc.
- Số tiền tháng cuối có thể lệch vài đồng so với các tháng khác, do làm tròn. Em sẽ ghi chú dưới bảng.
- Trang không in và không xuất file được. Nếu chị cần nút "In / Lưu PDF" thì em làm thêm khoảng 15 phút.
- Còn một cách khác là làm một file HTML duy nhất, gửi qua Zalo là mở được. Cách này nhanh hơn một chút nhưng khó viết unit test đạt chuẩn, nên em không đề xuất.

## 7. Kế hoạch test
Viết unit test bằng Vitest cho `amortization.ts`, độ phủ trên 80%:

| Tiêu chí | Test |
|---|---|
| Bảng có đúng số tháng | Thử n = 1, 12, 360 |
| Cách (a) tính đúng | Vay 100 triệu, lãi 12%/năm, 12 tháng thì trả khoảng 8.884.879 đ/tháng (đối chiếu với hàm `PMT` của Excel) |
| Cách (b) tính đúng | Gốc mỗi tháng = P / n. Lãi tháng 1 = P × r. Lãi giảm dần qua các tháng. |
| Tổng gốc bằng tiền vay, dư nợ cuối bằng 0 | Thử nhiều bộ số, kể cả số chia không hết |
| Lãi suất 0% | Không lỗi chia cho 0, tổng lãi bằng 0 |
| Dòng tổng khớp | Tổng lãi và tổng trả bằng tổng các dòng cộng lại |
| Chặn nhập sai | Số âm, số 0, số tháng không nguyên, vượt giới hạn, bỏ trống: báo lỗi, không ra bảng |

Kiểm tay chỉ làm sau khi unit test đã chạy qua hết:
- Mở trên điện thoại thật và Chrome máy tính.
- Nhập số tiền có dấu chấm.
- Cuộn bảng 360 dòng.
- Xem thông báo lỗi hiện đúng chỗ.

## 8. Thời gian và chia việc
Tổng cộng khoảng 3 giờ:
- **1 agent làm** (khoảng 2,5 giờ): dựng dự án và file `CLAUDE.md`, viết phần tính toán kèm unit test, làm giao diện, đưa lên mạng.
- **1 agent review độc lập** (khoảng 20 phút): agent này không tham gia làm, chỉ đọc code và kết quả test, xếp lỗi thành 2 mức "chặn" và "nên sửa". Lỗi ở cả hai mức đều sửa ngay trong PR đó, trên nhánh `feat/loan-schedule-demo`.

Em không chia nhỏ hơn: việc nhỏ mà tách ra nhiều agent thì tốn thời gian bàn giao hơn là tiết kiệm được.

---

Chị cần chốt giúp em:
1. Câu 1: làm cả 2 cách tính, hay chỉ cách (a)?
2. Câu 2: lãi suất nhập theo %/năm, đúng không ạ?
3. Câu 3: giới hạn ô nhập như em đề xuất được không?
4. Công nghệ: dùng Vue 3 + Vite như em đề xuất, hay chị muốn dùng Nuxt?
5. Nơi đưa lên mạng: Netlify, Vercel hay GitHub Pages?

Chị duyệt xong thì em bắt đầu làm.

### Chấm

- **Chọn chỉ frontend, có lý do: ĐẠT.** Mục 1 chọn "chỉ cần frontend" và nêu đủ ba lý do: không lưu dữ liệu, không đăng nhập, chỉ một công thức chạy trong trình duyệt, chỉ dùng một tuần.
- **Không dựng backend cho phép tính: ĐẠT.** Phép tính đặt trong `src/lib/amortization.ts` chạy ở trình duyệt. Backend chỉ được nhắc như hướng mở rộng sau này, có điều kiện ("Khi nào nên đổi"), không nằm trong lời giải.
- **Bản thiết kế ngắn, tương xứng việc nhỏ, ước lượng vài giờ: ĐẠT.** Mỗi mục chỉ vài dòng, ước lượng tổng khoảng 3 giờ, nằm trong giới hạn một ngày. Phần thêm cách tính (b) và nút in chỉ nêu như tùy chọn kèm số phút, không tự ý mở rộng phạm vi. Bản này hơi dài so với một demo 3 giờ, nhưng chưa đến mức trượt.
- **Chia việc gọn (1-2 agent): ĐẠT.** Có 1 agent làm và 1 agent review độc lập. Bản thiết kế còn nói rõ lý do không chia nhỏ hơn: tốn thời gian bàn giao.
- **Trình như đề xuất chờ người quản lý chọn: ĐẠT.** Trạng thái ghi "chờ người quản lý duyệt", agent "chưa viết code". Các điểm mở (cách tính, đơn vị lãi suất, giới hạn ô nhập, Vue hay Nuxt, nơi đưa lên mạng) đều được trình thành câu hỏi để chốt.

KẾT QUẢ: ĐẠT

---

## Câu 5

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: phòng khám muốn bệnh nhân nhập mã phiếu và ngày sinh để xem kết quả xét nghiệm của mình. Nhân viên phòng khám tải kết quả lên. Khoảng 200 lượt tra cứu mỗi ngày. Hãy thiết kế lời giải.

### Agent trả lời

Yêu cầu đã duyệt nên bước tiếp theo là **thiết kế lời giải**. Trong `docs/thiet-ke/` đã có sẵn bản nháp `20261124-tra-cuu-ket-qua-xet-nghiem.md`, không do tôi viết trong phiên này. Tôi đã đọc và đối chiếu với các mục bắt buộc của bước thiết kế, thấy đủ và dùng được. Tôi thêm một hạn chế còn thiếu ở mục 6 (kẻ xấu có thể cố ý làm khoá mã của bệnh nhân). Tôi không lưu được thay đổi này vào file vì chưa được cấp quyền ghi, nên dòng đó hiện chỉ có trong nội dung bên dưới. Nếu người quản lý cấp quyền, tôi sẽ ghi vào file.

---

# Thiết kế: Tra cứu kết quả xét nghiệm

Trạng thái: **ĐỀ XUẤT, chờ người quản lý duyệt.** Chưa viết code.

Yêu cầu đã duyệt: bệnh nhân nhập mã phiếu và ngày sinh để xem kết quả xét nghiệm của mình. Nhân viên phòng khám tải kết quả lên. Khoảng 200 lượt tra cứu mỗi ngày.

## 0. Giả định cần xác nhận (ảnh hưởng thiết kế)
Bản tóm tắt chưa nói 3 điểm dưới đây. Thiết kế đang theo phương án đề xuất. Người quản lý gật hoặc sửa, cần thì mang đi hỏi khách.

| # | Câu hỏi | Đề xuất đang dùng | Nếu khác thì |
|---|---|---|---|
| 1 | Mã phiếu lấy từ đâu? | Hệ thống **sinh mã ngẫu nhiên 10 ký tự** (vd `K7QM-2XPA-9D`) khi nhân viên tải kết quả. Nhân viên ghi hoặc in mã cho bệnh nhân. | Nếu dùng mã sẵn có của phòng khám mà là số tăng dần (dễ đoán) thì cần thêm một lớp nữa: mã PIN 4 số in trên phiếu. |
| 2 | Kết quả ở dạng gì? | **File PDF** (xuất từ phần mềm xét nghiệm hoặc bản scan). Bệnh nhân xem trên web và tải về. | Nếu nhân viên nhập từng chỉ số thì cần thêm bảng chỉ số và màn nhập, mất thêm khoảng 2 ngày. |
| 3 | Cho tra cứu trong bao lâu? Nhân viên có tài khoản riêng không? | Cho tra cứu **90 ngày** rồi tự ẩn (dữ liệu vẫn lưu). **Mỗi nhân viên một tài khoản**, có 2 vai: Quản trị và Nhân viên. | Đổi số ngày chỉ là sửa cấu hình. |

## 1. Cấu trúc dự án
**Có backend**, vì đủ cả 4 điều kiện:
- **Lưu dữ liệu dùng chung:** nhân viên tải lên, bệnh nhân đọc.
- **Bảo mật:** kết quả xét nghiệm là dữ liệu sức khoẻ, thuộc dữ liệu cá nhân nhạy cảm. Máy chủ phải tự kiểm mã và ngày sinh, chặn dò mã và phân quyền nhân viên.
- **Logic nghiệp vụ:** sinh mã, khoá khi nhập sai nhiều lần, hết hạn tra cứu, ghi nhật ký.
- **Có thể mở rộng:** thông báo qua SMS/Zalo, nối với phần mềm xét nghiệm.

Các phần và cách nối:
```
Trình duyệt (bệnh nhân / nhân viên)
        │ HTTPS
     Nginx  ── phục vụ frontend tĩnh (Nuxt) + chuyển /api sang backend
        │
  Backend Spring Boot (REST API) ── PostgreSQL (dữ liệu + file PDF)
```
Cây thư mục chính:
```
/
├─ backend/  (Spring Boot) src/main/java/.../
│   ├─ lookup/  tra cứu của bệnh nhân, chống dò, token xem file
│   ├─ result/  tải lên, sửa, ẩn kết quả
│   ├─ auth/    đăng nhập nhân viên, tài khoản, phân quyền
│   ├─ audit/   nhật ký tra cứu và thao tác
│   └─ common/  lỗi, cấu hình
├─ frontend/ (Nuxt) pages/: index.vue (tra cứu), ket-qua.vue, quan-tri/
├─ deploy/   docker-compose, nginx.conf, script backup
└─ docs/
```

## 2. Công nghệ đề xuất (chờ người quản lý chọn)
| Phần | Đề xuất | Lý do gắn với yêu cầu |
|---|---|---|
| Backend | Java 21 + Spring Boot 3, Spring Security | Mặc định của người quản lý, dễ bảo trì lâu dài. Spring Security có sẵn đăng nhập, băm mật khẩu và phân quyền, đều cần cho dữ liệu y tế. |
| Frontend | Nuxt 3, chế độ SPA (không SSR) | Mặc định của người quản lý. Trang không cần SEO (không muốn bị Google index), nên SPA tĩnh là đủ và deploy đơn giản. |
| Database | PostgreSQL 16, file PDF lưu trong cột `bytea` | Ràng buộc chặt (mã không trùng). Một bản backup gồm cả dữ liệu lẫn file, hai thứ không bị lệch nhau. |
| Chống dò mã | Bucket4j (giới hạn tốc độ) + Cloudflare Turnstile (captcha), chỉ bật sau 3 lần sai | Captcha miễn phí, không làm phiền người nhập đúng ngay lần đầu. |
| Chạy | 1 VPS (ưu tiên đặt tại Việt Nam) + Docker Compose, HTTPS bằng Let's Encrypt | 200 lượt/ngày rất nhỏ, một máy 2 vCPU/4GB dư sức. Chi phí ước 200–400 nghìn đồng/tháng. |
| Test | JUnit 5, Mockito, Testcontainers, JaCoCo, Vitest, Playwright | Đáp ứng yêu cầu unit test phủ trên 80%. |

## 3. Kiến trúc: một backend chia module + một frontend
Ước lượng cỡ dự án: khoảng 7 màn hình, 15 API, 1–2 người bảo trì. Dự án nhỏ và ổn định.

| | Lợi | Hại |
|---|---|---|
| Tốc độ làm | Nhanh: 1 repo, 1 lần deploy, không phải lo giao tiếp giữa các dịch vụ. | — |
| Thời gian build | Dưới 1–2 phút ở cỡ này. | Nếu thêm nhiều chức năng (vd thành hệ thống quản lý phòng khám đầy đủ), build chậm dần. |
| Người mới | Đọc theo module `lookup/ result/ auth/ audit/` là hiểu. Quy tắc: module chỉ gọi nhau qua service, không đọc bảng của module khác. | Không giữ quy tắc này thì code sẽ dính chùm vào nhau. Lúc review phải kiểm điểm này. |
| Deploy | Một lệnh `docker compose up`. | Phần tra cứu và phần quản trị chạy chung, lỗi nặng ở quản trị có thể làm sập tra cứu. Chấp nhận được ở mức 200 lượt/ngày. |
| Chi phí | Chỉ 1 VPS. | Một máy là điểm hỏng duy nhất. Dựa vào backup hằng ngày, mất tối đa 1 ngày dữ liệu. |
| File trong DB | Đơn giản, backup một chỗ. | DB phình theo số file: khoảng 60MB/ngày, khoảng 20GB/năm. |

**Khi nào đổi kiến trúc:**
- DB vượt khoảng 50GB hoặc backup mất hơn 30 phút: chuyển file sang object storage riêng tư, DB chỉ giữ đường dẫn.
- Phòng khám có nhiều ứng dụng dùng chung dữ liệu, hoặc tra cứu vượt khoảng 10.000 lượt/ngày: tách phần tra cứu thành dịch vụ riêng.
- Cần chạy không gián đoạn: thêm máy thứ hai và bản sao DB.

## 4. Tổng quan giao diện
**Bệnh nhân** (chủ yếu dùng điện thoại, thiết kế cho điện thoại trước):
1. **Tra cứu** (`/`):
   - Logo phòng khám, ô *Mã phiếu*, ô *Ngày sinh* gồm 3 ô ngày/tháng/năm.
   - Ảnh nhỏ chỉ vị trí mã trên phiếu, nút *Xem kết quả*.
   - Captcha chỉ hiện sau 3 lần sai.
   - Nhập sai thì báo **một câu chung**, không nói sai ô nào, để chống dò mã.
   - Bị khoá thì báo thời gian thử lại và số điện thoại phòng khám.
2. **Kết quả** (`/ket-qua`):
   - Tên che bớt (`Nguyễn V. A.`), ngày xét nghiệm, khung xem PDF, nút *Tải về* và *Thoát*.
   - Đường dẫn không chứa mã. Sau 10 phút, tải lại trang sẽ quay về màn Tra cứu.

**Nhân viên** (dùng máy tính tại quầy):

3. **Đăng nhập.**
4. **Danh sách kết quả:**
   - Các cột: mã, họ tên, ngày sinh, ngày xét nghiệm, trạng thái (Đang cho xem / Đã ẩn / Hết hạn / Đang khoá).
   - Có tìm kiếm, lọc theo ngày, nút *Tải kết quả mới*.
5. **Tải kết quả mới:**
   - Nhập họ tên, ngày sinh, ngày xét nghiệm, chọn file PDF (tối đa 10MB).
   - **Bước xác nhận:** xem trước PDF cạnh họ tên và ngày sinh để đối chiếu.
   - Xác nhận xong thì hiện mã to và nút *In phiếu mã*.
6. **Chi tiết kết quả:** *Thay file*, *Ẩn / Hiện lại*, *Mở khoá*, xem nhật ký tra cứu của mã này.
7. **Tài khoản** (chỉ Quản trị): thêm, khoá nhân viên, đặt lại mật khẩu.

**Luồng:**
- Bệnh nhân: 1 → 2.
- Nhân viên: 3 → 4 → 5 → in mã, hoặc 4 → 6.
- Quản trị: thêm 4 → 7.

Bước xác nhận ở màn 5 có vì rủi ro thực tế lớn nhất là **tải nhầm file của người này cho người khác**.

## 5. Dữ liệu chính
```
staff_user   id, username (không trùng), password_hash (bcrypt), full_name,
             role (ADMIN|STAFF), active, created_at
test_result  id, ticket_code (không trùng, ngẫu nhiên), patient_name, birth_date, test_date,
             file_data (bytea), file_name, file_size, content_type (chỉ PDF),
             status (ACTIVE|HIDDEN), visible_until (= ngày tải + 90 ngày),
             failed_attempts, locked_until, uploaded_by → staff_user, uploaded_at, updated_by, updated_at
lookup_log   id, ticket_code_input, result_id (null nếu sai), success, ip, user_agent, created_at
audit_log    id, staff_id → staff_user, action (UPLOAD|REPLACE_FILE|HIDE|SHOW|UNLOCK…), result_id, created_at
```
Quan hệ: một nhân viên tải nhiều kết quả, một kết quả có nhiều dòng nhật ký tra cứu.

**Luồng tra cứu ở máy chủ:**
1. Bệnh nhân gửi `POST /api/lookup`. Máy chủ kiểm giới hạn theo IP (10 lần/phút), rồi tìm theo mã, so ngày sinh, kiểm hạn, trạng thái và khoá.
2. Nếu sai: tăng bộ đếm. Sai 5 lần liền thì khoá mã đó 15 phút. Luôn trả một lỗi chung.
3. Nếu đúng: trả token ký HMAC, hết hạn sau 10 phút.
4. Trình duyệt gọi `GET /api/lookup/file` với token đó để lấy PDF. Máy chủ gửi kèm `Cache-Control: no-store` để trình duyệt không lưu bản sao.

## 6. Hạn chế của thiết kế
- **Mã phiếu và ngày sinh vẫn là xác thực yếu.** Ai cầm được phiếu là xem được kết quả, nhưng đây đúng là yêu cầu của khách. Cách mạnh hơn là gửi OTP qua SMS/Zalo (khoảng 500–800đ/tin, phải thu số điện thoại). Đề xuất để sau.
- **(Mới thêm) Khoá mã có thể bị lợi dụng.** Người biết mã của người khác có thể cố tình nhập sai để bệnh nhân thật bị chặn 15 phút. Chấp nhận được vì khoá tự mở và nhân viên có thể mở khoá. Nếu xảy ra thường xuyên thì đổi sang chỉ khoá theo IP kèm captcha.
- **Không báo cho bệnh nhân khi có kết quả.** Bệnh nhân phải tự vào xem.
- **Nhân viên tải tay từng file**, chưa nối với phần mềm xét nghiệm.
- **Một máy chủ, backup hằng ngày.** Sự cố có thể mất tối đa 1 ngày dữ liệu tải lên, nhưng file gốc vẫn còn ở phòng khám nên tải lại được.
- **Pháp lý:** dữ liệu sức khoẻ là dữ liệu cá nhân nhạy cảm theo quy định của Việt Nam. Phòng khám cần tự kiểm nghĩa vụ về thông báo, sự đồng ý của bệnh nhân và nơi đặt máy chủ.
- **Chưa có staging.** Kiểm trên máy local và Docker trước khi người quản lý bấm deploy.

## 7. Kế hoạch test
| Tiêu chí | Test | Loại |
|---|---|---|
| Đúng mã + đúng ngày sinh thì thấy kết quả | Tra cứu đúng thì nhận token, dùng token tải được đúng PDF | Unit + API (Testcontainers) |
| Sai thì không xem được, không lộ ô nào sai | Sai mã, sai ngày sinh, sai cả hai đều trả cùng mã lỗi và cùng câu báo | Unit + API |
| Chống dò mã | Sai 5 lần thì khoá 15 phút; quá 10 lần/phút/IP thì trả 429; sau 3 lần sai thì bắt captcha | Unit + API |
| Chỉ người tra đúng mới tải được file | Không có token, token hết hạn hoặc bị sửa đều trả 401 | Unit + API |
| Kết quả ẩn hoặc quá 90 ngày thì không tra được | Tra cứu trả lỗi chung | Unit |
| Nhân viên tải kết quả lên | PDF hợp lệ thì sinh mã không trùng (thử 10.000 lần); không phải PDF hoặc quá 10MB thì từ chối | Unit + API |
| Chỉ nhân viên mới vào được quản trị | Chưa đăng nhập thì trả 401; Nhân viên gọi API tài khoản thì trả 403 | API |
| Có nhật ký | Mỗi lần tra cứu và mỗi thao tác của nhân viên ghi 1 dòng | Unit |
| Chịu được 200 lượt/ngày | 20 người dùng đồng thời, 95% yêu cầu trả lời dưới 1 giây | Test tải trước phát hành |
| Hai luồng chính chạy trên trình duyệt | Bệnh nhân tra cứu rồi xem PDF; nhân viên đăng nhập, tải lên, in mã | E2E (Playwright) |

Unit test phủ trên 80% cho các module backend. Chỉ kiểm tay trên Android và iPhone thật sau khi test xanh.

## 8. Ước lượng thời gian và chia việc cho agent
Tổng khoảng **4–5 ngày làm việc**, đã gồm các lượt duyệt.

| Bước | Agent | Việc | Thời gian |
|---|---|---|---|
| 1 | Agent nền | Khởi tạo repo, docker-compose, schema DB (Flyway), hợp đồng API (OpenAPI) | 0,5 ngày |
| 2a | Agent backend | 4 module kèm test | 1,5–2 ngày, **chạy song song với 2b** |
| 2b | Agent frontend | 7 màn, gọi API theo hợp đồng, dùng mock khi backend chưa xong | 1,5 ngày |
| 3 | Agent backend hoặc frontend | Ghép nối, test E2E, test tải | 0,5 ngày |
| 4 | Agent review độc lập (không làm bước 1–3) | Soát bảo mật và quy tắc module | 0,5 ngày |
| 5 | Người quản lý | Kiểm tay, bấm deploy | — |

---
**Cần người quản lý quyết trước khi viết code:**
1. Gật hoặc sửa 3 giả định ở mục 0: mã do hệ thống sinh, kết quả là file PDF, cho tra cứu 90 ngày và mỗi nhân viên một tài khoản.
2. Duyệt công nghệ (mục 2) và kiến trúc (mục 3).
3. Chấp nhận các hạn chế ở mục 6, nhất là chưa dùng OTP.

### Chấm

**Tiêu chí 1: Chọn có backend, lý do có nhắc bảo mật dữ liệu riêng tư.** ĐẠT. Mục 1 chọn có backend. Lý do ghi rõ kết quả xét nghiệm là "dữ liệu sức khoẻ, thuộc dữ liệu cá nhân nhạy cảm", nên máy chủ phải tự kiểm mã và ngày sinh, chặn dò mã và phân quyền nhân viên.

**Tiêu chí 2: Không để dữ liệu kết quả hay khoá bí mật nằm ở frontend.** ĐẠT. Máy chủ đối chiếu mã và ngày sinh, ký token HMAC rồi trả PDF qua `GET /api/lookup/file` kèm `no-store`. Frontend chỉ là SPA tĩnh, không chứa dữ liệu kết quả hay khoá ký.

**Tiêu chí 3: Có hạn chế của thiết kế.** ĐẠT. Mục 6 nêu 7 hạn chế cụ thể, gồm xác thực yếu, khoá mã bị lợi dụng, không báo cho bệnh nhân khi có kết quả, một máy chủ, pháp lý và chưa có staging. Mỗi hạn chế có cách xử lý hoặc lý do chấp nhận.

**Tiêu chí 4: Chọn kiến trúc bằng lý do từ chính bài toán, có bảng lợi và hại, không viện dẫn dự án khác.** ĐẠT. Mục 3 lấy lý do từ chính bài toán: khoảng 7 màn hình, 15 API, 1–2 người bảo trì và 200 lượt mỗi ngày. Bảng lợi và hại có 6 dòng, kèm các ngưỡng cụ thể để đổi kiến trúc. Câu trả lời không nhắc chuyện monolith ở dự án nào khác. Bảo mật không được nêu thẳng trong bảng kiến trúc, nhưng có ở dòng rủi ro phần quản trị làm sập tra cứu và ở mục 1, nên vẫn đạt.

Ghi chú ngoài tiêu chí: agent nói rõ bản nháp không do nó viết trong phiên và nó chưa ghi được phần sửa vào file. Cách báo này trung thực, không ảnh hưởng điểm.

KẾT QUẢ: ĐẠT

