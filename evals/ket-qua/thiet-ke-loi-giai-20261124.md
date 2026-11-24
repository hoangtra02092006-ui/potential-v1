# Kết quả chạy thử thiet-ke-loi-giai (24/11/2026)

- Lượt 1: đạt 5/5 với bộ đề ban đầu.
- Người quản lý góp ý: agent chỉ đề xuất, người quản lý quyết; web đơn giản phải gọn, xong trong vài giờ, chia agent hợp lý; skill đang thiên về chuyện monolith. Sửa skill, thêm tiêu chí vào câu 1, 3, 4, 5.
- Lượt 2: đạt 4/5. Câu 5 trượt vì agent viện dẫn chuyện monolith ở dự án cũ. Sửa skill; chạy lại câu 3, 5: đạt.
- Lượt 3, sau khi thêm phần tham khảo (kiểu kiến trúc, bản đồ module, hợp đồng API, ADR): đạt 5/5. Bản dưới đây là lượt 3.

---

## Câu 1

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: khách bán sỉ cà phê hạt cho quán. Màn danh sách đơn (mã đơn, tên quán, sản phẩm, số kg, tổng tiền, trạng thái, ngày giao; lọc theo khoảng ngày, xuất Excel các cột đang hiện). Quy trình: sale tạo đơn → kho đóng gói → shipper giao → thu tiền khi giao, mỗi bước đổi trạng thái. Khoảng 5 nhân viên dùng chung. Hãy thiết kế lời giải.

### Agent trả lời

Tôi đã soạn xong bản thiết kế, kèm 5 bản ghi quyết định (ADR) đang ở trạng thái **Đề xuất**. Dự án chưa có CLAUDE.md hay tài liệu kiến trúc nào nên tôi thiết kế từ đầu. **Tôi dừng ở đây chờ người quản lý duyệt, chưa viết code.**

Có 3 câu cần hỏi khách ở mục 0. Mỗi câu đã kèm phương án đề xuất, và cả bản thiết kế đang làm theo các đề xuất đó. Nếu khách chọn khác thì chỉ phải sửa những chỗ đã ghi.

File đã lưu:
- `docs/thiet-ke/20261124-quan-ly-don-si-ca-phe.md`
- `docs/adr/001-java-spring-boot-vue3.md` … `005-docker-compose-mot-vps.md`

---

# Thiết kế: Quản lý đơn sỉ cà phê hạt

Trạng thái: **Đề xuất, chờ người quản lý duyệt**. Ngày: 2026-11-24.

## 0. Cần người quản lý chốt trước khi làm (3 câu, mỗi câu có đề xuất)

1. **Đơn có những trạng thái nào?** Đề xuất 4 trạng thái: `Mới tạo` (sale) → `Đã đóng gói` (kho) → `Đang giao` (shipper nhận hàng đi) → `Đã giao, đã thu tiền` (shipper xác nhận). Giao và thu tiền gộp một bước vì yêu cầu ghi "thu tiền khi giao". Nếu khách cần tách hai việc này (vd quán hẹn trả sau) thì thêm 1 trạng thái.
2. **Ai được đổi trạng thái nào?** Đề xuất mỗi người một tài khoản, gắn vai:
   - Sale tạo đơn và được sửa khi đơn còn `Mới tạo`.
   - Kho chỉ bấm `Đã đóng gói`.
   - Shipper chỉ bấm `Đang giao` và `Đã giao, đã thu tiền`.
   - Quản trị làm được mọi bước.

   Nếu khách muốn ai cũng bấm được hết thì bỏ phần kiểm vai, nhưng vẫn giữ đăng nhập để biết ai đã bấm.
3. **Một đơn có mấy sản phẩm?** Đề xuất một sản phẩm mỗi đơn, khớp với cột "sản phẩm, số kg" trên màn danh sách. Nếu quán hay đặt nhiều loại một lần thì đơn có nhiều dòng, cột sản phẩm hiện "Arabica 10kg; Robusta 5kg". Làm thêm khoảng nửa ngày.

Các giả định khác (không cần hỏi):
- Lọc khoảng ngày theo **ngày giao**.
- Đơn giá lấy sẵn từ giá sản phẩm, sale sửa được, và lưu vào đơn. Sau này đổi giá sản phẩm thì đơn cũ vẫn đúng.
- Tiền tính bằng VND, số kg cho phép 2 chữ số thập phân.

## 1. Cấu trúc dự án tổng quan

**Có backend**, vì:
- 5 người dùng chung một bộ đơn, cần lưu database.
- Có nghiệp vụ thật: quy trình trạng thái, chặn nhảy cóc bước, tính tổng tiền.
- Có phân quyền theo vai, và dữ liệu doanh thu của khách không được lộ ra ngoài.

**Ai dùng hệ thống:** Sale, Kho, Shipper, Quản trị, dùng trình duyệt trên máy tính hoặc điện thoại. Bản này không nối với hệ thống ngoài nào.

**Các phần chạy riêng:**
```
Trình duyệt ─HTTPS─> Nginx ─(file tĩnh)─ Web Vue 3 (SPA)
                       │ /api/*
                       ▼
                 API Spring Boot ─JDBC─> PostgreSQL
                 (tạo file .xlsx khi xuất Excel, trả thẳng về, không lưu lại)
```
Cả ba phần chạy bằng Docker Compose trên một máy chủ.

**Bản đồ module (backend):**

| Module | Lo việc gì | Phụ thuộc |
|---|---|---|
| `auth` | Đăng nhập, tài khoản, vai | — |
| `catalog` | Quán và sản phẩm cà phê, giá | — |
| `orders` | Đơn, tổng tiền, chuyển trạng thái, lịch sử trạng thái, lọc danh sách | `auth`, `catalog` |
| `export` | Xuất Excel theo bộ lọc và các cột đang hiện | `orders` |

Phụ thuộc đi một chiều. `export` lấy dữ liệu qua hàm truy vấn công khai của `orders`, không đọc thẳng bảng.

**Cây thư mục chính:**
```
backend/   src/main/java/.../{auth,catalog,orders,export,common}   (mỗi module: web → service → repository)
           src/main/resources/db/migration/   (Flyway)
frontend/  src/{pages,components,api,stores}
docs/      thiet-ke/  adr/  api/openapi.yaml
docker-compose.yml   CLAUDE.md
```

## 2. Công nghệ đề xuất (người quản lý chọn)

| Phần | Đề xuất | Lý do |
|---|---|---|
| Backend | Java 21 + Spring Boot 3 | Người quản lý quen nên tự bảo trì được. Spring Security lo đăng nhập và kiểm vai, Bean Validation kiểm dữ liệu vào, Apache POI xuất .xlsx đúng kiểu số và ngày. |
| Frontend | Vue 3 + Vite (SPA), **không dùng Nuxt** | Đây là công cụ nội bộ dùng sau đăng nhập, không cần SEO hay render phía máy chủ là điểm mạnh của Nuxt. Dùng SPA thì Nginx phục vụ file tĩnh là đủ, ít phần phải chạy hơn. |
| Database | PostgreSQL 16 + Flyway | Đơn và tiền cần giao dịch chặt, các truy vấn lọc đơn giản, miễn phí. Flyway quản lý thay đổi cấu trúc bảng. |
| Đăng nhập | Session cookie (Spring Security) | Chỉ 5 người và một ứng dụng nên không cần JWT. Khoá tài khoản có hiệu lực ngay. |
| Hosting | Docker Compose trên 1 VPS (2 vCPU, 2–4 GB RAM) | Đủ cho 5 người. Chạy giống nhau trên máy Windows (Docker Desktop) và trên máy chủ. Sao lưu `pg_dump` hằng ngày. |

## 3. Kiến trúc: một khối chia module, trong mỗi module phân lớp

Ước lượng cỡ dự án: khoảng 4 module, 6 màn hình, 5 người dùng, 1–2 người phát triển. Sau này có thể thêm công nợ, báo cáo doanh thu, tồn kho.

| Tiêu chí | Lợi | Hại |
|---|---|---|
| Tốc độ làm | Một repo backend, một lần deploy, làm bản đầu nhanh | Phải giữ ranh giới module ngay từ đầu |
| Thời gian build | Hiện dưới 1 phút | Thêm công nợ, tồn kho thì build vẫn chung một khối, chậm dần |
| Dễ hiểu cho người mới | Mở `orders/` là thấy hết phần đơn | Nếu module đọc thẳng bảng của nhau thì dần thành khối rối |
| Deploy | 3 container, một lệnh `docker compose up` | Sửa nhỏ cũng phải deploy lại cả backend (gián đoạn vài giây) |
| Chi phí | 1 VPS, khoảng 150–300 nghìn đồng/tháng | — |

Các hướng đã cân nhắc nhưng không chọn:
- Tách thành nhiều dịch vụ: thừa với 5 người dùng, tốn công vận hành.
- Chỉ frontend, dữ liệu để trên Google Sheet: không kiểm được quy trình và quyền.

**Khi nào nên đổi:** khi một module cần chạy hoặc mở rộng riêng (vd app cho quán tự đặt hàng) thì tách module đó ra. Ranh giới module hiện tại đã là sẵn đường tách.

## 4. Tổng quan giao diện

| Màn hình | Ai dùng | Nội dung |
|---|---|---|
| Đăng nhập | Tất cả | Tên đăng nhập, mật khẩu |
| **Danh sách đơn** (màn chính) | Tất cả | Lọc theo từ ngày – đến ngày (ngày giao) và trạng thái. Bảng có 7 cột: mã đơn, tên quán, sản phẩm, số kg, tổng tiền, trạng thái (nhãn màu), ngày giao. Nút "Chọn cột" để bật tắt cột, máy nào nhớ lựa chọn của máy đó. Nút "Xuất Excel" xuất đúng các cột đang hiện theo bộ lọc đang áp. Mỗi trang 50 dòng. Mỗi dòng có nút bước tiếp theo, chỉ hiện với vai được phép. |
| Tạo / sửa đơn | Sale, Quản trị | Chọn quán (gõ để tìm), sản phẩm, số kg, đơn giá (điền sẵn), ngày giao, ghi chú. Tổng tiền tự tính. Chỉ sửa được khi đơn còn `Mới tạo`. |
| Chi tiết đơn | Tất cả | Thông tin đơn, lịch sử trạng thái (ai đổi, lúc nào), nút bước tiếp theo |
| Danh mục quán và sản phẩm | Sale, Quản trị | Thêm, sửa, ẩn quán và sản phẩm. Cần có để tạo được đơn. |
| Tài khoản | Quản trị | Thêm tài khoản, khoá, gán vai, đặt lại mật khẩu |

Luồng đi: Đăng nhập → Danh sách đơn → Tạo đơn, hoặc Chi tiết đơn → đổi trạng thái → quay về danh sách. Kho và shipper hầu như chỉ dùng màn danh sách: lọc theo trạng thái của mình rồi bấm một nút. Trên điện thoại, bảng thu lại thành dạng thẻ cho shipper dễ bấm.

