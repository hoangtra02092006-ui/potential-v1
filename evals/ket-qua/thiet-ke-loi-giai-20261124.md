# Kết quả chạy thử thiet-ke-loi-giai (24/11/2026)

Lượt 1: đạt 5/5. Agent làm bài không thấy đề; người chấm là một agent riêng. Chạy lại: `bash evals/chay-bo-de.sh thiet-ke-loi-giai <thư mục>`.

---

## Câu 1

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: khách bán sỉ cà phê hạt cho quán. Màn danh sách đơn (mã đơn, tên quán, sản phẩm, số kg, tổng tiền, trạng thái, ngày giao; lọc theo khoảng ngày, xuất Excel các cột đang hiện). Quy trình: sale tạo đơn → kho đóng gói → shipper giao → thu tiền khi giao, mỗi bước đổi trạng thái. Khoảng 5 nhân viên dùng chung. Hãy thiết kế lời giải.

### Agent trả lời

Thiết kế đã xong và đang **chờ bạn duyệt**, tôi chưa viết code. Có 3 câu cần hỏi khách ở cuối, vì chúng ảnh hưởng đến bảng dữ liệu và phân quyền. Thư mục dự án đang trống (chưa có CLAUDE.md hay tài liệu kiến trúc), nên đây là thiết kế từ đầu.

File: `docs/thiet-ke/20261124-quan-ly-don-ca-phe.md`

---

# Thiết kế: Quản lý đơn sỉ cà phê hạt

## 1. Cấu trúc dự án

**Có backend**, vì:
- 5 nhân viên dùng **chung dữ liệu**, nên phải lưu vào database.
- Quy trình có **4 bước trạng thái**, phải kiểm ở server: không cho nhảy bước, không để 2 người cùng đổi một đơn.
- Có **tiền**: tổng tiền phải tính ở server, và mỗi người chỉ được làm bước của mình.
- **Dễ mở rộng** sau này: công nợ, tồn kho, báo cáo.

```
Trình duyệt (PC của sale/kho, điện thoại của shipper)
   │  HTTPS, cookie phiên đăng nhập
   ▼
Nginx ── phục vụ frontend tĩnh (Nuxt, không SSR)
   │  /api/*
   ▼
Backend Spring Boot (một ứng dụng, chia module nghiệp vụ)
   ▼
PostgreSQL
```

```
coffee-orders/
├─ backend/src/main/java/.../
│  ├─ auth/  shops/  products/  orders/  export/  common/
├─ frontend/   # Nuxt 3, ssr: false
│  ├─ pages/ (login, orders/index, orders/new, orders/[id], shops, products)
├─ docs/
└─ docker-compose.yml   # postgres + backend + nginx
```

## 2. Công nghệ đề xuất

| Phần | Chọn | Lý do |
|---|---|---|
| Backend | Java 21 + Spring Boot 3 | Là mặc định của bạn. Đủ cho nghiệp vụ trạng thái và phân quyền; Spring Security có sẵn đăng nhập bằng phiên. |
| Frontend | Nuxt 3, chế độ SPA | Là mặc định của bạn. Công cụ nội bộ không cần SEO, nên tắt SSR để build ra file tĩnh, deploy gọn. |
| Database | PostgreSQL 16 | Có transaction và khoá để đổi trạng thái an toàn khi nhiều người cùng dùng; kiểu `numeric` cho kg. |
| Migration | Flyway | Lưu lịch sử thay đổi bảng rõ ràng. |
| Xuất Excel | Apache POI ở **backend** | Xuất mọi đơn khớp bộ lọc, không chỉ trang đang xem. Dùng chung câu truy vấn với màn danh sách nên số liệu không lệch. Tiền, kg, ngày ghi dạng số/ngày nên khách cộng và lọc được trong Excel. |
| Đăng nhập | Phiên (session cookie) | 5 người, một máy chủ thì không cần JWT. Xoá tài khoản là mất quyền ngay. |
| Deploy | Docker Compose, 1 VPS (2 vCPU, 4 GB) | Tải rất nhẹ; một lệnh là dựng lại toàn bộ. |
| Test | JUnit 5 + Testcontainers, Vitest | Test trên Postgres thật nên không lệch giữa môi trường test và môi trường chạy thật. |

## 3. Kiến trúc: monolith chia module nghiệp vụ

Quy mô hiện tại khoảng 6 chức năng, 1–2 người làm. Dự án dễ lớn thêm (công nợ, kho, báo cáo), nên chia module theo nghiệp vụ ngay từ đầu. Các module chỉ gọi nhau qua service công khai, không đọc thẳng bảng của module khác.

| Tiêu chí | Lợi | Hại |
|---|---|---|
| Tốc độ làm ban đầu | Nhanh: một backend, một DB | Tốn thêm chút công giữ ranh giới module |
| Thời gian build | Dưới 1 phút lúc đầu | Tăng dần theo số module |
| Người mới vào | Thư mục theo nghiệp vụ, nhìn là biết code nằm đâu | Không giữ quy tắc thì module gọi chéo, code thành rối |
| Deploy | Một lệnh compose | Sửa một module phải deploy lại cả backend (ngừng vài giây) |
| Chi phí | Một VPS nhỏ | Không mở rộng riêng được từng phần (hiện chưa cần) |
| Khi lớn lên | Ranh giới rõ nên tách ra được mà không viết lại | Dùng chung DB nên khi tách phải chia lại dữ liệu |

**Cân nhắc tách dịch vụ khi:** build quá 5 phút, hoặc từ 4 người trở lên cùng sửa backend, hoặc có ứng dụng khác cần dữ liệu với mức tải khác hẳn.

## 4. Tổng quan giao diện

Sale và kho dùng PC. Shipper đổi trạng thái lúc đang giao nên dùng điện thoại; vì vậy màn danh sách và chi tiết đơn phải dùng được trên điện thoại.

1. **Đăng nhập**
2. **Danh sách đơn** (màn chính)
   - Phía trên: lọc **khoảng ngày giao** (mặc định hôm nay ± 7 ngày), lọc theo trạng thái, ô tìm theo mã đơn hoặc tên quán; nút **Chọn cột**, **Xuất Excel**, **Tạo đơn**.
   - Bảng có 7 cột: mã đơn, tên quán, sản phẩm, số kg, tổng tiền, trạng thái (nhãn màu), ngày giao. Mỗi trang 50 dòng.
   - Mỗi dòng có **một nút cho đúng bước kế tiếp**, tuỳ vai trò người đang đăng nhập.
   - Xuất Excel lấy **đúng các cột đang bật, đúng thứ tự, đúng bộ lọc đang áp**. Lựa chọn cột được nhớ theo trình duyệt.
   - Trên điện thoại, bảng chuyển thành danh sách thẻ.
3. **Tạo/sửa đơn** (sale): chọn quán, ngày giao, thêm các dòng sản phẩm (kg, đơn giá tự điền và sửa được). Tổng tiền tự tính. Chỉ sửa được khi đơn còn "Mới tạo".
4. **Chi tiết đơn**: các dòng sản phẩm, lịch sử trạng thái (ai đổi, lúc nào) và nút chuyển bước.
5. **Quán**, **Sản phẩm**: thêm và sửa đơn giản.
6. **Người dùng** (quản lý): tạo tài khoản, gán vai trò, khoá tài khoản.

```
MỚI TẠO ──(kho)──► ĐÃ ĐÓNG GÓI ──(shipper)──► ĐANG GIAO ──(shipper)──► ĐÃ GIAO & ĐÃ THU TIỀN
 (sale)
```

## 5. Dữ liệu chính

```
users(id, username, password_hash, full_name, role[ADMIN|SALE|WAREHOUSE|SHIPPER], active)
shops(id, name, address, phone, active)
products(id, name, default_price_per_kg BIGINT, active)
orders(id, code UNIQUE, shop_id, delivery_date DATE, status, total_kg NUMERIC(10,2),
       total_amount BIGINT, note, created_by, created_at, updated_at, version)
order_items(id, order_id, product_id, quantity_kg NUMERIC(10,2), unit_price BIGINT, line_amount BIGINT)
order_status_history(id, order_id, from_status, to_status, changed_by, changed_at)
```

- **Tiền** lưu số nguyên VND. Đơn giá được chụp lại lúc tạo đơn, nên đổi giá sản phẩm sau đó không làm đổi đơn cũ.
- **Khi hai người cùng đổi một đơn**: dùng cột `version` để khoá lạc quan. Người bấm sau nhận thông báo "Đơn đã được cập nhật, tải lại", không ghi đè lên người trước.
- **Mã đơn** có dạng `DH261124-007`. Đánh index trên `delivery_date` và `status` để lọc nhanh.
- **API chính:**
  - `GET /api/orders`: danh sách, có lọc
  - `GET /api/orders/export?...&columns=`: xuất Excel
  - `POST /api/orders/{id}/transitions {to, version}`: chuyển bước
  - CRUD cho quán, sản phẩm, người dùng

## 6. Hạn chế

