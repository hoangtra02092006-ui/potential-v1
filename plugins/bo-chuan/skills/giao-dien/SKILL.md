---
name: giao-dien
description: Làm giao diện web đẹp, hài hoà, trông như người thiết kế UI chuyên nghiệp làm, không trông như AI làm. Dùng sau khi thiết kế lời giải đã duyệt, khi dựng hoặc sửa màn hình, chọn màu, phông chữ, thư viện giao diện, hiệu ứng, hoặc khi người quản lý nói giao diện "trông AI", "phèn", "chưa chỉn chu". Gồm chọn phong cách theo loại web (quản lý, bán hàng, marketing, nơi chốn), viết DESIGN.md, lấy hình mẫu rồi dựng theo hình mẫu, tự chụp màn hình soát rồi mới đưa duyệt.
---

# Giao diện

Người quản lý ghét nhất giao diện "trông AI": không tự nhiên, nhìn tức mắt, muốn xoá đi làm lại dù nội dung đúng. Mục tiêu là giao diện như người chuyên UI làm: hài hoà, nhất quán, có chủ đích.

## 1. Mục đích của web quyết định phong cách
Xác định web thuộc loại nào trước khi vẽ bất cứ thứ gì:

| Loại | Ví dụ | Phong cách |
|---|---|---|
| **Quản lý, công cụ nội bộ** | quản lý đơn, CRM, báo cáo | Tối giản, dễ dùng, nhưng **chỉn chu, không sơ sài**: căn lề thẳng, khoảng cách đều, bảng dễ đọc, trạng thái rõ. Ít hiệu ứng, nhanh. |
| **Bán hàng (thương mại điện tử)** | shop thời trang, giày, mỹ phẩm, đồ gia dụng | **Catalog trước, quảng cáo sau**: mỗi màn hình trả lời bán gì, giá bao nhiêu, còn size không, giao khi nào. Có khung khối bắt buộc riêng, xem `references/trang-ban-hang.md`. **Không** dùng luật landing "mỗi khối một màn hình". |
| **Giới thiệu, marketing sản phẩm** | landing page, trang giới thiệu công ty, sản phẩm | Thật chuyên nghiệp và **thu hút người xem**. Có thể đề xuất chuyển động, hiệu ứng tương tác hoặc 3D để hút mắt, nếu hợp với sản phẩm. |
| **Nơi chốn, cửa hàng** | quán cà phê, tiệm bánh, khách sạn nhỏ | Ảnh thật dẫn dắt, màu theo thương hiệu hoặc theo ngành. Không 3D, không hiệu ứng kỹ thuật. |

3D, WebGL, hiệu ứng nặng: hợp với sản phẩm công nghệ, phần mềm, thiết bị, game, sản phẩm thời trang cần xoay xem. Luôn là **đề xuất** để người quản lý chọn, kèm cái giá (thời gian làm, tốc độ tải trang).

Web marketing sản phẩm có những cách trình bày người quản lý thích, xem `references/trang-marketing.md` trước khi dựng. Luật này và luật của taste-skill (mỗi khối một màn hình, khoảng trống lớn, ít chữ) **chỉ dành cho landing**; áp vào web bán hàng thì web thành album ảnh. Web bán hàng chỉ dùng chúng cho ô chiến dịch đầu trang chủ.

## 2. Viết DESIGN.md trước khi dựng
Mỗi dự án có một file `DESIGN.md` ở gốc, agent nào làm giao diện cũng đọc. Mẫu ở `references/mau-design-md.md`. Cách làm:
1. Chọn 1-2 trang tham chiếu hợp loại web theo bảng `references/chon-hinh-mau.md`: loại web nào lấy bản nào trong awesome-design-md (github.com/voltagent/awesome-design-md, khoảng 80 bản phân tích trang thật) và **lấy phần nào** của bản đó (vd bán hàng: thẻ và lưới của Nike, thẻ và bộ lọc của Airbnb, trang chi tiết của Apple). **Học cách phối, không sao chép thương hiệu.**
2. Viết token: màu (nền, chữ, viền, **một** màu nhấn, màu trạng thái), phông chữ (1-2 họ), cỡ chữ theo thang, khoảng cách theo thang (vd 4/8/12/16/24/32/48), bo góc, bóng, chuyển động. Bản nháp trình người quản lý cũng phải đủ các mục này, kể cả mục Nên / Không nên, không chỉ ghi "xem file".
3. Viết mục **Nên / Không nên** riêng cho dự án.
4. Đây là quyết định về thẩm mỹ, **người quản lý duyệt**. Trình DESIGN.md kèm một màn hình mẫu đã dựng và ảnh chụp, không trình mỗi bảng màu suông.

Sau khi duyệt: mọi màn hình chỉ dùng token trong DESIGN.md, không đặt màu, cỡ chữ, khoảng cách lẻ.