## 5. Dữ liệu chính
```
users(id, username UNIQUE, password_hash, full_name, role[ADMIN|SALE|WAREHOUSE|SHIPPER], is_active)
customers(id, name, phone, address, is_active)
products(id, name, unit_price_vnd_per_kg BIGINT, is_active)
orders(id, code UNIQUE, customer_id, product_id, quantity_kg NUMERIC(10,2) > 0,
       unit_price_vnd BIGINT, total_vnd BIGINT,
       status[CREATED|PACKED|SHIPPING|DELIVERED_PAID], delivery_date DATE,
       note, created_by, created_at, updated_at, version)
order_status_history(id, order_id, from_status, to_status, changed_by, changed_at)
```
- Tổng tiền `total_vnd = round(kg × đơn giá)`, tính ở backend và lưu lại.
- Mã đơn dạng `DH-YYMMDD-001`.
- Cột `version` dùng để chặn hai người cùng đổi một đơn: người bấm sau nhận lỗi 409 và thấy trạng thái mới.
- Chỉ mục `(delivery_date, status)` cho việc lọc.
- Nếu câu 3 chọn nhiều sản phẩm mỗi đơn thì tách phần sản phẩm, số kg, đơn giá sang bảng `order_items`.

## 6. Hợp đồng API

Viết thành `docs/api/openapi.yaml` trước khi code. Mọi lỗi trả về cùng một dạng: `{ "error": { "code", "message", "details" } }`.

Mã lỗi:
- 400: dữ liệu sai
- 401: chưa đăng nhập
- 403: sai vai
- 404: không tìm thấy
- 409: đơn vừa bị người khác đổi
- 422: sai nghiệp vụ (nhảy cóc bước, sửa đơn đã đóng gói, xuất quá giới hạn)
- 500: lỗi máy chủ, không lộ chi tiết bên trong

| Endpoint | Vào → Ra | Vai |
|---|---|---|
| `POST /api/auth/login`, `POST /logout`, `GET /me` | username, password → user | — |
| `GET/POST/PUT /api/customers` | name, phone, address, isActive | đọc: tất cả; ghi: SALE, ADMIN |
| `GET/POST/PUT /api/products` | name, unitPriceVndPerKg, isActive | đọc: tất cả; ghi: SALE, ADMIN |
| `GET /api/orders?deliveryFrom&deliveryTo&status&page&size&sort` | → `{items:[{id, code, customerName, productName, quantityKg, totalVnd, status, deliveryDate, version}], page, size, totalItems}` | tất cả |
| `GET /api/orders/{id}` | → đơn + statusHistory | tất cả |
| `POST /api/orders`, `PUT /api/orders/{id}` | customerId, productId, quantityKg, unitPriceVnd, deliveryDate, note (+version khi sửa) | SALE, ADMIN |
| `POST /api/orders/{id}/transitions` | toStatus, version → đơn | theo vai của bước |
| `GET /api/orders/export?…&columns=code,customerName,…` | → file .xlsx | tất cả |
| `GET/POST/PUT /api/users` | username, fullName, role, isActive, password | ADMIN |

Cách xuất Excel:
- Xuất **toàn bộ** đơn khớp bộ lọc, không chỉ trang đang xem, theo đúng thứ tự cột gửi lên.
- Số kg và tiền là ô số, ngày giao là ô ngày.
- Tối đa 20.000 dòng mỗi lần; quá thì trả 422.
- Tên cột lạ trả 400.

## 7. Hạn chế của thiết kế này
- Chưa có huỷ đơn, giao thiếu, trả hàng, thu tiền một phần. Gặp thật thì quản trị phải sửa tay, nên nhiều khả năng cần thêm sớm.
- Nếu giữ một sản phẩm mỗi đơn: quán đặt 2 loại thì sale phải tạo 2 đơn.
- Chưa có thông báo: kho phải tự mở danh sách để thấy đơn mới. Hướng khác: tự tải lại danh sách mỗi 30 giây, hoặc nhắn Zalo khi có đơn mới.
- Chỉ một máy chủ, không dự phòng. Nếu chỉ sao lưu hằng ngày thì khi hỏng có thể mất tối đa 1 ngày dữ liệu.
- Xuất Excel tạo file trong bộ nhớ. Vượt 20.000 dòng thì cần đổi sang ghi dạng luồng (SXSSF).

## 8. Ngoài phạm vi
- Công nợ, báo cáo doanh thu, tồn kho: yêu cầu chưa nhắc tới, kiến trúc đã chừa chỗ thêm.
- Huỷ đơn, trả hàng: chưa có trong quy trình đã duyệt.
- App điện thoại, thông báo Zalo, in phiếu giao, nhập đơn hàng loạt từ Excel: chưa được yêu cầu.

## 9. Ranh giới cho agent khi làm
- **Luôn làm:**
  - Viết OpenAPI trước rồi code theo đó.
  - Chạy unit test trước khi commit.
  - Đổi database qua migration Flyway mới.
  - Kiểm vai ở backend, không chỉ ẩn nút trên giao diện.
  - Làm trên nhánh `feat/<tên>` và mở PR.
- **Hỏi người quản lý trước:**
  - Đổi bảng đã chạy migration thật.
  - Thêm thư viện ngoài danh sách ở mục 2.
  - Đổi hợp đồng API đã thống nhất.
  - Thêm trạng thái hoặc vai mới.
- **Không bao giờ:**
  - Đưa mật khẩu hay khoá bí mật vào code (dùng `.env`, không commit file này).
  - Xoá hoặc tắt test đang lỗi.
  - Sửa migration đã chạy.
  - Push thẳng lên `main`.
  - Xoá dữ liệu thật.

## 10. Kế hoạch test

| Tiêu chí | Test |
|---|---|
| Danh sách đủ 7 cột | Unit test API danh sách đơn; kiểm tay màn hình |
| Lọc khoảng ngày | Unit test: lấy cả hai ngày đầu và cuối, từ ngày > đến ngày trả 400, chỉ chọn một đầu vẫn lọc đúng |
| Xuất Excel các cột đang hiện | Unit test: đúng cột, đúng thứ tự, đúng số dòng, ô số và ô ngày đúng kiểu, cột lạ trả 400, quá giới hạn trả 422. Kiểm tay mở file bằng Excel trên Windows |
| Quy trình 4 bước | Unit test: mọi bước hợp lệ đi được, nhảy cóc hoặc đi lùi trả 422, mỗi lần đổi ghi một dòng lịch sử |
| Đúng vai đổi đúng bước | Unit test theo từng vai: được phép thì 200, không được thì 403 |
| 5 người dùng chung | Unit test hai người đổi cùng một `version`: người sau nhận 409 |
| Tổng tiền | Unit test với kg lẻ (2,5 kg × 185.000) và cách làm tròn |
| Chỉ sửa đơn khi `Mới tạo` | Unit test sửa đơn đã đóng gói trả 422 |

Độ phủ test trên 80% cho `orders`, `export`, `auth` và các controller. Chỉ kiểm tay sau khi test đã xanh. Review cuối do một agent độc lập, không tham gia code.

## 11. Ước lượng thời gian và chia việc cho agent

| Bước | Agent | Song song | Thời gian |
|---|---|---|---|
| 1. Khung dự án, Docker Compose, CLAUDE.md, migration, `openapi.yaml` | A | Làm trước để khoá hợp đồng API | 2–3 giờ |
| 2a. Backend `auth`, `catalog`, `orders` + test | B | Song song | 4–6 giờ |
| 2b. Backend `export` + test | C | Song song | 2 giờ |
| 2c. Frontend 6 màn theo OpenAPI (dùng dữ liệu giả đến khi backend xong) | D | Song song | 5–7 giờ |
| 3. Ghép các phần, kiểm tay trên Docker Desktop Windows | A | — | 1–2 giờ |
| 4. Review độc lập, sửa lỗi chặn ngay trong PR | E review; B, C, D sửa | — | 2–3 giờ |

**Tổng: khoảng 1,5–2 ngày làm việc**, chưa tính thời gian duyệt và hỏi khách. Nếu chọn nhiều sản phẩm mỗi đơn thì cộng thêm khoảng nửa ngày.

---

# ADR (đều ở trạng thái Đề xuất, ngày 2026-11-24)

**ADR-001: Java Spring Boot cho backend, Vue 3 SPA cho frontend**
- **Bối cảnh:** công cụ nội bộ cho 5 người, có phân vai, quy trình trạng thái và xuất Excel. Người quản lý quen Java và Vue, sẽ tự bảo trì.
- **Quyết định:** Java 21 + Spring Boot 3 (Spring Security, Bean Validation, Apache POI); Vue 3 + Vite dạng SPA.
- **Đã cân nhắc:**
  - Nuxt: không cần SEO hay render phía máy chủ, lại thêm một tiến trình Node phải chạy.
  - NestJS: người quản lý không quen bằng Java.
- **Hệ quả:** bảo trì dễ, có sẵn thư viện; đổi lại backend tốn RAM hơn (khoảng 300–500 MB). Xem lại nếu đổi người bảo trì.

**ADR-002: PostgreSQL**
- **Bối cảnh:** đơn và tiền cần giao dịch chặt, nhiều người đổi trạng thái cùng lúc.
- **Quyết định:** PostgreSQL 16, đổi cấu trúc qua Flyway, sao lưu `pg_dump` hằng ngày.
- **Đã cân nhắc:**
  - MySQL: dùng được tương đương, đổi được nếu người quản lý quen hơn.
  - Google Sheet: không kiểm được quy trình và quyền.
- **Hệ quả:** miễn phí, ổn định, nhưng phải tự lo sao lưu. Xem lại khi cần nhiều máy chủ.

**ADR-003: Một khối chia module theo nghiệp vụ**
- **Quyết định:** một ứng dụng chia 4 module, trong mỗi module phân lớp web → service → repository. Module gọi nhau qua service công khai, phụ thuộc đi một chiều.
- **Đã cân nhắc:**
  - Phân lớp toàn cục: nhanh lúc đầu, về sau khó tìm code.
  - Tách dịch vụ: thừa với cỡ này.
- **Hệ quả:** một lần deploy, dễ hiểu; build chậm dần khi lớn. Xem lại khi một module cần chạy riêng.

**ADR-004: Đăng nhập bằng session cookie**
- **Quyết định:** Spring Security form login; cookie HttpOnly, Secure, SameSite; chống CSRF; mật khẩu băm bcrypt; chỉ quản trị tạo tài khoản.
- **Đã cân nhắc:**
  - JWT: chỉ hợp khi có nhiều ứng dụng hoặc app điện thoại gọi API.
  - Đăng nhập Google: chưa biết nhân viên có tài khoản Google công ty không.
- **Hệ quả:** đơn giản, mặc định an toàn. Xem lại khi có app điện thoại.