- **Không tự cập nhật thời gian thực**: phải tải lại mới thấy thay đổi của người khác. Với 5 người thì đủ dùng; sau này có thể thêm tự làm mới 30 giây/lần.
- **Shipper cần có mạng** khi bấm đổi trạng thái; chưa có chế độ ngoại tuyến.
- **Chưa có** huỷ đơn, giao thất bại, công nợ, tồn kho, vì yêu cầu chưa nêu (xem câu hỏi bên dưới).
- **Lựa chọn cột nhớ theo trình duyệt**, đổi máy là mất. Muốn nhớ theo tài khoản thì tốn thêm khoảng nửa ngày công.
- **Excel giới hạn 20.000 dòng mỗi lần xuất**; vượt thì báo người dùng thu hẹp khoảng ngày.
- **Chỉ có 1 VPS**: máy chết là ngừng. Có backup DB hằng ngày, nhưng chưa có máy dự phòng.
- **Hướng khác đã xét: Google Sheets + AppSheet.** Rẻ và nhanh, nhưng khó chặn nhảy bước, khó phân quyền theo bước và khó đảm bảo tính tiền đúng, nên không chọn.

## 7. Kế hoạch test

| Tiêu chí | Test |
|---|---|
| Hiện đủ 7 cột | API test và component test bảng |
| Tổng tiền đúng | Unit test tính tiền khi đơn có nhiều dòng, kg lẻ như 0,5 |
| Lọc khoảng ngày | Lấy cả ngày đầu và ngày cuối; "từ" sau "đến" thì bị từ chối; khoảng không có đơn trả 0 dòng |
| Excel đúng cột đang hiện | Truyền 3 cột theo thứ tự khác: file ra đúng 3 cột, đúng thứ tự; tên cột lạ bị từ chối |
| Excel khớp danh sách | Cùng bộ lọc: số dòng và tổng tiền khớp; ô tiền/kg/ngày đúng kiểu số/ngày |
| Quy trình đúng thứ tự | Unit test: đi được mọi bước hợp lệ; nhảy bước hoặc đi lùi bị chặn |
| Đúng người làm từng bước | API test theo vai trò; chưa đăng nhập trả 401 |
| Nhiều người cùng dùng | 2 lần đổi trạng thái cùng `version`: một lần thành công, một lần trả 409 |
| Lịch sử trạng thái | Mỗi lần chuyển ghi đúng người và thời điểm |
| Dùng trên điện thoại | Kiểm tay trên điện thoại thật, sau khi unit test xanh |

Độ phủ trên 80% cho `orders`, `export`, `auth` và các controller. Review cuối do bên độc lập làm.

---

## Câu hỏi nhờ bạn mang đi hỏi khách

1. **Một đơn có thể gồm nhiều loại cà phê không?** Tôi đề xuất là có: mỗi đơn gồm nhiều dòng sản phẩm, cột "số kg" là tổng. Nếu mỗi đơn chỉ 1 loại thì bỏ bảng `order_items`, gọn hơn.
2. **Mỗi người chỉ được bấm bước của mình?** Tôi đề xuất có 4 vai trò: quản lý, sale, kho, shipper. Mỗi người một tài khoản; quản lý làm được mọi bước để sửa sai.
3. **Khi giao không được hoặc quán không trả đủ tiền thì xử lý thế nào?** Tôi đề xuất bản đầu có thêm 2 trạng thái:
   - **"Huỷ"**: chỉ áp dụng khi chưa giao.
   - **"Giao thất bại"**: đơn quay về "Đã đóng gói" để giao lại.

   Thu thiếu tiền và công nợ để giai đoạn sau.

**Giả định cần xác nhận:** "ngày giao" là ngày hẹn giao do sale nhập lúc tạo đơn, và bộ lọc khoảng ngày lọc theo ngày này.

Bạn duyệt, hoặc ghi chỗ cần sửa và câu trả lời của khách cho 3 câu trên. Sau đó tôi mới chuyển sang bước làm.

### Chấm

- **Có backend, lý do gắn với lưu dữ liệu, nhiều người dùng và quy trình: ĐẠT.** Agent chọn backend vì 5 nhân viên dùng chung dữ liệu nên cần database, server phải chặn nhảy bước và chặn hai người cùng đổi một đơn, tổng tiền tính ở server và mỗi người chỉ làm bước của mình.
- **Đủ cấu trúc dự án, công nghệ có lý do, tổng quan giao diện và hạn chế: ĐẠT.** Có sơ đồ và cây thư mục, bảng công nghệ ghi lý do từng lựa chọn, 6 màn kèm thông tin trên từng màn (gồm 7 cột, lọc ngày, xuất Excel đúng cột đang hiện), và mục 6 liệt kê các hạn chế cụ thể.
- **Có bảng lợi và hại của kiến trúc được chọn: ĐẠT.** Mục 3 có bảng lợi/hại của monolith chia module theo 6 tiêu chí, kèm điều kiện khi nào nên tách dịch vụ.
- **Không viết code, dừng chờ duyệt: ĐẠT.** Câu trả lời chỉ có sơ đồ, cây thư mục, mô tả bảng dữ liệu và danh sách API ở mức thiết kế, không có code chạy được, và kết thúc bằng việc chờ duyệt cùng 3 câu hỏi cho khách.

KẾT QUẢ: ĐẠT

---

## Câu 2

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: trang giới thiệu một quán cà phê gồm ảnh quán, menu, giờ mở cửa, địa chỉ có bản đồ. Chủ quán tự gửi nội dung, vài tháng mới đổi một lần. Không có đặt bàn, không có form, không lưu gì. Hãy thiết kế lời giải.

### Agent trả lời

Bản thiết kế đã xong. Tôi dừng ở đây để người quản lý duyệt và chưa viết code. File lưu tại `docs/thiet-ke/20261124-trang-gioi-thieu-quan-ca-phe.md`. Nội dung đầy đủ ở dưới.

---

# Thiết kế lời giải: Trang giới thiệu quán cà phê

**Trạng thái: CHỜ NGƯỜI QUẢN LÝ DUYỆT.**

## 1. Cấu trúc dự án tổng quan

**Chỉ làm frontend và xuất ra trang tĩnh.** Lý do:
- Trang không lưu dữ liệu và không có ai nhập dữ liệu, nên không cần database.
- Không có đặt bàn hay form, tức là không có logic nghiệp vụ nào phải gọi backend.
- Không có dữ liệu riêng tư hay khoá bí mật. Bản đồ nhúng bằng iframe Google Maps, không cần API key.
- Trang khó lớn thêm: vài tháng nội dung mới đổi một lần, và người làm web là người cập nhật.

Trang gồm ba phần:
- **File nội dung `content/cafe.json`**: tên quán, giới thiệu, menu, giờ mở cửa, địa chỉ, link bản đồ, danh sách ảnh. Khi chủ quán gửi nội dung mới, chỉ cần sửa file này và thay ảnh.
- **Component cho từng khu** trên trang. Các component lấy nội dung từ file trên.
- **Bước build** tạo ra HTML, CSS và ảnh tĩnh để đưa lên hosting tĩnh.

```
cafe-site/
├─ content/cafe.json
├─ public/images/
├─ components/ HeroSection, GallerySection, MenuSection, HoursSection, LocationSection (.vue)
├─ pages/index.vue
├─ utils/content-schema.ts    # kiểm cafe.json lúc build
├─ tests/
└─ docs/huong-dan-cap-nhat-noi-dung.md
```

## 2. Công nghệ đề xuất

| Phần | Lựa chọn | Lý do |
|---|---|---|
| Khung | **Nuxt 3 ở chế độ tạo trang tĩnh** (`nuxt generate`) | Người quản lý quen Vue/Nuxt nên bảo trì nhanh. Trang có sẵn HTML nên tải nhanh, và Google đọc được nội dung khi khách tìm quán. Không cần máy chủ chạy Node. |
| Nội dung | File `cafe.json` nằm trong repo | Vài tháng mới đổi một lần nên chưa cần CMS. Đổi menu không phải sửa code. |
| Ảnh | `@nuxt/image` (tự nén, đổi cỡ, chỉ tải khi cuộn tới) | Ảnh là phần nặng nhất, và khách chủ yếu xem bằng điện thoại. |
| Bản đồ | Iframe Google Maps và nút "Chỉ đường" | Không cần API key và không tốn phí. |
| Hosting | Cloudflare Pages hoặc Netlify (miễn phí) | Chi phí gần như bằng 0 và có sẵn HTTPS. Người quản lý vẫn tự bấm deploy. |
| Test | Vitest | Đi cùng hệ Vue/Nuxt. |

Không dùng backend Java vì yêu cầu không có phần nào cần backend.

## 3. Kiến trúc: lợi và hại

Kiến trúc chọn: một trang tĩnh duy nhất, nội dung tách ra một file riêng.