## 3. Hình mẫu trước, code sau
Tự nghĩ giao diện từ chữ mô tả dễ ra kiểu "đúng nhưng nhạt". Với web marketing và màn hình quan trọng nhất của mọi web, dựng theo hình mẫu:
1. **Có 1-3 hình mẫu.** Người quản lý gửi (Pinterest, Dribbble, Behance, trang thật) thì dùng. Chưa có thì **hỏi người quản lý có hình mẫu không** (một trong tối đa 3 câu hỏi), và đề xuất luôn: **dựng thật 2-3 hướng**, mỗi hướng ghi rõ học từ trang thật nào (tên trang, bản trong awesome-design-md theo `references/chon-hinh-mau.md`), chụp ảnh để người quản lý chọn bằng mắt, không gửi 3 đường link suông.
2. **Ảnh thiết kế trước khi code (bắt buộc với màn hình chính).** Từ hình mẫu hoặc hướng đã chọn, tạo ảnh thiết kế cho từng màn hình chính (trang chủ, danh mục, chi tiết; công cụ tạo ảnh hoặc dựng tĩnh), lưu `docs/thiet-ke-anh/`, rồi mới code theo ảnh (cách làm của image-to-code). Không code thẳng từ chữ mô tả.
3. **Đọc hình mẫu như người thiết kế**, ghi vào DESIGN.md mục "Học từ hình mẫu": lưới và vị trí từng khối, tỷ lệ cỡ chữ lớn nhất so với nhỏ nhất, kiểu chữ (đậm, hẹp, có chân), mã màu đo từ ảnh, khoảng trống, lớp trước sau (vật thể đè lên chữ hay nằm sau chữ), chỗ nào là điểm nhấn.
4. **Dựng lại bố cục và cách phối**, thay bằng thương hiệu, sản phẩm và nội dung của dự án. Không chép logo, tên, ảnh hay khẩu hiệu của hình mẫu.
5. **So cạnh nhau sau mỗi vòng sửa** (bắt buộc). Chụp bản dựng cùng khung hình với ảnh thiết kế hoặc hình mẫu, ghép hai ảnh cạnh nhau, liệt kê chỗ lệch (tỷ lệ, khoảng trống, độ đậm, màu, lớp), sửa. Tối đa 3 vòng; còn lệch thì ghi lại và hỏi người quản lý chỗ đó có cần giống không.

Hình mẫu là để học cách phối, không phải đích đến: chỗ nào hình mẫu sai với nghiệp vụ hoặc khó dùng trên điện thoại thì theo nghiệp vụ và ghi lý do.

## 4. Thư viện giao diện: chọn theo dự án
Không cố định thư viện. Chọn cái phủ được nhu cầu mở rộng sau này và dễ sửa theo phạm vi dự án, ghi lý do trong thiết kế. Dù dùng thư viện nào, giao diện đi theo token của DESIGN.md, không để giao diện trông như mẫu mặc định của thư viện.

## 5. Dựng
- **Component nhỏ, một việc.** Tách phần lấy dữ liệu khỏi phần hiển thị. Ghép component (slot, component con) thay vì một component nhận nhiều tuỳ chọn bật tắt. Mỗi biến thể rõ ràng là một component hoặc một giá trị `variant`, không phải tổ hợp nhiều prop true/false. Trạng thái dùng chung đặt ở composable hoặc provide/inject (Vue), React thì context.
- **Đủ trạng thái:** đang tải, rỗng (có hướng dẫn bước tiếp), lỗi (nói rõ lỗi gì, làm gì tiếp), thành công.
- **Đúng trên điện thoại và máy tính** ngay từ đầu, không "làm responsive sau".
- **Dùng được bằng bàn phím:** nút là `<button>`, link là `<a>`, ô nhập có nhãn, nút chỉ có icon có `aria-label`, có viền focus rõ.
- **Nội dung thật:** dùng dữ liệu và câu chữ giống thật (tên, số, độ dài thật) để lộ lỗi tràn chữ, không dùng lorem ipsum.
- **Chữ tiếng Việt cỡ lớn:** dấu trên (Ấ, Ổ) và dấu dưới (dấu nặng, Ị) dễ bị cắt hoặc lẫn vào hình. Đặt `line-height` đủ chỗ cho dấu, không để khung `overflow: hidden` cắt sát chữ, và soát từng dấu trên ảnh chụp ở mọi khổ màn.
- **Thử phông trước khi chọn:** gõ chữ hoa có hai dấu `Ố Ầ Ứ Ặ Ẫ Ở` ở cỡ tiêu đề lớn nhất, chụp ảnh xem. Nhiều phông hẹp đậm (vd Anton) vẽ sai hoặc chồng dấu ở chữ hoa hai dấu; gặp là loại, không vá bằng CSS.
- **Ảnh sản phẩm cùng một nền, cùng góc, cùng ánh sáng.** Ảnh stock khác nền trộn trong một lưới là thứ làm web bán hàng trông giả nhất. Không có ảnh thật thì tạo bộ ảnh đồng bộ (ghi rõ là ảnh minh hoạ) hoặc báo người quản lý. Mạng cloud chặn trang ảnh: xin mở `images.unsplash.com` và tải theo ID ảnh; trang tìm kiếm Unsplash vẫn bị chặn.
- **Lưới chiều cao cố định** dùng `minmax(0,1fr)` (không dùng `1fr` trần), nếu không ảnh hoặc chữ dài sẽ tràn đè khối dưới.
- **Số liệu** dùng định dạng theo ngôn ngữ (`Intl`), cột số căn phải, chữ số đều độ rộng.