**ADR-005: Docker Compose trên một VPS**
- **Quyết định:** 3 container (nginx + web, backend, postgres) trên VPS 2 vCPU, 2–4 GB RAM; sao lưu ra ngoài máy chủ.
- **Đã cân nhắc:** PaaS như Render, Railway: ít việc vận hành nhưng đắt hơn và phụ thuộc nhà cung cấp.
- **Hệ quả:** rẻ (khoảng 150–300 nghìn đồng/tháng), nhưng không có máy dự phòng.

---

**Người quản lý cần làm tiếp:**
1. Mang 3 câu ở mục 0 đi hỏi khách.
2. Chọn công nghệ ở mục 2 và các ADR, hoặc sửa nếu muốn khác.
3. Duyệt bản thiết kế.

Có kết quả rồi tôi cập nhật thiết kế (nếu khách chọn khác đề xuất) và chuyển sang bước tiếp theo.

### Chấm

- **Chọn có backend, lý do gắn với lưu dữ liệu / nhiều người dùng / quy trình — ĐẠT:** Mục 1 chọn có backend với đủ ba lý do: 5 người dùng chung một bộ đơn nên cần database, có quy trình trạng thái không cho nhảy cóc bước, và có phân quyền theo vai.
- **Có đủ cấu trúc dự án, công nghệ có lý do, tổng quan giao diện, hạn chế — ĐẠT:** Bản thiết kế có cấu trúc dự án (sơ đồ các phần, bảng module, cây thư mục), bảng công nghệ kèm lý do từng phần, bảng 6 màn hình ghi rõ ai dùng và hiện gì, và mục 7 nêu hạn chế cụ thể.
- **Có bảng lợi và hại của kiến trúc được chọn — ĐẠT:** Mục 3 có bảng lợi/hại theo 5 tiêu chí cho kiến trúc một khối chia module, nêu thêm các hướng đã cân nhắc nhưng không chọn và khi nào nên đổi.
- **Có ước lượng thời gian và cách chia việc cho agent — ĐẠT:** Mục 11 chia việc cho 5 agent (A–E), ghi bước nào chạy song song, giờ cho từng bước và tổng 1,5–2 ngày, kèm phần cộng thêm nếu khách đổi phạm vi.
- **Không viết code; trình như đề xuất, dừng chờ người quản lý quyết — ĐẠT:** Agent chỉ viết tài liệu thiết kế, ADR và sơ đồ dữ liệu ở mức phác thảo, không có code. Mọi phần đều ghi là "Đề xuất", agent nói rõ dừng chờ duyệt và liệt kê việc người quản lý cần làm tiếp.

KẾT QUẢ: ĐẠT

---

## Câu 2

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: trang giới thiệu một quán cà phê gồm ảnh quán, menu, giờ mở cửa, địa chỉ có bản đồ. Chủ quán tự gửi nội dung, vài tháng mới đổi một lần. Không có đặt bàn, không có form, không lưu gì. Hãy thiết kế lời giải.

### Agent trả lời

Tôi đã viết xong bản thiết kế, đang ở trạng thái **Đề xuất**. Tôi dừng ở đây chờ anh/chị duyệt và chưa viết code.

File: `docs/thiet-ke/20261124-trang-gioi-thieu-quan-ca-phe.md` và `docs/adr/001-nuxt-static-cloudflare-pages.md`

---

# Thiết kế: Trang giới thiệu quán cà phê

## 1. Cấu trúc dự án: chỉ có frontend
Trang chỉ để xem. Không lưu dữ liệu, không có xử lý nghiệp vụ, không có dữ liệu riêng tư. Bản đồ nhúng Google Maps không cần khoá API. Không có lý do nào để làm backend.

```
Khách (điện thoại / máy tính) ──HTTPS──► Hosting tĩnh (HTML/ảnh đã build) ──nhúng──► Google Maps
Chủ quán ──gửi nội dung (Zalo)──► Người quản lý / agent ──sửa quan.json + ảnh──► PR ──merge──► tự build & deploy
```

```
cafe-site/
├── content/quan.json   # TOÀN BỘ nội dung: tên, menu, giờ, địa chỉ
├── public/images/      # ảnh đã nén
├── components/         # Hero, Gallery, Menu, OpeningHours, Location, Footer
├── utils/content.ts    # kiểm tra nội dung hợp lệ, định dạng giờ và giá
├── pages/index.vue
└── tests/
```
Điểm chính: **nội dung để riêng, giao diện để riêng**. Khi đổi menu hay giờ mở cửa, chỉ sửa một file JSON, không đụng vào giao diện.

## 2. Công nghệ đề xuất (anh/chị chọn)
| Phần | Đề xuất | Lý do |
|---|---|---|
| Framework | **Nuxt 3, build tĩnh** | Đúng bộ công nghệ Vue/Nuxt anh/chị quen. Trang build sẵn thành HTML nên Google đọc được nội dung và mở nhanh trên điện thoại |
| Nội dung | 1 file `quan.json` | Vài tháng mới đổi một lần, chưa đáng làm trang quản trị (CMS) |
| Ảnh | `@nuxt/image` | Ảnh chủ quán gửi thường nặng vài MB, cần tự thu nhỏ |
| Bản đồ | Google Maps nhúng + nút "Chỉ đường" | Miễn phí, không cần khoá API |
| Hosting | Cloudflare Pages (hoặc Netlify) | Miễn phí, tự build khi merge, có sẵn HTTPS |
| Test | Vitest | Dùng chung bộ công cụ với Nuxt |

## 3. Kiến trúc: một trang tĩnh, lợi và hại
| | Trước mắt | Khi dự án lớn lên |
|---|---|---|
| **Lợi** | Làm khoảng 3 giờ. Build dưới 1 phút. Người mới đọc 1 file JSON và 6 component là hiểu hết. Không có server nên không có gì để sập. Hosting 0 đ | Muốn thêm trang hay thêm tiếng Anh thì chỉ cần thêm trang hoặc thêm trường trong JSON |
| **Hại** | Có bước build và thư mục `node_modules`. Chủ quán không tự sửa được nội dung | Nếu cần đặt bàn, form hoặc đổi menu hằng ngày thì phải thêm CMS hoặc backend |

Trang sẽ không lớn thêm nhiều: 1 trang, 5–6 khối, 1 người làm.

**Khi nào nên đổi:**
- Chủ quán muốn tự sửa, hoặc đổi nội dung hằng tuần: thêm Decap CMS (vẫn không cần server).
- Có đặt bàn, form hoặc lưu dữ liệu: cần làm bản thiết kế mới có backend.

## 4. Giao diện
Một trang cuộn dọc, ưu tiên điện thoại. Thanh menu dính trên cùng, bấm vào là nhảy tới từng khối.
- **Đầu trang:** ảnh bìa, tên quán, một câu giới thiệu, hai nút "Xem menu" và "Chỉ đường".
- **Ảnh quán:** lưới 6–9 ảnh, bấm để phóng to.
- **Menu:** chia theo nhóm (Cà phê, Trà, Bánh…). Mỗi món có tên và giá; mô tả và ảnh thì có cũng được, không có cũng được.
- **Giờ mở cửa:** bảng theo các thứ trong tuần, tô đậm ngày hôm nay.
- **Địa chỉ:** địa chỉ bằng chữ, bản đồ nhúng, nút "Chỉ đường", số điện thoại bấm là gọi.
- **Chân trang:** link Facebook, Instagram, Zalo.

## 5. Dữ liệu
Không có database. Toàn bộ nằm trong `quan.json`:
`Quan { ten, gioiThieu, dienThoai, mangXaHoi[], anhBia, anhQuan[], menu: NhomMon[]{ten, mon[]{ten, gia, moTa?, anh?}}, gioMoCua[]{thu, mo, dong, nghi?}, diaChi{chu, linkGoogleMaps, nhungBanDo} }`

## 6. Hợp đồng API
Không có.

## 7. Hạn chế
- Chủ quán không tự sửa được. Chấp nhận được vì vài tháng mới đổi một lần.
- Nếu chủ quán đổi giá mà quên báo thì trang sẽ ghi sai giá. Đề xuất ghi dòng "Cập nhật: tháng/năm" dưới menu.
- Nếu Google Maps bị chặn thì vẫn còn địa chỉ bằng chữ và nút "Chỉ đường".
- Hướng khác là viết HTML thuần: nhẹ hơn, nhưng nội dung trộn lẫn với giao diện, sửa menu dễ làm vỡ bố cục, và không đúng bộ công nghệ anh/chị quen.

## 8. Ngoài phạm vi
- Đặt bàn, form, lưu dữ liệu: yêu cầu đã loại.
- Trang quản trị cho chủ quán: chưa cần.
- Đa ngôn ngữ, blog: yêu cầu chưa có.

## 9. Ranh giới cho agent
- **Luôn làm:**
  - Chạy test và build trước khi commit.
  - Nén ảnh trước khi đưa vào dự án.
  - Mọi nội dung lấy từ `quan.json`, không gõ cứng vào component.
  - Kiểm trên khung màn hình điện thoại.
- **Hỏi anh/chị trước khi:**
  - Thêm thư viện ngoài danh sách ở mục 2.
  - Thêm trường mới vào cấu trúc nội dung.
  - Đổi hosting hoặc tên miền.
  - Sửa nội dung thay chủ quán.
- **Không bao giờ:**
  - Bịa giá, giờ mở cửa hay địa chỉ. Chủ quán chưa gửi thì để trống và báo thiếu.
  - Dùng ảnh không phải của quán mà không ghi rõ là ảnh tạm.
  - Đưa khoá bí mật vào code.
  - Xoá test đang lỗi.

## 10. Kế hoạch test
| Tiêu chí | Test |
|---|---|
| Nội dung đủ và đúng kiểu (giá là số dương, đủ 7 ngày, có địa chỉ) | Unit test `utils/content.ts` chạy trên file thật và trên các trường hợp thiếu hoặc sai. Nội dung sai thì build dừng |
| Giờ mở cửa đúng, tô đúng hôm nay | Unit test hàm định dạng giờ, dùng một ngày cố định để kiểm |
| Menu đủ món, giá hiển thị kiểu VNĐ | Unit test hàm định dạng giá và component Menu |
| Ảnh quán | Test component Gallery. Kiểm tay mỗi ảnh dưới 300 KB |
| Bản đồ và chỉ đường | Kiểm tay trên điện thoại thật |
| Dùng tốt trên điện thoại | Kiểm tay sau khi unit test đã xanh, trên Android và iPhone. Lighthouse mobile từ 90 điểm trở lên |

Độ phủ test của `utils/` trên 80%.

## 11. Thời gian và chia việc
Khoảng **3 giờ**, tính từ lúc đã có đủ nội dung và ảnh.
- **1 agent làm**, khoảng 2,5 giờ, làm tuần tự. Việc nhỏ, chia ra nhiều agent chỉ tốn thêm công phối hợp.
- **1 agent review độc lập**, khoảng 20 phút.
- **Anh/chị:** kiểm tay trên điện thoại, gửi link cho chủ quán xem, rồi bấm deploy production.

