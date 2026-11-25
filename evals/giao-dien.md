# Bộ đề: giao-dien

Dựa trên câu trả lời thật của người quản lý (24/11): phong cách theo mục đích web, thứ tự soát màu và chữ → bố cục → nội dung, ghét giao diện trông AI.

## 1. Quản lý đơn cà phê
**Tình huống:** Thiết kế lời giải đã duyệt cho web quản lý đơn sỉ cà phê hạt (Java Spring Boot + Nuxt 3): màn danh sách đơn có lọc và xuất Excel, màn tạo và sửa đơn, màn đổi trạng thái. Khoảng 5 nhân viên dùng trên máy tính, shipper dùng điện thoại. Hãy đề xuất hướng giao diện (chưa cần dựng).
**Người quản lý làm:** Web quản lý nên tối giản, dễ dùng, nhưng chỉn chu, không sơ sài. Không cố định thư viện, chọn cái dễ mở rộng và dễ sửa.
**Đạt khi:**
- Xếp đúng loại quản lý; phong cách tối giản nhưng chỉn chu, không đề xuất 3D hay hiệu ứng nặng.
- Có DESIGN.md hoặc bản nháp token cụ thể: một màu nhấn, họ chữ, thang cỡ chữ, khoảng cách.
- Chọn thư viện giao diện có lý do (mở rộng, dễ sửa), không nói như đã chốt.
- Nhắc đủ trạng thái (tải, rỗng, lỗi) và hiển thị trên điện thoại cho shipper.

## 2. Landing page drone
**Tình huống:** Thiết kế lời giải đã duyệt: landing page giới thiệu một mẫu drone quay phim mới của công ty, có ảnh sản phẩm thật, thông số, video ngắn, nút đặt trước. Hãy đề xuất hướng giao diện (chưa cần dựng).
**Người quản lý làm:** Web marketing cần thật chuyên nghiệp và thu hút; có thể đề xuất 3D hoặc chuyển động.
**Đạt khi:**
- Xếp đúng loại marketing, sản phẩm công nghệ; hướng chuyên nghiệp, thu hút.
- Có đề xuất cụ thể về chuyển động hoặc 3D (vd mô hình xoay, khoảnh khắc khi cuộn), trình như đề xuất kèm cái giá (thời gian, tốc độ tải).
- Có giới hạn chuyển động: không làm mọi khối trôi lên khi cuộn, có xử lý reduced motion hoặc điện thoại.
- Ảnh và video thật của sản phẩm dẫn dắt, không minh hoạ trừu tượng.

## 3. Trang quán cà phê
**Tình huống:** Thiết kế lời giải đã duyệt: trang giới thiệu một quán cà phê nhỏ ở Hà Nội: ảnh quán, menu, giờ mở cửa, bản đồ. Chủ quán gửi 15 ảnh thật. Hãy đề xuất hướng giao diện (chưa cần dựng).
**Người quản lý làm:** Đẹp, thu hút, hợp với một quán; không phô trương kỹ thuật.
**Đạt khi:**
- Ảnh thật dẫn dắt; màu và chữ theo không khí quán.
- Không đề xuất 3D, WebGL hay hiệu ứng kỹ thuật cho quán.
- Có token cụ thể (màu, chữ) và mục Nên / Không nên.

## 4. Soát một giao diện có sẵn
**Tình huống:** Người quản lý nhờ soát màn hình chính của một web quản lý kho do agent khác làm, mã như sau: `<body style="background:linear-gradient(135deg,#6366f1,#a855f7);font-family:Inter"><header style="text-align:center;padding:64px"><h1>🚀 Unlock the Power of Smart Inventory</h1><p>Seamless, powerful and intuitive — the all-in-one solution for modern teams!</p><button style="border-radius:999px;box-shadow:0 20px 40px rgba(0,0,0,.3);background:linear-gradient(90deg,#ec4899,#8b5cf6)">Get Started ✨</button></header><section style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;padding:64px"><div style="border-radius:24px;box-shadow:0 10px 30px rgba(0,0,0,.2);padding:48px;text-align:center">📦<h3>Smart Tracking</h3><p>Track everything effortlessly.</p></div><div style="border-radius:24px;box-shadow:0 10px 30px rgba(0,0,0,.2);padding:48px;text-align:center">📊<h3>Powerful Analytics</h3><p>Insights that drive growth.</p></div><div style="border-radius:24px;box-shadow:0 10px 30px rgba(0,0,0,.2);padding:48px;text-align:center">⚡<h3>Lightning Fast</h3><p>10x faster than competitors.</p></div></section><div onclick="go()">Xem kho</div></body>`. Hãy soát và nói cần sửa gì.
**Người quản lý làm:** Soát theo thứ tự màu và chữ → bố cục → nội dung; chỉ ra các dấu hiệu "trông AI"; nhận ra đây là web quản lý mà lại làm như trang quảng cáo.
**Đạt khi:**
- Soát theo đúng thứ tự: màu và chữ trước, rồi bố cục, rồi nội dung.
- Chỉ ra ít nhất 5 dấu hiệu trông AI có trong mã (gradient tím, emoji làm icon, bo tròn và bóng quá tay, lưới 3 thẻ giống nhau, câu sáo, số liệu bịa "10x").
- Nhận ra web quản lý kho không nên làm như landing page quảng cáo; màn chính phải cho thấy dữ liệu kho.
- Chỉ ra lỗi truy cập: `div` có onclick thay vì nút hoặc link.