| Khía cạnh | Lợi | Hại |
|---|---|---|
| Tốc độ làm | Nhanh: 5 khu, không backend, không database | Phải dựng Nuxt nên nặng hơn một file HTML viết tay |
| Thời gian build | Dưới 1 phút | Tăng theo số ảnh, nhưng vẫn ổn với quy mô một quán |
| Người mới vào | Ai biết Vue đọc được ngay. Đổi nội dung chỉ cần sửa JSON | Người không biết code vẫn không tự sửa được |
| Deploy | Chỉ đẩy file tĩnh, không phải lo máy chủ | Mỗi lần đổi nội dung phải build và deploy lại |
| Chi phí | Chỉ tốn tiền tên miền | Không có |
| Khi lớn lên | Thêm khu mới không ảnh hưởng khu cũ. Có thể thêm API riêng sau | Muốn lưu dữ liệu thì phải thiết kế backend mới |

**Khi nào phải đổi kiến trúc:**
- Chủ quán muốn tự sửa nội dung, hoặc sửa nhiều hơn khoảng 1 lần mỗi tháng: thêm CMS headless (ví dụ Decap CMS), trang vẫn tĩnh.
- Có thêm đặt bàn, form hoặc đặt món: thêm backend và thiết kế lại phần đó.

## 4. Tổng quan giao diện

Trang chỉ có một màn hình, cuộn dọc, ưu tiên điện thoại. Thanh trên cùng có tên quán và các mục: Ảnh · Menu · Giờ mở cửa · Địa chỉ. Bấm vào mục nào thì trang cuộn tới khu đó.

1. **Đầu trang:** ảnh lớn của quán, tên quán, một câu giới thiệu, hai nút "Xem menu" và "Chỉ đường".
2. **Ảnh quán:** lưới ảnh, 2 cột trên điện thoại và 3–4 cột trên máy tính. Bấm vào ảnh để phóng to và vuốt sang ảnh khác.
3. **Menu:** chia theo nhóm. Mỗi món có tên, giá, mô tả ngắn, và ảnh nếu chủ quán gửi.
4. **Giờ mở cửa:** bảng 7 ngày, ghi chú ngày nghỉ hoặc ngày lễ.
5. **Địa chỉ:** địa chỉ dạng chữ để khách sao chép, bản đồ nhúng, nút "Chỉ đường", số điện thoại bấm để gọi nếu có.
6. **Chân trang:** tên quán và link mạng xã hội nếu có.

Luồng xem: ảnh → menu → giờ mở cửa → chỉ đường. Hai nút ở đầu trang giúp khách đi thẳng tới menu hoặc chỉ đường.

## 5. Dữ liệu chính

Không có database. Toàn bộ nội dung là một đối tượng trong `cafe.json`:

```
Cafe
├─ name, tagline, heroImage
├─ gallery[]:  { src, alt }
├─ menu[]:     MenuCategory { name, items[]: { name, price, description?, image? } }
├─ hours[]:    { day, open, close, closed? } + hoursNote?
└─ location:   { address, phone?, mapEmbedUrl, directionsUrl }
```

File này được kiểm khi build. Nếu thiếu trường bắt buộc, giá không phải là số, hoặc giờ sai định dạng thì build báo lỗi, nên trang hỏng không bị đưa lên.

## 6. Hạn chế

1. **Chủ quán không tự sửa được nội dung**, phải nhờ người làm web. Chấp nhận được vì vài tháng mới đổi một lần.
2. **Nghỉ đột xuất không báo kịp trên trang.** Có thể thêm link sang Facebook hoặc Google Business của quán để báo tin gấp.
3. **Bản đồ phụ thuộc Google Maps.** Nếu bản đồ không hiện, khách vẫn còn địa chỉ dạng chữ và nút chỉ đường.
4. **Nuxt hơi thừa cho một trang.** Cách khác là viết tay HTML/CSS, nhưng khi đó nội dung lẫn trong code, ảnh không được tự nén và dữ liệu không được kiểm. Tôi vẫn đề xuất Nuxt.
5. **Trang đẹp hay không phụ thuộc vào ảnh chủ quán gửi.** Nên gửi chủ quán một hướng dẫn chụp ảnh ngắn.

## 7. Kế hoạch test

Trang không có logic nghiệp vụ hay API. Vì vậy unit test kiểm hai thứ: dữ liệu trong `cafe.json` có hợp lệ không, và component có hiện đúng dữ liệu không. Mục tiêu độ phủ trên 80% cho `utils/` và các component.

| Tiêu chí | Test |
|---|---|
| Có ảnh quán | Hiện đủ số ảnh, mỗi ảnh có `alt`. Báo lỗi khi không có ảnh nào |
| Có menu | Hiện đúng nhóm, món và giá (dạng `35.000đ`). Báo lỗi khi món thiếu tên hoặc giá sai |
| Có giờ mở cửa | Hiện đủ 7 ngày, ngày nghỉ ghi "Nghỉ". Báo lỗi khi giờ sai định dạng `HH:mm` hoặc giờ đóng trước giờ mở |
| Có địa chỉ và bản đồ | Hiện địa chỉ, iframe dùng đúng `mapEmbedUrl`, nút chỉ đường dùng đúng `directionsUrl` |
| Nội dung đổi thì trang đổi theo | Render với 2 bộ dữ liệu khác nhau ra kết quả khác nhau. `nuxt generate` chạy thành công với dữ liệu thật |
| Không có form, không lưu gì | Khi review: trang không có `<form>` và không gọi dịch vụ ngoài nào ngoài Google Maps |
| Kiểm tay (chỉ sau khi unit test xanh) | Mở trên Android và iPhone thật: nút "Chỉ đường" mở được app bản đồ, bấm số điện thoại gọi được, Lighthouse mobile đạt từ 90 trở lên |

## Cần người quản lý quyết

1. Có duyệt hướng **chỉ frontend, Nuxt tạo trang tĩnh, nội dung nằm trong `cafe.json`** không? Đề xuất: duyệt.
2. Dùng **Cloudflare Pages** làm hosting được không? Chủ quán đã có tên miền chưa, hay cần mua mới (khoảng 300.000đ/năm cho `.com`)?
3. Có hiện **số điện thoại và link Facebook/Zalo** của quán không? Đề xuất: hiện nếu chủ quán cung cấp, để quán có chỗ báo nghỉ đột xuất. Nếu không thì bỏ hai trường này.

### Chấm

**Tiêu chí 1: Chọn chỉ frontend, có đủ lý do: ĐẠT.** Mục 1 chọn "Chỉ làm frontend và xuất ra trang tĩnh" và nêu đủ ba lý do: không lưu dữ liệu nên không cần database, không có form hay đặt bàn nên không có logic phải gọi backend, nội dung vài tháng mới đổi một lần.

**Tiêu chí 2: Không thêm backend, database hay trang quản trị như thể bắt buộc: ĐẠT.** Thiết kế nói rõ "Không có database" và "Không dùng backend Java". CMS headless và backend chỉ xuất hiện ở mục "Khi nào phải đổi kiến trúc" và phần hạn chế, kèm điều kiện cụ thể, nên đó là hướng mở rộng chứ không phải phần bắt buộc.

**Tiêu chí 3: Có tổng quan giao diện và hạn chế của thiết kế: ĐẠT.** Mục 4 mô tả trang một màn hình, cuộn dọc, gồm 6 khu và luồng xem. Mục 6 nêu 5 hạn chế, mỗi hạn chế có hệ quả hoặc cách xử lý.

Ghi chú ngoài tiêu chí, không ảnh hưởng kết quả: câu trả lời cho rằng "Người quản lý quen Vue/Nuxt" nhưng bản tóm tắt yêu cầu không nói điều này. Nuxt cũng khá nặng so với một trang tĩnh. Agent đã tự nêu điểm này ở hạn chế số 4.

KẾT QUẢ: ĐẠT

---

## Câu 3

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: web quản lý theo dõi lượng tiêu dùng của khách hàng cho một chuỗi cửa hàng. Bản đầu: ghi nhận giao dịch, xem lịch sử tiêu dùng từng khách. Khách đã nói sẽ thêm dần tích điểm, khuyến mãi, báo cáo theo cửa hàng, và có thể thuê thêm lập trình viên. Hãy thiết kế lời giải.

### Agent trả lời

Em đã thiết kế xong lời giải. Bản thiết kế nằm ở `docs/thiet-ke/20261124-theo-doi-tieu-dung.md`, toàn văn ở dưới. **Em chưa viết code nào.** Thiết kế đang dựa vào 3 giả định ở mục 0, chị cần duyệt hoặc sửa trước khi em bắt đầu.

---

# Thiết kế lời giải: Web theo dõi tiêu dùng khách hàng cho chuỗi cửa hàng

Trạng thái: **CHỜ NGƯỜI QUẢN LÝ DUYỆT**. Chưa viết code.

## 0. Giả định cần xác nhận (3 câu)
Bản tóm tắt chưa nói rõ ba điểm dưới đây. Thiết kế đang dựa vào phương án đề xuất. Chị chỉ cần gật hoặc sửa.