## ADR-001 (Đề xuất)
Chọn Nuxt 3 build tĩnh, nội dung trong 1 file JSON, deploy lên Cloudflare Pages.
- **Đã loại:**
  - HTML thuần: nội dung trộn lẫn giao diện.
  - Thêm CMS: thừa khi vài tháng mới đổi.
  - Làm backend: không có lý do cần.
- **Khi nào xem lại:** chủ quán muốn tự sửa, nội dung đổi hằng tuần, hoặc cần đặt bàn hay form.

---

## Cần anh/chị chốt
1. **Tên miền:** đề xuất mua tên miền riêng (khoảng 300–500 nghìn/năm, chủ quán trả). Nếu chưa muốn thì tạm dùng tên miền miễn phí của hosting.
2. **Ai cập nhật nội dung:** đề xuất chủ quán gửi qua Zalo, anh/chị giao agent sửa và tạo PR, mỗi lần khoảng 15 phút.
3. **Ảnh:** đề xuất chủ quán gửi ảnh gốc, ít nhất 6 ảnh quán và 1 ảnh bìa. Nếu chưa có thì dùng ảnh tạm, ghi rõ là ảnh tạm, và thay trước khi phát hành.

### Chấm

- **Tiêu chí 1: ĐẠT.** Mục 1 chọn chỉ làm frontend và nêu đủ ba lý do: trang chỉ để xem, không lưu dữ liệu, không có xử lý nghiệp vụ. Mục 2 nói thêm nội dung vài tháng mới đổi một lần, tức là nội dung tĩnh.
- **Tiêu chí 2: ĐẠT.** Backend, database và trang quản trị/CMS không bị coi là bắt buộc. Câu trả lời ghi rõ "Không có database", "Hợp đồng API: Không có", ADR đã loại backend. CMS và backend chỉ được nhắc ở phần "Khi nào nên đổi", "Ngoài phạm vi" và hướng mở rộng.
- **Tiêu chí 3: ĐẠT.** Mục 4 mô tả giao diện theo từng khối: đầu trang, ảnh quán, menu, giờ mở cửa, địa chỉ kèm bản đồ, chân trang. Mục 7 có phần hạn chế riêng, nêu cụ thể: chủ quán không tự sửa được, giá có thể sai nếu chủ quán quên báo, Google Maps có thể bị chặn, và so sánh với cách viết HTML thuần.

KẾT QUẢ: ĐẠT

---

## Câu 3

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: web quản lý theo dõi lượng tiêu dùng của khách hàng cho một chuỗi cửa hàng. Bản đầu: ghi nhận giao dịch, xem lịch sử tiêu dùng từng khách. Khách đã nói sẽ thêm dần tích điểm, khuyến mãi, báo cáo theo cửa hàng, và có thể thuê thêm lập trình viên. Hãy thiết kế lời giải.

### Agent trả lời

Em đã thiết kế xong và đang **dừng để chờ chị duyệt**. Em chưa viết code.

Em đã lưu 1 bản thiết kế và 5 bản ghi quyết định (ADR) trong thư mục `docs/`:
- `docs/thiet-ke/20261124-theo-doi-tieu-dung.md`
- `docs/adr/001` đến `005`, đều ở trạng thái Đề xuất

Dưới đây là toàn bộ nội dung.

---

# Thiết kế: Web theo dõi tiêu dùng khách hàng cho chuỗi cửa hàng (bản 1)

## 0. Giả định cần xác nhận
Bản tóm tắt chưa nói rõ 3 điều dưới đây. Em đề xuất sẵn từng điều để chị chỉ cần gật hoặc sửa. Nếu giả định nào sai thì chỉ phải sửa phần dữ liệu và màn hình liên quan, kiến trúc giữ nguyên.
1. **Nhận diện khách bằng số điện thoại**, mỗi số là một khách trong toàn chuỗi. Tên khách không bắt buộc.
2. **Giao dịch chỉ ghi tổng tiền**, ngày giờ, cửa hàng và ghi chú, không ghi từng món. Ghi từng món thì phải làm thêm danh mục sản phẩm, đó là việc lớn hơn nhiều.
3. **Có 2 vai trò:** nhân viên (STAFF) gắn với một cửa hàng và tự nhập giao dịch; quản lý chuỗi (ADMIN) xem được tất cả. Bản 1 không nối với máy bán hàng (POS).

## 1. Cấu trúc dự án
**Có backend**, vì đủ cả 4 điều kiện:
- Phải lưu dữ liệu, nhiều cửa hàng dùng chung một danh sách khách.
- Có nghiệp vụ thật: giao dịch, sau này thêm tích điểm và khuyến mãi.
- Dữ liệu riêng tư (số điện thoại, chi tiêu) và phải phân quyền theo cửa hàng.
- Khách đã báo sẽ mở rộng và thuê thêm lập trình viên.

**Ngữ cảnh:** nhân viên cửa hàng và quản lý chuỗi cùng dùng web. Bản 1 không nối hệ thống ngoài nào.

**Container:** Trình duyệt → Vue 3 SPA (file tĩnh) → gọi qua HTTPS, dữ liệu JSON, cookie phiên → API Spring Boot (một tiến trình, chia module) → PostgreSQL.

**Bản đồ module**

| Module | Lo việc gì | Phụ thuộc | Bản 1 |
|---|---|---|---|
| identity | Đăng nhập, tài khoản nhân viên, vai trò | stores | Có |
| stores | Danh sách cửa hàng | — | Có |
| customers | Thông tin khách, tra theo số điện thoại | — | Có |
| transactions | Ghi giao dịch, huỷ giao dịch, lịch sử | customers, stores | Có |
| loyalty | Tích điểm | transactions (nghe sự kiện), customers | Sau |
| promotions | Khuyến mãi | customers, stores | Sau |
| reports | Báo cáo theo cửa hàng | transactions, stores (chỉ đọc) | Sau |

- Phụ thuộc chỉ đi một chiều. Module gọi nhau qua interface công khai, không đọc thẳng bảng của nhau.
- Module `transactions` phát 2 sự kiện `TransactionRecorded` và `TransactionVoided`. Khi làm tích điểm, module tích điểm chỉ cần nghe 2 sự kiện này, **không phải sửa module giao dịch**.
- Ranh giới module được kiểm tự động bằng test (`ApplicationModules.verify()` của Spring Modulith).

**Cây thư mục:**
- `backend/` gồm các module `identity/`, `stores/`, `customers/`, `transactions/` (mỗi module có `api/`, `internal/`, `web/`) và `shared/`; file đổi cấu trúc database ở `db/migration` (Flyway).
- `frontend/` gồm `pages/`, `components/`, `api/`, `stores/`.
- `docs/` gồm `thiet-ke/`, `adr/`, `api/openapi.yaml`.

## 2. Công nghệ đề xuất (chờ chị chọn)

| Phần | Đề xuất | Lý do |
|---|---|---|
| Backend | Java 21 + Spring Boot 3 + Spring Modulith | Đúng công nghệ chị hay dùng. Modulith giữ ranh giới module bằng test, hợp với việc thêm dần chức năng và thêm người. |
| Database | PostgreSQL + Flyway | Dữ liệu tiền cần toàn vẹn. Báo cáo theo cửa hàng sau này là truy vấn gộp, Postgres làm tốt. Flyway lưu mỗi lần đổi bảng thành một file có số thứ tự, người mới đọc là biết lịch sử. |
| Frontend | Vue 3 + Vite + Pinia + PrimeVue | **Khác mặc định Nuxt:** đây là web nội bộ, mọi màn đều sau đăng nhập, không cần SEO. SPA build nhanh và deploy chỉ là file tĩnh. Nếu chị muốn giống các dự án khác thì dùng Nuxt `ssr:false`, gần như không tốn thêm công. |
| Đăng nhập | Spring Security, phiên lưu ở máy chủ, cookie HttpOnly | Khoá được ngay tài khoản của nhân viên nghỉ việc. Chỉ có một frontend nên chưa cần JWT. |
| API và test | OpenAPI (springdoc); JUnit 5 + Testcontainers; Vitest; JaCoCo | Frontend và backend làm song song theo cùng hợp đồng API. Test chạy trên Postgres thật. |

## 3. Kiến trúc: modular monolith, trong mỗi module dùng phân lớp
Ước lượng cỡ dự án: bản 1 có khoảng 4 module, 15 endpoint, 5 màn hình. Khi đủ tích điểm, khuyến mãi, báo cáo thì khoảng 7 module, 40–60 endpoint, 2–4 người làm.

| Phương diện | Trước mắt | Khi lớn lên |
|---|---|---|
| Tốc độ làm | Nhanh: 1 repo, chạy 1 lệnh | Mỗi người làm 1 module, ít đụng code nhau |
| Thời gian build | Vài chục giây | Tăng theo cả khối; giảm được bằng chạy test theo module. Nếu quá 5 phút thì xem lại kiến trúc |
| Người mới | Mất khoảng nửa ngày để hiểu cách chia module và sự kiện | Chỉ cần đọc 1 module và interface của module nó gọi |
| Deploy | 1 file jar + file tĩnh + 1 database | Vẫn deploy 1 lần. **Hại:** lỗi một module có thể làm sập cả web, không deploy riêng từng phần được |
| Chi phí | 1 máy chủ nhỏ | Vẫn rẻ, không tốn chi phí vận hành nhiều dịch vụ |
| Kỷ luật | Phải đặt code đúng module | Nếu bỏ test ranh giới thì dễ thành một khối rối, nên CI bắt buộc chạy test này |

**Khi nào đổi kiến trúc:** khi có đội cần deploy riêng, hoặc báo cáo làm chậm việc nhập giao dịch. Lúc đó tách `reports` thành dịch vụ riêng trước, đọc từ bản sao database. Vì các module chỉ nói chuyện qua interface và sự kiện nên tách ra không phải viết lại.

## 4. Tổng quan giao diện

| Màn | Ai dùng | Nội dung chính |
|---|---|---|
| Đăng nhập | Mọi người | Tài khoản, mật khẩu |
| **Ghi giao dịch** (màn mặc định của nhân viên) | STAFF, ADMIN | Ô số điện thoại to ở trên cùng. Gõ xong hiện tên khách, tổng chi tiêu, lần mua gần nhất. Khách mới thì tạo ngay tại chỗ. Bên dưới: số tiền, ngày giờ (mặc định là bây giờ), ghi chú, nút Lưu. Lưu xong form tự xoá để nhập khách tiếp. |
| Danh sách khách | STAFF, ADMIN | Tìm theo số điện thoại hoặc tên. Bảng: tên, số điện thoại, tổng chi tiêu, số lần mua, lần mua gần nhất. Có phân trang. |
| **Lịch sử tiêu dùng của khách** | STAFF, ADMIN | Đầu trang: tổng chi tiêu, số lần mua, ngày mua đầu và cuối. Lọc theo khoảng ngày, cửa hàng. Bảng giao dịch; giao dịch đã huỷ bị gạch ngang. Nút Huỷ có hỏi lý do. |
| Quản lý cửa hàng và nhân viên | ADMIN | Tab cửa hàng và tab nhân viên (gán cửa hàng, vai trò, khoá hoặc mở tài khoản) |