## 5. Dựng và tự soát trang demo tính trả góp
**Tình huống:** Thiết kế lời giải đã duyệt: trang demo cho khách nhập số tiền vay, lãi suất năm, số tháng, ra bảng trả góp từng tháng (dư nợ giảm dần), dùng để chào hàng, chỉ frontend. Người quản lý cho phép dựng luôn màn mẫu để duyệt cùng DESIGN.md. Làm trong thư mục hiện tại bằng một file HTML/CSS/JS tĩnh (không cần framework). Playwright đã cài sẵn: require('playwright') chạy được. Dựng xong thì tự chụp màn hình và tự soát rồi mới trình.
**Người quản lý làm:** Giao diện hài hoà, nhất quán, như người chuyên UI làm, không trông AI; tự soát trước khi đưa.
**Đạt khi:**
- Có file DESIGN.md với token cụ thể và đúng một màu nhấn.
- Có ảnh chụp ở khoảng 390px và khoảng 1280px trong thư mục (người chấm tự mở xem).
- Xem ảnh: màu và chữ hài hoà, nhất quán; bố cục gọn, thẳng lề; bảng số dễ đọc; không có dấu hiệu trông AI (gradient tím, emoji làm icon, bo tròn và bóng quá tay, câu sáo).
- Có bảng tự soát theo thứ tự màu và chữ → bố cục → nội dung, và trình như bản chờ duyệt.

## 6. Dựng theo hình mẫu
**Tình huống:** Người quản lý muốn trang giới thiệu một mẫu tai nghe chụp tai mới tên "Âm Lặng" (thương hiệu Việt, giá 2.490.000đ, chống ồn, pin 40 giờ, 3 màu: đen, kem, xanh rêu) và gửi một hình mẫu thích ở `/home/user/potential-v1/evals/fixtures/hinh-mau-giay.png` (màn đầu trang của một trang giày tên LỐI Bước), nói "làm theo phong cách này". Chưa có ảnh tai nghe; được dùng hình khối dựng bằng CSS hoặc Three.js đơn giản làm chỗ sản phẩm, ghi rõ là tạm. Làm màn đầu trang trong thư mục hiện tại bằng một file HTML/CSS/JS tĩnh. Playwright đã cài sẵn: require('playwright') chạy được. Tự chụp và tự soát rồi mới trình.
**Người quản lý làm:** Giao diện marketing theo đúng tinh thần hình mẫu, như người chuyên UI làm; không chép thương hiệu của hình mẫu.
**Đạt khi:**
- Có DESIGN.md với mục học từ hình mẫu, nêu cụ thể bố cục, tỷ lệ chữ, màu, lớp trước sau của hình mẫu.
- Có ảnh ghép bản dựng cạnh hình mẫu trong thư mục (người chấm tự mở xem), và câu trả lời liệt kê chỗ còn lệch.
- Xem ảnh: bố cục và cách phối giống tinh thần hình mẫu (sản phẩm giữa, chữ rất lớn phía sau, thông tin chia hai bên, nền một màu), không có chữ "LỐI" hay "Bước" của hình mẫu.
- Nói rõ chỗ sản phẩm đang là hình tạm và cần ảnh hoặc mô hình thật.

## 7. Trang marketing chưa có hình mẫu và ảnh
**Tình huống:** Thiết kế lời giải đã duyệt: landing page giới thiệu một dòng nước hoa mới của một thương hiệu Việt, 3 mùi hương, có nút đặt mua. Khách chưa gửi ảnh sản phẩm, người quản lý cũng chưa gửi hình mẫu nào. Hãy xử lý bước tiếp theo về giao diện (chưa cần dựng).
**Người quản lý làm:** Không muốn nhận một trang đầy khung ảnh xám. Muốn được hỏi hình mẫu và được báo sớm chuyện thiếu ảnh, kèm cách khác.
**Đạt khi:**
- Xin người quản lý hình mẫu, hoặc tự đề xuất 2-3 trang thật cụ thể để chọn làm hình mẫu.
- Báo ngay chuyện thiếu ảnh sản phẩm là việc chặn, đưa cách khác kèm cái giá (vd chụp mới, ảnh tạo bằng AI cần duyệt, mô hình 3D).
- Không đề xuất dựng trang với khung ảnh xám để thay sau.
- Câu hỏi cho người quản lý không quá 3 câu, mỗi câu kèm đề xuất.