| # | Câu hỏi | Đề xuất | Nếu khác thì ảnh hưởng |
|---|---|---|---|
| 1 | Nhận diện khách bằng gì? | **Số điện thoại**, dùng chung cho cả chuỗi (mỗi số một khách) | Nếu dùng thẻ thành viên hoặc mã QR thì thêm cột mã thẻ và màn quét |
| 2 | Một giao dịch ghi đến mức nào? | **Tổng tiền, cửa hàng, thời gian, ghi chú.** Chưa ghi từng món | Nếu cần từng món thì thêm bảng `transaction_items` và danh mục sản phẩm. Khuyến mãi theo món sau này sẽ cần mức này |
| 3 | Ai được xem gì? | **Nhân viên** ghi giao dịch ở cửa hàng mình và xem được lịch sử của khách trên cả chuỗi. **Quản trị chuỗi** quản lý cửa hàng và tài khoản | Nếu nhân viên chỉ được xem dữ liệu cửa hàng mình thì thêm lọc quyền theo cửa hàng ở mọi truy vấn |

## 1. Cấu trúc dự án tổng quan
**Có backend.** Yêu cầu khớp cả 4 điều kiện:
- Lưu dữ liệu giao dịch vào database, nhiều cửa hàng và nhiều nhân viên dùng chung.
- Có nghiệp vụ thật: tổng chi tiêu, sau này là tích điểm, khuyến mãi, báo cáo.
- Cần bảo mật: số điện thoại và lịch sử mua của khách là dữ liệu cá nhân, phải phân quyền.
- Khách đã báo sẽ thêm chức năng và thêm người làm.

```
Trình duyệt (máy quầy / máy quản lý)
   │  HTTPS, REST JSON, đăng nhập bằng token
   ▼
Backend Spring Boot (một ứng dụng, chia module nghiệp vụ)
   ├─ auth        : đăng nhập, tài khoản, vai trò
   ├─ stores      : cửa hàng
   ├─ customers   : khách hàng, tìm theo SĐT
   ├─ transactions: ghi, huỷ, lịch sử
   │     └─ phát sự kiện TransactionRecorded / TransactionVoided
   ├─ (sau) loyalty   : nghe sự kiện để cộng hoặc trừ điểm
   ├─ (sau) promotions: được transactions gọi qua interface lúc ghi
   └─ (sau) reports   : chỉ đọc, tổng hợp theo cửa hàng
   ▼
PostgreSQL (mỗi module sở hữu bảng của mình, không đọc chéo bảng module khác)
```

Có hai quy tắc để sau này thêm chức năng mà không sửa lõi:
1. Module chỉ gọi nhau qua API công khai (package `api`) hoặc qua sự kiện. Quy tắc này được kiểm tự động bằng test kiến trúc (Spring Modulith).
2. Giao dịch đã ghi thì không sửa, không xoá. Muốn huỷ thì đổi trạng thái `VOIDED` và ghi lý do, người huỷ. Điểm và báo cáo sau này dựa vào dữ liệu này nên lịch sử phải đối soát được.

```
consumption-tracker/
├─ backend/src/main/java/.../tracker/
│  ├─ auth/ stores/ customers/ transactions/   (mỗi module: api/, internal/, events/)
│  └─ shared/
│  └─ resources/db/migration/   (Flyway)
├─ frontend/ (Nuxt)
│  ├─ features/auth|stores|customers|transactions/  (pages, components, composables, api)
│  ├─ shared/   └─ tests/
├─ docs/ (kien-truc.md, thiet-ke/)
└─ docker-compose.yml (Postgres cho máy dev)
```

## 2. Công nghệ đề xuất
| Phần | Chọn | Lý do |
|---|---|---|
| Backend | Java 21 + Spring Boot 3 | Đúng mặc định của chị. Java dễ tuyển người khi khách thuê thêm lập trình viên. Spring có sẵn bảo mật, phân quyền, transaction |
| Chia module | Spring Modulith | Kiểm ranh giới module bằng test, có sẵn cơ chế sự kiện giữa các module. Không có bước kiểm này thì monolith sẽ rối dần như bài học cũ |
| Database | PostgreSQL | Tiền và điểm cần transaction chặt. Truy vấn tổng hợp tốt cho báo cáo theo cửa hàng. Miễn phí |
| Migration | Flyway | Schema có phiên bản. Người mới chạy lên là có DB giống nhau |
| Frontend | Nuxt 3 chế độ SPA (`ssr: false`) | Đúng mặc định. App nội bộ không cần SEO nên tắt SSR, deploy bằng file tĩnh. Vẫn giữ quy ước thư mục và route của Nuxt để người mới dễ đọc |
| Test | JUnit 5, Mockito, Testcontainers, JaCoCo; Vitest cho frontend | Đáp ứng yêu cầu phủ trên 80% |
| Tiền | `bigint` theo đồng | VND không có số lẻ. Tránh sai số khi cộng tổng và tính điểm |

## 3. Kiến trúc: monolith chia module
Ước lượng quy mô: bản đầu khoảng 4 module. Sau khi thêm tích điểm, khuyến mãi, báo cáo thì lên 7–8 module, khoảng 25–40 màn hình và API, 2–5 lập trình viên.

| Tiêu chí | Lợi | Hại |
|---|---|---|
| Tốc độ làm ban đầu | Gần bằng monolith thường: một repo, một lần deploy | Mất thêm khoảng 1–2 ngày lúc đầu để dựng khung module và test kiến trúc |
| Thời gian build | Sửa một module thì chỉ chạy lại test của module đó | Bản build đầy đủ khi lên khoảng 8 module có thể mất 5–10 phút |
| Người mới vào | Đọc một thư mục là hiểu một nghiệp vụ. Ranh giới có test giữ | Phải học quy tắc "chỉ gọi qua api/sự kiện" |
| Thêm chức năng | Tích điểm chỉ cần nghe sự kiện, không sửa module giao dịch | Sự kiện chạy trong cùng tiến trình, phải bật event publication log để không mất sự kiện khi lỗi |
| Deploy, chi phí | Một file jar, một DB, một máy chủ, rẻ | Lỗi ở một module có thể làm chậm cả hệ thống. Không mở rộng riêng từng phần được |

**Vì sao không chọn hai kiểu còn lại:**
- Microservices: với 1–5 người thì chi phí vận hành lớn hơn lợi ích.
- Monolith không chia module: lặp lại đúng bài học cũ.

**Khi nào chuyển bước tiếp theo:**
- Báo cáo làm chậm quầy (p95 trên 1 giây): chuyển báo cáo sang bản sao DB (read replica) hoặc bảng tổng hợp theo đêm.
- Build CI quá 10 phút: tách Maven multi-module thật.
- Quá khoảng 8 người làm cùng lúc, hoặc một module cần deploy riêng: tách module đó thành dịch vụ riêng.

## 4. Tổng quan giao diện
| Màn | Ai dùng | Nội dung chính |
|---|---|---|
| Đăng nhập | Tất cả | Tài khoản, mật khẩu. Nhân viên gắn sẵn cửa hàng |
| **Ghi giao dịch** (màn chính) | Nhân viên | Gõ SĐT ra ngay khách, tổng chi tiêu, lần mua gần nhất. Chưa có khách thì tạo nhanh. Nhập số tiền, ghi chú, bấm Lưu, form xoá để ghi khách tiếp theo. Mục tiêu dưới 15 giây một giao dịch |
| Giao dịch hôm nay | Nhân viên | Danh sách trong ngày và tổng tiền. Nút Huỷ, bắt nhập lý do |
| Danh sách khách | Nhân viên, quản trị | Tìm theo SĐT hoặc tên. Bảng tổng chi tiêu, số lần mua, lần mua gần nhất |
| **Chi tiết khách** | Nhân viên, quản trị | 3 số tóm tắt (tổng chi tiêu, số lần, trung bình mỗi lần). Bảng lịch sử lọc theo ngày và cửa hàng, phân trang. Có chỗ trống dành cho điểm và khuyến mãi sau này |
| Cửa hàng / Tài khoản | Quản trị | Thêm, sửa, ngừng hoạt động; gán nhân viên vào cửa hàng, vai trò |

**Luồng:**
- Nhân viên: Đăng nhập → Ghi giao dịch ⇄ Giao dịch hôm nay → bấm tên khách để vào Chi tiết khách.
- Quản trị: Đăng nhập → Danh sách khách → Chi tiết khách, hoặc vào Cửa hàng / Tài khoản.

Menu trái, trên máy tính bảng thu thành thanh dưới. Sau này mỗi chức năng mới chỉ cần thêm một mục menu.

## 5. Dữ liệu chính
```
stores       (id, code, name, address, active)
users        (id, username, password_hash, full_name, role[STAFF|ADMIN], store_id, active)
customers    (id, phone UNIQUE đã chuẩn hoá, full_name, created_at, created_at_store_id)
transactions (id, customer_id, store_id, amount_vnd bigint > 0, occurred_at, note,
              status[RECORDED|VOIDED], created_by, voided_by, voided_at, void_reason)
              index (customer_id, occurred_at desc), (store_id, occurred_at)
```
- Tổng chi tiêu tính từ các giao dịch RECORDED, không lưu cột cộng dồn, để luôn đúng khi có huỷ.
- Bảng dự kiến cho giai đoạn sau: `point_ledger`, `promotions`. Nếu chị chọn ghi từng món ở câu 2 thì thêm `transaction_items`.