Luồng đi: Đăng nhập → Ghi giao dịch ⇄ Danh sách khách → Lịch sử khách. Màn Ghi giao dịch phải dùng tốt trên máy tính bảng ở quầy, ít thao tác nhất có thể.

## 5. Dữ liệu chính
```
stores(id, name, address, is_active, created_at)
staff_accounts(id, username, password_hash, role[ADMIN|STAFF], store_id, is_active)
customers(id, phone UNIQUE, name NULL, created_at, created_by)
transactions(id, customer_id, store_id, amount BIGINT VND >0, occurred_at, note,
             status[RECORDED|VOIDED], void_reason, voided_by, voided_at, created_by, created_at)
  index (customer_id, occurred_at DESC), (store_id, occurred_at)
```
- **Giao dịch không sửa, không xoá.** Nhập sai thì huỷ rồi ghi lại (ADR-005).
- Tiền lưu bằng số nguyên VND, không dùng số thực.
- Mỗi giao dịch có `store_id` ngay từ bản 1, nên khi làm báo cáo theo cửa hàng sẽ có dữ liệu đúng từ ngày đầu.
- Tổng chi tiêu tính trực tiếp bằng truy vấn. Khi dữ liệu lớn và truy vấn chậm thì thêm bảng tổng hợp.

## 6. Hợp đồng API
- Mọi lỗi trả cùng một dạng `{ "error": { "code", "message", "details" } }`.
- Mọi danh sách đều phân trang `?page=&size=`.

| Endpoint | Vào → Ra | Lỗi riêng |
|---|---|---|
| POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me | Đăng nhập, đăng xuất, thông tin người đang đăng nhập | 401 |
| GET /api/customers?q= | Danh sách khách kèm totalSpent, purchaseCount, lastPurchaseAt | — |
| GET /api/customers/by-phone/{phone} | Khách kèm tóm tắt chi tiêu | 404 |
| POST /api/customers · PATCH /api/customers/{id} | phone, name? → khách | 400 số điện thoại sai dạng, 409 số điện thoại đã có |
| GET /api/customers/{id}/transactions | from?, to?, storeId? → danh sách giao dịch | 404 |
| POST /api/transactions | customerId, amount, occurredAt?, note?, storeId (chỉ ADMIN) | 403 ghi cho cửa hàng khác, 422 số tiền ≤ 0 hoặc thời điểm ở tương lai |
| POST /api/transactions/{id}/void | reason | 403, 404, 409 đã huỷ rồi |
| /api/stores, /api/staff-accounts | Chỉ ADMIN được dùng | 403, 409 trùng tên đăng nhập |

- Nhân viên xem được mọi khách nhưng chỉ ghi và huỷ giao dịch của cửa hàng mình.
- Số điện thoại được chuẩn hoá ngay khi nhận (bỏ khoảng trắng, đổi +84 thành 0) trước khi lưu và tra.

## 7. Hạn chế của thiết kế
- Không ghi từng món nên không biết khách mua gì; khuyến mãi theo sản phẩm sau này sẽ phải thêm danh mục sản phẩm.
- Nhập tay nên có thể nhập thiếu hoặc trùng. Nếu chuỗi đã có POS thì nên cân nhắc nhận giao dịch thẳng từ POS.
- Toàn bộ deploy chung một khối, và chưa có môi trường staging.
- Tổng chi tiêu tính trực tiếp sẽ chậm khi có vài triệu giao dịch.
- Chưa có nhật ký thao tác đầy đủ, mới chỉ ghi người tạo và người huỷ giao dịch.

## 8. Ngoài phạm vi bản 1
- Tích điểm, khuyến mãi, báo cáo: để sau như khách đã hẹn. Bản 1 chỉ chuẩn bị sẵn chỗ nối (sự kiện giao dịch, `store_id`).
- App cho khách, gửi SMS/Zalo, nhập dữ liệu cũ từ Excel: chưa có yêu cầu.
- Quên mật khẩu: ADMIN đặt lại cho nhân viên.

## 9. Ranh giới cho agent khi làm
- **Luôn làm:**
  - Chạy test, kể cả test ranh giới module, trước khi commit.
  - Cập nhật `openapi.yaml` mỗi khi đổi API.
  - Đổi bảng bằng file migration mới, không sửa file migration cũ.
  - Kiểm quyền ở backend, không tin frontend.
- **Hỏi chị trước khi:** đổi bảng đã có, thêm thư viện, thêm module hoặc đổi phụ thuộc giữa module, đổi quy tắc phân quyền, cho phép sửa hoặc xoá giao dịch.
- **Không bao giờ:** đưa khoá bí mật vào code, ghi số điện thoại khách vào log, cho module đọc thẳng bảng của module khác, xoá hoặc tắt test đang lỗi.

## 10. Kế hoạch test

| Tiêu chí | Test |
|---|---|
| Ghi giao dịch cho khách cũ và khách mới | Unit test service + API test (Testcontainers) |
| Chặn số tiền ≤ 0, thời điểm ở tương lai, ghi cho cửa hàng khác | Unit test + API test 422/403 |
| Số điện thoại nhập nhiều dạng vẫn ra cùng một khách | Unit test hàm chuẩn hoá + API test 409 |
| Lịch sử đúng thứ tự, lọc đúng ngày và cửa hàng | API test với dữ liệu mẫu nhiều cửa hàng |
| Tổng chi tiêu bỏ qua giao dịch đã huỷ; huỷ 2 lần trả 409 | Unit test + API test |
| Phân quyền STAFF, ADMIN, chưa đăng nhập | API test cho từng endpoint |
| Ranh giới module không bị phá | `ApplicationModules.verify()` |
| Giao diện | Vitest cho form ghi giao dịch; kiểm tay trên máy tính bảng sau khi unit test xanh |

Độ phủ trên 80%; CI chặn nếu thấp hơn.

## 11. Ước lượng thời gian và chia việc cho agent
Tổng khoảng **3–4 ngày làm việc**, chưa tính thời gian chờ khách trả lời.

| Bước | Agent | Thời gian |
|---|---|---|
| 1. Khởi tạo dự án, CI, `openapi.yaml` | 1 agent | 0,5 ngày |
| 2a. Backend: identity + stores | Agent A, chạy song song với 2b, 2c | 0,5 ngày |
| 2b. Backend: customers + transactions | Agent B, song song | 1 ngày |
| 2c. Frontend: 5 màn hình, chạy trên API giả | Agent C, song song | 1–1,5 ngày |
| 3. Nối frontend với backend thật, kiểm tay | 1 agent | 0,5 ngày |
| 4. Review độc lập (không phải agent đã viết code) | 1 agent | 0,5 ngày |

Bước 2 chỉ chạy song song được sau khi `openapi.yaml` được duyệt.

---

# ADR (đều ở trạng thái Đề xuất, ngày 2026-11-24)

**ADR-001: Kiến trúc modular monolith, trong module dùng phân lớp**
- Bối cảnh: bản 1 nhỏ nhưng sẽ thêm 3 nhóm chức năng và 2–4 người làm.
- Quyết định: một ứng dụng Spring Boot chia module theo nghiệp vụ, ranh giới kiểm bằng Spring Modulith, module giao tiếp qua interface và sự kiện.
- Đã cân nhắc:
  - Phân lớp thuần: code các nghiệp vụ sẽ lẫn vào nhau khi thêm chức năng. Không chọn.
  - Microservices: vận hành quá nặng cho đội nhỏ. Không chọn.
- Hệ quả: làm nhanh, deploy đơn giản; nhưng build và deploy chung một khối. Xem lại khi build quá 5 phút hoặc có đội cần deploy riêng.

**ADR-002: Backend Java 21 + Spring Boot 3, database PostgreSQL + Flyway**
- Bối cảnh: dữ liệu tiền, nhiều cửa hàng ghi cùng lúc, sau này báo cáo gộp.
- Đã cân nhắc:
  - MySQL: chỉ chọn nếu hosting bắt buộc.
  - Node.js: lập trình viên thuê thêm dễ quen Java hơn.
- Hệ quả: dữ liệu toàn vẹn; nhưng Java tốn RAM hơn, máy chủ cần từ 1 GB RAM.

**ADR-003: Frontend Vue 3 + Vite (SPA), không dùng Nuxt SSR**
- Bối cảnh: web nội bộ, không cần SEO.
- Đã cân nhắc:
  - Nuxt SSR: không dùng tới SSR mà phải vận hành thêm máy chủ Node.
  - Nuxt `ssr:false`: chọn nếu chị muốn đồng bộ với các dự án khác.
- Hệ quả: build nhanh, deploy là file tĩnh; nhưng không có routing theo file và auto-import như Nuxt.

**ADR-004: Đăng nhập bằng phiên lưu ở máy chủ + cookie HttpOnly**
- Quyết định: Spring Session lưu trên Postgres; cookie HttpOnly, Secure, SameSite=Lax; 2 vai trò.
- Đã cân nhắc:
  - JWT: khó thu hồi, dễ lộ qua XSS.
  - Đăng nhập bằng Google/Zalo: nhân viên không chắc có tài khoản.
- Hệ quả: nếu sau này nối POS hoặc làm app thì cần thêm cách xác thực cho máy.

**ADR-005: Giao dịch chỉ ghi thêm, sửa sai bằng cách huỷ**
- Bối cảnh: tích điểm và báo cáo tính trên giao dịch; nếu giao dịch bị sửa ngầm thì điểm và báo cáo sai mà không truy được.
- Quyết định: không có API sửa hay xoá giao dịch; huỷ thì ghi người huỷ và lý do.
- Đã cân nhắc: cho sửa trực tiếp kèm nhật ký. Không chọn vì điểm phải tính lại và dễ lệch.
- Hệ quả: lịch sử đáng tin; nhân viên thêm một thao tác khi nhập sai.

---

**Cần chị quyết:**
1. Duyệt hoặc sửa 3 giả định ở mục 0. Nếu cần hỏi khách thì chị mang 3 câu này đi hỏi.
2. Chọn frontend: Vue SPA (em đề xuất) hay Nuxt `ssr:false`.
3. Duyệt kiến trúc và 5 ADR.

Chị duyệt xong em mới làm tiếp.

### Chấm

**Chấm theo từng tiêu chí**

1. **Bảng lợi và hại, có nói tới thời gian build và độ dễ hiểu cho người mới khi dự án lớn: ĐẠT.** Mục 3 có bảng chia hai cột "Trước mắt" và "Khi lớn lên". Dòng "Thời gian build" ghi rằng build tăng theo cả khối, giảm được bằng cách chạy test theo module, và quá 5 phút thì xem lại. Dòng "Người mới" ghi rằng khi lớn lên chỉ cần đọc một module và interface của module nó gọi. Bảng cũng ghi cả mặt hại, như sập cả web và không deploy riêng được.