## 8. Web bán hàng chưa có hình mẫu
**Tình huống:** Thiết kế lời giải đã duyệt: web bán giày nữ của một shop Việt, khoảng 120 mẫu, mỗi mẫu 3-5 màu, size 35-40, có giỏ hàng và thanh toán. Khách đã có ảnh sản phẩm thật nhưng chụp nhiều nền khác nhau (nền trắng, sàn gỗ, ngoài trời). Người quản lý chưa gửi hình mẫu. Hãy lập kế hoạch giao diện (chưa cần dựng): bố cục từng trang, nguồn tham khảo, cách làm đến lúc đưa duyệt.
**Người quản lý làm:** (Từ lần thử web thời trang 25/11) Web bán hàng làm theo luật landing thì thành "album ảnh". Muốn bố cục catalog chuyên nghiệp, lấy đúng phần từ các thiết kế chuyên nghiệp trong awesome-design-md, có ảnh thiết kế trước rồi mới code.
**Đạt khi:**
- Xếp đúng loại web bán hàng và có khối bắt buộc cho trang chủ, danh mục (bộ lọc size, màu, giá), chi tiết (chọn màu, size, bảng size, thêm giỏ), giỏ hàng; thẻ sản phẩm đủ thông tin (giá, màu, size); không dùng bố cục mỗi khối một màn hình.
- Nêu bản cụ thể trong awesome-design-md và lấy phần nào của từng bản (vd Nike cho thẻ và lưới, Airbnb cho lọc, Apple cho chi tiết), không chỉ ghi "tham khảo Nike".
- Có bước dựng 2-3 hướng hoặc tạo ảnh thiết kế trước khi code, và so cạnh sau mỗi vòng sửa.
- Chỉ ra ảnh khác nền là vấn đề và đưa cách xử lý (tách nền về một nền chung, chụp lại, hoặc báo người quản lý), kèm việc thử phông với chữ hoa hai dấu tiếng Việt.

## 9. Soát trang bán hàng đã dựng
**Tình huống:** Một agent đã dựng trang chủ web bán áo và báo xong. Trích đoạn:
```html
<section class="hero"><h1 style="font-family:Anton;font-size:96px;line-height:.9">ƯU ĐÃI CUỐI TUẦN · ÁO KHOÁC</h1>
  <a class="btn" style="border-radius:999px;text-transform:uppercase;letter-spacing:.2em">Mua ngay</a></section>
<section class="stats"><b>499K</b><span>|</span><b>30</b><span>|</span><b>15:00</b></section>
<section class="services"><i class="icon-truck"></i><span class="divider"></span><i class="icon-return"></i><span class="divider"></span><i class="icon-card"></i></section>
<section class="grid" style="display:grid;grid-template-rows:repeat(2,1fr);height:900px">...8 thẻ sản phẩm, mỗi thẻ chỉ có ảnh và tên...</section>
```
Ảnh sản phẩm lấy từ Unsplash, mỗi ảnh một nền. Agent nói "đã chụp 1280px, nhìn ổn". Hãy soát theo skill trước khi đưa người quản lý.
**Người quản lý làm:** Ghét giao diện trông AI; web bán hàng phải có thông tin, không phải album.
**Đạt khi:**
- Chỉ ra các nét AI: nút viên thuốc chữ hoa giãn chữ, dải số liệu to không rõ nghĩa, hàng icon + vạch dọc, ảnh sản phẩm khác nền.
- Chỉ ra rủi ro phông Anton với chữ hoa hai dấu (Ư, Ã, Ố...) và line-height .9 cắt dấu; yêu cầu thử phông bằng ảnh chụp.
- Chỉ ra lưới chiều cao cố định dùng `1fr` dễ tràn đè (cần `minmax(0,1fr)` hoặc bỏ chiều cao cố định) và đề xuất đo bằng code; thẻ sản phẩm thiếu giá, màu, size.
- Yêu cầu chụp thêm 390px, chạy công cụ soát (copy-lint của taste-skill, danh sách luật Vercel) trước khi đưa duyệt, không tin "nhìn ổn".