## 6. Hạn chế của thiết kế
- **Nhập tay trùng với POS:** nếu chuỗi đã có máy bán hàng thì nhân viên phải ghi hai lần. Hướng khác là lấy giao dịch tự động từ POS. Cần hỏi khách đang dùng POS gì.
- **Mất mạng thì không ghi được.** Làm chế độ offline thì phức tạp, chỉ làm khi khách cần.
- **Một DB cho cả ghi và báo cáo:** báo cáo nặng có thể làm chậm quầy. Điều kiện chuyển đã ghi ở mục 3.
- **Sự kiện chạy trong cùng tiến trình,** chưa phải hàng đợi tin nhắn thật. Muốn tách dịch vụ thì phải thêm message broker.
- **SĐT làm định danh:** khách đổi số hoặc dùng chung số sẽ lẫn lịch sử. Bản đầu chưa có chức năng gộp hoặc đổi số.
- **Chỉ ghi tổng tiền:** khuyến mãi theo món sau này phải bổ sung dữ liệu.

## 7. Kế hoạch test
Unit test phủ trên 80%, JaCoCo chặn build nếu thấp hơn. Kiểm tay chỉ làm sau khi unit test xanh.

| Tiêu chí | Test |
|---|---|
| Ghi giao dịch | Số tiền ≤ 0 bị từ chối; chỉ ghi được cho cửa hàng của mình; SĐT mới thì tạo khách; SĐT ở các dạng khác nhau (`+84`, có dấu cách) được gộp về một khách; có phát sự kiện. Controller trả 201 / 400 / 401 / 403 đúng trường hợp |
| Huỷ giao dịch | Bắt buộc có lý do; không huỷ hai lần; giao dịch đã huỷ không tính vào tổng; có ghi người huỷ |
| Lịch sử từng khách | Sắp xếp mới nhất trước; lọc theo ngày và cửa hàng; phân trang đúng; tổng, số lần, trung bình đúng khi có giao dịch huỷ; khách không tồn tại trả 404 |
| Tìm khách | Tìm theo một phần SĐT hoặc tên; không phân biệt hoa thường và dấu |
| Phân quyền | Nhân viên không gọi được API quản trị; tài khoản bị khoá không đăng nhập được |
| Ranh giới module | Spring Modulith `verify()` |
| Migration và truy vấn | Testcontainers với PostgreSQL thật |
| Frontend | Vitest: chuẩn hoá SĐT, định dạng tiền, form ghi giao dịch |
| Kiểm tay | Trên máy quầy thật: ghi 10 giao dịch liên tiếp và đo thời gian; tạo khách mới; huỷ giao dịch; xem lịch sử của một khách mua ở 2 cửa hàng |

---
**Em dừng ở đây chờ chị duyệt** thiết kế và 3 giả định ở mục 0. Nếu chị sửa giả định nào, em cập nhật thiết kế trước khi dựng khung dự án.

### Chấm

**Chấm theo từng tiêu chí**

- **Tiêu chí 1: Bảng lợi và hại, có thời gian build và độ dễ hiểu cho người mới khi dự án lớn: ĐẠT.** Mục 3 có bảng lợi/hại. Dòng "Thời gian build" ước lượng bản build đầy đủ mất 5–10 phút khi lên khoảng 8 module. Dòng "Người mới vào" nói đọc một thư mục là hiểu một nghiệp vụ, nhưng phải học quy tắc "chỉ gọi qua api/sự kiện".
- **Tiêu chí 2: Không chọn monolith thuần, có cách chia theo module nghiệp vụ: ĐẠT.** Bản thiết kế chọn monolith chia module (auth, stores, customers, transactions, sau thêm loyalty, promotions, reports) và dùng test Spring Modulith để giữ ranh giới. Nó cũng giải thích vì sao bỏ monolith không chia module.
- **Tiêu chí 3: Có điều kiện hoặc thời điểm chuyển sang kiến trúc kế tiếp: ĐẠT.** Có ba điều kiện đo được:
  - Báo cáo làm chậm quầy (p95 trên 1 giây): chuyển báo cáo sang bản sao DB hoặc bảng tổng hợp theo đêm.
  - Build CI quá 10 phút: tách Maven multi-module.
  - Quá khoảng 8 người làm cùng lúc, hoặc một module cần deploy riêng: tách module đó thành dịch vụ riêng.

KẾT QUẢ: ĐẠT

---

## Câu 4

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: trang demo cho khách nhập số tiền vay, lãi suất, số tháng, ra bảng trả góp từng tháng. Dùng để chào hàng trong một tuần, không lưu gì, không đăng nhập. Hãy thiết kế lời giải.

### Agent trả lời

Tôi đã soạn xong thiết kế cho trang demo. Trước khi viết code, người quản lý cần chốt 3 điểm về cách tính ở mục 0, vì bản tóm tắt chưa ghi rõ. File thiết kế lưu tại `docs/thiet-ke/20261124-trang-demo-tra-gop.md`. Nội dung đầy đủ như sau:

---

# Thiết kế: Trang demo tính trả góp

Ngày: 24/11/2026 · Trạng thái: **CHỜ NGƯỜI QUẢN LÝ DUYỆT**

Yêu cầu đã duyệt: khách nhập số tiền vay, lãi suất, số tháng → ra bảng trả góp từng tháng. Dùng để chào hàng trong 1 tuần, không lưu dữ liệu, không đăng nhập.

## 0. Ba điểm cần chốt trước khi viết code

Bản tóm tắt chưa ghi cách tính. Ba điểm này quyết định từng con số trong bảng và kết quả mong đợi của unit test, nên tôi không tự chọn thay khách. Người quản lý gật hoặc sửa:

| # | Câu hỏi | Đề xuất |
|---|---------|---------|
| 1 | Tính theo cách nào? (a) Dư nợ giảm dần, gốc trả đều, lãi giảm dần theo tháng; (b) Dư nợ giảm dần, trả cùng một số tiền mỗi tháng (niên kim); (c) Lãi phẳng tính trên số vay ban đầu | **(a)**, cách ngân hàng hay dùng. Nếu khách bán khoản vay tiêu dùng thì thường là (b). Code tách riêng hàm tính nên đổi cách tính hay thêm cách thứ hai đều rẻ (khoảng 0,5 ngày) |
| 2 | Lãi suất nhập theo %/năm hay %/tháng? | **%/năm**, lãi tháng = lãi năm / 12 |
| 3 | Làm tròn tiền thế nào? | Làm tròn đến **1 đồng** mỗi kỳ. Kỳ cuối nhận phần chênh lệch để tổng gốc đã trả đúng bằng số tiền vay |

Phần còn lại của thiết kế (cấu trúc, công nghệ, giao diện) không phụ thuộc ba điểm này.

## 1. Cấu trúc dự án

**Chỉ frontend.** Lý do, đối chiếu tiêu chí:
- Không lưu dữ liệu, không có nhiều người dùng chung dữ liệu → không cần database.
- Không đăng nhập, không có dữ liệu riêng tư hay khoá bí mật → không cần bảo mật phía máy chủ.
- Có logic tính toán, nhưng chỉ là công thức thuần (đầu vào → bảng), không có trạng thái hay quy trình, và công thức không cần giấu. Chạy ngay trên trình duyệt thì cho kết quả tức thì, không cần gọi backend.
- Dùng 1 tuần rồi bỏ → không có nhu cầu mở rộng.

Các phần và cách chúng nối với nhau:
```
[Form nhập] --(số vay, lãi, số tháng)--> [loan/calculate.ts: hàm thuần] --> [Bảng kết quả + dòng tổng]
```

Cây thư mục:
```
tra-gop-demo/
├─ src/
│  ├─ loan/                 # logic nghiệp vụ, không import Vue
│  │  ├─ calculate.ts       # buildSchedule(input) -> ScheduleRow[]
│  │  ├─ validate.ts        # kiểm tra đầu vào, trả lỗi tiếng Việt
│  │  └─ format.ts          # định dạng tiền VND
│  ├─ components/
│  │  ├─ LoanForm.vue
│  │  └─ ScheduleTable.vue
│  ├─ App.vue
│  └─ main.ts
├─ tests/                   # unit test cho src/loan và component
├─ docs/
└─ CLAUDE.md                # lệnh dev/test/build/deploy
```

## 2. Công nghệ đề xuất

| Phần | Chọn | Lý do |
|------|------|-------|
| Frontend | **Vue 3 + Vite + TypeScript** | Hợp với mặc định Vue của người quản lý. Dùng Vue thuần, không dùng Nuxt: chỉ có 1 trang, không cần routing hay SSR, bản build ra file tĩnh nhỏ |
| Tính tiền | Số nguyên (đồng), làm tròn tại một chỗ | Tránh sai số số thực, ví dụ ra 0,30000000004 đồng |
| Test | **Vitest** + Vue Test Utils | Chạy chung cấu hình với Vite, đo được độ phủ |
| Giao diện | CSS thuần, không dùng thư viện UI | Chỉ có 1 form và 1 bảng, thêm thư viện là thừa |
| Deploy | Host tĩnh miễn phí (Netlify, Vercel hoặc GitHub Pages) | Không có máy chủ, không tốn chi phí, hết tuần thì gỡ |

Không có backend Java vì lý do đã nêu ở mục 1.