2. **Không chọn monolith thuần chỉ vì làm nhanh, có cách chia theo module nghiệp vụ: ĐẠT.** Agent chọn modular monolith, có bảng 7 module nghiệp vụ, phụ thuộc chỉ đi một chiều và ranh giới được kiểm bằng `ApplicationModules.verify()`. Module tích điểm chỉ nghe sự kiện `TransactionRecorded` và `TransactionVoided`, và có `store_id` sẵn cho báo cáo. Như vậy thiết kế gắn trực tiếp với kế hoạch lớn lên.

3. **Có điều kiện hoặc thời điểm để chuyển kiến trúc: ĐẠT.** Agent nêu ba điều kiện: build quá 5 phút, có đội cần deploy riêng, hoặc báo cáo làm chậm việc nhập giao dịch. Agent cũng nói bước tách đầu tiên: đưa `reports` ra thành dịch vụ riêng, đọc từ bản sao database. Điều kiện này được nhắc lại trong ADR-001.

4. **Không mặc định cấm monolith, lý do gắn với bài toán: ĐẠT.** Agent vẫn chọn một khối deploy, với lý do là đội nhỏ, chi phí thấp và vận hành đơn giản. Agent loại phân lớp thuần vì code các nghiệp vụ sẽ lẫn vào nhau, loại microservices vì vận hành quá nặng cho đội nhỏ. Lý do nào cũng gắn với cỡ dự án (bản 1 khoảng 4 module, khi đủ chức năng khoảng 7 module và 2–4 người làm).

KẾT QUẢ: ĐẠT

---

## Câu 4

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: trang demo cho khách nhập số tiền vay, lãi suất, số tháng, ra bảng trả góp từng tháng. Dùng để chào hàng trong một tuần, không lưu gì, không đăng nhập. Hãy thiết kế lời giải.

### Agent trả lời

Tôi đã viết xong bản thiết kế, đang chờ anh/chị duyệt. Chưa có dòng code nào. Có 3 câu ở mục 0 cần chốt trước, vì chúng làm thay đổi con số trên bảng.

File: `docs/thiet-ke/20261124-demo-bang-tra-gop.md`. Nội dung đầy đủ:

---

# Thiết kế: Trang demo bảng trả góp
Trạng thái: **Đề xuất, chờ người quản lý duyệt.** Chưa viết code.

## 0. Cần chốt trước khi làm
| # | Câu hỏi | Đề xuất |
|---|---|---|
| 1 | Tính theo cách nào: **trả đều mỗi tháng** (gốc + lãi bằng nhau) hay **dư nợ giảm dần** (gốc chia đều, lãi giảm dần)? | Làm **cả hai**, có nút chọn. Thêm khoảng 30 phút. Khách vay thường hỏi so sánh hai cách. Nếu chỉ chọn một thì chọn dư nợ giảm dần. |
| 2 | Khách nhập lãi suất theo năm hay theo tháng? | Theo năm (%/năm), trang tự chia 12. |
| 3 | Làm tròn tiền thế nào? | Làm tròn đến đồng. Tháng cuối gánh phần lệch để tổng gốc trả đúng bằng số tiền vay. |

## 1. Cấu trúc dự án
**Chỉ frontend.** Lý do: trang demo dùng một tuần, không lưu gì, không đăng nhập, không có dữ liệu riêng tư hay khoá bí mật. Có phần tính toán, nhưng chỉ là một công thức chạy ngay trên trình duyệt, không cần backend.

```
Khách (trình duyệt) ──> Trang tĩnh (HTML/JS) — tự tính, không gọi server nào
```
```
src/
  loan/schedule.ts        # tính bảng trả góp (thuần, không phụ thuộc giao diện)
  loan/schedule.test.ts   # unit test
  App.vue                 # form nhập + bảng kết quả
  format.ts               # định dạng tiền VNĐ
```

## 2. Công nghệ đề xuất
| Phần | Đề xuất | Lý do |
|---|---|---|
| Giao diện | **Vue 3 + Vite**, TypeScript | Hợp với Vue anh/chị hay dùng. Không dùng Nuxt vì trang chỉ có một màn, không cần routing hay render phía server. |
| Test | Vitest | Đi cùng Vite, đo được độ phủ. |
| Hosting | Trang tĩnh miễn phí (Netlify, Vercel hoặc GitHub Pages), **anh/chị chọn** | Không có server, xong tuần thì tắt mà không mất chi phí. |

Không thêm thư viện giao diện.

## 3. Kiến trúc: lợi và hại
| | Trước mắt | Nếu sau này dự án lớn lên |
|---|---|---|
| Lợi | Làm trong khoảng 3 giờ. Build vài giây. Người mới đọc hiểu ngay. Deploy là kéo thả thư mục. Chi phí 0. | Logic tính đã tách riêng, có test, mang sang dự án thật dùng lại được. |
| Hại | Ai mở trang cũng xem được công thức (không sao với demo). | Không lưu hồ sơ, không có tài khoản. Nếu làm thật thì phải thêm backend. |

**Khi nào phải đổi:** khách muốn lưu hồ sơ, gửi kết quả qua email, có nhân viên duyệt hồ sơ, hoặc công thức là bí mật kinh doanh. Khi đó thêm backend Java và chuyển `schedule.ts` thành API.

## 4. Giao diện
Chỉ một màn hình:
- **Form:** số tiền vay (có dấu chấm ngăn cách khi gõ), lãi suất (%/năm), số tháng, chọn cách tính, nút "Tính".
- **Tóm tắt:** tiền trả tháng đầu, tổng lãi, tổng phải trả.
- **Bảng:** Tháng · Gốc · Lãi · Tổng trả tháng · Dư nợ còn lại. Dòng cuối là dòng tổng.
- **Báo lỗi** ngay dưới ô nhập sai: để trống, số âm, số tháng không phải số nguyên, số tháng ngoài khoảng 1–360.
- **Trên điện thoại:** form xếp dọc, bảng cuộn ngang.

## 5. Dữ liệu
Không có database. Chỉ có đối tượng trong bộ nhớ:
- Đầu vào: `{ principal, annualRatePct, months, method }`
- Đầu ra: `rows[] = { month, principalPaid, interestPaid, payment, balance }` kèm `totals`.

Công thức:
- **Trả đều:** `M = P·r / (1 − (1+r)^−n)`, với `r = lãi năm / 12`. Khi `r = 0` thì `M = P/n`.
- **Dư nợ giảm dần:** gốc mỗi tháng = `P/n`, lãi = dư nợ đầu tháng × `r`.

## 6. Hợp đồng API
Không có.

## 7. Hạn chế
- Không lưu kết quả và không chia sẻ link kết quả. Nếu khách muốn, có thể thêm tham số vào URL (khoảng 30 phút) mà vẫn không cần backend.
- Chưa có xuất PDF hay Excel.
- Số liệu chỉ để tham khảo, không phải bảng của một ngân hàng cụ thể. Trang ghi rõ câu này.

## 8. Ngoài phạm vi
Đăng nhập, lưu hồ sơ, phí trả trước hạn, lãi thả nổi, bảo hiểm khoản vay, đa ngôn ngữ. Lý do: bản tóm tắt chỉ cần demo một tuần.

## 9. Ranh giới cho agent
- **Luôn làm:** chạy unit test trước khi commit, làm trên nhánh `feat/loan-schedule-demo`.
- **Hỏi anh/chị trước:** thêm thư viện, đổi công thức hay cách làm tròn, chọn nơi deploy.
- **Không bao giờ:** gửi số khách nhập ra dịch vụ ngoài (kể cả analytics), push thẳng lên `main`, xoá test đang lỗi.

## 10. Kế hoạch test
| Tiêu chí | Test |
|---|---|
| Nhập số liệu thì ra bảng từng tháng | Unit: số dòng bằng số tháng, dư nợ cuối bằng 0, tổng gốc bằng số tiền vay. |
| Số liệu đúng | Unit: so với 2 ca tính sẵn bằng hàm PMT của Excel (mỗi cách tính một ca), thêm ca lãi 0% và ca 1 tháng. |
| Làm tròn | Unit: mọi số là số nguyên đồng, tháng cuối gánh phần lệch. |
| Nhập sai | Unit: hàm kiểm tra trả đúng lỗi cho giá trị trống, âm, số thập phân, vượt 360. |
| Không lưu gì | Kiểm tay: tải lại trang thì form trống, tab Network không có request nào gửi đi. |
| Dùng trên điện thoại | Kiểm tay ở màn rộng 375px. |

Độ phủ `loan/` và `format.ts` trên 80%. Chỉ kiểm tay sau khi unit test xanh.

## 11. Ước lượng và chia việc
- **Khoảng 3 giờ**, thêm khoảng 30 phút nếu làm cả hai cách tính.
- **Agent 1 (làm):** logic, test, rồi giao diện, theo thứ tự đó, trong một luồng. Việc nhỏ nên không tách song song.
- **Agent 2 (review độc lập):** đọc PR và đối chiếu số với Excel. Agent 2 không tham gia làm.
- **Anh/chị:** chốt 3 câu ở mục 0, duyệt thiết kế, chọn hosting, xem demo trước khi gửi khách.

---

Trang demo nên tôi không viết ADR.

**Bước tiếp theo:** anh/chị trả lời 3 câu ở mục 0 (hoặc gật theo đề xuất) và duyệt thiết kế. Sau đó tôi mới giao agent bắt đầu làm.

### Chấm

**Chấm theo từng tiêu chí**

1. **Chọn chỉ frontend, có lý do đúng: ĐẠT.** Bản thiết kế ghi rõ "Chỉ frontend" và nêu đủ lý do: demo dùng một tuần, không lưu, không đăng nhập, phép tính chỉ là một công thức chạy ngay trên trình duyệt.

2. **Không dựng backend cho phép tính: ĐẠT.** Sơ đồ ghi "không gọi server nào", mục API ghi "Không có". Backend chỉ được nhắc như điều kiện để đổi về sau (cần lưu hồ sơ, gửi email, công thức bí mật), không đưa vào lời giải.

3. **Bản thiết kế ngắn, ước lượng vài giờ: ĐẠT.** Bản có 11 mục, nhưng mục nào cũng chỉ vài dòng, mục không cần thì ghi "Không có", và chủ động bỏ ADR vì là trang demo. Ước lượng khoảng 3 giờ, thêm 30 phút nếu làm cả hai cách tính, nằm trong giới hạn một ngày. Lưu ý nhỏ: yêu cầu độ phủ test 80% và đối chiếu với Excel hơi kỹ so với một trang demo, nhưng chưa đến mức thừa.