## 6. Chống "giao diện AI"
Đọc `references/chong-giao-dien-ai.md` trước khi dựng và trước khi đưa duyệt. Những dấu hiệu nặng nhất: tím hoặc chàm mặc định, gradient khắp nơi, bo tròn và bóng đổ quá tay, lưới 3-4 thẻ giống hệt nhau ở mọi mục, emoji thay icon, câu chữ sáo rỗng, số liệu bịa.

## 7. Chuyển động
- **Quản lý:** chuyển động nhỏ và nhanh (150-250ms), chỉ để phản hồi thao tác: hover, nhấn nút, mở hộp thoại, đổi trạng thái.
- **Marketing:** phần đầu trang xuất hiện một lần khi tải; một hoặc hai khoảnh khắc ấn tượng có mục đích; hover và nhấn trên mọi thứ bấm được. Không làm mọi thẻ trôi lên khi cuộn, không parallax chữ, không chiếm quyền cuộn trang.
- Mỗi chuyển động có lý do. Không có lý do thì bỏ. Tôn trọng `prefers-reduced-motion`. Không dùng `transition: all`.

## 8. Tự xem và soát trước khi đưa duyệt
Agent phải tự nhìn giao diện, không đưa người quản lý xem bản chưa tự soát. Cách chụp ở `references/tu-soat-bang-trinh-duyet.md`.
1. Chụp mỗi màn hình ở **390px** (điện thoại) và **1280px** (máy tính), đủ các trạng thái chính.
2. Xem ảnh và soát **theo đúng thứ tự người quản lý nhìn**. Báo cáo soát (kể cả khi soát giao diện của agent khác) cũng xếp theo thứ tự này; lỗi nặng nhất nằm ở nhóm sau thì nêu trong một câu kết luận ở đầu, rồi vẫn đi lần lượt từ nhóm 1:
   1. **Màu sắc và phông chữ:** hài hoà, nhất quán giữa các màn, đúng DESIGN.md; dấu tiếng Việt đủ, không bị cắt.
   2. **Bố cục:** gọn gàng, có logic, lề thẳng, khoảng cách đều, thứ tự đọc tự nhiên.
   3. **Nội dung:** dễ nắm bắt, không rườm rà, không thiếu, người xem có hứng thú nhìn.
   4. Danh sách chống giao diện AI.
   5. Nếu có hình mẫu: ảnh ghép cạnh nhau, còn lệch chỗ nào.
3. Soát code theo `references/danh-sach-kiem-giao-dien.md` (truy cập, focus, form, chuyển động, chữ, ảnh, chạm), đi đủ từng luật, không chỉ lướt. Ghi lỗi dạng `file:dòng - lỗi`, sửa hết lỗi trước khi đưa duyệt.
4. **Chạy công cụ, không chỉ nhìn bằng mắt:**
   - Chạy script soát câu chữ `copy-lint.mjs` của taste-skill (repo leonxlnx/taste-skill) trên các file HTML hoặc component. Ghi kết quả, sửa hoặc giải thích từng cảnh báo.
   - **Đo khối tràn đè bằng code** trong trình duyệt (Playwright): với mỗi khối, so `getBoundingClientRect()` của con với cha và với khối kế tiếp; phần tử nào có `scrollHeight > clientHeight` mà không chủ đích cuộn là lỗi. Mắt dễ bỏ sót ở khổ màn không chụp.
5. Còn lỗi thì sửa và chụp lại. Lỗi lặp ở nhiều màn thì sửa ở token hoặc component chung.
6. Đưa duyệt kèm ảnh chụp (và ảnh ghép với hình mẫu nếu có) và bảng tự soát ngắn.

**Chưa đạt** khi: cẩu thả, khó nhìn, nội dung khó nắm, trình bày rườm rà hoặc thiếu, hoặc người xem không có hứng thú khi nhìn vào. Lỗi cuối là lỗi nặng.