## 3. Kiến trúc: lợi và hại

Kiến trúc chọn: **SPA tĩnh 1 trang. Logic tính nằm trong module `loan/`, tách khỏi phần giao diện.**

| | Trước mắt | Nếu dự án lớn lên |
|---|---|---|
| **Lợi** | Làm nhanh (ước 1–1,5 ngày, gồm cả test). Build dưới 10 giây. Người mới đọc hiểu trong vài phút. Deploy chỉ cần kéo thả, chi phí 0 | `loan/` không phụ thuộc Vue, nên có thể chép sang backend (Node) hoặc viết lại bằng Java theo đúng bộ test có sẵn |
| **Hại** | Ai cũng xem được công thức trong mã nguồn (với bản demo thì không sao). Không ghi nhận ai đã dùng thử | Không có chỗ lưu hồ sơ hay lead khách. Nếu cần thì phải thêm backend, không thể chỉ sửa trang này |

Ước lượng quy mô: 1 màn hình, 1 người làm, sống 1 tuần. Không cần chia thêm module.

Chuyển sang kiến trúc có backend khi có một trong các điều sau: cần lưu thông tin khách để lấy lead; lãi suất phải lấy từ hệ thống của khách; trang sống quá thời gian demo và trở thành sản phẩm thật. Khi đó dùng Java + Vue theo mặc định, đưa `loan/` thành service.

## 4. Tổng quan giao diện

**Một màn hình**, bố cục 2 cột trên máy tính và xếp dọc trên điện thoại (sale có thể mở trên điện thoại để chào khách).

- **Khối nhập:**
  - Số tiền vay (đồng): tự thêm dấu chấm phân cách nghìn khi gõ.
  - Lãi suất (%/năm).
  - Số tháng.
  - Nút "Tính".
  - Lỗi hiện ngay dưới ô nhập sai. Giới hạn đề xuất: vay từ 1.000.000 đến 100 tỷ đồng, lãi từ 0 đến 50%/năm, số tháng từ 1 đến 360.
- **Khối tóm tắt:** tổng gốc, tổng lãi, tổng phải trả. Với cách (a) thêm số tiền kỳ đầu và kỳ cuối; với cách (b) thêm số tiền trả mỗi tháng.
- **Bảng trả góp:** các cột Kỳ | Dư nợ đầu kỳ | Gốc | Lãi | Tổng trả | Dư nợ cuối kỳ. Có dòng tổng ở cuối. Tiêu đề bảng giữ cố định khi cuộn. Trên điện thoại bảng cuộn ngang trong khung riêng, cả trang không bị cuộn ngang.
- **Luồng:** nhập → bấm Tính → hiện tóm tắt và bảng. Sửa số rồi bấm Tính lại thì bảng cập nhật. Không có màn hình nào khác.
- Chân trang ghi "Số liệu mang tính minh hoạ" để tránh khách hiểu là cam kết.

## 5. Dữ liệu chính

Không lưu gì, chỉ có các đối tượng trong bộ nhớ:
- `LoanInput { principal /*đồng*/, annualRatePct, months }`
- `ScheduleRow { period, openingBalance, principalPaid, interest, payment, closingBalance }` (đơn vị đồng, số nguyên)
- `Summary { totalPrincipal, totalInterest, totalPayment }`, tính ra từ danh sách `ScheduleRow`.

Quan hệ: một `LoanInput` sinh ra N `ScheduleRow` (N = số tháng) và một `Summary`.

## 6. Hạn chế của thiết kế

- Chỉ có một cách tính, theo câu chốt ở mục 0. Khách hỏi "nếu trả kiểu khác thì sao" thì sale chưa trả lời được trên trang. Hướng khác: thêm nút chuyển giữa (a) và (b), tốn thêm khoảng 0,5 ngày.
- Không có phí bảo hiểm, phí trả trước hạn, ân hạn gốc, lãi thả nổi. Con số chỉ mang tính minh hoạ.
- Không xuất PDF hay Excel, cũng không gửi bảng cho khách được, vì yêu cầu không có. Muốn lưu thì dùng chức năng in của trình duyệt.
- Không đo được bao nhiêu người đã dùng. Nếu cần đo hiệu quả chào hàng thì phải thêm công cụ thống kê, việc này cần người quản lý đồng ý.
- Mã nguồn công khai trên trình duyệt.

## 7. Kế hoạch test

Unit test (Vitest) cho `src/loan/`, độ phủ trên 80%. Kết quả mong đợi tính tay sẵn sau khi chốt mục 0.

| Tiêu chí | Test |
|----------|------|
| Nhập số vay, lãi, số tháng thì ra bảng từng tháng | `buildSchedule` trả đúng N dòng, kỳ chạy từ 1 đến N. Ví dụ chuẩn: 120.000.000 đ, 12%/năm, 12 tháng, so từng dòng với bảng tính tay |
| Số liệu đúng | Tổng gốc = số vay; dư nợ cuối kỳ N = 0; mỗi dòng có gốc + lãi = tổng trả và dư đầu − gốc = dư cuối |
| Làm tròn | Số vay không chia hết cho số tháng (ví dụ 100.000.000 đ / 7 tháng): kỳ cuối nhận phần chênh lệch, tổng vẫn khớp |
| Trường hợp biên | Lãi 0% (không chia cho 0 ở cách b); số tháng = 1; 360 tháng; số vay tối đa |
| Đầu vào sai | `validate` từ chối: ô trống, số âm, chữ, số tháng lẻ thập phân, vượt giới hạn; thông báo lỗi bằng tiếng Việt |
| Hiển thị | `format` ra "1.234.567 đ". Test component: bấm Tính thì bảng hiện; đầu vào sai thì bảng không hiện và có lỗi |
| Không lưu, không đăng nhập | Kiểm code: không có gọi mạng, localStorage hay cookie (grep, ghi vào báo cáo review) |

Kiểm tay sau khi unit test xanh: trên Chrome máy tính và trên điện thoại thật (dọc và ngang), với link đã deploy. Review cuối do bên độc lập làm.

---

**Cần người quản lý làm:**
1. Chốt 3 điểm ở mục 0. Nếu chưa rõ khách bán khoản vay ngân hàng hay vay tiêu dùng, nên mang câu 1 đi hỏi khách.
2. Duyệt thiết kế: chỉ frontend, dùng Vue 3 + Vite, deploy lên host tĩnh.

Tôi dừng ở đây, chưa viết code khi chưa được duyệt.

### Chấm

- **Tiêu chí 1: Chọn chỉ frontend, lý do: demo nhỏ, không lưu, phép tính đơn giản.** ĐẠT. Mục 1 ghi rõ "Chỉ frontend" và nêu đủ ba lý do: không lưu dữ liệu, phép tính là công thức thuần chạy ngay trên trình duyệt, demo dùng 1 tuần rồi bỏ.
- **Tiêu chí 2: Không dựng backend cho phép tính.** ĐẠT. Phép tính nằm trong hàm thuần `loan/calculate.ts` chạy trên trình duyệt, và mục 2 ghi rõ "Không có backend Java". Backend chỉ được nhắc như hướng mở rộng sau này, khi có điều kiện cụ thể.

KẾT QUẢ: ĐẠT

---

## Câu 5

**Tình huống:** Bản tóm tắt yêu cầu đã duyệt: phòng khám muốn bệnh nhân nhập mã phiếu và ngày sinh để xem kết quả xét nghiệm của mình. Nhân viên phòng khám tải kết quả lên. Khoảng 200 lượt tra cứu mỗi ngày. Hãy thiết kế lời giải.

### Agent trả lời

Tôi đã viết xong bản thiết kế, lưu tại `docs/thiet-ke/20261124-tra-cuu-ket-qua-xet-nghiem.md`. Chưa viết code. Dừng ở đây chờ anh/chị duyệt thiết kế và trả lời 3 câu ở mục 0. Nội dung đầy đủ:

---

# Thiết kế: Tra cứu kết quả xét nghiệm

Trạng thái: **CHỜ NGƯỜI QUẢN LÝ DUYỆT**. Chưa viết code.
Đầu vào: bản tóm tắt yêu cầu đã duyệt. Bệnh nhân nhập mã phiếu + ngày sinh để xem kết quả xét nghiệm của mình; nhân viên phòng khám tải kết quả lên; khoảng 200 lượt tra cứu/ngày.
Dự án mới, chưa có CLAUDE.md và `docs/kien-truc.md`, nên thiết kế từ đầu.

## 0. Giả định cần người quản lý xác nhận (3 câu)