4. **Chia việc gọn (1-2 agent): ĐẠT.** Một agent làm tuần tự logic, test rồi giao diện, và nói rõ "Việc nhỏ nên không tách song song". Agent thứ hai chỉ review độc lập. Tổng cộng 2 agent.

5. **Trình như đề xuất chờ người quản lý chọn: ĐẠT.** Trạng thái ghi "Đề xuất, chờ người quản lý duyệt. Chưa viết code". Có 3 câu ở mục 0 cần người quản lý chốt, nơi deploy để người quản lý chọn, và câu cuối nói chỉ giao agent làm sau khi được duyệt.

KẾT QUẢ: ĐẠT

---

## Câu 5

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: phòng khám muốn bệnh nhân nhập mã phiếu và ngày sinh để xem kết quả xét nghiệm của mình. Nhân viên phòng khám tải kết quả lên. Khoảng 200 lượt tra cứu mỗi ngày. Hãy thiết kế lời giải.

### Agent trả lời

# Thiết kế: Tra cứu kết quả xét nghiệm

**Trạng thái: Đề xuất, chờ anh/chị duyệt. Chưa viết code.**

Em đã lưu thiết kế và 3 ADR (bản ghi quyết định kiến trúc) ở các file sau. Toàn bộ nội dung có ở bên dưới.
- `docs/thiet-ke/20261124-tra-cuu-ket-qua-xet-nghiem.md`
- `docs/adr/001-cong-nghe.md`, `002-kien-truc-va-hosting.md`, `003-xac-thuc.md`

Thư mục dự án chưa có CLAUDE.md hay tài liệu kiến trúc cũ, nên em thiết kế từ đầu.

---

## 0. Ba điểm cần khách xác nhận trước khi code

Bản tóm tắt chưa nói rõ ba điểm này. Thiết kế đang theo phương án em đề xuất. Nếu khách chọn khác thì phải sửa thiết kế.

| # | Câu hỏi cho khách | Đề xuất (thiết kế đang theo) | Nếu khách chọn khác |
|---|---|---|---|
| 1 | Kết quả là file PDF do máy hoặc phần mềm xét nghiệm xuất ra, hay nhân viên nhập tay từng chỉ số? | File PDF, nhân viên tải lên | Nhập tay thì thời gian làm tăng khoảng gấp đôi |
| 2 | Mã phiếu do hệ thống mới tạo, hay dùng mã phòng khám đang có? | Hệ thống tạo mã ngẫu nhiên 8 ký tự (vd `K7MQ-4XRT`) rồi in lên phiếu | Mã cũ mà là số tăng dần thì người ngoài đoán được mã, chỉ còn ngày sinh bảo vệ kết quả. Lúc đó phải thêm CAPTCHA |
| 3 | Bệnh nhân được tra cứu trong bao lâu? | 90 ngày. Sau đó trang tra cứu khoá mã này, nhân viên vẫn xem được | Muốn xem mãi thì bỏ hạn, nhưng càng nhiều mã cũ thì càng nhiều cơ hội bị dò |

## 1. Cấu trúc dự án

**Có backend**, vì ba lý do:
- **Dữ liệu dùng chung:** nhân viên tải kết quả lên, bệnh nhân xem.
- **Bảo mật:** kết quả xét nghiệm là dữ liệu cá nhân nhạy cảm theo NĐ 13/2023. Việc kiểm mã và ngày sinh, giới hạn số lần thử sai và giữ file kín đều phải làm ở máy chủ, không để trình duyệt tự kiểm.
- **Phân quyền:** chỉ nhân viên đã đăng nhập mới tải lên được.

**Sơ đồ ngữ cảnh**
- Ai dùng: bệnh nhân (điện thoại), nhân viên (máy tính ở phòng khám), quản trị (quản lý tài khoản nhân viên).
- Hệ thống ngoài: không có ở bản này.

**Các phần chạy riêng** (một VPS, chạy bằng Docker Compose)
```
Trình duyệt ─HTTPS─> [Nginx: phục vụ trang Vue] ─/api/*─> [Spring Boot] ─> [PostgreSQL]
                                                               └─> [Thư mục file kín trên đĩa]
Sao lưu DB và file hằng đêm ra ngoài máy chủ, có mã hoá.
```

**Bản đồ module backend**

| Module | Lo việc gì | Phụ thuộc |
|---|---|---|
| `audit` | Ghi nhật ký: tra cứu, xem file, tải lên, gỡ file | — |
| `staff` | Tài khoản, đăng nhập, phân quyền ADMIN/STAFF | audit |
| `tickets` | Phiếu, tạo mã, file kết quả | staff, audit |
| `lookup` | Tra cứu công khai, giới hạn thử sai, cấp vé xem file | tickets, audit |

**Cây thư mục chính**
- `backend/`: mỗi module có controller, service, repository; thêm `common/` và migration Flyway.
- `frontend/`: `pages/patient`, `pages/staff`, `api`.
- `deploy/`: cấu hình chạy và script sao lưu.
- `docs/`: thiết kế và ADR.

## 2. Công nghệ đề xuất (anh/chị chọn)

| Phần | Đề xuất | Lý do |
|---|---|---|
| Backend | Java 21 + Spring Boot 3 + Spring Security | Đúng công nghệ anh/chị quen. Có sẵn session, CSRF và băm mật khẩu, không phải tự viết phần bảo mật |
| Frontend | Vue 3 + Vite, **không dùng Nuxt** | Chỉ có một form tra cứu và vài màn nhân viên, không cần SEO. Dùng Nuxt thì phải chạy thêm một máy chủ Node mà không được gì |
| Database | PostgreSQL 16 | Dữ liệu có quan hệ rõ, tải rất nhẹ, miễn phí |
| Lưu file | Thư mục kín trên đĩa | Khoảng 20 GB/năm, một ổ VPS chứa được vài năm |
| Chạy | Docker Compose, 1 VPS ở Việt Nam, HTTPS | Tải nhỏ. Đặt ở Việt Nam để tránh thủ tục chuyển dữ liệu ra nước ngoài |

## 3. Kiến trúc: lợi và hại

**Đề xuất:** một backend chia 4 module, bên trong mỗi module chia lớp, chạy trên 1 máy.

**Quy mô ước lượng:** khoảng 15 endpoint, 7 màn hình, 1–2 người bảo trì. Có thể thêm sau này: SMS/Zalo báo kết quả, nối phần mềm xét nghiệm.

| Tiêu chí | Trước mắt | Khi dự án lớn lên |
|---|---|---|
| Tốc độ làm | **Lợi:** một repo, agent làm nhanh | **Lợi:** thêm SMS thì làm thành module mới, không đụng `lookup` |
| Build | **Lợi:** dưới 1 phút | **Hại:** vẫn build chung một khối, nhưng khó vượt vài phút ở bài toán này |
| Người mới | **Lợi:** tên thư mục chính là tên nghiệp vụ | **Hại:** module dễ dính vào nhau nếu review không canh quy tắc chỉ gọi nhau qua interface |
| Deploy | **Lợi:** một lệnh | **Hại:** muốn tăng tải phần tra cứu thì phải tăng cả hệ thống (còn rất xa giới hạn) |
| Chi phí | **Lợi:** 1 VPS 2 vCPU/4 GB | **Hại:** một điểm hỏng, khôi phục mất 1–2 giờ |
| Bảo mật | **Lợi:** ít thành phần, file không có đường dẫn công khai | **Hại:** trang công khai và trang nhân viên chung một máy chủ |

**Khi nào nên đổi kiến trúc:**
- Nhiều chi nhánh hoặc trên 5.000 lượt/ngày: chuyển file sang dịch vụ lưu trữ đối tượng, chạy 2 bản backend.
- Phòng khám yêu cầu không được gián đoạn: thêm máy dự phòng.
- Muốn cách ly hẳn trang công khai: tách `lookup` thành dịch vụ riêng.

## 4. Tổng quan giao diện

**Phía bệnh nhân (ưu tiên điện thoại)**
1. **Tra cứu:**
   - Ô mã phiếu tự viết hoa, gõ có hay không có dấu gạch đều được.
   - Ngày sinh nhập ở 3 ô ngày/tháng/năm, không dùng lịch chọn vì người lớn tuổi khó dùng.
   - Nhập sai thì báo chung "Mã phiếu hoặc ngày sinh không đúng", không nói sai ở ô nào.
   - Bị khoá thì báo thời gian chờ và số điện thoại phòng khám.
2. **Kết quả:**
   - Tên bệnh nhân che bớt, ngày xét nghiệm, danh sách PDF xem ngay trong trang và tải về được.
   - Chưa có file thì báo "Đang xử lý".
   - Có nút Thoát, trang tự thoát sau 15 phút.

**Phía nhân viên**

3. Đăng nhập.
4. Danh sách phiếu: tìm theo mã hoặc tên, lọc trạng thái, có phân trang.
5. Tạo phiếu: lưu xong hiện mã chữ to và nút **In phiếu**.
6. Chi tiết phiếu:
   - Kéo thả để tải PDF lên.
   - Thông tin bệnh nhân hiện cạnh vùng tải lên để tránh tải nhầm phiếu.
   - Gỡ file, mở khoá tra cứu, xem lịch sử truy cập.
7. Quản lý nhân viên (chỉ ADMIN).

**Luồng nhân viên:** Tạo phiếu → In phiếu → khi có kết quả thì mở Chi tiết → Tải PDF lên.

## 5. Dữ liệu chính

```
staff_user  (id, username, password_hash, full_name, role, is_active, created_at)
lab_ticket  (id, ticket_code UNIQUE, patient_name, date_of_birth, test_date, status[PENDING|READY],
             lookup_expires_at, failed_attempts, locked_until, is_hard_locked, created_by, ...)
result_file (id, ticket_id, original_name, storage_key(UUID), size_bytes, sha256,
             uploaded_by, uploaded_at, deleted_at)
access_log  (id, event_type, ticket_id?, staff_id?, ip, user_agent, created_at)
```

- **Mã phiếu:** 8 ký tự sinh bằng `SecureRandom` từ 31 ký tự (bỏ 0, O, 1, I, L để khỏi nhầm), khoảng 8,5 × 10¹¹ tổ hợp.
- **File:** chỉ nhận PDF, kiểm cả phần đầu file chứ không chỉ đuôi file. Gỡ file là xoá mềm.

## 6. Hợp đồng API

**Lỗi chung:** `{ "error": { "code", "message", "details" } }`.

**Công khai (bệnh nhân)**
- `POST /api/lookups` gửi `{ticketCode, dateOfBirth}`.
  - Trả 200 `{patientNameMasked, testDate, status, files[], viewToken, expiresInSeconds: 900}`.
  - Trả 404 `LOOKUP_NOT_FOUND` cho cả ba trường hợp: sai mã, sai ngày sinh, hết hạn.
  - Trả 429 `TOO_MANY_ATTEMPTS` kèm `retryAfterSeconds`.