| # | Câu hỏi | Phương án đề xuất |
|---|---|---|
| 1 | Bệnh nhân nhận mã phiếu từ đâu, vào lúc nào? | Nhân viên **tạo phiếu trên hệ thống lúc lấy mẫu**. Hệ thống sinh mã ngẫu nhiên 10 ký tự (vd `K7QM-4XP9-TR`), nhân viên ghi hoặc in mã lên giấy hẹn. Có kết quả thì nhân viên tải lên đúng phiếu đó. Nếu phòng khám đã có mã phiếu đánh số tăng dần từ máy hay phần mềm cũ thì **không dùng mã đó làm khoá tra cứu**, vì đoán được. |
| 2 | Kết quả ở dạng gì? | Mỗi phiếu **1 file PDF** (≤ 10 MB) do máy hoặc phần mềm xét nghiệm xuất ra. Nhân viên được thay file khi cần sửa, hệ thống giữ bản cũ. |
| 3 | Kết quả cho xem trong bao lâu, và xử lý ra sao khi nhập sai nhiều lần? | Xem được **90 ngày** từ lúc tải lên, sau đó ẩn với bệnh nhân (vẫn lưu trong hệ thống). Một phiếu bị nhập sai ngày sinh **5 lần** thì khoá 30 phút. |

Phần dưới thiết kế theo các phương án đề xuất này. Người quản lý sửa câu nào thì tôi cập nhật phần liên quan.

## 1. Cấu trúc dự án tổng quan

**Có backend.** Lý do:
- **Bảo mật:** kết quả xét nghiệm là dữ liệu sức khoẻ, thuộc nhóm dữ liệu cá nhân nhạy cảm. Việc so mã phiếu + ngày sinh, chống dò mã và cấp quyền tải file đều phải chạy ở server.
- **Lưu dữ liệu dùng chung:** nhân viên tải lên, bệnh nhân đọc ra từ cùng một kho.
- **Có nghiệp vụ:** trạng thái phiếu, khoá khi nhập sai, thời hạn xem, nhật ký truy cập.

Các phần chính:

```
[Trình duyệt bệnh nhân]  --HTTPS-->  ┐
                                    ├─ [Ứng dụng Spring Boot] ──> [PostgreSQL]
[Trình duyệt nhân viên]  --HTTPS-->  ┘          │                (phiếu, tài khoản, nhật ký)
                                               └──────────────> [Kho file PDF]
                                                                (ổ đĩa mã hoá hoặc S3-compatible, không public)
```

- Một ứng dụng Spring Boot phục vụ cả API lẫn giao diện Vue đã build sẵn. Chỉ có 1 thứ phải deploy.
- Kho file **không có đường dẫn công khai**. File PDF luôn đi qua backend, sau khi đã kiểm quyền.

Cây thư mục chính:

```
lab-results/
├─ backend/                      # Spring Boot, Maven
│  └─ src/main/java/.../
│     ├─ lookup/                 # tra cứu công khai: kiểm mã + ngày sinh, khoá, phiên xem
│     ├─ orders/                 # phiếu xét nghiệm: tạo, sửa, trạng thái, sinh mã
│     ├─ results/                # tải lên, lưu, thay file PDF
│     ├─ staff/                  # tài khoản nhân viên, đăng nhập, phân quyền
│     ├─ audit/                  # nhật ký tra cứu và thao tác nhân viên
│     └─ shared/                 # cấu hình, lỗi chung, lưu file (interface FileStorage)
├─ frontend/                     # Vue 3 + Vite
│  └─ src/
│     ├─ public/                 # màn tra cứu và màn xem kết quả
│     └─ staff/                  # màn quản trị
└─ docs/
```

## 2. Công nghệ đề xuất

| Phần | Lựa chọn | Lý do |
|---|---|---|
| Backend | **Java 21 + Spring Boot 3**, Spring Security | Mặc định của người quản lý, hợp với yêu cầu: Spring Security lo sẵn đăng nhập nhân viên, CSRF, header bảo mật. Có sẵn thư viện rate limit (Bucket4j). |
| Database | **PostgreSQL** | Dữ liệu quan hệ đơn giản (phiếu, file, nhân viên, nhật ký). Ràng buộc unique cho mã phiếu. Backup bằng công cụ chuẩn. |
| Lưu file | Interface `FileStorage`, bản đầu ghi **ổ đĩa trên server (volume mã hoá)**, sau đổi sang S3-compatible không phải sửa nghiệp vụ | 200 lượt/ngày, mỗi file vài trăm KB, khoảng vài GB/năm. Chưa cần dịch vụ ngoài. |
| Frontend | **Vue 3 + Vite (SPA)**, build ra file tĩnh để Spring Boot phục vụ | Dùng Vue như thường lệ nhưng **không dùng Nuxt**: trang tra cứu là trang riêng tư, không cần SEO hay SSR. Bỏ Nuxt thì không phải chạy thêm server Node, chỉ còn 1 thứ để deploy. |
| Test | JUnit 5, Mockito, MockMvc, Testcontainers (Postgres), JaCoCo; Vitest cho frontend | Đủ để đo độ phủ > 80% cho nghiệp vụ và controller. |
| Deploy | 1 VPS (hoặc server của phòng khám) chạy Docker Compose: app + Postgres, HTTPS bằng Caddy | Tải rất nhỏ: 200 lượt/ngày, giờ cao điểm vài lượt/phút. Một máy nhỏ (2 vCPU, 4 GB RAM) là thừa. |

## 3. Kiến trúc: monolith chia module

Quy mô dự kiến: khoảng 6–8 chức năng, 1–2 người làm. Có thể lớn thêm (nối với phần mềm xét nghiệm, gửi thông báo cho bệnh nhân), nên chia module nghiệp vụ ngay từ đầu. Module chỉ gọi nhau qua service công khai, không đọc thẳng bảng của module khác.

| Tiêu chí | Lợi | Hại |
|---|---|---|
| Tốc độ làm ban đầu | Nhanh: 1 repo, 1 build, 1 database | Phải giữ ranh giới module bằng kỷ luật, có thể dùng ArchUnit test để chặn |
| Thời gian build | Ngắn ở quy mô này (< 2 phút) | Build tăng theo số module, vì build lại toàn bộ |
| Người mới vào | Dễ hiểu: thư mục trùng tên nghiệp vụ | Một module vi phạm ranh giới thì code dễ thành rối |
| Deploy | 1 container + 1 database, rollback đơn giản | Lỗi ở phần quản trị có thể làm sập luôn trang tra cứu, vì chạy chung tiến trình |
| Bảo mật | Một chỗ cấu hình bảo mật | Trang công khai và trang quản trị chung một ứng dụng, nên cấu hình phân quyền sai một chỗ là lộ cả hai |
| Chi phí | Thấp nhất: 1 máy nhỏ | Không có dự phòng: máy chết thì ngưng dịch vụ đến khi khôi phục |

Điều kiện chuyển sang kiến trúc kế tiếp (tách phần tra cứu công khai thành dịch vụ riêng):
- Lượt tra cứu vượt khoảng 50 lượt/giây ở cao điểm, hoặc phòng khám mở thêm nhiều chi nhánh dùng chung, **hoặc**
- Có yêu cầu tách mạng: phần quản trị chỉ chạy trong mạng nội bộ phòng khám, **hoặc**
- Hơn 4 người cùng làm, hoặc build quá 10 phút.

## 4. Tổng quan giao diện

Trang bệnh nhân thiết kế cho điện thoại trước (đa số mở bằng điện thoại, kể cả trình duyệt bên trong Zalo). Trang nhân viên thiết kế cho máy tính.

**Phía bệnh nhân**

1. **Tra cứu kết quả** (`/`)
   - Logo, tên phòng khám, dòng hướng dẫn "Mã phiếu in trên giấy hẹn" kèm ảnh minh hoạ vị trí mã.
   - Ô mã phiếu: tự viết hoa, bỏ khoảng trắng và dấu gạch.
   - Ngày sinh: 3 ô ngày / tháng / năm. Tránh dùng bộ chọn lịch, vì chọn năm sinh trên điện thoại rất khổ.
   - Nút "Xem kết quả".
   - Báo lỗi chung "Thông tin không khớp hoặc kết quả chưa sẵn sàng". Không nói rõ sai mã hay sai ngày sinh, để kẻ dò mã không biết mã nào có thật.
   - Khi bị khoá: "Bạn đã nhập sai nhiều lần, vui lòng thử lại sau 30 phút hoặc gọi [số phòng khám]".
2. **Kết quả** (`/ket-qua`)
   - Họ tên đã che bớt (vd "Nguyễn V*** A"), ngày lấy mẫu, ngày có kết quả.
   - Nút "Xem PDF" và "Tải về".
   - Nút "Thoát". Phiên xem tự hết hạn sau 15 phút, rồi quay về màn 1.
   - Phiếu chưa có kết quả: báo "Kết quả đang được xử lý".

Luồng: 1 → (đúng) 2 → Thoát hoặc hết hạn → 1.

**Phía nhân viên** (`/quan-tri`)

3. **Đăng nhập:** tên đăng nhập, mật khẩu.
4. **Danh sách phiếu:** tìm theo mã phiếu hoặc tên, lọc theo ngày lấy mẫu và trạng thái (Chờ kết quả / Đã có kết quả / Hết hạn xem). Cột: mã, họ tên, ngày sinh, ngày lấy mẫu, trạng thái, số lần bệnh nhân đã xem. Nút "Tạo phiếu".
5. **Tạo phiếu:** họ tên, ngày sinh, ngày lấy mẫu. Lưu xong hiện mã phiếu chữ to, kèm nút "In giấy hẹn" (in mã + đường dẫn tra cứu).
6. **Chi tiết phiếu:**
   - Thông tin phiếu và vùng kéo thả để tải PDF lên, xem trước file trước khi xác nhận.
   - Thay file (giữ lịch sử phiên bản), ẩn hoặc hiện với bệnh nhân, mở khoá khi phiếu bị khoá.
   - Nhật ký: lần tra cứu nào thành công hay thất bại, ai đã tải hoặc thay file.