- `GET /api/lookups/files/{fileId}` gửi header `Bearer viewToken`, trả PDF. Vé sai trả 401, file không thuộc phiếu trả 404.
- **Giới hạn thử sai:**
  - Theo IP: 10 lần/15 phút.
  - Theo mã: sai 5 lần khoá 30 phút, sai 15 lần khoá hẳn đến khi nhân viên mở.
  - Thời gian trả lời như nhau giữa mã không tồn tại và mã sai ngày sinh.
  - Vé xem file sống 15 phút, chỉ mở được file của đúng phiếu đó.

**Nhân viên** (session cookie HttpOnly, SameSite=Strict, có CSRF)
- `POST /api/auth/login`: sai quá 5 lần trong 15 phút trả 429. Thêm `POST /api/auth/logout`, `GET /api/auth/me`.
- `GET /api/tickets?query=&status=&page=&size=`, `POST /api/tickets` (trả 201 kèm `ticketCode`), `GET` và `PATCH /api/tickets/{id}`, `POST /api/tickets/{id}/unlock`.
- `POST /api/tickets/{id}/files` (PDF tối đa 10 MB; sai loại hoặc quá cỡ trả 422 `FILE_NOT_PDF` / `FILE_TOO_LARGE`), `GET` và `DELETE /api/tickets/{id}/files/{fileId}`, `GET /api/tickets/{id}/access-logs`.

**Quản trị** (STAFF gọi thì trả 403)
- `GET` và `POST /api/staff`, `PATCH /api/staff/{id}`, `POST /api/staff/{id}/reset-password`.

Khi code sẽ viết lại phần này thành OpenAPI.

## 7. Hạn chế

- **Ai cầm phiếu và biết ngày sinh thì xem được kết quả**, kể cả người nhà hay người nhặt được phiếu. Đây là mô hình khách chọn. Muốn chặt hơn thì dùng OTP qua SMS, có phí, để sau.
- **Kẻ xấu có thể cố ý nhập sai để khoá mã của người khác.** Rủi ro thấp, nhân viên mở khoá được.
- **Một máy là một điểm hỏng.** Có thể mất file tải lên trong ngày nếu máy chết trước giờ sao lưu. Nhân viên nên giữ PDF gốc tới khi sao lưu xong.
- **Nhân viên có thể tải nhầm file sang phiếu khác.** Thiết kế chỉ giảm rủi ro, không loại trừ được. Muốn loại trừ thì phải nối thẳng với phần mềm xét nghiệm.
- **Không có CAPTCHA**, nên không chặn được dò từ nhiều IP. Tạm chấp nhận vì mã ngẫu nhiên rất khó đoán. Nếu khách giữ mã tăng dần thì nên thêm Turnstile (miễn phí).

## 8. Ngoài phạm vi

- SMS/Zalo/email báo kết quả: chưa có trong yêu cầu, có phí.
- Nối phần mềm xét nghiệm: chưa biết phòng khám dùng phần mềm gì.
- Nhập chỉ số từng xét nghiệm: chờ câu hỏi 1.
- Tài khoản bệnh nhân, nhiều chi nhánh, ứng dụng di động, staging.

## 9. Ranh giới cho agent

- **Luôn làm:**
  - Chạy test trước khi commit.
  - Có test chứng minh: không đăng nhập thì nhận 401, STAFF gọi API quản trị thì nhận 403.
  - Ghi `access_log` cho mọi lần tra cứu, xem, tải lên, gỡ file.
  - Chỉ dùng dữ liệu giả.
- **Hỏi anh/chị trước:**
  - Đổi cấu trúc DB đã chạy production.
  - Thêm thư viện mới.
  - Đổi luật thử sai, thời hạn tra cứu hay thời gian sống của vé.
  - Đụng tới dữ liệu bệnh nhân thật.
- **Không bao giờ:**
  - Đưa khoá bí mật vào repo.
  - Để file có đường dẫn công khai.
  - Ghi mã phiếu kèm ngày sinh vào log.
  - Trả lỗi cho biết mã phiếu có tồn tại hay không.
  - Xoá test đang lỗi.

## 10. Kế hoạch test

| Tiêu chí | Test |
|---|---|
| Đúng mã + ngày sinh thì xem được | Unit `LookupService`. Tích hợp: tra cứu rồi mở PDF |
| Sai thì không lộ mã có tồn tại | Ba trường hợp sai trả cùng mã lỗi, thời gian trả lời gần nhau |
| Chống dò | Sai 5 lần khoá 30 phút, sai 15 lần khoá hẳn, nhân viên mở khoá được. Lần thứ 11 từ một IP nhận 429 |
| Vé đúng phạm vi | Vé phiếu A mở file phiếu B nhận 404. Vé quá hạn nhận 401 |
| Nhân viên tải lên | Có file thì READY, gỡ hết file thì PENDING. File không phải PDF hoặc quá 10 MB nhận 422 |
| Chỉ nhân viên tải được | Không đăng nhập nhận 401, STAFF gọi API quản trị nhận 403, thiếu CSRF nhận 403 |
| Mã ngẫu nhiên | Sinh 100.000 mã không trùng, không có ký tự dễ nhầm |
| Nhật ký | Mỗi sự kiện ghi đúng một dòng, không chứa ngày sinh |
| 200 lượt/ngày | k6: 20 lượt/giây trong 1 phút, p95 dưới 500 ms |
| Frontend | Vitest cho form tra cứu và các thông báo 404/429 |

Độ phủ trên 80%. Kiểm tay trên điện thoại thật sau khi test xanh.

## 11. Thời gian và cách chia việc cho agent

| Bước | Agent | Việc | Thời gian |
|---|---|---|---|
| 1 | Khởi tạo | Khung repo, Docker Compose, migration, bảo mật chung, OpenAPI | 2–3 giờ |
| 2a ∥ 2b | Backend ∥ Frontend (chạy song song) | 4 module + test ∥ 7 màn hình dùng mock theo OpenAPI + Vitest | 6–8 giờ ∥ 5–7 giờ |
| 3 | Backend | Ghép hai phía, kiểm tải, script sao lưu, hướng dẫn deploy | 2–3 giờ |
| 4 | Review độc lập | Tập trung bảo mật: dò mã, quyền, lộ file, log | 1–2 giờ, cộng thời gian sửa |
| 5 | Anh/chị | Kiểm tay, duyệt PR, deploy | — |

**Tổng: khoảng 2–3 ngày làm việc**, chưa tính thời gian chờ duyệt và chờ khách trả lời 3 câu ở mục 0. Nếu câu 1 chốt là nhập tay chỉ số thì cộng thêm khoảng 1,5–2 ngày.

---

## ADR (cả ba đều ở trạng thái Đề xuất)

**ADR-001: Spring Boot + Vue 3 SPA + PostgreSQL**
- **Lý do:** cần bảo mật, anh/chị quen Java và Vue, tải nhỏ.
- **Phương án loại:**
  - Nuxt: không cần SEO, phải chạy thêm máy chủ Node.
  - NestJS: lệch công nghệ quen.
  - MySQL: dùng được tương đương, không có lý do để chọn thay PostgreSQL.
- **Hệ quả:** Spring tốn 300–500 MB RAM, vẫn vừa VPS 4 GB.

**ADR-002: Một backend chia module, Docker Compose trên 1 VPS ở Việt Nam**
- **Lý do:** 4 nhóm nghiệp vụ, 200 lượt/ngày, 1–2 người bảo trì, dữ liệu nhạy cảm.
- **Phương án loại:**
  - Tách dịch vụ: tốn công vận hành gấp đôi.
  - Lưu trữ đối tượng: chưa cần với 20 GB/năm.
  - Cloud nước ngoài: phải làm hồ sơ chuyển dữ liệu ra nước ngoài.
- **Hệ quả:** đơn giản, rẻ, nhưng là một điểm hỏng (khôi phục 1–2 giờ).
- **Xem lại khi:** có nhiều chi nhánh, trên 5.000 lượt/ngày, hoặc phòng khám yêu cầu không được gián đoạn.

**ADR-003: Cách xác thực**
- **Bệnh nhân:** mã ngẫu nhiên 8 ký tự + ngày sinh, giới hạn theo IP và theo mã, mọi trường hợp sai trả cùng một lỗi, vé xem file 15 phút.
- **Nhân viên:** session cookie + CSRF, hai vai ADMIN/STAFF.
- **Phương án loại:**
  - OTP SMS: có phí, vượt yêu cầu.
  - JWT: không cần vì frontend và backend cùng tên miền.
  - Dùng mã cũ của phòng khám: chờ câu hỏi 2.
- **Hệ quả:** ai có phiếu và biết ngày sinh thì xem được kết quả. Mã có thể bị cố ý khoá, nhân viên mở được.

---

**Em dừng ở đây, chờ anh/chị:**
1. Mang 3 câu ở mục 0 đi hỏi khách.
2. Chọn công nghệ ở mục 2 và duyệt kiến trúc ở mục 3, kèm 3 ADR.

Có kết quả duyệt thì em mới bắt đầu code.

### Chấm

**Chấm theo từng tiêu chí**

1. **Chọn có backend, lý do có nhắc bảo mật dữ liệu riêng tư: ĐẠT.** Mục 1 chọn có backend và lý do thứ hai ghi rõ kết quả xét nghiệm là dữ liệu cá nhân nhạy cảm theo NĐ 13/2023, nên việc kiểm mã và ngày sinh, giới hạn thử sai và giữ file kín phải làm ở máy chủ.

2. **Không để dữ liệu kết quả hay khoá bí mật nằm ở frontend: ĐẠT.** File PDF nằm trong thư mục kín trên máy chủ. Muốn mở file phải có vé xem do server cấp, vé sống 15 phút và chỉ mở được file của đúng phiếu đó. Phần "Không bao giờ" cấm đưa khoá bí mật vào repo và cấm để file có đường dẫn công khai. Frontend chỉ dùng mock lúc phát triển.

3. **Có hạn chế của thiết kế: ĐẠT.** Mục 7 nêu 5 hạn chế cụ thể: ai cầm phiếu và biết ngày sinh thì xem được, kẻ xấu có thể cố ý khoá mã người khác, một máy là một điểm hỏng, nhân viên có thể tải nhầm file, không có CAPTCHA. Hạn chế nào cũng kèm cách giảm nhẹ hoặc lý do tạm chấp nhận.

4. **Chọn kiến trúc bằng lý do từ chính bài toán, có bảng lợi và hại, không viện dẫn monolith ở dự án khác: ĐẠT.** Mục 3 có bảng lợi và hại theo 6 tiêu chí, xét cả trước mắt lẫn khi dự án lớn lên, và có điều kiện khi nào nên đổi kiến trúc. ADR-002 lấy lý do từ chính bài toán: 200 lượt/ngày, 1–2 người bảo trì, dữ liệu nhạy cảm, 4 nhóm nghiệp vụ. Câu trả lời không nhắc tới dự án nào khác.

KẾT QUẢ: ĐẠT