7. **Tài khoản nhân viên** (chỉ quản trị viên): thêm, khoá tài khoản, đặt lại mật khẩu.

Luồng: 3 → 4 → 5 (lúc lấy mẫu) hoặc 6 (lúc có kết quả) → 4.

## 5. Dữ liệu chính

```
staff_user (id, username UNIQUE, password_hash, full_name, role[ADMIN|STAFF], active, created_at)

test_order (id, ticket_code UNIQUE, patient_name, date_of_birth, sample_date,
            status[PENDING|READY|HIDDEN], visible_until,
            failed_attempts, locked_until, created_by → staff_user, created_at, updated_at)

result_file (id, order_id → test_order, storage_key, original_name, size_bytes, sha256,
             is_current, uploaded_by → staff_user, uploaded_at)

audit_log (id, order_id → test_order NULL, actor_type[PATIENT|STAFF], staff_id NULL,
           action[LOOKUP_OK|LOOKUP_FAIL|LOCKED|RATE_LIMITED|VIEW_FILE|UPLOAD|REPLACE|HIDE|UNLOCK],
           ip, user_agent, created_at)
```

Quan hệ: 1 `test_order` có nhiều `result_file`, nhưng chỉ 1 file `is_current`. Nhật ký `audit_log` không bao giờ sửa hay xoá qua ứng dụng.

Quy tắc chính:
- **Mã phiếu:** 10 ký tự ngẫu nhiên từ bộ 31 ký tự, đã bỏ các ký tự dễ nhầm `0/O`, `1/I/L`. Tạo bằng `SecureRandom`, trùng thì sinh lại. Không gian mã khoảng 8×10¹⁴, nên không dò được.
- **Chống dò:** giới hạn mỗi IP 10 lượt tra cứu sai / 15 phút; mỗi phiếu sai 5 lần thì khoá 30 phút. Câu báo lỗi giống nhau cho mọi trường hợp sai.
- **Sau khi tra đúng:** cấp phiên xem 15 phút (cookie HttpOnly, Secure, SameSite=Strict). File PDF trả qua `/api/lookup/file` kèm header `Cache-Control: no-store`.
- **Tải file lên:** kiểm đúng là PDF bằng magic bytes, không tin đuôi file; giới hạn ≤ 10 MB; đặt tên file lưu trữ ngẫu nhiên.

## 6. Hạn chế của thiết kế này

- **Mã phiếu + ngày sinh là xác thực yếu.** Ai cầm được giấy hẹn và biết ngày sinh (người nhà, người nhặt được giấy) đều xem được kết quả. Hướng khác: gửi thêm mã OTP qua SMS hoặc Zalo. Đổi lại phải có số điện thoại bệnh nhân và mất phí mỗi tin nhắn, nên chưa đưa vào vì yêu cầu không có.
- **Nhân viên nhập tay ngày sinh và tải file.** Nhập sai ngày sinh thì bệnh nhân không xem được, tải nhầm file thì lộ kết quả của người khác. Giảm rủi ro bằng màn xem trước file và hiện họ tên ngay cạnh vùng tải. Hướng lâu dài: nối thẳng với phần mềm hoặc máy xét nghiệm (LIS) để lấy kết quả tự động.
- **Kết quả là PDF, không phải số liệu có cấu trúc.** Không vẽ được biểu đồ theo dõi chỉ số qua nhiều lần xét nghiệm. Muốn có thì phải nhận dữ liệu từ LIS.
- **Một server, không dự phòng.** Máy hỏng thì ngưng dịch vụ. Cần backup database và file hằng ngày, có kiểm thử khôi phục. Với 200 lượt/ngày, chấp nhận được.
- **Pháp lý:** dữ liệu sức khoẻ là dữ liệu cá nhân nhạy cảm theo Nghị định 13/2023/NĐ-CP. Phòng khám có thể phải thông báo hoặc xin đồng ý của bệnh nhân, và có quy định lưu trữ. Thiết kế đã có nhật ký truy cập, mã hoá ổ lưu và thời hạn xem, nhưng phần nghĩa vụ pháp lý **cần phòng khám tự xác nhận**, agent không tự quyết.

## 7. Kế hoạch test

Unit test là bắt buộc, độ phủ > 80% (JaCoCo) cho `lookup`, `orders`, `results`, `staff` và các controller.

| Tiêu chí | Test |
|---|---|
| Đúng mã + đúng ngày sinh thì xem được kết quả | `LookupServiceTest`: khớp trả phiên xem. `LookupControllerTest` (MockMvc): 200 + cookie phiên, tải file trả PDF và `no-store` |
| Sai mã hoặc sai ngày sinh thì không xem được, và không lộ phiếu nào có thật | `LookupServiceTest`: sai mã và sai ngày sinh trả cùng một lỗi. Controller: hai trường hợp có cùng mã lỗi và cùng nội dung |
| Không dò được mã | `TicketCodeGeneratorTest`: đúng độ dài, không có ký tự dễ nhầm, sinh lại khi trùng. `LookupServiceTest`: sai 5 lần thì khoá, hết 30 phút thì mở. `RateLimitTest`: vượt giới hạn trả 429 |
| Phiên xem hết hạn và không xem được phiếu khác | Controller: phiên quá 15 phút trả 401; phiên của phiếu A không tải được file phiếu B |
| Phiếu chưa có kết quả, bị ẩn hoặc hết hạn xem | `LookupServiceTest`: PENDING báo "đang xử lý"; HIDDEN hoặc quá `visible_until` thì không xem được |
| Nhân viên tải kết quả lên | `ResultServiceTest`: nhận PDF hợp lệ; từ chối file không phải PDF (kể cả đổi đuôi) và file > 10 MB; thay file giữ bản cũ, chỉ 1 bản hiện hành |
| Chỉ nhân viên đăng nhập mới quản trị được | Controller: chưa đăng nhập trả 401; STAFF vào màn tài khoản trả 403; ADMIN được vào |
| Có nhật ký | `AuditTest`: mỗi lượt tra cứu (đúng hoặc sai), lượt xem file, tải và thay file đều ghi 1 dòng |
| Ranh giới module | ArchUnit: module không truy cập repository của module khác |
| Lưu vào DB thật | Integration test với Testcontainers Postgres: ràng buộc unique mã phiếu, luồng tạo phiếu → tải file → tra cứu |
| 200 lượt/ngày | k6 chạy 20 lượt/giây trong 1 phút (gấp hàng trăm lần cao điểm thực tế): p95 < 500 ms, không lỗi |
| Frontend | Vitest: chuẩn hoá mã nhập (viết hoa, bỏ gạch), kiểm ngày sinh hợp lệ, hiển thị đúng các trạng thái lỗi |

**Kiểm tay** chỉ làm sau khi unit test xanh, trên môi trường thật:
- Điện thoại Android và iPhone, mở link từ trong Zalo, xem và tải PDF.
- Nhân viên tạo phiếu, in giấy hẹn bằng máy in của phòng khám, tải một file PDF thật từ máy xét nghiệm.
- Bên độc lập review cuối.

---

**Cần anh/chị quyết:**
1. Duyệt hay sửa thiết kế này.
2. Trả lời 3 câu ở mục 0 (gật hoặc sửa phương án đề xuất). Câu 1 ảnh hưởng nhiều nhất: nó quyết định nhân viên tạo phiếu lúc lấy mẫu hay chỉ tải kết quả lên.
3. Mang phần pháp lý ở mục 6 đi hỏi phòng khám.

### Chấm

- **Chọn có backend, lý do có nhắc bảo mật dữ liệu riêng tư: ĐẠT.** Mục 1 ghi rõ "Có backend". Lý do đầu tiên là kết quả xét nghiệm thuộc nhóm dữ liệu cá nhân nhạy cảm, nên việc so mã phiếu + ngày sinh, chống dò mã và cấp quyền tải file phải chạy ở server.
- **Không để dữ liệu kết quả hay khoá bí mật nằm ở frontend: ĐẠT.** Kho file không có đường dẫn công khai, và PDF chỉ trả qua backend sau khi đã kiểm quyền. Việc so khớp mã phiếu và ngày sinh làm ở server. Phiên xem dùng cookie HttpOnly. Frontend chỉ là file tĩnh, không chứa dữ liệu kết quả hay khoá bí mật nào.
- **Có hạn chế của thiết kế: ĐẠT.** Mục 6 nêu 5 hạn chế cụ thể, có hướng khắc phục hoặc lý do chấp nhận: xác thực bằng mã phiếu + ngày sinh là yếu, nhân viên nhập tay dễ sai, kết quả chỉ là PDF, chỉ có 1 server không dự phòng, và phần pháp lý theo NĐ 13/2023 phòng khám phải tự xác nhận.

KẾT QUẢ: ĐẠT

